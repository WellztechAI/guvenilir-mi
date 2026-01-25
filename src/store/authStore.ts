import { create } from 'zustand';
import { User, CompanyVerification } from '@/types';

// User type for O(1) detection
export type UserType = 'user' | 'company' | null;

interface AuthState {
    // App user data (from API)
    user: User | null;

    // User type
    userType: UserType;

    // Company data (for company accounts)
    company: CompanyVerification | null;

    // Loading states
    isAuthLoading: boolean;
    isUserLoading: boolean;

    // Error state
    error: string | null;

    // Computed - is user authenticated
    isAuthenticated: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setUserType: (userType: UserType) => void;
    setCompany: (company: CompanyVerification | null) => void;
    setAuthLoading: (loading: boolean) => void;
    setUserLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    // Initial state
    user: null,
    userType: null,
    company: null,
    isAuthLoading: true, // Start as true until we know auth state
    isUserLoading: false,
    error: null,
    isAuthenticated: false,

    // Actions
    setUser: (user) => set({ user, isAuthenticated: user !== null }),
    setUserType: (userType) => set({ userType }),
    setCompany: (company) => set({ company }),
    setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
    setUserLoading: (isUserLoading) => set({ isUserLoading }),
    setError: (error) => set({ error }),
    clearAuth: () => set({
        user: null,
        userType: null,
        company: null,
        isAuthLoading: false,
        isUserLoading: false,
        error: null,
        isAuthenticated: false,
    }),
}));

// Selector hooks for convenience
export const useUser = () => useAuthStore((state) => state.user);
export const useCompany = () => useAuthStore((state) => state.company);
export const useUserType = () => useAuthStore((state) => state.userType);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsAuthLoading = () => useAuthStore((state) => state.isAuthLoading);
export const useIsUserLoading = () => useAuthStore((state) => state.isUserLoading);
