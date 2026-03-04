const express = require("express");
const router = express.Router();

// Importa el pool de conexiones que creamos en db.js
const pool = require("../db");

// GET /clientes → con filtros opcionales por query params
router.get("/", async (req, res) => {
  // Extraemos todos los posibles filtros que pueden llegar
  const { rut, edad, edadMin, edadMax, nombre } = req.query;

  try {
    // CASO 1: filtro por rut
    if (rut) {
      const { rows } = await pool.query(
        "SELECT rut, nombre, edad FROM clientes WHERE rut = $1",
        [rut],
      );

      if (rows.length === 0) {
        return res.status(404).json({ mensaje: "Cliente no existe" });
      }
      return res.status(200).json(rows);
    }

    // CASO 2: filtro por edad exacta
    if (edad) {
      const { rows } = await pool.query(
        "SELECT rut, nombre, edad FROM clientes WHERE edad = $1 ORDER BY nombre",
        [Number(edad)],
      );

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ mensaje: "No hay clientes que cumplan con el criterio" });
      }
      return res.status(200).json(rows);
    }

    // CASO 3: filtro por rango de edad
    if (edadMin && edadMax) {
      const { rows } = await pool.query(
        "SELECT rut, nombre, edad FROM clientes WHERE edad BETWEEN $1 AND $2 ORDER BY nombre",
        [Number(edadMin), Number(edadMax)],
      );

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ mensaje: "No hay clientes que cumplan con el criterio" });
      }
      return res.status(200).json(rows);
    }

    // CASO 4: filtro por nombre o prefijo
    if (nombre) {
      const { rows } = await pool.query(
        "SELECT rut, nombre, edad FROM clientes WHERE nombre ILIKE $1 ORDER BY nombre",
        [nombre + "%"],
      );

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ mensaje: "No hay clientes que cumplan con el criterio" });
      }
      return res.status(200).json(rows);
    }

    // CASO 5: sin filtros, retorna todos
    const { rows } = await pool.query(
      "SELECT rut, nombre, edad FROM clientes ORDER BY nombre",
    );
    return res.status(200).json(rows);
  } catch (error) {
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

// DELETE /clientes?edad= o ?edadMin=&edadMax= → elimina por criterio
router.delete("/", async (req, res) => {
  const { edad, edadMin, edadMax } = req.query;

  try {
    // CASO 1: eliminar por edad exacta
    if (edad) {
      const { rows } = await pool.query(
        "DELETE FROM clientes WHERE edad = $1 RETURNING nombre",
        [Number(edad)],
      );

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ mensaje: "No hay clientes que cumplan con el criterio" });
      }

      const nombres = rows.map((c) => c.nombre);
      return res.status(200).json({ mensaje: "Clientes eliminados", nombres });
    }

    // CASO 2: eliminar por rango de edad
    if (edadMin && edadMax) {
      const { rows } = await pool.query(
        "DELETE FROM clientes WHERE edad BETWEEN $1 AND $2 RETURNING nombre",
        [Number(edadMin), Number(edadMax)],
      );

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ mensaje: "No hay clientes que cumplan con el criterio" });
      }

      const nombres = rows.map((c) => c.nombre);
      return res.status(200).json({ mensaje: "Clientes eliminados", nombres });
    }

    // Si no llegó ningún filtro válido
    return res
      .status(400)
      .json({ error: "Debe indicar un criterio de eliminación" });
  } catch (error) {
    console.error("Error en DELETE /clientes:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE /clientes/:rut → elimina uno por rut (se mantiene igual)
router.delete("/:rut", async (req, res) => {
  const { rut } = req.params;

  try {
    const { rows } = await pool.query(
      "DELETE FROM clientes WHERE rut = $1 RETURNING *",
      [rut],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Cliente con rut ${rut} no encontrado` });
    }

    res.status(200).json({ mensaje: "Cliente eliminado", cliente: rows[0] });
  } catch (error) {
    console.error("Error en DELETE /clientes/:rut:", error.message);
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


