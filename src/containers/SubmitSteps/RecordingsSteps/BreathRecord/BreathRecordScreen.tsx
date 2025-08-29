// BreathRecordScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Assets
import keepDistance from "../../../../assets/images/keepDistance.png";
import mouthBreathDistance from "../../../../assets/images/mouthBreathDistance.png";
import BackIcon from "../../../../assets/icons/arrowLeft.svg";
import StartIcon from "../../../../assets/icons/start.svg";
import StopIcon from "../../../../assets/icons/stop.svg";
import UploadIcon from "../../../../assets/icons/upload.svg";
import i18n from "../../../../i18n";

import {
  ActionButtons,
  BackButton,
  ButtonLabel,
  ButtonRow,
  CircleButton,
  Container,
  Content,
  FooterLink,
  Header,
  HeaderText,
  HiddenFileInput,
  Image,
  InstructionText,
  StepCircle,
  StepWrapper,
  Timer,
  TimerBox,
  UploadButton,
  UploadText,
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  ModalText,
  ModalButton,
} from "./styles";
import { t } from "i18next";

/* ----------------- Minimum Duration Modal ----------------- */
const MinimumDurationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <ModalOverlay>
    <ModalContainer>
      <ModalTitle>{t("recordBreath.minimum_duration_title")}</ModalTitle>
      <ModalText>{t("recordBreath.minimum_duration_text")}</ModalText>
      <ModalButton onClick={onClose}>{t("recordBreath.minimum_duration_retry")}</ModalButton>
    </ModalContainer>
  </ModalOverlay>
);

/* ----------------- Pick a safe recorder mime ----------------- */
function getBestMime(): string | undefined {
  const candidates = [
    "audio/mp4",                 // Safari/iOS
    "audio/webm;codecs=opus",    // Chromium
    "audio/webm",
    "audio/ogg;codecs=opus"      // Firefox
  ];
  // @ts-ignore
  return window.MediaRecorder?.isTypeSupported
    ? candidates.find(m => (window as any).MediaRecorder.isTypeSupported(m))
    : undefined;
}

/* ----------------- Convert recorded blob → real WAV (mono, 44.1k, 16-bit) ----------------- */
async function blobToWav(
  blob: Blob,
  { sampleRate = 44100, channels = 1, bitsPerSample = 16 }: { sampleRate?: number; channels?: number; bitsPerSample?: number } = {}
): Promise<Blob> {
  const arrayBuf = await blob.arrayBuffer();
  const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
  const ctx = new AudioCtx();

  const audioBuf: AudioBuffer = await new Promise((res, rej) => {
    try { ctx.decodeAudioData(arrayBuf, res, rej); }
    catch { (ctx as AudioContext).decodeAudioData(arrayBuf).then(res, rej); }
  });

  const srcLen = audioBuf.length;
  const srcRate = audioBuf.sampleRate;

  // downmix to mono
  const mono = new Float32Array(srcLen);
  mono.set(audioBuf.getChannelData(0));
  for (let c = 1; c < audioBuf.numberOfChannels; c++) {
    const ch = audioBuf.getChannelData(c);
    for (let i = 0; i < srcLen; i++) mono[i] = (mono[i] + ch[i]) * 0.5;
  }

  // resample (nearest) to 44.1k
  const ratio = sampleRate / srcRate;
  const dstLen = Math.round(srcLen * ratio);
  const resampled = new Float32Array(dstLen);
  for (let i = 0; i < dstLen; i++) {
    resampled[i] = mono[Math.min(srcLen - 1, Math.round(i / ratio))];
  }

  // write WAV header + PCM16
  const bytesPerSample = bitsPerSample / 8;
  const dataSize = resampled.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (off: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };

  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * bytesPerSample, true);
  view.setUint16(32, channels * bytesPerSample, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);

  let off = 44;
  for (let i = 0; i < resampled.length; i++, off += 2) {
    const s = Math.max(-1, Math.min(1, resampled[i]));
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  ctx.close().catch(() => {});
  return new Blob([buffer], { type: "audio/wav" });
}

const BreathRecordScreen: React.FC = () => {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer driven by MediaRecorder timeslice
  const startMsRef = useRef<number | null>(null);
  const autoStopTimeoutRef = useRef<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [showTooShortModal, setShowTooShortModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioData, setAudioData] = useState<{ audioFileUrl: string; filename: string } | null>(null);

  useEffect(() => {
    return () => {
      if (autoStopTimeoutRef.current != null) clearTimeout(autoStopTimeoutRef.current);
      if (mediaRecorder?.stream) {
        try { mediaRecorder.stream.getTracks().forEach(tr => tr.stop()); } catch {}
      }
    };
  }, [mediaRecorder]);

  const handleBack = () => navigate(-1);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString();
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  /* ----------------- Record with MediaRecorder, update timer via ondataavailable ----------------- */
  const startRecording = async () => {
    try {
      if (autoStopTimeoutRef.current != null) { clearTimeout(autoStopTimeoutRef.current); autoStopTimeoutRef.current = null; }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getBestMime();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size) chunks.push(e.data);
        if (startMsRef.current != null) {
          const elapsed = Math.floor((Date.now() - startMsRef.current) / 1000);
          setRecordingTime(elapsed);
        }
      };

      recorder.onstop = async () => {
        try {
          const type = chunks[0]?.type || recorder.mimeType || "audio/mp4";
          const recordedBlob = new Blob(chunks, { type });
          const wavBlob = await blobToWav(recordedBlob, { sampleRate: 44100, channels: 1, bitsPerSample: 16 });
          const wavUrl = URL.createObjectURL(wavBlob);
          const filename = `breath_recording-${new Date().toISOString().replace(/[:.]/g, "-")}.wav`;
          setAudioData({ audioFileUrl: wavUrl, filename });
          // If you still want sessionStorage:
          // sessionStorage.setItem("breathAudio", wavUrl);
          // sessionStorage.setItem("breathFilename", filename);
        } catch (e) {
          console.error("WAV conversion failed:", e);
          setError(t("recordBreath.error") || "Could not convert recording to WAV.");
        }
      };

      recorder.start(250); // fire ondataavailable 4x/sec
      startMsRef.current = Date.now();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      setError(null);
      setAudioData(null);

      // Auto stop after 30s
      autoStopTimeoutRef.current = window.setTimeout(() => {
        stopRecording();
      }, 30000);
    } catch (err) {
      console.error("Microphone access error:", err);
      setError(t("recordBreath.microphoneAccessError") || "Microphone access denied.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    const elapsed = startMsRef.current != null
      ? Math.floor((Date.now() - startMsRef.current) / 1000)
      : recordingTime;

    startMsRef.current = null;
    setRecordingTime(elapsed);
    setIsRecording(false);

    if (autoStopTimeoutRef.current != null) { clearTimeout(autoStopTimeoutRef.current); autoStopTimeoutRef.current = null; }

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      try { mediaRecorder.stop(); } catch {}
      try { mediaRecorder.stream.getTracks().forEach(tr => tr.stop()); } catch {}
    }

    if (elapsed < 3) {
      setShowTooShortModal(true);
      setAudioData(null);
      return;
    }

    // sessionStorage.setItem("breathDuration", String(elapsed)); // optional
  };

  /* ----------------- Continue / Upload / Skip ----------------- */
  const handleContinue = () => {
    if (audioData) {
      setError(null);
      navigate("/upload-complete", {
        state: {
          ...audioData,
          nextPage: "/confirmation",
        },
      });
    } else {
      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        setError(t("recordBreath.error") || "Please record or upload an audio file first.");
      } else {
        const audioUrl = URL.createObjectURL(file);
        navigate("/upload-complete", {
          state: {
            audioFileUrl: audioUrl,
            filename: file.name,
            nextPage: "/confirmation",
          },
        });
      }
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const audioUrl = URL.createObjectURL(file);
    navigate("/upload-complete", {
      state: {
        audioFileUrl: audioUrl,
        filename: file.name,
        nextPage: "/confirmation",
      },
    });
  };

  return (
    <Container>
      <Content>
        <Header>
          <BackButton
            onClick={handleBack}
            aria-label={t("recordBreath.goBackAria")}
            isArabic={isArabic}
          >
            <img
              src={BackIcon}
              alt={t("recordBreath.goBackAlt")}
              width={24}
              height={24}
              style={{ transform: isArabic ? "rotate(180deg)" : "none" }}
            />
          </BackButton>
          <HeaderText dir="auto" style={{ textAlign: "center" }}>{t("recordBreath.title")}</HeaderText>
        </Header>

        <h3
          dir="auto"
          style={{
            fontFamily: "Source Open Sans, sans-serif",
            fontSize: "24px",
            textAlign: "center",
            fontWeight: 600,
            marginBottom: "1.5rem",
            color: "#000000",
            marginTop: "1.5rem",
          }}
        >
          {t("recordBreath.instructionsTitle")}
        </h3>

        <StepWrapper>
          <StepCircle>{isArabic ? "١" : "1"}</StepCircle>
          <InstructionText>
            {t("recordBreath.instruction1_part1")}{" "}
            <strong>{t("recordBreath.instruction1_bold1")}</strong>
            {t("recordBreath.instruction1_part2")}{" "}
            <strong>{t("recordBreath.instruction1_bold2")}</strong>
            {t("recordBreath.instruction1_part3")}
          </InstructionText>
        </StepWrapper>
        <Image src={keepDistance} alt={t("recordBreath.keepDistanceAlt")} />

        <StepWrapper>
          <StepCircle>{isArabic ? "٢" : "2"}</StepCircle>
          <InstructionText>
            {t("recordBreath.instruction2_part1")}
            <strong>{t("recordBreath.instruction2_bold")}</strong>
            {t("recordBreath.instruction2_part2")}
          </InstructionText>
        </StepWrapper>
        <Image src={mouthBreathDistance} alt={t("recordBreath.mouthBreathDistanceAlt")} />

        <StepWrapper>
          <StepCircle>{isArabic ? "٣" : "3"}</StepCircle>
          <InstructionText>
            {t("recordBreath.instruction3_part1")}{" "}
            <strong>{t("recordBreath.instruction3_bold1")}</strong>
            {t("recordBreath.instruction3_part2")}
            <strong>{t("recordBreath.instruction3_bold2")}</strong>
            {t("recordBreath.instruction3_part3")}
          </InstructionText>
        </StepWrapper>

        <Timer>
          <TimerBox>{formatTime(recordingTime)}</TimerBox>
        </Timer>

        <ButtonRow>
          <div style={{ textAlign: "center" }}>
            <CircleButton
              bg={isRecording ? "#dde9ff" : "#3578de"}
              aria-label={t("recordBreath.recordButton")}
              onClick={startRecording}
              disabled={isRecording}
              style={{ opacity: isRecording ? 0.6 : 1, cursor: isRecording ? "not-allowed" : "pointer", width: "56px", height: "56px" }}
            >
              <img src={StartIcon} alt={t("recordBreath.recordButton")} width={28} height={28} />
            </CircleButton>
            <ButtonLabel>{t("recordBreath.recordButton")}</ButtonLabel>
          </div>
          <div style={{ textAlign: "center" }}>
            <CircleButton
              bg={isRecording ? "#3578de" : "#DDE9FF"}
              aria-label={t("recordBreath.stopButton")}
              onClick={stopRecording}
              disabled={!isRecording}
              style={{ opacity: !isRecording ? 0.6 : 1, cursor: !isRecording ? "not-allowed" : "pointer", width: "56px", height: "56px" }}
            >
              <img src={StopIcon} alt={t("recordBreath.stopButton")} width={20} height={20} />
            </CircleButton>
            <ButtonLabel>{t("recordBreath.stopButton")}</ButtonLabel>
          </div>
        </ButtonRow>

        {error && (
          <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
            {error}
          </p>
        )}

        {/* Quick Skip for testing */}
        <button
          type="button"
          onClick={() => navigate("/upload-complete", { state: { nextPage: "/confirmation" } })}
          style={{ position: "absolute", top: "20px", right: "20px", backgroundColor: "#f0f0f0", border: "1px solid #ccc", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}
        >
          Skip
        </button>

        <ActionButtons>
          <button onClick={handleContinue}>
            {t("recordBreath.continueButton")}
          </button>
          <UploadButton
            onClick={triggerFileInput}
            aria-label={t("recordBreath.uploadFile")}
          >
            <img
              src={UploadIcon}
              alt={t("recordBreath.uploadFile")}
              width={22}
              height={22}
              style={{ marginBottom: "0.3rem", marginRight: "0.5rem" }}
            />
            <UploadText>{t("recordBreath.uploadFile")}</UploadText>
          </UploadButton>
          <HiddenFileInput
            type="file"
            accept="audio/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </ActionButtons>

        {showTooShortModal && (
          <MinimumDurationModal
            onClose={() => {
              setShowTooShortModal(false);
              startRecording();
            }}
          />
        )}

        <FooterLink
          href="https://docs.google.com/forms/d/e/1FAIpQLSdlBAA3drY6NydPkxKkMWTEZQhE9p5BSH5YSuaK18F_rObBFg/viewform"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("recordBreath.reportIssue")}
        </FooterLink>
      </Content>
    </Container>
  );
};

export default BreathRecordScreen;
