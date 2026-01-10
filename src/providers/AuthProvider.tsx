import React, { useEffect } from 'react';
import { subscribeToAuthChanges } from '@/services/authService';
import { fetchOrCreateUser } from '@/services/userService';
import { useAuthStore } from '@/store/authStore';

interface AuthProviderProps {
    children: React.ReactNode;
}

/**
 * AuthProvider component that handles Firebase auth state changes
 * and syncs user data to the Zustand store.
 * 
 * Wrap your app with this provider to enable authentication.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const {
        setFirebaseUser,
        setUser,
        setAuthLoading,
        setUserLoading,
        setError,
        setPendingPhoneNumber,
        clearAuth,
    } = useAuthStore();

    useEffect(() => {
        // Subscribe to Firebase auth state changes
        const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                console.log('Auth state changed: User signed in', firebaseUser.uid);

                // Set Firebase user immediately
                setFirebaseUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                });

                // Get pending phone number from store (set during registration)
                const pendingPhoneNumber = useAuthStore.getState().pendingPhoneNumber;

                // Fetch user data from Firestore
                setUserLoading(true);
                try {
                    console.log('Fetching or creating user with data:', {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        pendingPhoneNumber
                    });

                    const user = await fetchOrCreateUser(
                        firebaseUser.uid,
                        firebaseUser.email || '',
                        firebaseUser.displayName,
                        pendingPhoneNumber
                    );
                    setUser(user);
                    setError(null);
                    console.log('User data loaded successfully:', user);

                    // Clear pending phone number after successful user creation
                    setPendingPhoneNumber(null);
                } catch (error) {
                    console.error('Error fetching/creating user data:', error);
                    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
                    setError('Failed to load user data');
                    setUser(null);
                } finally {
                    setUserLoading(false);
                }
            } else {
                // User is signed out
                console.log('Auth state changed: User signed out');
                clearAuth();
            }

            // Auth loading is complete
            setAuthLoading(false);
        });

        // Cleanup subscription on unmount
        return () => {
            unsubscribe();
        };
    }, [setFirebaseUser, setUser, setAuthLoading, setUserLoading, setError, setPendingPhoneNumber, clearAuth]);

    return <>{children}</>;
};
