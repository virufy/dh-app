// CoughRecordScreen.tsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import keepDistance from "../../../../assets/images/keepDistance.png";
import mouthDistance from "../../../../assets/images/mouthDistance.png";
import BackIcon from "../../../../assets/icons/arrowLeft.svg";
import UploadIcon from "../../../../assets/icons/upload.svg";
import StartIcon from "../../../../assets/icons/start.svg";
import StopIcon from "../../../../assets/icons/stop.svg";
import i18n from "../../../../i18n";
import {
  Container,
  Content,
  Header,
  BackButton,
  HeaderText,
  StepCircle,
  StepWrapper,
  InstructionText,
  Image,
  Timer,
  TimerBox,
  ButtonRow,
  CircleButton,
  ButtonLabel,
  CheckboxRow,
  Label,
  Checkbox,
  ActionButtons,
  UploadButton,
  UploadText,
  HiddenFileInput,
  FooterLink,
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  ModalText,
  ModalButton
} from "./styles";
import { t } from "i18next";

/* ----------------- Minimum Duration Modal ----------------- */
const MinimumDurationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <ModalOverlay>
    <ModalContainer>
      <ModalTitle>{t("recordCough.minimum_duration_title")}</ModalTitle>
      <ModalText>{t("recordCough.minimum_duration_text")}</ModalText>
      <ModalButton onClick={onClose}>{t("recordCough.minimum_duration_retry")}</ModalButton>
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

  // quick resample (nearest) to 44.1k
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
  view.setUint32(16, 16, true);                // PCM
  view.setUint16(20, 1, true);                 // format = PCM
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

const CoughRecordScreen: React.FC = () => {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer via rAF to avoid Safari throttling
  const rafRef = useRef<number | null>(null);
  const autoStopTimeoutRef = useRef<number | null>(null);
  const startPerfRef = useRef<number | null>(null);
  const lastShownSecRef = useRef<number>(0);

  const [showTooShortModal, setShowTooShortModal] = useState(false);
  const [involuntary, setInvoluntary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioData, setAudioData] = useState<{ audioFileUrl: string; filename: string } | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
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

  // rAF tick driving the timer
  const tick = () => {
    if (startPerfRef.current == null) return;
    const elapsedSec = Math.floor((performance.now() - startPerfRef.current) / 1000);
    if (elapsedSec !== lastShownSecRef.current) {
      lastShownSecRef.current = elapsedSec;
      setRecordingTime(elapsedSec);
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  /* ----------------- Record with MediaRecorder, then convert to WAV ----------------- */
  const startRecording = async () => {
    try {
      // clear old timers
      if (rafRef.current != null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      if (autoStopTimeoutRef.current != null) { clearTimeout(autoStopTimeoutRef.current); autoStopTimeoutRef.current = null; }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getBestMime();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };

      recorder.onstop = async () => {
        try {
          const type = chunks[0]?.type || recorder.mimeType || "audio/mp4";
          const recordedBlob = new Blob(chunks, { type });
          const wavBlob = await blobToWav(recordedBlob, { sampleRate: 44100, channels: 1, bitsPerSample: 16 });
          const wavUrl = URL.createObjectURL(wavBlob);
          const filename = `cough_recording-${new Date().toISOString().replace(/[:.]/g, "-")}.wav`;
          setAudioData({ audioFileUrl: wavUrl, filename });
        } catch (e) {
          console.error("WAV conversion failed:", e);
          setError(t("recordCough.error") || "Could not convert recording to WAV.");
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      // start timer
      startPerfRef.current = performance.now();
      lastShownSecRef.current = 0;
      setRecordingTime(0);
      rafRef.current = requestAnimationFrame(tick);

      // Auto stop after 30s
      autoStopTimeoutRef.current = window.setTimeout(() => {
        stopRecording(); // do not rely on captured state
      }, 30000);

      setError(null);
      setAudioData(null);
    } catch (err) {
      console.error("Microphone access error:", err);
      setError(t("recordCough.microphoneAccessError") || "Microphone access denied.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    // compute final elapsed
    const elapsed = startPerfRef.current != null
      ? Math.floor((performance.now() - startPerfRef.current) / 1000)
      : recordingTime;

    // stop timer
    if (rafRef.current != null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (autoStopTimeoutRef.current != null) { clearTimeout(autoStopTimeoutRef.current); autoStopTimeoutRef.current = null; }
    startPerfRef.current = null;
    setRecordingTime(elapsed);
    setIsRecording(false);

    // stop recorder + tracks
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      try { mediaRecorder.stop(); } catch {}
      try { mediaRecorder.stream.getTracks().forEach(tr => tr.stop()); } catch {}
    }

    if (elapsed < 3) {
      setShowTooShortModal(true);
      setAudioData(null);
      return;
    }
  };

  /* ----------------- Continue / Upload / Skip ----------------- */
  const handleContinue = () => {
    if (audioData) {
      setError(null);
      navigate("/upload-complete", {
        state: {
          ...audioData,          // { audioFileUrl: blob:..., filename: *.wav }
          nextPage: "/record-speech",
        },
      });
    } else {
      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        setError(t("recordCough.error") || "Please record or upload an audio file first.");
      } else {
        const audioUrl = URL.createObjectURL(file);
        navigate("/upload-complete", {
          state: {
            audioFileUrl: audioUrl,
            filename: file.name,
            nextPage: "/record-speech",
          },
        });
      }
    }
  };

  return (
    <Container>
      <Content>
        <Header>
          <BackButton
            onClick={handleBack}
            aria-label={t("recordCough.goBackAria")}
            isArabic={isArabic}
          >
            <img
              src={BackIcon}
              alt={t("recordCough.goBackAlt")}
              width={24}
              height={24}
              style={{ transform: isArabic ? "rotate(180deg)" : "none" }}
            />
          </BackButton>
          <HeaderText>{t("recordCough.title")}</HeaderText>
        </Header>

        <h3
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
          {t("recordCough.instructionsTitle")}
        </h3>

        <StepWrapper>
          <StepCircle>{isArabic ? "١" : "1"}</StepCircle>
          <InstructionText>
            {t("recordCough.instruction1_part1")}{" "}
            <strong>{t("recordCough.instruction1_bold1")}</strong>
            {t("recordCough.instruction1_part2")}{" "}
            <strong>{t("recordCough.instruction1_bold2")}</strong>
            {t("recordCough.instruction1_part3")}
          </InstructionText>
        </StepWrapper>
        <Image src={keepDistance} alt={t("recordCough.keepDistanceAlt")} />

        <StepWrapper>
          <StepCircle>{isArabic ? "٢" : "2"}</StepCircle>
          <InstructionText>
            {t("recordCough.instruction2_part1")}
            <strong>{t("recordCough.instruction2_bold")}</strong>
            {t("recordCough.instruction2_part2")}
          </InstructionText>
        </StepWrapper>
        <Image src={mouthDistance} alt={t("recordCough.mouthDistanceAlt")} />

        <StepWrapper>
          <StepCircle>{isArabic ? "٣" : "3"}</StepCircle>
          <InstructionText>
            {t("recordCough.instruction3_part1")}{" "}
            <strong>{t("recordCough.instruction3_bold1")}</strong>
            {t("recordCough.instruction3_part2")}
            <strong>{t("recordCough.instruction3_bold2")}</strong>
            {t("recordCough.instruction3_part3")}
          </InstructionText>
        </StepWrapper>

        <Timer>
          <TimerBox>{formatTime(recordingTime)}</TimerBox>
        </Timer>

        <ButtonRow>
          <div style={{ textAlign: "center" }}>
            <CircleButton
              bg={isRecording ? "#dde9ff" : "#3578de"}
              aria-label={t("recordCough.recordButton")}
              onClick={startRecording}
              disabled={isRecording}
              style={{ opacity: isRecording ? 0.6 : 1, cursor: isRecording ? "not-allowed" : "pointer", width: "56px", height: "56px" }}
            >
              <img src={StartIcon} alt={t("recordCough.recordButton")} width={28} height={28} />
            </CircleButton>
            <ButtonLabel>{t("recordCough.recordButton")}</ButtonLabel>
          </div>
          <div style={{ textAlign: "center" }}>
            <CircleButton
              bg={isRecording ? "#3578de" : "#DDE9FF"}
              aria-label={t("recordCough.stopButton")}
              onClick={stopRecording}
              disabled={!isRecording}
              style={{ opacity: !isRecording ? 0.6 : 1, cursor: !isRecording ? "not-allowed" : "pointer", width: "56px", height: "56px" }}
            >
              <img src={StopIcon} alt={t("recordCough.stopButton")} width={20} height={20} />
            </CircleButton>
            <ButtonLabel>{t("recordCough.stopButton")}</ButtonLabel>
          </div>
        </ButtonRow>

        <CheckboxRow>
          <Label htmlFor="involuntary" style={{ userSelect: "none" }}>
            {t("recordCough.checkboxLabel")}
          </Label>
          <Checkbox id="involuntary" type="checkbox" checked={involuntary} onChange={() => setInvoluntary(!involuntary)} style={{ cursor: "pointer" }} />
        </CheckboxRow>

        {error && (<p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>{error}</p>)}

        {/* Quick Skip for testing */}
        <button
          type="button"
          onClick={() => navigate("/upload-complete", { state: { nextPage: "/record-speech" } })}
          style={{ position: "absolute", top: "20px", right: "20px", backgroundColor: "#f0f0f0", border: "1px solid #ccc", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}
        >
          Skip
        </button>

        <ActionButtons>
          <button onClick={handleContinue}>{t("recordCough.continueButton")}</button>
          <UploadButton onClick={() => fileInputRef.current?.click()} aria-label={t("recordCough.uploadFile")}>
            <img src={UploadIcon} alt={t("recordCough.uploadFile")} width={22} height={22} style={{ marginBottom: "0.3rem", marginRight: "0.5rem" }} />
            <UploadText>{t("recordCough.uploadFile")}</UploadText>
          </UploadButton>
          <HiddenFileInput type="file" accept="audio/*" ref={fileInputRef} onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const audioUrl = URL.createObjectURL(file);
            navigate("/upload-complete", { state: { audioFileUrl: audioUrl, filename: file.name, nextPage: "/record-speech" } });
          }}/>
        </ActionButtons>

        {showTooShortModal && (
          <MinimumDurationModal onClose={() => {
            setShowTooShortModal(false);
            startRecording();
          }}/>
        )}

        <FooterLink
          href="https://docs.google.com/forms/d/e/1FAIpQLSdlBAA3drY6NydPkxKkMWTEZQhE9p5BSH5YSuaK18F_rObBFg/viewform"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("recordCough.reportIssue")}
        </FooterLink>
      </Content>
    </Container>
  );
};

export default CoughRecordScreen;
