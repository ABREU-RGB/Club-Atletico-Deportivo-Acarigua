const express = require('express');
const router = express.Router();
const { getUsuarios, getUsuarioById, login, getInfo, logout, createUsuario, updateUsuario, deleteUsuario, updateProfile, uploadAvatar } = require('../controllers/usuariosController');
const { verifyToken } = require('../middleware/auth');

// Rutas específicas PRIMERO (antes de las parametrizadas)
router.get('/', getUsuarios);
router.post('/login', login);
router.get('/info', verifyToken, getInfo);
router.post('/logout', verifyToken, logout);
router.put('/profile', verifyToken, updateProfile);
router.post('/profile/avatar', verifyToken, uploadAvatar);
router.post('/', createUsuario);

// Rutas con parámetros DESPUÉS
router.get('/:id', getUsuarioById);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

module.exports = router;