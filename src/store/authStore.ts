import { create } from 'zustand';
import { User, CompanyVerification } from '@/types';

// User type for O(1) detection
export type UserType = 'user' | 'company' | null;

interface AuthState {
    // Firebase Auth user (from Firebase Auth)
    firebaseUser: {
        uid: string;
        email: string | null;
        displayName: string | null; // Contains 'user' or 'company'
    } | null;

    // User type derived from displayName
    userType: UserType;

    // App user data (from Firestore 'users' collection)
    user: User | null;

    // Company data (from Firestore 'company_verifications' collection)
    company: CompanyVerification | null;

    // Loading states
    isAuthLoading: boolean;
    isUserLoading: boolean;

    // Error state
    error: string | null;

    // Pending data for new user registration
    pendingPhoneNumber: string | null;
    pendingUserName: string | null;

    // Actions
    setFirebaseUser: (firebaseUser: AuthState['firebaseUser']) => void;
    setUserType: (userType: UserType) => void;
    setUser: (user: User | null) => void;
    setCompany: (company: CompanyVerification | null) => void;
    setAuthLoading: (loading: boolean) => void;
    setUserLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setPendingPhoneNumber: (phoneNumber: string | null) => void;
    setPendingUserName: (userName: string | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    // Initial state
    firebaseUser: null,
    userType: null,
    user: null,
    company: null,
    isAuthLoading: true, // Start as true until we know auth state
    isUserLoading: false,
    error: null,
    pendingPhoneNumber: null,
    pendingUserName: null,

    // Actions
    setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
    setUserType: (userType) => set({ userType }),
    setUser: (user) => set({ user }),
    setCompany: (company) => set({ company }),
    setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
    setUserLoading: (isUserLoading) => set({ isUserLoading }),
    setError: (error) => set({ error }),
    setPendingPhoneNumber: (pendingPhoneNumber) => set({ pendingPhoneNumber }),
    setPendingUserName: (pendingUserName) => set({ pendingUserName }),
    clearAuth: () => set({
        firebaseUser: null,
        userType: null,
        user: null,
        company: null,
        isAuthLoading: false,
        isUserLoading: false,
        error: null,
        pendingPhoneNumber: null,
        pendingUserName: null,
    }),
}));

// Selector hooks for convenience
export const useUser = () => useAuthStore((state) => state.user);
export const useCompany = () => useAuthStore((state) => state.company);
export const useUserType = () => useAuthStore((state) => state.userType);
export const useFirebaseUser = () => useAuthStore((state) => state.firebaseUser);
export const useIsAuthenticated = () => useAuthStore((state) => state.firebaseUser !== null);
export const useIsAuthLoading = () => useAuthStore((state) => state.isAuthLoading);
export const useIsUserLoading = () => useAuthStore((state) => state.isUserLoading);
