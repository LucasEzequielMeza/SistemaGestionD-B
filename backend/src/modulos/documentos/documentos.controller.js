import { pool } from "../../db.js";

export const obtenerDocumentosPorTramite = async (req, res) => {
    const { tramite_id } = req.params;

    try {
        const result = await pool.query(`
            SELECT
                tramite_documentos.id,
                documentos.nombre,
                documentos.se_carga_lex,
                COALESCE(tipo_tramite_documentos.obligatorio, TRUE) AS obligatorio,
                tramite_documentos.estado,
                tramite_documentos.observaciones,
                tramite_documentos.recibido_at,
                tramite_documentos.cargado_lex_at
            FROM tramite_documentos
            INNER JOIN documentos
                ON tramite_documentos.documento_id = documentos.id
            INNER JOIN tramites
                ON tramite_documentos.tramite_id = tramites.id
            LEFT JOIN tipo_tramite_documentos
                ON tipo_tramite_documentos.tipo_tramite_id = tramites.tipo_tramite_id
                AND tipo_tramite_documentos.documento_id = tramite_documentos.documento_id
            WHERE tramite_documentos.tramite_id = $1
            ORDER BY
                CASE documentos.nombre
                    WHEN 'Poder' THEN 1
                    WHEN 'Pacto' THEN 2
                    WHEN 'Planilla' THEN 3
                    WHEN 'Autoriza' THEN 4
                    WHEN 'Orden médica' THEN 5
                    WHEN 'Foto DM' THEN 6
                    WHEN 'Denuncia SEG' THEN 7
                    WHEN 'SV' THEN 8
                    WHEN 'DM marcado' THEN 9
                    WHEN 'Croquis' THEN 10
                    WHEN 'Testigos' THEN 11
                    WHEN 'Mapa' THEN 12
                    WHEN 'Documentación tercero' THEN 13
                    WHEN 'DNI' THEN 14
                    WHEN 'Licencia' THEN 15
                    WHEN 'Cédula' THEN 16
                    WHEN 'Presupuesto' THEN 17
                    WHEN 'CC' THEN 18
                    WHEN 'DEN tercero' THEN 19
                    WHEN 'CC tercero' THEN 20
                    WHEN 'Relato de los hechos' THEN 21
                    WHEN 'Declaración testimonial' THEN 22
                    ELSE 99
                END
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

    // Obtenemos las observaciones que queremos modificar
    const { observaciones } = req.body;

    try {

        const result = await pool.query(`
            UPDATE tramite_documentos

            SET observaciones = $1,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = $2

            RETURNING *
        `, [
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

        console.error(
            "Error al actualizar el documento del trámite:",
            error
        );

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
            AND estado = 'pendiente'

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

            FROM documentos

            WHERE tramite_documentos.id = $1
            AND tramite_documentos.documento_id = documentos.id
            AND tramite_documentos.estado = 'recibido'
            AND documentos.se_carga_lex = TRUE

            RETURNING tramite_documentos.*
        `, [id]);

        // Si no encontramos el documento
        // o no cumple las condiciones para cargarlo en LEX
        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "El documento no existe, no fue recibido o no se carga en LEX"
            });

        }

        // Devolvemos el documento actualizado
        return res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(
            "Error al marcar el documento como cargado en LEX:",
            error
        );

        return res.status(500).json({
            error: "Error al marcar el documento como cargado en LEX"
        });
    }
};

export const marcarDocumentoPendiente = async (req, res) => {

    // Obtenemos el ID del documento del trámite desde la URL
    const { id } = req.params;

    try {

        const result = await pool.query(`
            UPDATE tramite_documentos

            SET estado = 'pendiente',
                updated_at = CURRENT_TIMESTAMP

            WHERE id = $1
            AND estado = 'no_pedido'

            RETURNING *
        `, [id]);

        // Si no encontramos el documento
        // o no estaba en estado "no_pedido"
        if (result.rows.length === 0) {

            return res.status(404).json({
                error: "Documento no encontrado o ya fue pedido"
            });

        }

        // Devolvemos el documento actualizado
        return res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(
            "Error al marcar el documento como pendiente:",
            error
        );

        return res.status(500).json({
            error: "Error al marcar el documento como pendiente"
        });
    }
};