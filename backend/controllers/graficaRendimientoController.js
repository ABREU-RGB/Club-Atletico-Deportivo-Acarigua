const pool = require('../config/database');

// Obtener todas las gráficas de rendimiento
const getGraficas = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT g.*, 
              a.nombre as atleta_nombre,
              a.apellido as atleta_apellido
       FROM grafica_de_rendimiento g
       LEFT JOIN atletas a ON g.atleta_id = a.atleta_id
       ORDER BY g.fecha_generacion DESC`
        );
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo gráficas:', error);
        res.status(500).json({ error: 'Error al obtener gráficas' });
    }
};

// Obtener gráficas por atleta
const getGraficaByAtleta = async (req, res) => {
    try {
        const { atleta_id } = req.params;

        const [rows] = await pool.execute(
            `SELECT g.*, 
              a.nombre as atleta_nombre,
              a.apellido as atleta_apellido
       FROM grafica_de_rendimiento g
       LEFT JOIN atletas a ON g.atleta_id = a.atleta_id
       WHERE g.atleta_id = ?
       ORDER BY g.fecha_generacion DESC`,
            [atleta_id]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo gráficas del atleta:', error);
        res.status(500).json({ error: 'Error al obtener gráficas' });
    }
};

// Crear gráfica de rendimiento
const createGrafica = async (req, res) => {
    try {
        const {
            atleta_id,
            test_id,
            medidas_id,
            fecha_generacion,
            observaciones
        } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO grafica_de_rendimiento 
       (atleta_id, test_id, medidas_id, fecha_generacion, observaciones) 
       VALUES (?, ?, ?, ?, ?)`,
            [atleta_id, test_id, medidas_id, fecha_generacion || new Date().toISOString().split('T')[0], observaciones]
        );

        res.status(201).json({
            message: 'Gráfica generada exitosamente',
            id: result.insertId
        });

    } catch (error) {
        console.error('Error creando gráfica:', error);
        res.status(500).json({ error: 'Error al crear gráfica' });
    }
};

// Obtener datos completos para gráfica (test + medidas)
const getDatosGrafica = async (req, res) => {
    try {
        const { atleta_id } = req.params;

        // Obtener tests
        const [tests] = await pool.execute(
            `SELECT * FROM test_de_rendimiento 
       WHERE atleta_id = ? 
       ORDER BY fecha_test ASC`,
            [atleta_id]
        );

        // Obtener medidas
        const [medidas] = await pool.execute(
            `SELECT * FROM medidas_antropometricas 
       WHERE atleta_id = ? 
       ORDER BY fecha_medicion ASC`,
            [atleta_id]
        );

        res.json({
            tests,
            medidas
        });
    } catch (error) {
        console.error('Error obteniendo datos para gráfica:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
};

module.exports = {
    getGraficas,
    getGraficaByAtleta,
    createGrafica,
    getDatosGrafica
};
