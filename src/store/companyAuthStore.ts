import { create } from "zustand";
import { CompanyAuthResponse } from "@/services/companyAuthService";

// ============================================
// Company Auth Store Types
// ============================================

interface CompanyAuthState {
  company: CompanyAuthResponse["company"] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setCompany: (company: CompanyAuthResponse["company"] | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

// ============================================
// Company Auth Store
// ============================================

export const useCompanyAuthStore = create<CompanyAuthState>((set) => ({
  company: null,
  isAuthenticated: false,
  isLoading: true,

  setCompany: (company) =>
    set({
      company,
      isAuthenticated: !!company,
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  logout: () =>
    set({
      company: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
