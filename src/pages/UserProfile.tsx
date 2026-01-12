import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { signOut } from '@/services/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { fetchCompaniesByIds } from '@/services/companyService';
import { fetchCommentsByAuthorId } from '@/services/commentService';
import { fetchRewardsByUserId } from '@/services/rewardService';
import { fetchNotificationsByUserId, markNotificationAsRead } from '@/services/notificationService';
import { Company, Comment, Reward, Noti } from '@/types';

export const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, firebaseUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'info' | 'favorites' | 'comments' | 'notifications' | 'rewards'>('info');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(true);
  const [favoriteCompanies, setFavoriteCompanies] = useState<Company[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentFilter, setCommentFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [userRewards, setUserRewards] = useState<Reward[]>([]);
  const [isLoadingRewards, setIsLoadingRewards] = useState(false);
  const [userNotifications, setUserNotifications] = useState<Noti[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  // Check URL parameter for tab on mount
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['info', 'favorites', 'comments', 'notifications', 'rewards'].includes(tabParam)) {
      setActiveTab(tabParam as 'info' | 'favorites' | 'comments' | 'notifications' | 'rewards');
    }
  }, [searchParams]);

  // Fetch favorite companies when favorites tab is active
  useEffect(() => {
    const loadFavoriteCompanies = async () => {
      if (activeTab === 'favorites' && user?.favouriteCompanies && user.favouriteCompanies.length > 0) {
        setIsLoadingFavorites(true);
        try {
          const companies = await fetchCompaniesByIds(user.favouriteCompanies);
          setFavoriteCompanies(companies);
        } catch (error) {
          console.error('Error loading favorite companies:', error);
        } finally {
          setIsLoadingFavorites(false);
        }
      }
    };

    loadFavoriteCompanies();
  }, [activeTab, user?.favouriteCompanies]);

  // Fetch user comments when comments tab is active
  useEffect(() => {
    const loadUserComments = async () => {
      if (activeTab === 'comments' && user?.id) {
        setIsLoadingComments(true);
        try {
          const comments = await fetchCommentsByAuthorId(user.id);
          setUserComments(comments);
        } catch (error) {
          console.error('Error loading user comments:', error);
        } finally {
          setIsLoadingComments(false);
        }
      }
    };

    loadUserComments();
  }, [activeTab, user?.id]);

  // Fetch user rewards when rewards tab is active
  useEffect(() => {
    const loadUserRewards = async () => {
      if (activeTab === 'rewards' && user?.id) {
        setIsLoadingRewards(true);
        try {
          console.log('Loading rewards for user:', user.id);
          const rewards = await fetchRewardsByUserId(user.id);
          console.log('Rewards loaded:', rewards);
          setUserRewards(rewards);
        } catch (error) {
          console.error('Error loading user rewards:', error);
          console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
        } finally {
          setIsLoadingRewards(false);
        }
      }
    };

    loadUserRewards();
  }, [activeTab, user?.id]);

  // Fetch user notifications when notifications tab is active
  useEffect(() => {
    const loadUserNotifications = async () => {
      if (activeTab === 'notifications' && user?.id) {
        setIsLoadingNotifications(true);
        try {
          console.log('Loading notifications for user:', user.id);
          const notifications = await fetchNotificationsByUserId(user.id);
          console.log('Notifications loaded:', notifications);
          setUserNotifications(notifications);
        } catch (error) {
          console.error('Error loading user notifications:', error);
          console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
        } finally {
          setIsLoadingNotifications(false);
        }
      }
    };

    loadUserNotifications();
  }, [activeTab, user?.id]);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user?.id) return;
    
    try {
      await markNotificationAsRead(user.id, notificationId);
      // Update local state
      setUserNotifications(prev =>
        prev.map(noti =>
          noti.id === notificationId ? { ...noti, isRead: true } : noti
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Filter comments based on selected filter
  const filteredComments = userComments.filter(comment => {
    if (commentFilter === 'all') return true;
    return comment.status === commentFilter;
  });

  const displayedComments = filteredComments;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen" style={{
        background: 'linear-gradient(180deg, #4C38A5 0%, #E8E8F0 30%)',
      }}>
        {/* Header */}
        <div className="pt-20 pb-16 text-center">
          <h1 style={{
            fontFamily: 'Metropolis, sans-serif',
            fontWeight: 700,
            fontSize: '48px',
            lineHeight: '150%',
            color: '#FFFFFF',
          }}>
            Kullanıcı Paneli
          </h1>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-10 pb-20">
          <div className="flex gap-8">
            {/* Left Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Profilim Section - Collapsible */}
                <div className="mb-6">
                  <button
                    onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                    className="w-full flex items-center justify-between px-4 py-3 mb-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    style={{
                      fontFamily: 'Metropolis, sans-serif',
                      fontWeight: 500,
                      fontSize: '14px',
                    }}
                  >
                    <span>Profilim</span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform: isProfileExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Collapsible Profile Items */}
                  {isProfileExpanded && (
                    <div className="space-y-1">
                      <button
                        onClick={() => setActiveTab('info')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'info'
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        style={{
                          fontFamily: 'Metropolis, sans-serif',
                          fontWeight: activeTab === 'info' ? 600 : 500,
                          fontSize: '14px',
                        }}
                      >
                        Kullanıcı Bilgileri
                      </button>
                      <button
                        onClick={() => setActiveTab('favorites')}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'favorites'
                            ? 'bg-purple-100 text-purple-700'
                            : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        style={{
                          fontFamily: 'Metropolis, sans-serif',
                          fontWeight: activeTab === 'favorites' ? 600 : 500,
                          fontSize: '14px',
                        }}
                      >
                        Favori Markalarım
                      </button>
                    </div>
                  )}
                </div>

                {/* Other Menu Items */}
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'comments'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    style={{
                      fontFamily: 'Metropolis, sans-serif',
                      fontWeight: activeTab === 'comments' ? 600 : 500,
                      fontSize: '14px',
                    }}
                  >
                    Yorumlarım
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'notifications'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    style={{
                      fontFamily: 'Metropolis, sans-serif',
                      fontWeight: activeTab === 'notifications' ? 600 : 500,
                      fontSize: '14px',
                    }}
                  >
                    Bildirimlerim
                  </button>
                  <button
                    onClick={() => setActiveTab('rewards')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'rewards'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    style={{
                      fontFamily: 'Metropolis, sans-serif',
                      fontWeight: activeTab === 'rewards' ? 600 : 500,
                      fontSize: '14px',
                    }}
                  >
                    Ödüllerim
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1">
              {activeTab === 'info' && (
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h2 style={{
                    fontFamily: 'Metropolis, sans-serif',
                    fontWeight: 700,
                    fontSize: '32px',
                    lineHeight: '150%',
                    color: '#202023',
                    marginBottom: '32px',
                  }}>
                    Kullanıcı Bilgileri
                  </h2>

                  {/* Email Section */}
                  <div className="mb-8">
                    <label style={{
                      fontFamily: 'Metropolis, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#202023',
                      display: 'block',
                      marginBottom: '8px',
                    }}>
                      E-posta Adresi
                    </label>
                    <div className="flex items-center justify-between">
                      <span style={{
                        fontFamily: 'Metropolis, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        color: '#4C38A5',
                      }}>
                        {firebaseUser?.email || 'email@email.com'}
                      </span>
                      <button style={{
                        fontFamily: 'Metropolis, sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        color: '#4C38A5',
                        padding: '8px 16px',
                        border: '1px solid #4C38A5',
                        borderRadius: '8px',
                        background: 'transparent',
                      }}>
                        E-posta değiştir
                      </button>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="mb-8">
                    <label style={{
                      fontFamily: 'Metropolis, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#202023',
                      display: 'block',
                      marginBottom: '8px',
                    }}>
                      Şifre
                    </label>
                    <div className="flex items-center justify-between">
                      <span style={{
                        fontFamily: 'Metropolis, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        color: '#202023',
                      }}>
                        ••••••••••••••••
                      </span>
                      <button style={{
                        fontFamily: 'Metropolis, sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        color: '#4C38A5',
                        padding: '8px 16px',
                        border: '1px solid #4C38A5',
                        borderRadius: '8px',
                        background: 'transparent',
                      }}>
                        Şifre Değiştir
                      </button>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="mb-12 p-4 rounded-lg" style={{
                    backgroundColor: '#E8F4FD',
                    border: '1px solid #4C38A5',
                  }}>
                    <div className="flex items-start gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4C38A5" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <div>
                        <p style={{
                          fontFamily: 'Metropolis, sans-serif',
                          fontWeight: 600,
                          fontSize: '14px',
                          color: '#202023',
                          marginBottom: '4px',
                        }}>
                          Hesabınızı Güvenli Hale Getirin
                        </p>
                        <p style={{
                          fontFamily: 'Metropolis, sans-serif',
                          fontWeight: 400,
                          fontSize: '12px',
                          color: '#6B7280',
                          marginBottom: '8px',
                        }}>
                          İki faktörlü kimlik doğrulama, hesabınıza ekstra bir güvenlik katmanı ekler. Giriş yapmak için ek olarak 6 haneli bir kod girmeniz gerekecektir.
                        </p>
                        <button style={{
                          fontFamily: 'Metropolis, sans-serif',
                          fontWeight: 600,
                          fontSize: '14px',
                          color: '#FFFFFF',
                          padding: '8px 24px',
                          borderRadius: '8px',
                          background: '#4C38A5',
                          border: 'none',
                        }}>
                          Aktifleştir
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <h3 style={{
                    fontFamily: 'Metropolis, sans-serif',
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '150%',
                    color: '#202023',
                    marginBottom: '24px',
                  }}>
                    Kişisel Bilgiler
                  </h3>

                  {/* Avatar */}
                  <div className="mb-6">
                    <label style={{
                      fontFamily: 'Metropolis, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#202023',
                      display: 'block',
                      marginBottom: '12px',
                    }}>
                      Avatar
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center"
                        style={{
                          backgroundImage: user?.imageUrl ? `url(${user.imageUrl})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        {!user?.imageUrl && (
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        )}
                      </div>
                      <button style={{
                        fontFamily: 'Metropolis, sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        color: '#4C38A5',
                        padding: '8px 16px',
                        border: '1px solid #4C38A5',
                        borderRadius: '8px',
                        background: 'transparent',
                      }}>
                        Değiştir
                      </button>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label style={{
                        fontFamily: 'Metropolis, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#202023',
                        display: 'block',
                        marginBottom: '8px',
                      }}>
                        Adınız
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.userName?.split(' ')[0] || 'Alper'}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          fontFamily: 'Metropolis, sans-serif',
                          fontSize: '14px',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        fontFamily: 'Metropolis, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#202023',
                        display: 'block',
                        marginBottom: '8px',
                      }}>
                        Yılmaz
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.userName?.split(' ')[1] || 'Yılmaz'}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          fontFamily: 'Metropolis, sans-serif',
                          fontSize: '14px',
                        }}
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="mb-6">
                    <label style={{
                      fontFamily: 'Metropolis, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#202023',
                      display: 'block',
                      marginBottom: '8px',
                    }}>
                      Telefon Numaranız
                    </label>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg">
                        <span>🇺🇸</span>
                        <span style={{
                          fontFamily: 'Metropolis, sans-serif',
                          fontSize: '14px',
                        }}>+90</span>
                      </div>
                      <input
                        type="text"
                        defaultValue={user?.phoneNumber || '544 000 00 00'}
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          fontFamily: 'Metropolis, sans-serif',
                          fontSize: '14px',
                        }}
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div className="mb-6">
                    <label style={{
                      fontFamily: 'Metropolis, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#202023',
                      display: 'block',
                      marginBottom: '8px',
                    }}>
                      Ülkeniz
                    </label>
                    <select
                      defaultValue="Türkiye"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontFamily: 'Metropolis, sans-serif',
                        fontSize: '14px',
                      }}
                    >
                      <option>Türkiye</option>
                    </select>
                  </div>

                  {/* Communication Preferences */}
                  <div className="mb-8">
                    <label style={{
                      fontFamily: 'Metropolis, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#202023',
                      display: 'block',
                      marginBottom: '12px',
                    }}>
                      İletişim Tercihleri
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span style={{
                          fontFamily: 'Metropolis, sans-serif',
                          fontSize: '14px',
                          color: '#202023',
                        }}>
                          Eposta
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span style={{
                          fontFamily: 'Metropolis, sans-serif',
                          fontSize: '14px',
                          color: '#202023',
                        }}>
                          Telefon
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      style={{
                        fontFamily: 'Metropolis, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#FFFFFF',
                        padding: '12px 32px',
                        borderRadius: '8px',
                        background: '#EF4444',
                        border: 'none',
                      }}
                    >
                      {isLoggingOut ? 'Çıkış yapılıyor...' : 'Hesabımı Sil'}
                    </button>
                    <button
                      style={{
                        fontFamily: 'Metropolis, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#FFFFFF',
                        padding: '12px 32px',
                        borderRadius: '8px',
                        background: '#10B981',
                        border: 'none',
                      }}
                    >
                      Onayla
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h2 style={{
                    fontFamily: 'Metropolis, sans-serif',
                    fontWeight: 700,
                    fontSize: '32px',
                    color: '#202023',
                    marginBottom: '32px',
                  }}>
                    Favori Markalarım
                  </h2>

                  {isLoadingFavorites ? (
                    <p className="text-gray-500">Yükleniyor...</p>
                  ) : favoriteCompanies.length === 0 ? (
                    <p className="text-gray-500">Henüz favori markanız yok.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteCompanies.map((company) => (
                        <div
                          key={company.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => navigate(`/company/${company.id}`)}
                        >
                          {/* Company Logo */}
                          <div className="flex justify-center mb-4">
                            <div
                              className="w-20 h-20 rounded-full bg-black flex items-center justify-center overflow-hidden"
                              style={{
                                backgroundImage: company.imageUrl ? `url(${company.imageUrl})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              }}
                            >
                              {!company.imageUrl && (
                                <span style={{
                                  fontFamily: 'Metropolis, sans-serif',
                                  fontWeight: 700,
                                  fontSize: '24px',
                                  color: '#FFFFFF',
                                }}>
                                  {company.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Company Name */}
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <h3 style={{
                              fontFamily: 'Metropolis, sans-serif',
                              fontWeight: 600,
                              fontSize: '16px',
                              color: '#202023',
                              textAlign: 'center',
                            }}>
                              {company.name}
                            </h3>
                            {company.status === 'active' && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="#10B981">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>

                          {/* Rating */}
                          <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill={star <= Math.round(company.rating) ? '#FFD700' : '#E5E7EB'}
                                >
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ))}
                            </div>
                            <span style={{
                              fontFamily: 'Metropolis, sans-serif',
                              fontSize: '14px',
                              color: '#6B7280',
                            }}>
                              {company.rating.toFixed(1)} ({company.commentCount} Yorum)
                            </span>
                          </div>

                          {/* Description */}
                          <p style={{
                            fontFamily: 'Metropolis, sans-serif',
                            fontSize: '14px',
                            color: '#6B7280',
                            lineHeight: '1.5',
                            marginBottom: '16px',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}>
                            {company.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nibh justo, blandit eu consectetur sit amet, iaculis in velit.'}
                          </p>

                          {/* Tags and Favorite Button */}
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {company.sectors.slice(0, 2).map((sector, index) => (
                                <span
                                  key={index}
                                  style={{
                                    fontFamily: 'Metropolis, sans-serif',
                                    fontSize: '12px',
                                    color: '#202023',
                                    padding: '4px 12px',
                                    backgroundColor: '#F3F4F6',
                                    borderRadius: '16px',
                                  }}
                                >
                                  {sector}
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle unfavorite action here
                              }}
                              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="#10B981">
                                <path d="M5 5h14v14H5z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 style={{
                      fontFamily: 'Metropolis, sans-serif',
                      fontWeight: 700,
                      fontSize: '32px',
                      color: '#202023',
                    }}>
                      Diğer Yorumlarım
                    </h2>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCommentFilter('approved')}
                        style={{
                          fontFamily: 'Metropolis, sans-serif',
                          fontWeight: 600,
                          fontSize: '14px',
                          padding: '8px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: commentFilter === 'approved' ? '#10B981' : '#E5E7EB',
                          color: commentFilter === 'approved' ? '#FFFFFF' : '#6B7280',
                        }}
                      >
                        Onaylanan
                      </button>
                      <button
                        onClick={() => setCommentFilter('pending')}
                        style={{
                          fontFamily: 'Metropolis, sans-serif',
                          fontWeight: 600,
                          fontSize: '14px',
                          padding: '8px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: commentFilter === 'pending' ? '#6366F1' : '#E5E7EB',
                          color: commentFilter === 'pending' ? '#FFFFFF' : '#6B7280',
                        }}
                      >
                        İncelenen
                      </button>
                      <button
                        onClick={() => setCommentFilter('rejected')}
                        style={{
                          fontFamily: 'Metropolis, sans-serif',
                          fontWeight: 600,
                          fontSize: '14px',
                          padding: '8px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: commentFilter === 'rejected' ? '#F59E0B' : '#E5E7EB',
                          color: commentFilter === 'rejected' ? '#FFFFFF' : '#6B7280',
                        }}
                      >
                        Revize
                      </button>
                    </div>
                  </div>

                  {isLoadingComments ? (
                    <p className="text-gray-500">Yükleniyor...</p>
                  ) : displayedComments.length === 0 ? (
                    <p className="text-gray-500">Henüz yorum yapmadınız.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {displayedComments.map((comment) => (
                        <div
                          key={comment.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                          {/* User Info and Status Badge */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center"
                                style={{
                                  backgroundImage: comment.authorAvatar ? `url(${comment.authorAvatar})` : 'none',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }}
                              >
                                {!comment.authorAvatar && (
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <h3 style={{
                                  fontFamily: 'Metropolis, sans-serif',
                                  fontWeight: 600,
                                  fontSize: '16px',
                                  color: '#202023',
                                }}>
                                  {comment.authorName}
                                </h3>
                                <p style={{
                                  fontFamily: 'Metropolis, sans-serif',
                                  fontSize: '12px',
                                  color: '#6B7280',
                                }}>
                                  {comment.date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <span
                              style={{
                                fontFamily: 'Metropolis, sans-serif',
                                fontWeight: 600,
                                fontSize: '12px',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                backgroundColor:
                                  comment.status === 'approved' ? '#10B981' :
                                    comment.status === 'pending' ? '#6366F1' :
                                      '#F59E0B',
                                color: '#FFFFFF',
                              }}
                            >
                              {comment.status === 'approved' ? 'Onaylanma Kararı' :
                                comment.status === 'pending' ? 'İnceleniyor' :
                                  'Revize'}
                            </span>
                          </div>

                          {/* Rating */}
                          <div className="flex mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill={star <= comment.rating ? '#FFD700' : '#E5E7EB'}
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>

                          {/* Comment Message */}
                          <p style={{
                            fontFamily: 'Metropolis, sans-serif',
                            fontSize: '14px',
                            color: '#202023',
                            lineHeight: '1.6',
                            marginBottom: '16px',
                          }}>
                            {comment.message}
                          </p>

                          {/* Company Info */}
                          <div className="border-t border-gray-200 pt-4">
                            <p style={{
                              fontFamily: 'Metropolis, sans-serif',
                              fontSize: '12px',
                              color: '#6B7280',
                              marginBottom: '8px',
                            }}>
                              Markanın Cevabı
                            </p>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                                <span style={{
                                  fontFamily: 'Metropolis, sans-serif',
                                  fontWeight: 700,
                                  fontSize: '14px',
                                  color: '#FFFFFF',
                                }}>
                                  {comment.companyName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h4 style={{
                                  fontFamily: 'Metropolis, sans-serif',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  color: '#202023',
                                }}>
                                  {comment.companyName}
                                </h4>
                                {comment.answerDate && (
                                  <p style={{
                                    fontFamily: 'Metropolis, sans-serif',
                                    fontSize: '12px',
                                    color: '#6B7280',
                                  }}>
                                    {comment.answerDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Company Answer */}
                            {comment.answer ? (
                              <p style={{
                                fontFamily: 'Metropolis, sans-serif',
                                fontSize: '14px',
                                color: '#6B7280',
                                lineHeight: '1.6',
                              }}>
                                {comment.answer}
                              </p>
                            ) : (
                              <p style={{
                                fontFamily: 'Metropolis, sans-serif',
                                fontSize: '14px',
                                color: '#9CA3AF',
                                fontStyle: 'italic',
                              }}>
                                Henüz cevap verilmedi.
                              </p>
                            )}
                          </div>

                          {/* View All Button */}
                          <button
                            onClick={() => navigate(`/company/${comment.companyId}`)}
                            style={{
                              fontFamily: 'Metropolis, sans-serif',
                              fontSize: '12px',
                              color: '#6B7280',
                              marginTop: '12px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            }}
                          >
                            Tamamını Gör
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h2 style={{
                    fontFamily: 'Metropolis, sans-serif',
                    fontWeight: 700,
                    fontSize: '32px',
                    color: '#202023',
                    marginBottom: '32px',
                  }}>
                    Bildirimlerim
                  </h2>

                  {isLoadingNotifications ? (
                    <p className="text-gray-500">Yükleniyor...</p>
                  ) : userNotifications.length === 0 ? (
                    <p className="text-gray-500">Henüz bildiriminiz yok.</p>
                  ) : (
                    <div className="space-y-3">
                      {userNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer"
                          style={{
                            backgroundColor: notification.isRead ? '#FFFFFF' : '#F0F9FF',
                            borderColor: notification.isRead ? '#E5E7EB' : '#BFDBFE',
                          }}
                          onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            {/* Left side - Icon and content */}
                            <div className="flex items-start gap-4 flex-1">
                              {/* Notification icon based on type */}
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{
                                  backgroundColor: notification.isRead ? '#E5E7EB' : '#4C38A5',
                                }}
                              >
                                {notification.type === 'comment' ? (
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={notification.isRead ? '#6B7280' : '#FFFFFF'}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                  </svg>
                                ) : notification.type === 'reward' ? (
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={notification.isRead ? '#6B7280' : '#FFFFFF'}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
                                    <path d="M12 2v10" />
                                    <path d="m7 7 5-5 5 5" />
                                  </svg>
                                ) : (
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={notification.isRead ? '#6B7280' : '#FFFFFF'}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                  </svg>
                                )}
                              </div>

                              {/* Notification content */}
                              <div className="flex-1">
                                <p style={{
                                  fontFamily: 'Metropolis, sans-serif',
                                  fontWeight: notification.isRead ? 400 : 600,
                                  fontSize: '14px',
                                  color: '#202023',
                                  lineHeight: '1.6',
                                  marginBottom: '8px',
                                }}>
                                  {notification.text}
                                </p>
                                <p style={{
                                  fontFamily: 'Metropolis, sans-serif',
                                  fontSize: '12px',
                                  color: '#9CA3AF',
                                }}>
                                  {notification.date.toLocaleDateString('tr-TR', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Right side - Unread indicator */}
                            {!notification.isRead && (
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                                style={{
                                  backgroundColor: '#4C38A5',
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'rewards' && (
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h2 style={{
                    fontFamily: 'Metropolis, sans-serif',
                    fontWeight: 700,
                    fontSize: '32px',
                    color: '#202023',
                    marginBottom: '32px',
                  }}>
                    Ödüllerim
                  </h2>

                  {isLoadingRewards ? (
                    <p className="text-gray-500">Yükleniyor...</p>
                  ) : userRewards.length === 0 ? (
                    <p className="text-gray-500">Henüz ödülünüz yok.</p>
                  ) : (
                    <div className="space-y-4">
                      {userRewards.map((reward) => (
                        <div
                          key={reward.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                          style={{
                            backgroundColor: reward.isUsed ? '#F9FAFB' : '#FFFFFF',
                          }}
                        >
                          <div className="flex items-start justify-between">
                            {/* Left side - Reward info */}
                            <div className="flex items-start gap-4 flex-1">
                              {/* Icon/Badge */}
                              <div
                                className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                  backgroundColor: reward.isUsed ? '#E5E7EB' : '#7EDA48',
                                }}
                              >
                                <svg
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke={reward.isUsed ? '#9CA3AF' : '#FFFFFF'}
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" />
                                  <path d="M12 2v10" />
                                  <path d="m7 7 5-5 5 5" />
                                </svg>
                              </div>

                              {/* Reward details */}
                              <div className="flex-1">
                                <h3 style={{
                                  fontFamily: 'Metropolis, sans-serif',
                                  fontWeight: 600,
                                  fontSize: '18px',
                                  color: reward.isUsed ? '#6B7280' : '#202023',
                                  marginBottom: '8px',
                                }}>
                                  {reward.text}
                                </h3>
                                <p style={{
                                  fontFamily: 'Metropolis, sans-serif',
                                  fontSize: '14px',
                                  color: '#6B7280',
                                  marginBottom: '12px',
                                }}>
                                  Tüm mağazalarda kullanabileceğiniz migros çekiniz.
                                </p>
                                <p style={{
                                  fontFamily: 'Metropolis, sans-serif',
                                  fontSize: '12px',
                                  color: '#9CA3AF',
                                }}>
                                  {reward.date.toLocaleDateString('tr-TR', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Right side - Code and status */}
                            <div className="flex flex-col items-end gap-3">
                              {/* Status badge */}
                              {reward.isUsed && (
                                <span
                                  style={{
                                    fontFamily: 'Metropolis, sans-serif',
                                    fontWeight: 600,
                                    fontSize: '12px',
                                    padding: '6px 16px',
                                    borderRadius: '20px',
                                    backgroundColor: '#E5E7EB',
                                    color: '#6B7280',
                                  }}
                                >
                                  Kullanıldı
                                </span>
                              )}

                              {/* Code display button */}
                              <button
                                onClick={() => {
                                  if (!reward.isUsed) {
                                    alert(`Kod: ${reward.code}`);
                                  }
                                }}
                                disabled={reward.isUsed}
                                style={{
                                  fontFamily: 'Metropolis, sans-serif',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  color: reward.isUsed ? '#9CA3AF' : '#4C38A5',
                                  padding: '8px 24px',
                                  borderRadius: '8px',
                                  border: `1px solid ${reward.isUsed ? '#E5E7EB' : '#4C38A5'}`,
                                  background: 'transparent',
                                  cursor: reward.isUsed ? 'not-allowed' : 'pointer',
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                  if (!reward.isUsed) {
                                    e.currentTarget.style.backgroundColor = '#4C38A5';
                                    e.currentTarget.style.color = '#FFFFFF';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!reward.isUsed) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#4C38A5';
                                  }
                                }}
                              >
                                Kodu Göster →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
