import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {AuthProvider} from "./Context/ContextoAutorizacion"
import { TramiteProvider } from './Context/TramiteContexto.jsx'
import { RecordatorioProvider } from './Context/RecordatorioContexto.jsx'
import './index.css'
import App from './App.jsx'
import React from 'react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TramiteProvider>
          <RecordatorioProvider>
            <App />
          </RecordatorioProvider>      
        </TramiteProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
