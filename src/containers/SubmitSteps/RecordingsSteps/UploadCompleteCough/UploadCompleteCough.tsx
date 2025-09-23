// UploadCompleteCough.tsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  PageWrapper,
  ContentWrapper,
  ControlsWrapper,
  Header,
  BackButton,
  HeaderTitle,
  Title,
  Subtitle,
  FileRow,
  Slider,
  TimeRow,
  PlayButton,
  ButtonsWrapper,
  RetakeButton,
  SubmitButton,
  Footer,
  ErrorLink,
} from "./styles";

import ArrowLeftIcon from "../../../../assets/icons/arrowLeft.svg";
import PlayIcon from "../../../../assets/icons/play.svg";
import PauseIcon from "../../../../assets/icons/pause.svg";
import i18n from "../../../../i18n";

const UploadCompleteCough: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isArabic = i18n.language === "ar";
  const { t } = useTranslation();

  const { audioFileUrl, filename = t("uploadComplete.filename"), nextPage, skipped } =
    (location.state as { audioFileUrl?: string; filename?: string; nextPage?: string; skipped?: boolean }) || {};

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // iOS/Safari: force <audio> to pick up the new blob and reset state whenever src changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Always reset on URL change
    try {
      audio.pause();
    } catch {}
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    // Important on iOS: explicitly (re)load the new blob URL
    if (audioFileUrl) {
      try {
        audio.load();
      } catch (e) {
        // no-op
      }
    }

    // Wire events after ensuring we loaded the new source
    const handleLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      } else {
        // Some blob URLs need a nudge for duration on WebKit
        const prev = audio.ontimeupdate;
        try {
          audio.currentTime = 1e101;
        } catch {}
        audio.ontimeupdate = () => {
          audio.ontimeupdate = prev || null;
          setDuration(audio.duration || 0);
          try {
            audio.currentTime = 0;
          } catch {}
        };
      }
      setCurrentTime(audio.currentTime || 0);
    };

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleError = () => {
      setErrMsg(audio.error?.message || "Cannot play audio.");
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    // If already ready, populate immediately
    if (audio.readyState >= 1) handleLoadedMetadata();

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [audioFileUrl]);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handlePlayPause = async () => {
    const audio = audioRef.current;

    // If user skipped, don’t show "no audio" error
    if ((!audio || !audioFileUrl) && !skipped) {
      setErrMsg(
        t(
          "uploadComplete.noAudio",
          "No audio attached. Go back and record/upload a file."
        )
      );
      return;
    }

    if (!audio || !audioFileUrl) return; // just exit silently if skipped

    try {
      if (audio.paused) {
        if (audio.readyState < 2) audio.load();
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (e) {
      console.error("Error playing audio:", e);
      setErrMsg("Playback failed. Tap again to allow sound on iOS.");
      setIsPlaying(false);
    }
  };


  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.currentTime = newTime;
      } catch {}
      setCurrentTime(newTime);
    }
  };

  const handleBack = () => navigate(-1);
  const handleRetake = () => navigate(-1);

  const handleSubmit = () => {
    if (!nextPage) {
      console.error("No nextPage provided in state");
      return;
    }
    const nextNextPage = getNextStep(nextPage);
    navigate(nextPage, { state: { nextPage: nextNextPage } });
  };

  const getNextStep = (currentPage: string) => {
    switch (currentPage) {
      case "/record-speech":
        return "/upload-complete";
      case "/record-breath":
        return "/upload-complete";
      default:
        return "/confirmation";
    }
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        {/* key forces a full remount when the blob URL changes (critical for iOS) */}
        <audio
          key={audioFileUrl || "no-src"}
          ref={audioRef}
          src={audioFileUrl || ""}
          preload="auto"
          playsInline
        />

        <ControlsWrapper>
          <Header>
            <BackButton onClick={handleBack} isArabic={isArabic}>
              <img
                src={ArrowLeftIcon}
                alt={t("uploadComplete.backAlt")}
                width={24}
                height={24}
                style={{ transform: isArabic ? "rotate(180deg)" : "none" }}
              />
            </BackButton>
            <HeaderTitle>{t("uploadComplete.title")}</HeaderTitle>
          </Header>

          <Title>{t("uploadComplete.subtitle")}</Title>
          <Subtitle>{t("uploadComplete.description")}</Subtitle>

          {!audioFileUrl && !skipped && (
            <Subtitle style={{ color: "#b00", fontWeight: 600 }}>
              {t("uploadComplete.noAudio")}
            </Subtitle>
          )}


          <FileRow>
  <span dir="ltr" style={{ unicodeBidi: "isolate" }}>{filename}</span>

            <span
              style={{ fontSize: "20px", cursor: "pointer", alignSelf: "center" }}
              onClick={handleBack}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleBack()}
              aria-label={t("uploadComplete.closeAria")}
            >
              ✕
            </span>
          </FileRow>

          <Slider
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            step="0.1"
            onChange={handleSeek}
            aria-label={t("uploadComplete.sliderAria")}
            disabled={!audioFileUrl || duration === 0}
          />

          <TimeRow>
            <span>{formatTime(currentTime)}</span>
            <span>- {formatTime(Math.max(duration - currentTime, 0))}</span>
          </TimeRow>

          {errMsg && (
            <div style={{ color: "#b00", marginTop: 8, fontWeight: 600 }}>
              {errMsg}
            </div>
          )}
        </ControlsWrapper>

        <PlayButton onClick={handlePlayPause} disabled={!audioFileUrl || duration === 0}>
          <img
            src={isPlaying ? PauseIcon : PlayIcon}
            alt={isPlaying ? t("uploadComplete.pause") : t("uploadComplete.play")}
            width="45"
            height="45"
            style={isPlaying ? {} : { marginLeft: "0.3rem" }}
          />
        </PlayButton>

        <ButtonsWrapper>
          <RetakeButton onClick={handleRetake}>{t("uploadComplete.retake")}</RetakeButton>
          <SubmitButton onClick={handleSubmit}>{t("uploadComplete.submit")}</SubmitButton>
        </ButtonsWrapper>

        <Footer>
          <ErrorLink
            href="https://docs.google.com/forms/d/e/1FAIpQLSdlBAA3drY6NydPkxKkMWTEZQhE9p5BSH5YSuaK18F_rObBFg/viewform"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("uploadComplete.report")}
          </ErrorLink>
        </Footer>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default UploadCompleteCough;