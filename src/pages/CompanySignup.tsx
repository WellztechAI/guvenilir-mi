import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { createCompany, createCompanyVerification } from '@/services/authApiService';
import citiesData from '@/constants/cities.json';

type Step = 1 | 2 | 3 | 4;


// Form data interface for company verification
interface CompanyFormData {
    companyName: string;
    companySlug: string;
    requesterName: string;
    requesterTitle: string;
    requesterCompanyEmail: string;
    requesterPhoneNumber: string;
    panelUserName: string;
    mernisNo: string;
    signatureUrls: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    membership: 'free' | 'basic' | 'premium' | 'enterprise';
}

const CompanySignup = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verificationId, setVerificationId] = useState<string | null>(null);

    // Form data for company verification
    const [formData, setFormData] = useState<CompanyFormData>({
        companyName: '',
        companySlug: '',
        requesterName: '',
        requesterTitle: '',
        requesterCompanyEmail: '',
        requesterPhoneNumber: '',
        panelUserName: '',
        mernisNo: '',
        signatureUrls: '',
        address: '',
        city: '',
        district: '',
        postalCode: '',
        membership: 'free',
    });

    // Additional fields for step 2
    const [panelPassword, setPanelPassword] = useState('');

    // Payment info (not stored in CompanyVerification)
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });

    const updateFormData = (field: keyof CompanyFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Auto-generate slug from company name
        if (field === 'companyName') {
            const slug = value
                .toLowerCase()
                .replace(/[ğ]/g, 'g')
                .replace(/[ü]/g, 'u')
                .replace(/[ş]/g, 's')
                .replace(/[ı]/g, 'i')
                .replace(/[ö]/g, 'o')
                .replace(/[ç]/g, 'c')
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            setFormData(prev => ({ ...prev, companySlug: slug }));
        }
    };

    const handleNextStep = () => {
        if (!acceptedTerms) return;
        if (currentStep < 4) {
            setCurrentStep((currentStep + 1) as Step);
            // Keep acceptedTerms checked across steps
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep((currentStep - 1) as Step);
        }
    };

    // Get available districts based on selected city
    const availableDistricts = useMemo(() => {
        if (!formData.city) return [];
        return citiesData.districts[formData.city as keyof typeof citiesData.districts] || [];
    }, [formData.city]);

    // Reset district when city changes
    const handleCityChange = (city: string) => {
        updateFormData('city', city);
        // Clear district if it's not valid for the new city
        if (formData.district) {
            const newDistricts = citiesData.districts[city as keyof typeof citiesData.districts] || [];
            if (!newDistricts.includes(formData.district)) {
                updateFormData('district', '');
            }
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Step 1: Create the company via API
            console.log('Creating company via API...');
            const companyResponse = await createCompany({
                name: formData.companyName,
                slug: formData.companySlug,
                description: `${formData.companyName} şirketi`,
                phone: formData.requesterPhoneNumber,
            });
            console.log('Company created with ID:', companyResponse.id);

            // Step 2: Create company verification request via API
            const verificationData = {
                companyId: companyResponse.id,
                requesterName: formData.requesterName,
                requesterTitle: formData.requesterTitle || undefined,
                requesterCompanyEmail: formData.requesterCompanyEmail,
                requesterPhoneNumber: formData.requesterPhoneNumber || undefined,
                panelUserName: formData.panelUserName,
                panelPassword: panelPassword,
                mernisNo: formData.mernisNo || undefined,
                signatureUrls: formData.signatureUrls ? [formData.signatureUrls] : undefined,
                address: formData.address || undefined,
                city: formData.city || undefined,
                district: formData.district || undefined,
                postalCode: formData.postalCode || undefined,
                membership: formData.membership,
            };

            console.log('Submitting company verification:', verificationData);
            const verificationResponse = await createCompanyVerification(verificationData);
            console.log('Company verification created with ID:', verificationResponse.id);

            setVerificationId(verificationResponse.id);
            setCurrentStep(4);
        } catch (err) {
            console.error('Error during company signup:', err);
            const errorMessage = err instanceof Error ? err.message : 'Başvuru gönderilirken bir hata oluştu.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const steps = [
        { id: 1, label: 'Mail Doğrulaması', completed: currentStep > 1 },
        { id: 2, label: 'Yetkili Bilgileri', completed: currentStep > 2 },
        { id: 3, label: 'Marka Bilgileri', completed: currentStep > 3 },
        { id: 4, label: 'Onay', completed: currentStep === 4 },
    ];

    return (
        <div className="bg-white flex flex-col overflow-hidden items-center min-h-screen">
            <Header />

            <main className="w-full flex-1 py-8 px-4">
                <div className="max-w-[900px] mx-auto">
                    {/* Step Progress */}
                    <div className="flex items-center justify-center mb-12">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${step.completed || currentStep === step.id
                                            ? 'bg-[#2EC4B6] text-white'
                                            : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {step.completed ? '✓' : step.id}
                                    </div>
                                    <span
                                        className={`text-sm ${step.completed || currentStep === step.id
                                            ? 'text-[#2EC4B6] font-medium'
                                            : 'text-gray-400'
                                            }`}
                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`w-16 h-0.5 mx-4 ${step.completed ? 'bg-[#2EC4B6]' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Mail Doğrulaması */}
                    {currentStep === 1 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-8" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)' }}>
                            <h2
                                className="text-xl font-bold text-[#202023] mb-2"
                                style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                                Mail Doğrulama Sistemi
                            </h2>
                            <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                Burada paylaşacağınız bilgiler başvuru yapmış olduğunuz marka ile uyuşmalıdır.<br />
                                Örneğin: ali.demir@markaadr.com gibi bir mail adresiyle başvuru yapılmalıdır.<br />
                                Başvuru yaptıktan sonra ekiplerimize kontrol edildikten sonrasında size işleme devam edebilmeniz için bir link bağlantısı göndereceğiz.
                            </p>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => updateFormData('companyName', e.target.value)}
                                    placeholder="Şirket / Marka Adı"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                    style={{ fontFamily: 'Manrope, sans-serif' }}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <input
                                        type="text"
                                        value={formData.requesterName}
                                        onChange={(e) => updateFormData('requesterName', e.target.value)}
                                        placeholder="Başvuru Yapanın Adı"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={formData.requesterTitle}
                                        onChange={(e) => updateFormData('requesterTitle', e.target.value)}
                                        placeholder="Başvuru Yapanın Görev Tanımı"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="tel"
                                    value={formData.requesterPhoneNumber}
                                    onChange={(e) => {
                                        // Only allow numbers, spaces, parentheses, hyphens, and plus sign
                                        const value = e.target.value.replace(/[^\d\s\-\+\(\)]/g, '');
                                        updateFormData('requesterPhoneNumber', value);
                                    }}
                                    placeholder="Başvuru Yapanın Telefon Numarası"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                    style={{ fontFamily: 'Manrope, sans-serif' }}
                                />
                            </div>

                            <div className="mb-6">
                                <input
                                    type="email"
                                    value={formData.requesterCompanyEmail}
                                    onChange={(e) => updateFormData('requesterCompanyEmail', e.target.value)}
                                    placeholder="Başvuru Yapan Kişinin Şirket Uzantılı E-posta Adresi"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                    style={{ fontFamily: 'Manrope, sans-serif' }}
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border-gray-300 text-[#2EC4B6] focus:ring-[#2EC4B6]"
                                    />
                                    <span className="text-sm text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                        Vermiş olduğum bilgilerin doğruluğunu onaylıyorum. Aksi taktirde ilgili markanın doğrulamasını yapamayacağımı biliyorum.
                                    </span>
                                </label>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleNextStep}
                                        disabled={!acceptedTerms || !formData.companyName || !formData.requesterName || !formData.requesterCompanyEmail}
                                        className="px-8 py-3 rounded-lg bg-[#2EC4B6] text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                                    >
                                        Marka Doğrulamasını Başlat
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Yetkili Bilgileri */}
                    {currentStep === 2 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-8" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)' }}>
                            <h2
                                className="text-xl font-bold text-[#202023] mb-2"
                                style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                                Yetkili Bilgileri
                            </h2>
                            <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                Burada paylaşacağınız bilgiler başvuru yapmış olduğunuz marka ile uyuşmalıdır.<br />
                                Örneğin: ali.demir@markaadr.com gibi bir mail adresiyle başvuru yapılmalıdır.<br />
                                Başvuru yaptıktan sonra ekiplerimize kontrol edildikten sonrasında size işleme devam edebilmeniz için bir link bağlantısı göndereceğiz.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <input
                                        type="text"
                                        value={formData.panelUserName}
                                        onChange={(e) => updateFormData('panelUserName', e.target.value)}
                                        placeholder="Panel Giriş Kullanıcı Adı"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        value={panelPassword}
                                        onChange={(e) => setPanelPassword(e.target.value)}
                                        placeholder="Panel Giriş Şifre (En az 6 karakter)"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                        minLength={6}
                                    />
                                    {panelPassword && panelPassword.length < 6 && (
                                        <p className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                            Şifre en az 6 karakter olmalıdır
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-6">
                                <input
                                    type="email"
                                    value={formData.requesterCompanyEmail}
                                    onChange={(e) => updateFormData('requesterCompanyEmail', e.target.value)}
                                    placeholder="Başvuru Yapan Kişinin Şirket Uzantılı E-posta Adresi"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                    style={{ fontFamily: 'Manrope, sans-serif' }}
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border-gray-300 text-[#2EC4B6] focus:ring-[#2EC4B6]"
                                    />
                                    <span className="text-sm text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                        Vermiş olduğum bilgilerin doğruluğunu onaylıyorum. Aksi taktirde ilgili markanın doğrulamasını yapamayacağımı biliyorum.
                                    </span>
                                </label>

                                <div className="flex justify-between">
                                    <button
                                        onClick={handlePreviousStep}
                                        className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold transition-all hover:bg-gray-50"
                                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                                    >
                                        Geri
                                    </button>
                                    <button
                                        onClick={handleNextStep}
                                        disabled={!acceptedTerms || !formData.panelUserName || !panelPassword || panelPassword.length < 6}
                                        className="px-8 py-3 rounded-lg bg-[#2EC4B6] text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                                    >
                                        İleri
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Marka Bilgileri */}
                    {currentStep === 3 && (
                        <div className="flex gap-8 max-md:flex-col">
                            <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-8" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)' }}>
                                <h2
                                    className="text-xl font-bold text-[#202023] mb-2"
                                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                                >
                                    Marka Detayları
                                </h2>
                                <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                    Burada paylaşacağınız bilgiler başvuru yapmış olduğunuz marka ile uyuşmalıdır.<br />
                                    Örneğin: ali.demir@markaadr.com gibi bir mail adresiyle başvuru yapılmalıdır.<br />
                                    Başvuru yaptıktan sonra ekiplerimize kontrol edildikten sonrasında size işleme devam edebilmeniz için bir link bağlantısı göndereceğiz.
                                </p>

                                <div className="space-y-4 mb-4">
                                    <input
                                        type="text"
                                        value={formData.mernisNo}
                                        onChange={(e) => updateFormData('mernisNo', e.target.value)}
                                        placeholder="Marka Mersis Numarası"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                    />

                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.signatureUrls}
                                            onChange={(e) => updateFormData('signatureUrls', e.target.value)}
                                            placeholder="İmza Sirküleri Yükleyiniz"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                            style={{ fontFamily: 'Manrope, sans-serif' }}
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => updateFormData('address', e.target.value)}
                                        placeholder="Marka Adres Bilgisi"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                        style={{ fontFamily: 'Manrope, sans-serif' }}
                                    />

                                    <div className="grid grid-cols-3 gap-4">
                                        <select
                                            value={formData.city}
                                            onChange={(e) => handleCityChange(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                            style={{ 
                                                fontFamily: 'Manrope, sans-serif',
                                                color: formData.city ? '#202023' : '#9CA3AF'
                                            }}
                                        >
                                            <option value="">Şehir Seçiniz</option>
                                            {citiesData.cities.map((city) => (
                                                <option key={city} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={formData.district}
                                            onChange={(e) => updateFormData('district', e.target.value)}
                                            disabled={!formData.city}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            style={{ 
                                                fontFamily: 'Manrope, sans-serif',
                                                color: formData.district ? '#202023' : '#9CA3AF'
                                            }}
                                        >
                                            <option value="">İlçe Seçiniz</option>
                                            {availableDistricts.map((district) => (
                                                <option key={district} value={district}>
                                                    {district}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={formData.postalCode}
                                            onChange={(e) => updateFormData('postalCode', e.target.value)}
                                            placeholder="Posta Kodu"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                            style={{ fontFamily: 'Manrope, sans-serif' }}
                                        />
                                    </div>

                                    {formData.membership === 'premium' && (
                                        <div className="grid grid-cols-3 gap-4">
                                            <input
                                                type="text"
                                                value={paymentInfo.cardNumber}
                                                onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                                                placeholder="Kart Numarası"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                                style={{ fontFamily: 'Manrope, sans-serif' }}
                                            />
                                            <input
                                                type="text"
                                                value={paymentInfo.expiryDate}
                                                onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                                                placeholder="Son Kullanım Tarihi"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                                style={{ fontFamily: 'Manrope, sans-serif' }}
                                            />
                                            <input
                                                type="text"
                                                value={paymentInfo.cvv}
                                                onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                                                placeholder="Güvenlik Numarası"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] transition-colors"
                                                style={{ fontFamily: 'Manrope, sans-serif' }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-4">
                                    <label className="flex items-start gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={acceptedTerms}
                                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                                            className="mt-1 w-4 h-4 rounded border-gray-300 text-[#2EC4B6] focus:ring-[#2EC4B6]"
                                        />
                                        <span className="text-sm text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                            Vermiş olduğum bilgilerin doğruluğunu onaylıyorum. Aksi taktirde ilgili markanın doğrulamasını yapamayacağımı biliyorum.
                                        </span>
                                    </label>

                                    <button
                                        onClick={handlePreviousStep}
                                        className="w-full px-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold transition-all hover:bg-gray-50"
                                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                                    >
                                        Geri
                                    </button>
                                </div>
                            </div>

                            {/* Package Selection */}
                            <div className="w-[280px] max-md:w-full">
                                <h3
                                    className="text-lg font-bold text-[#202023] mb-4"
                                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                                >
                                    Paket Seçiniz
                                </h3>

                                <div className="space-y-3">
                                    <label
                                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.membership === 'premium' ? 'border-[#2EC4B6] bg-[#2EC4B6]/5' : 'border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="membership"
                                                checked={formData.membership === 'premium'}
                                                onChange={() => updateFormData('membership', 'premium')}
                                                className="w-5 h-5 text-[#2EC4B6]"
                                            />
                                            <span className="font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>Premium Paket</span>
                                            <span className="text-xs bg-[#2EC4B6] text-white px-2 py-0.5 rounded-full">İlk 30 gün ücretsiz</span>
                                        </div>
                                        <span className="font-bold text-[#202023]">999₺</span>
                                    </label>

                                    <label
                                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.membership === 'free' ? 'border-[#2EC4B6] bg-[#2EC4B6]/5' : 'border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="membership"
                                                checked={formData.membership === 'free'}
                                                onChange={() => updateFormData('membership', 'free')}
                                                className="w-5 h-5 text-[#2EC4B6]"
                                            />
                                            <span className="font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>Ücretsiz Paket</span>
                                        </div>
                                    </label>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!acceptedTerms || !formData.mernisNo || !formData.address || isLoading}
                                    className="w-full mt-6 px-8 py-3 rounded-lg bg-[#2EC4B6] text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                                >
                                    {isLoading ? 'Gönderiliyor...' : 'Başvuruyu Tamamla'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Onay */}
                    {currentStep === 4 && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-8" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)' }}>
                            <h2
                                className="text-xl font-bold text-[#202023] mb-2 text-center"
                                style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                                Onay Detayları
                            </h2>
                            <p className="text-sm text-gray-500 mb-8 text-center" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                Aşağıda verilmiş bilgiler doğrultusunda marka doğrulama başvurunuz alınmıştır.<br />
                                Ekiplerimize incelenerek size mail ile ortalama 48 saat içerisinde dönüş yapılacaktır.
                            </p>

                            {/* Summary Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Marka</p>
                                    <p className="font-medium text-[#202023]">{formData.companyName || '-'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Yetkili</p>
                                    <p className="font-medium text-[#202023]">{formData.requesterName || '-'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">İmza Sirküleri</p>
                                    <p className="font-medium text-[#202023]">{formData.signatureUrls || '-'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Telefon Numarası</p>
                                    <p className="font-medium text-[#202023]">{formData.requesterPhoneNumber || '-'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Adres</p>
                                    <p className="font-medium text-[#202023]">{formData.address || '-'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Mersis Numarası</p>
                                    <p className="font-medium text-[#202023]">{formData.mernisNo || '-'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">Şehir</p>
                                    <p className="font-medium text-[#202023]">{formData.city || '-'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-500">İlçe</p>
                                    <p className="font-medium text-[#202023]">{formData.district || '-'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                                    <p className="text-sm text-gray-500">Posta Kodu</p>
                                    <p className="font-medium text-[#202023]">{formData.postalCode || '-'}</p>
                                </div>
                            </div>

                            {/* Success Message */}
                            <div className="text-center p-6 bg-[#E8FAF9] rounded-xl border border-[#2EC4B6]/20">
                                <div className="w-12 h-12 bg-[#2EC4B6] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3
                                    className="text-xl font-bold text-[#2EC4B6] mb-2"
                                    style={{ fontFamily: 'Metropolis, sans-serif' }}
                                >
                                    Tebrikler! Marka doğrulama başvurunuz onaylandı
                                </h3>
                                <p className="text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
                                    Ekibimiz tarafından incelenecek ve size en kısa sürede mail yoluyla bilgi verilecek.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full mt-6 px-8 py-3 rounded-lg bg-[#2d1b69] text-white font-semibold transition-all hover:opacity-90"
                                style={{ fontFamily: 'Metropolis, sans-serif' }}
                            >
                                Ana Sayfaya Dön
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CompanySignup;
