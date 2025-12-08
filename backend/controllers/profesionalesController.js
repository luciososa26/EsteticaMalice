const db = require("../config/db");

// ===============================
// Obtener TODOS los profesionales (ADMIN / general)
// GET /api/profesionales
// ===============================
exports.obtenerProfesionales = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, nombre_apellido, especialidad, telefono, estado, creado_en
       FROM profesionales
       ORDER BY nombre_apellido ASC`
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
// Obtener SOLO profesionales activos
// GET /api/profesionales/activos
// ===============================
exports.obtenerProfesionalesActivos = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, nombre_apellido, especialidad, telefono, estado, creado_en
       FROM profesionales
       WHERE estado = 'activo'
       ORDER BY nombre_apellido ASC`
    );

    res.json({
      ok: true,
      profesionales: rows,
    });
  } catch (error) {
    console.error("Error al obtener profesionales activos:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener los profesionales activos",
      error: error.message,
    });
  }
};

// ===============================
// Crear profesional
// POST /api/profesionales
// Body: { nombre_apellido, especialidad, telefono, estado }
// ===============================
exports.crearProfesional = async (req, res) => {
  try {
    const { nombre_apellido, especialidad, telefono, estado } = req.body;

    const [result] = await db.query(
      `INSERT INTO profesionales (nombre_apellido, especialidad, telefono, estado)
       VALUES (?, ?, ?, ?)`,
      [nombre_apellido, especialidad || null, telefono || null, estado]
    );

    res.json({
      ok: true,
      mensaje: "Profesional creado correctamente",
      profesional: {
        id: result.insertId,
        nombre_apellido,
        especialidad,
        telefono,
        estado,
      },
    });
  } catch (error) {
    console.error("Error al crear profesional:", error);
    res
      .status(500)
      .json({ ok: false, mensaje: "Error al crear profesional", error: error.message });
  }
};

// ===============================
// Cambiar estado profesional (activo / inactivo)
// PUT /api/profesionales/:id/estado
// Body: { estado: 'activo' | 'inactivo' }
// ===============================
exports.cambiarEstadoProfesional = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosPermitidos = ["activo", "inactivo"];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Estado inválido. Debe ser "activo" o "inactivo".',
      });
    }

    const [result] = await db.query(
      "UPDATE profesionales SET estado = ? WHERE id = ?",
      [estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Profesional no encontrado",
      });
    }

    // Devolvemos el profesional actualizado (opcional)
    const [rows] = await db.query(
      "SELECT * FROM profesionales WHERE id = ?",
      [id]
    );

    res.json({
      ok: true,
      mensaje: "Estado del profesional actualizado correctamente",
      profesional: rows[0],
    });
  } catch (error) {
    console.error("Error al cambiar estado del profesional:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al cambiar el estado del profesional",
      error: error.message,
    });
  }
};

// ===============================
// Actualizar profesional
// PUT /api/profesionales/:id
// ===============================
exports.actualizarProfesional = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_apellido, especialidad, telefono, estado } = req.body;

    const [result] = await db.query(
      `UPDATE profesionales 
       SET nombre_apellido = ?, especialidad = ?, telefono = ?, estado = ?
       WHERE id = ?`,
      [nombre_apellido, especialidad || null, telefono || null, estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Profesional no encontrado",
      });
    }

    res.json({
      ok: true,
      mensaje: "Profesional actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar profesional:", error);
    res
      .status(500)
      .json({ ok: false, mensaje: "Error al actualizar profesional", error: error.message });
  }
};

// ===============================
// Obtener profesional por ID
// GET /api/profesionales/:id
// ===============================
exports.obtenerProfesionalPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT id, nombre_apellido, especialidad, telefono, estado FROM profesionales WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Profesional no encontrado",
      });
    }

    return res.json({
      ok: true,
      profesional: rows[0],
    });
  } catch (error) {
    console.error("Error al obtener profesional por ID:", error);
    return res.status(500).json({
      ok: false,
      mensaje: "Error al obtener el profesional",
      error: error.message,
    });
  }
};
