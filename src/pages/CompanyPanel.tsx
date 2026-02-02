import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompanyAuth } from "@/hooks/useCompanyAuth";
import { LogOut, Search } from "lucide-react";

// ============================================
// Types
// ============================================

interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  message: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  productName?: string;
}

// ============================================
// Mock Data (will be replaced with API calls)
// ============================================

const mockReviews: Review[] = [
  {
    id: "1",
    authorName: "Fuat Han Albar",
    rating: 5,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nibh justo, blandit eu consectetur sit amet, iaculis in velit.",
    date: "2025-10-05",
    status: "approved",
    productName: "MAJORITY - Mobile Banking",
  },
  {
    id: "2",
    authorName: "Fuat Han Albar",
    rating: 4,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nibh justo, blandit eu consectetur sit amet.",
    date: "2025-10-04",
    status: "pending",
    productName: "MAJORITY - Mobile Banking",
  },
];

// ============================================
// Component
// ============================================

const CompanyPanel = () => {
  const navigate = useNavigate();
  const { company, isAuthenticated, isLoading, logout } = useCompanyAuth();

  const [activeTab, setActiveTab] = useState<
    "overview" | "reviews" | "stats" | "analysis"
  >("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/company-login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/company-login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="text-xl font-bold">güvenilir mi?</div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <button className="hover:text-indigo-200 transition-colors">
                Marka Paneli
              </button>
              <button className="hover:text-indigo-200 transition-colors">
                Genel Görünüm
              </button>
              <button className="hover:text-indigo-200 transition-colors">
                Aktivite Takibi
              </button>
              <button className="hover:text-indigo-200 transition-colors">
                İstatistikler
              </button>
              <button className="hover:text-indigo-200 transition-colors">
                Raporlar
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="font-semibold">{company.name}</div>
                <div className="text-indigo-200 text-xs">
                  MAJORITY - Mobile Banking
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-indigo-600 rounded-lg transition-colors"
                title="Çıkış Yap"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title and Action */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Marka Özeti</h1>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
            Markayı Düzenle
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === "overview"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Genel
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === "reviews"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Yorumlar
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === "stats"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            İstatistikler
          </button>
          <button
            onClick={() => setActiveTab("analysis")}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === "analysis"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Analiz
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {/* Views */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm mb-1">Görüntülenme</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-gray-900">116k</div>
              <div className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                %4k
              </div>
            </div>
          </div>

          {/* Followers */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm mb-1">Takipçi</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-gray-900">455</div>
              <div className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                %4k
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm mb-1">Yorumlar</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-gray-900">19</div>
              <div className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">
                %8k
              </div>
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm mb-1">Cevap Bekleyenler</div>
            <div className="text-3xl font-bold text-gray-900">5</div>
          </div>

          {/* Package */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div className="text-gray-500 text-sm mb-1">Abonelik Paketi</div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-gray-900">Free Paket</div>
              <button className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                Yükselt Paketi
              </button>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <div className="text-blue-600 text-sm flex-1">
            <strong>Buraya anonim paketler alarak-bilgi göndererek</strong>{" "}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            nibh justo, blandit eu consectetur sit amet, iaculis in velit.
            Praesent nec nisi eu nisl consequat tincidunt. Aliquam laoreet ex
            elit, eu eleifend dui maximus in. Mauris ut quam vel neque gravida
            faucibus.
          </div>
          <button className="text-blue-400 hover:text-blue-600">✕</button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Yorumu Ara"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={
                        review.authorAvatar ||
                        "https://api.builder.io/api/v1/image/assets/TEMP/b871dbe9b37cc4da7ac5ba17eed916416d44f314"
                      }
                      alt={review.authorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {review.authorName}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-4 h-4 rounded-sm ${
                            star <= review.rating
                              ? "bg-yellow-400"
                              : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
                  Bu yoruma cevapla
                </button>
              </div>

              {/* Review Content */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                {review.message}
              </p>

              {/* Review Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {review.productName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString("tr-TR")}
                    </div>
                  </div>
                </div>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Tamamını Gör
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
            ‹ Önceki
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 text-sm rounded ${
                page === 1
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
            Sonraki ›
          </button>
        </div>
      </main>
    </div>
  );
};

export default CompanyPanel;
