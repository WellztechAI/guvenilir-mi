import React, { useState, useEffect } from 'react';
import {
    Search,
    LayoutGrid,
    List,
    Plus,
    Phone,
    Mail,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Building2,
    CheckCircle2,
    Clock,
    XCircle,
    ArrowLeft,
    Star,
    Award,
    MessageSquare,
    MapPin,
    FileText,
    User,
    Globe,
    Calendar,
    Shield,
} from 'lucide-react';
import { fetchAllCompanyVerifications } from '@/services/adminService';
import { CompanyVerification } from '@/types';

// ============================================
// Types
// ============================================

type BrandTab = 'all' | 'approved' | 'pending' | 'rejected';

interface BrandCardData {
    id: string;
    name: string;
    sector: string;
    phone: string;
    email: string;
    status: string;
    avatarColor: string;
    badgeColor: string;
}

// ============================================
// Placeholder generator
// ============================================

function generatePlaceholderBrands(): BrandCardData[] {
    const sectors = [
        'Bankacılık ve Finans',
        'Teknoloji',
        'E-Ticaret',
        'Sağlık',
        'Eğitim',
        'Gıda',
        'Lojistik',
        'Perakende',
        'Sigortacılık',
        'Telekomünikasyon',
    ];
    const names = [
        'Garanti BBVA',
        'İş Bankası',
        'Turkcell',
        'THY',
        'Trendyol',
        'Hepsiburada',
        'Migros',
        'BIM',
        'Akbank',
        'Vodafone',
        'Yemeksepeti',
        'Getir',
        'N11',
        'Sahibinden',
        'Koçtaş',
        'LC Waikiki',
        'DeFacto',
        'Eczacıbaşı',
        'Arçelik',
        'Vestel',
        'Pegasus',
        'PTT',
        'Enerjisa',
        'Karaca',
        'MediaMarkt',
        'Watsons',
        'Boyner',
        'CarrefourSA',
        'Dominos',
        'Burger King TR',
        'Starbucks TR',
        'D&R',
        'Kitapyurdu',
        'Zara TR',
        'H&M TR',
        'Nike TR',
        'Adidas TR',
        'Samsung TR',
        'Apple TR',
        'Mavi',
        'Koton',
        'Gratis',
        'Rossmann',
        'ebebek',
        'Çiçeksepeti',
        'Letgo',
    ];
    const statuses = [
        'approved', 'approved', 'approved', 'approved', 'approved',
        'approved', 'approved', 'approved', 'approved', 'approved',
        'pending', 'pending', 'pending', 'pending', 'pending',
        'pending', 'pending', 'pending',
        'rejected', 'rejected', 'rejected', 'rejected', 'rejected',
        'approved', 'approved', 'approved', 'approved', 'approved',
        'approved', 'approved', 'approved',
        'pending', 'pending', 'pending', 'pending',
        'approved', 'approved', 'approved', 'approved', 'approved',
        'approved', 'approved', 'approved', 'approved', 'approved',
        'pending',
    ];
    const avatarColors = [
        'bg-purple-100', 'bg-blue-100', 'bg-green-100', 'bg-orange-100',
        'bg-pink-100', 'bg-indigo-100', 'bg-teal-100', 'bg-rose-100',
    ];
    const badgeColors = [
        'bg-green-500', 'bg-purple-500', 'bg-blue-500', 'bg-orange-500',
        'bg-pink-500', 'bg-teal-500',
    ];

    return names.map((name, i) => ({
        id: `brand-${i}`,
        name,
        sector: sectors[i % sectors.length],
        phone: '+90 212 000 00 00',
        email: `ahmet@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        status: statuses[i % statuses.length],
        avatarColor: avatarColors[i % avatarColors.length],
        badgeColor: badgeColors[i % badgeColors.length],
    }));
}

const ITEMS_PER_PAGE = 15;

// ============================================
// Brand Detail View
// ============================================

const BrandDetail: React.FC<{ brand: BrandCardData; onBack: () => void }> = ({ brand, onBack }) => {
    // Placeholder verification data matching CompanyVerification model
    const verification = {
        requesterName: 'Ahmet Yalçın',
        requesterTitle: 'Marka Müdürü',
        requesterCompanyEmail: `iletisim@${brand.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        requesterPhoneNumber: '+90 212 555 00 00',
        panelUserName: 'Fuat Han Albar',
        membership: 'premium' as const,
        address: 'Barbaros Bulvarı No:123',
        city: 'İstanbul',
        district: 'Beşiktaş',
        postalCode: '34353',
    };

    // Placeholder comments
    const recentComments = [
        { id: 'c1', author: 'Mehmet K.', rating: 4, message: 'Hizmetten genel olarak memnunum, müşteri desteği hızlı dönüş yapıyor.', date: '2 gün önce' },
        { id: 'c2', author: 'Ayşe D.', rating: 2, message: 'Kargo süresi çok uzun, ürün hasarlı geldi. İade süreci de sorunlu.', date: '5 gün önce' },
        { id: 'c3', author: 'Ali R.', rating: 5, message: 'Mükemmel hizmet, kesinlikle tavsiye ederim. Fiyat-performans oranı çok iyi.', date: '1 hafta önce' },
    ];

    const membershipLabels: Record<string, { label: string; color: string }> = {
        free: { label: 'Ücretsiz', color: 'bg-gray-100 text-gray-600 border-gray-200' },
        basic: { label: 'Temel', color: 'bg-blue-50 text-blue-600 border-blue-200' },
        premium: { label: 'Premium', color: 'bg-purple-50 text-purple-600 border-purple-200' },
        enterprise: { label: 'Kurumsal', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    };

    const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
        approved: { label: 'Onaylı', color: 'bg-green-50 text-green-600 border-green-200', icon: <CheckCircle2 size={13} /> },
        pending: { label: 'Onay Bekliyor', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <Clock size={13} /> },
        rejected: { label: 'Reddedildi', color: 'bg-red-50 text-red-600 border-red-200', icon: <XCircle size={13} /> },
    };

    const st = statusConfig[brand.status] || statusConfig.pending;
    const mem = membershipLabels[verification.membership] || membershipLabels.free;

    return (
        <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="text-2xl font-bold text-[#202023]">Marka Detayı</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${st.color}`}>
                            {st.icon}
                            {st.label}
                        </span>
                        <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Company Info */}
                <div className="grid grid-cols-3 gap-6 px-8 py-6">
                    {/* Left: Brand Identity */}
                    <div className="col-span-1">
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-24 h-24 ${brand.avatarColor} rounded-2xl flex items-center justify-center mb-3 relative`}>
                                <Building2 size={40} className="text-gray-400" />
                                <div className={`absolute -bottom-1.5 -right-1.5 w-7 h-7 ${brand.badgeColor} rounded-full border-2 border-white flex items-center justify-center`}>
                                    <span className="text-[9px] font-bold text-white">{brand.name.substring(0, 2).toUpperCase()}</span>
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-[#202023]">{brand.name}</h2>
                            <p className="text-sm text-purple-500 font-medium">{brand.sector}</p>

                            <div className="space-y-2 mt-4 w-full">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Phone size={14} className="text-purple-400 shrink-0" />
                                    <span>{brand.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Mail size={14} className="text-purple-400 shrink-0" />
                                    <span className="truncate">{brand.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Globe size={14} className="text-purple-400 shrink-0" />
                                    <span>www.{brand.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar size={14} className="text-purple-400 shrink-0" />
                                    <span>Kayıt: 15 Ocak 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center + Right: Stats + Details */}
                    <div className="col-span-2">
                        {/* Stats Row */}
                        <div className="grid grid-cols-4 gap-3 mb-6">
                            <div className="bg-purple-50 rounded-xl p-3 text-center">
                                <Star size={18} className="text-purple-500 mx-auto mb-1" />
                                <p className="text-lg font-bold text-[#202023]">4.2</p>
                                <p className="text-[10px] text-gray-400 uppercase font-semibold">Puan</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-3 text-center">
                                <MessageSquare size={18} className="text-blue-500 mx-auto mb-1" />
                                <p className="text-lg font-bold text-[#202023]">127</p>
                                <p className="text-[10px] text-gray-400 uppercase font-semibold">Yorum</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-3 text-center">
                                <Award size={18} className="text-green-500 mx-auto mb-1" />
                                <p className="text-lg font-bold text-[#202023]">Premium</p>
                                <p className="text-[10px] text-gray-400 uppercase font-semibold">Üyelik</p>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-3 text-center">
                                <User size={18} className="text-orange-500 mx-auto mb-1" />
                                <p className="text-lg font-bold text-[#202023]">3,450</p>
                                <p className="text-[10px] text-gray-400 uppercase font-semibold">Ziyaretçi</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Açıklama</p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {brand.name}, Türkiye'nin önde gelen {brand.sector.toLowerCase()} sektöründe faaliyet gösteren bir markadır.
                                Müşteri memnuniyetini ön planda tutarak, kaliteli hizmet ve ürünler sunmayı hedeflemektedir.
                            </p>
                        </div>

                        {/* Verification Details */}
                        <div className="bg-gray-50 rounded-xl p-5">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Doğrulama Bilgileri</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Talep Eden</p>
                                    <p className="text-sm font-semibold text-[#202023]">{verification.requesterName}</p>
                                    <p className="text-xs text-gray-400">{verification.requesterTitle}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Panel Sorumlusu</p>
                                    <p className="text-sm font-semibold text-[#202023]">{verification.panelUserName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Kurumsal E-posta</p>
                                    <p className="text-sm text-gray-600">{verification.requesterCompanyEmail}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Telefon</p>
                                    <p className="text-sm text-gray-600">{verification.requesterPhoneNumber}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Adres</p>
                                    <p className="text-sm text-gray-600">
                                        {verification.address}, {verification.district}, {verification.city} {verification.postalCode}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Üyelik Tipi</p>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${mem.color}`}>
                                        <Shield size={11} />
                                        {mem.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gradient Divider */}
                <div className="mx-8 h-1 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400" />

                {/* Recent Comments */}
                <div className="px-8 py-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Son Yorumlar</p>
                    <div className="space-y-3">
                        {recentComments.map((c) => (
                            <div key={c.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                                <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-purple-600 font-bold text-xs">{c.author[0]}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-sm font-semibold text-[#202023]">{c.author}</span>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={10} className={s <= c.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-400 ml-auto">{c.date}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">{c.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-8 pb-6 flex gap-3">
                    {brand.status === 'pending' && (
                        <>
                            <button className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors">
                                Onayla
                            </button>
                            <button className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors">
                                Reddet
                            </button>
                        </>
                    )}
                    {brand.status === 'approved' && (
                        <button className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors">
                            Askıya Al
                        </button>
                    )}
                    {brand.status === 'rejected' && (
                        <button className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors">
                            Yeniden Onayla
                        </button>
                    )}
                    <button className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-xl transition-colors">
                        Düzenle
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================
// Component
// ============================================

const BrandsGrid: React.FC = () => {
    const [activeTab, setActiveTab] = useState<BrandTab>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [brands] = useState<BrandCardData[]>(generatePlaceholderBrands);
    const [detailBrand, setDetailBrand] = useState<BrandCardData | null>(null);

    // Reset page when tab or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm]);

    // Filter brands
    const filteredBrands = brands.filter((b) => {
        const matchesSearch =
            !searchTerm || b.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab =
            activeTab === 'all' || b.status === activeTab;
        return matchesSearch && matchesTab;
    });

    // Pagination
    const totalItems = filteredBrands.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedBrands = filteredBrands.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    // Tab counts
    const counts = {
        all: brands.length,
        approved: brands.filter((b) => b.status === 'approved').length,
        pending: brands.filter((b) => b.status === 'pending').length,
        rejected: brands.filter((b) => b.status === 'rejected').length,
    };

    const tabs: { id: BrandTab; label: string; icon: React.ReactNode; color: string }[] = [
        { id: 'all', label: 'Tümü', icon: <Building2 size={15} />, color: 'purple' },
        { id: 'approved', label: 'Onaylı', icon: <CheckCircle2 size={15} />, color: 'green' },
        { id: 'pending', label: 'Onay Bekleyen', icon: <Clock size={15} />, color: 'yellow' },
        { id: 'rejected', label: 'Reddedilen', icon: <XCircle size={15} />, color: 'red' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-semibold rounded-full border border-green-200">
                        <CheckCircle2 size={10} /> Onaylı
                    </span>
                );
            case 'pending':
                return (
                    <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-semibold rounded-full border border-yellow-200">
                        <Clock size={10} /> Beklemede
                    </span>
                );
            case 'rejected':
                return (
                    <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-semibold rounded-full border border-red-200">
                        <XCircle size={10} /> Reddedildi
                    </span>
                );
            default:
                return null;
        }
    };

    // Show detail view
    if (detailBrand) {
        return <BrandDetail brand={detailBrand} onBack={() => setDetailBrand(null)} />;
    }

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#202023]">Markalar</h1>
                    <p className="text-sm text-gray-400 mt-1">Kayıtlı markaları yönetin</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative w-[240px]">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Marka Ara"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all"
                        />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 transition-colors ${viewMode === 'list'
                                ? 'bg-purple-50 text-purple-600'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <List size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 transition-colors ${viewMode === 'grid'
                                ? 'bg-purple-50 text-purple-600'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>

                    {/* Add Brand Button */}
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm shadow-purple-200">
                        <Plus size={16} />
                        Marka Ekle
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive
                                ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                                : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                            <span
                                className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                                    }`}
                            >
                                {counts[tab.id]}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Brand Grid */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-5 gap-4 mb-6">
                    {paginatedBrands.map((brand) => (
                        <div
                            key={brand.id}
                            onClick={() => setDetailBrand(brand)}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group relative cursor-pointer"
                        >
                            {/* Status Badge */}
                            {getStatusBadge(brand.status)}

                            {/* Three dot menu */}
                            <button className="absolute top-3 left-3 p-1 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all">
                                <MoreVertical size={16} />
                            </button>

                            {/* Avatar Section */}
                            <div className="flex flex-col items-center pt-6 pb-4 px-4">
                                <div className={`w-16 h-16 ${brand.avatarColor} rounded-2xl flex items-center justify-center mb-1 relative`}>
                                    <Building2 size={28} className="text-gray-400" />
                                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${brand.badgeColor} rounded-full border-2 border-white flex items-center justify-center`}>
                                        <span className="text-[8px] font-bold text-white">
                                            {brand.name.substring(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-[#202023] mt-2 text-center truncate w-full">
                                    {brand.name}
                                </h3>
                                <p className="text-xs text-purple-500 font-medium mt-0.5 text-center truncate w-full">
                                    {brand.sector}
                                </p>
                            </div>

                            {/* Info Section */}
                            <div className="px-4 pb-4 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Phone size={12} className="text-purple-400 shrink-0" />
                                    <span className="truncate">{brand.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Mail size={12} className="text-purple-400 shrink-0" />
                                    <span className="truncate">{brand.email}</span>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="px-4 pb-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDetailBrand(brand); }}
                                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                >
                                    Detaylı İncele
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                                    Marka
                                </th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                                    Sektör
                                </th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                                    Telefon
                                </th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                                    E-posta
                                </th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                                    Durum
                                </th>
                                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                                    İşlem
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedBrands.map((brand) => (
                                <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setDetailBrand(brand)}>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 ${brand.avatarColor} rounded-xl flex items-center justify-center relative`}>
                                                <Building2 size={16} className="text-gray-400" />
                                                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${brand.badgeColor} rounded-full border-2 border-white`} />
                                            </div>
                                            <span className="text-sm font-semibold text-[#202023]">{brand.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-sm text-purple-500 font-medium">{brand.sector}</td>
                                    <td className="px-5 py-3 text-sm text-gray-500">{brand.phone}</td>
                                    <td className="px-5 py-3 text-sm text-gray-500">{brand.email}</td>
                                    <td className="px-5 py-3">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full ${brand.status === 'approved'
                                                ? 'bg-green-50 text-green-600 border border-green-200'
                                                : brand.status === 'pending'
                                                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                                    : 'bg-red-50 text-red-600 border border-red-200'
                                                }`}
                                        >
                                            {brand.status === 'approved' && <><CheckCircle2 size={10} /> Onaylı</>}
                                            {brand.status === 'pending' && <><Clock size={10} /> Beklemede</>}
                                            {brand.status === 'rejected' && <><XCircle size={10} /> Reddedildi</>}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setDetailBrand(brand); }}
                                            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                        >
                                            Detaylı İncele
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    <span className="font-semibold text-[#202023]">{totalItems}</span> markadan{' '}
                    <span className="font-semibold text-[#202023]">
                        {Math.min(ITEMS_PER_PAGE, paginatedBrands.length)}
                    </span>{' '}
                    marka gösteriliyor
                </p>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:border-purple-300 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const page = i + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${currentPage === page
                                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                                    : 'border border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600'
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:border-purple-300 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BrandsGrid;
