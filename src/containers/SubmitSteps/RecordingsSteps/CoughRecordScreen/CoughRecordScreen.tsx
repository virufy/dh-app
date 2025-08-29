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

/* ----------------- WAV helpers (16-bit PCM) ----------------- */
function floatTo16BitPCM(float32: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, float32[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

// Replace the old function with this:
function buildWavBlob(chunks: Float32Array[], sampleRate: number): Blob {
  const total = chunks.reduce((a, b) => a + b.length, 0);
  const mono = new Float32Array(total);
  let off = 0;
  for (const c of chunks) { mono.set(c, off); off += c.length; }

  const pcmBuffer = floatTo16BitPCM(mono); // ArrayBuffer with 16-bit PCM
  const wavBuffer = new ArrayBuffer(44 + pcmBuffer.byteLength);
  const wavView = new DataView(wavBuffer);

  // Write WAV header
  const numChannels = 1;
  const blockAlign = numChannels * 2;
  const byteRate = sampleRate * blockAlign;

  // "RIFF"
  wavView.setUint32(0, 0x46464952, false);
  // file size - 8
  wavView.setUint32(4, 36 + pcmBuffer.byteLength, true);
  // "WAVE"
  wavView.setUint32(8, 0x45564157, false);
  // "fmt "
  wavView.setUint32(12, 0x20746d66, false);
  wavView.setUint32(16, 16, true); // Subchunk1Size (16 = PCM)
  wavView.setUint16(20, 1, true);  // AudioFormat = PCM
  wavView.setUint16(22, numChannels, true);
  wavView.setUint32(24, sampleRate, true);
  wavView.setUint32(28, byteRate, true);
  wavView.setUint16(32, blockAlign, true);
  wavView.setUint16(34, 16, true); // bits per sample
  // "data"
  wavView.setUint32(36, 0x61746164, false);
  wavView.setUint32(40, pcmBuffer.byteLength, true);

  // Copy PCM right after the 44-byte header
  new Uint8Array(wavBuffer, 44).set(new Uint8Array(pcmBuffer));

  // ✅ Return a single buffer as the blob
  return new Blob([wavBuffer], { type: "audio/wav" });
}

const CoughRecordScreen: React.FC = () => {
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const workletOrProcessorRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pcmBuffersRef = useRef<Float32Array[]>([]);

  const [showTooShortModal, setShowTooShortModal] = useState(false);
  const [involuntary, setInvoluntary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioData, setAudioData] = useState<{ audioFileUrl: string; filename: string } | null>(null);

  useEffect(() => {
    return () => {
      // cleanup on unmount
      try { workletOrProcessorRef.current && (workletOrProcessorRef.current as any).disconnect?.(); } catch {}
      try { sourceRef.current && sourceRef.current.disconnect(); } catch {}
      try { streamRef.current?.getTracks().forEach(tr => tr.stop()); } catch {}
      try { audioCtxRef.current?.close(); } catch {}
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    };
  }, []);

  const handleBack = () => navigate(-1);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString();
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  /* ----------------- WAV recording (client-side) ----------------- */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setError(null);
      setAudioData(null);
      setIsRecording(true);
      setRecordingTime(0);
      pcmBuffersRef.current = [];

      const AudioContextCtor = (window.AudioContext || (window as any).webkitAudioContext);
      // Force 44.1kHz for standard WAV
      const ctx: AudioContext = new AudioContextCtor({ sampleRate: 44100 }) as AudioContext;
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;

      if ((ctx as any).audioWorklet) {
        // Build a tiny worklet at runtime that forwards mono Float32 frames
        const workletCode = `
          class PCMProcessor extends AudioWorkletProcessor {
            process(inputs) {
              const input = inputs[0];
              if (input && input[0]) this.port.postMessage(input[0]);
              return true;
            }
          }
          registerProcessor('pcm-processor', PCMProcessor);
        `;
        const blobUrl = URL.createObjectURL(new Blob([workletCode], { type: "application/javascript" }));
        await ctx.audioWorklet!.addModule(blobUrl);
        URL.revokeObjectURL(blobUrl);

        const node = new AudioWorkletNode(ctx, "pcm-processor", {
          numberOfInputs: 1,
          numberOfOutputs: 0,
          channelCount: 1
        });
        workletOrProcessorRef.current = node;
        node.port.onmessage = (e: MessageEvent) => {
          // Clone Float32Array so it doesn't get GC'd
          pcmBuffersRef.current.push(new Float32Array(e.data as Float32Array));
        };
        source.connect(node);
      } else {
        // Fallback: ScriptProcessor
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        workletOrProcessorRef.current = processor;
        processor.onaudioprocess = (ev: AudioProcessingEvent) => {
          const input = ev.inputBuffer.getChannelData(0);
          pcmBuffersRef.current.push(new Float32Array(input));
        };
        source.connect(processor);
        // Connect to destination to guarantee processing on some browsers
        processor.connect(ctx.destination);
      }

      // UI timer
      timerRef.current = setInterval(() => setRecordingTime((p) => p + 1), 1000);

      // Auto-stop after 30s
      setTimeout(() => { if (isRecording) stopRecording(); }, 30000);
    } catch (err) {
      console.error("Microphone access error:", err);
      setError(t("recordCough.microphoneAccessError") || "Microphone access denied.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    try {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      setIsRecording(false);

      // Stop input tracks (iOS important)
      try { streamRef.current?.getTracks().forEach(tr => tr.stop()); } catch {}
      streamRef.current = null;

      // Disconnect audio nodes
      try { workletOrProcessorRef.current && (workletOrProcessorRef.current as any).disconnect?.(); } catch {}
      workletOrProcessorRef.current = null;
      try { sourceRef.current && sourceRef.current.disconnect(); } catch {}
      sourceRef.current = null;

      const sr = audioCtxRef.current?.sampleRate || 44100;
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;

      if (recordingTime < 3) {
        setShowTooShortModal(true);
        pcmBuffersRef.current = [];
        setAudioData(null);
        return;
      }

      // Build WAV Blob
      const wavBlob = buildWavBlob(pcmBuffersRef.current, sr);
      pcmBuffersRef.current = [];
      const url = URL.createObjectURL(wavBlob);
      const filename = `cough_recording-${new Date().toISOString().replace(/[:.]/g, "-")}.wav`;
      setAudioData({ audioFileUrl: url, filename });
    } catch (e) {
      console.error(e);
      setError(t("recordCough.error") || "Something went wrong. Please try again.");
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

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const audioUrl = URL.createObjectURL(file);
    navigate("/upload-complete", {
      state: {
        audioFileUrl: audioUrl,
        filename: file.name,
        nextPage: "/record-speech",
      },
    });
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
              style={{
                opacity: isRecording ? 0.6 : 1,
                cursor: isRecording ? "not-allowed" : "pointer",
                width: "56px",
                height: "56px",
              }}
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
              style={{
                opacity: !isRecording ? 0.6 : 1,
                cursor: !isRecording ? "not-allowed" : "pointer",
                width: "56px",
                height: "56px",
              }}
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
          <Checkbox
            id="involuntary"
            type="checkbox"
            checked={involuntary}
            onChange={() => setInvoluntary(!involuntary)}
            style={{ cursor: "pointer" }}
          />
        </CheckboxRow>

        {error && (
          <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
            {error}
          </p>
        )}

        {/* Quick Skip for testing */}
        <button
          type="button"
          onClick={() => navigate("/upload-complete", { state: { nextPage: "/record-speech" } })}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Skip
        </button>

        <ActionButtons>
          <button onClick={handleContinue}>
            {t("recordCough.continueButton")}
          </button>

          <UploadButton onClick={triggerFileInput} aria-label={t("recordCough.uploadFile")}>
            <img
              src={UploadIcon}
              alt={t("recordCough.uploadFile")}
              width={22}
              height={22}
              style={{ marginBottom: "0.3rem", marginRight: "0.5rem" }}
            />
            <UploadText>{t("recordCough.uploadFile")}</UploadText>
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
              // restart recording immediately if they want to retry
              startRecording();
            }}
          />
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
