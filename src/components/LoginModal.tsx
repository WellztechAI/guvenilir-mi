import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const { login, register, loginWithGoogle, isLoading, error, clearError } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            onClose();
        } catch {
            // Error is handled by useAuth
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(email, password, userName);
            onClose();
        } catch {
            // Error is handled by useAuth
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            onClose();
        } catch {
            // Error is handled by useAuth
        }
    };

    const handleClose = () => {
        clearError();
        setEmail('');
        setPassword('');
        setUserName('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="p-0 max-w-[600px] overflow-hidden border-0">
                {/* Header with gradient */}
                <div
                    className="px-8 pt-12 pb-8 text-center"
                    style={{
                        background: 'linear-gradient(180deg, #1a1040 0%, #2d1b69 50%, #4a3a8a 100%)',
                    }}
                >
                    <h2
                        className="text-white text-3xl font-bold mb-3"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                    >
                        Senin sesin, milyonların pusulası
                    </h2>
                    <p
                        className="text-white/80 text-base"
                        style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                        Başkalarının karar verme sürecine katkı sağla!
                    </p>
                </div>

                {/* Content */}
                <div className="bg-[#f5f5f7] px-8 py-8">
                    {/* Tabs */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => {
                                setActiveTab('login');
                                clearError();
                            }}
                            className="flex-1 py-3 rounded-full text-sm font-semibold transition-all"
                            style={{
                                fontFamily: 'Metropolis, sans-serif',
                                backgroundColor: activeTab === 'login' ? '#2d1b69' : '#e0e0e0',
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
                                backgroundColor: activeTab === 'register' ? '#2d1b69' : '#e0e0e0',
                                color: activeTab === 'register' ? 'white' : '#888',
                            }}
                        >
                            Kayıt Ol
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister}>
                        {/* Username field (only for register) */}
                        {activeTab === 'register' && (
                            <div className="mb-4">
                                <label
                                    className="block text-sm text-gray-600 mb-2"
                                    style={{ fontFamily: 'Manrope, sans-serif' }}
                                >
                                    Kullanıcı Adınız
                                </label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Kullanıcı adınız"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#2d1b69] transition-colors"
                                    style={{ fontFamily: 'Manrope, sans-serif' }}
                                    required
                                />
                            </div>
                        )}

                        <div className="flex gap-4 mb-6">
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

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-300" />
                        <span className="px-4 text-gray-500 text-sm">veya</span>
                        <div className="flex-1 border-t border-gray-300" />
                    </div>

                    {/* Google login button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full max-w-[250px] mx-auto flex items-center justify-center gap-3 py-3 px-6 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
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
                </div>
            </DialogContent>
        </Dialog>
    );
};
