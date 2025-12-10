const pool = require('../config/database');

// Obtener todas las categorías
const getCategorias = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT c.*, 
              p.nombre as entrenador_nombre,
              p.apellido as entrenador_apellido,
              COUNT(a.atleta_id) as total_atletas
       FROM categoria c
       LEFT JOIN plantel p ON c.entrenador_id = p.plantel_id
       LEFT JOIN atletas a ON c.categoria_id = a.categoria_id AND a.estatus IN ('ACTIVO', 'LESIONADO')
       GROUP BY c.categoria_id
       ORDER BY c.edad_min ASC`
        );
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo categorías:', error);
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
};

// Obtener categoría por ID
const getCategoriaById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute(
            `SELECT c.*, 
              p.nombre as entrenador_nombre,
              p.apellido as entrenador_apellido
       FROM categoria c
       LEFT JOIN plantel p ON c.entrenador_id = p.plantel_id
       WHERE c.categoria_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error obteniendo categoría:', error);
        res.status(500).json({ error: 'Error al obtener categoría' });
    }
};

// Crear categoría
const createCategoria = async (req, res) => {
    try {
        const { nombre_categoria, edad_min, edad_max, entrenador_id } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO categoria (nombre_categoria, edad_min, edad_max, entrenador_id) 
       VALUES (?, ?, ?, ?)`,
            [nombre_categoria, edad_min, edad_max, entrenador_id]
        );

        res.status(201).json({
            message: 'Categoría creada exitosamente',
            id: result.insertId
        });

    } catch (error) {
        console.error('Error creando categoría:', error);
        res.status(500).json({ error: 'Error al crear categoría' });
    }
};

// Actualizar categoría
const updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_categoria, edad_min, edad_max, entrenador_id } = req.body;

        const [result] = await pool.execute(
            `UPDATE categoria 
       SET nombre_categoria = ?, edad_min = ?, edad_max = ?, entrenador_id = ?
       WHERE categoria_id = ?`,
            [nombre_categoria, edad_min, edad_max, entrenador_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.json({ message: 'Categoría actualizada exitosamente' });
    } catch (error) {
        console.error('Error actualizando categoría:', error);
        res.status(500).json({ error: 'Error al actualizar categoría' });
    }
};

// Eliminar categoría
const deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si hay atletas en esta categoría
        const [atletas] = await pool.execute(
            'SELECT COUNT(*) as total FROM atletas WHERE categoria_id = ?',
            [id]
        );

        if (atletas[0].total > 0) {
            return res.status(400).json({
                error: 'No se puede eliminar la categoría porque tiene atletas asignados'
            });
        }

        const [result] = await pool.execute(
            'DELETE FROM categoria WHERE categoria_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        console.error('Error eliminando categoría:', error);
        res.status(500).json({ error: 'Error al eliminar categoría' });
    }
};

module.exports = {
    getCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria
};
