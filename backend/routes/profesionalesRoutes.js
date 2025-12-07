const express = require('express');
const router = express.Router();

const {
  crearProfesional,
  obtenerProfesionales,
  actualizarProfesional,
  obtenerProfesionalPorId,
} = require('../controllers/profesionalesController');

// Más adelante podés activar middlewares:
// const verifyToken = require('../middleware/verifyToken');
// const verifyAdmin = require('../middleware/verifyAdmin');

// Lista completa (admin)
router.get('/', /* verifyToken, verifyAdmin, */ obtenerProfesionales);

// Detalle por ID
router.get('/:id', /* verifyToken, verifyAdmin, */ obtenerProfesionalPorId);

// Crear profesional
router.post('/', /* verifyToken, verifyAdmin, */ crearProfesional);

// Actualizar profesional
router.put('/:id', /* verifyToken, verifyAdmin, */ actualizarProfesional);

module.exports = router;
