const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const serviciosRoutes = require("./routes/serviciosRoutes"); // 👈 NUEVO

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MaliceEstetica API funcionando ✨");
});

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

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de servicios
app.use("/api/servicios", serviciosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
