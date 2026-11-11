
const express = require('express');
const router = express.Router();

const pool = require('../config/db');

const verificarToken = require('../middlewares/auth.middleware');
const autorizarRol = require('../middlewares/roles.middleware');

// ==========================================
// POST /api/favoritos
// Agregar servicio a favoritos - Cliente
// ==========================================

router.post(
  '/',
  verificarToken,
  autorizarRol('cliente'),
  async (req, res) => {
    try {

      const { id_servicio } = req.body;

      // Obtener el usuario desde el JWT
      const id_user = req.usuario.id_usuario;

      // ==================================
      // VALIDAR SERVICIO
      // ==================================

      if (
        !Number.isSafeInteger(id_servicio) ||
        id_servicio <= 0
      ) {
        return res.status(400).json({
          message: 'El ID del servicio no es válido.'
        });
      }

      // ==================================
      // COMPROBAR QUE EL SERVICIO ESTÉ ACTIVO
      // ==================================

      const servicio = await pool.query(`
        SELECT id_servicio
        FROM servicios
        WHERE id_servicio = $1
          AND estado = TRUE
      `, [id_servicio]);

      if (servicio.rows.length === 0) {
        return res.status(404).json({
          message: 'El servicio no existe o no está disponible.'
        });
      }

      // ==================================
      // AGREGAR A FAVORITOS
      // ==================================

      const resultado = await pool.query(`
        INSERT INTO favoritos (
          id_user,
          id_servicio
        )
        VALUES ($1, $2)
        RETURNING
          id_favorito,
          id_user,
          id_servicio
      `, [id_user, id_servicio]);

      return res.status(201).json({
        message: 'Servicio agregado a favoritos correctamente.',
        favorito: resultado.rows[0]
      });

    } catch (error) {

      // Evitar servicios favoritos duplicados
      if (error.code === '23505') {
        return res.status(409).json({
          message: 'Este servicio ya está en tus favoritos.'
        });
      }

      console.error('Error al agregar favorito:', error);

      return res.status(500).json({
        message: 'No fue posible agregar el servicio a favoritos.'
      });
    }
  }
);

 // ==========================================
 // GET /api/favoritos
 // Consultar favoritos del cliente
 // ==========================================


router.get(
  ['/', '/usuario'],
  verificarToken,
  autorizarRol('cliente'),
  async (req, res) => {
    try {

      // Obtener el usuario desde el JWT
      const id_user = req.usuario.id_usuario;

      // Consultar sus servicios favoritos
      const resultado = await pool.query(`
        SELECT
          f.id_favorito,
          s.id_servicio,
          s.nom_servicio AS nombre,
          s.slug,
          s.descrip_servicio AS descripcion,
          s.precio_refe AS precio_desde,
          s.img_servicio AS imagen,
          s.estado,
          c.nom_categoria AS categoria,
          c.color_cat AS color
        FROM favoritos f
        INNER JOIN servicios s
          ON f.id_servicio = s.id_servicio
        INNER JOIN categorias c
          ON s.id_categoria = c.id_categoria
        WHERE f.id_user = $1
        ORDER BY f.id_favorito DESC
      `, [id_user]);

      return res.status(200).json({
        message: 'Favoritos obtenidos correctamente.',
        total: resultado.rows.length,
        favoritos: resultado.rows
      });

    } catch (error) {

      console.error('Error al consultar favoritos:', error);

      return res.status(500).json({
        message: 'No fue posible obtener tus favoritos.'
      });

    }
  }
);

 // ==========================================
 // DELETE /api/favoritos/:id
 // Quitar favorito - Solo cliente propietario
 // ==========================================

router.delete(
  '/:id',
  verificarToken,
  autorizarRol('cliente'),
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const id_user = req.usuario.id_usuario;

      // Validar ID del favorito
      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          message: 'El ID del favorito no es válido.'
        });
      }

      // Eliminar únicamente un favorito del cliente autenticado
      const resultado = await pool.query(`
        DELETE FROM favoritos
        WHERE id_favorito = $1
          AND id_user = $2
        RETURNING
          id_favorito,
          id_servicio
      `, [id, id_user]);

      if (resultado.rows.length === 0) {
        return res.status(404).json({
          message: 'Favorito no encontrado.'
        });
      }

      return res.status(200).json({
        message: 'Servicio eliminado de favoritos correctamente.',
        favorito: resultado.rows[0]
      });

    } catch (error) {
      console.error('Error al eliminar favorito:', error);

      return res.status(500).json({
        message: 'No fue posible eliminar el favorito.'
      });
    }
  }
);

module.exports = router;
