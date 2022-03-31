require("dotenv").config();

const express = require("express");
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json())

const { Pool } = require('pg')
const pool = new Pool({ ssl: { rejectUnauthorized: false } })

app.get("/", (req, res) => {
  res.send("Developer By: Daniel Eduardo Polo Campo")
});

app.get("/api/consultar", async (req, res) => {
  try {
    const query = `
        select resultado, registro
        from historico_multiplicaciones
        where estado = 'A'
    `
    const result = await pool.query(query)
    res.send({ success: true, result: result.rows })
  } catch (error) {
    console.error(error);
    res.send({ success: false, result: error.message })
  }
});

app.post("/api/almacenar", async (req, res) => {
  try {
    const query = `
        insert into historico_multiplicaciones(resultado) values (${req.body.resultado})
    `
    await pool.query(query)
    res.send({ success: true, result: "Registro Creado con Éxito" })
  } catch (error) {
    console.error(error);
    res.send({ success: false, result: error.message })
  }
});

app.delete("/api/eliminar", async (req, res) => {
  try {
    const query = `
        update historico_multiplicaciones 
        set estado = 'I' 
      `
    const result = await pool.query(query)
    res.send({ success: true, result: result.rowCount ? "Registros eliminados con Éxito" : "No se encontró empleado" })
  } catch (error) {
    console.error(error);
    res.send({ success: false, result: error.message })
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.info("PORT", process.env.PORT || 3000);
});