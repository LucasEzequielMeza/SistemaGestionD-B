import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from "./Context/ContextoAutorizacion"
import { TramiteProvider } from './Context/TramiteContexto.jsx'
import { RecordatorioProvider } from './Context/RecordatorioContexto.jsx'
import { NotificacionProvider } from './Context/NotificacionContexto.jsx'

import './index.css'
import App from './App.jsx'

// Registro el Service Worker cuando la página termina de cargar.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .catch((error) => {
        console.error('Error al registrar el Service Worker:', error);
      });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TramiteProvider>
          <RecordatorioProvider>
            <NotificacionProvider>
              <App />
            </NotificacionProvider>
          </RecordatorioProvider>
        </TramiteProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)