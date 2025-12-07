const express = require('express');
const router = express.Router();

const {
  crearConsulta,
  obtenerConsultas,
} = require('../controllers/consultasController');

// En el futuro, GET lo podés proteger con verifyToken + rol ADMIN

// Enviar consulta (público)
router.post('/', crearConsulta);

// Listar consultas (admin)
router.get('/', obtenerConsultas);

module.exports = router;
