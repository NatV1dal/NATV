
const path = require('path');
const jwt = require('jsonwebtoken');

// Cargar las variables de entorno del backend
require('dotenv').config({
  path: path.join(__dirname, '../.env'),
  quiet: true
});

const request = require('supertest');
const app = require('../app');
const pool = require('../config/db');

// Cerrar la conexión al terminar las pruebas
afterAll(async () => {
  await pool.end();
});

describe('API REST NATV.CL', () => {

  // ==========================================
  // PRUEBA 1: ESTADO DEL SERVIDOR
  // ==========================================

  test('GET /api/health devuelve 200', async () => {
    const respuesta = await request(app)
      .get('/api/health');

    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.body).toHaveProperty('message');
  });

  // ==========================================
  // PRUEBA 2: LISTAR CATEGORÍAS
  // ==========================================

  test('GET /api/categorias devuelve 200', async () => {
    const respuesta = await request(app)
      .get('/api/categorias');

    expect(respuesta.statusCode).toBe(200);
    expect(Array.isArray(respuesta.body)).toBe(true);
  });

  // ==========================================
  // PRUEBA 3: LISTAR SERVICIOS
  // ==========================================

  test('GET /api/servicios devuelve 200', async () => {
    const respuesta = await request(app)
      .get('/api/servicios');

    expect(respuesta.statusCode).toBe(200);
    expect(Array.isArray(respuesta.body)).toBe(true);
  });

  // ==========================================
  // PRUEBA 4: ID DE SERVICIO INVÁLIDO
  // ==========================================

  test('GET /api/servicios/abc devuelve 400', async () => {
    const respuesta = await request(app)
      .get('/api/servicios/abc');

    expect(respuesta.statusCode).toBe(400);
  });

  // ==========================================
  // PRUEBA 5: PERFIL SIN TOKEN
  // ==========================================

  test('GET /api/auth/me sin token devuelve 401', async () => {
    const respuesta = await request(app)
      .get('/api/auth/me');

    expect(respuesta.statusCode).toBe(401);
  });

  // ==========================================
  // PRUEBA 6: CREAR SERVICIO SIN TOKEN
  // ==========================================

  test('POST /api/servicios sin token devuelve 401', async () => {
    const respuesta = await request(app)
      .post('/api/servicios')
      .send({
        nombre: 'Servicio de prueba'
      });

    expect(respuesta.statusCode).toBe(401);
  });

  // ==========================================
  // PRUEBA 7: SOLICITUDES SIN TOKEN
  // ==========================================

  test('GET /api/solicitudes sin token devuelve 401', async () => {
    const respuesta = await request(app)
      .get('/api/solicitudes');

    expect(respuesta.statusCode).toBe(401);
  });

  // ==========================================
  // PRUEBA 8: CLIENTE NO PUEDE VER TODOS LOS PEDIDOS
  // ==========================================

  test('GET /api/solicitudes con cliente devuelve 403', async () => {

    const tokenCliente = jwt.sign(
      {
        id_usuario: 999999,
        id_rol: 1,
        rol: 'cliente'
      },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );

    const respuesta = await request(app)
      .get('/api/solicitudes')
      .set('Authorization', `Bearer ${tokenCliente}`);

    expect(respuesta.statusCode).toBe(403);
  });

  // ==========================================
  // PRUEBA 9: CLIENTE NO PUEDE CREAR COTIZACIONES
  // ==========================================

  test('POST /api/cotizaciones con cliente devuelve 403', async () => {

    const tokenCliente = jwt.sign(
      {
        id_usuario: 999999,
        id_rol: 1,
        rol: 'cliente'
      },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    );

    const respuesta = await request(app)
      .post('/api/cotizaciones')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({
        id_solicitud: 1,
        mensaje_cliente: 'Prueba de seguridad'
      });

    expect(respuesta.statusCode).toBe(403);
  });

  // ==========================================
  // PRUEBA 10: TOKEN INVÁLIDO
  // ==========================================

  test('GET /api/auth/me con token inválido devuelve 401', async () => {

    const respuesta = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer token-invalido');

    expect(respuesta.statusCode).toBe(401);
  });

});
