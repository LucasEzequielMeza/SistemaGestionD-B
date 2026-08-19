import bcrypt from 'bcrypt';
import { pool } from '../../db.js';


export const obtenerUsuarios = async (req, res) => {
    try {

        // Obtengo todos los usuarios
        const result = await pool.query(`
            SELECT 
                id,
                nombre,
                apellido,
                mail,
                activo,
                created_at
            FROM usuarios
            ORDER BY apellido, nombre
        `);

        return res.json(result.rows);

    } catch (error) {

        console.error('Error al obtener los usuarios:', error);

        return res.status(500).json({
            error: 'Error al obtener los usuarios'
        });
    }
};


export const obtenerUsuarioPorId = async (req, res) => {

    // Obtengo el ID del usuario desde la URL
    const { id } = req.params;

    try {

        // Busco el usuario por su ID
        const result = await pool.query(`
            SELECT 
                id,
                nombre,
                apellido,
                mail,
                activo,
                created_at
            FROM usuarios
            WHERE id = $1
        `, [id]);

        // Si no encuentro el usuario
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        return res.json(result.rows[0]);

    } catch (error) {

        console.error('Error al obtener el usuario:', error);

        return res.status(500).json({
            error: 'Error al obtener el usuario'
        });
    }
};


export const actualizarUsuario = async (req, res) => {

    // Obtengo el ID del usuario desde la URL
    const { id } = req.params;

    // Obtengo los datos que quiero modificar
    const {
        nombre,
        apellido,
        mail
    } = req.body;

    try {

        const result = await pool.query(`
            
            -- Actualizo los datos del usuario
            UPDATE usuarios

            SET nombre = $1,
                apellido = $2,
                mail = $3

            -- Busco el usuario por su ID
            WHERE id = $4

            -- Devuelvo el usuario actualizado
            RETURNING id, nombre, apellido, mail, activo, created_at

        `, [
            nombre,
            apellido,
            mail,
            id
        ]);

        // Si no encuentro el usuario
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        return res.json(result.rows[0]);

    } catch (error) {

        // Si el mail ya pertenece a otro usuario
        if (error.code === '23505') {
            return res.status(409).json({
                error: 'El mail ya está registrado'
            });
        }

        console.error('Error al actualizar el usuario:', error);

        return res.status(500).json({
            error: 'Error al actualizar el usuario'
        });
    }
};


export const cambiarContraseña = async (req, res) => {

    // Obtengo el ID del usuario desde la URL
    const { id } = req.params;

    // Obtengo la nueva contraseña
    const { contraseña } = req.body;

    try {

        // Genero el hash de la nueva contraseña
        const hashContraseña = await bcrypt.hash(contraseña, 12);

        // Actualizo la contraseña del usuario
        const result = await pool.query(`
            
            UPDATE usuarios

            SET contraseña = $1

            WHERE id = $2

            RETURNING id, nombre, apellido, mail, activo

        `, [
            hashContraseña,
            id
        ]);

        // Si no encuentro el usuario
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        return res.json({
            message: 'Contraseña actualizada correctamente',
            usuario: result.rows[0]
        });

    } catch (error) {

        console.error('Error al cambiar la contraseña:', error);

        return res.status(500).json({
            error: 'Error al cambiar la contraseña'
        });
    }
};

export const cambiarEstadoUsuario = async (req, res) => {

    // Obtengo el ID del usuario desde la URL
    const { id } = req.params;

    // Obtengo el nuevo estado
    const { activo } = req.body;

    try {

        const result = await pool.query(`
            
            -- Cambio el estado del usuario
            UPDATE usuarios

            SET activo = $1

            WHERE id = $2

            -- Devuelvo el usuario actualizado
            RETURNING id, nombre, apellido, mail, activo, created_at

        `, [
            activo,
            id
        ]);

        // Si no encuentro el usuario
        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        return res.json({
            message: activo
                ? 'Usuario activado correctamente'
                : 'Usuario desactivado correctamente',
            usuario: result.rows[0]
        });

    } catch (error) {

        console.error('Error al cambiar el estado del usuario:', error);

        return res.status(500).json({
            error: 'Error al cambiar el estado del usuario'
        });
    }
};