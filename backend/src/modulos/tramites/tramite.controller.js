import { pool } from "../../db.js";


/*
==========================================================
VERSIÓN CON AUTENTICACIÓN
==========================================================
*/

 /*
export const obtenerTramites = async (req, res) => {

    try {

        const result = await pool.query(`

            -- Obtenemos todos los trámites del usuario autenticado
            -- junto con el código de su tipo de trámite
            SELECT 
                tramites.*,
                tipos_tramite.codigo AS tipo_tramite

            FROM tramites

            -- Unimos ambas tablas mediante el tipo de trámite
            INNER JOIN tipos_tramite
                ON tramites.tipo_tramite_id = tipos_tramite.id

            -- Solamente obtenemos los trámites del usuario autenticado
            WHERE tramites.user_id = $1

        `, [req.userId]);

        return res.json(result.rows);

    } catch (error) {

        console.error("Error al obtener los trámites:", error);

        return res.status(500).json({
            error: "Error al obtener los trámites"
        });
    }
};


export const buscarTramites = async (req, res) => {

    // Obtenemos el texto ingresado en el buscador
    const { search } = req.query;

    try {

        const result = await pool.query(`

            -- Obtenemos los trámites del usuario autenticado
            -- junto con el código de su tipo de trámite
            SELECT 
                tramites.*,
                tipos_tramite.codigo AS tipo_tramite

            FROM tramites

            -- Unimos ambas tablas mediante el tipo de trámite
            INNER JOIN tipos_tramite
                ON tramites.tipo_tramite_id = tipos_tramite.id

            -- Solamente buscamos trámites del usuario autenticado
            WHERE tramites.user_id = $1

            -- La búsqueda puede hacerse:
            -- 1. Por número de carpeta exacto
            -- 2. Por nombre de cliente de forma parcial
            AND (
                tramites.numero_carpeta = $2
                OR LOWER(tramites.nombre_cliente) LIKE LOWER($3)
            )

        `, [
            req.userId,
            search,
            `%${search}%`
        ]);

        return res.json(result.rows);

    } catch (error) {

        console.error("Error al buscar trámites:", error);

        return res.status(500).json({
            error: "Error al buscar trámites"
        });
    }
};


export const crearTramite = async (req, res, next) => {

    // Obtenemos los datos enviados desde el frontend
    const {
        tipo_tramite_id,
        numero_carpeta,
        nombre_cliente
    } = req.body;

    try {

        const result = await pool.query(`

            -- Creamos el nuevo trámite
            INSERT INTO tramites (
                tipo_tramite_id,
                user_id,
                numero_carpeta,
                nombre_cliente
            )

            VALUES ($1, $2, $3, $4)

            -- Devolvemos el trámite creado
            RETURNING *

        `, [
            tipo_tramite_id,
            req.userId,
            numero_carpeta,
            nombre_cliente
        ]);

        return res.status(201).json(result.rows[0]);

    } catch (error) {

        if (error.code === "23505") {

            return res.status(409).json({
                message: "El trámite ya existe"
            });
        }

        next(error);
    }
};


export const actualizarTramite = async (req, res) => {

    // Obtenemos el ID del trámite desde la URL
    const { id } = req.params;

    // Obtenemos los datos que queremos modificar
    const {
        tipo_tramite_id,
        nombre_cliente
    } = req.body;

    try {

        const result = await pool.query(`

            -- Actualizamos el trámite
            UPDATE tramites

            SET tipo_tramite_id = $1,
                nombre_cliente = $2,
                updated_at = CURRENT_TIMESTAMP

            -- Buscamos el trámite por su ID
            WHERE id = $3

            -- Verificamos que pertenezca al usuario autenticado
            AND user_id = $4

            -- Devolvemos el trámite actualizado
            RETURNING *

        `, [
            tipo_tramite_id,
            nombre_cliente,
            id,
            req.userId
        ]);

        // Si no encontramos el trámite
        // significa que no existe o no pertenece al usuario
        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Trámite no encontrado"
            });
        }

        return res.json(result.rows[0]);

    } catch (error) {

        console.error("Error al actualizar el trámite:", error);

        return res.status(500).json({
            error: "Error al actualizar el trámite"
        });
    }
};


export const darDeBajaTramite = async (req, res) => {

    // Obtenemos el ID del trámite desde la URL
    const { id } = req.params;

    try {

        const result = await pool.query(`

            -- Cambiamos el estado del trámite a "baja"
            UPDATE tramites

            SET estado = 'baja',
                updated_at = CURRENT_TIMESTAMP

            -- Buscamos el trámite por su ID
            WHERE id = $1

            -- Verificamos que pertenezca al usuario autenticado
            AND user_id = $2

            -- Solamente permitimos dar de baja un trámite que esté en proceso
            AND estado = 'en_proceso'

            -- Devolvemos el trámite actualizado
            RETURNING *

        `, [
            id,
            req.userId
        ]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Trámite no encontrado o no se encuentra en proceso"
            });
        }

        return res.json(result.rows[0]);

    } catch (error) {

        console.error("Error al dar de baja el trámite:", error);

        return res.status(500).json({
            error: "Error al dar de baja el trámite"
        });
    }
};


export const enviarAReactivarTramite = async (req, res) => {

    // Obtenemos el ID del trámite desde la URL
    const { id } = req.params;

    try {

        const result = await pool.query(`

            -- Cambiamos el estado del trámite a "reactivar"
            UPDATE tramites

            SET estado = 'reactivar',
                updated_at = CURRENT_TIMESTAMP

            -- Buscamos el trámite por su ID
            WHERE id = $1

            -- Verificamos que pertenezca al usuario autenticado
            AND user_id = $2

            -- Solamente permitimos enviar a reactivar un trámite que esté en proceso
            AND estado = 'en_proceso'

            -- Devolvemos el trámite actualizado
            RETURNING *

        `, [
            id,
            req.userId
        ]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Trámite no encontrado o no se encuentra en proceso"
            });
        }

        return res.json(result.rows[0]);

    } catch (error) {

        console.error(
            "Error al enviar el trámite a reactivar:",
            error
        );

        return res.status(500).json({
            error: "Error al enviar el trámite a reactivar"
        });
    }
};


export const reactivarTramite = async (req, res) => {

    // Obtenemos el ID del trámite desde la URL
    const { id } = req.params;

    try {

        const result = await pool.query(`

            -- Volvemos a poner el trámite en proceso
            UPDATE tramites

            SET estado = 'en_proceso',
                updated_at = CURRENT_TIMESTAMP

            -- Buscamos el trámite por su ID
            WHERE id = $1

            -- Verificamos que pertenezca al usuario autenticado
            AND user_id = $2

            -- Solamente permitimos reactivar un trámite que esté en estado "reactivar"
            AND estado = 'reactivar'

            -- Devolvemos el trámite actualizado
            RETURNING *

        `, [
            id,
            req.userId
        ]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Trámite no encontrado o no se encuentra en reactivar"
            });
        }

        return res.json(result.rows[0]);

    } catch (error) {

        console.error("Error al reactivar el trámite:", error);

        return res.status(500).json({
            error: "Error al reactivar el trámite"
        });
    }
};

export const eliminarTramite = async (req, res) => {

    // Obtenemos el ID del trámite desde la URL
    const { id } = req.params;

    try {

        const result = await pool.query(`

            -- Eliminamos el trámite
            DELETE FROM tramites

            -- Buscamos el trámite por su ID
            WHERE id = $1

            -- Verificamos que pertenezca al usuario autenticado
            AND user_id = $2

        `, [
            id,
            req.userId
        ]);

        if (result.rowCount === 0) {

            return res.status(404).json({
                message: "Trámite no encontrado"
            });
        }

        return res.sendStatus(204);

    } catch (error) {

        console.error("Error al eliminar el trámite:", error);

        return res.status(500).json({
            error: "Error al eliminar el trámite"
        });
    }
};

*/


/*
==========================================================
VERSIÓN SIN AUTENTICACIÓN
SOLAMENTE PARA REALIZAR LAS PRUEBAS ACTUALES
==========================================================
*/


export const obtenerTramites = async (req, res) => {

    try {

        const result = await pool.query(`

            -- Obtenemos todos los trámites
            -- junto con el código de su tipo de trámite
            SELECT 
                tramites.*,
                tipos_tramite.codigo AS tipo_tramite

            FROM tramites

            -- Unimos ambas tablas mediante el tipo de trámite
            INNER JOIN tipos_tramite
                ON tramites.tipo_tramite_id = tipos_tramite.id

        `);

        return res.json(result.rows);

    } catch (error) {

        console.error("Error al obtener los trámites:", error);

        return res.status(500).json({
            error: "Error al obtener los trámites"
        });
    }
};


export const buscarTramites = async (req, res) => {

    // Obtenemos el texto ingresado en el buscador
    const { search } = req.query;

    try {

        const result = await pool.query(`

            -- Obtenemos los trámites que coincidan
            -- con el número de carpeta o nombre del cliente
            SELECT 
                tramites.*,
                tipos_tramite.codigo AS tipo_tramite

            FROM tramites

            -- Unimos ambas tablas mediante el tipo de trámite
            INNER JOIN tipos_tramite
                ON tramites.tipo_tramite_id = tipos_tramite.id

            -- La búsqueda puede hacerse:
            -- 1. Por número de carpeta exacto
            -- 2. Por nombre del cliente de forma parcial
            WHERE 
                tramites.numero_carpeta = $1
                OR LOWER(tramites.nombre_cliente) LIKE LOWER($2)

        `, [
            search,
            `%${search}%`
        ]);

        return res.json(result.rows);

    } catch (error) {

        console.error("Error al buscar trámites:", error);

        return res.status(500).json({
            error: "Error al buscar trámites"
        });
    }
};


export const crearTramite = async (req, res, next) => {

    // Obtenemos los datos enviados desde el frontend
    const {
        tipo_tramite_id,
        numero_carpeta,
        nombre_cliente,
        user_id
    } = req.body;

    try {

        const result = await pool.query(`

            -- Creamos el nuevo trámite
            INSERT INTO tramites (
                tipo_tramite_id,
                user_id,
                numero_carpeta,
                nombre_cliente
            )

            VALUES ($1, $2, $3, $4)

            -- Devolvemos el trámite creado
            RETURNING *

        `, [
            tipo_tramite_id,
            user_id,
            numero_carpeta,
            nombre_cliente
        ]);

        return res.status(201).json(result.rows[0]);

    } catch (error) {

        if (error.code === "23505") {

            return res.status(409).json({
                message: "El trámite ya existe"
            });
        }

        next(error);
    }
};


export const actualizarTramite = async (req, res) => {

    // Obtenemos el ID del trámite desde la URL
    const { id } = req.params;

    // Obtenemos los datos que queremos modificar
    const {
        tipo_tramite_id,
        nombre_cliente
    } = req.body;

    try {

        const result = await pool.query(`

            -- Actualizamos el trámite
            UPDATE tramites

            SET tipo_tramite_id = $1,
                nombre_cliente = $2,
                updated_at = CURRENT_TIMESTAMP

            -- Buscamos el trámite por su ID
            WHERE id = $3

            -- Devolvemos el trámite actualizado
            RETURNING *

        `, [
            tipo_tramite_id,
            nombre_cliente,
            id
        ]);

        // Si no encontramos el trámite
        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Trámite no encontrado"
            });
        }

        return res.json(result.rows[0]);

    } catch (error) {

        console.error("Error al actualizar el trámite:", error);

        return res.status(500).json({
            error: "Error al actualizar el trámite"
        });
    }
};


export const darDeBajaTramite = async (req, res) => {

    // Obtenemos el ID del trámite desde la URL
    const { id } = req.params;

    try {

        const result = await pool.query(`

            -- Cambiamos el estado del trámite a "baja"
            UPDATE tramites

            SET estado = 'baja',
                updated_at = CURRENT_TIMESTAMP

            -- Buscamos el trámite por su ID
            WHERE id = $1

            -- Solamente permitimos dar de baja un trámite que esté en proceso
            AND estado = 'en_proceso'

            -- Devolvemos el trámite actualizado
            RETURNING *

        `, [id]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Trámite no encontrado o no se encuentra en proceso"
            });
        }

        return res.json(result.rows[0]);

    } catch (error) {

        console.error("Error al dar de baja el trámite:", error);

        return res.status(500).json({
            error: "Error al dar de baja el trámite"
        });
    }
};


export const enviarAReactivarTramite = async (req, res) => {

    // Obtenemos el ID del trámite desde la URL
    const { id } = req.params;

    try {

        const result = await pool.query(`

            -- Cambiamos el estado del trámite a "reactivar"
            UPDATE tramites

            SET estado = 'reactivar',
                updated_at = CURRENT_TIMESTAMP

            -- Buscamos el trámite por su ID
            WHERE id = $1

            -- Solamente permitimos enviar a reactivar un trámite que esté en proceso
            AND estado = 'en_proceso'

            -- Devolvemos el trámite actualizado
            RETURNING *

        `, [id]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Trámite no encontrado o no se encuentra en proceso"
            });
        }

        return res.json(result.rows[0]);

    } catch (error) {

        console.error("Error al enviar el trámite a reactivar:", error);

        return res.status(500).json({
            error: "Error al enviar el trámite a reactivar"
        });
    }
};


export const reactivarTramite = async (req, res) => {

    // Obtenemos el ID del trámite desde la URL
    const { id } = req.params;

    try {

        const result = await pool.query(`

            -- Volvemos a poner el trámite en proceso
            UPDATE tramites

            SET estado = 'en_proceso',
                updated_at = CURRENT_TIMESTAMP

            -- Buscamos el trámite por su ID
            WHERE id = $1

            -- Solamente permitimos reactivar un trámite que esté en estado "reactivar"
            AND estado = 'reactivar'

            -- Devolvemos el trámite actualizado
            RETURNING *

        `, [id]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Trámite no encontrado o no se encuentra en reactivar"
            });
        }

        return res.json(result.rows[0]);

    } catch (error) {

        console.error("Error al reactivar el trámite:", error);

        return res.status(500).json({
            error: "Error al reactivar el trámite"
        });
    }
};

export const eliminarTramite = async (req, res) => {

    // Obtenemos el ID del trámite desde la URL
    const { id } = req.params;

    try {

        const result = await pool.query(`

            -- Eliminamos el trámite
            DELETE FROM tramites

            -- Buscamos el trámite por su ID
            WHERE id = $1

        `, [id]);

        if (result.rowCount === 0) {

            return res.status(404).json({
                message: "Trámite no encontrado"
            });
        }

        return res.sendStatus(204);

    } catch (error) {

        console.error("Error al eliminar el trámite:", error);

        return res.status(500).json({
            error: "Error al eliminar el trámite"
        });
    }
};