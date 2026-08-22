import bcrypt from 'bcrypt';
import { pool } from '../../db.js';
import { generarTokenDeAcceso } from './jwt.js';


export const login = async (req, res) => {
    try {

        // Obtenemos las credenciales enviadas
        const { mail, contraseña } = req.body;

        // Buscamos el usuario por su mail
        const result = await pool.query(
            `
            SELECT *
            FROM usuarios
            WHERE mail = $1
            `,
            [mail]
        );

        // Si no existe el usuario
        if (result.rowCount === 0) {
            return res.status(401).json({
                success: false,
                error: 'El correo no esta registrado'
            });
        }

        // Comparamos la contraseña ingresada con el hash almacenado en la base de datos
        const contraseñaValida = await bcrypt.compare(
            contraseña,
            result.rows[0].contraseña
        );

        // Si la contraseña no coincide
        if (!contraseñaValida) {
            return res.status(401).json({
                success: false,
                error: 'Contraseña incorrecta'
            });
        }

        // Generamos el JWT con el ID del usuario
        const token = await generarTokenDeAcceso({
            id: result.rows[0].id
        });

        // Guardamos el token en una cookie HTTP-Only
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'
                ? 'none'
                : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        // Devolvemos solamente los datos necesarios
        return res.status(200).json({
            success: true,
            usuario: {
                id: result.rows[0].id,
                mail: result.rows[0].mail
            }
        });

    } catch (error) {

        console.error('Error al iniciar sesión:', error);

        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};


export const register = async (req, res) => {

    // Obtenemos los datos enviados
    const {
        nombre,
        apellido,
        mail,
        contraseña
    } = req.body;

    try {

        // Verificamos si ya existe un usuario con ese mail
        const existeUsuario = await pool.query(
            'SELECT id FROM usuarios WHERE mail = $1',
            [mail]
        );

        if (existeUsuario.rowCount > 0) {
            return res.status(400).json({
                error: 'El usuario ya existe'
            });
        }

        // Hasheamos la contraseña antes de guardarla
        const hashContraseña = await bcrypt.hash(contraseña, 12);

        // Creamos el usuario
        const result = await pool.query(
            `
            INSERT INTO usuarios (
                nombre,
                apellido,
                mail,
                contraseña
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id, nombre, apellido, mail
            `,
            [
                nombre,
                apellido,
                mail,
                hashContraseña
            ]
        );

        // Generamos el JWT
        const token = await generarTokenDeAcceso({
            id: result.rows[0].id
        });

        // Guardamos el token en una cookie HTTP-Only
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'
                ? 'none'
                : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            usuario: {
                id: result.rows[0].id,
                nombre: result.rows[0].nombre,
                apellido: result.rows[0].apellido,
                mail: result.rows[0].mail
            }
        });

    } catch (error) {

        console.error('Error al registrar el usuario:', error);

        return res.status(500).json({
            error: 'Error al registrar el usuario'
        });
    }
};


export const logout = (req, res) => {

    // Eliminamos la cookie del token
    res.clearCookie('token');

    return res.json({
        success: true,
        message: 'Sesión cerrada'
    });
};


export const getProfile = async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT
                id,
                nombre,
                apellido,
                mail
            FROM usuarios
            WHERE id = $1
            `,
            [req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        return res.status(200).json({
            usuario: result.rows[0]
        });

    } catch (error) {

        console.error(
            'Error al obtener el perfil:',
            error
        );

        return res.status(500).json({
            error: 'Error al obtener el perfil'
        });
    }
};
