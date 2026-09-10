import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useRecordatorio } from './RecordatorioContexto'
import { useAuth } from './ContextoAutorizacion'
import axios from '../Api/axios.js'
export const NotificacionContexto = createContext();

export const useNotificacion = () => {
    const context = useContext(NotificacionContexto);

    if (!context) {
        throw new Error("useNotificacion debe utilizarse dentro del NotificacionProvider");
    }

    return context;
}

export function NotificacionProvider({ children }) {
    const { recordatorios, obtenerRecordatorios } = useRecordatorio();
    const [notificaciones, setNotificaciones] = useState([]);
    const { estaAutorizado, cargando } = useAuth();

    // Guardo cuándo notifiqué cada recordatorio para no repetirlo al actualizar la página.
    const recordatoriosNotificados = useRef(
        JSON.parse(localStorage.getItem('recordatoriosNotificados') || '{}')
    );

    useEffect(() => {

        // Espero a que termine de verificarse la sesión y solamente continúo si estoy autenticado.
        if (cargando || !estaAutorizado) {
            return;
        }

        // Obtengo los recordatorios al iniciar la aplicación.
        obtenerRecordatorios();

        // Vuelvo a consultar cada 10 segundos para detectar nuevos recordatorios.
        const intervalo = setInterval(() => {
            obtenerRecordatorios();
        }, 10000);

        return () => clearInterval(intervalo);
    }, [cargando, estaAutorizado]);

    useEffect(() => {
        const ahora = new Date();

        const recordatoriosParaNotificar = recordatorios
            .map((recordatorio) => {
                if (recordatorio.completado) {
                    return null;
                }

                // Armo la fecha y hora del recordatorio usando la fecha como fecha local.
                // Evito new Date(fecha_evento) porque la fecha llega en UTC y puede correrse al día anterior.

                const [año, mes, dia] = recordatorio.fecha_evento
                    .slice(0, 10)
                    .split('-')
                    .map(Number);

                const [hora, minutos] = recordatorio.hora_evento
                    .split(':')
                    .map(Number);

                const fecha = new Date(
                    año,
                    mes - 1,
                    dia,
                    hora,
                    minutos,
                    0,
                    0
                );

                // Calculo cuándo tiene que aparecer la notificación.
                const tiempoNotificacion = new Date(fecha);
                tiempoNotificacion.setMinutes(
                    tiempoNotificacion.getMinutes() - Number(recordatorio.minutos_antes)
                );

                const tiempoNotificacionActual = tiempoNotificacion.getTime();
                const fechaNotificacionAnterior =
                    recordatoriosNotificados.current[recordatorio.id];

                // Si ya notifiqué este recordatorio para esta fecha y hora,
                // no lo vuelvo a mostrar al actualizar la página.
                if (fechaNotificacionAnterior === tiempoNotificacionActual) {
                    return null;
                }

                const diferencia =
                    ahora.getTime() - tiempoNotificacionActual;

                // Solo notifico durante los primeros 30 segundos desde la hora indicada.
                if (diferencia >= 0 && diferencia <= 30000) {
                    return {
                        recordatorio,
                        tiempoNotificacionActual
                    };
                }
                return null;
            })
            .filter(Boolean);

        if (recordatoriosParaNotificar.length === 0) {
            return;
        }

        setNotificaciones((notificacionesActuales) => [
            ...notificacionesActuales,

            ...recordatoriosParaNotificar.map(
                ({ recordatorio }) => recordatorio
            )

        ]);

        recordatoriosParaNotificar.forEach(
            ({ recordatorio, tiempoNotificacionActual }) => {

                // Guardo cuándo lo notifiqué para no volver a mostrarlo al actualizar la página.

                recordatoriosNotificados.current[recordatorio.id] =
                    tiempoNotificacionActual;

                localStorage.setItem(

                    'recordatoriosNotificados',

                    JSON.stringify(recordatoriosNotificados.current)

                );

                // Muestro también la notificación nativa del navegador.

                mostrarNotificacionNativa(recordatorio);

            }
        );

    }, [recordatorios]);

    // Muestro en el título cuántas notificaciones tengo pendientes.
    useEffect(() => {
        document.title = notificaciones.length > 0
            ? `(${notificaciones.length}) Sistema D&B`
            : 'Sistema D&B';
    }, [notificaciones.length]);

    const quitarNotificacion = (id) => {
        setNotificaciones((notificacionesActuales) =>
            notificacionesActuales.filter(
                (notificacion) => notificacion.id !== id
            )
        );
    };

    const solicitarPermisoNotificaciones = async () => {
        if (!("Notification" in window)) {
            return false;
        }
        const permiso = await Notification.requestPermission();
        return permiso === "granted";
    };

    const mostrarNotificacionNativa = async (recordatorio) => {
        if (!("Notification" in window)) {
            return;
        }

        if (Notification.permission !== "granted") {
            return;
        }

        try {
            // Espero a que el Service Worker esté disponible.
            const registro = await navigator.serviceWorker.ready;

            // Le pido al Service Worker que muestre la notificación nativa.
            await registro.showNotification("Sistema D&B", {
                body: recordatorio.descripcion,
                tag: recordatorio.id,
                data: {
                    id: recordatorio.id
                }
            });
        } catch (error) {

            console.error(
                'Error al mostrar la notificación nativa:',
                error
            );

        }
    };

    const posponerRecordatorio = async (id, minutos) => {

        try {
            const respuesta = await axios.put(
                `/recordatorios/${id}/posponer`,
                { minutos }
            );

            quitarNotificacion(id);
            obtenerRecordatorios();

            return respuesta.data;
        } catch (error) {
            console.error(
                'Error al posponer el recordatorio:',
                error
            );
        }
    };

    return (
        <NotificacionContexto.Provider value={{
            notificaciones,
            quitarNotificacion,
            solicitarPermisoNotificaciones,
            posponerRecordatorio
        }}>
            {children}
        </NotificacionContexto.Provider>
    );
}