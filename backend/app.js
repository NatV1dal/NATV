
const express = require('express');
const cors = require('cors');

const categoriasRoutes = require('./routes/categorias.routes');
const serviciosRoutes = require('./routes/servicios.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// ==================================
// MIDDLEWARES
// ==================================

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

// ==================================
// RUTA DE PRUEBA
// ==================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'API NATV funcionando correctamente'
  });
});

// ==================================
// RUTAS DE LA API REST
// ==================================

app.use('/api/categorias', categoriasRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/auth', authRoutes);

// ==================================
// EXPORTAR APLICACIÓN
// ==================================

module.exports = app;
