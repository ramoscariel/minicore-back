const express = require("express");
const db = require("../config/db");

const router = express.Router();

// obtener gastos totales por departamento en un rango de fechas
router.get("/total", async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;

  // validar fechas
  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({
      error: "Debe proporcionar fechaInicio y fechaFin como parámetros",
    });
  }

  try {
    const [result] = await db.query(
      `SELECT nombre_departamento, ifnull(SUM(B.monto),0.00) total FROM departamento A
            LEFT JOIN gasto B 
            ON A.id_departamento = B.id_departamento AND B.fecha BETWEEN ? AND ?
            GROUP BY A.nombre_departamento`,
      [fechaInicio, fechaFin]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// obtener todos los gastos
router.get("/", async (req, res) => {
  try {
    const [result] = await db.query(
      `SELECT * FROM gasto`,
      []
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// obtener gasto
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db.query(
      `SELECT * FROM gasto
    WHERE id_gasto = ?`,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        error: "No se encontró el gasto con el ID especificado",
      });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// crear gasto
router.post("/", async (req, res) => {
  const { id_empleado, id_departamento, descripcion, monto } = req.body;

  // validar campos existen
  if (!id_empleado || !id_departamento || !descripcion || !monto) {
    return res.status(400).json({
      error:
        "Todos los campos son obligatorios: id_empleado, id_departamento, descripcion, monto",
    });
  }

  // validar monto es positivo
  if (monto <= 0) {
    return res.status(400).json({
      error: "El monto debe ser un número positivo",
    });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO gasto (id_empleado, id_departamento, descripcion, monto) 
    VALUES (?, ?, ?, ?)`,
      [id_empleado, id_departamento, descripcion, monto]
    );

    res.status(201).json({
      message: "Gasto creado",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// actualizar gasto
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { id_empleado, id_departamento, fecha, descripcion, monto } = req.body;

  // validar campos existen
  if (!id_empleado || !id_departamento || !descripcion || !monto) {
    return res.status(400).json({
      error:
        "Todos los campos son obligatorios: id_empleado, id_departamento, descripcion, monto",
    });
  }

  // validar monto es positivo
  if (monto <= 0) {
    return res.status(400).json({
      error: "El monto debe ser un número positivo",
    });
  }

  try {
    const fechaToUse = fecha || new Date();

    const [result] = await db.query(
      `UPDATE gasto 
    SET id_empleado = ?, 
    id_departamento = ?,
    fecha=?,
    descripcion = ?, 
    monto = ?
    WHERE id_gasto = ?`,
      [id_empleado, id_departamento, fechaToUse, descripcion, monto, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "No se encontró el gasto con el ID especificado",
      });
    }

    res.json({
      message: "Gasto actualizado",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// eliminar gasto
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db.query("DELETE FROM gasto WHERE id_gasto = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "No se encontró el gasto con el ID especificado",
      });
    }

    res.json({
      mensaje: "Gasto eliminado",
      id_gasto: id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
