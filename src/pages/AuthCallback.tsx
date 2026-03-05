import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeCodeForTokens, fetchCognitoUserInfo, saveCognitoTokens, CognitoUserInfo } from '@/lib/cognito';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/types';

/**
 * AuthCallback sayfası
 *
 * Cognito Hosted UI'dan dönen kullanıcıyı karşılar.
 * URL'deki `code` ve `state` parametrelerini alır,
 * Cognito token endpoint'i ile token exchange yapar,
 * ardından kullanıcı bilgisini Zustand store'a yazar.
 *
 * Route: /auth/callback
 */
const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { setUser, setUserType, setAuthLoading } = useAuthStore();

    useEffect(() => {
        const handleCallback = async () => {
            setAuthLoading(true);

            // Cognito hata durumu
            const error = searchParams.get('error');
            const errorDescription = searchParams.get('error_description');
            if (error) {
                console.error('[AuthCallback] Cognito hata döndürdü:', error, errorDescription);
                setStatus('error');
                setErrorMessage(errorDescription || error);
                setAuthLoading(false);
                return;
            }

            const code = searchParams.get('code');
            const state = searchParams.get('state');

            if (!code || !state) {
                setStatus('error');
                setErrorMessage('Cognito callback parametreleri eksik.');
                setAuthLoading(false);
                return;
            }

            try {
                // 1. Authorization code → tokens
                const tokens = await exchangeCodeForTokens(code, state);
                saveCognitoTokens(tokens);

                // 2. Access token → user info
                const cognitoUser: CognitoUserInfo = await fetchCognitoUserInfo(tokens.access_token);

                // 3. Cognito user → app User type
                const appUser: User = {
                    id: cognitoUser.sub,
                    userName:
                        cognitoUser['cognito:username'] ||
                        cognitoUser.name ||
                        `${cognitoUser.given_name || ''} ${cognitoUser.family_name || ''}`.trim() ||
                        cognitoUser.email ||
                        cognitoUser.sub,
                    email: cognitoUser.email || '',
                    phoneNumber: cognitoUser.phone_number,
                    country: 'Turkiye',
                    imageUrl: undefined,
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    favouriteCompanies: [],
                };

                // 4. Store'a kaydet
                localStorage.setItem('auth_user', JSON.stringify(appUser));
                setUser(appUser);
                setUserType('user');

                console.log('[AuthCallback] Giriş başarılı:', appUser.email);
                navigate('/', { replace: true });
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Bilinmeyen hata';
                console.error('[AuthCallback] Hata:', message);
                setStatus('error');
                setErrorMessage(message);
            } finally {
                setAuthLoading(false);
            }
        };

        handleCallback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow p-8 text-center">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h1 className="text-xl font-bold text-gray-800 mb-2">Giriş başarısız</h1>
                    <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
                    <button
                        onClick={() => navigate('/login', { replace: true })}
                        className="px-6 py-2 rounded-full text-white text-sm font-semibold"
                        style={{ backgroundColor: '#2d1b69' }}
                    >
                        Giriş sayfasına dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#2d1b69] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Giriş yapılıyor...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
