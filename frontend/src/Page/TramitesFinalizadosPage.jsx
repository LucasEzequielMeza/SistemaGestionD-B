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

        <div>

            <div className="flex items-center justify-between my-6">

                <h1 className="text-4xl text-black font-bold">
                    Trámites finalizados
                </h1>

            </div>

            {tramiteError.length > 0 && (

                <div className="mb-4">

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

                <div className="grid gap-4">

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