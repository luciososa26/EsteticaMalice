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

    // 1. Verificamos si YA existe un turno en esa fecha y hora (cualquier cliente / profesional)
    const [turnosExistentes] = await db.query(
      `SELECT id 
      FROM turnos 
      WHERE fecha = ? 
        AND hora = ? 
        AND estado IN ('pendiente', 'confirmado')`,
      [fecha, hora]
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

// ===============================
// Obtener turnos ocupados por fecha (cualquier cliente)
// GET /api/turnos/fecha/:fecha   (fecha = "YYYY-MM-DD")
// ===============================
exports.obtenerTurnosPorFecha = async (req, res) => {
  try {
    const { fecha } = req.params;

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
      WHERE t.fecha = ?
        AND t.estado IN ('pendiente', 'confirmado')
      ORDER BY t.hora ASC
      `,
      [fecha]
    );

    res.json({
      ok: true,
      turnos: rows,
    });
  } catch (error) {
    console.error('Error al obtener turnos por fecha:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener los turnos de ese día',
      error: error.message,
    });
  }
};

// ===============================
// Actualizar turno
// PUT /api/turnos/:id
// Body: { id_servicio?, id_profesional?, fecha?, hora?, estado? }
// ===============================
exports.actualizarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_servicio, id_profesional, fecha, hora, estado } = req.body;

    // 1) Buscamos el turno actual
    const [turnos] = await db.query(
      'SELECT * FROM turnos WHERE id = ?',
      [id]
    );

    if (turnos.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Turno no encontrado',
      });
    }

    const turnoActual = turnos[0];

    // 2) Construimos nuevos valores (si no vienen, usamos los actuales)
    const nuevoIdServicio = id_servicio ?? turnoActual.id_servicio;
    const nuevoIdProfesional = id_profesional ?? turnoActual.id_profesional;
    const nuevaFecha = fecha ?? turnoActual.fecha;
    const nuevaHora = hora ?? turnoActual.hora;
    const nuevoEstado = estado ?? turnoActual.estado;

    // 3) Validamos que el profesional no tenga turno ocupado en ese nuevo horario
    const [ocupados] = await db.query(
      `SELECT id 
       FROM turnos
       WHERE id_profesional = ?
         AND fecha = ?
         AND hora = ?
         AND estado IN ('pendiente', 'confirmado')
         AND id <> ?`,
      [nuevoIdProfesional, nuevaFecha, nuevaHora, id]
    );

    if (ocupados.length > 0) {
      return res.status(409).json({
        ok: false,
        mensaje: 'Ese horario ya está ocupado para este profesional',
      });
    }

    // 4) Actualizamos
    const [result] = await db.query(
      `UPDATE turnos
       SET id_servicio = ?, id_profesional = ?, fecha = ?, hora = ?, estado = ?
       WHERE id = ?`,
      [
        nuevoIdServicio,
        nuevoIdProfesional,
        nuevaFecha,
        nuevaHora,
        nuevoEstado,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No se pudo actualizar el turno',
      });
    }

    // 5) Devolvemos el turno actualizado
    const [rowsActualizado] = await db.query(
      `SELECT 
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
      WHERE t.id = ?`,
      [id]
    );

    return res.json({
      ok: true,
      mensaje: 'Turno actualizado correctamente',
      turno: rowsActualizado[0],
    });
  } catch (error) {
    console.error('Error al actualizar turno:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al actualizar el turno',
      error: error.message,
    });
  }
};
