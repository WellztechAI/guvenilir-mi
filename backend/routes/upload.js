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
        acl: 'public-read', // Yüklenen dosyalar herkes tarafından okunabilir olacak
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
router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Dosya seçilmedi veya geçersiz format.' });
        }

        // Başarılı yükleme, S3 URL'ini döndür
        return res.json({
            success: true,
            url: req.file.location,
            filename: req.file.key
        });
    } catch (err) {
        console.error('[UPLOAD] S3 Yükleme Hatası:', err.message);
        return res.status(500).json({ error: 'Dosya yüklenirken bir hata oluştu.' });
    }
});

module.exports = router;
