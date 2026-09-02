import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecordatorio } from '../../Context/RecordatorioContexto'
import Card from '../UI/Card'
import Button from '../UI/Button'

function RecordatorioDetalle() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { recordatorio, obtenerRecordatorioPorId, finalizarRecordatorio, recordatorioError } = useRecordatorio()

    useEffect(() => {
        obtenerRecordatorioPorId(id)
    }, [id])

    const finalizar = async () => {
        await finalizarRecordatorio(id, {})
        navigate('/recordatorios')
    }

    if (!recordatorio || !recordatorio.id) {
        return (
            <div className="flex justify-center mt-10">
                <p>Cargando recordatorio...</p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between my-6">
                <h1 className="text-4xl font-bold text-zinc-950">
                    Detalle del recordatorio
                </h1>
                <Button onClick={() => navigate('/recordatorios')}>
                    Volver
                </Button>
            </div>

            {recordatorioError.length > 0 && (
                <div className="mb-4">
                    {recordatorioError.map((error, index) => (
                        <p key={index} className="text-red-500">
                            {error.message || error.error || error}
                        </p>
                    ))}
                </div>
            )}

            <div className="mt-6">
                <Card>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                Descripción
                            </p>
                            <p className="text-lg font-medium">
                                {recordatorio.descripcion}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Fecha
                            </p>
                            <p className="text-lg font-medium">
                                {new Date(recordatorio.fecha_evento).toLocaleDateString('es-AR')}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Hora
                            </p>
                            <p className="text-lg font-medium">
                                {recordatorio.hora_evento}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Aviso
                            </p>
                            <p className="text-lg font-medium">
                                {recordatorio.minutos_antes} minutos antes
                            </p>
                        </div>

                        <div className="pt-4">
                            <Button onClick={finalizar}>
                                Finalizar recordatorio
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default RecordatorioDetalle