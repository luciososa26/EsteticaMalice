const db = require("../config/db");

// ===============================
// Obtener todos los servicios (solo los activos)
// GET /api/servicios
// ===============================
exports.obtenerServicios = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nombre, descripcion, duracion_minutos, precio, estado, creado_en FROM servicios WHERE estado = 'activo' ORDER BY nombre ASC"
    );

    res.json({
      ok: true,
      servicios: rows,
    });
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener los servicios",
      error: error.message,
    });
  }
};

// ===============================
// Obtener un servicio por ID
// GET /api/servicios/:id
// ===============================
exports.obtenerServicioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT id, nombre, descripcion, duracion_minutos, precio, estado, creado_en FROM servicios WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Servicio no encontrado",
      });
    }

    res.json({
      ok: true,
      servicio: rows[0],
    });
  } catch (error) {
    console.error("Error al obtener servicio:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al obtener el servicio",
      error: error.message,
    });
  }
};

// ===============================
// Crear un nuevo servicio
// POST /api/servicios
// Body: { nombre, descripcion, duracion_minutos, precio }
// ===============================
exports.crearServicio = async (req, res) => {
  try {
    const { nombre, descripcion, duracion_minutos, precio } = req.body;

    // Validaciones básicas
    if (!nombre || !duracion_minutos || !precio) {
      return res.status(400).json({
        ok: false,
        mensaje: "Nombre, duración y precio son obligatorios",
      });
    }

    const [result] = await db.query(
      `INSERT INTO servicios (nombre, descripcion, duracion_minutos, precio, estado)
       VALUES (?, ?, ?, ?, 'activo')`,
      [nombre, descripcion || null, duracion_minutos, precio]
    );

    res.status(201).json({
      ok: true,
      mensaje: "Servicio creado correctamente",
      servicio: {
        id: result.insertId,
        nombre,
        descripcion: descripcion || null,
        duracion_minutos,
        precio,
        estado: "activo",
      },
    });
  } catch (error) {
    console.error("Error al crear servicio:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al crear el servicio",
      error: error.message,
    });
  }
};

// ===============================
// Actualizar un servicio
// PUT /api/servicios/:id
// ===============================
exports.actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, duracion_minutos, precio, estado } = req.body;

    // Buscamos primero si existe
    const [rows] = await db.query("SELECT * FROM servicios WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Servicio no encontrado",
      });
    }

    // Actualizamos solo lo que venga en el body, sino dejamos lo que ya estaba
    const servicioActual = rows[0];

    const nuevoNombre = nombre || servicioActual.nombre;
    const nuevaDescripcion =
      descripcion !== undefined ? descripcion : servicioActual.descripcion;
    const nuevaDuracion =
      duracion_minutos || servicioActual.duracion_minutos;
    const nuevoPrecio = precio || servicioActual.precio;
    const nuevoEstado = estado || servicioActual.estado;

    await db.query(
      `UPDATE servicios 
       SET nombre = ?, descripcion = ?, duracion_minutos = ?, precio = ?, estado = ?
       WHERE id = ?`,
      [nuevoNombre, nuevaDescripcion, nuevaDuracion, nuevoPrecio, nuevoEstado, id]
    );

    res.json({
      ok: true,
      mensaje: "Servicio actualizado correctamente",
      servicio: {
        id,
        nombre: nuevoNombre,
        descripcion: nuevaDescripcion,
        duracion_minutos: nuevaDuracion,
        precio: nuevoPrecio,
        estado: nuevoEstado,
      },
    });
  } catch (error) {
    console.error("Error al actualizar servicio:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al actualizar el servicio",
      error: error.message,
    });
  }
};

// ===============================
// "Eliminar" un servicio (baja lógica)
// DELETE /api/servicios/:id
// ===============================
exports.eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;

    // En lugar de borrar el registro, lo marcamos como inactivo
    const [result] = await db.query(
      "UPDATE servicios SET estado = 'inactivo' WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Servicio no encontrado",
      });
    }

    res.json({
      ok: true,
      mensaje: "Servicio marcado como inactivo",
    });
  } catch (error) {
    console.error("Error al eliminar servicio:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al eliminar el servicio",
      error: error.message,
    });
  }
};
