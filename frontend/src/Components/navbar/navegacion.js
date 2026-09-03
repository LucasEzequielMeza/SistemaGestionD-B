import { FaFolderOpen } from "react-icons/fa6";
import { MdDashboard, MdTaskAlt, MdRefresh, MdFolderOff } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";

export const publicRoutes = [
    { name: 'Registro', path: '/registro' },
    { name: 'Iniciar Sesión', path: '/iniciar-sesion' },
]

export const privateRoutes = [
    {
        name: 'Dashboard',
        path: '/tramites/dashboard',
        icon: MdDashboard
    },
    {
        name: 'Trámites en proceso',
        path: '/tramites',
        icon: FaFolderOpen
    },
    {
        name: 'Trámites finalizados',
        path: '/tramites/finalizados',
        icon: MdTaskAlt
    },
    {
        name: 'Trámites a reactivar',
        path: '/tramites/reactivar',
        icon: MdRefresh
    },
    {
        name: 'Trámites dados de baja',
        path: '/tramites/baja',
        icon: MdFolderOff
    },
    {
        name: 'Recordatorios',
        path: '/recordatorios',
        icon: IoIosNotifications
    },
]