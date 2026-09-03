import React, { useEffect, useState } from 'react'
import { IoLogOut } from "react-icons/io5";
import { IoMenu } from "react-icons/io5";
import { Link, useLocation } from 'react-router-dom'
import { privateRoutes } from './navegacion.js'
import { useAuth } from '../../Context/ContextoAutorizacion'
import { useNotificacion } from '../../Context/NotificacionContexto.jsx';

function NavBar({ menuAbierto, setMenuAbierto }) {
    const location = useLocation()
    const { logout, usuario, estaAutorizado } = useAuth()
    const { notificaciones, solicitarPermisoNotificaciones } = useNotificacion()
    const [notificacionesPermitidas, setNotificacionesPermitidas] = useState(false)

    useEffect(() => {
        if ("Notification" in window) {
            setNotificacionesPermitidas(Notification.permission === "granted")
        }
    }, [])

    if (!estaAutorizado) {
        return null
    }

    const activarNotificaciones = async () => {
        const permiso = await solicitarPermisoNotificaciones();
        if (permiso) {
            setNotificacionesPermitidas(true);
        }
    }

    return (
        <nav className={`fixed left-0 top-0 h-screen bg-[#5A1725] text-white transition-all duration-300 ${menuAbierto ? 'w-64' : 'w-20'}`}>
            <div className="flex h-full flex-col">
                <div className="flex items-center justify-center rounded-md p-3 transition">
                    {menuAbierto && (
                        <Link to="/tramites" className="text-xl font-bold">
                            Sistema D&B
                        </Link>
                    )}
                    <button onClick={() => setMenuAbierto(!menuAbierto)} className="rounded-md p-2 hover:bg-[#701D2D]">
                        <IoMenu className="text-xl"/>
                    </button>
                </div>

                <div className="flex flex-1 flex-col gap-2 px-3 mt-6">
                    {privateRoutes.map((route) => (
                        <Link
                            key={route.path}
                            to={route.path}
                            className={`flex items-center justify-center rounded-md p-3 transition ${location.pathname === route.path ? 'bg-[#701D2D] font-bold' : 'hover:bg-[#701D2D]'}`}
                        >
                            {menuAbierto ? (
                                <div className="flex items-center justify-between w-full">

                                    <div className="flex items-center gap-3">

                                        {route.icon && <route.icon className="text-xl" />}

                                        <span>{route.name}</span>

                                    </div>

                                    {route.path === '/recordatorios' && notificaciones.length > 0 && (
                                        <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                                            {notificaciones.length}
                                        </span>
                                    )}

                                </div>
                            ) : (
                                <div className="relative">

                                    {route.icon ? (
                                        <route.icon className="text-xl" />
                                    ) : (
                                        <IoIosNotifications className="text-xl" />
                                    )}

                                    {route.path === '/recordatorios' && notificaciones.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                                            {notificaciones.length}
                                        </span>
                                    )}

                                </div>
                            )}
                        </Link>
                    ))}
                </div>

                <div className="border-t border-white/20 p-4">
                    {menuAbierto && !notificacionesPermitidas && (
                        <button onClick={activarNotificaciones} className="w-full rounded-md p-3 mb-2 text-left hover:bg-[#701D2D]">
                            🔔 Activar notificaciones
                        </button>
                    )}

                    {menuAbierto && usuario && (
                        <p className="w-full rounded-md p-3 text-left hover:bg-[#701D2D]">
                            {usuario.nombre} {usuario.apellido}
                        </p>
                    )}

                    <button onClick={logout} className="w-full rounded-md p-3 text-left hover:bg-[#701D2D]">
                        {menuAbierto ? 'Cerrar sesión' : <IoLogOut className="text-xl"/>}
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default NavBar