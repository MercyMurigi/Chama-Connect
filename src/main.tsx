import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ChamaProvider} from './domain/chamaContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChamaProvider>
      <App />
    </ChamaProvider>
  </StrictMode>,
);
