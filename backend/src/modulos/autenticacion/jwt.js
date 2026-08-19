import jwt from 'jsonwebtoken';
import doenv from 'dotenv';

doenv.config();

const SECRET = process.env.SECRET_JWT;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
};

export const generarTokenDeAcceso = (payload) => { /*El payload es un objeto que contiene la información 
 que deseas incluir en el token, como el ID del usuario, el nombre de usuario, etc.*/

    // Genera un token de acceso con una duración de 1 día
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload, 
            SECRET, // Clave secreta para firmar el token
            { expiresIn: '1d' },
            (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }}
        );
    });
};
