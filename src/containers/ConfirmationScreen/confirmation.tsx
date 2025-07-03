import React from 'react';
import SehaDubaiLogo from '../../assets/images/SehaDubaiLogo.png';
import { useNavigate } from 'react-router-dom';

const ConfirmationScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            backgroundColor: 'transparent',
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            padding: '0',
            margin: '0'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '360px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
            }}>
                <img
                    src={SehaDubaiLogo}
                    alt="Dubai Health Logo"
                    style={{
                        width: '120px',
                        marginBottom: '1.5rem',
                        padding: '0.5rem'
                    }}
                />
                <h2 style={{
                    fontSize: '30px',
                    fontWeight: 'bold',
                    color: '#393939',
                    marginBottom: '4rem',
                    lineHeight: '1.4'
                }}>
                    Thank you for<br />submitting!
                </h2>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        backgroundColor: '#3578de',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '1rem 2rem',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: '100%',
                        maxWidth: '280px',
                        marginBottom: '1.5rem'
                    }}
                >
                    Return to main menu
                </button>
                <a
                    href="#"
                    style={{
                        fontSize: '12.5px',
                        color: '#3578de',
                        textDecoration: 'underline',
                        fontWeight: 550
                    }}
                >
                    Something wrong? Report an error
                </a>
            </div>
        </div>
    );
};

export default ConfirmationScreen;
