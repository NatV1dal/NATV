
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const autorizarRol = require('../middlewares/roles.middleware');

// ==========================================
// POST /api/auth/register
// Registrar un nuevo cliente
// ==========================================

router.post('/register', async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      password,
      telefono,
      fecha_nacimiento
    } = req.body;

    // Validar campos obligatorios
    if (
      typeof nombre !== 'string' ||
      !nombre.trim() ||
      typeof apellido !== 'string' ||
      !apellido.trim() ||
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: 'Ingresa nombre, apellido, correo y una contraseña de al menos 8 caracteres.'
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    // Validación básica del correo
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
      return res.status(400).json({
        message: 'El correo electrónico no es válido.'
      });
    }

    // Comprobar si el correo ya existe
    const usuarioExistente = await pool.query(
      'SELECT id_user FROM usuarios WHERE LOWER(email) = $1',
      [emailNormalizado]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        message: 'Este correo ya está registrado.'
      });
    }

    // Cifrar mediante hash la contraseña
    const passwordHash = await bcrypt.hash(password, 12);

    // Registrar al usuario como cliente
    // El rol nunca se recibe desde el frontend
    const resultado = await pool.query(`
      INSERT INTO usuarios (
        id_rol,
        nom_user,
        app_user,
        email,
        password,
        telefono,
        fecha_nacimiento
      )
      VALUES (
        (SELECT id_rol FROM roles WHERE nom_rol = 'cliente'),
        $1, $2, $3, $4, $5, $6
      )
      RETURNING
        id_user AS id_usuario,
        id_rol,
        nom_user AS nombre,
        app_user AS apellido,
        email,
        telefono,
        fecha_nacimiento
    `, [
      nombre.trim(),
      apellido.trim(),
      emailNormalizado,
      passwordHash,
      telefono || null,
      fecha_nacimiento || null
    ]);

    return res.status(201).json({
      message: 'Usuario registrado correctamente.',
      user: resultado.rows[0]
    });

  } catch (error) {
    // Evitar registros duplicados
    if (error.code === '23505') {
      return res.status(409).json({
        message: 'Este correo ya está registrado.'
      });
    }

    console.error('Error al registrar usuario:', error);

    return res.status(500).json({
      message: 'No fue posible registrar al usuario.'
    });
  }
});

 // ==========================================
 // POST /api/auth/login
 // Iniciar sesión en NATV
 // ==========================================

router.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;

    // ==================================
    // VALIDAR CREDENCIALES
    // ==================================

    if (
      typeof email !== 'string' ||
      !email.trim() ||
      typeof password !== 'string' ||
      !password
    ) {
      return res.status(400).json({
        message: 'Debes ingresar correo y contraseña.'
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    // ==================================
    // BUSCAR USUARIO EN POSTGRESQL
    // ==================================

    const resultado = await pool.query(`
      SELECT
        u.id_user,
        u.id_rol,
        u.nom_user,
        u.app_user,
        u.email,
        u.password,
        r.nom_rol
      FROM usuarios u
      INNER JOIN roles r
        ON u.id_rol = r.id_rol
      WHERE LOWER(u.email) = $1
    `, [emailNormalizado]);

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        message: 'Correo o contraseña incorrectos.'
      });
    }

    const usuario = resultado.rows[0];

    // ==================================
    // VERIFICAR CONTRASEÑA
    // ==================================

    const passwordValida = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordValida) {
      return res.status(401).json({
        message: 'Correo o contraseña incorrectos.'
      });
    }

    // ==================================
    // GENERAR TOKEN JWT
    // ==================================

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está configurado');
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_user,
        id_rol: usuario.id_rol,
        rol: usuario.nom_rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h',
        algorithm: 'HS256'
      }
    );

    // ==================================
    // RESPUESTA DEL LOGIN
    // ==================================

    return res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        id_usuario: usuario.id_user,
        nombre: usuario.nom_user,
        apellido: usuario.app_user,
        email: usuario.email,
        id_rol: usuario.id_rol,
        rol: usuario.nom_rol
      }
    });

  } catch (error) {

    console.error('Error al iniciar sesión:', error.message);

    return res.status(500).json({
      message: 'No fue posible iniciar sesión.'
    });

  }
});


// ==========================================
// GET /api/auth/me
// Obtener datos del usuario autenticado
// ==========================================

router.get('/me', verificarToken, async (req, res) => {
  try {

    const resultado = await pool.query(`
      SELECT
        u.id_user AS id_usuario,
        u.nom_user AS nombre,
        u.app_user AS apellido,
        u.email,
        r.nom_rol AS rol
      FROM usuarios u
      INNER JOIN roles r
        ON u.id_rol = r.id_rol
      WHERE u.id_user = $1
    `, [req.usuario.id_usuario]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        message: 'Usuario no encontrado.'
      });
    }

    return res.status(200).json({
      user: resultado.rows[0]
    });

  } catch (error) {

    console.error('Error al consultar perfil:', error);

    return res.status(500).json({
      message: 'Error al obtener el perfil.'
    });

  }
});


// ==========================================
// GET /api/auth/admin-check
// Comprobar permisos de administrador
// ==========================================

router.get(
  '/admin-check',
  verificarToken,
  autorizarRol('administrador'),
  (req, res) => {

    return res.status(200).json({
      message: 'Acceso de administrador autorizado.'
    });

  }
);


module.exports = router;
