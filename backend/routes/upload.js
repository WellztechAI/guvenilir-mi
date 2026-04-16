'use strict';

const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const router = express.Router();

// ============================================
// AWS S3 Configuration
// ============================================
// Credentials varsayılan olarak AWS Environment Variabless'dan (veya ~/.aws/credentials) alınır.
// Eğer IAM kullanıcısı role tabanlıysa (EC2/ECS) otomatik olarak tanınır.
const s3Config = {
    region: process.env.AWS_REGION || 'eu-north-1'
};

const s3Client = new S3Client(s3Config);
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'guvenilir-mi-uploads';

// ============================================
// Multer S3 Middleware
// ============================================
const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: BUCKET_NAME,
        // ACL kaldırıldı: Yeni S3 bucket'larında ACL varsayılan olarak disabled.
        // Erişim, bucket policy üzerinden yönetilmeli.
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            // Benzersiz dosya adı oluşturma (Timestamp + Orijinal İsim)
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileName = `uploads/${uniqueSuffix}-${file.originalname.replace(/\s+/g, '-')}`;
            cb(null, fileName);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB sınır
    fileFilter: (req, file, cb) => {
        // Sadece resim ve PDF dosyalarına izin ver (Doğrulama ve şirket resimleri için)
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Sadece resim ve PDF dosyaları yüklenebilir!'), false);
        }
    }
});

// ============================================
// POST /api/upload
// ============================================
// Tek bir dosya yüklemek için kullanılır. FormData içinde 'file' key'i ile gönderilmeli.
router.post('/', (req, res) => {
    console.log('[UPLOAD] Request received:', req.method, req.url);
    console.log('[UPLOAD] Content-Type:', req.headers['content-type']);

    upload.single('file')(req, res, (err) => {
        if (err) {
            // multer veya multer-s3 hatası
            console.error('[UPLOAD] Multer/S3 error:', err.name, err.message, err.stack);
            return res.status(500).json({
                error: `Dosya yükleme hatası: ${err.message}`,
                errorType: err.name,
                detail: err.code || null,
            });
        }

        console.log('[UPLOAD] File info:', req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            location: req.file.location,
            key: req.file.key,
        } : 'NO FILE');

        if (!req.file) {
            console.error('[UPLOAD] No file found in request');
            return res.status(400).json({ error: 'Dosya seçilmedi veya geçersiz format.' });
        }

        // Başarılı yükleme, S3 URL'ini döndür
        const responseData = {
            success: true,
            url: req.file.location,
            filename: req.file.key,
        };
        console.log('[UPLOAD] Success, returning:', responseData);
        return res.json(responseData);
    });
});

module.exports = router;
