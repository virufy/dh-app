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
import RecorderService from "../../../../components/MicRecorder/RecorderService";




const MinimumDurationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <ModalOverlay>
      <ModalContainer>
        <ModalTitle>{t("recordCough.minimum_duration_title")}</ModalTitle>
        <ModalText>{t("recordCough.minimum_duration_text")}</ModalText>
        <ModalButton onClick={onClose}>{t("recordCough.minimum_duration_retry")}</ModalButton>
      </ModalContainer>
    </ModalOverlay>
);
const CoughRecordScreen: React.FC = () => {
  
  const { t } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showTooShortModal, setShowTooShortModal] = useState(false);
  const [involuntary, setInvoluntary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioData, setAudioData] = useState<{
    audioFileUrl: string;
    filename: string;
  } | null>(null);

  useEffect(() => {
    const storedAudio = sessionStorage.getItem("coughAudio");
    const storedFilename = sessionStorage.getItem("coughFilename");
    const storedDuration = sessionStorage.getItem("coughDuration");

    if (storedAudio && storedFilename && storedDuration) {
      setAudioData({ audioFileUrl: storedAudio, filename: storedFilename });
      setRecordingTime(parseInt(storedDuration, 10));
    }
  }, []);

  const handleBack = () => navigate(-1);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString();
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

const startRecording = async () => {
  try {
    await RecorderService.startRecording(setRecordingTime);
    setIsRecording(true);
    setAudioData(null);
    setError(null);

    // Auto-stop after 30s
    setTimeout(() => {
      if (RecorderService.isRecording()) stopRecording();
    }, 30000);
  } catch (err) {
    console.error(err);
    setError(t("recordCough.microphoneAccessError") || "Microphone access denied.");
  }
};

const stopRecording = () => {
  const data = RecorderService.stopRecording();
  setIsRecording(false);

  if (!data || data.duration < 3) {
    setShowTooShortModal(true);
    setAudioData(null);
    return;
  }

  setAudioData({ audioFileUrl: data.audioFileUrl, filename: data.filename });
  sessionStorage.setItem("coughAudio", data.audioFileUrl);
  sessionStorage.setItem("coughFilename", data.filename);
  sessionStorage.setItem("coughDuration", data.duration.toString());
};

  const handleContinue = () => {
    if (audioData) {
      setError(null);
      navigate("/upload-complete", {
        state: {
          ...audioData,
          nextPage: "/record-speech", // Go to Speech after upload
        },
      });
    } else {
      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        setError(
          t("recordCough.error") ||
            "Please record or upload an audio file first."
        );
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

  /** Updated handleFileChange */
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
            fontWeight: "600",
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
          <InstructionText >
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
                width:'56px',
                height:'56px'
              }}
            >
              <img
                src={StartIcon}
                alt={t("recordCough.recordButton")}
                width={28}
                height={28}
              />
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
                width:'56px',
                height:'56px'
              }}
            >
              <img
                src={StopIcon}
                alt={t("recordCough.stopButton")}
                width={20}
                height={20}
              />
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
        <button
            type="button"
            onClick={() => navigate('/upload-complete', { state: { nextPage: '/record-speech' } })}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Skip
        </button>


        <ActionButtons>
          <button onClick={handleContinue}>
            {t("recordCough.continueButton")}
          </button>
          <UploadButton
            onClick={triggerFileInput}
            aria-label={t("recordCough.uploadFile")}
          >
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
