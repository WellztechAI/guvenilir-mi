import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

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
        {isAuthenticated && user ? (
          <>
            {/* User info */}
            <span
              style={{
                fontFamily: 'Metropolis, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                color: '#202023',
              }}
            >
              Merhaba, {user.userName}
            </span>
            {/* Logout button */}
            <button
              onClick={logout}
              disabled={isLoading}
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
              {isLoading ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}
            </button>
          </>
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
          </>
        )}
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
      </div>
    </header>
  );
};
