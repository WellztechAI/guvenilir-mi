'use strict';

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { Issuer, generators } = require('openid-client');

const app = express();

// ============================================
// Config
// ============================================
const config = {
    port: parseInt(process.env.PORT || '3001', 10),
    sessionSecret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
    cognitoClientId: process.env.COGNITO_CLIENT_ID,
    cognitoClientSecret: process.env.COGNITO_CLIENT_SECRET,
    cognitoIssuer: process.env.COGNITO_ISSUER,
    cognitoDomain: process.env.COGNITO_DOMAIN,
    cognitoRedirectUri: process.env.COGNITO_REDIRECT_URI || 'http://localhost:3001/callback',
    cognitoLogoutUri: process.env.COGNITO_LOGOUT_URI || 'http://localhost:3001',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

// ============================================
// Middleware
// ============================================
app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 gün
    },
}));

// ============================================
// API Routes (PostgreSQL)
// ============================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/search', require('./routes/search'));
app.use('/api/verifications', require('./routes/verifications'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ============================================
// Cognito OIDC (Backend demo — opsiyonel)
// ============================================
let oidcClient = null;

async function initializeOidcClient() {
    if (!config.cognitoIssuer || !config.cognitoClientId) {
        console.log('[OIDC] Cognito env eksik, OIDC atlanıyor.');
        return;
    }
    try {
        const issuer = await Issuer.discover(config.cognitoIssuer);
        oidcClient = new issuer.Client({
            client_id: config.cognitoClientId,
            client_secret: config.cognitoClientSecret,
            redirect_uris: [config.cognitoRedirectUri],
            response_types: ['code'],
        });
        console.log('[OIDC] Cognito OIDC istemcisi hazır.');
    } catch (err) {
        console.warn('[OIDC] OIDC başlatılamadı:', err.message);
    }
}

app.get('/login', (req, res) => {
    if (!oidcClient) return res.redirect('/');
    const nonce = generators.nonce();
    const state = generators.state();
    req.session.nonce = nonce;
    req.session.state = state;
    const url = oidcClient.authorizationUrl({
        scope: 'openid email profile',
        state,
        nonce,
        identity_provider: 'Google',
    });
    res.redirect(url);
});

app.get('/callback', async (req, res) => {
    if (!oidcClient) return res.redirect('/');
    try {
        const params = oidcClient.callbackParams(req);
        const tokenSet = await oidcClient.callback(config.cognitoRedirectUri, params, {
            nonce: req.session.nonce,
            state: req.session.state,
        });
        req.session.userInfo = await oidcClient.userinfo(tokenSet.access_token);
        res.redirect('/');
    } catch (err) {
        console.error('[OIDC] Callback hatası:', err.message);
        res.status(500).send('Giriş başarısız.');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    const logoutUrl = `${config.cognitoDomain}/logout?client_id=${config.cognitoClientId}&logout_uri=${encodeURIComponent(config.cognitoLogoutUri)}`;
    res.redirect(logoutUrl);
});

app.get('/', (req, res) => {
    res.json({
        message: 'Güvenilir Mi? API',
        user: req.session.userInfo || null,
        routes: [
            'POST /api/auth/register',
            'POST /api/auth/login',
            'POST /api/auth/check-email',
            'POST /api/auth/change-password',
            'GET  /api/users',
            'GET  /api/companies',
            'GET  /api/companies/:slug',
            'GET  /api/search?q=...',
            'GET  /health',
        ],
    });
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Route bulunamadı.' }));

// Global error handler
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.message);
    res.status(500).json({ error: 'Sunucu hatası.' });
});

// ============================================
// Start
// ============================================
initializeOidcClient().then(() => {
    app.listen(config.port, () => {
        console.log(`\n✅ Güvenilir Mi? API → http://localhost:${config.port}`);
        console.log(`   Frontend CORS → ${config.frontendUrl}`);
    });
});
