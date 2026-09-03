import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/ContextoAutorizacion.jsx'
import { useRecordatorio } from '../Context/RecordatorioContexto'
import RecordatorioCard from '../Components/recordatorios/RecordatorioCard'

function RecordatoriosPage() {

  const { estaAutorizado, cargando } = useAuth();

  const {
    recordatorios,
    obtenerRecordatorios,
    recordatorioError,
    eliminarRecordatorio,
    finalizarRecordatorio
  } = useRecordatorio();

  const navigate = useNavigate();

  useEffect(() => {
      if (!cargando && estaAutorizado) {
          obtenerRecordatorios()
      }
  }, [cargando, estaAutorizado])

  const darPorFinalizadoRecordatorio = async (id) => {
    const respuesta = await finalizarRecordatorio(id)

    if (respuesta) {
      obtenerRecordatorios();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between my-6">
        <h1 className="text-4xl text-black font-bold">Recordatorios</h1>
        <button onClick={() => navigate('/recordatorios/nuevo')} className="bg-[#5A1725] text-white px-4 py-2 rounded-md hover:bg-[#701D2D]">
           Nuevo recordatorio
        </button>
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

      {recordatorios.length === 0 ? (
        <p className="text-gray-600">No hay recordatorios para mostrar.</p>
        ) : (
              <div className="grid gap-4">
                {recordatorios.map((recordatorio) => (
                  <RecordatorioCard
                    key={recordatorio.id}
                    recordatorio={recordatorio}
                    eliminarRecordatorio={eliminarRecordatorio}
                    finalizarRecordatorio={darPorFinalizadoRecordatorio}
                  />
                ))}
              </div>
            )}
    </div>
  )
}

export default RecordatoriosPage