'use strict';

const express = require('express');
const pool = require('../db');
const redisClient = require('../redis');

const router = express.Router();

// ============================================
// Cache Helper
// ============================================
async function clearCompanyCaches(id, slug) {
    try {
        if (id) await redisClient.del(`company:id:${id}`);
        if (slug) await redisClient.del(`company:slug:${slug}`);
        const keys = await redisClient.keys('companies:*');
        if (keys.length > 0) await redisClient.del(keys);
    } catch (err) {
        console.error('[REDIS] Cache clear hatası:', err.message);
    }
}

// ============================================
// Helper
// ============================================
function buildCompanyResponse(row) {
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description || '',
        phone: row.phone || '',
        image_url: row.image_url,
        status: row.status,
        rating: row.rating ? parseFloat(row.rating) : null,
        comment_count: parseInt(row.comment_count) || 0,
        sectors: row.sectors || [],
        created_at: row.created_at,
    };
}

// GET /api/companies — tüm şirketler
router.get('/', async (req, res) => {
    const { status, sector, sort = 'created_at', order = 'DESC', limit = 20, offset = 0 } = req.query;

    // Redis Cache Kontrolü
    const cacheKey = `companies:list:${status || 'all'}:${sector || 'all'}:${sort}:${order}:${limit}:${offset}`;
    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) return res.json(JSON.parse(cachedData));
    } catch (err) {
        console.warn('[REDIS] Cache okuma hatası:', err.message);
    }

    const allowedSort = ['created_at', 'rating', 'comment_count', 'name'];
    const safeSort = allowedSort.includes(sort) ? sort : 'created_at';
    const safeOrder = order === 'ASC' ? 'ASC' : 'DESC';

    try {
        const params = [];
        let where = [];

        if (status) { params.push(status); where.push(`status = $${params.length}`); }
        if (sector) { params.push(sector); where.push(`$${params.length} = ANY(sectors)`); }

        const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

        const countResult = await pool.query(`SELECT COUNT(*) FROM companies ${whereClause}`, params);
        const total = parseInt(countResult.rows[0].count);

        params.push(parseInt(limit), parseInt(offset));
        const result = await pool.query(
            `SELECT * FROM companies ${whereClause} ORDER BY ${safeSort} ${safeOrder} LIMIT $${params.length - 1} OFFSET $${params.length}`,
            params
        );

        const responseData = {
            data: result.rows.map(buildCompanyResponse),
            pagination: { total, limit: parseInt(limit), offset: parseInt(offset), page: Math.floor(offset / limit) + 1, totalPages: Math.ceil(total / limit) },
        };

        // Cache'e yaz (300 saniye / 5 dk)
        try {
            await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 300 });
        } catch (err) {
            console.warn('[REDIS] Cache yazma hatası:', err.message);
        }

        return res.json(responseData);
    } catch (err) {
        console.error('[COMPANIES] fetchAll hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// GET /api/companies/id/:id — ID ile şirket
router.get('/id/:id', async (req, res) => {
    const cacheKey = `company:id:${req.params.id}`;
    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) return res.json(JSON.parse(cachedData));
    } catch (err) { }

    try {
        const result = await pool.query('SELECT * FROM companies WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Şirket bulunamadı.' });

        const responseData = { data: buildCompanyResponse(result.rows[0]) };
        try { await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 3600 }); } catch (e) { }

        return res.json(responseData);
    } catch (err) {
        console.error('[COMPANIES] fetchById hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// GET /api/companies/:slug — slug ile şirket
router.get('/:slug', async (req, res) => {
    const cacheKey = `company:slug:${req.params.slug}`;
    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) return res.json(JSON.parse(cachedData));
    } catch (err) { }

    try {
        const result = await pool.query('SELECT * FROM companies WHERE slug = $1', [req.params.slug]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Şirket bulunamadı.' });

        const responseData = { data: buildCompanyResponse(result.rows[0]) };
        try { await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 3600 }); } catch (e) { }

        return res.json(responseData);
    } catch (err) {
        console.error('[COMPANIES] fetchBySlug hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// POST /api/companies — yeni şirket oluştur
router.post('/', async (req, res) => {
    const { name, slug, description, phone, sectors } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'name ve slug zorunludur.' });

    try {
        const result = await pool.query(
            `INSERT INTO companies (name, slug, description, phone, sectors)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [name, slug, description || null, phone || null, sectors || []]
        );

        // Cache temizle
        await clearCompanyCaches(result.rows[0].id, slug);

        return res.status(201).json(buildCompanyResponse(result.rows[0]));
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ error: 'Bu slug zaten kullanımda.' });
        console.error('[COMPANIES] create hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// PUT /api/companies/:id — şirket güncelle
router.put('/:id', async (req, res) => {
    const { name, description, phone, imageUrl, status, rating, sectors } = req.body;

    try {
        const result = await pool.query(
            `UPDATE companies SET
                name          = COALESCE($1, name),
                description   = COALESCE($2, description),
                phone         = COALESCE($3, phone),
                image_url     = COALESCE($4, image_url),
                status        = COALESCE($5, status),
                rating        = COALESCE($6, rating),
                sectors       = COALESCE($7, sectors),
                updated_at    = NOW()
             WHERE id = $8 RETURNING id`,
            [name, description, phone, imageUrl, status, rating, sectors, req.params.id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Şirket bulunamadı.' });

        // Cache temizle (slug yok ama id ve list keyleri silinir)
        await clearCompanyCaches(req.params.id, null);

        return res.json({ success: true });
    } catch (err) {
        console.error('[COMPANIES] update hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// GET /api/companies/:companyId/comments
router.get('/:companyId/comments', async (req, res) => {
    const { status, limit = 20, offset = 0 } = req.query;

    try {
        const params = [req.params.companyId];
        let where = `WHERE company_id = $1`;
        if (status) { params.push(status); where += ` AND status = $${params.length}`; }

        const countResult = await pool.query(`SELECT COUNT(*) FROM comments ${where}`, params);
        const total = parseInt(countResult.rows[0].count);

        params.push(parseInt(limit), parseInt(offset));
        const result = await pool.query(
            `SELECT * FROM comments ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
            params
        );

        return res.json({
            data: result.rows,
            pagination: { total, limit: parseInt(limit), offset: parseInt(offset), page: Math.floor(offset / limit) + 1, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('[COMPANIES] comments hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// GET /api/companies/:companyId/verifications
router.get('/:companyId/verifications', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM verifications WHERE company_id = $1 ORDER BY created_at DESC',
            [req.params.companyId]
        );
        return res.json(result.rows);
    } catch (err) {
        console.error('[COMPANIES] verifications hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

module.exports = router;
