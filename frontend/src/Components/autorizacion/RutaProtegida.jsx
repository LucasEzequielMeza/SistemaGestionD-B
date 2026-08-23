import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/ContextoAutorizacion.jsx";

function RutaProtegida() {

    const { estaAutorizado, cargando } = useAuth();

    if (cargando) {
        return null;
    }

    if (!estaAutorizado) {
        return <Navigate to="/iniciar-sesion" replace />;
    }

    return <Outlet />;
}

export default RutaProtegida;