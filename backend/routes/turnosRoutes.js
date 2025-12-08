const express = require("express");
const router = express.Router();

const {
  crearTurno,
  obtenerTurnos,
  obtenerTurnosPorUsuario,
  cancelarTurno,
  obtenerTurnosPorFecha,
  actualizarTurno,
} = require("../controllers/turnosController");

// Más adelante se protege con verifyToken + rol
// const verifyToken = require("../middleware/verifyToken");

// Crear turno
router.post("/", /* verifyToken, */ crearTurno);

// Obtener todos los turnos (admin)
router.get("/", /* verifyToken, */ obtenerTurnos);

// Turnos de un usuario específico
router.get("/usuario/:idUsuario", /* verifyToken, */ obtenerTurnosPorUsuario);

// Turnos ocupados por fecha (cualquier cliente)
router.get("/fecha/:fecha", /* verifyToken, */ obtenerTurnosPorFecha);

// Cancelar turno
router.put("/:id/cancelar", /* verifyToken, */ cancelarTurno);

// Editar turno (admin)
router.put("/:id", /* verifyToken, verifyAdmin, */ actualizarTurno);

module.exports = router;
