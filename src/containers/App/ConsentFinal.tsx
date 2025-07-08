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
        'I have read and understood the Dubai Health Participant Information & Consent Form. I voluntarily agree to participate in this study.',
      state: consentGiven,
      setState: setConsentGiven,
    },
    {
      id: 'privacyAck',
      label:
        'I acknowledge that my anonymized data will be shared with Virufy for analysis and have had the opportunity to review their Privacy Policy.',
      state: privacyAck,
      setState: setPrivacyAck,
    },
    {
      id: 'healthInfoConsent',
      label:
        'I explicitly consent to the collection and processing of my health information and recordings (cough, breathing, speech) for the research purposes described.',
      state: healthInfoConsent,
      setState: setHealthInfoConsent,
    },
  ];

  const Spacer = ({ height }: { height: string }) => <div style={{ height }} />;

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
    alert('Please make sure you have signed the paper consent form manually.');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          padding: '2rem',
          borderRadius: '12px',
          maxWidth: '700px',
          width: '100%',
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
          Before you decide, please carefully review the official study documents. Your participation is
          voluntary. <br />
          <Spacer height="1rem" />
          <u>
            You are invited to participate in a research study conducted by Dubai Health in collaboration with our
            research partner, Virufy.
          </u>
        </p>

        {/* Documents Section */}
        <ol style={{ paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
          <li style={{ marginBottom: '1.5rem' }}>
            <strong>Dubai Health - Participant Information & Consent Form</strong><br />
            This document explains the study's purpose, procedures, risks, and benefits. <br />
            <Spacer height="1rem" />
            <a
              href="https://docs.google.com/document/d/1c093C-aOUaxqWAUBodDc2QUtIHA8sfpA/view"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#007bff' }}
            >
              Tap to read the full document
            </a>
            <Spacer height="1rem" />
            <div style={{ height: '500px', border: '1px solid #ccc', borderRadius: '6px' }}>
              <iframe
                src="https://docs.google.com/document/d/1c093C-aOUaxqWAUBodDc2QUtIHA8sfpA/preview"
                width="100%"
                height="100%"
                allow="autoplay"
                style={{ border: 'none' }}
                title="Consent Form Preview"
              ></iframe>
            </div>
          </li>

          <li>
            <strong>Virufy - Partner Privacy Policy</strong><br />
            As our research partner, Virufy helps analyze the data. This document explains how they handle information. <br />
            <Spacer height="1rem" />
            <a
              href="https://drive.google.com/file/d/1hnxvDJ5qHBnUi7cnkNdyD4PuWMz8Ntss/view"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#007bff' }}
            >
              Tap to read the full document
            </a>
            <Spacer height="1rem" />
            <div style={{ height: '500px', border: '1px solid #ccc', borderRadius: '6px' }}>
              <iframe
                src="https://drive.google.com/file/d/1hnxvDJ5qHBnUi7cnkNdyD4PuWMz8Ntss/preview"
                width="100%"
                height="100%"
                allow="autoplay"
                style={{ border: 'none' }}
                title="Privacy Policy Preview"
              ></iframe>
            </div>
          </li>
        </ol>

        {/* Checkboxes */}
        <h4>Confirmation Checkboxes:</h4>
        <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
          By checking the boxes below, you confirm you have reviewed the information and agree to participate.
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          {checkboxes.map(({ id, label, state, setState }) => (
            <label key={id} htmlFor={id}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '0.75rem' }}>
              <input
                type="checkbox"
                id={id}
                checked={state}
                onChange={() => setState(!state)}
                style={{ marginTop: '0.3rem' }}
              />{' '}
              <span>{label}</span>
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', width: '100%' }}>
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
