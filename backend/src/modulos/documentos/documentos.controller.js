import { pool } from "../../db.js";

export const obtenerDocumentosPorTramite = async (req, res) => {

    const { tramite_id } = req.params;

    try {

        const result = await pool.query(`

            SELECT
                tramite_documentos.id,
                documentos.nombre,
                documentos.se_carga_lex,
                tipo_tramite_documentos.obligatorio,
                tramite_documentos.estado,
                tramite_documentos.observaciones,
                tramite_documentos.recibido_at,
                tramite_documentos.cargado_lex_at

            FROM tramite_documentos

            INNER JOIN documentos
                ON tramite_documentos.documento_id = documentos.id

            INNER JOIN tramites
                ON tramite_documentos.tramite_id = tramites.id

            INNER JOIN tipo_tramite_documentos
                ON tipo_tramite_documentos.tipo_tramite_id = tramites.tipo_tramite_id
                AND tipo_tramite_documentos.documento_id = tramite_documentos.documento_id

            WHERE tramite_documentos.tramite_id = $1

            ORDER BY documentos.nombre

        `, [tramite_id]);

        return res.status(200).json(result.rows);

    } catch (error) {

        console.error('Error al obtener los documentos del trámite:', error);

        return res.status(500).json({
            error: 'Error al obtener los documentos del trámite'
        });
    }
};

export const actualizarDocumentoTramite = async (req, res) => {

    // Obtenemos el ID del documento del trámite desde la URL
    const { id } = req.params;

    // Obtenemos los datos que queremos modificar
    const {
        estado,
        observaciones
    } = req.body;

    try {

        const result = await pool.query(`

            UPDATE tramite_documentos

            SET estado = $1,
                observaciones = $2,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = $3

            RETURNING *

        `, [
            estado,
            observaciones,
            id
        ]);

        // Si no encontramos el documento
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Documento del trámite no encontrado"
            });
        }

        // Devolvemos el documento actualizado
        return res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error("Error al actualizar el documento del trámite:", error);

        return res.status(500).json({
            error: "Error al actualizar el documento del trámite"
        });
    }
};


export const marcarDocumentoRecibido = async (req, res) => {

    // Obtenemos el ID del documento del trámite desde la URL
    const { id } = req.params;

    try {

        const result = await pool.query(`

            UPDATE tramite_documentos

            SET estado = 'recibido',
                recibido_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = $1

            RETURNING *

        `, [id]);

        // Si no encontramos el documento
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Documento del trámite no encontrado"
            });
        }

        // Devolvemos el documento actualizado
        return res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error("Error al marcar el documento como recibido:", error);

        return res.status(500).json({
            error: "Error al marcar el documento como recibido"
        });
    }
};


export const marcarDocumentoCargadoLex = async (req, res) => {

    // Obtenemos el ID del documento del trámite desde la URL
    const { id } = req.params;

    try {

        const result = await pool.query(`

            UPDATE tramite_documentos

            SET estado = 'cargado',
                cargado_lex_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = $1

            RETURNING *

        `, [id]);

        // Si no encontramos el documento
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Documento del trámite no encontrado"
            });
        }

        // Devolvemos el documento actualizado
        return res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error("Error al marcar el documento como cargado en LEX:", error);

        return res.status(500).json({
            error: "Error al marcar el documento como cargado en LEX"
        });
    }
};