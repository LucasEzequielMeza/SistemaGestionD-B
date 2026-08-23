import React, { useState } from 'react'
import { FaFolder } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { IoMenu } from "react-icons/io5";
import { Link, useLocation } from 'react-router-dom'
import { privateRoutes } from './navegacion.js'
import { useAuth } from '../../Context/ContextoAutorizacion'

function NavBar() {

    const location = useLocation()

    const { logout, usuario, estaAutorizado } = useAuth()

    const [menuAbierto, setMenuAbierto] = useState(true)

    if (!estaAutorizado) {
        return null
    }

    return (
        <nav
            className={`fixed left-0 top-0 h-screen bg-[#5A1725] text-white transition-all duration-300 ${
                menuAbierto ? 'w-64' : 'w-20'
            }`}
        >

            <div className="flex h-full flex-col">

                <div className="flex items-center justify-center rounded-md p-3 transition">

                    {menuAbierto && (
                        <Link
                            to="/tramites"
                            className="text-xl font-bold"
                        >
                            Sistema D&B
                        </Link>
                    )}

                    <button
                        onClick={() => setMenuAbierto(!menuAbierto)}
                        className="rounded-md p-2 hover:bg-[#701D2D]"
                    >
                        <IoMenu className='text-xl'/>
                    </button>

                </div>


                <div className="flex flex-1 flex-col gap-2 px-3 mt-6">

                {privateRoutes.map((route) => (
                    <Link
                        key={route.path}
                        to={route.path}
                        className={`flex items-center justify-center rounded-md p-3 transition ${
                            location.pathname === route.path
                                ? 'bg-[#701D2D] font-bold'
                                : 'hover:bg-[#701D2D]'
                        }`}
                    >
                        {menuAbierto ? (
                            route.name
                        ) : (
                            route.path.startsWith('/tramite') ? (
                                <FaFolder className="text-xl" />
                            ) : (
                                <IoIosNotifications className="text-xl" />
                            )
                        )}
                    </Link>
                ))}

                </div>


                <div className="border-t border-white/20 p-4">

                    {menuAbierto && usuario && (
                        <p className="w-full rounded-md p-3 text-left hover:bg-[#701D2D]">
                            {usuario.nombre} {usuario.apellido}
                        </p>
                    )}

                    <button
                        onClick={logout}
                        className="w-full rounded-md p-3 text-left hover:bg-[#701D2D]"
                    >
                        {menuAbierto ? 'Cerrar sesión' : <IoLogOut className="text-xl"/>}
                    </button>

                </div>

            </div>

        </nav>
    )
}

export default NavBar