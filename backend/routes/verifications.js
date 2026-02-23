'use strict';

const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /api/verifications — tüm doğrulama talepleri (admin)
router.get('/', async (req, res) => {
    const { status, limit = 20, offset = 0 } = req.query;

    try {
        const params = [];
        let where = '';
        if (status) { params.push(status); where = `WHERE status = $1`; }

        const countResult = await pool.query(`SELECT COUNT(*) FROM verifications ${where}`, params);
        const total = parseInt(countResult.rows[0].count);

        params.push(parseInt(limit), parseInt(offset));
        const result = await pool.query(
            `SELECT v.*, c.name AS company_name, c.slug AS company_slug
             FROM verifications v
             JOIN companies c ON c.id = v.company_id
             ${where} ORDER BY v.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
            params
        );

        return res.json({
            data: result.rows,
            pagination: { total, limit: parseInt(limit), offset: parseInt(offset), page: Math.floor(offset / limit) + 1, totalPages: Math.ceil(total / limit) },
        });
    } catch (err) {
        console.error('[VERIFICATIONS] fetchAll hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// POST /api/verifications — yeni doğrulama talebi
router.post('/', async (req, res) => {
    const {
        companyId, requesterName, requesterTitle, requesterCompanyEmail,
        requesterPhoneNumber, panelUserName, mernisNo, signatureUrls,
        address, city, district, postalCode, membership,
    } = req.body;

    if (!companyId || !requesterName || !requesterCompanyEmail || !panelUserName) {
        return res.status(400).json({ error: 'Zorunlu alanlar eksik.' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO verifications
             (company_id, requester_name, requester_title, requester_company_email,
              requester_phone_number, panel_user_name, mernis_no, signature_urls,
              address, city, district, postal_code, membership)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
             RETURNING *`,
            [companyId, requesterName, requesterTitle || null, requesterCompanyEmail,
                requesterPhoneNumber || null, panelUserName, mernisNo || null,
                signatureUrls || [], address || null, city || null,
                district || null, postalCode || null, membership || 'free']
        );

        return res.status(201).json({ data: result.rows[0] });
    } catch (err) {
        console.error('[VERIFICATIONS] create hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

// PUT /api/verifications/:id — durumu güncelle (admin)
router.put('/:id', async (req, res) => {
    const { status, rejectionReason } = req.body;

    try {
        const result = await pool.query(
            `UPDATE verifications SET
                status           = COALESCE($1, status),
                rejection_reason = COALESCE($2, rejection_reason),
                updated_at       = NOW()
             WHERE id = $3 RETURNING id, company_id, status`,
            [status, rejectionReason || null, req.params.id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Doğrulama talebi bulunamadı.' });

        // Eğer onaylandıysa şirket statusunu 'verified' yap
        if (status === 'approved') {
            await pool.query(
                "UPDATE companies SET status = 'verified', updated_at = NOW() WHERE id = $1",
                [result.rows[0].company_id]
            );
        }

        return res.json({ success: true });
    } catch (err) {
        console.error('[VERIFICATIONS] update hatası:', err.message);
        return res.status(500).json({ error: 'Sunucu hatası.' });
    }
});

module.exports = router;
