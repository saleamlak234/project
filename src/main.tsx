import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
// import i18n from './i18n.js';
// import { I18nextProvider } from 'react-i18next';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
   
 {/* <I18nextProvider i18n={i18n}> */}
     <AuthProvider>
     <App/>
     </AuthProvider>
    {/* </I18nextProvider> */}
        {/* <App /> */}

    </BrowserRouter>
  </StrictMode>
);