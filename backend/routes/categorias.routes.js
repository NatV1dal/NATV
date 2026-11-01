
const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// ==================================
// GET /api/categorias
// Obtener todas las categorías
// ==================================

router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        id_categoria AS id,
        nom_categoria AS nombre,
        slug,
        descrip_cate AS descripcion,
        icono_cat AS icono,
        color_cat AS color
      FROM categorias
      ORDER BY id_categoria ASC
    `);

    res.status(200).json(resultado.rows);

  } catch (error) {
    console.error('Error al obtener categorías:', error);

    res.status(500).json({
      message: 'Error al obtener las categorías'
    });
  }
});

module.exports = router;
