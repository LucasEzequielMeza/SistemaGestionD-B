import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../UI/Card'
import Button from '../UI/Button'

function TramiteCard({
    tramite,
    enviarAReactivar,
    finalizarTramite,
    reactivarTramite,
    darDeBajaTramite,
    modoBusqueda,
    modo = 'normal'
}) {

    const navigate = useNavigate()

    const documentacionCompleta =
        tramite.documentos_completados === tramite.documentos_total

    return (
        <Card className="w-[300px] min-h-[350px] flex flex-col">
            <h2 className="text-2xl font-bold mb-5">
                {tramite.tipo_tramite}
            </h2>
            <div className="space-y-3 flex-1">
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
                        : tramite.estado === 'reactivar'
                            ? 'Reactivar'
                            : tramite.estado === 'baja'
                                ? 'Baja'
                                : tramite.estado === 'finalizado'
                                    ? 'Finalizado'
                                    : tramite.estado}
                </p>
                <div>
                    <p>
                        <span className="font-bold">
                            Documentación:
                        </span>{' '}
                        {tramite.documentos_completados}/
                        {tramite.documentos_total}
                    </p>
                    <div className="w-full h-2 bg-white/20 rounded-full mt-2">
                        <div
                            className="h-2 bg-white rounded-full transition-all"
                            style={{
                                width: tramite.documentos_total > 0
                                    ? `${(tramite.documentos_completados / tramite.documentos_total) * 100}%`
                                    : '0%'
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="flex gap-2 mt-6">
                {/* Trámites normales */}
                {modo === 'normal' && (
                    <>
                        <Button
                            onClick={() =>
                                navigate(`/tramites/detalle/${tramite.id}`)
                            }
                        >
                            Ver detalle
                        </Button>
                        {!modoBusqueda && (
                            <>
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
                                    documentacionCompleta ? (
                                        <Button
                                            onClick={() =>
                                                finalizarTramite(tramite.id)
                                            }
                                        >
                                            Finalizar
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                enviarAReactivar(tramite.id)
                                            }
                                        >
                                            Enviar a reactivar
                                        </Button>
                                    )
                                )}
                            </>
                        )}
                    </>
                )}
                {/* Trámites para reactivar */}
                {modo === 'reactivar' && (
                    <>
                        <Button
                            onClick={() =>
                                reactivarTramite(tramite.id)
                            }
                        >
                            Reactivar
                        </Button>

                        <Button
                            onClick={() =>
                                darDeBajaTramite(tramite.id)
                            }
                        >
                            Dar de baja
                        </Button>
                    </>
                )}
                {/* Trámites dados de baja */}
                {modo === 'baja' && (
                    <Button
                        onClick={() =>
                            reactivarTramite(tramite.id)
                        }
                    >
                        Reactivar
                    </Button>
                )}
            </div>
        </Card>
    )
}

export default TramiteCard