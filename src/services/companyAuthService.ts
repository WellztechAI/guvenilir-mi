import { api } from "@/lib/api";

// ============================================
// Types
// ============================================

export interface CompanyAuthResponse {
  token: string;
  company: {
    id: string;
    name: string;
    email: string;
    panelUserName: string;
    status: string;
    imageUrl?: string;
    phone?: string;
    description?: string;
    sectors?: string[];
  };
}

export interface CompanyLoginCredentials {
  emailOrUsername: string; // Can be requester_company_email or panel_user_name
}

// ============================================
// Company Authentication API
// ============================================

/**
 * Login company user
 * POST /api/companies/auth/login
 */
export const loginCompany = async (
  credentials: CompanyLoginCredentials,
): Promise<CompanyAuthResponse> => {
  try {
    const response = await api.post<CompanyAuthResponse>(
      "/api/companies/auth/login",
      credentials,
    );

    // Store token in localStorage
    if (response.token) {
      localStorage.setItem("company_auth_token", response.token);
    }

    return response;
  } catch (error: any) {
    console.error("Company login error:", error);
    throw new Error(
      error.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
    );
  }
};

/**
 * Logout company user
 */
export const logoutCompany = (): void => {
  localStorage.removeItem("company_auth_token");
};

/**
 * Get current company auth token
 */
export const getCompanyAuthToken = (): string | null => {
  return localStorage.getItem("company_auth_token");
};

/**
 * Check if company is authenticated
 */
export const isCompanyAuthenticated = (): boolean => {
  return !!getCompanyAuthToken();
};

/**
 * Verify company token and get company data
 * GET /api/companies/auth/me
 */
export const verifyCompanyToken = async (): Promise<
  CompanyAuthResponse["company"] | null
> => {
  try {
    const token = getCompanyAuthToken();
    if (!token) return null;

    const response = await api.get<{ data: CompanyAuthResponse["company"] }>(
      "/api/companies/auth/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Token verification error:", error);
    logoutCompany();
    return null;
  }
};
