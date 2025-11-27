const db = require("../config/db");

// ===============================
// Crear turno
// POST /api/turnos
// Body: { id_usuario, id_servicio, id_profesional, fecha, hora }
// ===============================
exports.crearTurno = async (req, res) => {
  try {
    const { id_usuario, id_servicio, id_profesional, fecha, hora } = req.body;

    // Validación básica de campos
    if (!id_usuario || !id_servicio || !id_profesional || !fecha || !hora) {
      return res.status(400).json({
        ok: false,
        mensaje: "Faltan datos obligatorios para crear el turno",
      });
    }

    // 1. Verificamos si el profesional ya tiene un turno en esa fecha y hora
    const [turnosExistentes] = await db.query(
      `SELECT id 
       FROM turnos 
       WHERE id_profesional = ? 
         AND fecha = ? 
         AND hora = ? 
         AND estado IN ('pendiente', 'confirmado')`,
      [id_profesional, fecha, hora]
    );

    if (turnosExistentes.length > 0) {
      return res.status(409).json({
        ok: false,
        mensaje: "Ese horario ya está ocupado para este profesional",
      });
    }

    // 2. Insertamos el turno
    const [result] = await db.query(
      `INSERT INTO turnos (id_usuario, id_servicio, id_profesional, fecha, hora, estado)
       VALUES (?, ?, ?, ?, ?, 'pendiente')`,
      [id_usuario, id_servicio, id_profesional, fecha, hora]
    );

    res.status(201).json({
      ok: true,
      mensaje: "Turno creado correctamente",
      turno: {
        id: result.insertId,
        id_usuario,
        id_servicio,
        id_profesional,
        fecha,
        hora,
        estado: "pendiente",
      },
    });
  } catch (error) {
    console.error("Error al crear turno:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al crear el turno",
      error: error.message,
    });
  }
};

// ===============================
// Obtener todos los turnos (con joins)
// GET /api/turnos
// ===============================
exports.obtenerTurnos = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        t.id,
        u.nombre_apellido AS usuario,
        p.nombre_apellido AS profesional,
        s.nombre AS servicio,
        t.fecha,
        t.hora,
        t.estado
      FROM turnos t
      JOIN usuarios u ON t.id_usuario = u.id
      JOIN profesionales p ON t.id_profesional = p.id
      JOIN servicios s ON t.id_servicio = s.id
      ORDER BY t.fecha DESC, t.hora DESC
      `
    );

    res.json({
      ok: true,
      turnos: rows,
    });
  } catch (error) {
    console.error("Error al obtener turnos:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener los turnos",
      error: error.message,
    });
  }
};

// ===============================
// Obtener turnos por usuario
// GET /api/turnos/usuario/:idUsuario
// ===============================
exports.obtenerTurnosPorUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        t.id,
        p.nombre_apellido AS profesional,
        s.nombre AS servicio,
        t.fecha,
        t.hora,
        t.estado
      FROM turnos t
      JOIN profesionales p ON t.id_profesional = p.id
      JOIN servicios s ON t.id_servicio = s.id
      WHERE t.id_usuario = ?
      ORDER BY t.fecha DESC, t.hora DESC
      `,
      [idUsuario]
    );

    res.json({
      ok: true,
      turnos: rows,
    });
  } catch (error) {
    console.error("Error al obtener turnos por usuario:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener los turnos del usuario",
      error: error.message,
    });
  }
};

// ===============================
// Cancelar turno (cambiar estado)
// PUT /api/turnos/:id/cancelar
// ===============================
exports.cancelarTurno = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "UPDATE turnos SET estado = 'cancelado' WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Turno no encontrado",
      });
    }

    res.json({
      ok: true,
      mensaje: "Turno cancelado correctamente",
    });
  } catch (error) {
    console.error("Error al cancelar turno:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al cancelar el turno",
      error: error.message,
    });
  }
};
