import { useState } from 'react';
import {
    loginWithEmail,
    registerWithEmail,
    logout as apiLogout,
    changePassword as apiChangePassword,
    updateStoredUser,
} from '@/services/authApiService';
import { useAuthStore, useUser, useIsAuthenticated, useIsAuthLoading } from '@/store/authStore';
import { User } from '@/types';
import { loginWithCognito, logoutFromCognito, clearCognitoTokens } from '@/lib/cognito';

/**
 * Custom hook for authentication operations
 * Provides methods for sign in, sign up, sign out, etc.
 */
export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const user = useUser();
    const isAuthenticated = useIsAuthenticated();
    const isAuthLoading = useIsAuthLoading();

    const { setUser, setUserType, clearAuth } = useAuthStore();

    /**
     * Sign in with email and password
     */
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const apiUser = await loginWithEmail(email, password);
            // Convert API user to app User type
            const appUser: User = {
                id: apiUser.id,
                userName: apiUser.userName,
                email: apiUser.email,
                phoneNumber: apiUser.phoneNumber,
                country: apiUser.country,
                imageUrl: apiUser.imageUrl,
                status: apiUser.status,
                createdAt: apiUser.createdAt,
                favouriteCompanies: apiUser.favouriteCompanies,
            };
            setUser(appUser);
            setUserType('user');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Sign up with email and password
     */
    const register = async (
        email: string,
        password: string,
        userType: 'user' | 'company' = 'user',
        userName?: string,
        phoneNumber?: string
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            const apiUser = await registerWithEmail(
                email,
                password,
                userName || email.split('@')[0],
                phoneNumber
            );
            // Convert API user to app User type
            const appUser: User = {
                id: apiUser.id,
                userName: apiUser.userName,
                email: apiUser.email,
                phoneNumber: apiUser.phoneNumber,
                country: apiUser.country,
                imageUrl: apiUser.imageUrl,
                status: apiUser.status,
                createdAt: apiUser.createdAt,
                favouriteCompanies: apiUser.favouriteCompanies || [],
            };
            setUser(appUser);
            setUserType(userType);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Registration failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Cognito Hosted UI üzerinden giriş yap (Google ve diğer sosyal sağlayıcılar dahil)
     * Kullanıcıyı Cognito Hosted UI'a yönlendirir.
     * Giriş tamamlanınca /auth/callback sayfasına dönülür.
     *
     * @param identityProvider - Opsiyonel: 'Google', 'Facebook' vb. Belirtilmezse Hosted UI açılır.
     */
    const loginWithCognitoHostedUI = async (identityProvider?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            // Bu fonksiyon window.location.href yaptığı için await gerekmez,
            // sayfa redirect edilir ve hook unmount olur.
            await loginWithCognito(identityProvider);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Cognito giriş başlatılamadı';
            setError(errorMessage);
            setIsLoading(false);
            throw err;
        }
        // isLoading burada reset edilmez — sayfa zaten redirect olacak
    };

    // Geriye dönük uyumluluk için loginWithGoogle → Cognito Google IdP
    const loginWithGoogle = async () => loginWithCognitoHostedUI('Google');

    /**
     * Sign out — hem email hem de Cognito oturumunu temizler
     */
    const logout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            apiLogout();
            clearCognitoTokens();
            clearAuth();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Logout failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Change password
     */
    const changeUserPassword = async (currentPassword: string, newPassword: string) => {
        if (!user?.id) {
            throw new Error('User not authenticated');
        }
        setIsLoading(true);
        setError(null);
        try {
            await apiChangePassword(user.id, currentPassword, newPassword);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Password change failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Update user in store and localStorage
     */
    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        updateStoredUser({
            id: updatedUser.id,
            userName: updatedUser.userName,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
            country: updatedUser.country,
            imageUrl: updatedUser.imageUrl,
            status: updatedUser.status,
            createdAt: typeof updatedUser.createdAt === 'string'
                ? updatedUser.createdAt
                : updatedUser.createdAt.toISOString(),
            favouriteCompanies: updatedUser.favouriteCompanies,
        });
    };

    return {
        // State
        user,
        isAuthenticated,
        isAuthLoading,
        isLoading,
        error,

        // Actions
        login,
        register,
        loginWithGoogle,
        logout,
        changeUserPassword,
        updateUser,
        clearError: () => setError(null),
    };
};
