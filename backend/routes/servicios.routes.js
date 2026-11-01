
const express = require('express');
const pool = require('../config/db');
const verificarToken = require('../middlewares/auth.middleware');
const autorizarRol = require('../middlewares/roles.middleware');
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


 // ==================================
 // GET /api/servicios/:id
 // Obtener un servicio por su ID
 // ==================================

router.get('/:id', async (req, res) => {
  try {

    const { id } = req.params;

    // Validar que el ID sea un entero positivo
    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        message: 'El ID del servicio no es válido'
      });
    }

    const resultado = await pool.query(`
      SELECT
        s.id_servicio,
        s.nom_servicio AS nombre,
        s.slug,
        s.descrip_servicio AS descripcion,
        s.caracteristicas_serv AS incluye,
        s.precio_refe AS precio_desde,
        s.img_servicio AS imagen,
        s.trabajos,
        s.estado,
        c.id_categoria,
        c.nom_categoria AS categoria,
        c.slug AS categoria_slug,
        c.color_cat AS color
      FROM servicios s
      INNER JOIN categorias c
        ON s.id_categoria = c.id_categoria
      WHERE s.id_servicio = $1
        AND s.estado = TRUE
    `, [id]);

    // Servicio no encontrado
    if (resultado.rows.length === 0) {
      return res.status(404).json({
        message: 'Servicio no encontrado'
      });
    }

    // Servicio encontrado
    res.status(200).json(resultado.rows[0]);

  } catch (error) {
    console.error('Error al obtener servicio:', error);

    res.status(500).json({
      message: 'Error al obtener el servicio'
    });
  }
});


 // ==========================================
 // POST /api/servicios
 // Crear un servicio - Solo administrador
 // ==========================================

router.post(
  '/',
  verificarToken,
  autorizarRol('administrador'),
  async (req, res) => {
    try {

      const {
        id_categoria,
        nombre,
        slug,
        descripcion,
        incluye,
        precio_desde,
        imagen,
        trabajos
      } = req.body;

      // ==================================
      // VALIDAR DATOS OBLIGATORIOS
      // ==================================

      const slugNormalizado =
        typeof slug === 'string'
          ? slug.trim().toLowerCase()
          : '';

      if (
        !Number.isInteger(id_categoria) ||
        id_categoria < 1 ||
        typeof nombre !== 'string' ||
        !nombre.trim() ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugNormalizado) ||
        typeof descripcion !== 'string' ||
        !descripcion.trim() ||
        typeof precio_desde !== 'number' ||
        !Number.isFinite(precio_desde) ||
        precio_desde < 0
      ) {
        return res.status(400).json({
          message: 'Los datos obligatorios del servicio no son válidos.'
        });
      }

      if (
        (incluye != null && typeof incluye !== 'string') ||
        (imagen != null && typeof imagen !== 'string') ||
        (trabajos != null && (
          !Array.isArray(trabajos) ||
          !trabajos.every(item => typeof item === 'string')
        ))
      ) {
        return res.status(400).json({
          message: 'El formato de los datos opcionales no es válido.'
        });
      }

      // ==================================
      // INSERTAR SERVICIO EN POSTGRESQL
      // ==================================

      const resultado = await pool.query(`
        INSERT INTO servicios (
          id_categoria,
          nom_servicio,
          slug,
          descrip_servicio,
          caracteristicas_serv,
          precio_refe,
          img_servicio,
          trabajos,
          estado
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8::jsonb, TRUE
        )
        RETURNING
          id_servicio AS id,
          id_categoria,
          nom_servicio AS nombre,
          slug,
          descrip_servicio AS descripcion,
          caracteristicas_serv AS incluye,
          precio_refe AS precio_desde,
          img_servicio AS imagen,
          trabajos,
          estado
      `, [
        id_categoria,
        nombre.trim(),
        slugNormalizado,
        descripcion.trim(),
        incluye || null,
        precio_desde,
        imagen || null,
        JSON.stringify(trabajos || [])
      ]);

      return res.status(201).json({
        message: 'Servicio creado correctamente.',
        servicio: resultado.rows[0]
      });

    } catch (error) {

      // Slug duplicado
      if (error.code === '23505') {
        return res.status(409).json({
          message: 'Ya existe un servicio con ese slug.'
        });
      }

      // Categoría inexistente
      if (error.code === '23503') {
        return res.status(400).json({
          message: 'La categoría seleccionada no existe.'
        });
      }

      console.error('Error al crear servicio:', error);

      return res.status(500).json({
        message: 'No fue posible crear el servicio.'
      });

    }
  }
);


 // ==========================================
 // PUT /api/servicios/:id
 // Editar servicio - Solo administrador
 // ==========================================

router.put(
  '/:id',
  verificarToken,
  autorizarRol('administrador'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        id_categoria,
        nombre,
        slug,
        descripcion,
        incluye,
        precio_desde,
        imagen,
        trabajos
      } = req.body;

      // Validar el ID del servicio
      if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({
          message: 'El ID del servicio no es válido.'
        });
      }

      // Normalizar el slug
      const slugNormalizado =
        typeof slug === 'string'
          ? slug.trim().toLowerCase()
          : '';

      // Validar datos obligatorios
      if (
        !Number.isInteger(id_categoria) ||
        id_categoria < 1 ||
        typeof nombre !== 'string' ||
        !nombre.trim() ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugNormalizado) ||
        typeof descripcion !== 'string' ||
        !descripcion.trim() ||
        typeof precio_desde !== 'number' ||
        !Number.isFinite(precio_desde) ||
        precio_desde < 0
      ) {
        return res.status(400).json({
          message: 'Los datos del servicio no son válidos.'
        });
      }

      // Validar campos opcionales
      if (
        (incluye != null && typeof incluye !== 'string') ||
        (imagen != null && typeof imagen !== 'string') ||
        (trabajos != null && (
          !Array.isArray(trabajos) ||
          !trabajos.every(item => typeof item === 'string')
        ))
      ) {
        return res.status(400).json({
          message: 'El formato de los datos opcionales no es válido.'
        });
      }

      // Actualizar servicio en PostgreSQL
      const resultado = await pool.query(`
        UPDATE servicios
        SET
          id_categoria = $1,
          nom_servicio = $2,
          slug = $3,
          descrip_servicio = $4,
          caracteristicas_serv = $5,
          precio_refe = $6,
          img_servicio = $7,
          trabajos = $8::jsonb
        WHERE id_servicio = $9
        RETURNING
          id_servicio AS id,
          id_categoria,
          nom_servicio AS nombre,
          slug,
          descrip_servicio AS descripcion,
          caracteristicas_serv AS incluye,
          precio_refe AS precio_desde,
          img_servicio AS imagen,
          trabajos,
          estado
      `, [
        id_categoria,
        nombre.trim(),
        slugNormalizado,
        descripcion.trim(),
        incluye || null,
        precio_desde,
        imagen || null,
        JSON.stringify(trabajos || []),
        id
      ]);

      // Servicio inexistente
      if (resultado.rows.length === 0) {
        return res.status(404).json({
          message: 'Servicio no encontrado.'
        });
      }

      return res.status(200).json({
        message: 'Servicio actualizado correctamente.',
        servicio: resultado.rows[0]
      });

    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({
          message: 'Ya existe otro servicio con ese slug.'
        });
      }

      if (error.code === '23503') {
        return res.status(400).json({
          message: 'La categoría seleccionada no existe.'
        });
      }

      console.error('Error al editar servicio:', error);

      return res.status(500).json({
        message: 'No fue posible actualizar el servicio.'
      });
    }
  }
);

 // ==========================================
 // DELETE /api/servicios/:id
 // Desactivar servicio - Solo administrador
 // ==========================================

router.delete(
  '/:id',
  verificarToken,
  autorizarRol('administrador'),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      // Validar ID
      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          message: 'El ID del servicio no es válido.'
        });
      }

      // Desactivar sin borrar el registro
      const resultado = await pool.query(`
        UPDATE servicios
        SET estado = FALSE
        WHERE id_servicio = $1
          AND estado = TRUE
        RETURNING
          id_servicio AS id,
          nom_servicio AS nombre,
          estado
      `, [id]);

      // Servicio inexistente o inactivo
      if (resultado.rows.length === 0) {
        return res.status(404).json({
          message: 'Servicio no encontrado o ya desactivado.'
        });
      }

      return res.status(200).json({
        message: 'Servicio desactivado correctamente.',
        servicio: resultado.rows[0]
      });

    } catch (error) {
      console.error('Error al desactivar servicio:', error);

      return res.status(500).json({
        message: 'No fue posible desactivar el servicio.'
      });
    }
  }
);


module.exports = router;
