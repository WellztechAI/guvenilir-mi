'use strict';

const redis = require('redis');

// Redis URL (Local, Upstash veya AWS ElastiCache olabilir)
// Varsayılan: redis://localhost:6379
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = redis.createClient({
    url: redisUrl,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error('[REDIS] Çok fazla deneme yapıldı, yeniden bağlanma iptal ediliyor.');
                return new Error('Retry attempts exhausted');
            }
            return Math.min(retries * 50, 2000);
        }
    }
});

redisClient.on('error', (err) => {
    console.error('[REDIS ERROR]', err.message);
});

redisClient.on('connect', () => {
    console.log(`[REDIS] Bağlanılıyor: ${redisUrl}`);
});

redisClient.on('ready', () => {
    console.log('[REDIS] ✅ Bağlantı hazır ve kullanılabilir durumda.');
});

// Otomatik bağlan
(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('[REDIS] Başlangıç bağlantı hatası:', err.message);
    }
})();

module.exports = redisClient;
