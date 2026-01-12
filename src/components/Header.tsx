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

  return (
    <header className="flex justify-between items-center w-full bg-white px-10 py-5 max-md:px-5">
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
            color: '#202023',
          }}
        >
          güvenilir mi?
        </span>
      </Link>

      {/* Center: Navigation Links */}
      <nav className="flex items-center gap-8">
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
      </nav>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-3">
        {isAuthenticated && hasUserData ? (
          <div className="flex items-center gap-3">
            {/* Bell icon for notifications */}
            <button
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
              onClick={() => navigate('/account')}
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
