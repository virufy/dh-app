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

/* ----------------- Encode Float32 → PCM WAV (same as cough) ----------------- */
function encodeWav(samples: Float32Array, sampleRate = 44100): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeStr = (off: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i));
  };

  // WAV header
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeStr(36, "data");
  view.setUint32(40, samples.length * 2, true);

  // PCM samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([view], { type: "audio/wav" });
}

const BreathRecordScreen: React.FC = () => {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // EXACT same scheme as cough: AudioContext + ScriptProcessor + Float32 chunks
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const chunksRef = useRef<Float32Array[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [showTooShortModal, setShowTooShortModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioData, setAudioData] = useState<{ audioFileUrl: string; filename: string } | null>(null);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = () => navigate(-1);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString();
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  /* ----------------- Start Recording (lossless, like cough) ----------------- */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext({ sampleRate: 44100 });
      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);

      chunksRef.current = [];
      source.connect(processor);
      processor.connect(ctx.destination);

      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        // copy so we don't keep a reference to the same buffer
        chunksRef.current.push(new Float32Array(input));
      };

      audioCtxRef.current = ctx;
      processorRef.current = processor;

      setIsRecording(true);
      setRecordingTime(0);
      setError(null);
      setAudioData(null);

      // timer
      startTimeRef.current = Date.now();
      timerRef.current = window.setInterval(() => {
        if (startTimeRef.current != null) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setRecordingTime(elapsed);
        }
      }, 1000);

      // auto stop after 30s
      setTimeout(() => stopRecording(), 30000);
    } catch (err) {
      console.error("Microphone access error:", err);
      setError(t("recordBreath.microphoneAccessError") || "Microphone access denied.");
      setIsRecording(false);
    }
  };

  /* ----------------- Stop Recording (same flow as cough) ----------------- */
  const stopRecording = () => {
    if (!isRecording) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const ctx = audioCtxRef.current;
    const processor = processorRef.current;
    if (processor) {
      try { processor.disconnect(); } catch {}
    }
    if (ctx) {
      try { ctx.close(); } catch {}
    }

    // flatten chunks → single Float32Array
    const flat = chunksRef.current.length
      ? new Float32Array(chunksRef.current.reduce((acc, cur) => acc + cur.length, 0))
      : null;

    if (flat) {
      let offset = 0;
      for (const chunk of chunksRef.current) {
        flat.set(chunk, offset);
        offset += chunk.length;
      }

      const wavBlob = encodeWav(flat, 44100);
      const wavUrl = URL.createObjectURL(wavBlob);
      const filename = `breath_recording-${new Date().toISOString().replace(/[:.]/g, "-")}.wav`;

      if (recordingTime < 3) {
        setShowTooShortModal(true);
        setAudioData(null);
      } else {
        setAudioData({ audioFileUrl: wavUrl, filename });
      }
    }

    setIsRecording(false);
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
