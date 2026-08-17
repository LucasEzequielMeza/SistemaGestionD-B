import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); //Carga las variables de entorno desde un archivo .env


// Configuración de la conexión a la base de datos
export const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Evento de conexión exitosa
pool.on('connect', () => {
  console.log('Conexión exitosa a la base de datos');
});

// Evento de error en la conexión
pool.on('error', (err) => {
  console.error('Error en la conexión a la base de datos:', err);
});
