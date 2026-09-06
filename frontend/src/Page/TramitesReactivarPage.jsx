import React, { useEffect, useState } from 'react'
import { useTramite } from '../Context/TramiteContexto'
import TramiteCard from '../Components/tramites/TramiteCard'

function TramitesReactivarPage() {

    const {
        obtenerTramitesPorEstado,
        reactivarTramite,
        darDeBajaTramite,
        tramiteError
    } = useTramite()

    const [tramites, setTramites] = useState([])

    useEffect(() => {
        cargarTramites()
    }, [])

    const cargarTramites = async () => {

    const datos = await obtenerTramitesPorEstado('reactivar')
        if (datos) {
            setTramites(datos)
        }
    }

    const handleReactivar = async (id) => {

        const respuesta = await reactivarTramite(id)

        if (respuesta) {
            setTramites((tramitesActuales) =>
                tramitesActuales.filter(
                    (tramite) => tramite.id !== id
                )
            )
        }
    }

    const handleBaja = async (id) => {

    const respuesta = await darDeBajaTramite(id)

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
                    Trámites para reactivar
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
                    No hay trámites para reactivar.
                </p>

            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center">
                    {tramites.map((tramite) => (
                        <TramiteCard
                            key={tramite.id}
                            tramite={tramite}
                            reactivarTramite={handleReactivar}
                            darDeBajaTramite={handleBaja}
                            modo="reactivar"
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default TramitesReactivarPage