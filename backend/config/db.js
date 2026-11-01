
require('dotenv').config();

const { Pool } = require('pg');

// Conexión con PostgreSQL
const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD || undefined
});

module.exports = pool;
