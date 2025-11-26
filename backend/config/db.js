// Cargamos las variables de entorno desde el archivo .env
require("dotenv").config();

// Importamos mysql2, que es el paquete que instalamos para conectarnos a MySQL
const mysql = require("mysql2");

// Creamos un "pool" de conexiones.
// Un pool es un grupo de conexiones reutilizables para que la app
// no tenga que abrir y cerrar una conexión nueva en cada consulta.
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // Dirección del servidor de BD (normalmente localhost)
  user: process.env.DB_USER,       // Usuario de MySQL
  password: process.env.DB_PASSWORD, // Password de MySQL
  database: process.env.DB_NAME,   // Nombre de la base de datos
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,        // Espera si todas las conexiones están ocupadas
  connectionLimit: 10,             // Máximo de conexiones simultáneas
  queueLimit: 0                    // 0 = sin límite de cola
});

// Exportamos el pool pero con soporte de "promesas".
// Esto nos permite usar async/await cuando hagamos consultas.
const db = pool.promise();

module.exports = db;
