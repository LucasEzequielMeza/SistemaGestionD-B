import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotificacion } from '../../Context/NotificacionContexto';

function Notificacion({ notificacion, quitarNotificacion }) {
    const navigate = useNavigate();

    const [mostrarOpciones, setMostrarOpciones] = useState(false);

    const {posponerRecordatorio} = useNotificacion()

    useEffect(() => {
        // Hago que la notificación desaparezca automáticamente después de 20 segundos.
        const tiempo = setTimeout(() => {
            quitarNotificacion(notificacion.id);
        }, 20000);

        return () => clearTimeout(tiempo);
    }, [notificacion.id]);

    const abrirRecordatorio = () => {
        // Quito la notificación antes de abrir el recordatorio.
        quitarNotificacion(notificacion.id);
        navigate(`/recordatorios/${notificacion.id}`);
    };

    const posponer = async (minutos) => {

        await posponerRecordatorio(notificacion.id, minutos);

    };

    return (
        <div
            onClick={abrirRecordatorio}
            className="relative w-80 bg-zinc-800 text-white p-4 rounded-lg shadow-lg cursor-pointer hover:bg-zinc-700">
            <button
                onClick={(event) => {
                    event.stopPropagation();
                    quitarNotificacion(notificacion.id);
                }}
                className="absolute top-2 right-2 text-gray-400 hover:text-white">✕</button>

            <h3 className="font-bold text-lg pr-5">Recordatorio</h3>
            <p className="mt-2">
                {notificacion.descripcion}
            </p>
            <div
                className="mt-4"
                onClick={(event) => event.stopPropagation()}
            >

                {!mostrarOpciones ? (
                    <button
                        onClick={() => setMostrarOpciones(true)}
                        className="bg-[#5A1725] hover:bg-[#701D2D] px-3 py-1.5 rounded-md text-sm"
                    >
                        Posponer
                    </button>
                ) : (
                    <div className="flex gap-2">

                        <button
                            onClick={() => posponer(5)}
                            className="bg-[#5A1725] hover:bg-[#701D2D] px-3 py-1.5 rounded-md text-sm"
                        >
                            5 min
                        </button>

                        <button
                            onClick={() => posponer(10)}
                            className="bg-[#5A1725] hover:bg-[#701D2D] px-3 py-1.5 rounded-md text-sm"
                        >
                            10 min
                        </button>

                        <button
                            onClick={() => posponer(15)}
                            className="bg-[#5A1725] hover:bg-[#701D2D] px-3 py-1.5 rounded-md text-sm"
                        >
                            15 min
                        </button>

                        <button
                            onClick={() => posponer(30)}
                            className="bg-[#5A1725] hover:bg-[#701D2D] px-3 py-1.5 rounded-md text-sm"
                        >
                            30 min
                        </button>

                    </div>
                )}

            </div>
        </div>
    )
}

export default Notificacion