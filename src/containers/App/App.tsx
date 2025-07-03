import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ConfirmationScreen from '../ConfirmationScreen';

// Homepage with navigate
const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const goToConfirmation = () => {
        navigate('/confirmation');
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <h1>Hello Virufy Team 👋</h1>
            <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
                This is the structure of the team — let’s fit in, collaborate, and build something great on top of it! 🚀
            </p>

            <button
                onClick={goToConfirmation}
                style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginTop: '2rem',
                }}
            >
                Next
            </button>
        </div>
    );
};

// Main App with routes
const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/confirmation" element={<ConfirmationScreen />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
