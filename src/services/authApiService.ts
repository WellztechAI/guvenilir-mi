import { api } from '@/lib/api';

// Types based on API documentation
export interface FavouriteCompany {
    id: string;
    name: string;
    slug: string;
    image_url: string;
}

export interface ApiUser {
    id: string;
    userName: string;
    email: string;
    phoneNumber?: string;
    country?: string;
    imageUrl?: string;
    status: string;
    createdAt: string;
    favouriteCompanies: FavouriteCompany[];
}

export interface LoginResponse {
    success: boolean;
    message: string;
    user: ApiUser;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    user: ApiUser;
}

export interface CheckEmailResponse {
    exists: boolean;
}

export interface ChangePasswordResponse {
    success: boolean;
    message: string;
}

// Storage keys
const AUTH_USER_KEY = 'auth_user';

/**
 * Login with email and password
 */
export const loginWithEmail = async (email: string, password: string): Promise<ApiUser> => {
    const response = await api.post<LoginResponse>('/api/auth/login', {
        email,
        password,
    });

    if (!response.success) {
        throw new Error(response.message || 'Login failed');
    }

    // Store user in localStorage for session persistence
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));

    return response.user;
};

/**
 * Register with email and password
 */
export const registerWithEmail = async (
    email: string,
    password: string,
    userName: string,
    phoneNumber?: string,
    country: string = 'Turkiye'
): Promise<ApiUser> => {
    const response = await api.post<RegisterResponse>('/api/auth/register', {
        userName,
        email,
        password,
        phoneNumber,
        country,
    });

    if (!response.success) {
        throw new Error(response.message || 'Registration failed');
    }

    // Store user in localStorage for session persistence
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));

    return response.user;
};

/**
 * Check if email exists
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
    const response = await api.post<CheckEmailResponse>('/api/auth/check-email', {
        email,
    });

    return response.exists;
};

/**
 * Change password
 */
export const changePassword = async (
    userId: string,
    currentPassword: string,
    newPassword: string
): Promise<void> => {
    const response = await api.post<ChangePasswordResponse>('/api/auth/change-password', {
        userId,
        currentPassword,
        newPassword,
    });

    if (!response.success) {
        throw new Error(response.message || 'Password change failed');
    }
};

/**
 * Logout - clear stored user data
 */
export const logout = (): void => {
    localStorage.removeItem(AUTH_USER_KEY);
};

/**
 * Get stored user from localStorage
 */
export const getStoredUser = (): ApiUser | null => {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (!stored) return null;

    try {
        const user = JSON.parse(stored) as ApiUser;
        // Validate that user has a valid ID (not undefined, null, or "undefined" string)
        if (!user.id || user.id === 'undefined' || user.id === 'null') {
            console.warn('Stored user has invalid ID, clearing auth');
            localStorage.removeItem(AUTH_USER_KEY);
            return null;
        }
        return user;
    } catch {
        localStorage.removeItem(AUTH_USER_KEY);
        return null;
    }
};

/**
 * Update stored user in localStorage
 */
export const updateStoredUser = (user: ApiUser): void => {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

/**
 * Fetch user by ID from API
 */
export const fetchUserById = async (userId: string): Promise<ApiUser> => {
    // Validate userId before making request
    if (!userId || userId === 'undefined' || userId === 'null') {
        throw new Error('Invalid user ID');
    }
    const response = await api.get<{ data: ApiUser }>(`/api/users/${userId}`);
    return response.data;
};

/**
 * Refresh user data from API and update localStorage
 */
export const refreshUser = async (userId: string): Promise<ApiUser> => {
    const user = await fetchUserById(userId);
    updateStoredUser(user);
    return user;
};

/**
 * Add a company to user's favourites
 */
export const addFavouriteCompany = async (userId: string, companyId: string): Promise<void> => {
    await api.post(`/api/users/${userId}/favourites`, { companyId });
};

/**
 * Remove a company from user's favourites
 */
export const removeFavouriteCompany = async (userId: string, companyId: string): Promise<void> => {
    await api.delete(`/api/users/${userId}/favourites/${companyId}`);
};

// ============================================
// Company & Verification Types
// ============================================

export interface CreateCompanyRequest {
    name: string;
    slug: string;
    description?: string;
    phone?: string;
    sectors?: string[];
}

export interface CreateCompanyResponse {
    id: string;
    name: string;
    slug: string;
    description?: string;
    phone?: string;
    sectors?: string[];
    status: string;
    rating: number | null;
    comment_count: number;
    created_at: string;
}

export interface CreateVerificationRequest {
    companyId: string;
    requesterName: string;
    requesterTitle?: string;
    requesterCompanyEmail: string;
    requesterPhoneNumber?: string;
    panelUserName: string;
    panelPassword: string;
    mernisNo?: string;
    signatureUrls?: string[];
    address?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    membership?: 'free' | 'basic' | 'premium' | 'enterprise';
}

export interface VerificationResponse {
    id: string;
    companyId: string;
    requesterName: string;
    requesterTitle?: string;
    requesterCompanyEmail: string;
    requesterPhoneNumber?: string;
    panelUserName: string;
    mernisNo?: string;
    signatureUrls?: string[];
    address?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    membership: string;
    status: string;
    createdAt: string;
}

export interface FileUploadResponse {
    success: boolean;
    path: string;
    url: string;
    filename: string;
    bucket: string;
    size: number;
    mimeType: string;
}

// ============================================
// Company & Verification API Functions
// ============================================

/**
 * Create a new company
 */
export const createCompany = async (companyData: CreateCompanyRequest): Promise<CreateCompanyResponse> => {
    const response = await api.post<CreateCompanyResponse>('/api/companies', companyData);
    return response;
};

/**
 * Create a company verification request
 */
export const createCompanyVerification = async (verificationData: CreateVerificationRequest): Promise<VerificationResponse> => {
    const response = await api.post<VerificationResponse>('/api/verifications', verificationData);
    return response;
};

/**
 * Upload a file (for signatures, avatars, logos)
 */
export const uploadFile = async (
    file: File,
    bucket: 'avatars' | 'logos' | 'signatures' | 'uploads' = 'uploads'
): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'File upload failed');
    }

    return response.json();
};

/**
 * Get verification by ID
 */
export const getVerification = async (verificationId: string): Promise<VerificationResponse> => {
    const response = await api.get<VerificationResponse>(`/api/verifications/${verificationId}`);
    return response;
};

/**
 * Get verifications by company ID
 */
export const getCompanyVerifications = async (companyId: string): Promise<VerificationResponse[]> => {
    const response = await api.get<VerificationResponse[]>(`/api/companies/${companyId}/verifications`);
    return response;
};
