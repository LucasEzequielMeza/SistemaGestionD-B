import {pool} from '../../db.js';

export const obtenerRecordatorios = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * 

            FROM recordatorios

            WHERE user_id = $1
            AND completado = false`
            ,[req.userId]);

        return res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error al obtener los recordatorios:', error);
        res.status(500).json({ error: 'Error al obtener los recordatorios' });
    }
}

export const obtenerRecordatorioPorId = async (req, res) => {
    const { id } = req.params

    console.log("ID recibido:", id);
    console.log("Usuario recibido:", req.userId);

    try {
        const result = await pool.query(`
        SELECT 
        id, 
        descripcion, 
        fecha_evento,
        hora_evento,
        minutos_antes,
        completado
        FROM recordatorios
        WHERE recordatorios.id = $1 
        AND user_id = $2
        `, [id, req.userId])

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Recordatorio no encontrado'
            })
        }

        return res.json(result.rows[0])
    } catch (error) {
        return res.status(500).json({
            error: "Error al obtener el recordatorio"
        });
    }
}

export const crearRecordatorio = async (req, res) => {
    const {
        descripcion, 
        fecha_evento, 
        hora_evento, 
        minutos_antes
    } = req.body;

    try{
        const result = await pool.query(
            `INSERT INTO recordatorios (
            descripcion, 
            fecha_evento, 
            hora_evento, 
            minutos_antes, 
            user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [descripcion, fecha_evento, hora_evento, minutos_antes, req.userId]
        );
        
        return res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Error al crear el recordatorio:', error);
        res.status(500).json({ error: 'Error al crear el recordatorio' });
    }
}

export const actualizarRecordatorio = async (req, res) => {
    const { id } = req.params;

    const {
        descripcion, 
        fecha_evento, 
        hora_evento, 
        minutos_antes
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE recordatorios SET 

            descripcion = $1, 

            fecha_evento = $2, 

            hora_evento = $3, 

            minutos_antes = $4 

            WHERE id = $5

            AND user_id = $6 RETURNING*`,
            [   descripcion, 
                fecha_evento, 
                hora_evento, 
                minutos_antes, 
                id, 
                req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recordatorio no encontrado' });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar el recordatorio:', error);
        res.status(500).json({ error: 'Error al actualizar el recordatorio' });
    }
}

export const eliminarRecordatorio = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `DELETE FROM recordatorios 
            
            WHERE id = $1 
            
            AND user_id = $2 
            
            RETURNING *`,
            [id, req.userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recordatorio no encontrado' });
        }

        return res.status(200).json({ message: 'Recordatorio eliminado correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar el recordatorio:', error);
        res.status(500).json({ error: 'Error al eliminar el recordatorio' });
    }
}

export const recordatorioFinalizado = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE recordatorios SET completado = true
            WHERE id = $1 AND user_id = $2 RETURNING *`,
            [id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recordatorio no encontrado' });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al finalizar el recordatorio:', error);
        res.status(500).json({ error: 'Error al finalizar el recordatorio' });
    }
}

export const posponerRecordatorio = async (req, res) => {
    const { id } = req.params;
    const { minutos } = req.body;

    try {
        const result = await pool.query(
            `UPDATE recordatorios
            SET hora_evento = hora_evento + ($1 * INTERVAL '1 minute')
            WHERE id = $2
            AND user_id = $3
            AND completado = false
            RETURNING *`,
            [minutos, id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Recordatorio no encontrado'
            });
        }

        return res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error('Error al posponer el recordatorio:', error);
        res.status(500).json({
            error: 'Error al posponer el recordatorio'
        });
    }
}