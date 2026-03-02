const express = require("express");
const router = express.Router();

// Importa el pool de conexiones que creamos en db.js
const pool = require("../db");

// GET /clientes → retorna todos los registros
router.get("/", async (req, res) => {
  try {
    // Ejecuta la consulta SQL y espera el resultado
    const { rows } = await pool.query(
      "SELECT rut, nombre, edad FROM clientes ORDER BY nombre",
    );

    // Responde con los datos en formato JSON
    res.status(200).json(rows);
  } catch (error) {
    // Si algo sale mal, responde con error 500
    console.error("Error en GET /clientes:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /clientes → crea un nuevo registro
router.post("/", async (req, res) => {
  // Extrae los datos del cuerpo de la petición
  const { rut, nombre, edad } = req.body;

  // Validación 1: todos los campos son obligatorios
  if (!rut || !nombre || !edad) {
    return res
      .status(400)
      .json({ error: "rut, nombre y edad son obligatorios" });
  }

  // Validación 2: edad debe ser un número entero positivo
  if (!Number.isInteger(Number(edad)) || Number(edad) <= 0) {
    return res
      .status(400)
      .json({ error: "edad debe ser un número entero positivo" });
  }

  try {
    // Inserta el nuevo cliente con consulta parametrizada
    const { rows } = await pool.query(
      "INSERT INTO clientes (rut, nombre, edad) VALUES ($1, $2, $3) RETURNING *",
      [rut, nombre, Number(edad)],
    );

    // Responde con el registro recién creado y código 201
    res.status(201).json(rows[0]);
  } catch (error) {
    // Detecta específicamente el error de llave duplicada de PostgreSQL
    if (error.code === "23505") {
      return res.status(409).json({ error: `El rut ${rut} ya existe` });
    }

    console.error("Error en POST /clientes:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE /clientes/:rut → elimina un cliente por rut
router.delete("/:rut", async (req, res) => {
  // Extrae el rut de los parámetros de la URL
  const { rut } = req.params;

  try {
    // Ejecuta la consulta y retorna el registro eliminado
    const { rows } = await pool.query(
      "DELETE FROM clientes WHERE rut = $1 RETURNING *",
      [rut],
    );

    // Si rows está vacío significa que el rut no existía
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Cliente con rut ${rut} no encontrado` });
    }

    // Responde con el registro eliminado
    res.status(200).json({ mensaje: "Cliente eliminado", cliente: rows[0] });
  } catch (error) {
    console.error("Error en DELETE /clientes:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT /clientes/:rut → modifica únicamente el nombre
router.put("/:rut", async (req, res) => {
  // Extrae el rut de la URL y el nombre del cuerpo
  const { rut } = req.params;
  const { nombre } = req.body;

  // Validación: nombre es obligatorio
  if (!nombre) {
    return res.status(400).json({ error: "El campo nombre es obligatorio" });
  }

  try {
    // Actualiza solo el nombre del cliente indicado
    const { rows } = await pool.query(
      "UPDATE clientes SET nombre = $1 WHERE rut = $2 RETURNING *",
      [nombre, rut],
    );

    // Si rows está vacío el rut no existía
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Cliente con rut ${rut} no encontrado` });
    }

    // Responde con el registro actualizado
    res.status(200).json({ mensaje: "Cliente actualizado", cliente: rows[0] });
  } catch (error) {
    console.error("Error en PUT /clientes:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;

/* 
## Conceptos importantes de este código

`async / await` es la forma moderna de manejar operaciones que toman tiempo, como consultar una base de datos. Sin esto, el servidor se quedaría esperando la respuesta de PostgreSQL sin poder atender otras peticiones.

Sin async / await Con async / await
──────────────────────────────────────────
El servidor se bloquea   El servidor sigue
esperando la consulta    atendiendo mientras
                        espera la consulta
    

`try / catch` captura cualquier error que ocurra dentro del bloque. Es como un arnés de seguridad: si algo falla, el servidor responde con un mensaje controlado en lugar de caerse.

`{ rows }` es desestructuración.La librería `pg` devuelve un objeto con varias propiedades, pero a nosotros solo nos interesa `rows` que contiene los registros de la consulta.

---

## Prueba el endpoint

Guarda con ** Ctrl + S ** y abre el navegador en:
```
http://localhost:3000/clientes */
