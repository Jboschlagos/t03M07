// Importa la librería dotenv y la activa inmediatamente
// Desde este momento process.env puede leer el archivo .env
require('dotenv').config();

// Importa específicamente la clase Pool de la librería pg
const { Pool } = require ('pg');

// Crea una instancia del Pool usando las variables de entorno
// Nunca escribimos los valores directamente aquí
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Exporta el pool para que otros archivos puedan usarlo
// Es como dejarlo disponible en una estantería compartida
module.exports = pool;
