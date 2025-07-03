import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackIcon from '../../assets/images/back-icon.png';
type CheckboxItem = {
  id: string;
  label: string;
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConsentScreen: React.FC = () => {
  const navigate = useNavigate();

  const [ageConfirmed, setAgeConfirmed] = useState<boolean>(false);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [privacyAck, setPrivacyAck] = useState<boolean>(false);
  const [healthInfoConsent, setHealthInfoConsent] = useState<boolean>(false);

  const checkboxes: CheckboxItem[] = [
    {
      id: 'ageConfirmed',
      label: 'I certify that I am 18 years of age or older.',
      state: ageConfirmed,
      setState: setAgeConfirmed,
    },
    {
      id: 'consentGiven',
      label:
        'I have read and understood the Dubai Health Participant Information & Consent Form.',
      state: consentGiven,
      setState: setConsentGiven,
    },
    {
      id: 'privacyAck',
      label:
        'I acknowledge that my anonymized data will be shared with Virufy for analysis and that I have reviewed their Privacy Policy.',
      state: privacyAck,
      setState: setPrivacyAck,
    },
    {
      id: 'healthInfoConsent',
      label:
        'I explicitly consent to the collection and processing of my health information and recordings (cough, breathing, speech).',
      state: healthInfoConsent,
      setState: setHealthInfoConsent,
    },
  ];

  const handleNext = () => {
    const allChecked =
      ageConfirmed && consentGiven && privacyAck && healthInfoConsent;

    if (allChecked) {
      navigate('/record');
    } else {
      alert('Please check all boxes to continue.');
    }
  };

  const handleSignedPaperNext = () => {
    alert(
      'Please make sure you have signed the paper consent form manually.'
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div
      style={{
        backgroundColor: '#f8f8f8',
        minHeight: '100vh',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '12px',
          maxWidth: '700px',
          width: '100%',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}
      >
        {/* Header */}
        <div style={{ position: 'relative', textAlign: 'center', padding: '20px' }}>
          <button
            onClick={handleBack}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Go back"
          >
            <img src={BackIcon} alt="Back" style={{ width: '25px', height: '35px' }} />
          </button>
          <h2 style={{ color: '#007bff', margin: 0 }}>
            Research Participation Consent
          </h2>
        </div>

        {/* Intro Text */}
        <p style={{ marginBottom: '1.5rem' }}>
          You are invited to participate in a research study conducted by Dubai Health in collaboration with our research partner, Virufy.
          Before you decide, please carefully review the official study documents. Your participation is voluntary.
        </p>

        {/* Documents Section */}
        <h4>1. Documents</h4>
        <ul style={{ paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
          <li style={{ marginBottom: '0.75rem' }}>
            <strong>Dubai Health - Participant Information & Consent Form:</strong><br />
            Explains the study's purpose, procedures, risks, and benefits. <br />
            <a href="#" style={{ color: '#007bff' }}>Click to read the full document</a>
          </li>
          <li>
            <strong>Virufy - Partner Privacy Policy:</strong><br />
            Explains how Virufy handles your data. <br />
            <a href="#" style={{ color: '#007bff' }}>Click to read the full document</a>
          </li>
        </ul>

        {/* Checkboxes */}
        <h4>2. Confirmation Checkboxes</h4>
        <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
          By checking the boxes below, you confirm you have reviewed the information and agree to participate.
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          {checkboxes.map(({ id, label, state, setState }) => (
            <label key={id} htmlFor={id} style={{ display: 'block', marginBottom: '0.75rem' }}>
              <input
                type="checkbox"
                id={id}
                checked={state}
                onChange={() => setState(!state)}
              />{' '}
              {label}
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <button
            onClick={handleNext}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Next
          </button>

          <button
            onClick={handleSignedPaperNext}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Next (Signed Paper Consent Form)
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#999' }}>
          Something wrong?{' '}
          <a href="#" style={{ color: '#007bff' }}>
            Report an error
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConsentScreen;
