const db = require("../config/db");

// ===============================
// Crear consulta
// POST /api/consultas
// Body: { nombre_apellido, email, telefono?, mensaje }
// ===============================
exports.crearConsulta = async (req, res) => {
  try {
    const { nombre_apellido, email, telefono, mensaje } = req.body;

    if (!nombre_apellido || !email || !mensaje) {
      return res.status(400).json({
        ok: false,
        mensaje: "Faltan datos obligatorios (nombre, email o mensaje).",
      });
    }

    const [result] = await db.query(
      `INSERT INTO consultas (nombre_apellido, email, telefono, mensaje)
       VALUES (?, ?, ?, ?)`,
      [nombre_apellido, email, telefono || null, mensaje]
    );

    res.status(201).json({
      ok: true,
      mensaje: "Tu consulta fue enviada correctamente. Te contactaremos a la brevedad.",
      consulta: {
        id: result.insertId,
        nombre_apellido,
        email,
        telefono,
        mensaje,
      },
    });
  } catch (error) {
    console.error("Error al crear consulta:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al enviar la consulta.",
      error: error.message,
    });
  }
};

// ===============================
// Obtener todas las consultas (para admin)
// GET /api/consultas
// ===============================
exports.obtenerConsultas = async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM consultas ORDER BY fecha_creacion DESC`
    );

    res.json({
      ok: true,
      consultas: rows,
    });
  } catch (error) {
    console.error("Error al obtener consultas:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener las consultas.",
      error: error.message,
    });
  }
};
