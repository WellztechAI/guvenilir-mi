import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white pt-16 pb-0">
      {/* Main Footer Content */}
      <div className="mx-32 max-md:mx-5 flex gap-8 max-md:flex-col">
        {/* Left Section - Bordered Container */}
        <div
          className="flex-1 flex items-center gap-8 p-8 rounded-3xl border"
          style={{ borderColor: '#DBE2EB', borderRadius: '24px' }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center" style={{ width: 32, height: 32 }}>
              <img
                src="/Vector (1).png"
                alt=""
                className="absolute inset-0 w-full h-full"
              />
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

          {/* Description Text */}
          <p
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '150%',
              color: '#202023',
            }}
          >
            Canlife is a company that provides technology and consulting services for life
            insurance. Canlife is licensed as an insurance agent in all states where its products are
            offered. License information can be found here. Canlife operates under the name
            Canlife Insurance Services in LA. The information contained on this website is for
            informational purposes only. Certain products and product features may not be
            available in all states, and other restrictions or prohibitions may apply.
          </p>
        </div>

        {/* Right Section - Keşfet */}
        <div className="flex flex-col shrink-0" style={{ minWidth: '180px' }}>
          {/* Keşfet Heading */}
          <h3
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              lineHeight: '150%',
              color: '#000000',
            }}
          >
            Keşfet
          </h3>

          {/* Links */}
          <nav className="flex flex-col gap-3 mt-4">
            <Link
              to="/manifest"
              style={{
                fontFamily: 'Lato, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '150%',
                color: '#4E657F',
              }}
            >
              Manifest-o
            </Link>
            <Link
              to="/sss"
              style={{
                fontFamily: 'Lato, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '150%',
                color: '#4E657F',
              }}
            >
              Sıkça Sorulan Sorular
            </Link>
            <Link
              to="/marka-alani"
              style={{
                fontFamily: 'Lato, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '150%',
                color: '#4E657F',
              }}
            >
              Marka Alanı
            </Link>
            <a
              href="#"
              style={{
                fontFamily: 'Lato, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '150%',
                color: '#4E657F',
              }}
            >
              Blog
            </a>
            <a
              href="#"
              style={{
                fontFamily: 'Lato, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '150%',
                color: '#4E657F',
              }}
            >
              İletişim
            </a>
          </nav>

          {/* Social Media Icons */}
          <div className="flex gap-4 mt-6">
            {/* Facebook */}
            <a href="#" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 21.879V14.89H7.898V12H10.438V9.797C10.438 7.291 11.93 5.907 14.215 5.907C15.309 5.907 16.453 6.102 16.453 6.102V8.562H15.193C13.95 8.562 13.563 9.333 13.563 10.124V12H16.336L15.893 14.89H13.563V21.879C18.343 21.128 22 16.991 22 12C22 6.477 17.523 2 12 2Z" fill="#4E657F" />
              </svg>
            </a>
            {/* Twitter */}
            <a href="#" aria-label="Twitter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.42 6.16 2.42 6.94C2.42 8.43 3.17 9.75 4.33 10.5C3.62 10.5 2.96 10.3 2.38 10V10.03C2.38 12.11 3.86 13.85 5.82 14.24C5.46 14.34 5.08 14.39 4.69 14.39C4.42 14.39 4.15 14.36 3.89 14.31C4.43 16 6 17.26 7.89 17.29C6.43 18.45 4.58 19.13 2.56 19.13C2.22 19.13 1.88 19.11 1.54 19.07C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z" fill="#4E657F" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" fill="#4E657F" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19ZM18.5 18.5V13.2C18.5 12.3354 18.1565 11.5062 17.5452 10.8948C16.9338 10.2835 16.1046 9.94 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17C14.6813 12.17 15.0374 12.3175 15.2999 12.5801C15.5625 12.8426 15.71 13.1987 15.71 13.57V18.5H18.5ZM6.88 8.56C7.32556 8.56 7.75288 8.383 8.06794 8.06794C8.383 7.75288 8.56 7.32556 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19C6.43178 5.19 6.00193 5.36805 5.68499 5.68499C5.36805 6.00193 5.19 6.43178 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56ZM8.27 18.5V10.13H5.5V18.5H8.27Z" fill="#4E657F" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mx-32 max-md:mx-5 flex justify-between items-center flex-wrap gap-6 mt-8">
        {/* Bottom Links */}
        <div className="flex gap-8 flex-wrap">
          <a
            href="#"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '150%',
              color: '#4E657F',
            }}
          >
            Aydınlatma Metni
          </a>
          <Link
            to="/yorum-politikasi"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '150%',
              color: '#4E657F',
            }}
          >
            Kullanım Şartları
          </Link>
          <Link
            to="/topluluk-kurallari"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '150%',
              color: '#4E657F',
            }}
          >
            Topluluk Kuralları
          </Link>
          <a
            href="#"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '150%',
              color: '#4E657F',
            }}
          >
            Değerlendirme Kılavuzu
          </a>
        </div>

        {/* Copyright */}
        <span
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 400,
            fontSize: '18px',
            lineHeight: '150%',
            color: '#4E657F',
          }}
        >
          2026 güvenilir mi? Her hakkı saklıdır.
        </span>
      </div>
    </footer>
  );
};
