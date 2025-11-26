const express = require("express");
const cors = require("cors");

// Importamos la conexión a la base de datos
const db = require("./config/db");

const app = express();
const PORT = 3000;

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Ruta de prueba simple para ver si el servidor responde
app.get("/", (req, res) => {
  res.send("MaliceEstetica API funcionando ✨");
});

// Ruta de prueba para ver si la base de datos responde
app.get("/db-test", async (req, res) => {
  try {
    // Hacemos una consulta muy simple: 1 + 1
    const [rows] = await db.query("SELECT 1 + 1 AS resultado");

    // Devolvemos el resultado en formato JSON
    res.json({
      ok: true,
      mensaje: "Conexión a la base de datos OK ✅",
      resultado: rows[0].resultado, // debería ser 2
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

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
