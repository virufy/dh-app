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

// Always use /dh-app for both dev and prod
const basename = '/dh-app';

root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();

if (process.env.NODE_ENV !== 'production') {
  serviceWorkerRegistration.unregister();
} else {
  serviceWorkerRegistration.register(swConfig);
}
