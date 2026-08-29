import React, { useEffect, useState } from "react";
import { useTramite } from "../Context/TramiteContexto";
import Button from "../Components/UI/Button";
import Card from "../Components/UI/Card";

function TramitesBajaPage() {

    const {
        obtenerTramitesPorEstado,
        tramiteError,
        reactivarTramiteEnBaja
    } = useTramite();

    const [tramites, setTramites] = useState([]);

    useEffect(() => {
        cargarTramites();
    }, []);

    const cargarTramites = async () => {
        const datos = await obtenerTramitesPorEstado("baja");

        if (datos) {
            setTramites(datos);
        }
    };

    const handleReactivarBaja = async (id) => {

        const respuesta = await reactivarTramiteEnBaja(id);

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
                <h1 className="text-4xl text-black font-bold">Trámites dados de baja</h1>
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
                <p className="text-gray-600">No hay trámites dados de baja.</p>
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
                                        <span className="font-bold">Cliente:</span>{" "}
                                        {tramite.nombre_cliente}
                                    </p>

                                    <p>
                                        <span className="font-bold">Estado:</span>{" "}
                                        Baja
                                    </p>
                                    <p>
                                        <span className="font-bold">
                                            Documentación:
                                        </span>{" "}
                                        {tramite.documentos_completados}/
                                        {tramite.documentos_total}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() =>handleReactivarBaja(tramite.id)}>
                                    Reactivar
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TramitesBajaPage;
