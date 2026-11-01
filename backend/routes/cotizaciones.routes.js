
const express = require('express');
const router = express.Router();

const pool = require('../config/db');

const verificarToken = require('../middlewares/auth.middleware');
const autorizarRol = require('../middlewares/roles.middleware');

// ==========================================
// POST /api/cotizaciones
// Crear cotización - Solo administrador
// ==========================================

router.post(
  '/',
  verificarToken,
  autorizarRol('administrador'),
  async (req, res) => {

    const {
      id_solicitud,
      mensaje_cliente,
      archivo_pdf
    } = req.body;

    // ==================================
    // VALIDAR DATOS
    // ==================================

    if (
      !Number.isSafeInteger(id_solicitud) ||
      id_solicitud <= 0 ||
      typeof mensaje_cliente !== 'string' ||
      !mensaje_cliente.trim()
    ) {
      return res.status(400).json({
        message: 'Debes indicar una solicitud válida y un mensaje.'
      });
    }

    if (
      archivo_pdf != null &&
      (
        typeof archivo_pdf !== 'string' ||
        archivo_pdf.length > 255
      )
    ) {
      return res.status(400).json({
        message: 'La ruta del archivo PDF no es válida.'
      });
    }

    let clienteDB;

    try {

      clienteDB = await pool.connect();

      await clienteDB.query('BEGIN');

      // ==================================
      // COMPROBAR QUE EXISTA LA SOLICITUD
      // ==================================

      // FOR UPDATE evita que dos cotizaciones
      // obtengan la misma versión simultáneamente.
      const solicitud = await clienteDB.query(`
        SELECT id_solicitud
        FROM solicitudes
        WHERE id_solicitud = $1
        FOR UPDATE
      `, [id_solicitud]);

      if (solicitud.rows.length === 0) {

        await clienteDB.query('ROLLBACK');

        return res.status(404).json({
          message: 'La solicitud no existe.'
        });
      }

      // ==================================
      // CALCULAR LA SIGUIENTE VERSIÓN
      // ==================================

      const versiones = await clienteDB.query(`
        SELECT COALESCE(MAX(version), 0) + 1
          AS siguiente_version
        FROM cotizacion
        WHERE id_solicitud = $1
      `, [id_solicitud]);

      const nuevaVersion =
        versiones.rows[0].siguiente_version;

      // ==================================
      // GUARDAR LA COTIZACIÓN
      // ==================================

      const resultado = await clienteDB.query(`
        INSERT INTO cotizacion (
          id_solicitud,
          version,
          mensaje_cliente,
          archivo_pdf
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id_cotizacion,
          id_solicitud,
          version,
          mensaje_cliente,
          archivo_pdf,
          fecha_envio
      `, [
        id_solicitud,
        nuevaVersion,
        mensaje_cliente.trim(),
        archivo_pdf || null
      ]);

      await clienteDB.query('COMMIT');

      return res.status(201).json({
        message: 'Cotización registrada correctamente.',
        cotizacion: resultado.rows[0]
      });

    } catch (error) {

      if (clienteDB) {
        try {
          await clienteDB.query('ROLLBACK');
        } catch (rollbackError) {
          console.error('Error al revertir la transacción:', rollbackError);
        }
      }

      console.error('Error al crear cotización:', error);

      return res.status(500).json({
        message: 'No fue posible registrar la cotización.'
      });

    } finally {

      if (clienteDB) {
        clienteDB.release();
      }

    }
  }
);


 // ==========================================
 // GET /api/cotizaciones/solicitud/:id
 // Consultar historial de cotizaciones
 // ==========================================

router.get(
  '/solicitud/:id',
  verificarToken,
  async (req, res) => {
    try {

      const id = Number(req.params.id);

      // ==================================
      // VALIDAR ID
      // ==================================

      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          message: 'El ID de la solicitud no es válido.'
        });
      }

      // ==================================
      // BUSCAR SOLICITUD Y PROPIETARIO
      // ==================================

      const resultadoSolicitud = await pool.query(`
        SELECT id_solicitud, id_user
        FROM solicitudes
        WHERE id_solicitud = $1
      `, [id]);

      if (resultadoSolicitud.rows.length === 0) {
        return res.status(404).json({
          message: 'Solicitud no encontrada.'
        });
      }

      const solicitud = resultadoSolicitud.rows[0];

      // ==================================
      // VERIFICAR PERMISOS
      // ==================================

      const esAdministrador =
        req.usuario.rol === 'administrador';

      const esPropietario =
        Number(solicitud.id_user) ===
        Number(req.usuario.id_usuario);

      if (!esAdministrador && !esPropietario) {
        return res.status(404).json({
          message: 'Solicitud no encontrada.'
        });
      }

      // ==================================
      // CONSULTAR VERSIONES
      // ==================================

      
    const resultado = await pool.query(`
    SELECT
        id_cotizacion,
        id_solicitud,
        version,
        mensaje_cliente,
        archivo_pdf,
        fecha_envio
    FROM cotizacion
    WHERE id_solicitud = $1
        AND ($2::boolean = TRUE OR fecha_envio IS NOT NULL)
    ORDER BY version DESC
    `, [id, esAdministrador]);


      return res.status(200).json({
        message: 'Cotizaciones obtenidas correctamente.',
        id_solicitud: id,
        total: resultado.rows.length,
        cotizaciones: resultado.rows
      });

    } catch (error) {

      console.error('Error al obtener cotizaciones:', error);

      return res.status(500).json({
        message: 'No fue posible obtener las cotizaciones.'
      });

    }
  }
);


 // ==========================================
 // PATCH /api/cotizaciones/:id/publicar
 // Publicar cotización - Solo administrador
 // ==========================================

router.patch(
  '/:id/publicar',
  verificarToken,
  autorizarRol('administrador'),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      // Validar ID
      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          message: 'El ID de la cotización no es válido.'
        });
      }

      // Publicar solo si aún es un borrador
      const resultado = await pool.query(`
        UPDATE cotizacion
        SET fecha_envio = CURRENT_DATE
        WHERE id_cotizacion = $1
          AND fecha_envio IS NULL
        RETURNING
          id_cotizacion,
          id_solicitud,
          version,
          mensaje_cliente,
          archivo_pdf,
          fecha_envio
      `, [id]);

      if (resultado.rows.length === 0) {

        // Comprobar si existe pero ya está publicada
        const existe = await pool.query(`
          SELECT id_cotizacion
          FROM cotizacion
          WHERE id_cotizacion = $1
        `, [id]);

        if (existe.rows.length === 0) {
          return res.status(404).json({
            message: 'Cotización no encontrada.'
          });
        }

        return res.status(409).json({
          message: 'Esta cotización ya está publicada.'
        });
      }

      return res.status(200).json({
        message: 'Cotización publicada correctamente.',
        cotizacion: resultado.rows[0]
      });

    } catch (error) {
      console.error('Error al publicar cotización:', error);

      return res.status(500).json({
        message: 'No fue posible publicar la cotización.'
      });
    }
  }
);


module.exports = router;
