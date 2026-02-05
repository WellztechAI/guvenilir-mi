import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { BrandHero } from "@/components/BrandHero";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewFilters } from "@/components/ReviewFilters";
import { ReviewItem } from "@/components/ReviewItem";
import { Pagination } from "@/components/Pagination";
import { Footer } from "@/components/Footer";
import { fetchCompany, fetchCompanyBySlug } from "@/services/companyService";
import {
  fetchCommentsByCompanyIdPaginated,
  fetchCommentsByCompanyId,
  createComment,
  likeComment,
  PaginationInfo,
} from "@/services/commentService";
import { useAuthStore } from "@/store/authStore";
import { Company, Comment } from "@/types";

// Helper to check if a string is a UUID
const isUUID = (str: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// Contact method options
const CONTACT_METHODS = [
  { value: "phone", label: "Telefon" },
  { value: "email", label: "E-posta" },
  { value: "website", label: "Web Sitesi" },
  { value: "in_person", label: "Yüz Yüze" },
  { value: "social_media", label: "Sosyal Medya" },
];

const CompanyDetail = () => {
  const { id: companyIdentifier } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [company, setCompany] = useState<Company | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [myComment, setMyComment] = useState<Comment | undefined>(undefined);
  const [featuredComments, setFeaturedComments] = useState<Comment[]>([]);
  const [otherComments, setOtherComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [isFiltering, setIsFiltering] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    total: 0,
    limit: 10,
    offset: 0,
    page: 1,
    totalPages: 0,
  });
  const ITEMS_PER_PAGE = 10;

  // Comment form states
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newCommentRating, setNewCommentRating] = useState(5);
  const [newCommentMessage, setNewCommentMessage] = useState("");
  const [newCommentProductName, setNewCommentProductName] = useState("");
  const [newCommentContactMethod, setNewCommentContactMethod] =
    useState("website");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch company data
  useEffect(() => {
    const loadCompany = async () => {
      if (!companyIdentifier) {
        console.error("No company identifier provided");
        setError("Şirket bulunamadı");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Loading company with identifier:", companyIdentifier);
        console.log("Is UUID?", isUUID(companyIdentifier));

        setIsLoading(true);
        const companyData = isUUID(companyIdentifier)
          ? await fetchCompany(companyIdentifier)
          : await fetchCompanyBySlug(companyIdentifier);

        console.log("Company data received:", companyData);

        if (!companyData) {
          console.error("No company data returned");
          setError("Şirket bulunamadı");
          setIsLoading(false);
          return;
        }

        setCompany(companyData);
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Şirket bilgileri yüklenirken bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    loadCompany();
  }, [companyIdentifier]);

  // Fetch comments with filters and pagination
  const fetchComments = useCallback(
    async (page: number = currentPage) => {
      if (!company?.id) return;

      try {
        setIsFiltering(true);
        const result = await fetchCommentsByCompanyIdPaginated(company.id, {
          status: "approved",
          rating: selectedRating ? parseInt(selectedRating) : undefined,
          search: searchTerm || undefined,
          sortBy: "created_at",
          sortOrder: sortOrder,
          limit: ITEMS_PER_PAGE,
          page: page,
        });

        setComments(result.comments);
        setPaginationInfo(result.pagination);

        // Separate user's comment - check both approved comments and fetch user's own comment separately
        let myReview: Comment | undefined;
        let remainingComments = result.comments;
        
        if (user) {
          // First check if user's comment is in the approved list
          myReview = result.comments.find(
            (c: Comment) => c.authorId === user.id,
          );
          
          // If not found in approved, fetch all user's comments for this company (including pending)
          if (!myReview) {
            try {
              const allUserComments = await fetchCommentsByCompanyId(company.id, {
                status: undefined, // Don't filter by status to get pending comments too
              });
              myReview = allUserComments.find((c: Comment) => c.authorId === user.id);
            } catch (error) {
              console.error('Error fetching user comments:', error);
            }
          }
          
          setMyComment(myReview);
          remainingComments = result.comments.filter((c: Comment) => c.id !== myReview?.id);
        } else {
          setMyComment(undefined);
        }

        // Get top 2 comments by likes for featured section
        const sortedByLikes = [...remainingComments].sort((a, b) => b.likesCount - a.likesCount);
        setFeaturedComments(sortedByLikes.slice(0, 2));
        setOtherComments(remainingComments);
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setIsFiltering(false);
      }
    },
    [company?.id, selectedRating, searchTerm, sortOrder, user, currentPage],
  );

  // Fetch comments when company or filters change
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchComments(page);
    // Scroll to top of reviews section
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    setCurrentPage(1);
    fetchComments(1);
  };

  // Handle rating filter change
  const handleRatingChange = (rating: string) => {
    setSelectedRating(rating);
    setCurrentPage(1);
  };

  // Handle sort order change
  const handleSortChange = (order: "ASC" | "DESC") => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  // Handle topic/keyword click
  const handleTopicClick = (topic: string) => {
    setSearchTerm(topic);
    setCurrentPage(1);
    fetchComments(1);
  };

  // Handle like comment
  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      alert("Yorum beğenmek için giriş yapmalısınız.");
      return;
    }

    try {
      await likeComment(commentId, user.id);
      // Refresh comments to update like count
      fetchComments();
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setSubmitError("Yorum yapmak için giriş yapmalısınız.");
      return;
    }

    if (!company) {
      setSubmitError("Şirket bilgisi bulunamadı.");
      return;
    }

    if (!newCommentMessage.trim()) {
      setSubmitError("Yorum mesajı boş olamaz.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await createComment(
        user.id,
        company.id,
        newCommentRating,
        newCommentMessage,
        newCommentProductName || undefined,
        newCommentContactMethod,
      );

      // Reset form
      setNewCommentRating(5);
      setNewCommentMessage("");
      setNewCommentProductName("");
      setNewCommentContactMethod("website");
      setShowCommentForm(false);

      // Refresh comments
      fetchComments();

      alert(
        "Yorumunuz başarıyla gönderildi. Onaylandıktan sonra yayınlanacaktır.",
      );
    } catch (err) {
      console.error("Error submitting comment:", err);
      setSubmitError("Yorum gönderilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date helper
  const formatDate = (date: Date | string | undefined | null) => {
    if (!date) return "Tarih bilinmiyor";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Tarih bilinmiyor";
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(dateObj);
  };

  const midIndex = Math.ceil(otherComments.length / 2);
  const leftColumnComments = otherComments.slice(0, midIndex);
  const rightColumnComments = otherComments.slice(midIndex);

  return (
    <div className="bg-white flex flex-col overflow-hidden items-center pb-24 rounded-[32px]">
      <Header />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Şirket bilgileri yükleniyor...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Hata</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      ) : company ? (
        <main className="w-full max-w-[1357px] px-4">
          <BrandHero company={company} />

          {/* Comment Form Modal */}
          {showCommentForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {company.name} Hakkında Yorum Yaz
                  </h2>
                  <button
                    onClick={() => setShowCommentForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmitComment}>
                  {/* Rating */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Puanınız
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewCommentRating(star)}
                          className="focus:outline-none"
                        >
                          <svg
                            className="w-8 h-8"
                            fill={
                              star <= newCommentRating ? "#FFD700" : "#E5E7EB"
                            }
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ürün/Hizmet Adı (Opsiyonel)
                    </label>
                    <input
                      type="text"
                      value={newCommentProductName}
                      onChange={(e) => setNewCommentProductName(e.target.value)}
                      placeholder="Hangi ürün veya hizmeti değerlendiriyorsunuz?"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Contact Method */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İletişim Yöntemi
                    </label>
                    <select
                      value={newCommentContactMethod}
                      onChange={(e) =>
                        setNewCommentContactMethod(e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {CONTACT_METHODS.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yorumunuz
                    </label>
                    <textarea
                      value={newCommentMessage}
                      onChange={(e) => setNewCommentMessage(e.target.value)}
                      placeholder="Deneyiminizi paylaşın..."
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  {submitError && (
                    <p className="text-red-500 text-sm mb-4">{submitError}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCommentForm(false)}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? "Gönderiliyor..." : "Yorum Gönder"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* User Review Section */}
          {myComment && (
            <section className="mt-9">
              <h2 className="text-[rgba(55,55,55,1)] text-[28px] font-semibold leading-[40px] tracking-[-0.02em] text-left max-md:max-w-full" style={{ fontFamily: 'Manrope' }}>
                Marka Hakkında Yazdığınız Yorum
              </h2>
              <div className="bg-[rgba(253,253,253,1)] shadow-[0px_6px_10px_rgba(177,177,177,0.08)] border border flex flex-col items-stretch text-xs font-medium mr-[43px] mt-[5px] py-[23px] rounded-[26px] border-solid max-md:max-w-full max-md:mr-2.5">
                <div className="flex w-full flex-col text-[#6B6B6E] px-[30px] max-md:max-w-full max-md:px-5">
                  <div className="flex items-stretch gap-[5px] text-xl text-[#202023] font-semibold leading-[1.4]">
                    <img
                      src={
                        myComment.authorAvatar ||
                        "https://api.builder.io/api/v1/image/assets/TEMP/ed4d506d869550e63301cda115d2a37f3f3d8102?placeholderIfAbsent=true"
                      }
                      alt="User avatar"
                      className="aspect-[1] object-cover w-[41px] shrink-0 rounded-[50%]"
                    />
                    <div className="text-[#202023] basis-auto my-auto">
                      {myComment.authorName}
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill={
                              star <= myComment.rating ? "#FFD700" : "#E5E7EB"
                            }
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-[#6B6B6E] mt-[11px]">
                    {formatDate(myComment.date)}
                  </div>
                  <p className="text-[rgba(65,65,65,1)] font-normal leading-[18px] tracking-[-0.48px] self-stretch mt-[20px] max-md:max-w-full">
                    {myComment.message}
                  </p>
                  <div className="flex items-stretch gap-2.5 text-[9px] mt-[29px]">
                    <div className="text-[#6B6B6E] my-auto">
                      Yararlı{" "}
                      <span className="font-semibold">
                        {myComment.likesCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Featured Reviews Section */}
          <section className="mt-[30px]">
            <h2 className="text-[rgba(55,55,55,1)] text-[28px] font-semibold leading-[40px] tracking-[-0.02em] text-left ml-0 max-md:ml-0" style={{ fontFamily: 'Manrope' }}>
              Öne Çıkan Yorumlar
            </h2>
            <div className="mr-[43px] mt-[30px] max-md:max-w-full max-md:mr-2.5">
              <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                {featuredComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="w-6/12 max-md:w-full max-md:ml-0"
                  >
                    <ReviewCard
                      author={comment.authorName}
                      date={formatDate(comment.date)}
                      rating={comment.rating}
                      content={comment.message}
                      helpful={comment.likesCount}
                      avatar={
                        comment.authorAvatar ||
                        "https://api.builder.io/api/v1/image/assets/TEMP/ed4d506d869550e63301cda115d2a37f3f3d8102?placeholderIfAbsent=true"
                      }
                      onLike={() => handleLikeComment(comment.id)}
                    />
                  </div>
                ))}
                {featuredComments.length === 0 && !isFiltering && (
                  <div className="w-full text-center text-gray-500 py-10">
                    Henüz yorum yapılmamış. İlk yorumu sen yap!
                  </div>
                )}
                {isFiltering && (
                  <div className="w-full text-center text-gray-500 py-10">
                    Yorumlar yükleniyor...
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* All Reviews Section */}
          <section className="mt-[30px] max-md:max-w-full">
            <h2 className="text-[rgba(55,55,55,1)] text-[28px] font-semibold leading-[40px] tracking-[-0.02em] text-left max-md:max-w-full mb-[30px]" style={{ fontFamily: 'Manrope' }}>
              Tüm Yorumlar
            </h2>
            <div className="w-full max-md:max-w-full">
              <div className="max-md:max-w-full max-md:mr-2.5">
                <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                  <div className="w-6/12 max-md:w-full max-md:ml-0">
                    <ReviewFilters
                      searchTerm={searchTerm}
                      selectedRating={selectedRating}
                      onSearchChange={setSearchTerm}
                      onRatingChange={handleRatingChange}
                      onSearchSubmit={handleSearchSubmit}
                    />
                  </div>
                  <div className="w-6/12 ml-5 max-md:w-full max-md:ml-0">
                    <div className="w-full mt-[38px] max-md:max-w-full max-md:mt-10">
                      <div className="flex w-full flex-col items-stretch text-xs text-black font-medium text-left tracking-[-0.48px] leading-loose max-md:max-w-full max-md:pl-5">
                        <div>Öne Çıkan Konular</div>
                        <div className="flex w-full items-stretch gap-0.5 mt-[7px] flex-wrap">
                          {[
                            "hizmet",
                            "kredi kartı",
                            "dolandırıcılık",
                            "öneri",
                            "teşekkür",
                            "şikayet",
                          ].map((topic) => (
                            <button
                              key={topic}
                              onClick={() => handleTopicClick(topic)}
                              className={`flex items-center gap-1.5 justify-center px-2.5 py-1 rounded-md transition-colors ${
                                searchTerm === topic
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-[rgba(0,0,0,0.04)] hover:bg-[rgba(0,0,0,0.08)]"
                              }`}
                            >
                              <span className="self-stretch my-auto">
                                {topic}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sort Buttons - Aligned Right */}
                      <div className="w-full flex justify-end mt-[74px]">
                        <div className="flex gap-[-1px] rounded-lg whitespace-nowrap text-sm font-normal leading-none">
                          <button
                            onClick={() => handleSortChange("ASC")}
                            className={`justify-center items-center border flex gap-1.5 overflow-hidden px-3 py-2.5 rounded-[8px_0_0_8px] border-solid border-[#D9E1E7] transition-colors ${
                              sortOrder === "ASC"
                                ? "text-[#17181A] bg-white"
                                : "text-[#99B2C6] bg-[#F1F5F7] hover:bg-white hover:text-[#17181A]"
                            }`}
                          >
                            <span className="self-stretch my-auto">
                              En Eski
                            </span>
                          </button>
                          <button
                            onClick={() => handleSortChange("DESC")}
                            className={`justify-center items-center border flex gap-1.5 overflow-hidden px-3 py-2.5 border-solid border-[#D9E1E7] border-l-0 rounded-[0_8px_8px_0] transition-colors ${
                              sortOrder === "DESC"
                                ? "text-[#17181A] bg-white"
                                : "text-[#99B2C6] bg-[#F1F5F7] hover:bg-white hover:text-[#17181A]"
                            }`}
                          >
                            <span className="self-stretch my-auto">
                              En Yeni
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              {isFiltering ? (
                <div className="mt-[58px] flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : otherComments.length > 0 ? (
                <div className="mt-[58px] max-md:max-w-full max-md:mt-10">
                  <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                    <div className="w-6/12 max-md:w-full max-md:ml-0">
                      <div className="flex w-full flex-col items-stretch mt-1.5 max-md:max-w-full space-y-8">
                        {leftColumnComments.map((review) => (
                          <ReviewItem
                            key={review.id}
                            review={review}
                            onLike={handleLikeComment}
                            companyName={company?.name}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="w-6/12 ml-5 max-md:w-full max-md:ml-0">
                      <div className="w-full">
                        <div className="flex w-full flex-col items-stretch mt-1.5 max-md:max-w-full space-y-8">
                          {rightColumnComments.map((review) => (
                            <ReviewItem
                              key={review.id}
                              review={review}
                              onLike={handleLikeComment}
                              companyName={company?.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-[58px] text-center text-gray-500">
                  {searchTerm || selectedRating
                    ? "Filtrelere uygun yorum bulunamadı."
                    : "Henüz yorum yapılmamış."}
                </div>
              )}
            </div>
          </section>

          <Pagination
            currentPage={currentPage}
            totalPages={paginationInfo.totalPages}
            totalItems={paginationInfo.total}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </main>
      ) : null}

      <Footer />
    </div>
  );
};

export default CompanyDetail;
