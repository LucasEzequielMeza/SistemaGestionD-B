self.addEventListener('notificationclick', (event) => {

    // Cierro la notificación cuando el usuario hace clic.
    event.notification.close();

    // Obtengo el id del recordatorio que guardé en la notificación.
    const id = event.notification.data?.id;

    // Si la notificación no tiene id, no hago nada.
    if (!id) {
        return;
    }

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then((ventanas) => {

            // Busco si D&B ya está abierto.
            for (const ventana of ventanas) {

                ventana.focus();

                // Llevo al usuario directamente al recordatorio.
                return ventana.navigate(
                    `/recordatorios/${id}`
                );
            }

            // Si D&B no está abierto, lo abro directamente en el recordatorio.
            return clients.openWindow(
                `/recordatorios/${id}`
                
            );
        })
    );
});