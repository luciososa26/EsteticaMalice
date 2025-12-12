const express = require("express");
const router = express.Router();

const {
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
  cambiarEstadoServicio,
  obtenerServiciosAdmin
} = require("../controllers/serviciosController");

const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

// ===============================
//  RUTAS PÚBLICAS (CLIENTE)
// ===============================

// Lista para el frontend (solo activos)
router.get("/", obtenerServicios);

// Detalle de servicio
router.get("/:id", obtenerServicioPorId);

// ===============================
//  RUTAS SOLO ADMIN
// ===============================

// Listado completo (activos + pausados)
router.get(
  "/admin/all",
  verifyToken,
  verifyAdmin,
  obtenerServiciosAdmin
);

// Crear servicio
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  crearServicio
);

// Editar servicio
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  actualizarServicio
);

// Eliminar (si lo mantenés)
router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  eliminarServicio
);

// Cambiar estado (activo/pausado)
router.put(
  "/:id/estado",
  verifyToken,
  verifyAdmin,
  cambiarEstadoServicio
);

module.exports = router;
