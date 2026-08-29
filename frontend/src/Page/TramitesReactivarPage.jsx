import React, { useEffect, useState } from "react";
import { useTramite } from "../Context/TramiteContexto";
import Card from "../Components/UI/Card";
import Button from "../Components/UI/Button";

function TramitesReactivarPage() {

    const {
        obtenerTramitesPorEstado,
        reactivarTramite,
        darDeBajaTramite,
        tramiteError
    } = useTramite();

    const [tramites, setTramites] = useState([]);

    useEffect(() => {
        cargarTramites();
    }, []);

    const cargarTramites = async () => {
        const datos = await obtenerTramitesPorEstado("reactivar");

        if (datos) {
            setTramites(datos);
        }
    };

    const handleReactivar = async (id) => {

        const respuesta = await reactivarTramite(id);

        if (respuesta) {
            setTramites((tramitesActuales) =>
                tramitesActuales.filter(
                    (tramite) => tramite.id !== id
                )
            );
        }
    };

    const handleBaja = async (id) => {

        const respuesta = await darDeBajaTramite(id);

        if (respuesta) {
            setTramites((tramitesActuales) =>
                tramitesActuales.filter(
                    (tramite) => tramite.id !== id
                )
            );
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between my-6">
                <h1 className="text-4xl text-black font-bold">Trámites para reactivar</h1>
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

            {tramites.length === 0 ? (
                <p className="text-gray-600">No hay trámites para reactivar.</p>
            ) : (

                <div className="grid gap-4">
                    {tramites.map((tramite) => (
                        <Card key={tramite.id}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">{tramite.tipo_tramite}</h2>
                                    <p>
                                        <span className="font-bold">Número de carpeta:</span>{" "}
                                        {tramite.numero_carpeta}
                                    </p>
                                    <p>
                                        <span className="font-bold">Cliente:
                                        </span>{" "}
                                        {tramite.nombre_cliente}
                                    </p>
                                    <p>
                                        <span className="font-bold">Estado:
                                        </span>{" "}
                                        Reactivar
                                    </p>
                                    <p>
                                        <span className="font-bold">Documentación:</span>{" "}
                                        {tramite.documentos_completados}/
                                        {tramite.documentos_total}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() =>handleReactivar(tramite.id)}>
                                        Reactivar
                                    </Button>

                                    <Button onClick={() => handleBaja(tramite.id)}>
                                        Dar de baja
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TramitesReactivarPage;