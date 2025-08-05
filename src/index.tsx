import './i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './containers/App/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import './assets/fonts/font.css';

// Utils
import swConfig from './utils/swConfig';



import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

// Register service worker only in production
if (process.env.NODE_ENV !== 'production') {
  serviceWorkerRegistration.unregister();
} else {
  serviceWorkerRegistration.register(swConfig);
}
