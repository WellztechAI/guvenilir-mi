'use strict';

const { Pool } = require('pg');

// ============================================
// PostgreSQL Connection Pool
// ============================================
const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    // SSL — AWS RDS'de zorunlu
    ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
    // Connection pool config
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// Startup bağlantı testi
pool.connect((err, client, release) => {
    if (err) {
        console.error('[DB] Bağlantı hatası:', err.message);
        console.error('[DB] DB_HOST:', process.env.DB_HOST);
        return;
    }
    release();
    console.log(`[DB] PostgreSQL bağlantısı başarılı → ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});

pool.on('error', (err) => {
    console.error('[DB] Pool beklenmedik hata:', err.message);
});

module.exports = pool;
