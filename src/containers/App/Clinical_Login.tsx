import React, { useState, useEffect } from 'react';
import SehaDubaiLogo from '../../assets/images/SehaDubaiLogo.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  pageContainer,
  title,
  fieldLabel,
  fieldInput,
  dropdown,
  buttonCircle,
  buttonContainer,
  arrowIcon,
  logoStyle,
} from './style';

const Clinical_Login = () => {
  const { t, i18n } = useTranslation();
  const [patientId, setPatientId] = useState('');
  const [hospital, setHospital] = useState('Al Barsha Health Centre');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  // Always reset language to English when this page loads
  useEffect(() => {
    i18n.changeLanguage('en');
  }, [i18n]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId.trim()) {
      setError(t('home.error.patient_id_required'));
      return;
    }
    if (!/^\d+$/.test(patientId.trim())) {
      setError(t('home.error.patient_id_numeric'));
      return;
    }
    setError('');
    let cnm = '';
    if (hospital === t('home.hospital_options.barsha')) {
      cnm = 'BHC';
    } else if (hospital === t('home.hospital_options.nadd')) {
      cnm = 'NAH';
    }
    const CNM_PatientID = `${cnm}_${patientId}`;
    sessionStorage.setItem("CNM_PatientID", CNM_PatientID);
    navigate('/consent');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} style={pageContainer} noValidate>
      <img src={SehaDubaiLogo} alt="Dubai Health Logo" style={logoStyle} />
      <h1 style={title}>{t('home.title')}</h1>

      <label style={fieldLabel}>{t('home.language_label')}</label>
      <select
        style={dropdown}
        value={i18n.language}
        onChange={handleLanguageChange}
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>

      <label style={fieldLabel}>
        {t('home.patient_id_label')} <span style={{ color: 'red' }}>*</span>
      </label>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        style={fieldInput}
        placeholder={t('home.patient_id_placeholder')}
        value={patientId}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
          setPatientId(value);
        }}
        aria-invalid={!!error}
        aria-describedby="patientId-error"
      />

      {error && (
        <div id="patientId-error" style={{ color: 'red', marginTop: 4 }}>
          {error}
        </div>
      )}

      <label style={fieldLabel}>{t('home.hospital_label')}</label>
      <select
        style={dropdown}
        value={hospital}
        onChange={e => setHospital(e.target.value)}
      >
        <option value={t('home.hospital_options.barsha')}>{t('home.hospital_options.barsha')}</option>
        <option value={t('home.hospital_options.nadd')}>{t('home.hospital_options.nadd')}</option>
      </select>

      <div style={buttonContainer}>
        <button style={buttonCircle} type="submit">
          <span
            style={{
              ...arrowIcon,
              transform: isArabic ? 'rotate(180deg)' : 'none',
            }}
          >
            ➜
          </span>
        </button>
      </div>
    </form>
  );
};

console.log('Clinical Login Loaded');
export default Clinical_Login;
