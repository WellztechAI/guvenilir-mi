import { useState, useEffect } from "react";
import { useCompanyAuthStore } from "@/store/companyAuthStore";
import {
  loginCompany,
  logoutCompany,
  verifyCompanyToken,
  CompanyLoginCredentials,
} from "@/services/companyAuthService";

// ============================================
// Company Auth Hook
// ============================================

export const useCompanyAuth = () => {
  const {
    company,
    isAuthenticated,
    isLoading,
    setCompany,
    setLoading,
    logout: storeLogout,
  } = useCompanyAuthStore();
  const [error, setError] = useState<string | null>(null);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      setLoading(true);
      try {
        const companyData = await verifyCompanyToken();
        setCompany(companyData);
      } catch (err) {
        console.error("Token verification failed:", err);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [setCompany, setLoading]);

  // Login function
  const login = async (credentials: CompanyLoginCredentials) => {
    setError(null);
    setLoading(true);

    try {
      const response = await loginCompany(credentials);
      setCompany(response.company);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || "Giriş başarısız";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    logoutCompany();
    storeLogout();
    setError(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return {
    company,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };
};
