
const express = require('express');
const router = express.Router();

const pool = require('../config/db');

const verificarToken = require('../middlewares/auth.middleware');
const autorizarRol = require('../middlewares/roles.middleware');

// ==========================================
// POST /api/solicitudes
// Crear solicitud - Solo clientes
// ==========================================

router.post(
  '/',
  verificarToken,
  autorizarRol('cliente'),
  async (req, res) => {

    const {
      id_servicio,
      descripcion,
      urgencia,
      contacto_preferido,
      referencias = []
    } = req.body;

    // El ID del usuario se obtiene del JWT
    const id_user = req.usuario.id_usuario;

    // ==================================
    // VALIDAR ENLACES DE REFERENCIA
    // ==================================

    if (!Array.isArray(referencias) || referencias.length > 10) {
      return res.status(400).json({
        message: 'Puedes compartir hasta 10 enlaces de referencia.'
      });
    }

    const enlaces = [];

    for (const referencia of referencias) {

      if (
        typeof referencia !== 'string' ||
        !referencia.trim() ||
        referencia.length > 2048
      ) {
        return res.status(400).json({
          message: 'Los enlaces de referencia no son válidos.'
        });
      }

      const enlace = referencia.trim();

      try {
        const url = new URL(enlace);

        if (!['http:', 'https:'].includes(url.protocol)) {
          return res.status(400).json({
            message: 'Los enlaces deben comenzar con http:// o https://.'
          });
        }

      } catch {
        return res.status(400).json({
          message: 'Uno de los enlaces de referencia no es válido.'
        });
      }

      enlaces.push(enlace);
    }

    // ==================================
    // VALIDAR DATOS OBLIGATORIOS
    // ==================================

    if (
      !Number.isSafeInteger(id_servicio) ||
      id_servicio <= 0 ||
      typeof descripcion !== 'string' ||
      !descripcion.trim()
    ) {
      return res.status(400).json({
        message: 'Debes indicar un servicio válido y describir tu solicitud.'
      });
    }

    if (
      (urgencia != null && (
        typeof urgencia !== 'string' ||
        urgencia.length > 20
      )) ||
      (contacto_preferido != null && (
        typeof contacto_preferido !== 'string' ||
        contacto_preferido.length > 50
      ))
    ) {
      return res.status(400).json({
        message: 'Los datos de contacto o urgencia no son válidos.'
      });
    }

    // ==================================
    // PREPARAR DESCRIPCIÓN FINAL
    // ==================================

    const descripcionFinal = enlaces.length > 0
      ? `${descripcion.trim()}\n\nEnlaces de referencia:\n${enlaces.join('\n')}`
      : descripcion.trim();

    let clienteDB;

    try {

      clienteDB = await pool.connect();

      await clienteDB.query('BEGIN');

      // ==================================
      // COMPROBAR QUE EL SERVICIO ESTÉ ACTIVO
      // ==================================

      const servicio = await clienteDB.query(`
        SELECT id_servicio
        FROM servicios
        WHERE id_servicio = $1
          AND estado = TRUE
      `, [id_servicio]);

      if (servicio.rows.length === 0) {
        await clienteDB.query('ROLLBACK');

        return res.status(404).json({
          message: 'El servicio no existe o no está disponible.'
        });
      }

      // ==================================
      // GUARDAR LA SOLICITUD
      // ==================================

      // Estado 1 = Solicitud (según nuestros seeds)
      const resultado = await clienteDB.query(`
        INSERT INTO solicitudes (
          id_user,
          id_servicio,
          id_estado,
          descripcion,
          urgencia,
          contacto_preferido
        )
        VALUES ($1, $2, 1, $3, $4, $5)
        RETURNING
          id_solicitud,
          id_user,
          id_servicio,
          id_estado,
          descripcion,
          urgencia,
          contacto_preferido,
          fecha_solicitud,
          fecha_entrega
      `, [
        id_user,
        id_servicio,
        descripcionFinal,
        urgencia || null,
        contacto_preferido || null
      ]);

      // ==================================
      // GENERAR EL NÚMERO DE PEDIDO
      // ==================================

      const nuevaSolicitud = resultado.rows[0];

      const numeroPedido =
        `NATV-${String(nuevaSolicitud.id_solicitud).padStart(6, '0')}`;

      const pedido = await clienteDB.query(`
        UPDATE solicitudes
        SET num_pedido = $1
        WHERE id_solicitud = $2
        RETURNING
          id_solicitud,
          num_pedido,
          id_user,
          id_servicio,
          id_estado,
          descripcion,
          urgencia,
          contacto_preferido,
          fecha_solicitud,
          fecha_entrega
      `, [
        numeroPedido,
        nuevaSolicitud.id_solicitud
      ]);

      await clienteDB.query('COMMIT');

      return res.status(201).json({
        message: 'Solicitud creada correctamente.',
        solicitud: pedido.rows[0]
      });

    } catch (error) {

      if (clienteDB) {
        await clienteDB.query('ROLLBACK');
      }

      console.error('Error al crear solicitud:', error);

      return res.status(500).json({
        message: 'No fue posible registrar la solicitud.'
      });

    } finally {

      if (clienteDB) {
        clienteDB.release();
      }

    }
  }
);

// ==========================================
// GET /api/solicitudes/mis-solicitudes
// Consultar las solicitudes del cliente
// ==========================================

router.get(
  ['/mis-solicitudes', '/usuario'],
  verificarToken,
  autorizarRol('cliente'),
  async (req, res) => {

    try {

      // ==================================
      // OBTENER USUARIO DESDE EL JWT
      // ==================================

      const id_user = req.usuario.id_usuario;

      // ==================================
      // CONSULTAR SOLICITUDES DEL CLIENTE
      // CON SU ESTADO REAL
      // ==================================

      const resultado = await pool.query(`
        SELECT
          s.id_solicitud,
          s.num_pedido,
          s.id_servicio,
          se.nom_servicio AS nombre_servicio,
          c.slug AS categoria,
          c.color_cat AS color,
          s.id_estado,
          e.nom_estado AS estado,
          e.descrip_estado AS descripcion_estado,
          e.color_estado,
          e.orden_estado,
          s.descripcion,
          s.urgencia,
          s.contacto_preferido,
          s.fecha_solicitud,
          s.fecha_entrega
        
          FROM solicitudes s
          INNER JOIN servicios se
            ON s.id_servicio = se.id_servicio
          INNER JOIN categorias c
            ON se.id_categoria = c.id_categoria
          INNER JOIN estados e
            ON s.id_estado = e.id_estado
          WHERE s.id_user = $1
          ORDER BY s.id_solicitud DESC

      `, [id_user]);

      // ==================================
      // RESPUESTA
      // ==================================

      return res.status(200).json({
        message: 'Solicitudes obtenidas correctamente.',
        total: resultado.rows.length,
        solicitudes: resultado.rows
      });

    } catch (error) {

      console.error('Error al obtener solicitudes:', error);

      return res.status(500).json({
        message: 'No fue posible obtener las solicitudes.'
      });

    }
  }
);

// ==========================================
// GET /api/solicitudes
// Consultar todas las solicitudes - Administrador
// ==========================================

router.get(
  '/',
  verificarToken,
  autorizarRol('administrador'),
  async (req, res) => {

    try {

            
      const resultado = await pool.query(`
        SELECT
          s.id_solicitud,
          s.num_pedido,
          s.id_user,
          u.nom_user AS nombre_cliente,
          u.app_user AS apellido_cliente,
          u.email AS email_cliente,
          s.id_servicio,
          se.nom_servicio AS nombre_servicio,
          s.id_estado,
          s.descripcion,
          s.urgencia,
          s.contacto_preferido,
          s.fecha_solicitud,
          s.fecha_entrega
        FROM solicitudes s
        INNER JOIN usuarios u
          ON s.id_user = u.id_user
        INNER JOIN servicios se
          ON s.id_servicio = se.id_servicio
        ORDER BY s.fecha_solicitud DESC, s.id_solicitud DESC
      `);


      return res.status(200).json({
        message: 'Solicitudes obtenidas correctamente.',
        total: resultado.rows.length,
        solicitudes: resultado.rows
      });

    } catch (error) {

      console.error('Error al obtener solicitudes:', error);

      return res.status(500).json({
        message: 'No fue posible obtener las solicitudes.'
      });

    }
  }
);

// ==========================================
// PATCH /api/solicitudes/:id/estado
// PUT /api/solicitudes/:id/estado
// Actualizar estado - Solo administrador
// ==========================================

const actualizarEstado = async (req, res) => {

  try {

    const id = Number(req.params.id);
    const { id_estado } = req.body;

    // ==================================
    // VALIDAR DATOS
    // ==================================

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        message: 'El ID de la solicitud no es válido.'
      });
    }

    if (!Number.isSafeInteger(id_estado) || id_estado <= 0) {
      return res.status(400).json({
        message: 'Debes indicar un estado válido.'
      });
    }

    // ==================================
    // COMPROBAR QUE EL ESTADO EXISTA
    // ==================================

    const estado = await pool.query(`
      SELECT id_estado
      FROM estados
      WHERE id_estado = $1
    `, [id_estado]);

    if (estado.rows.length === 0) {
      return res.status(400).json({
        message: 'El estado seleccionado no existe.'
      });
    }

    // ==================================
    // ACTUALIZAR SOLICITUD
    // ==================================

    const resultado = await pool.query(`
      UPDATE solicitudes
      SET id_estado = $1
      WHERE id_solicitud = $2
      RETURNING
        id_solicitud,
        num_pedido,
        id_user,
        id_servicio,
        id_estado,
        descripcion,
        urgencia,
        contacto_preferido,
        fecha_solicitud,
        fecha_entrega
    `, [id_estado, id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        message: 'Solicitud no encontrada.'
      });
    }

    return res.status(200).json({
      message: 'Estado actualizado correctamente.',
      solicitud: resultado.rows[0]
    });

  } catch (error) {

    console.error('Error al actualizar estado:', error);

    return res.status(500).json({
      message: 'No fue posible actualizar el estado.'
    });

  }
};

// ==========================================
// RUTAS PARA ACTUALIZAR ESTADO
// ==========================================

router.patch(
  '/:id/estado',
  verificarToken,
  autorizarRol('administrador'),
  actualizarEstado
);

router.put(
  '/:id/estado',
  verificarToken,
  autorizarRol('administrador'),
  actualizarEstado
);

module.exports = router;
