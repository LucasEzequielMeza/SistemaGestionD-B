import React from 'react'
import Card from '../UI/Card'
import Button from '../UI/Button'

function DocumentosTramite({documentos = [], setDocumentos}) {

    const cambiarEstado = async (id, accion) => {
        try {

            const respuesta = await fetch(
                `http://localhost:3001/api/documentos/tramite-documento/${id}/${accion}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            if (!respuesta.ok) {
                const error = await respuesta.json()

                throw new Error(
                    error.error || 'No se pudo actualizar el documento'
                )
            }

            // Obtenemos el documento que acaba de actualizar el servidor.
            const documentoActualizado = await respuesta.json()

            // Actualizamos solamente ese documento en la lista.
            setDocumentos((documentosActuales) =>
                documentosActuales.map((documento) =>
                    documento.id === documentoActualizado.id
                        ? {
                            ...documento,
                            ...documentoActualizado
                        }
                        : documento
                )
            )

        } catch (error) {

            console.error(
                'Error al cambiar el estado del documento:',
                error
            )

        }
    }

    const obtenerEstiloEstado = (estado) => {

        if (estado === 'no_pedido') {
            return 'bg-red-100 text-red-700'
        }

        if (estado === 'pendiente') {
            return 'bg-yellow-100 text-yellow-700'
        }

        if (estado === 'recibido') {
            return 'bg-green-100 text-green-700'
        }

        if (estado === 'cargado') {
            return 'bg-green-100 text-green-700'
        }

        return 'bg-gray-100 text-gray-700'
    }

    const obtenerTextoEstado = (estado) => {

        if (estado === 'no_pedido') {
            return 'No pedido'
        }

        if (estado === 'pendiente') {
            return 'Pendiente'
        }

        if (estado === 'recibido') {
            return 'Recibido'
        }

        if (estado === 'cargado') {
            return 'Cargado en LEX'
        }

        return estado
    }

    const documentosRecibidos = documentos.filter(
        (documento) =>
            documento.estado === 'recibido' ||
            documento.estado === 'cargado'
    ).length

    return (
        <Card>

            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Documentación</h2>
                <span className="text-sm text-gray-500"> {documentosRecibidos} de {documentos.length} cargados</span>
            </div>

            {documentos.length === 0 ? (
                <p>No hay documentos asociados a este trámite</p>
            ) : (
                <div className="border rounded-md overflow-hidden">
                    {documentos.map((documento) => (
                        <div key={documento.id} className="flex items-center gap-3 px-3 py-2 border-b last:border-b-0">
                            <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium truncate">
                                    {documento.nombre}
                                </span>
                                {!documento.obligatorio && (
                                    <span className="ml-2 text-xs text-gray-500">
                                        Opcional
                                    </span>
                                )}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${obtenerEstiloEstado(documento.estado)}`}>
                                {obtenerTextoEstado(documento.estado)}
                            </span>
                            <div className="w-24 flex justify-end">
                                {documento.estado === 'no_pedido' && (
                                    <Button onClick={() => cambiarEstado(
                                                documento.id,
                                                'pendiente')}>Pedir
                                    </Button>

                                )}

                                {documento.estado === 'pendiente' && (
                                    <Button onClick={() => cambiarEstado(documento.id,'recibido')}>
                                        Recibido
                                    </Button>
                                )}

                                {documento.estado === 'recibido' &&
                                    documento.se_carga_lex && (
                                        <Button onClick={() => cambiarEstado( documento.id,'cargar-lex'
                                          )}>
                                            Cargar LEX
                                        </Button>
                                    )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    )
}

export default DocumentosTramite