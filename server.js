const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); // change this
app.use(express.json());

// routes
const gastoRoutes = require('./routes/gasto');
const empleadoRoutes = require('./routes/empleado')
const departamentoRoutes = require('./routes/departamento')


app.use('/gasto', gastoRoutes);
app.use('/empleado', empleadoRoutes);
app.use('/departamento', departamentoRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));