import { pool } from "../../db.js";

 
export const obtenerTramites = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                tramites.*,
                tipos_tramite.codigo AS tipo_tramite,

                COUNT(tramite_documentos.id) AS documentos_total,

                COUNT(
                    CASE
                        WHEN tramite_documentos.estado = 'recibido'
                        OR tramite_documentos.estado = 'cargado'
                        THEN 1
                    END
                ) AS documentos_completados

            FROM tramites

            INNER JOIN tipos_tramite
                ON tramites.tipo_tramite_id = tipos_tramite.id

            LEFT JOIN tramite_documentos
                ON tramites.id = tramite_documentos.tramite_id

            WHERE tramites.user_id = $1
            AND tramites.estado = 'en_proceso'

            GROUP BY
                tramites.id,
                tipos_tramite.codigo

        `, [req.userId]);

        return res.json(result.rows);

    } catch (error) {
        console.error("Error al obtener los trámites:", error);

        return res.status(500).json({
            error: "Error al obtener los trámites"
        });
    }
};

export const obtenerTramitePorId = async (req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(`
            SELECT
            tramites.*,
            tipos_tramite.codigo AS tipo_tramite,
            EXISTS (
                SELECT 1
                FROM tramite_documentos
                INNER JOIN documentos
                    ON tramite_documentos.documento_id = documentos.id
                WHERE tramite_documentos.tramite_id = tramites.id
                AND documentos.nombre = 'Declaración testimonial'
            ) AS intervencion_policial
            FROM tramites
            INNER JOIN tipos_tramite
                ON tramites.tipo_tramite_id = tipos_tramite.id
            WHERE tramites.id = $1
            AND tramites.user_id = $2
        `, [
            id,
            req.userId
        ]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Trámite no encontrado"
            });

        }

        return res.json(result.rows[0]);

    } catch (error) {

        console.error(
            "Error al obtener el trámite:",
            error
        );

        return res.status(500).json({
            error: "Error al obtener el trámite"
        });
    }
};

export const obtenerTipoTramite = async (req, res) => {
    try {

        const result = await pool.query('SELECT * FROM tipos_tramite');

        return res.json(result.rows)
        
    } catch (error) {
        console.error(
            "Error al obtener el trámite:",
            error
        );

        return res.status(500).json({
            error: "Error al obtener el trámite"
        });
    }
}

export const buscarTramites = async (req, res) => {

    // Obtenemos el texto ingresado en el buscador
    const { search } = req.query;

    try {

        // Buscamos los trámites del usuario junto con su tipo
        // y la cantidad de documentación completa
        const result = await pool.query(`

            SELECT

                tramites.*,

                tipos_tramite.codigo AS tipo_tramite,

                COUNT(tramite_documentos.id) AS documentos_total,

                COUNT(
                    CASE
                        WHEN tramite_documentos.estado = 'recibido'
                        OR tramite_documentos.estado = 'cargado'
                        THEN 1
                    END
                ) AS documentos_completados

            FROM tramites

            -- Unimos el trámite con su tipo
            INNER JOIN tipos_tramite
                ON tramites.tipo_tramite_id = tipos_tramite.id

            -- Obtenemos los documentos correspondientes al trámite
            LEFT JOIN tramite_documentos
                ON tramites.id = tramite_documentos.tramite_id

            -- Solamente buscamos trámites del usuario autenticado
            WHERE tramites.user_id = $1

            -- La búsqueda puede hacerse:
            -- 1. Por número de carpeta exacto
            -- 2. Por nombre de cliente de forma parcial
            AND (
                tramites.numero_carpeta = $2
                OR LOWER(tramites.nombre_cliente) LIKE LOWER($3)
            )

            GROUP BY
                tramites.id,
                tipos_tramite.codigo

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

    const {
        tipo_tramite_id,
        numero_carpeta,
        nombre_cliente,
        intervencion_policial
    } = req.body;

    const client = await pool.connect();

    try {

        // Iniciamos una transacción
        await client.query('BEGIN');

        // Creamos el trámite
        const tramiteResult = await client.query(`
            INSERT INTO tramites (
                tipo_tramite_id,
                user_id,
                numero_carpeta,
                nombre_cliente
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [
            tipo_tramite_id,
            req.userId,
            numero_carpeta,
            nombre_cliente
        ]);

        const tramite = tramiteResult.rows[0];

        // Buscamos los documentos normales que corresponden al tipo de trámite
        const documentosResult = await client.query(`
            SELECT tipo_tramite_documentos.documento_id
            FROM tipo_tramite_documentos
            INNER JOIN documentos
                ON tipo_tramite_documentos.documento_id = documentos.id
            WHERE tipo_tramite_documentos.tipo_tramite_id = $1
            AND documentos.nombre <> 'Declaración testimonial'
        `, [tipo_tramite_id]);

        // Creamos los documentos correspondientes al trámite
        for (const documento of documentosResult.rows) {

            await client.query(`
                INSERT INTO tramite_documentos (
                    tramite_id,
                    documento_id
                )
                VALUES ($1, $2)
            `, [
                tramite.id,
                documento.documento_id
            ]);
        }

        // Si hubo intervención policial, buscamos y agregamos la declaración testimonial
        if (intervencion_policial === "si") {

            const declaracionResult = await client.query(`
                SELECT id
                FROM documentos
                WHERE nombre = 'Declaración testimonial'
            `);

            if (declaracionResult.rows.length > 0) {

                await client.query(`
                    INSERT INTO tramite_documentos (
                        tramite_id,
                        documento_id
                    )
                    VALUES ($1, $2)
                `, [
                    tramite.id,
                    declaracionResult.rows[0].id
                ]);
            }
        }

        // Confirmamos todos los cambios
        await client.query('COMMIT');

        // Devolvemos el trámite creado
        return res.status(201).json({
            tramite,
            documentos_creados:
                documentosResult.rowCount +
                (intervencion_policial === "si" ? 1 : 0)
        });

    } catch (error) {

        // Si algo falla, deshacemos todos los cambios
        await client.query('ROLLBACK');

        console.error('Error al crear el trámite:', error);

        if (error.code === "23505") {
            return res.status(409).json({
                message: "El trámite ya existe"
            });
        }

        next(error);

    } finally {

        // Liberamos la conexión
        client.release();
    }
};

export const actualizarTramite = async (req, res) => {

    // Obtenemos el ID del trámite desde la URL
    const { id } = req.params;

    // Obtenemos los datos que queremos modificar
    const {
        tipo_tramite_id,
        nombre_cliente,
        intervencion_policial
    } = req.body;

    const client = await pool.connect();

    try {

        // Iniciamos una transacción
        await client.query('BEGIN');

        // Actualizamos el trámite
        const tramiteResult = await client.query(`
            UPDATE tramites

            SET tipo_tramite_id = $1,
                nombre_cliente = $2,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = $3
            AND user_id = $4

            RETURNING *
        `, [
            tipo_tramite_id,
            nombre_cliente,
            id,
            req.userId
        ]);

        // Si no encontramos el trámite
        if (tramiteResult.rows.length === 0) {

            await client.query('ROLLBACK');

            return res.status(404).json({
                message: "Trámite no encontrado"
            });
        }

        // Buscamos los documentos que corresponden al nuevo tipo de trámite
        const documentosNuevosResult = await client.query(`
            SELECT documento_id
            FROM tipo_tramite_documentos
            WHERE tipo_tramite_id = $1
        `, [tipo_tramite_id]);

        // Eliminamos los documentos que ya no corresponden
        // al nuevo tipo de trámite
        await client.query(`
            DELETE FROM tramite_documentos
            WHERE tramite_id = $1
            AND documento_id NOT IN (
                SELECT tipo_tramite_documentos.documento_id
                FROM tipo_tramite_documentos
                INNER JOIN documentos
                    ON tipo_tramite_documentos.documento_id = documentos.id
                WHERE tipo_tramite_documentos.tipo_tramite_id = $2
                AND documentos.nombre <> 'Declaración testimonial'
            )
            AND documento_id IN (
                SELECT documentos.id
                FROM documentos
                WHERE documentos.nombre <> 'Declaración testimonial'
            )
        `, [
            id,
            tipo_tramite_id
        ]);

        // Agregamos los documentos nuevos que todavía no existen
        // para este trámite
        await client.query(`
            INSERT INTO tramite_documentos (
                tramite_id,
                documento_id,
                estado
            )
            SELECT
                $1,
                tipo_tramite_documentos.documento_id,
                'no_pedido'
            FROM tipo_tramite_documentos
            WHERE tipo_tramite_documentos.tipo_tramite_id = $2
            AND NOT EXISTS (
                SELECT 1
                FROM tramite_documentos
                WHERE tramite_documentos.tramite_id = $1
                AND tramite_documentos.documento_id =
                    tipo_tramite_documentos.documento_id
            )
            AND tipo_tramite_documentos.documento_id NOT IN (
                SELECT documentos.id
                FROM documentos
                WHERE documentos.nombre = 'Declaración testimonial'
            )
        `, [
            id,
            tipo_tramite_id
        ]);
        
        const declaracionResult = await client.query(`
            SELECT id
            FROM documentos
            WHERE nombre = 'Declaración testimonial'
        `);

        if (declaracionResult.rows.length > 0) {

            const declaracionId = declaracionResult.rows[0].id;

            if (intervencion_policial === "si") {

                await client.query(`
                    INSERT INTO tramite_documentos (
                        tramite_id,
                        documento_id,
                        estado
                    )
                    SELECT $1, $2, 'no_pedido'
                    WHERE NOT EXISTS (
                        SELECT 1
                        FROM tramite_documentos
                        WHERE tramite_documentos.tramite_id = $1
                        AND tramite_documentos.documento_id = $2
                    )
                `, [
                    id,
                    declaracionId
                ]);

            } else {

                await client.query(`
                    DELETE FROM tramite_documentos
                    WHERE tramite_id = $1
                    AND documento_id = $2
                `, [
                    id,
                    declaracionId
                ]);
            }
        }

        // Confirmamos todos los cambios
        await client.query('COMMIT');

        // Devolvemos el trámite actualizado
        return res.json({
            tramite: tramiteResult.rows[0],
            documentos: documentosNuevosResult.rowCount
        });

    } catch (error) {

        // Si algo falla, deshacemos todos los cambios
        await client.query('ROLLBACK');

        console.error("Error al actualizar el trámite:", error);

        return res.status(500).json({
            error: "Error al actualizar el trámite"
        });

    } finally {

        // Liberamos la conexión
        client.release();
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
            AND estado = 'reactivar'

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

export const finalizarTramite = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            UPDATE tramites
            SET estado = 'finalizado',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            AND user_id = $2
            AND estado = 'en_proceso'
            AND NOT EXISTS (
                SELECT 1
                FROM tramite_documentos
                WHERE tramite_documentos.tramite_id = tramites.id
                AND tramite_documentos.estado NOT IN ('recibido', 'cargado')
            )
            RETURNING *
        `, [
            id,
            req.userId
        ]);

        if (result.rows.length === 0) {
            return res.status(400).json({
                message: "El trámite no puede finalizarse porque no está completo"
            });
        }

        return res.json(result.rows[0]);

    } catch (error) {
        console.error("Error al finalizar el trámite:", error);

        return res.status(500).json({
            error: "Error al finalizar el trámite"
        });
    }
};

export const reactivarTramiteEnviadoABaja = async (req, res) => {

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

            -- Solamente permitimos reactivar un trámite que esté en estado "baja"
            AND estado = 'baja'

            -- Devolvemos el trámite actualizado
            RETURNING *

        `, [
            id,
            req.userId
        ]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Trámite no encontrado o no se encuentra en baja"
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

export const obtenerTramitesPorEstado = async (req, res) => {
    const { estado } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                tramites.*,
                tipos_tramite.codigo AS tipo_tramite,
                COUNT(tramite_documentos.id) AS documentos_total,
                COUNT(
                    CASE
                        WHEN tramite_documentos.estado = 'recibido'
                        OR tramite_documentos.estado = 'cargado'
                        THEN 1
                    END
                ) AS documentos_completados
            FROM tramites
            INNER JOIN tipos_tramite
                ON tramites.tipo_tramite_id = tipos_tramite.id
            LEFT JOIN tramite_documentos
                ON tramites.id = tramite_documentos.tramite_id
            WHERE tramites.user_id = $1
            AND tramites.estado = $2
            GROUP BY
                tramites.id,
                tipos_tramite.codigo
        `, [
            req.userId,
            estado
        ]);

        return res.json(result.rows);

    } catch (error) {
        console.error("Error al obtener los trámites por estado:", error);

        return res.status(500).json({
            error: "Error al obtener los trámites por estado"
        });
    }
};

export const obtenerResumenDashboard = async (req, res) => {

    try {

        // Obtengo la cantidad de trámites activos, finalizados, de baja y en reactivar
        const tramites = await pool.query(`
            SELECT
                COUNT(*) FILTER (WHERE estado = 'en_proceso') AS tramites_activos,
                COUNT(*) FILTER (WHERE estado = 'finalizado') AS tramites_completos,
                COUNT(*) FILTER (WHERE estado = 'baja') AS tramites_baja,
                COUNT(*) FILTER (WHERE estado = 'reactivar') AS tramites_reactivar
            FROM tramites
            WHERE user_id = $1
        `, [req.userId]);

        // Obtengo la cantidad de documentación que todavía está pendiente
        const documentos = await pool.query(`
            SELECT COUNT(*) AS documentacion_pendiente
            FROM tramite_documentos
            INNER JOIN tramites
                ON tramite_documentos.tramite_id = tramites.id
            WHERE tramites.user_id = $1
            AND tramites.estado = 'en_proceso'
            AND tramite_documentos.estado NOT IN ('recibido', 'cargado')
        `, [req.userId]);

        return res.json({
            tramites_activos: Number(tramites.rows[0].tramites_activos),
            tramites_completos: Number(tramites.rows[0].tramites_completos),
            documentacion_pendiente: Number(documentos.rows[0].documentacion_pendiente),
            tramites_baja: Number(tramites.rows[0].tramites_baja),
            tramites_reactivar: Number(tramites.rows[0].tramites_reactivar)
        });

    } catch (error) {

        console.error("Error al obtener el resumen del dashboard:", error);

        return res.status(500).json({
            error: "Error al obtener el resumen del dashboard"
        });
    }
};