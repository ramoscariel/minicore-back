const express = require("express");
const db = require("../config/db");

const router = express.Router();

// obtener todos los empleados
router.get("/", async (req, res) => {
  try {
    const [empleados] = await db.query("SELECT * FROM empleado");
    res.json(empleados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// obtener empleado
router.get("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM empleado WHERE id_empleado = ?",
      [req.params.id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        error: "No se encontró el empleado con el ID especificado",
      });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// crear empleado
router.post("/", async (req, res) => {
  const { nombre_empleado, cedula } = req.body;

  if (!nombre_empleado || !cedula) {
    return res.status(400).json({
      error: "Nombre y cédula son requeridos",
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO empleado (nombre_empleado, cedula) VALUES (?, ?)",
      [nombre_empleado, cedula]
    );

    res.status(201).json({
      message:'Empleado creado',
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: "La cédula ya está registrada",
      });
    }
    res.status(500).json({ error: err.message });
  }
});

// actualizar empleado
router.put("/:id", async (req, res) => {
  const { nombre_empleado, cedula } = req.body;
  const id = req.params.id;

  if (!nombre_empleado || !cedula) {
    return res.status(400).json({
      error: "Nombre y cédula son requeridos",
    });
  }

  try {
    const [result] = await db.query(
      "UPDATE empleado SET nombre_empleado = ?, cedula = ? WHERE id_empleado = ?",
      [nombre_empleado, cedula, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "No se encontró el empleado con el ID especificado",
      });
    }

    res.json({
      message: "Empleado actualizado",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: "La cédula ya está registrada",
      });
    }
    res.status(500).json({ error: err.message });
  }
});

// borrar empleado
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM empleado WHERE id_empleado = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "No se encontró el empleado con el ID especificado",
      });
    }

    res.json({
      message: "Empleado eliminado",
    });
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        error: "No se puede eliminar el empleado porque tiene gastos asociados",
      });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
