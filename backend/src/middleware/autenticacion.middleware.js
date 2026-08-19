import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET_JWT;

export const estaAutenticado = (roles = []) => async (req, res, next) => {

    // Obtenemos el token almacenado en la cookie
    const token = req.cookies.token;

    // Si no existe el token, el usuario no está autenticado
    if (!token) {
        return res.status(401).json({
            message: 'No estás autenticado'
        });
    }

    // Verificamos que el token sea válido
    jwt.verify(token, SECRET, async (err, decoded) => {

        // Si el token es inválido o expiró
        if (err) {
            return res.status(401).json({
                message: 'Token inválido o expirado'
            });
        }

        /*Guardamos el ID del usuario autenticado decoded contiene 
        el payload que guardamos al crear el token*/
        req.userId = decoded.id;


        /*
        ROLES - PARA IMPLEMENTAR EN EL FUTURO

        Cuando agregue la columna "role" a usuarios,
        voy a volver a consultar el rol del usuario:

        const result = await pool.query(
            'SELECT role FROM usuarios WHERE id = $1',
            [req.userId]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({
                message: 'Usuario no encontrado'
            });
        }

        const userRol = result.rows[0].role;

        if (roles.length && !roles.includes(userRol)) {
            return res.status(403).json({
                message: 'No tienes permiso para realizar esta acción'
            });
        }

        */
        next();
    });
};

