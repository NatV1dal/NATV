
const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// ==================================
// GET /api/servicios
// Obtener todos los servicios activos
// ==================================

router.get('/', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        s.id_servicio,
        s.nom_servicio AS nombre,
        s.descrip_servicio AS descripcion,
        s.caracteristicas_serv,
        s.precio_refe,
        s.img_servicio,
        s.estado,
        c.id_categoria,
        c.nom_categoria AS categoria,
        c.slug AS categoria_slug,
        c.color_cat AS color
      FROM servicios s
      INNER JOIN categorias c
        ON s.id_categoria = c.id_categoria
      WHERE s.estado = TRUE
      ORDER BY s.id_servicio ASC
    `);

    res.status(200).json(resultado.rows);

  } catch (error) {
    console.error('Error al obtener servicios:', error);

    res.status(500).json({
      message: 'Error al obtener los servicios'
    });
  }
});

module.exports = router;
