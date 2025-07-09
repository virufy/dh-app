import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import keepDistance from "../../../../assets/images/keepDistance.png";
import mouthDistance from "../../../../assets/images/mouthDistance.png";
import BackIcon from "../../../../assets/icons/arrowLeft.svg";
import UploadIcon from "../../../../assets/icons/upload.svg";
import StartIcon from "../../../../assets/icons/start.svg";
import StopIcon from "../../../../assets/icons/stop.svg";

// ✅ Import styled components
import {
  ActionButtons,
  UploadButton,
  UploadText,
  HiddenFileInput,
} from "./styles"; // adjust path as needed

const CoughRecordScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [involuntary, setInvoluntary] = useState(false);

  const handleBack = () => navigate(-1);

  const handleContinue = () => {
    navigate("/upload-complete", {
      state: {
        audioFileUrl: "",
        filename: t("recordCough.defaultFilename"),
        nextPage: "/record-speech",
      },
    });
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      navigate("/upload-complete", {
        state: {
          audioFileUrl: audioUrl,
          filename: file.name,
          nextPage: "/record-speech",
        },
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "1.5rem 1rem",
        fontFamily: "Source Sans Pro, sans-serif",
        fontSize: "14px",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "transparent",
      }}
    >
      <div style={{ maxWidth: "1000px", width: "100%", position: "relative" }}>
        {/* Header */}
        <div
          style={{
            position: "relative",
            marginTop: "1.25rem",
            marginBottom: "1.75rem",
          }}
        >
          <button
            onClick={handleBack}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            aria-label={t("recordCough.goBackAria")}
          >
            <img
              src={BackIcon}
              alt={t("recordCough.goBackAlt")}
              width={24}
              height={24}
            />
          </button>
          <div
            style={{
              textAlign: "center",
              fontWeight: 600,
              fontSize: "18px",
              color: "#3578de",
              fontFamily: "Source Sans Pro, sans-serif",
            }}
          >
            {t("recordCough.title")}
          </div>
        </div>

        {/* Instructions Title */}
        <h3
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "2rem",
            fontSize: "32px",
            color: "#393939",
          }}
        >
          {t("recordCough.instructionsTitle")}
        </h3>

        {/* Step 1 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              minWidth: "28px",
              height: "28px",
              backgroundColor: "#DDE9FF",
              borderRadius: "50%",
              textAlign: "center",
              lineHeight: "28px",
              fontWeight: "bold",
              color: "#3578de",
              fontSize: "20px",
            }}
          >
            1
          </div>
          <div style={{ flex: 1, fontSize: "20px" }}>
            {t("recordCough.instruction1")}
          </div>
        </div>
        <img
          src={keepDistance}
          alt={t("recordCough.keepDistanceAlt")}
          style={{ width: "100%", marginBottom: "1.5rem" }}
        />

        {/* Step 2 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              minWidth: "28px",
              height: "28px",
              backgroundColor: "#DDE9FF",
              borderRadius: "50%",
              textAlign: "center",
              lineHeight: "28px",
              fontWeight: "bold",
              color: "#3578de",
              fontSize: "20px",
            }}
          >
            2
          </div>
          <div style={{ flex: 1, fontSize: "20px" }}>
            {t("recordCough.instruction2")}
          </div>
        </div>
        <img
          src={mouthDistance}
          alt={t("recordCough.mouthDistanceAlt")}
          style={{ width: "100%", marginBottom: "1.5rem" }}
        />

        {/* Step 3 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              minWidth: "28px",
              height: "28px",
              backgroundColor: "#DDE9FF",
              borderRadius: "50%",
              textAlign: "center",
              lineHeight: "28px",
              fontWeight: "bold",
              color: "#3578de",
              fontSize: "20px",
            }}
          >
            3
          </div>
          <div style={{ flex: 1, fontSize: "20px" }}>
            {t("recordCough.instruction3")}
          </div>
        </div>

        {/* Timer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1.75rem",
          }}
        >
          <div
            style={{
              border: "1px solid #3578de",
              color: "#3578de",
              padding: "0.6rem 1.5rem",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            0:00
          </div>
        </div>

        {/* Record & Stop Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            marginBottom: "2.5rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <button
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#3578de",
                border: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              aria-label={t("recordCough.recordButton")}
            >
              <img src={StartIcon} alt={t("recordCough.recordButton")} width={28} height={28} />
            </button>
            <div style={{ fontSize: "18px", marginTop: "0.5rem", color: "#666" }}>
              {t("recordCough.recordButton")}
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "#DDE9FF",
                border: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              aria-label={t("recordCough.stopButton")}
            >
              <img src={StopIcon} alt={t("recordCough.stopButton")} width={20} height={20} />
            </button>
            <div style={{ fontSize: "18px", marginTop: "0.5rem", color: "#666" }}>
              {t("recordCough.stopButton")}
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            fontSize: "16px",
          }}
        >
          <input
            type="checkbox"
            id="involuntary"
            checked={involuntary}
            onChange={() => setInvoluntary(!involuntary)}
            style={{ cursor: "pointer" }}
          />
          <label htmlFor="involuntary" style={{ userSelect: "none" }}>
            {t("recordCough.checkboxLabel")}
          </label>
        </div>

        {/* ✅ Action Buttons */}
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

        {/* Footer link */}
        <div style={{ textAlign: "center" }}>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScYsWESIcn1uyEzFQT464qLSYZuUduHzThgTRPJODTQcCwz5w/viewform"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "0.8rem",
              fontWeight: "bold",
              color: "#3578de",
              textDecoration: "underline",
            }}
          >
            {t("recordCough.reportIssue")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default CoughRecordScreen;
