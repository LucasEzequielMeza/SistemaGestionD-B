import React, { useEffect, useState } from 'react'
import { useTramite } from '../Context/TramiteContexto'
import TramiteCard from '../Components/tramites/TramiteCard'
function TramitesBajaPage() {

    const {
        obtenerTramitesPorEstado,
        reactivarTramiteEnBaja,
        tramiteError
    } = useTramite()

    const [tramites, setTramites] = useState([])

    useEffect(() => {
        cargarTramites()
    }, [])

    const cargarTramites = async () => {

        const datos = await obtenerTramitesPorEstado('baja')

        if (datos) {
            setTramites(datos)
        }
    }

    const handleReactivarBaja = async (id) => {

        const respuesta = await reactivarTramiteEnBaja(id)

        if (respuesta) {

            setTramites((tramitesActuales) =>
                tramitesActuales.filter(
                    (tramite) => tramite.id !== id
                )
            )
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between my-6">

                <h1 className="text-4xl text-black font-bold">
                    Trámites dados de baja
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
            {tramites.length === 0 ? (
                <p className="text-gray-600">
                    No hay trámites dados de baja.
                </p>

            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center">
                    {tramites.map((tramite) => (

                        <TramiteCard
                            key={tramite.id}
                            tramite={tramite}
                            reactivarTramite={handleReactivarBaja}
                            modo="baja"
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default TramitesBajaPage
