const pool = require('../config/database');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// Obtener todos los usuarios con información del rol
const getUsuarios = async (req, res) => {
  try {
    const { estatus } = req.query;

    let query = `
      SELECT u.usuario_id, u.email, u.rol, u.estatus, u.ultimo_acceso, u.created_at,
             r.nombre_rol, r.descripcion as rol_descripcion
      FROM usuarios u
      LEFT JOIN rol_usuarios r ON u.rol = r.rol_id
    `;

    const params = [];
    if (estatus && estatus !== 'TODOS') {
      query += ' WHERE u.estatus = ?';
      params.push(estatus);
    }

    query += ' ORDER BY u.created_at DESC';

    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener usuario por ID
const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      `SELECT u.usuario_id, u.email, u.rol, u.estatus, u.ultimo_acceso, u.created_at,
              r.nombre_rol, r.descripcion as rol_descripcion
       FROM usuarios u
       LEFT JOIN rol_usuarios r ON u.rol = r.rol_id
       WHERE u.usuario_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario en la base de datos
    const [users] = await pool.execute(
      'SELECT * FROM usuarios WHERE email = ? AND estatus = ?',
      [email, 'ACTIVO']
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0];

    // Verificar contraseña (comparación directa - sin hash para desarrollo)
    if (password !== user.password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        userId: user.usuario_id,
        email: user.email,
        rol: user.rol
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Guardar token en la base de datos
    await pool.execute(
      'UPDATE usuarios SET token = ?, ultimo_acceso = NOW() WHERE usuario_id = ?',
      [token, user.usuario_id]
    );

    res.json({
      data: {
        token: token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getInfo = async (req, res) => {
  try {
    // El token ya fue verificado por el middleware
    const userId = req.userId;

    const [users] = await pool.execute(
      'SELECT usuario_id, email, rol FROM usuarios WHERE usuario_id = ? AND estatus = ?',
      [userId, 'ACTIVO']
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];

    res.json({
      data: {
        roles: [user.rol],
        name: user.email, // Usamos email como nombre ya que no hay nombre/apellido
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        introduction: `${user.rol} del Club Atlético Deportivo Acarigua`
      }
    });

  } catch (error) {
    console.error('Error obteniendo info del usuario:', error);
    res.status(500).json({ error: 'Error al obtener información del usuario' });
  }
};

const logout = async (req, res) => {
  try {
    // Limpiar el token de la base de datos
    const userId = req.userId;

    await pool.execute(
      'UPDATE usuarios SET token = NULL WHERE usuario_id = ?',
      [userId]
    );

    res.json({
      data: {
        message: 'Logout exitoso'
      }
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
};

const createUsuario = async (req, res) => {
  try {
    const { email, password, rol } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'El email es requerido' });
    }

    // Verificar si el email ya existe
    const [existing] = await pool.execute(
      'SELECT usuario_id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Verificar que el rol existe
    if (rol) {
      const [rolExists] = await pool.execute(
        'SELECT rol_id FROM rol_usuarios WHERE rol_id = ?',
        [rol]
      );
      if (rolExists.length === 0) {
        return res.status(400).json({ error: 'El rol especificado no existe' });
      }
    }

    const [result] = await pool.execute(
      'INSERT INTO usuarios (email, password, rol, estatus) VALUES (?, ?, ?, ?)',
      [email, password || '123456', rol || 2, 'ACTIVO']
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuario_id: result.insertId
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Actualizar usuario
const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, rol, estatus } = req.body;

    // Verificar que existe
    const [existing] = await pool.execute(
      'SELECT usuario_id FROM usuarios WHERE usuario_id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar email duplicado
    if (email) {
      const [duplicate] = await pool.execute(
        'SELECT usuario_id FROM usuarios WHERE email = ? AND usuario_id != ?',
        [email, id]
      );
      if (duplicate.length > 0) {
        return res.status(400).json({ error: 'El email ya está en uso por otro usuario' });
      }
    }

    // Verificar que el rol existe
    if (rol) {
      const [rolExists] = await pool.execute(
        'SELECT rol_id FROM rol_usuarios WHERE rol_id = ?',
        [rol]
      );
      if (rolExists.length === 0) {
        return res.status(400).json({ error: 'El rol especificado no existe' });
      }
    }

    // Construir query dinámico
    const updates = [];
    const params = [];

    if (email) {
      updates.push('email = ?');
      params.push(email);
    }
    if (password) {
      updates.push('password = ?');
      params.push(password);
    }
    if (rol) {
      updates.push('rol = ?');
      params.push(rol);
    }
    if (estatus) {
      updates.push('estatus = ?');
      params.push(estatus);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
    }

    params.push(id);
    await pool.execute(
      `UPDATE usuarios SET ${updates.join(', ')} WHERE usuario_id = ?`,
      params
    );

    res.json({ message: 'Usuario actualizado exitosamente' });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario (soft delete - cambiar estatus a INACTIVO)
const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que existe
    const [existing] = await pool.execute(
      'SELECT usuario_id FROM usuarios WHERE usuario_id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Soft delete - cambiar estatus a INACTIVO
    await pool.execute(
      'UPDATE usuarios SET estatus = ?, token = NULL WHERE usuario_id = ?',
      ['INACTIVO', id]
    );

    res.json({ message: 'Usuario desactivado exitosamente' });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = {
  getUsuarios,
  getUsuarioById,
  login,
  getInfo,
  logout,
  createUsuario,
  updateUsuario,
  deleteUsuario
};