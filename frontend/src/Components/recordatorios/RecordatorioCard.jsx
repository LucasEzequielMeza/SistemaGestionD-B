import React from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../UI/Card'
import Button from '../UI/Button'

function RecordatorioCard({recordatorio, eliminarRecordatorio, finalizarRecordatorio}) {

  const navigate = useNavigate()

  const formatearFecha = (fecha) => { 

    const [año, mes, dia] = fecha.slice(0, 10).split('-')

    return `${dia}/${mes}/${año}`
  }

  const formatearHora = (hora) => {
    return hora.slice(0, 5);
  };

  return (
    <Card>
      <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-xl font-bold text-white">
              {recordatorio.descripcion}
            </h2>
            </div>
              <div className="text-white">
                  <p>
                      <span className="font-bold">Fecha:</span>{' '}
                      {formatearFecha(recordatorio.fecha_evento)}
                  </p>
                  <p>
                      <span className="font-bold">Hora:</span>{' '}
                      {formatearHora(recordatorio.hora_evento)}
                  </p>
                  <p>
                      <span className="font-bold">Aviso:</span>{' '}
                      {recordatorio.minutos_antes} minutos antes
                  </p>
              </div>
              <div className="flex gap-2">
                    {!recordatorio.completado && (
                        <Button
                            onClick={() => finalizarRecordatorio(recordatorio.id)}>
                            Finalizar
                        </Button>
                    )}
              <Button onClick={() => navigate(`/recordatorios/${recordatorio.id}/edit`)}>
                Editar
              </Button>

              <Button onClick={() => eliminarRecordatorio(recordatorio.id)}>
                Eliminar
              </Button>
            </div>
        </div>
    </Card>
  )
}

export default RecordatorioCard