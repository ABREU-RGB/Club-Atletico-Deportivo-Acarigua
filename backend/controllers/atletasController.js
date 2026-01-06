const pool = require('../config/database');

const getAtletas = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, 
              TIMESTAMPDIFF(YEAR, a.fecha_nacimiento, CURDATE()) as edad,
              c.nombre_categoria as categoria_nombre,
              t.nombre_completo as tutor_nombre
       FROM atletas a 
       LEFT JOIN categoria c ON a.categoria_id = c.categoria_id
       LEFT JOIN tutor t ON a.tutor_id = t.tutor_id
       WHERE a.estatus IN ('ACTIVO', 'LESIONADO')
       ORDER BY a.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo atletas:', error);
    res.status(500).json({ error: 'Error al obtener atletas' });
  }
};

const getAtletaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT a.*, 
              TIMESTAMPDIFF(YEAR, a.fecha_nacimiento, CURDATE()) as edad,
              c.nombre_categoria as categoria_nombre,
              t.nombre_completo as tutor_nombre,
              t.telefono as tutor_telefono
       FROM atletas a 
       LEFT JOIN categoria c ON a.categoria_id = c.categoria_id
       LEFT JOIN tutor t ON a.tutor_id = t.tutor_id
       WHERE a.atleta_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Atleta no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo atleta:', error);
    res.status(500).json({ error: 'Error al obtener atleta' });
  }
};

const createAtleta = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      telefono,
      direccion,
      fecha_nacimiento,
      posicion_de_juego,
      categoria_id,
      tutor_id,
      estatus
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO atletas 
       (nombre, apellido, telefono, direccion, fecha_nacimiento, posicion_de_juego, categoria_id, tutor_id, estatus) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, telefono, direccion, fecha_nacimiento, posicion_de_juego, categoria_id, tutor_id, estatus || 'ACTIVO']
    );

    res.status(201).json({
      message: 'Atleta creado exitosamente',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error creando atleta:', error);
    res.status(500).json({ error: 'Error al crear atleta' });
  }
};

const updateAtleta = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      telefono,
      direccion,
      fecha_nacimiento,
      posicion_de_juego,
      categoria_id,
      tutor_id,
      estatus
    } = req.body;

    const [result] = await pool.execute(
      `UPDATE atletas 
       SET nombre = ?, apellido = ?, telefono = ?, direccion = ?, fecha_nacimiento = ?, 
           posicion_de_juego = ?, categoria_id = ?, tutor_id = ?, estatus = ?
       WHERE atleta_id = ?`,
      [nombre, apellido, telefono, direccion, fecha_nacimiento, posicion_de_juego, categoria_id, tutor_id, estatus, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Atleta no encontrado' });
    }

    res.json({ message: 'Atleta actualizado exitosamente' });
  } catch (error) {
    console.error('Error actualizando atleta:', error);
    res.status(500).json({ error: 'Error al actualizar atleta' });
  }
};

const deleteAtleta = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'UPDATE atletas SET estatus = ? WHERE atleta_id = ?',
      ['INACTIVO', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Atleta no encontrado' });
    }

    res.json({ message: 'Atleta eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando atleta:', error);
    res.status(500).json({ error: 'Error al eliminar atleta' });
  }
};

const updateAtletaTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const { tutor_id } = req.body;

    const [result] = await pool.execute(
      'UPDATE atletas SET tutor_id = ? WHERE atleta_id = ?',
      [tutor_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Atleta no encontrado' });
    }

    res.json({ message: 'Tutor asignado exitosamente' });
  } catch (error) {
    console.error('Error asignando tutor:', error);
    res.status(500).json({ error: 'Error al asignar tutor' });
  }
};

module.exports = {
  getAtletas,
  getAtletaById,
  createAtleta,
  updateAtleta,
  updateAtletaTutor,
  deleteAtleta
};