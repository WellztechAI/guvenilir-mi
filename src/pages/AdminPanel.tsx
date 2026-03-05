import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllCompanyVerifications,
  updateVerificationStatus,
  fetchCommentsByStatus,
  approveComment,
  rejectComment,
  deleteComment
} from '@/services/adminService';
import { CompanyVerification, Comment } from '@/types';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Building2, MessageSquare, Gift, Star, Calendar, User } from 'lucide-react';

type TabType = 'verifications' | 'comments';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<TabType>('comments');

  // Verification state
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState<CompanyVerification[]>([]);
  const [isLoadingVerifications, setIsLoadingVerifications] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<CompanyVerification | null>(null);
  const [isUpdatingVerification, setIsUpdatingVerification] = useState(false);

  // Comments state
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [approvedComments, setApprovedComments] = useState<Comment[]>([]);
  const [rejectedComments, setRejectedComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);

  // Coupon modal state
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponText, setCouponText] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isSendingCoupons, setIsSendingCoupons] = useState(false);

  useEffect(() => {
    if (activeTab === 'verifications') {
      loadVerifications();
    } else if (activeTab === 'comments') {
      loadComments();
    }
  }, [activeTab]);

  // ============================================
  // Verification Functions
  // ============================================

  const loadVerifications = async () => {
    setIsLoadingVerifications(true);
    try {
      const data = await fetchAllCompanyVerifications('all');
      setVerifications(data);
    } catch (error) {
      console.error('Error loading verifications:', error);
    } finally {
      setIsLoadingVerifications(false);
    }
  };

  const handleVerificationStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    setIsUpdatingVerification(true);
    try {
      await updateVerificationStatus(id, status);
      await loadVerifications();
      setSelectedVerification(null);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Durum güncellenirken bir hata oluştu');
    } finally {
      setIsUpdatingVerification(false);
    }
  };

  // ============================================
  // Comment Functions
  // ============================================

  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const [pending, approved, rejected] = await Promise.all([
        fetchCommentsByStatus('pending'),
        fetchCommentsByStatus('approved', 20),
        fetchCommentsByStatus('rejected', 20),
      ]);
      setPendingComments(pending);
      setApprovedComments(approved);
      setRejectedComments(rejected);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleCommentAction = async (
    action: () => Promise<void>,
    commentId: string,
    successMsg: string,
    errorMsg: string
  ) => {
    setIsUpdatingComment(true);
    try {
      await action();
      // Close modal and remove from UI immediately on success
      setSelectedComment(null);
      setPendingComments(prev => prev.filter(c => c.id !== commentId));
      // Refresh list in background — don't block or show error if this fails
      loadComments().catch(err => console.warn('List refresh failed after action:', err));
    } catch (error) {
      console.error(errorMsg, error);
      alert(errorMsg);
    } finally {
      setIsUpdatingComment(false);
    }
  };

  const handleApproveComment = (commentId: string) =>
    handleCommentAction(
      () => approveComment(commentId),
      commentId,
      'Yorum onaylandı ✅',
      'Yorum onaylanırken bir hata oluştu. Lütfen tekrar deneyin.'
    );

  const handleRejectComment = (commentId: string) =>
    handleCommentAction(
      () => rejectComment(commentId),
      commentId,
      'Yorum reddedildi',
      'Yorum reddedilirken bir hata oluştu. Lütfen tekrar deneyin.'
    );

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;
    handleCommentAction(
      () => deleteComment(commentId),
      commentId,
      'Yorum silindi',
      'Yorum silinirken bir hata oluştu. Lütfen tekrar deneyin.'
    );
  };

  // ============================================
  // Coupon Functions
  // ============================================

  // TODO: Re-enable when userService and rewardService are implemented
  // const handleSendCouponsToAll = async () => {
  //   if (!couponText || !couponCode) {
  //     alert('Lütfen kupon bilgilerini doldurun');
  //     return;
  //   }

  //   setIsSendingCoupons(true);
  //   try {
  //     const { fetchAllUsers } = await import('@/services/userService');
  //     const { addRewardToUserDocument } = await import('@/services/rewardService');

  //     const users = await fetchAllUsers();
  //     console.log(`Sending coupons to ${users.length} users...`);

  //     for (const user of users) {
  //       await addRewardToUserDocument(user.id, {
  //         date: new Date(),
  //         text: couponText,
  //         code: couponCode,
  //         isUsed: false,
  //       });
  //     }

  //     alert(`✅ ${users.length} kullanıcıya kupon gönderildi!`);
  //     setShowCouponModal(false);
  //     setCouponText('');
  //     setCouponCode('');
  //   } catch (error) {
  //     console.error('Error sending coupons:', error);
  //     alert('Kupon gönderilirken hata oluştu');
  //   } finally {
  //     setIsSendingCoupons(false);
  //   }
  // };
  const handleSendCouponsToAll = async () => {
    alert('Bu özellik henüz aktif değil');
  };

  // ============================================
  // Helper Functions
  // ============================================

  const getStatusText = (status: string) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case 'approved':
        return 'Kabul Edildi';
      case 'rejected':
        return 'Reddedildi';
      case 'pending':
        return 'Beklemede';
      case 'deleted':
        return 'Silindi';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'deleted':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter verifications by status
  const pendingVerifications = verifications.filter(v => v.status?.toLowerCase() === 'pending');
  const approvedVerifications = verifications.filter(v => v.status?.toLowerCase() === 'approved');
  const rejectedVerifications = verifications.filter(v => v.status?.toLowerCase() === 'rejected');

  // ============================================
  // Render Functions
  // ============================================

  const renderVerificationCard = (verification: CompanyVerification) => (
    <div
      key={verification.id}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-[#202023] mb-2">
            {verification.requesterName}
          </h3>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Ünvan:</span> {verification.requesterTitle}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">E-posta:</span> {verification.requesterCompanyEmail}
          </p>
          {verification.requesterPhoneNumber && (
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Telefon:</span> {verification.requesterPhoneNumber}
            </p>
          )}
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Panel Kullanıcı Adı:</span> {verification.panelUserName}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(verification.status)}`}>
            {getStatusText(verification.status)}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(verification.createdAt)}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <button
          onClick={() => setSelectedVerification(verification)}
          className="text-purple-600 hover:text-purple-700 font-medium text-sm"
        >
          Detayları Görüntüle →
        </button>
      </div>
    </div>
  );

  const renderCommentCard = (comment: Comment) => (
    <div
      key={comment.id}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
            {comment.authorName?.substring(0, 2).toUpperCase() || 'AN'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[#202023]">
                {comment.authorName}
              </h3>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={star <= comment.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {comment.companyName} • {formatDate(comment.date)}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(comment.status)}`}>
          {getStatusText(comment.status)}
        </span>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {comment.message}
      </p>

      {comment.productName && (
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Ürün:</span> {comment.productName}
        </p>
      )}

      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => setSelectedComment(comment)}
          className="text-purple-600 hover:text-purple-700 font-medium text-sm"
        >
          Detayları Görüntüle
        </button>
        {comment.status === 'pending' && (
          <>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleApproveComment(comment.id)}
              disabled={isUpdatingComment}
              className="text-green-600 hover:text-green-700 font-medium text-sm disabled:opacity-50"
            >
              Onayla
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleRejectComment(comment.id)}
              disabled={isUpdatingComment}
              className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50"
            >
              Reddet
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white flex flex-col overflow-hidden items-center pb-24 rounded-[32px] min-h-screen">
      <Header />

      <main className="w-full max-w-[1200px] px-4 mt-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#202023] mb-2">
              Admin Paneli
            </h1>
            <p className="text-gray-600">
              Yorumları ve işletme başvurularını yönetin
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/blog-editor')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Blog Yaz (SEO)
            </button>
            <button
              onClick={() => setShowCouponModal(true)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
            >
              Kupon Gönder
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold text-lg transition-colors relative ${activeTab === 'comments'
              ? 'text-purple-600 border-b-2 border-purple-600 -mb-[2px]'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <MessageSquare size={22} />
            Yorum Moderasyonu
            {pendingComments.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {pendingComments.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold text-lg transition-colors relative ${activeTab === 'verifications'
              ? 'text-purple-600 border-b-2 border-purple-600 -mb-[2px]'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Building2 size={22} />
            İşletme Başvuruları
            {pendingVerifications.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                {pendingVerifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Comments Tab Content */}
        {activeTab === 'comments' && (
          <>
            {isLoadingComments ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600">Yorumlar yükleniyor...</p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Pending Comments */}
                <section>
                  <div className="flex items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#202023]">
                      Onay Bekleyen Yorumlar
                    </h2>
                    <span className="ml-3 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                      {pendingComments.length}
                    </span>
                  </div>
                  {pendingComments.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-500">Onay bekleyen yorum yok</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {pendingComments.map(renderCommentCard)}
                    </div>
                  )}
                </section>

                {/* Approved Comments */}
                <section>
                  <div className="flex items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#202023]">
                      Onaylanan Yorumlar
                    </h2>
                    <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {approvedComments.length}
                    </span>
                  </div>
                  {approvedComments.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-500">Onaylanan yorum yok</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {approvedComments.slice(0, 6).map(renderCommentCard)}
                    </div>
                  )}
                </section>

                {/* Rejected Comments */}
                <section>
                  <div className="flex items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#202023]">
                      Reddedilen Yorumlar
                    </h2>
                    <span className="ml-3 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                      {rejectedComments.length}
                    </span>
                  </div>
                  {rejectedComments.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-500">Reddedilen yorum yok</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {rejectedComments.slice(0, 6).map(renderCommentCard)}
                    </div>
                  )}
                </section>
              </div>
            )}
          </>
        )}

        {/* Verifications Tab Content */}
        {activeTab === 'verifications' && (
          <>
            {isLoadingVerifications ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600">Başvurular yükleniyor...</p>
              </div>
            ) : verifications.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg">Henüz başvuru bulunmuyor</p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Pending Section */}
                <section>
                  <div className="flex items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#202023]">
                      Bekleyenler
                    </h2>
                    <span className="ml-3 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                      {pendingVerifications.length}
                    </span>
                  </div>
                  {pendingVerifications.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-500">Bekleyen başvuru yok</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {pendingVerifications.map(renderVerificationCard)}
                    </div>
                  )}
                </section>

                {/* Approved Section */}
                <section>
                  <div className="flex items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#202023]">
                      Kabul Edilenler
                    </h2>
                    <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {approvedVerifications.length}
                    </span>
                  </div>
                  {approvedVerifications.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-500">Kabul edilen başvuru yok</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {approvedVerifications.map(renderVerificationCard)}
                    </div>
                  )}
                </section>

                {/* Rejected Section */}
                <section>
                  <div className="flex items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#202023]">
                      Reddedilenler
                    </h2>
                    <span className="ml-3 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                      {rejectedVerifications.length}
                    </span>
                  </div>
                  {rejectedVerifications.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-500">Reddedilen başvuru yok</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {rejectedVerifications.map(renderVerificationCard)}
                    </div>
                  )}
                </section>
              </div>
            )}
          </>
        )}
      </main>

      {/* Comment Detail Modal */}
      {selectedComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-[#202023]">
                Yorum Detayları
              </h2>
              <button
                onClick={() => setSelectedComment(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {selectedComment.authorName?.substring(0, 2).toUpperCase() || 'AN'}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedComment.authorName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className={star <= selectedComment.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-gray-500">({selectedComment.rating}/5)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <Building2 size={14} className="inline mr-1" />
                    Şirket
                  </label>
                  <p className="text-gray-900">{selectedComment.companyName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    <Calendar size={14} className="inline mr-1" />
                    Tarih
                  </label>
                  <p className="text-gray-900">{formatDate(selectedComment.date)}</p>
                </div>
              </div>

              {selectedComment.productName && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Ürün/Hizmet
                  </label>
                  <p className="text-gray-900">{selectedComment.productName}</p>
                </div>
              )}

              {selectedComment.contactMethod && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    İletişim Yöntemi
                  </label>
                  <p className="text-gray-900 capitalize">{selectedComment.contactMethod}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Yorum
                </label>
                <p className="text-gray-900 bg-gray-50 rounded-lg p-4">{selectedComment.message}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Durum
                </label>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(selectedComment.status)}`}>
                  {getStatusText(selectedComment.status)}
                </span>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              {selectedComment.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApproveComment(selectedComment.id)}
                    disabled={isUpdatingComment}
                    className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingComment ? 'İşleniyor...' : 'Onayla'}
                  </button>
                  <button
                    onClick={() => handleRejectComment(selectedComment.id)}
                    disabled={isUpdatingComment}
                    className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingComment ? 'İşleniyor...' : 'Reddet'}
                  </button>
                </>
              )}
              <button
                onClick={() => handleDeleteComment(selectedComment.id)}
                disabled={isUpdatingComment}
                className="py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Detail Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-[#202023]">
                Başvuru Detayları
              </h2>
              <button
                onClick={() => setSelectedVerification(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başvuran Adı
                </label>
                <p className="text-gray-900">{selectedVerification.requesterName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ünvan
                </label>
                <p className="text-gray-900">{selectedVerification.requesterTitle}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <p className="text-gray-900">{selectedVerification.requesterCompanyEmail}</p>
              </div>

              {selectedVerification.requesterPhoneNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <p className="text-gray-900">{selectedVerification.requesterPhoneNumber}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Panel Kullanıcı Adı
                </label>
                <p className="text-gray-900">{selectedVerification.panelUserName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mernis No
                </label>
                <p className="text-gray-900">{selectedVerification.mernisNo}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adres
                </label>
                <p className="text-gray-900">{selectedVerification.address}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Şehir
                  </label>
                  <p className="text-gray-900">{selectedVerification.city}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İlçe
                  </label>
                  <p className="text-gray-900">{selectedVerification.district}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Posta Kodu
                  </label>
                  <p className="text-gray-900">{selectedVerification.postalCode}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Üyelik Tipi
                </label>
                <p className="text-gray-900">{selectedVerification.membership}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durum
                </label>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(selectedVerification.status)}`}>
                  {getStatusText(selectedVerification.status)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başvuru Tarihi
                </label>
                <p className="text-gray-900">
                  {formatDate(selectedVerification.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => handleVerificationStatusUpdate(selectedVerification.id, 'approved')}
                disabled={isUpdatingVerification || selectedVerification.status?.toLowerCase() === 'approved'}
                className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingVerification ? 'Güncelleniyor...' : 'Kabul Et'}
              </button>
              <button
                onClick={() => handleVerificationStatusUpdate(selectedVerification.id, 'rejected')}
                disabled={isUpdatingVerification || selectedVerification.status?.toLowerCase() === 'rejected'}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingVerification ? 'Güncelleniyor...' : 'Reddet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-[#202023]">
                Kupon Gönder
              </h2>
              <button
                onClick={() => setShowCouponModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                disabled={isSendingCoupons}
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kupon Açıklaması
                </label>
                <input
                  type="text"
                  value={couponText}
                  onChange={(e) => setCouponText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Örn: 10% İndirim Kuponu"
                  disabled={isSendingCoupons}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kupon Kodu
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Örn: DISCOUNT10"
                  disabled={isSendingCoupons}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowCouponModal(false)}
                disabled={isSendingCoupons}
                className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                İptal
              </button>
              <button
                onClick={handleSendCouponsToAll}
                disabled={isSendingCoupons || !couponText || !couponCode}
                className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingCoupons ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminPanel;
