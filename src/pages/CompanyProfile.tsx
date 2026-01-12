import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { signOut } from '@/services/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const CompanyProfile: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { company } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'notifications'>('info');

  // Check URL parameter for tab on mount
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'notifications') {
      setActiveTab('notifications');
    }
  }, [searchParams]);

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
            Şirket Paneli
          </h1>
        </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-10 pb-20">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {activeTab === 'info' ? (
            <>
              <h2 style={{
                fontFamily: 'Metropolis, sans-serif',
                fontWeight: 700,
                fontSize: '32px',
                lineHeight: '150%',
                color: '#202023',
                marginBottom: '24px',
              }}>
                {company?.panelUserName || company?.requesterName || 'Şirket Adı'}
              </h2>

              <div className="mb-6">
                <p style={{
                  fontFamily: 'Metropolis, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  color: '#6B7280',
                  marginBottom: '8px',
                }}>
                  <strong>E-posta:</strong> {company?.requesterCompanyEmail}
                </p>
                <p style={{
                  fontFamily: 'Metropolis, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  color: '#6B7280',
                  marginBottom: '8px',
                }}>
                  <strong>Telefon:</strong> {company?.requesterPhoneNumber}
                </p>
                <p style={{
                  fontFamily: 'Metropolis, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  color: '#6B7280',
                  marginBottom: '8px',
                }}>
                  <strong>Durum:</strong> {company?.status === 'approved' ? 'Onaylandı' : company?.status === 'pending' ? 'Beklemede' : 'Reddedildi'}
                </p>
              </div>

              <div className="mt-8">
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
                  {isLoggingOut ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 style={{
                fontFamily: 'Metropolis, sans-serif',
                fontWeight: 700,
                fontSize: '32px',
                lineHeight: '150%',
                color: '#202023',
                marginBottom: '24px',
              }}>
                Bildirimler
              </h2>
              <p style={{
                fontFamily: 'Metropolis, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                color: '#6B7280',
              }}>
                Henüz bildiriminiz yok.
              </p>
            </>
          )}
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
