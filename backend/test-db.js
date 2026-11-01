
const pool = require('./config/db');

async function probarConexion() {
  try {
    const resultado = await pool.query(`
      SELECT
        current_database() AS base_datos,
        current_user AS usuario
    `);

    console.log('✅ Conexión exitosa a PostgreSQL');
    console.log(resultado.rows[0]);

  } catch (error) {
    console.error(
      '❌ Error al conectar:',
      error.message
    );
    process.exitCode = 1;

  } finally {
    await pool.end();
  }
}

probarConexion();
