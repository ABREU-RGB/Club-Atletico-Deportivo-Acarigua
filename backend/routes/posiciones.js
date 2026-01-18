const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Obtener todas las posiciones de juego
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM `posicion de juego` ORDER BY nombre_posicion');
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo posiciones:', error);
    res.status(500).json({ error: 'Error al obtener posiciones' });
  }
});

module.exports = router;
