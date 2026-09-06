import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTramite } from '../Context/TramiteContexto'
import TramiteCard from '../Components/tramites/TramiteCard'

function TramitesPage() {

    const {
        tramites,
        obtenerTramites,
        tramiteError,
        enviarReactivarTramite, 
        finalizarTramite,
        buscarTramite
    } = useTramite()

    const navigate = useNavigate()

    const [busqueda, setBusqueda] = useState('')
    const [resultadosBusqueda, setResultadosBusqueda] = useState([])

    useEffect(() => {
        obtenerTramites()
    }, [])

    const enviarTramiteAReactivar = async (id) => {

        const respuesta = await enviarReactivarTramite(id)

        if (respuesta) {
            obtenerTramites()
        }
    }

    const tramiteFinalizado = async (id) => {
        
        const respuesta = await finalizarTramite(id)

        if (respuesta) {
            obtenerTramites()
        }
    }

    const realizarBusqueda = async (texto) => {

        setBusqueda(texto)

        if (texto.trim() === '') {
            setResultadosBusqueda([])
            obtenerTramites()
            return
        }

        const resultados = await buscarTramite(texto)

        if (resultados) {
            setResultadosBusqueda(resultados)
        }
    }

    const tramitesMostrar = busqueda.trim() === ''
    ? tramites
    : resultadosBusqueda

    return (
    <div>

        <div className="flex items-center gap-4 my-6">
            <input
                type="text"
                placeholder="Buscar por número de carpeta o nombre del cliente"
                value={busqueda}
                onChange={(e) => realizarBusqueda(e.target.value)}
                className="bg-[#5A1725] px-3 py-2 text-white rounded-md placeholder:text-white/60 focus:outline-none flex-1"
            />

            <button
                onClick={() => navigate('/tramite/nuevo')}
                className="bg-[#5A1725] text-white px-4 py-2 rounded-md hover:bg-[#701D2D] whitespace-nowrap"
            >
                Nuevo trámite
            </button>

        </div>

        {tramiteError.length > 0 && (
            <div className="mb-4">
                {tramiteError.map((error, index) => (
                    <p key={index} className="text-red-500">
                        {error.message || error.error || error}
                    </p>
                ))}
            </div>
        )}

        {tramitesMostrar.length === 0 ? (
            <p className="text-gray-600">
                No hay trámites para mostrar.
            </p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                {tramitesMostrar.map((tramite) => (
                    <TramiteCard
                        key={tramite.id}
                        tramite={tramite}
                        enviarAReactivar={enviarTramiteAReactivar}
                        finalizarTramite={tramiteFinalizado}
                        modoBusqueda={busqueda.trim() !== ''}
                    />
                ))}

            </div>
        )}

    </div>
)
}

export default TramitesPage