
const express = require('express');
const cors = require('cors');

const app = express();

// ==================================
// MIDDLEWARES
// ==================================

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

// ==================================
// RUTAS
// ==================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'API NATV funcionando correctamente'
  });
});

// ==================================
// EXPORTAR APLICACIÓN
// ==================================

module.exports = app;
