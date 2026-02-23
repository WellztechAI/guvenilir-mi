import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import CompanySignup from "./pages/CompanySignup";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import CompanyDetail from "./pages/CompanyDetail";
import { UserProfile } from "./pages/UserProfile";
import { CompanyProfile } from "./pages/CompanyProfile";
import Manifest from "./pages/Manifest";
import SSS from "./pages/SSS";
import CommentPolicy from "./pages/CommentPolicy";
import CommunityRules from "./pages/CommunityRules";
import BrandArea from "./pages/BrandArea";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/company-signup" element={<CompanySignup />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/panel" element={<AdminPanel />} />
            <Route path="/company/:id" element={<CompanyDetail />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/company-profile" element={<CompanyProfile />} />
            <Route path="/manifest" element={<Manifest />} />
            <Route path="/sss" element={<SSS />} />
            <Route path="/yorum-politikasi" element={<CommentPolicy />} />
            <Route path="/topluluk-kurallari" element={<CommunityRules />} />
            <Route path="/marka-alani" element={<BrandArea />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
