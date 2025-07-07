jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

import React from "react";
import SpeechRecordScreen from "../SubmitSteps/RecordingsSteps/SpeechRecording/SpeechRecordScreen";

const App: React.FC = () => {
  return (
    <div>
      <SpeechRecordScreen />
    </div>
  );
};

export default App;
