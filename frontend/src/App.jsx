import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./Page/LoginPage"
import RegisterPage from "./Page/RegisterPage"
import TramitesPage from "./Page/TramitesPage"
import RecordatoriosPage from "./Page/RecordatoriosPage"
import TramiteForm from "./Components/tramites/TramiteForm"
import TramiteDetalle from "./Components/tramites/TramiteDetalle"
import RecordatoriosForm from "./Components/recordatorios/RecordatorioForm"

function App() {
  return (
<Routes>

      {/* Autenticación */}
      <Route path="/" element={<Navigate to="/tramites" replace />} />

      <Route path="/iniciar-sesion" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* Compatibilidad con la ruta anterior */}
      <Route
        path="/register"
        element={<Navigate to="/registro" replace />}
      />

      {/* Trámites */}
      <Route path="/tramites" element={<TramitesPage />} />
      <Route path="/tramite/nuevo" element={<TramiteForm />} />
      <Route path="/tramite/:id/edit" element={<TramiteForm />} />
      <Route path="/tramites/detalle/:id" element={<TramiteDetalle />} />

      {/* Recordatorios */}
      <Route path="/recordatorios" element={<RecordatoriosPage />} />
      <Route path="/recordatorios/nuevo" element={<RecordatoriosForm />} />

      {/* Ruta inexistente */}
      <Route
        path="*"
        element={<Navigate to="/tramites" replace />}
      />

    </Routes>
  )
}

export default App