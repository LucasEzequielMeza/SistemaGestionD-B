import React, { useEffect, useState } from 'react'
import { useTramite } from '../Context/TramiteContexto'
import TramiteCard from '../Components/tramites/TramiteCard'

function TramitesFinalizadosPage() {

    const {
        obtenerTramitesPorEstado,
        tramiteError
    } = useTramite()

    const [tramitesFinalizados, setTramitesFinalizados] = useState([])

    useEffect(() => {

        const cargarTramitesFinalizados = async () => {

            const respuesta = await obtenerTramitesPorEstado('finalizado')

            if (respuesta) {
                setTramitesFinalizados(respuesta)
            }

        }

        cargarTramitesFinalizados()

    }, [])

    return (
    <div className="mt-8">
        <div className="flex items-center justify-between my-6">
            <h1 className="text-4xl text-black font-bold">Trámites finalizados</h1>
        </div>
        {tramiteError.length > 0 && (
            <div className="mb-6">
                {tramiteError.map((error, index) => (
                    <p
                        key={index}
                        className="text-red-500"
                    >
                        {error.message || error.error || error}
                    </p>
                ))}
            </div>
        )}

        {tramitesFinalizados.length === 0 ? (
            <p className="text-gray-600">
                No hay trámites finalizados para mostrar.
            </p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center">
                {tramitesFinalizados.map((tramite) => (
                    <TramiteCard
                        key={tramite.id}
                        tramite={tramite}
                    />
                ))}
            </div>
        )}

    </div>
    )
}

export default TramitesFinalizadosPage