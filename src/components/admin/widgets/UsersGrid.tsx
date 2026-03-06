import React, { useState, useEffect } from 'react';
import {
    Search,
    LayoutGrid,
    List,
    Phone,
    Mail,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    User,
    MapPin,
    Calendar,
    Heart,
    MessageSquare,
} from 'lucide-react';

// ============================================
// Types
// ============================================

interface UserCardData {
    id: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    joinDate: string;
    commentCount: number;
    favouriteCount: number;
    avatarColor: string;
    initials: string;
}

// ============================================
// Placeholder generator
// ============================================

function generatePlaceholderUsers(): UserCardData[] {
    const firstNames = [
        'Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Ali', 'Zeynep', 'Mustafa', 'Emine',
        'Hüseyin', 'Hatice', 'Hasan', 'Elif', 'İbrahim', 'Merve', 'Yusuf', 'Büşra',
        'Ömer', 'Selin', 'Osman', 'Esra', 'Emre', 'Deniz', 'Can', 'Ece',
        'Burak', 'Aslı', 'Serkan', 'Gizem', 'Onur', 'Pınar', 'Kerem', 'Ceren',
        'Barış', 'Dilara', 'Arda', 'İrem', 'Tolga', 'Beyza', 'Kaan', 'Simge',
        'Cem', 'Tuğçe', 'Mert', 'Damla', 'Berk', 'Hazal', 'Doruk', 'Nehir',
        'Alp', 'Defne', 'Eren', 'Melis', 'Görkem', 'Cansu',
    ];
    const lastNames = [
        'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk',
        'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Koç',
        'Kurt', 'Özkan', 'Şimşek', 'Polat', 'Korkmaz', 'Erdoğan', 'Aksoy', 'Güneş',
        'Acar', 'Balcı', 'Karaca', 'Tunç', 'Sezer', 'Uçar',
    ];
    const countries = [
        'Türkiye', 'Türkiye', 'Türkiye', 'Türkiye', 'Türkiye', 'Türkiye',
        'Almanya', 'Hollanda', 'İngiltere', 'Fransa', 'ABD', 'Belçika',
    ];
    const avatarColors = [
        'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500',
        'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-rose-500',
        'bg-cyan-500', 'bg-amber-500', 'bg-violet-500', 'bg-emerald-500',
    ];

    return firstNames.map((firstName, i) => {
        const lastName = lastNames[i % lastNames.length];
        const fullName = `${firstName} ${lastName}`;
        const emailBase = `${firstName.toLowerCase().replace(/[^a-z]/g, '')}${lastName.toLowerCase().replace(/[^a-z]/g, '')}`;
        const month = ((i * 3) % 12) + 1;
        const year = 2023 + (i % 3);

        return {
            id: `user-${i}`,
            name: fullName,
            email: `${emailBase}@mail.com`,
            phone: `+90 5${String(30 + (i % 60)).padStart(2, '0')} ${String(100 + (i * 7) % 900).padStart(3, '0')} ${String(10 + (i * 3) % 90).padStart(2, '0')} ${String(10 + (i * 11) % 90).padStart(2, '0')}`,
            country: countries[i % countries.length],
            joinDate: `${String(month).padStart(2, '0')}/${year}`,
            commentCount: (i * 7 + 3) % 25,
            favouriteCount: (i * 3 + 1) % 12,
            avatarColor: avatarColors[i % avatarColors.length],
            initials: `${firstName[0]}${lastName[0]}`.toUpperCase(),
        };
    });
}

const ITEMS_PER_PAGE = 15;

// ============================================
// Component
// ============================================

const UsersGrid: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [users] = useState<UserCardData[]>(generatePlaceholderUsers);

    // Reset page on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Filter
    const filteredUsers = users.filter((u) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            u.name.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term) ||
            u.country.toLowerCase().includes(term)
        );
    });

    // Pagination
    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#202023]">Kullanıcılar</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Toplam <span className="font-semibold text-gray-600">{users.length}</span> kayıtlı kullanıcı
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative w-[280px]">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Kullanıcı Ara (isim, email, ülke)"
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
                </div>
            </div>

            {/* ============================== */}
            {/* GRID VIEW */}
            {/* ============================== */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-5 gap-4 mb-6">
                    {paginatedUsers.map((user) => (
                        <div
                            key={user.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group relative"
                        >
                            {/* Three dot menu */}
                            <button className="absolute top-3 right-3 p-1 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all">
                                <MoreVertical size={16} />
                            </button>

                            {/* Avatar */}
                            <div className="flex flex-col items-center pt-6 pb-3 px-4">
                                <div className={`w-16 h-16 ${user.avatarColor} rounded-full flex items-center justify-center mb-2`}>
                                    <span className="text-white font-bold text-lg">{user.initials}</span>
                                </div>
                                <h3 className="text-sm font-bold text-[#202023] text-center truncate w-full">
                                    {user.name}
                                </h3>
                                <p className="text-xs text-purple-500 font-medium mt-0.5 text-center truncate w-full">
                                    {user.country}
                                </p>
                            </div>

                            {/* Info */}
                            <div className="px-4 pb-3 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Mail size={12} className="text-purple-400 shrink-0" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Phone size={12} className="text-purple-400 shrink-0" />
                                    <span className="truncate">{user.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar size={12} className="text-purple-400 shrink-0" />
                                    <span>Katılım: {user.joinDate}</span>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="px-4 pb-3">
                                <div className="flex items-center justify-center gap-4 py-2 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <MessageSquare size={12} className="text-purple-400" />
                                        <span className="font-semibold text-[#202023]">{user.commentCount}</span>
                                        <span>yorum</span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-200" />
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Heart size={12} className="text-pink-400" />
                                        <span className="font-semibold text-[#202023]">{user.favouriteCount}</span>
                                        <span>favori</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="px-4 pb-4">
                                <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors">
                                    Detaylı İncele
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* ============================== */
                /* LIST VIEW */
                /* ============================== */
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                                    Kullanıcı
                                </th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                                    E-posta
                                </th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                                    Telefon
                                </th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                                    Ülke
                                </th>
                                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                                    Katılım
                                </th>
                                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                                    Yorumlar
                                </th>
                                <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                                    Favoriler
                                </th>
                                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                                    İşlem
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 ${user.avatarColor} rounded-full flex items-center justify-center shrink-0`}>
                                                <span className="text-white font-bold text-xs">{user.initials}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-[#202023]">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-sm text-gray-500">{user.email}</td>
                                    <td className="px-5 py-3 text-sm text-gray-500">{user.phone}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                            <MapPin size={13} className="text-purple-400" />
                                            {user.country}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-sm text-gray-500">{user.joinDate}</td>
                                    <td className="px-5 py-3 text-center">
                                        <span className="inline-flex items-center gap-1 text-sm text-gray-600 font-medium">
                                            <MessageSquare size={13} className="text-purple-400" />
                                            {user.commentCount}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <span className="inline-flex items-center gap-1 text-sm text-gray-600 font-medium">
                                            <Heart size={13} className="text-pink-400" />
                                            {user.favouriteCount}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <button className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors">
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
                    <span className="font-semibold text-[#202023]">{totalItems}</span> kullanıcıdan{' '}
                    <span className="font-semibold text-[#202023]">
                        {Math.min(ITEMS_PER_PAGE, paginatedUsers.length)}
                    </span>{' '}
                    kullanıcı gösteriliyor
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

export default UsersGrid;
