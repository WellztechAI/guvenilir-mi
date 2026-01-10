import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const { login, register, loginWithGoogle, isLoading, error, clearError } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch {
            // Error is handled by useAuth
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!acceptedTerms) {
            return;
        }
        try {
            await register(email, password, userName, phoneNumber);
            navigate('/');
        } catch {
            // Error is handled by useAuth
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate('/');
        } catch {
            // Error is handled by useAuth
        }
    };

    return (
        <div className="bg-white flex flex-col overflow-hidden items-center min-h-screen">
            <Header />

            {/* Main content area */}
            <main className="w-full flex-1 flex flex-col">
                {/* Gradient background that extends down */}
                <div
                    className="w-full relative"
                    style={{
                        background: 'linear-gradient(180deg, #0d0820 0%, #1a1040 15%, #2d1b69 35%, #4a3a8a 55%, #7B6BA7 75%, #c4bfd8 90%, #FFFFFF 100%)',
                        paddingTop: '60px',
                        paddingBottom: '180px',
                    }}
                />

                {/* Semi-transparent container overlapping gradient */}
                <div className="flex-1 pb-12 -mt-[220px] relative z-10">
                    <div className="max-w-[600px] mx-auto px-4 w-full">
                        <div
                            className="rounded-3xl overflow-hidden border"
                            style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <div className="p-8">
                                {/* Title inside container */}
                                <div className="text-center mb-8">
                                    <h1
                                        className="text-white text-2xl md:text-3xl font-bold mb-2"
                                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                                    >
                                        Senin sesin, milyonların pusulası
                                    </h1>
                                    <p
                                        className="text-white/70 text-sm md:text-base"
                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                    >
                                        Başkalarının karar verme sürecine katkı sağla!
                                    </p>
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-4 mb-8">
                                    <button
                                        onClick={() => {
                                            setActiveTab('login');
                                            clearError();
                                        }}
                                        className="flex-1 py-3 rounded-full text-sm font-semibold transition-all"
                                        style={{
                                            fontFamily: 'Metropolis, sans-serif',
                                            backgroundColor: activeTab === 'login' ? '#2d1b69' : '#e8e8ea',
                                            color: activeTab === 'login' ? 'white' : '#888',
                                        }}
                                    >
                                        Giriş Yap
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveTab('register');
                                            clearError();
                                        }}
                                        className="flex-1 py-3 rounded-full text-sm font-semibold transition-all"
                                        style={{
                                            fontFamily: 'Metropolis, sans-serif',
                                            backgroundColor: activeTab === 'register' ? '#2d1b69' : '#e8e8ea',
                                            color: activeTab === 'register' ? 'white' : '#888',
                                        }}
                                    >
                                        Kayıt Ol
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister}>
                                    {/* Registration fields - 2x2 grid */}
                                    {activeTab === 'register' && (
                                        <>
                                            <div className="flex gap-4 mb-4 max-md:flex-col">
                                                {/* Name field */}
                                                <div className="flex-1">
                                                    <label
                                                        className="block text-sm text-gray-600 mb-2"
                                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                                    >
                                                        İsim Soyisim
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={userName}
                                                        onChange={(e) => setUserName(e.target.value)}
                                                        placeholder="Alper Yılmaz"
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#2d1b69] transition-colors"
                                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                                        required
                                                    />
                                                </div>

                                                {/* Email field */}
                                                <div className="flex-1">
                                                    <label
                                                        className="block text-sm text-gray-600 mb-2"
                                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                                    >
                                                        E-posta
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="alper.yilmaz@gmail.com"
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#2d1b69] transition-colors"
                                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-4 mb-4 max-md:flex-col">
                                                {/* Password field */}
                                                <div className="flex-1">
                                                    <label
                                                        className="block text-sm text-gray-600 mb-2"
                                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                                    >
                                                        Şifreniz
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder="••••••••••••••••"
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#2d1b69] transition-colors"
                                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                                        required
                                                        minLength={6}
                                                    />
                                                </div>

                                                {/* Phone number field */}
                                                <div className="flex-1">
                                                    <label
                                                        className="block text-sm text-gray-600 mb-2"
                                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                                    >
                                                        Telefon Numaranız
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        placeholder="+90 544 913 1200"
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#2d1b69] transition-colors"
                                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Terms checkbox */}
                                            <div className="flex items-start gap-2 mb-6">
                                                <input
                                                    type="checkbox"
                                                    id="terms"
                                                    checked={acceptedTerms}
                                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                                    className="mt-1 w-4 h-4 rounded border-gray-300 text-[#2d1b69] focus:ring-[#2d1b69]"
                                                    required
                                                />
                                                <label
                                                    htmlFor="terms"
                                                    className="text-sm text-gray-600"
                                                    style={{ fontFamily: 'Manrope, sans-serif' }}
                                                >
                                                    Üyelik sözleşmesini okudum, anladım ve kabul ediyorum.
                                                </label>
                                            </div>
                                        </>
                                    )}

                                    {/* Login fields - side by side */}
                                    {activeTab === 'login' && (
                                        <div className="flex gap-4 mb-6 max-md:flex-col">
                                            {/* Email field */}
                                            <div className="flex-1">
                                                <label
                                                    className="block text-sm text-gray-600 mb-2"
                                                    style={{ fontFamily: 'Manrope, sans-serif' }}
                                                >
                                                    E-posta Adresiniz
                                                </label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="johndoe@gmail.com"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#2d1b69] transition-colors"
                                                    style={{ fontFamily: 'Manrope, sans-serif' }}
                                                    required
                                                />
                                            </div>

                                            {/* Password field */}
                                            <div className="flex-1">
                                                <label
                                                    className="block text-sm text-gray-600 mb-2"
                                                    style={{ fontFamily: 'Manrope, sans-serif' }}
                                                >
                                                    Şifreniz
                                                </label>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••••••••••"
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#2d1b69] transition-colors"
                                                    style={{ fontFamily: 'Manrope, sans-serif' }}
                                                    required
                                                    minLength={6}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Error message */}
                                    {error && (
                                        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {/* Submit button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3 rounded-full text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                                        style={{
                                            fontFamily: 'Metropolis, sans-serif',
                                            backgroundColor: '#2d1b69',
                                        }}
                                    >
                                        {isLoading
                                            ? 'Yükleniyor...'
                                            : activeTab === 'login'
                                                ? 'Giriş Yap'
                                                : 'Kayıt Ol'}
                                    </button>
                                </form>

                                {/* Google login button */}
                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading}
                                    className="w-full max-w-[280px] mx-auto flex items-center justify-center gap-3 py-3 px-6 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 mt-6"
                                    style={{ fontFamily: 'Manrope, sans-serif' }}
                                >
                                    {/* Google icon */}
                                    <svg width="20" height="20" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span className="text-gray-700 font-medium">Google ile Giriş Yap</span>
                                </button>

                                {/* Company signup link */}
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                        Şirket hesabı oluşturmak mı istiyorsunuz?
                                    </p>
                                    <button
                                        onClick={() => navigate('/company-signup')}
                                        className="text-[#2d1b69] font-semibold hover:underline text-sm"
                                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                                    >
                                        Şirket Kaydı Oluştur →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="w-full bg-white py-16 px-4">
                    <div className="max-w-[1200px] mx-auto">
                        {/* Section Title */}
                        <div className="text-center mb-12">
                            <h2
                                className="text-2xl md:text-3xl font-bold text-[#202023] mb-3"
                                style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                                Milyonlarca tüketici,<br />
                                senin sayende en iyi kararı veriyor.
                            </h2>
                            <p
                                className="text-gray-500 text-sm"
                                style={{ fontFamily: 'Manrope, sans-serif' }}
                            >
                                Senin sesin, milyonların pusulası. Başkalarının karar verme sürecine katkı sağla!
                            </p>
                        </div>

                        {/* Testimonial Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                            {[1, 2, 3].map((_, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 border border-gray-100"
                                    style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)' }}
                                >
                                    {/* User Info */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-yellow-400 overflow-hidden">
                                            <img
                                                src="https://api.builder.io/api/v1/image/assets/TEMP/575db4fcc3f27ace122a83abec07b8055dd416ea?placeholderIfAbsent=true"
                                                alt="User avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#202023]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                                                Fuat Han Albar
                                            </p>
                                            {/* Rating Stars */}
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4].map((star) => (
                                                    <div key={star} className="w-4 h-4 bg-green-500 rounded-sm" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Review Text */}
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                        İnanılmazyım! 24 ay taksitle kredi çektim ve benden bunun için döküman ve bilgilerimi istediler teyit!
                                    </p>

                                    {/* Rating Info */}
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <span>Değerlendirme 4.0 / 5</span>
                                        <span>Toplam 15 yorum</span>
                                    </div>

                                    {/* Brand Info */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">G</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-[#202023]">Garanti BBVA</p>
                                            <p className="text-xs text-gray-400">garantibbva.com</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Featured Brands Section */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3
                                        className="text-xl font-bold text-[#202023]"
                                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                                    >
                                        Öne Çıkan Markalar
                                    </h3>
                                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                        Yüksek güven skoruyla öne çıkan markalar
                                    </p>
                                </div>
                                {/* Pagination dots */}
                                <div className="flex gap-2">
                                    <div className="w-6 h-2 rounded-full bg-gray-300" />
                                    <div className="w-6 h-2 rounded-full bg-[#2d1b69]" />
                                </div>
                            </div>

                            {/* Brand Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Brand 1 */}
                                <div className="bg-white rounded-2xl p-5 border border-gray-100" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)' }}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">F</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#202023]" style={{ fontFamily: 'Metropolis, sans-serif' }}>Fuzul Ev</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 mb-2">
                                        {[1, 2, 3, 4].map((star) => (
                                            <div key={star} className="w-5 h-5 bg-green-500 rounded-sm" />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">4.5(128 Yorum)</p>
                                </div>

                                {/* Brand 2 */}
                                <div className="bg-white rounded-2xl p-5 border border-yellow-200" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)', borderWidth: '2px' }}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">G</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#202023]" style={{ fontFamily: 'Metropolis, sans-serif' }}>Garanti BBVA</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 mb-2">
                                        {[1, 2, 3, 4].map((star) => (
                                            <div key={star} className="w-5 h-5 bg-green-500 rounded-sm" />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">4.5(128 Yorum)</p>
                                </div>

                                {/* Brand 3 */}
                                <div className="bg-white rounded-2xl p-5 border border-gray-100" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)' }}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">EH</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase">ENGLISH HOME</p>
                                            <p className="font-semibold text-[#202023]" style={{ fontFamily: 'Metropolis, sans-serif' }}>English Home</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5 mb-2">
                                        {[1, 2, 3, 4].map((star) => (
                                            <div key={star} className="w-5 h-5 bg-green-500 rounded-sm" />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">4.5(128 Yorum)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;
