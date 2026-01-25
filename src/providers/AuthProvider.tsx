import React, { useEffect } from 'react';
import { getStoredUser, refreshUser } from '@/services/authApiService';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/types';

interface AuthProviderProps {
    children: React.ReactNode;
}

/**
 * AuthProvider component that handles auth state initialization
 * and syncs user data to the Zustand store.
 *
 * On mount, it checks localStorage for a stored user session
 * and optionally refreshes the user data from the API.
 *
 * Wrap your app with this provider to enable authentication.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const {
        setUser,
        setUserType,
        setAuthLoading,
        setUserLoading,
        setError,
        clearAuth,
    } = useAuthStore();

    useEffect(() => {
        const initializeAuth = async () => {
            setAuthLoading(true);

            try {
                // Check for stored user in localStorage
                const storedUser = getStoredUser();

                if (storedUser) {
                    console.log('Found stored user:', storedUser.id);

                    // Convert API user to app User type
                    const appUser: User = {
                        id: storedUser.id,
                        userName: storedUser.userName,
                        email: storedUser.email,
                        phoneNumber: storedUser.phoneNumber,
                        country: storedUser.country,
                        imageUrl: storedUser.imageUrl,
                        status: storedUser.status,
                        createdAt: storedUser.createdAt,
                        favouriteCompanies: storedUser.favouriteCompanies || [],
                    };

                    // Set user immediately from localStorage
                    setUser(appUser);
                    setUserType('user');

                    // Optionally refresh user data from API in background
                    setUserLoading(true);
                    try {
                        const refreshedUser = await refreshUser(storedUser.id);
                        const updatedAppUser: User = {
                            id: refreshedUser.id,
                            userName: refreshedUser.userName,
                            email: refreshedUser.email,
                            phoneNumber: refreshedUser.phoneNumber,
                            country: refreshedUser.country,
                            imageUrl: refreshedUser.imageUrl,
                            status: refreshedUser.status,
                            createdAt: refreshedUser.createdAt,
                            favouriteCompanies: refreshedUser.favouriteCompanies || [],
                        };
                        setUser(updatedAppUser);
                        console.log('User data refreshed from API');
                    } catch (refreshError: any) {
                        console.error('Failed to refresh user:', refreshError);
                        // If user not found in backend, clear stale session
                        if (refreshError?.message?.includes('not found') ||
                            refreshError?.message?.includes('404')) {
                            console.warn('User not found in backend, clearing stale session');
                            clearAuth();
                            localStorage.removeItem('auth_user');
                        }
                        // Otherwise keep the stored user data for offline usage
                    } finally {
                        setUserLoading(false);
                    }
                } else {
                    console.log('No stored user found');
                    clearAuth();
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                setError('Failed to initialize authentication');
                clearAuth();
            } finally {
                setAuthLoading(false);
            }
        };

        initializeAuth();
    }, [setUser, setUserType, setAuthLoading, setUserLoading, setError, clearAuth]);

    return <>{children}</>;
};
