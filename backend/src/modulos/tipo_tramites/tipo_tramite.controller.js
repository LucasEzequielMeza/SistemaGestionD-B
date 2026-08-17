import {pool} from '../../db.js';

export const obtenerTiposTramites = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tipo_tramite');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener los tipos de trámites:', error);
    res.status(500).json({ error: 'Error al obtener los tipos de trámites' });
  } 
};