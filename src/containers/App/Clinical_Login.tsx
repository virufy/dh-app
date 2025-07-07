import React, { useState } from 'react';
import SehaDubaiLogo from '../../assets/images/SehaDubaiLogo.png';
import {
  pageContainer,
  title,
  fieldLabel,
  fieldInput,
  dropdown,
  buttonCircle,
  buttonContainer,
  arrowIcon,
} from './style';

const Clinical_Login = () => {
  const [patientId, setPatientId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientId.trim()) {
      setError('Patient ID is required');
      return;
    }

    setError('');
    // proceed to next step or submit form data
    alert(`Submitted Patient ID: ${patientId}`);
  };

  return (
    <form onSubmit={handleSubmit} style={pageContainer} noValidate>
      <img
        src={SehaDubaiLogo}
        alt="Dubai Health Logo"
        style={{
          height: 70,
          marginBottom: 20,
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />

      <h1 style={title}>
        Smartphone COVID/Flu/RSV
        <br />
        AI Diagnostics Study
      </h1>

      <label style={fieldLabel}>Language</label>
      <select style={dropdown} defaultValue="English">
        <option>English</option>
        <option>العربية</option>
      </select>

      <label style={fieldLabel}>Patient ID <span style={{ color: 'red' }}>*</span></label>
      <input
        style={fieldInput}
        placeholder="Enter Patient ID"
        value={patientId}
        onChange={e => setPatientId(e.target.value)}
        aria-invalid={!!error}
        aria-describedby="patientId-error"
      />
      {error && (
        <div id="patientId-error" style={{ color: 'red', marginTop: 4 }}>
          {error}
        </div>
      )}

      <label style={fieldLabel}>Hospital Name</label>
      <select style={dropdown} defaultValue="Al Barsha Health Centre">
        <option>Al Barsha Health Centre</option>
        <option>Rashid Hospital</option>
        <option>Latifa Hospital</option>
      </select>

      <div style={buttonContainer}>
        <button style={buttonCircle} type="submit">
          <span style={arrowIcon}>➜</span>
        </button>
      </div>
    </form>
  );
};

export default Clinical_Login;
