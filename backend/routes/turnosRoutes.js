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

const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

// ===============================
//   RUTAS PARA CLIENTE LOGUEADO
// ===============================

// Crear turno (cliente logueado)
router.post("/", verifyToken, crearTurno);

// Turnos de un usuario específico (cliente logueado)
// Idealmente, en el controlador validás que req.user.id === idUsuario
router.get("/usuario/:idUsuario", verifyToken, obtenerTurnosPorUsuario);

// Turnos ocupados por fecha (lo usa el front para bloquear horarios)
// Requiere usuario logueado (ya que solo se accede desde /turnos)
router.get("/fecha/:fecha", verifyToken, obtenerTurnosPorFecha);

// Cancelar turno propio (al menos requiere login)
// Si más adelante querés ser ultra estricto, en el controller verificás
// que el turno pertenezca a req.user.id o que sea ADMIN
router.put("/:id/cancelar", verifyToken, cancelarTurno);

// ===============================
//           RUTAS ADMIN
// ===============================

// Obtener TODOS los turnos (panel admin)
router.get(
  "/",
  verifyToken,
  verifyAdmin,
  obtenerTurnos
);

// Editar turno (panel admin)
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  actualizarTurno
);

module.exports = router;
