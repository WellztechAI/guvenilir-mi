import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCompanyAuth } from "@/hooks/useCompanyAuth";
import { Building2 } from "lucide-react";

const CompanyLogin = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } =
    useCompanyAuth();

  const [emailOrUsername, setEmailOrUsername] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/company-panel");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ emailOrUsername });
      navigate("/company-panel");
    } catch (err) {
      // Error is handled by useCompanyAuth
    }
  };

  return (
    <div className="bg-white flex flex-col overflow-hidden items-center min-h-screen">
      <Header />

      {/* Main content area */}
      <main className="w-full flex-1 flex flex-col">
        {/* Gradient background */}
        <div
          className="w-full relative"
          style={{
            background:
              "linear-gradient(180deg, #0d0820 0%, #1a1040 15%, #2d1b69 35%, #4a3a8a 55%, #7B6BA7 75%, #c4bfd8 90%, #FFFFFF 100%)",
            paddingTop: "60px",
            paddingBottom: "180px",
          }}
        />

        {/* Semi-transparent container */}
        <div className="flex-1 pb-12 -mt-[220px] relative z-10">
          <div className="max-w-[500px] mx-auto px-4 w-full">
            <div
              className="rounded-3xl overflow-hidden border"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderColor: "rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="p-8">
                {/* Icon and Title */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                    <Building2 size={32} className="text-white" />
                  </div>
                  <h1
                    className="text-white text-2xl md:text-3xl font-bold mb-2"
                    style={{ fontFamily: "Metropolis, sans-serif" }}
                  >
                    İşletme Paneli Girişi
                  </h1>
                  <p
                    className="text-white/70 text-sm md:text-base"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    İşletme hesabınızla giriş yapın
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                  {/* Email or Username field */}
                  <div className="mb-6">
                    <label
                      className="block text-sm text-white/80 mb-2"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      E-posta veya Kullanıcı Adı
                    </label>
                    <input
                      type="text"
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                      placeholder="ornek@sirket.com veya kullaniciadi"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#2d1b69] transition-colors"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                      required
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-full text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                    style={{
                      fontFamily: "Metropolis, sans-serif",
                      backgroundColor: "#2d1b69",
                    }}
                  >
                    {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                  </button>
                </form>

                {/* Links */}
                <div className="mt-6 text-center space-y-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="text-white/80 hover:text-white text-sm transition-colors block w-full"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    ← Kullanıcı girişine dön
                  </button>

                  <div className="pt-3 border-t border-white/20">
                    <p
                      className="text-sm text-white/70 mb-2"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                      Henüz işletme hesabınız yok mu?
                    </p>
                    <button
                      onClick={() => navigate("/company-signup")}
                      className="text-white font-semibold hover:underline text-sm"
                      style={{ fontFamily: "Metropolis, sans-serif" }}
                    >
                      İşletme Kaydı Oluştur →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyLogin;
