'use strict';

const express = require('express');
const pool = require('../db');

const router = express.Router();

// ============================================
// Helper: user satırını frontend tipine dönüştür
// ============================================
async function buildUserResponse(user) {
    const favs = await pool.query(
        `SELECT c.id, c.name, c.slug, c.image_url
         FROM favourite_companies fc
         JOIN companies c ON c.id = fc.company_id
         WHERE fc.user_id = $1`,
        [user.id]
    );

    return {
        id: user.id,
        userName: user.user_name,
        email: user.email,
        phoneNumber: user.phone_number,
        country: user.country,
        imageUrl: user.image_url,
        status: user.status,
        createdAt: user.created_at,
        favouriteCompanies: favs.rows.map(r => ({
            id: r.id, name: r.name, slug: r.slug, image_url: r.image_url,
        })),
    };
}

// GET /api/users — tüm kullanıcılar (admin)
router.get('/', async (req, res) => {
    const { status, limit = 50, offset = 0 } = req.query;

    try {
        let query = 'SELECT id, user_name, email, phone_number, country, image_url, status, created_at FROM users';
        const params = [];

        if (status) {
            params.push(status);
            query += ` WHERE status = $${params.length}`;
        }

        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));

        const countQuery = status
            ? 'SELECT COUNT(*) FROM users WHERE status = $1'
            : 'SELECT COUNT(*) FROM users';
        const countParams = status ? [status] : [];

        const [result, countResult] = await Promise.all([
            pool.query(query, params),
            pool.query(countQuery, countParams),
        ]);

        const total = parseInt(countResult.rows[0].count);
        return res.json({
            data: result.rows.map(u => ({
                id: u.id, userName: u.user_name, email: u.email,
                phoneNumber: u.phone_number, country: u.country,
                imageUrl: u.image_url, status: u.status, createdAt: u.created_at,
                favouriteCompanies: [],
            })),
            pagination: { total, limit: parseInt(limit), offset: parseInt(offset), page: Math.floor(offset / limit) + 1, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('[USERS] fetchAll hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// GET /api/users/:userId
router.get('/:userId', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, user_name, email, phone_number, country, image_url, status, created_at FROM users WHERE id = $1',
            [req.params.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }

        const userData = await buildUserResponse(result.rows[0]);
        return res.json({ data: userData });
    } catch (err) {
        console.error('[USERS] fetchById hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// PUT /api/users/:userId
router.put('/:userId', async (req, res) => {
    const { userName, phoneNumber, country, imageUrl, status } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users SET
                user_name    = COALESCE($1, user_name),
                phone_number = COALESCE($2, phone_number),
                country      = COALESCE($3, country),
                image_url    = COALESCE($4, image_url),
                status       = COALESCE($5, status),
                updated_at   = NOW()
             WHERE id = $6
             RETURNING id`,
            [userName, phoneNumber, country, imageUrl, status, req.params.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }

        return res.json({ success: true });
    } catch (err) {
        console.error('[USERS] update hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// GET /api/users/:userId/notifications
router.get('/:userId/notifications', async (req, res) => {
    const { unreadOnly, limit = 50, offset = 0 } = req.query;

    try {
        let query = 'SELECT * FROM notifications WHERE user_id = $1';
        const params = [req.params.userId];

        if (unreadOnly === 'true') {
            query += ' AND is_read = FALSE';
        }

        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM notifications WHERE user_id = $1${unreadOnly === 'true' ? ' AND is_read = FALSE' : ''}`,
            [req.params.userId]
        );

        const result = await pool.query(query, params);
        const total = parseInt(countResult.rows[0].count);

        return res.json({
            data: result.rows,
            pagination: { total, limit: parseInt(limit), offset: parseInt(offset), page: Math.floor(offset / limit) + 1, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('[USERS] notifications hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// PATCH /api/users/:userId/notifications/read
router.patch('/:userId/notifications/read', async (req, res) => {
    const { notificationIds } = req.body;

    try {
        if (notificationIds && notificationIds.length > 0) {
            await pool.query(
                'UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND id = ANY($2::uuid[])',
                [req.params.userId, notificationIds]
            );
        } else {
            await pool.query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1', [req.params.userId]);
        }
        return res.json({ success: true });
    } catch (err) {
        console.error('[USERS] notifications/read hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// GET /api/users/:userId/rewards
router.get('/:userId/rewards', async (req, res) => {
    const { unusedOnly, limit = 50, offset = 0 } = req.query;

    try {
        let query = 'SELECT * FROM rewards WHERE user_id = $1';
        const params = [req.params.userId];

        if (unusedOnly === 'true') query += ' AND is_used = FALSE';
        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM rewards WHERE user_id = $1${unusedOnly === 'true' ? ' AND is_used = FALSE' : ''}`,
            [req.params.userId]
        );

        const result = await pool.query(query, params);
        const total = parseInt(countResult.rows[0].count);

        return res.json({
            data: result.rows,
            pagination: { total, limit: parseInt(limit), offset: parseInt(offset), page: Math.floor(offset / limit) + 1, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('[USERS] rewards hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// POST /api/users/:userId/favourites
router.post('/:userId/favourites', async (req, res) => {
    const { companyId } = req.body;
    if (!companyId) return res.status(400).json({ error: 'companyId zorunludur.' });

    try {
        await pool.query(
            'INSERT INTO favourite_companies (user_id, company_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [req.params.userId, companyId]
        );
        return res.json({ success: true });
    } catch (err) {
        console.error('[USERS] favourite add hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// DELETE /api/users/:userId/favourites/:companyId
router.delete('/:userId/favourites/:companyId', async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM favourite_companies WHERE user_id = $1 AND company_id = $2',
            [req.params.userId, req.params.companyId]
        );
        return res.json({ success: true });
    } catch (err) {
        console.error('[USERS] favourite remove hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

module.exports = router;
