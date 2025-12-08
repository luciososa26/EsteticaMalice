const db = require('../config/db');

// ===============================
// Crear consulta (contacto)
// POST /api/consultas
// Body: { nombre, email, telefono?, mensaje }
// ===============================
exports.crearConsulta = async (req, res) => {
  try {
    const { nombre, email, telefono, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Nombre, email y mensaje son obligatorios',
      });
    }

    const [result] = await db.query(
      `INSERT INTO consultas (nombre, email, telefono, mensaje)
       VALUES (?, ?, ?, ?)`,
      [nombre, email, telefono || null, mensaje]
    );

    res.status(201).json({
      ok: true,
      mensaje: 'Consulta enviada correctamente',
      consulta: {
        id: result.insertId,
        nombre,
        email,
        telefono: telefono || null,
        mensaje,
      },
    });
  } catch (error) {
    console.error('Error al crear consulta:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al enviar la consulta',
      error: error.message,
    });
  }
};

// ===============================
// (Opcional) Listar consultas (para admin)
// GET /api/consultas
// ===============================
exports.obtenerConsultas = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM consultas ORDER BY fecha_envio DESC`
    );

    res.json({
      ok: true,
      consultas: rows,
    });
  } catch (error) {
    console.error('Error al obtener consultas:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error al obtener las consultas',
      error: error.message,
    });
  }
};

// ===============================
// Cambiar estado de una consulta
// PUT /api/consultas/:id/estado
// Body: { estado: 'pendiente' | 'respondida' | 'archivada' }
// ===============================
exports.cambiarEstadoConsulta = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // VALIDAR que el estado sea uno de los permitidos en el ENUM
    const estadosPermitidos = ['pendiente', 'respondida', 'archivada'];

    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        ok: false,
        mensaje:
          'Estado inválido. Debe ser "pendiente", "respondida" o "archivada".',
      });
    }

    const [result] = await db.query(
      'UPDATE consultas SET estado = ? WHERE id = ?',
      [estado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Consulta no encontrada',
      });
    }

    // Opcional: devolver la consulta actualizada
    const [rows] = await db.query(
      'SELECT * FROM consultas WHERE id = ?',
      [id]
    );

    return res.json({
      ok: true,
      mensaje: 'Estado de la consulta actualizado correctamente',
      consulta: rows[0],
    });
  } catch (error) {
    console.error('Error al cambiar estado de la consulta:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al cambiar el estado de la consulta',
      error: error.message,
    });
  }
};