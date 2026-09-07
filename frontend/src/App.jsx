import React, {useState} from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import LoginPage from "./Page/LoginPage"
import RegisterPage from "./Page/RegisterPage"
import TramitesPage from "./Page/TramitesPage"
import TramitesFinalizadosPage from "./Page/TramitesFinalizadosPage"
import TramitesReactivarPage from "./Page/TramitesReactivarPage"
import TramitesBajaPage from "./Page/TramitesBajaPage"
import RecordatoriosPage from "./Page/RecordatoriosPage"
import TramiteForm from "./Components/tramites/TramiteForm"
import TramiteDetalle from "./Components/tramites/TramiteDetalle"
import RecordatorioForm from "./Components/recordatorios/RecordatorioForm"
import RecordatorioDetalle from "./Components/recordatorios/RecordatorioDetalle"
import DashboardPage from "./Page/DashboardPage"
import Navbar from "./Components/navbar/Navbar"
import Container from "./Components/UI/Container"
import RutaProtegida from "./Components/autorizacion/RutaProtegida"
import Notificaciones from "./Components/notificaciones/Notificaciones"

function App() {

  const [menuAbierto, setMenuAbierto] = useState(true)
  const location = useLocation()

  const esPaginaAutenticacion =
        location.pathname === "/iniciar-sesion" ||
        location.pathname === "/registro"

  return (
    <>
      {!esPaginaAutenticacion && (
                <Navbar
                    menuAbierto={menuAbierto}
                    setMenuAbierto={setMenuAbierto}
                />
      )}

      <main
          className={
              esPaginaAutenticacion
                  ? "min-h-screen"
                  : `transition-all duration-300 ${menuAbierto ? "ml-64" : "ml-20"}`
          }
      >
        <Container>
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
            
            <Route element={<RutaProtegida/>}>
              {/* Trámites */}
              <Route path="/tramites/dashboard" element={<DashboardPage/>}/>
              <Route path="/tramites" element={<TramitesPage />} />
              <Route path="/tramites/finalizados" element={<TramitesFinalizadosPage/>}/>
              <Route path="/tramites/reactivar" element={<TramitesReactivarPage />} />
              <Route path="/tramites/baja" element={<TramitesBajaPage />} />
              
              <Route path="/tramite/nuevo" element={<TramiteForm />} />
              <Route path="/tramite/:id/edit" element={<TramiteForm />} />
              <Route path="/tramites/detalle/:id" element={<TramiteDetalle />} />

              {/* Recordatorios */}
              <Route path="/recordatorios" element={<RecordatoriosPage />} />
              <Route path="/recordatorios/:id" element={<RecordatorioDetalle/>}/>
              <Route path="/recordatorios/nuevo" element={<RecordatorioForm />} />
              <Route path="/recordatorios/:id/edit" element={<RecordatorioForm/>}/>

              {/* Ruta inexistente */}
              <Route
                path="*"
                element={<Navigate to="/tramites" replace />}
              />
            </Route>

          </Routes>
        </Container>
      </main>
      <Notificaciones/>
    </>
  )
}

export default App