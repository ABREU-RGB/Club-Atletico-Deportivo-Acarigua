const express = require('express');
const router = express.Router();
const atletasController = require('../controllers/atletasController');

// Rutas existentes
router.get('/', atletasController.getAtletas);
router.get('/:id', atletasController.getAtletaById);
router.post('/', atletasController.createAtleta);
router.put('/:id', atletasController.updateAtleta);
router.put('/:id/tutor', atletasController.updateAtletaTutor); // Nueva ruta específica
router.delete('/:id', atletasController.deleteAtleta);

module.exports = router;