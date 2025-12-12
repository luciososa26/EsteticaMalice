const express = require('express');
const router = express.Router();

const {
  crearConsulta,
  obtenerConsultas,
  cambiarEstadoConsulta,
} = require('../controllers/consultasController');

// Middlewares
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// ==============================
//  PUBLICO: Enviar consulta
// ==============================
router.post('/', crearConsulta);

// ==============================
//  ADMIN: Listar todas las consultas
// ==============================
router.get('/', verifyToken, verifyAdmin, obtenerConsultas);

// ==============================
//  ADMIN: Cambiar estado consulta
// ==============================
router.put('/:id/estado', verifyToken, verifyAdmin, cambiarEstadoConsulta);

module.exports = router;
