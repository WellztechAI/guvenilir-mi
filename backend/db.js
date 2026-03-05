'use strict';

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// ============================================
// SSL Sertifikası (AWS RDS global-bundle)
// ============================================
let sslConfig;
const certPath = process.env.DB_SSL_CERT
    ? path.resolve(__dirname, process.env.DB_SSL_CERT)
    : path.resolve(__dirname, 'certs/global-bundle.pem');

if (fs.existsSync(certPath)) {
    sslConfig = {
        rejectUnauthorized: true,
        ca: fs.readFileSync(certPath).toString(),
    };
    console.log('[DB] SSL sertifikası yüklendi:', certPath);
} else {
    // Sertifika yoksa basit SSL (geliştirme ortamı)
    console.warn('[DB] SSL sertifikası bulunamadı, rejectUnauthorized=false kullanılıyor.');
    sslConfig = { rejectUnauthorized: false };
}

// ============================================
// PostgreSQL Connection Pool
// ============================================
const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: sslConfig,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

// Startup bağlantı testi
pool.connect((err, client, release) => {
    if (err) {
        console.error('[DB] ❌ Bağlantı hatası:', err.message);
        console.error('[DB]    Host:', process.env.DB_HOST);
        console.error('[DB]    DB  :', process.env.DB_NAME);
        console.error('[DB]    User:', process.env.DB_USER);
        return;
    }
    release();
    console.log(`[DB] ✅ PostgreSQL bağlandı → ${process.env.DB_HOST}/${process.env.DB_NAME}`);
});

pool.on('error', (err) => {
    console.error('[DB] Pool hatası:', err.message);
});

module.exports = pool;
