import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
    // Firebase Auth user (from Firebase Auth)
    firebaseUser: {
        uid: string;
        email: string | null;
        displayName: string | null;
    } | null;

    // App user data (from Firestore)
    user: User | null;

    // Loading states
    isAuthLoading: boolean;
    isUserLoading: boolean;

    // Error state
    error: string | null;

    // Pending data for new user registration
    pendingPhoneNumber: string | null;

    // Actions
    setFirebaseUser: (firebaseUser: AuthState['firebaseUser']) => void;
    setUser: (user: User | null) => void;
    setAuthLoading: (loading: boolean) => void;
    setUserLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setPendingPhoneNumber: (phoneNumber: string | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    // Initial state
    firebaseUser: null,
    user: null,
    isAuthLoading: true, // Start as true until we know auth state
    isUserLoading: false,
    error: null,
    pendingPhoneNumber: null,

    // Actions
    setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
    setUser: (user) => set({ user }),
    setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
    setUserLoading: (isUserLoading) => set({ isUserLoading }),
    setError: (error) => set({ error }),
    setPendingPhoneNumber: (pendingPhoneNumber) => set({ pendingPhoneNumber }),
    clearAuth: () => set({
        firebaseUser: null,
        user: null,
        isAuthLoading: false,
        isUserLoading: false,
        error: null,
        pendingPhoneNumber: null,
    }),
}));

// Selector hooks for convenience
export const useUser = () => useAuthStore((state) => state.user);
export const useFirebaseUser = () => useAuthStore((state) => state.firebaseUser);
export const useIsAuthenticated = () => useAuthStore((state) => state.firebaseUser !== null);
export const useIsAuthLoading = () => useAuthStore((state) => state.isAuthLoading);
export const useIsUserLoading = () => useAuthStore((state) => state.isUserLoading);
