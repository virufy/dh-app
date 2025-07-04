import React from "react";
import { useNavigate } from "react-router-dom";

// Image assets
import keepDistance from "../../../../assets/images/keepDistance.png";
import mouthSpeechDistance from "../../../../assets/images/mouthSpeechDistance.png";
import BackIcon from "../../../../assets/icons/back-icon.png";

const SpeechRecordScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = (): void => {
    navigate(-1);
  };

  const handleContinue = (): void => {
    navigate("/upload-complete-speech");
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f8f8",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "2rem",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Back Button */}
        <button
          onClick={handleBack}
          style={{
            position: "absolute",
            left: "10px",
            top: "20px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          aria-label="Go back"
        >
          <img
            src={BackIcon}
            alt="Back"
            style={{ width: "25px", height: "35px" }}
          />
        </button>

        <h2 style={{ color: "#007bff", marginBottom: "1rem" }}>
          Record your cough
        </h2>

        <p style={{ marginBottom: "1rem" }}>
          <strong>1</strong>. Find a quiet place at least 20 ft (6m) away from
          others. If you are feeling ill, please sit down.
        </p>
        <img
          src={keepDistance}
          alt="Keep distance"
          style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
        />

        <p style={{ marginBottom: "1rem" }}>
          <strong>2</strong>. Hold the bottom of your device 1-2 ft (30-60 cm)
          away from your mouth.
          <br />
          <em>aaaah</em>
        </p>
        <img
          src={mouthSpeechDistance}
          alt="Device distance for speech"
          style={{ width: "100%", borderRadius: "8px", marginBottom: "1.5rem" }}
        />

        <p style={{ marginBottom: "2rem" }}>
          <strong>3</strong>. Tap record. Hold an “aaaaah” sound for at least 5
          seconds. Then tap stop.
        </p>

        <div
          style={{
            textAlign: "center",
            backgroundColor: "#f0f4ff",
            padding: "0.75rem",
            borderRadius: "8px",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "1.5rem",
          }}
        >
          0:00
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          <button
            style={{
              backgroundColor: "#e6f0ff",
              border: "none",
              borderRadius: "999px",
              padding: "1rem 1.5rem",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#007bff",
              cursor: "pointer",
            }}
          >
            Record
          </button>
          <button
            style={{
              backgroundColor: "#ffe6e6",
              border: "none",
              borderRadius: "999px",
              padding: "1rem 1.5rem",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#cc0000",
              cursor: "pointer",
            }}
          >
            Stop
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <button
            onClick={handleContinue}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "0.75rem",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Continue
          </button>
          <button
            style={{
              backgroundColor: "#e6f0ff",
              color: "#007bff",
              border: "1px solid #007bff",
              padding: "0.75rem",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Upload your own file
          </button>
        </div>

        <div
          style={{ textAlign: "center", fontSize: "0.85rem", color: "#999" }}
        >
          Something wrong?{" "}
          <a href="#" style={{ color: "#007bff" }}>
            Report an error
          </a>
        </div>
      </div>
    </div>
  );
};

export default SpeechRecordScreen;
