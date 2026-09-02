import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../UI/Card'
import Button from '../UI/Button'

function TramiteCard({ tramite, enviarAReactivar, finalizarTramite }) {
    const navigate = useNavigate()

    return (

        <Card>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">
                        {tramite.tipo_tramite}
                    </h2>
                    <p>
                        <span className="font-bold">
                            Número de carpeta:
                        </span>{' '}
                        {tramite.numero_carpeta}
                    </p>
                    <p>
                        <span className="font-bold">
                            Cliente:
                        </span>{' '}
                        {tramite.nombre_cliente}
                    </p>
                    <p>
                        <span className="font-bold">
                            Estado:
                        </span>{' '}
                        {tramite.estado === 'en_proceso'
                            ? 'En proceso'
                            : tramite.estado}
                    </p>
                    <p>
                        <span className="font-bold">
                            Documentación:
                        </span>{' '}
                        {tramite.documentos_completados}/
                        {tramite.documentos_total}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button onClick={() =>
                            navigate(`/tramites/detalle/${tramite.id}`)}>
                            Ver detalle
                    </Button>

                    {tramite.estado !== 'finalizado' && (
                        <Button
                            onClick={() =>
                                navigate(`/tramite/${tramite.id}/edit`)
                            }
                        >
                            Editar
                        </Button>
                    )}

                    {tramite.estado === 'en_proceso' && (
                        tramite.documentos_completados === tramite.documentos_total ? (
                            <Button onClick={() => finalizarTramite(tramite.id)}>
                                Finalizar trámite
                            </Button>
                        ) : (
                            <Button onClick={() => enviarAReactivar(tramite.id)}>
                                Enviar a reactivar
                            </Button>
                        )
                    )}
                </div>
            </div>
        </Card>
    )
}

export default TramiteCard