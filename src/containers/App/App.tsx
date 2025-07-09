import i18n from '../../i18n';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';  // <-- import useTranslation

import BreathRecordScreen from '../SubmitSteps/RecordingsSteps/BreathRecord';
import ConfirmationScreen from '../ConfirmationScreen';
import SpeechRecordScreen from '../SubmitSteps/RecordingsSteps/SpeechRecording';
import CoughRecordScreen from '../SubmitSteps/RecordingsSteps/CoughRecordScreen';
import UploadCompleteCough from '../SubmitSteps/RecordingsSteps/UploadCompleteCough';

import ConsentScreen from './ConsentPage';
import Clinical_Login from './Clinical_Login';

// Add LanguageSwitcher component
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
      <button onClick={() => i18n.changeLanguage('en')}>English</button>
      <button onClick={() => i18n.changeLanguage('ar')} style={{ marginLeft: '1rem' }}>
        العربية
      </button>
    </div>
  );
};

// Main App with routes and language support
const App: React.FC = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Update document direction on language change
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <>
      <LanguageSwitcher />  {/* language switcher added here */}
      <Routes>
        <Route path="/" element={<Clinical_Login />} />
        <Route path="/consent" element={<ConsentScreen />} />
        <Route path="/record-breath" element={<BreathRecordScreen />} />
        <Route path="/confirmation" element={<ConfirmationScreen />} />
        <Route path="/record-speech" element={<SpeechRecordScreen />} />
        <Route path="/record-coughs" element={<CoughRecordScreen />} />
        <Route path="/clinical-login" element={<Clinical_Login />} />
        <Route path="/upload-complete" element={<UploadCompleteCough />} />
      </Routes>
    </>
  );
};

export default App;
