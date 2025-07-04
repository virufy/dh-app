import React from 'react';
import './App.css';
import CoughRecordScreen from "../SubmitSteps/RecordingsSteps/CoughRecordScreen"
import UploadCompleteCough from "../SubmitSteps/RecordingsSteps/UploadCompleteCough"
import {Route, Routes} from 'react-router-dom';

const App: React.FC = () => {
  return (
    // <div>
    //     <CoughRecordScreen/>
    //     <UploadCompleteCough
    //         audioFileUrl="example-url.mp3"
    //         filename="Filename.wav"
    //         onRetake={() => {
    //             console.log("Retake clicked");
    //         }}
    //     />
    // </div>
    //   <h1>Hello, React is workizzzng!</h1>
    //   <CoughRecordScreen/>
      <Routes>
        <Route path="/cough-record" element={<CoughRecordScreen />} />
        <Route path="/upload-complete" element={<UploadCompleteCough />} />
      </Routes>
  );
};

export default App;
