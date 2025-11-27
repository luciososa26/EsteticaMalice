const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para proteger rutas con JWT
module.exports = (req, res, next) => {
  try {
    // Esperamos un header tipo: Authorization: Bearer TOKEN_AQUI
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        mensaje: "No se envió el header Authorization",
      });
    }

    // Separamos "Bearer" del token
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        ok: false,
        mensaje: "Formato de token inválido",
      });
    }

    const token = parts[1];

    // Verificamos el token con la clave secreta
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Error al verificar token:", err);
        return res.status(401).json({
          ok: false,
          mensaje: "Token inválido o expirado",
        });
      }

      // Guardamos los datos del usuario dentro del request
      // para usarlos en los controladores
      req.user = decoded; // { id, email, rol, iat, exp }

      // Pasamos al siguiente middleware o controlador
      next();
    });
  } catch (error) {
    console.error("Error en verifyToken:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error interno al validar token",
      error: error.message,
    });
  }
};
