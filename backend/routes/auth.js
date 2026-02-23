'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { userName, email, password, phoneNumber, country } = req.body;

    if (!userName || !email || !password) {
        return res.status(400).json({ success: false, message: 'userName, email ve password zorunludur.' });
    }

    try {
        // Email daha önce kayıtlı mı?
        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ success: false, message: 'Bu email adresi zaten kayıtlı.' });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const result = await pool.query(
            `INSERT INTO users (user_name, email, password_hash, phone_number, country)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, user_name, email, phone_number, country, image_url, status, created_at`,
            [userName, email.toLowerCase(), passwordHash, phoneNumber || null, country || 'Turkiye']
        );

        const user = result.rows[0];
        return res.status(201).json({
            success: true,
            message: 'Kayıt başarılı.',
            user: {
                id: user.id,
                userName: user.user_name,
                email: user.email,
                phoneNumber: user.phone_number,
                country: user.country,
                imageUrl: user.image_url,
                status: user.status,
                createdAt: user.created_at,
                favouriteCompanies: [],
            },
        });
    } catch (err) {
        console.error('[AUTH] Register hatası:', err.message);
        return res.status(500).json({ success: false, message: 'Sunucu hatası.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'email ve password zorunludur.' });
    }

    try {
        const result = await pool.query(
            `SELECT id, user_name, email, password_hash, phone_number, country, image_url, status, created_at
             FROM users WHERE email = $1`,
            [email.toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Email veya şifre hatalı.' });
        }

        const user = result.rows[0];

        if (!user.password_hash) {
            return res.status(401).json({ success: false, message: 'Bu hesap sosyal giriş ile oluşturulmuş. Lütfen Google ile giriş yapın.' });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Email veya şifre hatalı.' });
        }

        // Favori şirketleri de çek
        const favs = await pool.query(
            `SELECT c.id, c.name, c.slug, c.image_url
             FROM favourite_companies fc
             JOIN companies c ON c.id = fc.company_id
             WHERE fc.user_id = $1`,
            [user.id]
        );

        return res.json({
            success: true,
            message: 'Giriş başarılı.',
            user: {
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
            },
        });
    } catch (err) {
        console.error('[AUTH] Login hatası:', err.message);
        return res.status(500).json({ success: false, message: 'Sunucu hatası.' });
    }
});

// POST /api/auth/check-email
router.post('/check-email', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ exists: false });

    try {
        const result = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
        return res.json({ exists: result.rows.length > 0 });
    } catch (err) {
        console.error('[AUTH] Check-email hatası:', err.message);
        return res.status(500).json({ exists: false });
    }
});

// POST /api/auth/change-password
router.post('/change-password', async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    if (!userId || !currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Tüm alanlar zorunludur.' });
    }

    try {
        const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        }

        const isValid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Mevcut şifre hatalı.' });
        }

        const newHash = await bcrypt.hash(newPassword, 12);
        await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, userId]);

        return res.json({ success: true, message: 'Şifre güncellendi.' });
    } catch (err) {
        console.error('[AUTH] Change-password hatası:', err.message);
        return res.status(500).json({ success: false, message: 'Sunucu hatası.' });
    }
});

module.exports = router;
