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
            <div className="flex items-center justify-between my-6">
                <h1 className="text-4xl text-black font-bold">Trámites</h1>
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por número de carpeta o nombre del cliente"
                        value={busqueda}
                        onChange={(e) => realizarBusqueda(e.target.value)}
                        className="bg-zinc-800 px-3 py-2 block w-full text-white rounded-md"
                    />
                </div>

                <button onClick={() => navigate('/tramite/nuevo')} className="bg-[#5A1725] text-white px-4 py-2 rounded-md hover:bg-[#701D2D]">
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
                <p className="text-gray-600">No hay trámites para mostrar.</p>
            ) : (
                <div className="grid gap-4">
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