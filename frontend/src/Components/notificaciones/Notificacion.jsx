import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Notificacion({ notificacion, quitarNotificacion }) {
    const navigate = useNavigate();

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
        </div>
    )
}

export default Notificacion