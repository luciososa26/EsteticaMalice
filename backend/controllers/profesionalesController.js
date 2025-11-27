const db = require("../config/db");

// ===============================
// Obtener todos los profesionales activos
// GET /api/profesionales
// ===============================
exports.obtenerProfesionales = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nombre_apellido, especialidad, telefono, estado, creado_en FROM profesionales WHERE estado = 'activo' ORDER BY nombre_apellido ASC"
    );

    res.json({
      ok: true,
      profesionales: rows,
    });
  } catch (error) {
    console.error("Error al obtener profesionales:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener los profesionales",
      error: error.message,
    });
  }
};

// ===============================
// Crear profesional
// POST /api/profesionales
// Body: { nombre_apellido, especialidad, telefono }
// ===============================
exports.crearProfesional = async (req, res) => {
  try {
    const { nombre_apellido, especialidad, telefono } = req.body;

    if (!nombre_apellido) {
      return res.status(400).json({
        ok: false,
        mensaje: "El nombre del profesional es obligatorio",
      });
    }

    const [result] = await db.query(
      `INSERT INTO profesionales (nombre_apellido, especialidad, telefono, estado)
       VALUES (?, ?, ?, 'activo')`,
      [nombre_apellido, especialidad || null, telefono || null]
    );

    res.status(201).json({
      ok: true,
      mensaje: "Profesional creado correctamente",
      profesional: {
        id: result.insertId,
        nombre_apellido,
        especialidad: especialidad || null,
        telefono: telefono || null,
        estado: "activo",
      },
    });
  } catch (error) {
    console.error("Error al crear profesional:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al crear el profesional",
      error: error.message,
    });
  }
};
