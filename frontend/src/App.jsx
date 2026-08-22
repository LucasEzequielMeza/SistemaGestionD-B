import React from "react"
import { Routes, Route } from "react-router-dom"
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
      <Route path="/iniciar-sesion" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage/>}/>

      <Route path="/tramites" element={<TramitesPage/>}/>
      <Route path="/tramite/nuevo" element={<TramiteForm/>}/>
      <Route path="/tramite/:id/edit" element={<TramiteForm/>}/>
      <Route path="/tramites/detalle/:id" element={<TramiteDetalle/>}/>

      <Route path="/recordatorios" element={<RecordatoriosPage/>}/>
      <Route path="/recordatorios/nuevo" element={<RecordatoriosForm/>}/>
    </Routes>
  )
}

export default App