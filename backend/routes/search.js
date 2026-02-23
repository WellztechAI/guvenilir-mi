'use strict';

const express = require('express');
const pool = require('../db');
const redisClient = require('../redis');

const router = express.Router();

// GET /api/search — global arama (şirket + yorum)
router.get('/', async (req, res) => {
    const { q, limit = 10 } = req.query;
    if (!q || q.trim().length < 1) {
        return res.json({ companies: [], comments: [] });
    }

    const searchTerm = `%${q.trim()}%`;
    const cacheKey = `search:global:${q.trim().toLowerCase()}:${limit}`;

    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) return res.json(JSON.parse(cachedData));
    } catch (err) { }

    try {
        const [companyResult, commentResult] = await Promise.all([
            pool.query(
                `SELECT id, name, slug, description, image_url, status, rating, comment_count, sectors, created_at
                 FROM companies WHERE name ILIKE $1 AND status = 'active'
                 ORDER BY rating DESC NULLS LAST LIMIT $2`,
                [searchTerm, parseInt(limit)]
            ),
            pool.query(
                `SELECT c.id, c.author_id, c.author_name, c.company_id, co.name AS company_name,
                        c.created_at, c.rating, c.status, c.message, c.likes_count
                 FROM comments c
                 JOIN companies co ON co.id = c.company_id
                 WHERE c.message ILIKE $1 AND c.status = 'approved'
                 ORDER BY c.created_at DESC LIMIT $2`,
                [searchTerm, parseInt(limit)]
            ),
        ]);

        const responseData = {
            companies: companyResult.rows.map(r => ({
                id: r.id, name: r.name, slug: r.slug, description: r.description || '',
                image_url: r.image_url, status: r.status,
                rating: r.rating ? parseFloat(r.rating) : null,
                comment_count: parseInt(r.comment_count) || 0,
                sectors: r.sectors || [], created_at: r.created_at,
            })),
            comments: commentResult.rows,
        };

        try { await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 300 }); } catch (e) { }

        return res.json(responseData);
    } catch (err) {
        console.error('[SEARCH] global hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// GET /api/search/companies — sadece şirket arama
router.get('/companies', async (req, res) => {
    const { q, sector, status, limit = 20, offset = 0 } = req.query;
    if (!q || q.trim().length < 1) {
        return res.json({ data: [], pagination: { total: 0, limit: parseInt(limit), offset: parseInt(offset), page: 1, totalPages: 0 } });
    }

    const cacheKey = `search:companies:${q.trim().toLowerCase()}:${sector || 'all'}:${status || 'all'}:${limit}:${offset}`;
    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) return res.json(JSON.parse(cachedData));
    } catch (err) { }

    const searchTerm = `%${q.trim()}%`;
    const params = [searchTerm];
    const where = [`name ILIKE $1`];

    if (status) { params.push(status); where.push(`status = $${params.length}`); }
    if (sector) { params.push(sector); where.push(`$${params.length} = ANY(sectors)`); }

    const whereClause = `WHERE ${where.join(' AND ')}`;

    try {
        const countResult = await pool.query(`SELECT COUNT(*) FROM companies ${whereClause}`, params);
        const total = parseInt(countResult.rows[0].count);

        params.push(parseInt(limit), parseInt(offset));
        const result = await pool.query(
            `SELECT * FROM companies ${whereClause} ORDER BY rating DESC NULLS LAST, comment_count DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
            params
        );

        const responseData = {
            data: result.rows.map(r => ({
                id: r.id, name: r.name, slug: r.slug, description: r.description || '',
                image_url: r.image_url, status: r.status,
                rating: r.rating ? parseFloat(r.rating) : null,
                comment_count: parseInt(r.comment_count) || 0,
                sectors: r.sectors || [], created_at: r.created_at,
            })),
            pagination: { total, limit: parseInt(limit), offset: parseInt(offset), page: Math.floor(offset / limit) + 1, totalPages: Math.ceil(total / limit) },
        };

        try { await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 300 }); } catch (e) { }

        return res.json(responseData);
    } catch (err) {
        console.error('[SEARCH] companies hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// GET /api/search/suggest — autocomplete
router.get('/suggest', async (req, res) => {
    const { q } = req.query;
    if (!q || q.trim().length < 1) return res.json({ suggestions: [] });

    const cacheKey = `search:suggest:${q.trim().toLowerCase()}`;
    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) return res.json(JSON.parse(cachedData));
    } catch (err) { }

    try {
        const result = await pool.query(
            `SELECT id, name, slug, rating FROM companies
             WHERE name ILIKE $1 AND status = 'active'
             ORDER BY rating DESC NULLS LAST, comment_count DESC LIMIT 8`,
            [`%${q.trim()}%`]
        );

        const responseData = {
            suggestions: result.rows.map(r => ({
                id: r.id, name: r.name, slug: r.slug,
                rating: r.rating ? parseFloat(r.rating) : null,
            })),
        };

        try { await redisClient.set(cacheKey, JSON.stringify(responseData), { EX: 600 }); } catch (e) { }

        return res.json(responseData);
    } catch (err) {
        console.error('[SEARCH] suggest hatası:', err.message);
        return res.status(500).json({ suggestions: [] });
    }
});

module.exports = router;
