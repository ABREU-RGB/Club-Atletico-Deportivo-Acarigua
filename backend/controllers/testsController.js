const pool = require('../config/database');

// Obtener todos los tests
const getTests = async (req, res) => {
  try {
    const { atleta_id } = req.query;

    let query = `
      SELECT t.*, 
             atl.nombre as atleta_nombre, 
             atl.apellido as atleta_apellido,
             c.nombre_categoria as categoria_nombre,
             TIMESTAMPDIFF(YEAR, atl.fecha_nacimiento, CURDATE()) as edad
      FROM test_de_rendimiento t
      LEFT JOIN atletas atl ON t.atleta_id = atl.atleta_id
      LEFT JOIN categoria c ON atl.categoria_id = c.categoria_id
      WHERE 1=1
    `;
    const params = [];

    if (atleta_id) {
      query += ' AND t.atleta_id = ?';
      params.push(atleta_id);
    }

    query += ' ORDER BY t.fecha_test DESC, t.test_id DESC, atl.nombre ASC';

    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo tests:', error);
    res.status(500).json({ error: 'Error al obtener tests' });
  }
};

// Obtener tests por atleta
const getTestsByAtleta = async (req, res) => {
  try {
    const { atleta_id } = req.params;

    const [rows] = await pool.execute(
      `SELECT t.*
       FROM test_de_rendimiento t
       LEFT JOIN atletas atl ON t.atleta_id = atl.atleta_id
       WHERE t.atleta_id = ? AND atl.estatus IN ('ACTIVO', 'LESIONADO')
       ORDER BY t.fecha_test DESC, t.test_id DESC`,
      [atleta_id]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo tests por atleta:', error);
    res.status(500).json({ error: 'Error al obtener tests' });
  }
};

// Crear test
const createTest = async (req, res) => {
  try {
    const {
      atleta_id,
      fecha_test,
      test_de_fuerza,
      test_resistencia,
      test_velocidad,
      test_coordinacion,
      test_de_reaccion
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO test_de_rendimiento 
       (atleta_id, fecha_test, test_de_fuerza, test_resistencia, test_velocidad, test_coordinacion, test_de_reaccion) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [atleta_id, fecha_test, test_de_fuerza, test_resistencia, test_velocidad, test_coordinacion, test_de_reaccion]
    );

    res.status(201).json({
      message: 'Test registrado exitosamente',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error registrando test:', error);
    res.status(500).json({ error: 'Error al registrar test' });
  }
};

// Obtener estadísticas de tests
const getEstadisticasTests = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        COUNT(*) as total_tests,
        AVG(test_de_fuerza) as promedio_fuerza,
        AVG(test_resistencia) as promedio_resistencia,
        AVG(test_velocidad) as promedio_velocidad,
        AVG(test_coordinacion) as promedio_coordinacion,
        AVG(test_de_reaccion) as promedio_reaccion
       FROM test_de_rendimiento`
    );

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

// Obtener evolución de tests para un atleta
const getEvolucionTest = async (req, res) => {
  try {
    const { atleta_id } = req.params;

    const [rows] = await pool.execute(
      `SELECT fecha_test, test_de_fuerza, test_resistencia, test_velocidad, test_coordinacion, test_de_reaccion
       FROM test_de_rendimiento 
       WHERE atleta_id = ?
       ORDER BY fecha_test ASC`,
      [atleta_id]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo evolución de test:', error);
    res.status(500).json({ error: 'Error al obtener evolución' });
  }
};

// Obtener último test de un atleta
const getUltimoTest = async (req, res) => {
  try {
    const { atleta_id } = req.params;

    const [rows] = await pool.execute(
      `SELECT *
       FROM test_de_rendimiento 
       WHERE atleta_id = ?
       ORDER BY fecha_test DESC, test_id DESC
       LIMIT 1`,
      [atleta_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron tests para este atleta' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo último test:', error);
    res.status(500).json({ error: 'Error al obtener test' });
  }
};

module.exports = {
  getTests,
  getTestsByAtleta,
  createTest,
  getEstadisticasTests,
  getEvolucionTest,
  getUltimoTest
};