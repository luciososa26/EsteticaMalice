const express = require("express");
const router = express.Router();

const {
  obtenerProfesionales,
  crearProfesional,
} = require("../controllers/profesionalesController");

// Más adelante podríamos proteger POST con verifyToken + rol ADMIN
// const verifyToken = require("../middleware/verifyToken");

router.get("/", obtenerProfesionales);
router.post("/", /* verifyToken, */ crearProfesional);

module.exports = router;
