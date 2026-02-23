'use strict';

const express = require('express');
const pool = require('../db');

const router = express.Router();

// POST /api/comments — yeni yorum
router.post('/', async (req, res) => {
    const { authorId, authorName, authorAvatar, companyId, companyName, rating, message, productName, contactMethod } = req.body;
    if (!authorId || !companyId || !rating || !message) {
        return res.status(400).json({ error: 'authorId, companyId, rating ve message zorunludur.' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO comments (author_id, author_name, author_avatar, company_id, company_name, rating, message, product_name, contact_method)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [authorId, authorName, authorAvatar || null, companyId, companyName, rating, message, productName || null, contactMethod || null]
        );

        // Şirketin comment_count'unu ve rating'ini güncelle
        await pool.query(
            `UPDATE companies SET
                comment_count = (SELECT COUNT(*) FROM comments WHERE company_id = $1 AND status = 'approved'),
                rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM comments WHERE company_id = $1 AND status = 'approved'),
                updated_at = NOW()
             WHERE id = $1`,
            [companyId]
        );

        return res.status(201).json({ data: result.rows[0] });
    } catch (err) {
        console.error('[COMMENTS] create hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// GET /api/comments — tüm yorumlar (admin)
router.get('/', async (req, res) => {
    const { status, companyId, authorId, limit = 20, offset = 0 } = req.query;

    try {
        const params = [];
        const where = [];
        if (status) { params.push(status); where.push(`status = $${params.length}`); }
        if (companyId) { params.push(companyId); where.push(`company_id = $${params.length}`); }
        if (authorId) { params.push(authorId); where.push(`author_id = $${params.length}`); }

        const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
        const countResult = await pool.query(`SELECT COUNT(*) FROM comments ${whereClause}`, params);
        const total = parseInt(countResult.rows[0].count);

        params.push(parseInt(limit), parseInt(offset));
        const result = await pool.query(
            `SELECT * FROM comments ${whereClause} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
            params
        );

        return res.json({
            data: result.rows,
            pagination: { total, limit: parseInt(limit), offset: parseInt(offset), page: Math.floor(offset / limit) + 1, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('[COMMENTS] fetchAll hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// GET /api/comments/:id
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM comments WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Yorum bulunamadı.' });
        return res.json({ data: result.rows[0] });
    } catch (err) {
        console.error('[COMMENTS] fetchById hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// PUT /api/comments/:id — güncelle (admin yanıt, status)
router.put('/:id', async (req, res) => {
    const { status, answer } = req.body;

    try {
        const result = await pool.query(
            `UPDATE comments SET
                status      = COALESCE($1, status),
                answer      = COALESCE($2, answer),
                answer_date = CASE WHEN $2 IS NOT NULL THEN NOW() ELSE answer_date END,
                updated_at  = NOW()
             WHERE id = $3 RETURNING id, company_id, status`,
            [status, answer, req.params.id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Yorum bulunamadı.' });

        // Rating/count güncelle
        const { company_id } = result.rows[0];
        await pool.query(
            `UPDATE companies SET
                comment_count = (SELECT COUNT(*) FROM comments WHERE company_id = $1 AND status = 'approved'),
                rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM comments WHERE company_id = $1 AND status = 'approved'),
                updated_at = NOW()
             WHERE id = $1`,
            [company_id]
        );

        return res.json({ success: true });
    } catch (err) {
        console.error('[COMMENTS] update hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// POST /api/comments/:id/like — beğen
router.post('/:id/like', async (req, res) => {
    try {
        await pool.query('UPDATE comments SET likes_count = likes_count + 1 WHERE id = $1', [req.params.id]);
        return res.json({ success: true });
    } catch (err) {
        console.error('[COMMENTS] like hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

module.exports = router;
