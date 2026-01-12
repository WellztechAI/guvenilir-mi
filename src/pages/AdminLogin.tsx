import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const AdminLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white flex flex-col overflow-hidden items-center pb-24 rounded-[32px] min-h-screen">
      <Header />

      <main className="w-full max-w-[500px] px-4 mt-16">
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-center mb-2 text-[#202023]">
            Admin Girişi
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Admin paneline erişim için giriş yapın
          </p>

          <form className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Kullanıcı adınızı girin"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Şifrenizi girin"
              />
            </div>

            <button
              type="button"
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
            >
              Giriş Yap
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Ana sayfaya dön
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLogin;
