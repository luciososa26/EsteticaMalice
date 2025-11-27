const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Usamos JWT_SECRET desde el .env
const JWT_SECRET = process.env.JWT_SECRET;

// ===============================
// Registrar un nuevo usuario
// ===============================
exports.register = async (req, res) => {
  try {
    const { nombre_apellido, email, password, telefono } = req.body;

    // 1. Validar que todos los datos obligatorios vengan
    if (!nombre_apellido || !email || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: "Faltan datos obligatorios (nombre, email o password)",
      });
    }

    // 2. Verificar si el email ya está registrado
    const [existingUser] = await db.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        ok: false,
        mensaje: "El email ya está registrado",
      });
    }

    // 3. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 4. Insertar el nuevo usuario en la base de datos
    const [result] = await db.query(
      `INSERT INTO usuarios (nombre_apellido, email, password_hash, telefono, rol, estado)
       VALUES (?, ?, ?, ?, 'CLIENTE', 'activo')`,
      [nombre_apellido, email, password_hash, telefono || null]
    );

    // 5. Crear un token para el nuevo usuario
    const token = jwt.sign(
      {
        id: result.insertId,
        email,
        rol: "CLIENTE",
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    // 6. Devolver respuesta
    res.status(201).json({
      ok: true,
      mensaje: "Usuario registrado correctamente",
      token,
      usuario: {
        id: result.insertId,
        nombre_apellido,
        email,
        telefono: telefono || null,
        rol: "CLIENTE",
      },
    });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error interno al registrar usuario",
      error: error.message,
    });
  }
};

// ===============================
// Login de usuario
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validar que vengan email y password
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: "Email y password son obligatorios",
      });
    }

    // 2. Buscar el usuario por email
    const [rows] = await db.query(
      "SELECT id, nombre_apellido, email, password_hash, telefono, rol, estado FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        ok: false,
        mensaje: "Credenciales incorrectas (email)",
      });
    }

    const usuario = rows[0];

    // 3. Verificar estado del usuario
    if (usuario.estado !== "activo") {
      return res.status(403).json({
        ok: false,
        mensaje: "Usuario inactivo o bloqueado",
      });
    }

    // 4. Comparar la contraseña enviada con la contraseña encriptada
    const passwordValida = await bcrypt.compare(
      password,
      usuario.password_hash
    );

    if (!passwordValida) {
      return res.status(401).json({
        ok: false,
        mensaje: "Credenciales incorrectas (password)",
      });
    }

    // 5. Crear token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    // 6. Devolver usuario y token
    res.json({
      ok: true,
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre_apellido: usuario.nombre_apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error interno al hacer login",
      error: error.message,
    });
  }
};

// ===============================
// Obtener datos del usuario logueado
// ===============================
exports.me = async (req, res) => {
  try {
    // Gracias al middleware verifyToken, acá ya tenemos req.user
    const { id } = req.user;

    // Buscamos el usuario en la base de datos
    const [rows] = await db.query(
      "SELECT id, nombre_apellido, email, telefono, rol, estado, creado_en FROM usuarios WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        mensaje: "Usuario no encontrado",
      });
    }

    const usuario = rows[0];

    res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    console.error("Error en me:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error interno al obtener el usuario",
      error: error.message,
    });
  }
};
