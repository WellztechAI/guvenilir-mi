import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { signOut } from '@/services/authService';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { firebaseUser, user, company, userType } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // User is authenticated if we have either user or company data
  const isAuthenticated = firebaseUser !== null;
  const hasUserData = user !== null || company !== null;

  // Get display name based on user type
  const displayName = userType === 'company'
    ? company?.panelUserName || company?.requesterName
    : user?.userName;

  // Get profile image based on user type
  const profileImage = userType === 'company' ? undefined : user?.imageUrl;

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

  // Company header with gradient background
  const isCompanyUser = isAuthenticated && userType === 'company' && hasUserData;

  return (
    <header
      className="flex justify-between items-center w-full px-10 py-5 max-md:px-5"
      style={isCompanyUser ? {
        background: 'linear-gradient(90deg, #4C38A5 0%, #023E84 100%)',
      } : {
        backgroundColor: 'white',
      }}
    >
      {/* Left: Logo and Title - Links to Home */}
      <Link to="/" className="flex items-center gap-3">
        <div className="relative flex items-center justify-center" style={{ width: 32, height: 32 }}>
          {/* Background square */}
          <img
            src="/Vector (1).png"
            alt=""
            className="absolute inset-0 w-full h-full"
          />
          {/* Checkmark on top - smaller and centered */}
          <img
            src="/Vector.png"
            alt="Logo"
            className="relative"
            style={{ width: '60%', height: '60%' }}
          />
        </div>
        <span
          style={{
            fontFamily: 'Metropolis, sans-serif',
            fontWeight: 800,
            fontSize: '20px',
            lineHeight: '150%',
            color: isCompanyUser ? '#FFFFFF' : '#202023',
          }}
        >
          güvenilir mi?
        </span>
      </Link>

      {/* Center: Navigation Links */}
      <nav className="flex items-center gap-8">
        {isCompanyUser ? (
          <>
            <a
              href="#marka-panelim"
              style={{
                fontFamily: 'Metropolis, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '150%',
                color: '#FFFFFF',
              }}
            >
              Marka Panelim
            </a>
            <a
              href="#gelen-yorumlar"
              style={{
                fontFamily: 'Metropolis, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '150%',
                color: '#FFFFFF',
              }}
            >
              Gelen Yorumlar
            </a>
            <a
              href="#abonelik-paketleri"
              style={{
                fontFamily: 'Metropolis, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '150%',
                color: '#FFFFFF',
              }}
            >
              Abonelik Paketleri
            </a>
            <a
              href="#istatistikler"
              style={{
                fontFamily: 'Metropolis, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '150%',
                color: '#FFFFFF',
              }}
            >
              İstatistikler
            </a>
            <a
              href="#pazarlama"
              style={{
                fontFamily: 'Metropolis, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '150%',
                color: '#FFFFFF',
              }}
            >
              Pazarlama
            </a>
          </>
        ) : (
          <>
            <a
              href="#manifesto"
              style={{
                fontFamily: 'Metropolis, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '150%',
                color: '#202023',
              }}
            >
              Manifesto
            </a>
            <a
              href="#kategoriler"
              style={{
                fontFamily: 'Metropolis, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '150%',
                color: '#202023',
              }}
            >
              Kategoriler
            </a>
          </>
        )}
      </nav>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-3">
        {isAuthenticated && hasUserData ? (
          <div className="flex items-center gap-3">
            {isCompanyUser ? (
              <>
                {/* Settings icon for company users */}
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Ayarlar"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6m-6-6h6m6 0h-6m-3.5-3.5l4.5 4.5m0-4.5l-4.5 4.5" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </button>

                {/* Bell icon for notifications */}
                <button
                  onClick={() => navigate('/company-profile?tab=notifications')}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Bildirimler"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </button>

                {/* Company name with profile photo */}
                <button
                  onClick={() => navigate('/company-profile')}
                  className="flex items-center gap-2 pr-1 hover:opacity-80 transition-opacity"
                >
                  {/* Profile photo */}
                  <div
                    className="w-8 h-8 rounded-full bg-white/20 overflow-hidden flex items-center justify-center"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  {/* Company name as text */}
                  <span
                    style={{
                      fontFamily: 'Metropolis, sans-serif',
                      fontWeight: 600,
                      fontSize: '14px',
                      lineHeight: '150%',
                      color: '#FFFFFF',
                    }}
                  >
                    {displayName || 'Şirket'}
                  </span>
                </button>
              </>
            ) : (
              <>
                {/* Bell icon for notifications */}
                <button
                  onClick={() => navigate('/profile?tab=notifications')}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Bildirimler"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </button>

                {/* Hesabim button with profile photo */}
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 text-white pr-1"
                  style={{
                    height: '44px',
                    paddingTop: '6px',
                    paddingBottom: '6px',
                    paddingLeft: '16px',
                    paddingRight: '6px',
                    borderRadius: '22px',
                    border: '1px solid transparent',
                    background: 'linear-gradient(90deg, #4C38A5 0%, #023E84 100%)',
                    fontFamily: 'Metropolis, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '150%',
                  }}
                >
                  <span>Hesabım</span>
                  {/* Profile photo placeholder */}
                  <div
                    className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center"
                    style={{
                      backgroundImage: profileImage ? `url(${profileImage})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!profileImage && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Sign out button */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center justify-center text-white"
                  style={{
                    height: '44px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    borderRadius: '22px',
                    backgroundColor: '#0D062D',
                    fontFamily: 'Metropolis, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '150%',
                  }}
                >
                  {isLoggingOut ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Login button - navigates to /login page */}
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center text-white"
              style={{
                height: '44px',
                paddingTop: '10px',
                paddingBottom: '10px',
                paddingLeft: '16px',
                paddingRight: '16px',
                borderRadius: '22px',
                border: '1px solid transparent',
                background: 'linear-gradient(90deg, #4C38A5 0%, #023E84 100%)',
                fontFamily: 'Metropolis, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '150%',
              }}
            >
              Giriş Yap/Kayıt Ol
            </button>

            {/* İşletmem İçin button - only for non-authenticated users */}
            <button
              onClick={() => navigate('/company-signup')}
              className="flex items-center justify-center text-white"
              style={{
                height: '44px',
                paddingTop: '10px',
                paddingBottom: '10px',
                paddingLeft: '16px',
                paddingRight: '16px',
                borderRadius: '22px',
                backgroundColor: '#0D062D',
                fontFamily: 'Metropolis, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '150%',
              }}
            >
              İşletmem İçin
            </button>
          </>
        )}
      </div>
    </header>
  );
};
