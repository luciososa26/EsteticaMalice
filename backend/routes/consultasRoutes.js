const express = require('express');
const router = express.Router();

const {
  crearConsulta,
  obtenerConsultas,
  cambiarEstadoConsulta,
} = require('../controllers/consultasController');

// En el futuro, GET lo podés proteger con verifyToken + rol ADMIN

// Enviar consulta (público)
router.post('/', crearConsulta);

// Listar consultas (admin)
router.get('/', obtenerConsultas);

// Cambiar estado de consultas (admin)
router.put('/:id/estado', cambiarEstadoConsulta);

module.exports = router;
