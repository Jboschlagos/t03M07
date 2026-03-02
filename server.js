// Importa express para crear el servidor web
const express = require('express');

// Importa path para manejar rutas de archivos del sistema
const path = require('path');

// Crea la aplicación express
const app = express();

// Puerto donde escuchará el servidor
const PORT = 3000;

// Middleware: permite que el servidor entienda JSON en las peticiones
app.use(express.json());

// Middleware: sirve los archivos estáticos de la carpeta public
// Esto permite que el navegador acceda a index.html, style.css y app.js
app.use(express.static(path.join(__dirname, 'public')));

// Importa las rutas de clientes (las escribiremos a continuación)
const clientesRouter = require('./src/routes/clientes');

// Le dice al servidor que use esas rutas bajo la ruta /clientes
app.use('/clientes', clientesRouter);

// Arranca el servidor y queda escuchando peticiones
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Guarda con **Ctrl + S**. Nodemon lo detectará y verás en la terminal: 
// Servidor corriendo en http://localhost:3000  