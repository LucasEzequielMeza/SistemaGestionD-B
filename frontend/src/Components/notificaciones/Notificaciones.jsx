import React from 'react'
import { useNotificacion } from '../../Context/NotificacionContexto'
import Notificacion from './Notificacion'

function Notificaciones() {
    const { notificaciones, quitarNotificacion } = useNotificacion();

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
            {notificaciones.map((notificacion) => (
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