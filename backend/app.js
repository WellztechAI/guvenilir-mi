'use strict';

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const { Issuer, generators } = require('openid-client');
const path = require('path');

const app = express();

// ============================================
// Config — tüm değerler .env dosyasından gelir
// ============================================
const config = {
    clientId: process.env.COGNITO_CLIENT_ID,
    clientSecret: process.env.COGNITO_CLIENT_SECRET,
    issuer: process.env.COGNITO_ISSUER,
    redirectUri: process.env.COGNITO_REDIRECT_URI,
    logoutUri: process.env.COGNITO_LOGOUT_URI,
    cognitoDomain: process.env.COGNITO_DOMAIN,
    sessionSecret: process.env.SESSION_SECRET || 'local-dev-secret-change-in-production',
    port: parseInt(process.env.PORT || '3001', 10),
};

// Başlangıçta eksik config kontrolü
const requiredConfig = ['clientId', 'clientSecret', 'issuer', 'redirectUri', 'logoutUri', 'cognitoDomain'];
for (const key of requiredConfig) {
    if (!config[key] || config[key].startsWith('BURAYA_')) {
        console.error(`[CONFIG ERROR] ${key} env değeri eksik veya placeholder içeriyor.`);
        console.error('Lütfen .env.example dosyasını kopyalayarak .env oluşturun ve gerçek değerleri girin.');
        process.exit(1);
    }
}

// ============================================
// View engine
// ============================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================
// Session middleware
// ============================================
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        // HTTPS ortamında secure: true yapın
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 gün
    },
}));

// ============================================
// OpenID Client başlatma
// ============================================
let oidcClient;

async function initializeOidcClient() {
    try {
        console.log('[OIDC] Issuer discovery başlatılıyor:', config.issuer);
        const issuer = await Issuer.discover(config.issuer);
        console.log('[OIDC] Issuer keşfedildi:', issuer.issuer);

        oidcClient = new issuer.Client({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            redirect_uris: [config.redirectUri],
            response_types: ['code'],
        });

        console.log('[OIDC] Client başarıyla oluşturuldu.');
    } catch (err) {
        console.error('[OIDC] Client başlatma hatası:', err.message);
        console.error('Cognito issuer URL\'ini ve client bilgilerini kontrol edin.');
        process.exit(1);
    }
}

// ============================================
// Auth middleware
// ============================================
const checkAuth = (req, res, next) => {
    req.isAuthenticated = Boolean(req.session.userInfo);
    next();
};

// Client henüz hazır değilse hata ver
const requireOidcClient = (req, res, next) => {
    if (!oidcClient) {
        return res.status(503).send('Auth servisi henüz hazır değil. Birkaç saniye sonra tekrar deneyin.');
    }
    next();
};

// ============================================
// Helper — URL'den path çıkar
// ============================================
function getPathFromURL(urlString) {
    try {
        return new URL(urlString).pathname;
    } catch {
        return '/';
    }
}

// ============================================
// Routes
// ============================================

// Ana sayfa
app.get('/', checkAuth, (req, res) => {
    res.render('home', {
        isAuthenticated: req.isAuthenticated,
        userInfo: req.session.userInfo || null,
    });
});

// Login — Cognito Hosted UI'a yönlendir
app.get('/login', requireOidcClient, (req, res) => {
    const nonce = generators.nonce();
    const state = generators.state();

    req.session.nonce = nonce;
    req.session.state = state;

    const authUrl = oidcClient.authorizationUrl({
        scope: 'phone openid email profile',
        state,
        nonce,
    });

    console.log('[LOGIN] Cognito Hosted UI\'a yönlendiriliyor');
    res.redirect(authUrl);
});

// Callback — Cognito'dan gelen code ile token exchange
const callbackPath = getPathFromURL(config.redirectUri);
app.get(callbackPath || '/', requireOidcClient, async (req, res) => {
    try {
        const params = oidcClient.callbackParams(req);

        const tokenSet = await oidcClient.callback(
            config.redirectUri,
            params,
            {
                nonce: req.session.nonce,
                state: req.session.state,
            }
        );

        const userInfo = await oidcClient.userinfo(tokenSet.access_token);
        req.session.userInfo = userInfo;

        // Kullanılan nonce/state'i temizle
        delete req.session.nonce;
        delete req.session.state;

        console.log('[CALLBACK] Giriş başarılı, kullanıcı:', userInfo.email || userInfo.sub);
        res.redirect('/');
    } catch (err) {
        console.error('[CALLBACK] Token exchange hatası:', err.message);
        res.redirect('/?error=auth_failed');
    }
});

// Logout — Session temizle ve Cognito logout'a yönlendir
app.get('/logout', (req, res) => {
    const userEmail = req.session.userInfo?.email || 'bilinmiyor';
    req.session.destroy((err) => {
        if (err) {
            console.error('[LOGOUT] Session destroy hatası:', err.message);
        }
        console.log('[LOGOUT] Kullanıcı çıkış yaptı:', userEmail);
    });

    const logoutUrl = new URL(`${config.cognitoDomain}/logout`);
    logoutUrl.searchParams.set('client_id', config.clientId);
    logoutUrl.searchParams.set('logout_uri', config.logoutUri);

    res.redirect(logoutUrl.toString());
});

// ============================================
// Sunucuyu başlat
// ============================================
initializeOidcClient().then(() => {
    app.listen(config.port, () => {
        console.log(`[SERVER] Sunucu http://localhost:${config.port} adresinde çalışıyor`);
        console.log(`[SERVER] Callback path: ${callbackPath}`);
    });
});
