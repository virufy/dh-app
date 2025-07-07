import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowLeftIcon from '../../../../assets/icons/arrowLeft.svg';
import PlayIcon from '../../../../assets/icons/play.svg';
import PauseIcon from '../../../../assets/icons/pause.svg';

const UploadCompleteCough: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    //Pull data from router state
    const { audioFileUrl, filename = 'Filename.flac' } = location.state || {};

    // If someone accesses this page without state (e.g., directly), redirect to record
    useEffect(() => {
        // if (!audioFileUrl) {
        //     navigate('/record-coughs');
        // }
    }, [audioFileUrl, navigate]);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleLoadedMetadata = () => setDuration(audio.duration);
            const handleTimeUpdate = () => setCurrentTime(audio.currentTime);

            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('timeupdate', handleTimeUpdate);

            return () => {
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('timeupdate', handleTimeUpdate);
            };
        }
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }

        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleBack = () => navigate(-1);
    const handleRetake = () => navigate('/record-coughs');
    const handleSubmit = () => navigate('/confirmation');

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '2rem 1rem',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: "transparent"
        }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>
                <audio ref={audioRef} src={audioFileUrl || ''} preload="auto" />

                {/* Header */}
                <div style={{ position: 'relative', marginBottom: '2rem' }}>
                    <button onClick={handleBack} style={{
                        background: 'none',
                        border: 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        padding: 0,
                        cursor: 'pointer'
                    }}>
                        <img src={ArrowLeftIcon} alt="Back" style={{ width: 24, height: 24 }} />
                    </button>
                    <div style={{
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#3578de'
                    }}>
                        Confirm Recording
                    </div>
                </div>

                {/* Titles */}
                <h2 style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#333',
                    textAlign: 'center',
                    marginBottom: '0.75rem',
                    marginTop: '3rem'
                }}>
                    Upload Complete
                </h2>

                <p style={{
                    alignSelf: 'flex-start',
                    fontSize: '18px',
                    marginBottom: '1rem',
                    fontWeight: 'bold',
                    color: '#393939'
                }}>
                    Confirm audio recording
                </p>

                {/* Filename + close */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem'
                }}>
                    <span style={{ fontSize: '14px', color: '#000' }}>{filename}</span>
                    <span style={{ fontSize: '20px', cursor: 'pointer' }}>✕</span>
                </div>

                {/* Progress */}
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    step="0.1"
                    onChange={handleSeek}
                    style={{
                        width: '100%',
                        height: '6px',
                        appearance: 'none',
                        backgroundColor: '#DDE9FF',
                        borderRadius: '4px',
                        outline: 'none',
                        marginBottom: '0.25rem',
                    }}
                />
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#888',
                    marginBottom: '1.75rem'
                }}>
                    <span>{formatTime(currentTime)}</span>
                    <span>- {formatTime(duration)}</span>
                </div>

                {/* Play/Pause */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '2rem'
                }}>
                    <button
                        onClick={handlePlayPause}
                        style={{
                            width: '8rem',
                            height: '8rem',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: '#DDE9FF',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <img
                            src={isPlaying ? PauseIcon : PlayIcon}
                            alt={isPlaying ? 'Pause' : 'Play'}
                            width="32"
                            height="32"
                            style={isPlaying ? {} : { marginLeft: '0.5rem' }}
                        />
                    </button>
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    width: '100%',
                }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: '1rem', width: '100%' }}>
                        <button
                            onClick={handleRetake}
                            style={{
                                flex: 1,
                                border: '3px solid #2563eb',
                                backgroundColor: 'transparent',
                                color: '#3578de',
                                padding: '1rem 1.5rem',
                                borderRadius: '14px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                width: '100%',
                                marginTop: '1rem',
                                marginBottom: '1rem'
                            }}
                        >
                            Retake
                        </button>

                        <button
                            onClick={handleSubmit}
                            style={{
                                flex: 1,
                                backgroundColor: '#3578de',
                                color: 'white',
                                border: 'none',
                                padding: '1rem 1.5rem',
                                borderRadius: '15px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </div>

                {/* Error Link */}
                <p style={{
                    fontSize: '12px',
                    textAlign: 'center',
                    marginTop: '1rem',
                    marginBottom: 0
                }}>
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLScYsWESIcn1uyEzFQT464qLSYZuUduHzThgTRPJODTQcCwz5w/viewform"
                       style={{ fontSize: '12px', fontWeight: 'bold', color: '#3578de', textDecoration: 'underline' }}>
                        Something wrong? Report an error
                    </a>
                </p>
            </div>
        </div>
    );
};

export default UploadCompleteCough;
