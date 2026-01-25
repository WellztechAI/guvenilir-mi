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
     * Sign in with Google (placeholder - to be implemented with OAuth)
     */
    const loginWithGoogle = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Implement Google OAuth with backend
            throw new Error('Google login is not yet implemented');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Google login failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Sign out
     */
    const logout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            apiLogout();
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
