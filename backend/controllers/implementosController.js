const pool = require('../config/database');

// Obtener todos los implementos
const getImplementos = async (req, res) => {
    try {
        const { estatus } = req.query;

        let query = 'SELECT * FROM implementos_deportivos WHERE 1=1';
        const params = [];

        if (estatus) {
            query += ' AND estatus = ?';
            params.push(estatus);
        }

        query += ' ORDER BY tipo ASC';

        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo implementos:', error);
        res.status(500).json({ error: 'Error al obtener implementos' });
    }
};

// Obtener implemento por ID
const getImplementoById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.execute(
            'SELECT * FROM implementos_deportivos WHERE implemento_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Implemento no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error obteniendo implemento:', error);
        res.status(500).json({ error: 'Error al obtener implemento' });
    }
};

// Crear implemento
const createImplemento = async (req, res) => {
    try {
        const { tipo, cantidad, estatus, ubicacion } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO implementos_deportivos (tipo, cantidad, estatus, ubicacion) 
       VALUES (?, ?, ?, ?)`,
            [tipo, cantidad || 0, estatus || 'DISPONIBLE', ubicacion]
        );

        res.status(201).json({
            message: 'Implemento registrado exitosamente',
            id: result.insertId
        });

    } catch (error) {
        console.error('Error creando implemento:', error);
        res.status(500).json({ error: 'Error al crear implemento' });
    }
};

// Actualizar implemento
const updateImplemento = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, cantidad, estatus, ubicacion } = req.body;

        const [result] = await pool.execute(
            `UPDATE implementos_deportivos 
       SET tipo = ?, cantidad = ?, estatus = ?, ubicacion = ?
       WHERE implemento_id = ?`,
            [tipo, cantidad, estatus, ubicacion, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Implemento no encontrado' });
        }

        res.json({ message: 'Implemento actualizado exitosamente' });
    } catch (error) {
        console.error('Error actualizando implemento:', error);
        res.status(500).json({ error: 'Error al actualizar implemento' });
    }
};

// Actualizar solo el estatus
const updateEstatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estatus } = req.body;

        const [result] = await pool.execute(
            'UPDATE implementos_deportivos SET estatus = ? WHERE implemento_id = ?',
            [estatus, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Implemento no encontrado' });
        }

        res.json({ message: 'Estatus actualizado exitosamente' });
    } catch (error) {
        console.error('Error actualizando estatus:', error);
        res.status(500).json({ error: 'Error al actualizar estatus' });
    }
};

// Eliminar implemento
const deleteImplemento = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            'DELETE FROM implementos_deportivos WHERE implemento_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Implemento no encontrado' });
        }

        res.json({ message: 'Implemento eliminado exitosamente' });
    } catch (error) {
        console.error('Error eliminando implemento:', error);
        res.status(500).json({ error: 'Error al eliminar implemento' });
    }
};

module.exports = {
    getImplementos,
    getImplementoById,
    createImplemento,
    updateImplemento,
    updateEstatus,
    deleteImplemento
};
