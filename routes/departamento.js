const express = require("express");
const db = require("../config/db");

const router = express.Router();

// obtener todos los departamentos
router.get("/", async (req, res) => {
  try {
    const [departamentos] = await db.query("SELECT * FROM departamento");
    res.json(departamentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// obtener departamento
router.get("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM departamento WHERE id_departamento = ?",
      [req.params.id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        error: "No se encontró el departamento con el ID especificado",
      });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// crear departamento
router.post("/", async (req, res) => {
  const { nombre_departamento } = req.body;

  if (!nombre_departamento) {
    return res.status(400).json({
      error: "El nombre del departamento es requerido",
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO departamento (nombre_departamento) VALUES (?)",
      [nombre_departamento]
    );

    res.status(201).json({
      message:'Departamento creado'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// actualizar departamento
router.put("/:id", async (req, res) => {
  const { nombre_departamento } = req.body;
  const id = req.params.id;

  if (!nombre_departamento) {
    return res.status(400).json({
      error: "El nombre del departamento es requerido",
    });
  }

  try {
    const [result] = await db.query(
      "UPDATE departamento SET nombre_departamento = ? WHERE id_departamento = ?",
      [nombre_departamento, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "No se encontró el departamento con el ID especificado",
      });
    }

    res.json({
      message: "Departamento actualizado",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// borrar departamento
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM departamento WHERE id_departamento = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "No se encontró el departamento con el ID especificado",
      });
    }

    res.json({
      message: "Departamento eliminado",
    });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        error:
          "No se puede eliminar el departamento porque tiene gastos asociados",
      });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
