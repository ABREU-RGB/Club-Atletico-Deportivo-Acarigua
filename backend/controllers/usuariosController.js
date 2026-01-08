const pool = require('../config/database');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

const getUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT usuario_id, email, rol, estatus, created_at FROM usuarios WHERE estatus = ? ORDER BY created_at DESC',
      ['ACTIVO']
    );
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
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

    // Verificar si el email ya existe
    const [existing] = await pool.execute(
      'SELECT usuario_id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const [result] = await pool.execute(
      'INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)',
      [email, password || '123456', rol || 'USUARIO']
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

module.exports = {
  getUsuarios,
  login,
  getInfo,
  logout,
  createUsuario
};