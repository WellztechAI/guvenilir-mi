import { useState } from 'react';
import {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
} from '@/services/authService';
import { useAuthStore, useUser, useIsAuthenticated, useIsAuthLoading } from '@/store/authStore';

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
    const firebaseUser = useAuthStore((state) => state.firebaseUser);

    /**
     * Sign in with email and password
     */
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await signInWithEmail(email, password);
            // AuthProvider will handle the rest via onAuthStateChanged
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
        displayName?: string,
        phoneNumber?: string
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            // Store phone number in Zustand for AuthProvider to use
            useAuthStore.getState().setPendingPhoneNumber(phoneNumber || null);
            await signUpWithEmail(email, password, displayName);
            // AuthProvider will handle the rest via onAuthStateChanged
        } catch (err) {
            useAuthStore.getState().setPendingPhoneNumber(null);
            const errorMessage = err instanceof Error ? err.message : 'Registration failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Sign in with Google
     */
    const loginWithGoogle = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
            // AuthProvider will handle the rest via onAuthStateChanged
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
            await signOut();
            // AuthProvider will handle the rest via onAuthStateChanged
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Logout failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Send password reset email
     */
    const sendPasswordReset = async (email: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await resetPassword(email);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        // State
        user,
        firebaseUser,
        isAuthenticated,
        isAuthLoading,
        isLoading,
        error,

        // Actions
        login,
        register,
        loginWithGoogle,
        logout,
        sendPasswordReset,
        clearError: () => setError(null),
    };
};
