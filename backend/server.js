const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de prueba del servidor
app.get("/", (req, res) => {
  res.send("MaliceEstetica API funcionando ✨");
});

// Ruta de prueba de DB
app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS resultado");
    res.json({
      ok: true,
      mensaje: "Conexión a la base de datos OK ✅",
      resultado: rows[0].resultado,
    });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error al conectar con la base de datos",
      error: error.message,
    });
  }
});

// Usamos las rutas de autenticación bajo /api/auth
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
