import React, { useEffect } from 'react';
import { subscribeToAuthChanges } from '@/services/authService';
import { fetchOrCreateUser } from '@/services/userService';
import { fetchCompanyVerificationByEmail } from '@/services/companyVerificationService';
import { useAuthStore, UserType } from '@/store/authStore';

interface AuthProviderProps {
    children: React.ReactNode;
}

/**
 * AuthProvider component that handles Firebase auth state changes
 * and syncs user data to the Zustand store.
 * 
 * The displayName field in Firebase Auth stores the user type ('user' | 'company')
 * for O(1) user type detection.
 * 
 * - For 'user' type: fetches from 'users' collection
 * - For 'company' type: fetches from 'company_verifications' collection
 * 
 * Wrap your app with this provider to enable authentication.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const {
        setFirebaseUser,
        setUserType,
        setUser,
        setCompany,
        setAuthLoading,
        setUserLoading,
        setError,
        setPendingPhoneNumber,
        setPendingUserName,
        clearAuth,
    } = useAuthStore();

    useEffect(() => {
        // Subscribe to Firebase auth state changes
        const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                console.log('Auth state changed: User signed in', firebaseUser.uid);

                // displayName contains the user type ('user' or 'company')
                const userType = (firebaseUser.displayName as UserType) || 'user';
                console.log('User type from displayName:', userType);

                // Set Firebase user and user type immediately
                setFirebaseUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                });
                setUserType(userType);

                // Get pending data from store (set during registration)
                const authState = useAuthStore.getState();
                const pendingPhoneNumber = authState.pendingPhoneNumber;
                const pendingUserName = authState.pendingUserName;

                // Fetch data from Firestore based on user type
                setUserLoading(true);
                try {
                    if (userType === 'company') {
                        // Company users: fetch from company_verifications collection
                        console.log('Fetching company data for:', firebaseUser.email);
                        const company = await fetchCompanyVerificationByEmail(firebaseUser.email || '');

                        if (company) {
                            setCompany(company);
                            setUser(null); // Clear user data for company accounts
                            console.log('Company data loaded successfully:', company);
                        } else {
                            console.warn('Company verification not found for email:', firebaseUser.email);
                            setError('Company verification not found');
                        }
                    } else {
                        // Regular users: fetch from users collection
                        console.log('Fetching user data for:', firebaseUser.uid);
                        const user = await fetchOrCreateUser(
                            firebaseUser.uid,
                            firebaseUser.email || '',
                            pendingUserName,
                            pendingPhoneNumber
                        );
                        setUser(user);
                        setCompany(null); // Clear company data for regular users
                        console.log('User data loaded successfully:', user);
                    }

                    setError(null);

                    // Clear pending data after successful data fetch
                    setPendingPhoneNumber(null);
                    setPendingUserName(null);
                } catch (error) {
                    console.error('Error fetching user/company data:', error);
                    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
                    setError('Failed to load user data');
                    setUser(null);
                    setCompany(null);
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
    }, [setFirebaseUser, setUserType, setUser, setCompany, setAuthLoading, setUserLoading, setError, setPendingPhoneNumber, setPendingUserName, clearAuth]);

    return <>{children}</>;
};
