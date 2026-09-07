import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la conexión a Neon
export const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Evento de conexión exitosa
pool.on('connect', () => {
    console.log('Conexión exitosa a la base de datos');
});

// Evento de error en la conexión
pool.on('error', (err) => {
    console.error('Error en la conexión a la base de datos:', err);
});