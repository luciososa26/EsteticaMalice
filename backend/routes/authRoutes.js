const express = require("express");
const router = express.Router();

// Importamos las funciones del controlador de auth
const { register, login, me } = require("../controllers/authController");

// Importamos el middleware que verifica el token
const verifyToken = require("../middleware/verifyToken");

// Ruta para registrar un nuevo usuario
router.post("/register", register);

// Ruta para iniciar sesión
router.post("/login", login);

// Ruta para obtener los datos del usuario logueado (requiere token)
router.get("/me", verifyToken, me);

module.exports = router;
