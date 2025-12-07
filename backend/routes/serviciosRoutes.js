const express = require("express");
const router = express.Router();

// Controlador de servicios
const {
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
  cambiarEstadoServicio,
  obtenerServiciosAdmin
} = require("../controllers/serviciosController");

// (Más adelante podemos proteger algunas rutas con verifyToken y rol ADMIN)
const verifyToken = require("../middleware/verifyToken");

// Rutas públicas (cualquier usuario puede ver la lista de servicios)
router.get("/", obtenerServicios);
// Para admin: todos (activo + inactivo)
router.get('/admin', /* verifyToken, */ obtenerServiciosAdmin);
router.get("/:id", obtenerServicioPorId);

// Rutas que idealmente serían solo para ADMIN
// Por ahora no validamos el rol, solo el token si quisieras:
router.post("/", /* verifyToken, */ crearServicio);
router.put("/:id", /* verifyToken, */ actualizarServicio);
router.delete("/:id", /* verifyToken, */ eliminarServicio);
// Cambiar estado del servicio (activo/pausado)
router.put('/:id/estado', /* verifyToken, */ cambiarEstadoServicio);


module.exports = router;
