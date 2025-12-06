
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'clinic_management',
  user: process.env.DB_USER || 'clinic_admin',
  password: process.env.DB_PASSWORD || 'clinic_secure_password_123',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('🔴 Unexpected error on idle client:', err);
  process.exit(-1);
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL Successfully');
});

module.exports = pool;
