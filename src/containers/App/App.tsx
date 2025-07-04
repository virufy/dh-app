import React from "react";
import { BrowserRouter } from "react-router-dom";
import SpeechRecordScreen from "../SubmitSteps/RecordingsSteps/SpeechRecording/SpeechRecordScreen";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SpeechRecordScreen />
    </BrowserRouter>
  );
};

export default App;
