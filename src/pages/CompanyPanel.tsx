import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompanyAuth } from "@/hooks/useCompanyAuth";
import { LogOut, Search, Pin } from "lucide-react";
import {
  fetchCommentsByCompanyIdPaginated,
  answerComment,
} from "@/services/commentService";
import { Comment } from "@/types";

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/company-login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Fetch comments when company is loaded
  useEffect(() => {
    const loadComments = async () => {
      if (!company?.id) return;

      setIsLoadingComments(true);
      try {
        const result = await fetchCommentsByCompanyIdPaginated(company.id, {
          status: "approved",
          sortBy: "created_at",
          sortOrder: "DESC",
          limit: 10,
          page: currentPage,
          search: searchQuery || undefined,
        });

        setComments(result.comments);
        setTotalPages(result.pagination.totalPages);
      } catch (error) {
        console.error("Error loading comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };

    loadComments();
  }, [company?.id, currentPage, searchQuery]);

  const handleLogout = () => {
    logout();
    navigate("/company-login");
  };

  const handleReply = async (commentId: string) => {
    if (!replyText.trim()) return;

    try {
      await answerComment(commentId, replyText);

      // Update local state
      setComments(
        comments.map((c) =>
          c.id === commentId
            ? { ...c, answer: replyText, answerDate: new Date() }
            : c,
        ),
      );

      setReplyingTo(null);
      setReplyText("");
    } catch (error) {
      console.error("Error replying to comment:", error);
      alert("Cevap gönderilirken bir hata oluştu.");
    }
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

  // Calculate stats from comments
  const totalComments = comments.length;
  const unansweredComments = comments.filter((c) => !c.answer).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient */}
      <header
        className="text-white shadow-lg"
        style={{
          background: "linear-gradient(90deg, #4C38A5 0%, #023E84 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="text-xl font-bold"
                style={{ fontFamily: "Metropolis, sans-serif" }}
              >
                güvenilir mi?
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <button
                className="hover:text-white/80 transition-colors"
                style={{ fontFamily: "Metropolis, sans-serif" }}
              >
                Marka Panelim
              </button>
              <button
                className="hover:text-white/80 transition-colors"
                style={{ fontFamily: "Metropolis, sans-serif" }}
              >
                Gelen Yorumlar
              </button>
              <button
                className="hover:text-white/80 transition-colors"
                style={{ fontFamily: "Metropolis, sans-serif" }}
              >
                Abonelik Paketleri
              </button>
              <button
                className="hover:text-white/80 transition-colors"
                style={{ fontFamily: "Metropolis, sans-serif" }}
              >
                İstatistikler
              </button>
              <button
                className="hover:text-white/80 transition-colors"
                style={{ fontFamily: "Metropolis, sans-serif" }}
              >
                Pazarlama
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div
                  className="font-semibold"
                  style={{ fontFamily: "Metropolis, sans-serif" }}
                >
                  {company.name}
                </div>
                <div className="text-white/70 text-xs">
                  {company.panelUserName}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
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
        {/* Page Title */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "Metropolis, sans-serif" }}
          >
            Marka Özeti
          </h1>
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
            style={{ fontFamily: "Metropolis, sans-serif" }}
          >
            Özet
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 px-1 font-medium transition-colors ${
              activeTab === "reviews"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={{ fontFamily: "Metropolis, sans-serif" }}
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
            style={{ fontFamily: "Metropolis, sans-serif" }}
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
            style={{ fontFamily: "Metropolis, sans-serif" }}
          >
            Analiz
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {/* Views */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div
              className="text-gray-500 text-sm mb-1"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Görüntülenme
            </div>
            <div className="flex items-baseline gap-2">
              <div
                className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: "Metropolis, sans-serif" }}
              >
                116k
              </div>
              <div className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                %4k
              </div>
            </div>
          </div>

          {/* Followers */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div
              className="text-gray-500 text-sm mb-1"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Takipçi
            </div>
            <div className="flex items-baseline gap-2">
              <div
                className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: "Metropolis, sans-serif" }}
              >
                455
              </div>
              <div className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                %4k
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div
              className="text-gray-500 text-sm mb-1"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Yorumlar
            </div>
            <div className="flex items-baseline gap-2">
              <div
                className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: "Metropolis, sans-serif" }}
              >
                {totalComments}
              </div>
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div
              className="text-gray-500 text-sm mb-1"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Cevap Bekleyenler
            </div>
            <div
              className="text-3xl font-bold text-gray-900"
              style={{ fontFamily: "Metropolis, sans-serif" }}
            >
              {unansweredComments}
            </div>
          </div>

          {/* Package */}
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <div
              className="text-gray-500 text-sm mb-1"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Abonelik Paketi
            </div>
            <div className="flex items-center justify-between">
              <div
                className="text-lg font-bold text-gray-900"
                style={{ fontFamily: "Metropolis, sans-serif" }}
              >
                Free Paket
              </div>
              <button
                className="text-xs text-white px-3 py-1 rounded hover:opacity-90 transition-opacity"
                style={{
                  background:
                    "linear-gradient(90deg, #4C38A5 0%, #023E84 100%)",
                  fontFamily: "Metropolis, sans-serif",
                }}
              >
                Yükselt
              </button>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <div
            className="text-blue-600 text-sm flex-1"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
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
              style={{ fontFamily: "Manrope, sans-serif" }}
            />
          </div>
        </div>

        {/* Reviews List */}
        {isLoadingComments ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yorumlar yükleniyor...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p
              className="text-gray-500"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Henüz yorum bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                      {comment.authorAvatar ? (
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                          <span className="text-purple-600 text-sm font-semibold">
                            {comment.authorName.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div
                        className="font-semibold text-gray-900"
                        style={{ fontFamily: "Metropolis, sans-serif" }}
                      >
                        {comment.authorName}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`w-4 h-4 rounded-sm ${
                              star <= comment.rating
                                ? "bg-yellow-400"
                                : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Sabitle button - disabled for now */}
                    <button
                      disabled
                      className="px-4 py-2 text-white text-sm rounded-lg opacity-50 cursor-not-allowed"
                      style={{
                        background:
                          "linear-gradient(90deg, #4C38A5 0%, #023E84 100%)",
                        fontFamily: "Metropolis, sans-serif",
                      }}
                    >
                      <Pin size={16} className="inline mr-1" />
                      Sabitle
                    </button>
                  </div>
                </div>

                {/* Review Content */}
                <p
                  className="text-gray-700 mb-4 leading-relaxed"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {comment.message}
                </p>

                {/* Review Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    {comment.productName && (
                      <div>
                        <div
                          className="font-medium text-gray-900 text-sm"
                          style={{ fontFamily: "Metropolis, sans-serif" }}
                        >
                          {comment.productName}
                        </div>
                        <div
                          className="text-sm text-gray-500"
                          style={{ fontFamily: "Manrope, sans-serif" }}
                        >
                          {new Date(comment.date).toLocaleDateString("tr-TR")}
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="text-sm font-medium transition-colors"
                    style={{
                      color: "#4C38A5",
                      fontFamily: "Metropolis, sans-serif",
                    }}
                  >
                    Cevapla
                  </button>
                </div>

                {/* Company Answer */}
                {comment.answer && (
                  <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{
                          background:
                            "linear-gradient(90deg, #4C38A5 0%, #023E84 100%)",
                        }}
                      >
                        {company.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div
                          className="font-semibold text-gray-900 mb-1"
                          style={{ fontFamily: "Metropolis, sans-serif" }}
                        >
                          {company.name}
                        </div>
                        <p
                          className="text-gray-700 text-sm"
                          style={{ fontFamily: "Manrope, sans-serif" }}
                        >
                          {comment.answer}
                        </p>
                        {comment.answerDate && (
                          <div
                            className="text-xs text-gray-500 mt-2"
                            style={{ fontFamily: "Manrope, sans-serif" }}
                          >
                            {new Date(comment.answerDate).toLocaleDateString(
                              "tr-TR",
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === comment.id && !comment.answer && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Cevabınızı yazın..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                      style={{ fontFamily: "Manrope, sans-serif" }}
                      rows={4}
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        style={{ fontFamily: "Metropolis, sans-serif" }}
                      >
                        İptal
                      </button>
                      <button
                        onClick={() => handleReply(comment.id)}
                        className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                        style={{
                          background:
                            "linear-gradient(90deg, #4C38A5 0%, #023E84 100%)",
                          fontFamily: "Metropolis, sans-serif",
                        }}
                      >
                        Cevabı Gönder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Metropolis, sans-serif" }}
            >
              ‹ Önceki
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded ${
                    page === currentPage
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  style={{ fontFamily: "Metropolis, sans-serif" }}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Metropolis, sans-serif" }}
            >
              Sonraki ›
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyPanel;
