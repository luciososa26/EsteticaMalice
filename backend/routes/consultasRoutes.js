const express = require("express");
const router = express.Router();

const {
  crearConsulta,
  obtenerConsultas,
} = require("../controllers/consultasController");

// Crear consulta (pública, sin login)
router.post("/", crearConsulta);

// Listar consultas (después se puede proteger con verifyToken y rol ADMIN)
router.get("/", obtenerConsultas);

module.exports = router;
