import React from 'react'
import { useNotificacion } from '../../Context/NotificacionContexto'
import Notificacion from './Notificacion'

function Notificaciones() {
    const { notificacionesVisibles, quitarNotificacion } = useNotificacion();

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
            {notificacionesVisibles.map((notificacion) => (
                <Notificacion
                    key={notificacion.id}
                    notificacion={notificacion}
                    quitarNotificacion={quitarNotificacion}
                />
            ))}
        </div>
    )
}

export default Notificaciones