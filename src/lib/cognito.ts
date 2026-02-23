/**
 * AWS Cognito Hosted UI helper
 *
 * Cognito'nun OAuth2 Hosted UI'ını kullanır.
 * Frontend'de herhangi bir SDK gerekmez —
 * sadece standart OAuth2 redirect akışı.
 */

// ============================================
// Config — tüm değerler .env dosyasından gelir
// ============================================

const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID as string;
const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN as string;
const COGNITO_REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI as string;
const COGNITO_LOGOUT_URI = import.meta.env.VITE_COGNITO_LOGOUT_URI as string;
const COGNITO_SCOPE = import.meta.env.VITE_COGNITO_SCOPE as string | undefined;

// Geliştirme ortamında eksik config uyarısı
if (import.meta.env.DEV) {
    const missing: string[] = [];
    if (!COGNITO_CLIENT_ID) missing.push('VITE_COGNITO_CLIENT_ID');
    if (!COGNITO_DOMAIN || COGNITO_DOMAIN.includes('BURAYA')) missing.push('VITE_COGNITO_DOMAIN');
    if (!COGNITO_REDIRECT_URI) missing.push('VITE_COGNITO_REDIRECT_URI');
    if (!COGNITO_LOGOUT_URI) missing.push('VITE_COGNITO_LOGOUT_URI');
    if (missing.length > 0) {
        console.warn('[Cognito] Eksik env değişkenleri:', missing.join(', '));
        console.warn('[Cognito] .env dosyasını güncelleyin ve geliştirme sunucusunu yeniden başlatın.');
    }
}

// ============================================
// Types
// ============================================

export interface CognitoTokens {
    access_token: string;
    id_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
}

export interface CognitoUserInfo {
    sub: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    given_name?: string;
    family_name?: string;
    phone_number?: string;
    username?: string;
    /** Cognito Hosted UI bazı attribute'ları `cognito:username` key'iyle döner */
    'cognito:username'?: string;
}

// ============================================
// PKCE helpers (Hosted UI için güvenli akış)
// ============================================

function generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (v) => charset[v % charset.length]).join('');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    return crypto.subtle.digest('SHA-256', encoder.encode(plain));
}

function base64URLEncode(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

// ============================================
// Login — Cognito Hosted UI'a yönlendir
// ============================================

/**
 * Kullanıcıyı Cognito Hosted UI'a yönlendirir.
 * PKCE kullanır (güvenli, client secret gerektirmez).
 * İdp parametresi ile direkt Google gibi bir sağlayıcıya atlayabilirsin.
 *
 * @param identityProvider - Opsiyonel: 'Google', 'Facebook' vb.
 */
export async function loginWithCognito(identityProvider?: string): Promise<void> {
    const state = generateRandomString(32);
    const codeVerifier = generateRandomString(64);
    const codeChallenge = base64URLEncode(await sha256(codeVerifier));

    // PKCE verifier'ı ve state'i geçici olarak session storage'da sakla
    sessionStorage.setItem('cognito_code_verifier', codeVerifier);
    sessionStorage.setItem('cognito_state', state);

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: COGNITO_CLIENT_ID,
        redirect_uri: COGNITO_REDIRECT_URI,
        scope: COGNITO_SCOPE || 'phone openid email profile',
        state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
    });

    // Belirli bir identity provider seçildiyse direkt ona yönlendir
    if (identityProvider) {
        params.set('identity_provider', identityProvider);
    }

    const authUrl = `${COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;
    window.location.href = authUrl;
}

// ============================================
// Token Exchange — callback'ten code → tokens
// ============================================

/**
 * Cognito callback'inden gelen authorization code'u
 * access_token ve id_token ile değiştirir.
 *
 * @param code - URL'den alınan authorization code
 * @param state - CSRF doğrulaması için state parametresi
 */
export async function exchangeCodeForTokens(code: string, state: string): Promise<CognitoTokens> {
    // State doğrulama (CSRF koruması)
    const savedState = sessionStorage.getItem('cognito_state');
    if (!savedState || savedState !== state) {
        sessionStorage.removeItem('cognito_state');
        sessionStorage.removeItem('cognito_code_verifier');
        throw new Error('State doğrulaması başarısız. Olası CSRF saldırısı.');
    }

    const codeVerifier = sessionStorage.getItem('cognito_code_verifier');
    if (!codeVerifier) {
        throw new Error('Code verifier bulunamadı. Lütfen tekrar giriş yapın.');
    }

    // Temizle
    sessionStorage.removeItem('cognito_state');
    sessionStorage.removeItem('cognito_code_verifier');

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: COGNITO_CLIENT_ID,
        code,
        redirect_uri: COGNITO_REDIRECT_URI,
        code_verifier: codeVerifier,
    });

    const response = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[Cognito] Token exchange hatası:', errorText);
        throw new Error('Cognito token alınamadı. Lütfen tekrar giriş yapın.');
    }

    return response.json() as Promise<CognitoTokens>;
}

// ============================================
// UserInfo — access_token ile kullanıcı bilgisi
// ============================================

/**
 * Cognito'dan kullanıcı bilgilerini getirir.
 * @param accessToken - exchangeCodeForTokens'tan dönen access_token
 */
export async function fetchCognitoUserInfo(accessToken: string): Promise<CognitoUserInfo> {
    const response = await fetch(`${COGNITO_DOMAIN}/oauth2/userInfo`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
        throw new Error('Cognito kullanıcı bilgisi alınamadı.');
    }

    return response.json() as Promise<CognitoUserInfo>;
}

// ============================================
// Logout — Cognito oturumunu kapat
// ============================================

/**
 * Cognito oturumunu kapatır ve kullanıcıyı logout URI'ya yönlendirir.
 */
export function logoutFromCognito(): void {
    // Token'ları temizle
    localStorage.removeItem('cognito_tokens');

    const params = new URLSearchParams({
        client_id: COGNITO_CLIENT_ID,
        logout_uri: COGNITO_LOGOUT_URI,
    });

    window.location.href = `${COGNITO_DOMAIN}/logout?${params.toString()}`;
}

// ============================================
// Token storage helpers
// ============================================

const COGNITO_TOKENS_KEY = 'cognito_tokens';

export function saveCognitoTokens(tokens: CognitoTokens): void {
    localStorage.setItem(COGNITO_TOKENS_KEY, JSON.stringify(tokens));
}

export function getCognitoTokens(): CognitoTokens | null {
    const raw = localStorage.getItem(COGNITO_TOKENS_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as CognitoTokens;
    } catch {
        return null;
    }
}

export function clearCognitoTokens(): void {
    localStorage.removeItem(COGNITO_TOKENS_KEY);
}
