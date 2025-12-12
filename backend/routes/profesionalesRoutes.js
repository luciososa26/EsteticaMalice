const express = require('express');
const router = express.Router();

const {
  crearProfesional,
  obtenerProfesionales,
  actualizarProfesional,
  obtenerProfesionalPorId,
  obtenerProfesionalesActivos,
  cambiarEstadoProfesional,
} = require('../controllers/profesionalesController');

const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// ===============================
//  RUTAS PÚBLICAS (CLIENTE)
// ===============================

// Lista que usa el frontend para turnos, etc.
// Podés dejar SOLO esta si querés, pero como ya la tenés,
// no rompemos nada:
router.get('/', obtenerProfesionales);               // devuelve activos
router.get('/activos', obtenerProfesionalesActivos); // alias si lo usás

// ===============================
//  RUTAS SOLO ADMIN
// ===============================

// Detalle de un profesional (usado por el formulario de edición)
router.get('/:id', verifyToken, verifyAdmin, obtenerProfesionalPorId);

// Crear profesional
router.post('/', verifyToken, verifyAdmin, crearProfesional);

// Editar profesional
router.put('/:id', verifyToken, verifyAdmin, actualizarProfesional);

// Cambiar estado (activo/inactivo)
router.put('/:id/estado', verifyToken, verifyAdmin, cambiarEstadoProfesional);

module.exports = router;
