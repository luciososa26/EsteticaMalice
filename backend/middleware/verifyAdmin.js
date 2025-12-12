// middleware/verifyAdmin.js
module.exports = (req, res, next) => {
  try {
    const user = req.user; // viene seteado por verifyToken

    if (!user) {
      return res.status(401).json({
        ok: false,
        mensaje: 'No se encontró usuario en el token',
      });
    }

    if (user.rol && user.rol.toUpperCase() === 'ADMIN') {
      return next();
    }

    return res.status(403).json({
      ok: false,
      mensaje: 'No tenés permisos de administrador',
    });
  } catch (error) {
    console.error('Error en verifyAdmin:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al verificar rol de administrador',
      error: error.message,
    });
  }
};
