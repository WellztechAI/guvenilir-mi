import React, { useState, useEffect } from 'react';
import { fetchAllCompanyVerifications, updateVerificationStatus } from '@/services/adminService';
import { CompanyVerification } from '@/types';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const AdminPanel = () => {
  const [verifications, setVerifications] = useState<CompanyVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<CompanyVerification | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Coupon modal state
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponText, setCouponText] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isSendingCoupons, setIsSendingCoupons] = useState(false);

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllCompanyVerifications();
      setVerifications(data);
    } catch (error) {
      console.error('Error loading verifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCouponsToAll = async () => {
    if (!couponText || !couponCode) {
      alert('Lütfen kupon bilgilerini doldurun');
      return;
    }

    setIsSendingCoupons(true);
    try {
      // Import dynamically to avoid circular dependencies
      const { fetchAllUsers } = await import('@/services/userService');
      const { addRewardToUserDocument } = await import('@/services/rewardService');
      
      // Get all users
      const users = await fetchAllUsers();
      console.log(`Sending coupons to ${users.length} users...`);

      // Send coupon to each user
      for (const user of users) {
        await addRewardToUserDocument(user.id, {
          date: new Date(),
          text: couponText,
          code: couponCode,
          isUsed: false,
        });
      }

      alert(`✅ ${users.length} kullanıcıya kupon gönderildi!`);
      setShowCouponModal(false);
      setCouponText('');
      setCouponCode('');
    } catch (error) {
      console.error('Error sending coupons:', error);
      alert('Kupon gönderilirken hata oluştu');
    } finally {
      setIsSendingCoupons(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    setIsUpdating(true);
    try {
      await updateVerificationStatus(id, status);
      // Reload verifications after update
      await loadVerifications();
      setSelectedVerification(null);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Durum güncellenirken bir hata oluştu');
    } finally {
      setIsUpdating(false);
    }
  };

  // Convert English status to Turkish
  const getStatusText = (status: string) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case 'approved':
        return 'Kabul Edildi';
      case 'rejected':
        return 'Reddedildi';
      case 'pending':
        return 'Beklemede';
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
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter verifications by status (case-insensitive)
  const pendingVerifications = verifications.filter(v => v.status?.toLowerCase() === 'pending');
  const approvedVerifications = verifications.filter(v => v.status?.toLowerCase() === 'approved');
  const rejectedVerifications = verifications.filter(v => v.status?.toLowerCase() === 'rejected');

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
            {new Date(verification.createdAt).toLocaleDateString('tr-TR')}
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
              İşletme başvurularını yönetin
            </p>
          </div>
          
          <button
            onClick={() => setShowCouponModal(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
          >
            Kupon Gönder
          </button>
        </div>

        {isLoading ? (
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
      </main>

      {/* Detail Modal */}
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
                  {new Date(selectedVerification.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => handleStatusUpdate(selectedVerification.id, 'approved')}
                disabled={isUpdating || selectedVerification.status === 'Approved'}
                className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Güncelleniyor...' : 'Kabul Et'}
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedVerification.id, 'rejected')}
                disabled={isUpdating || selectedVerification.status === 'Rejected'}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Güncelleniyor...' : 'Reddet'}
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
