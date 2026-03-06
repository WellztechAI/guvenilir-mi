import React, { useState } from 'react';
import {
    MessageSquare,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Star,
    Pin,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    Copy,
    Paperclip,
    MoreVertical,
    Settings,
    LayoutGrid,
    Clock,
    Hash,
    ArrowLeft,
    ThumbsUp,
    Reply,
    Shield,
    Edit,
} from 'lucide-react';

// ============================================
// Types
// ============================================

type CommentFolder = 'new' | 'revised' | 'approved' | 'rejected' | 'pinned';

interface CommentRow {
    id: string;
    authorName: string;
    authorEmail: string;
    authorInitial: string;
    authorColor: string;
    time: string;
    title: string;
    message: string;
    isStarred: boolean;
    isChecked: boolean;
    companyName?: string;
    rating?: number;
}

interface FolderItem {
    id: CommentFolder;
    label: string;
    icon: React.ReactNode;
    count?: number | string;
    iconBg?: string;
}

interface AgentItem {
    name: string;
    dotColor: string;
}

interface TagItem {
    label: string;
    bgColor: string;
    textColor: string;
}

// ============================================
// Placeholder Data
// ============================================

const folders: FolderItem[] = [
    { id: 'new', label: 'Yeni Yorumlar', icon: <MessageSquare size={15} />, count: 17, iconBg: 'bg-purple-500' },
    { id: 'revised', label: 'Revize Yorumlar', icon: <RefreshCw size={15} />, iconBg: 'bg-gray-400' },
    { id: 'approved', label: 'Onaylanmış Yorumlar', icon: <CheckCircle2 size={15} />, count: '87+', iconBg: 'bg-gray-400' },
    { id: 'rejected', label: 'Reddedilmiş Yorumlar', icon: <XCircle size={15} />, iconBg: 'bg-gray-400' },
    { id: 'pinned', label: 'Pinlenmiş Yorumlar', icon: <Star size={15} />, iconBg: 'bg-gray-400' },
];

const agents: AgentItem[] = [
    { name: 'Fuat Han Albar', dotColor: 'bg-green-500' },
    { name: 'Gökhan Çetintaş', dotColor: 'bg-red-500' },
];

const tags: TagItem[] = [
    { label: '#garantibbva', bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
    { label: '#takım', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
    { label: '#tasarım', bgColor: 'bg-green-100', textColor: 'text-green-700' },
    { label: '#dikkalet', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
];

function generateComments(): CommentRow[] {
    return [
        {
            id: '1',
            authorName: 'Fuat Han Albar',
            authorEmail: '',
            authorInitial: 'F',
            authorColor: 'bg-gray-400',
            time: '25 dakika önce',
            title: 'Pandemi döneminde çalışma sürenizi nasıl yönetirsiniz',
            message: 'Gönderilen yorum içeriği burada görüntülenecektir. Kullanıcı deneyimlerini, şikayetlerini veya önerilerini içeren bu yorumlar moderasyon sürecinden geçirilmektedir...',
            isStarred: true,
            isChecked: false,
            companyName: 'MAJORITY - Mobile Banking',
            rating: 4,
        },
        {
            id: '2',
            authorName: '',
            authorEmail: 'allientstudios@mail.com',
            authorInitial: 'A',
            authorColor: 'bg-purple-500',
            time: '24 min ago',
            title: 'Destek talebi #0001241251 ile ilgili takip',
            message: 'Gönderilen yorum içeriği burada görüntülenecektir. Kullanıcı deneyimlerini, şikayetlerini veya önerilerini içeren bu yorumlar moderasyon sürecinden geçirilmektedir...',
            isStarred: true,
            isChecked: true,
        },
        {
            id: '3',
            authorName: '',
            authorEmail: 'kevinhard@mail.com',
            authorInitial: 'K',
            authorColor: 'bg-gray-400',
            time: '24 min ago',
            title: 'Haftalık bakım servisi bilgilendirmesi',
            message: 'Gönderilen yorum içeriği burada görüntülenecektir. Kullanıcı deneyimlerini, şikayetlerini veya önerilerini içeren bu yorumlar moderasyon sürecinden geçirilmektedir...',
            isStarred: false,
            isChecked: false,
        },
        {
            id: '4',
            authorName: '',
            authorEmail: 'machelgreen@mail.com',
            authorInitial: 'M',
            authorColor: 'bg-gray-400',
            time: 'October 25th, 2020  08:55 AM',
            title: 'Devletten gelen önemli belge',
            message: 'Gönderilen yorum içeriği burada görüntülenecektir. Kullanıcı deneyimlerini, şikayetlerini veya önerilerini içeren bu yorumlar moderasyon sürecinden geçirilmektedir...',
            isStarred: true,
            isChecked: false,
        },
        {
            id: '5',
            authorName: '',
            authorEmail: 'joannahistepu@mail.com',
            authorInitial: 'J',
            authorColor: 'bg-blue-500',
            time: 'Yesterday, at 11:24 AM',
            title: 'Çalışmanızı 10 dakika sonra kaydetmeyi unutmayın',
            message: 'Gönderilen yorum içeriği burada görüntülenecektir. Kullanıcı deneyimlerini, şikayetlerini veya önerilerini içeren bu yorumlar moderasyon sürecinden geçirilmektedir...',
            isStarred: false,
            isChecked: true,
        },
        {
            id: '6',
            authorName: '',
            authorEmail: 'hanzelqueen@mail.com',
            authorInitial: 'H',
            authorColor: 'bg-purple-500',
            time: 'October 25th, 2020  08:55 AM',
            title: 'AB Bankasından ödeme alındı',
            message: 'Gönderilen yorum içeriği burada görüntülenecektir. Kullanıcı deneyimlerini, şikayetlerini veya önerilerini içeren bu yorumlar moderasyon sürecinden geçirilmektedir...',
            isStarred: false,
            isChecked: false,
        },
    ];
}

// ============================================
// Comment Detail View
// ============================================

const CommentDetail: React.FC<{ comment: CommentRow; onBack: () => void }> = ({ comment, onBack }) => {
    const replies = [
        {
            id: 'r1',
            type: 'brand' as const,
            label: 'Marka Cevabı',
            avatarColor: 'bg-gray-700',
            initial: 'M',
            message: 'Marka tarafından gelen cevap içeriği burada görüntülenmektedir.',
            likes: 45,
        },
        {
            id: 'r2',
            type: 'user' as const,
            label: 'Kullanıcı Cevabı',
            avatarColor: 'bg-gray-500',
            initial: 'K',
            message: 'Kullanıcının marka cevabına verdiği yanıt burada görüntülenmektedir. Kullanıcı deneyimlerini, şikayetlerini veya önerilerini içeren bu yanıtlar marka ile kullanıcı arasındaki iletişimi sağlamaktadır.',
            likes: 45,
        },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Back + Title + Menu */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <span className="text-sm text-gray-500">Yorum Sistemine Geri Dön</span>
                    </div>
                    <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                        <MoreVertical size={18} />
                    </button>
                </div>

                {/* Comment Title */}
                <div className="px-8 pt-6 pb-4">
                    <h1 className="text-xl font-bold text-[#202023]">
                        {comment.companyName ? `${comment.companyName}'dan ` : ''}Çektiğim Kredi Hk.
                    </h1>
                </div>

                {/* Member Info Row */}
                <div className="px-8 pb-5 flex items-start justify-between">
                    {/* Left: User info */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Üye Bilgileri</p>
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 ${comment.authorColor} rounded-full flex items-center justify-center`}>
                                <span className="text-white font-bold text-sm">{comment.authorInitial}</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-[#202023]">
                                        F*** H*** A****
                                    </p>
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-semibold rounded-full border border-green-200">
                                        <Shield size={10} />
                                        Güven Elçisi
                                    </span>
                                </div>
                            </div>
                            <button className="ml-4 flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                                <Edit size={12} />
                                Düzenleme Talep Et
                            </button>
                        </div>

                        {/* Timestamp */}
                        <div className="flex items-center gap-2 mt-3">
                            <Clock size={13} className="text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-400">Yorumun Gönderildiği Zaman</p>
                                <p className="text-xs text-purple-500 font-medium">19 Kasım 2024 13:50</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Company + Responsible */}
                    <div className="text-right">
                        <div className="flex items-center gap-3 justify-end mb-4">
                            <div>
                                <p className="text-sm font-bold text-[#202023]">Circle Hunt</p>
                                <p className="text-xs text-gray-400">Kreatif Ajans</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-teal-400 rounded-2xl" />
                        </div>
                        <div className="flex items-center gap-3 justify-end">
                            <div>
                                <p className="text-sm font-bold text-[#202023]">Fuat Han Albar</p>
                                <p className="text-xs text-gray-400">Marka/Topluluk Sorumlusu</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                FA
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="mx-8 h-px bg-gray-100" />

                {/* Comment Body */}
                <div className="px-8 py-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Yorum Detayları</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {comment.message} {comment.message}
                    </p>

                    {/* Rating */}
                    {comment.rating && (
                        <div className="flex gap-1.5 mt-4">
                            {['bg-green-400', 'bg-green-400', 'bg-green-400', 'bg-green-400', 'bg-green-400', 'bg-gray-300'].map((c, i) => (
                                <div key={i} className={`w-7 h-7 ${i < comment.rating! ? 'bg-green-400' : 'bg-gray-200'} rounded-md`} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="mx-8 h-px bg-gray-100" />

                {/* Reply Thread */}
                <div className="px-8 py-5">
                    <div className="flex items-center gap-3 mb-5">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Yorum Akışı</p>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-purple-200 bg-purple-50 rounded-lg text-xs text-purple-600 font-semibold hover:bg-purple-100 transition-colors">
                            En Son Yorumlar
                            <ChevronDown size={12} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                                {/* Avatar */}
                                <div className={`w-9 h-9 ${reply.avatarColor} rounded-full flex items-center justify-center shrink-0 mt-0.5`}>
                                    <span className="text-white font-bold text-xs">{reply.initial}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-[#202023] mb-1">{reply.label}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{reply.message}</p>

                                    {/* Actions */}
                                    <div className="flex items-center gap-4 mt-2">
                                        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-600 transition-colors">
                                            <ThumbsUp size={13} />
                                            {reply.likes} Beğeni
                                        </button>
                                        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-600 transition-colors">
                                            <Reply size={13} />
                                            Yanıtla
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// Component
// ============================================

const CommentsPanel: React.FC = () => {
    const [activeFolder, setActiveFolder] = useState<CommentFolder>('new');
    const [activeTab, setActiveTab] = useState<'recent' | 'pending'>('recent');
    const [comments, setComments] = useState<CommentRow[]>(generateComments);
    const [selectedComment, setSelectedComment] = useState<CommentRow | null>(comments[0] || null);
    const [detailComment, setDetailComment] = useState<CommentRow | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [actionToast, setActionToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const totalPages = 4;

    const toggleStar = (id: string) => {
        setComments((prev) =>
            prev.map((c) => (c.id === id ? { ...c, isStarred: !c.isStarred } : c))
        );
    };

    const toggleCheck = (id: string) => {
        setComments((prev) =>
            prev.map((c) => (c.id === id ? { ...c, isChecked: !c.isChecked } : c))
        );
    };

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setActionToast({ message, type });
        setTimeout(() => setActionToast(null), 2500);
    };

    const removeComment = (id: string) => {
        setComments((prev) => {
            const idx = prev.findIndex((c) => c.id === id);
            const next = prev.filter((c) => c.id !== id);
            if (selectedComment?.id === id) {
                setSelectedComment(next[idx] || next[idx - 1] || null);
            }
            return next;
        });
    };

    const handleApprove = () => {
        if (!selectedComment) return;
        showToast(`"${selectedComment.title}" onaylandı.`, 'success');
        removeComment(selectedComment.id);
    };

    const handleReject = () => {
        if (!selectedComment) return;
        showToast(`"${selectedComment.title}" reddedildi.`, 'error');
        removeComment(selectedComment.id);
    };

    const handleRevise = () => {
        if (!selectedComment) return;
        showToast(`"${selectedComment.title}" revize için gönderildi.`, 'info');
        removeComment(selectedComment.id);
    };

    // Show detail view
    if (detailComment) {
        return <CommentDetail comment={detailComment} onBack={() => setDetailComment(null)} />;
    }

    return (
        <div className="flex gap-0 h-[calc(100vh-72px-48px)] -m-6 relative">
            {/* Toast */}
            {actionToast && (
                <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold text-white transition-all ${
                    actionToast.type === 'success' ? 'bg-green-500' :
                    actionToast.type === 'error' ? 'bg-red-500' : 'bg-purple-500'
                }`}>
                    {actionToast.message}
                </div>
            )}
            {/* ============================== */}
            {/* LEFT: Folders Sidebar */}
            {/* ============================== */}
            <div className="w-[240px] bg-white border-r border-gray-100 flex flex-col shrink-0 overflow-y-auto p-4">
                {/* FOLDERS */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Klasörler</span>
                        <ChevronRight size={14} className="text-purple-500" />
                    </div>
                    <div className="space-y-0.5">
                        {folders.map((folder) => {
                            const isActive = activeFolder === folder.id;
                            return (
                                <button
                                    key={folder.id}
                                    onClick={() => setActiveFolder(folder.id)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive
                                        ? 'bg-purple-50 text-purple-700 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className={`w-6 h-6 ${isActive ? 'bg-purple-500' : folder.iconBg} rounded-md flex items-center justify-center text-white shrink-0`}>
                                        {folder.icon}
                                    </span>
                                    <span className="flex-1 text-left truncate">{folder.label}</span>
                                    {folder.count && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'
                                            }`}>
                                            {folder.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* AGENTS */}
                <div className="mb-6">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-3 px-1">
                        Güvenilir Mi Agent
                    </span>
                    <div className="space-y-1">
                        {agents.map((agent) => (
                            <div key={agent.name} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className={`w-3 h-3 ${agent.dotColor} rounded-full shrink-0`} />
                                <span className="text-sm text-gray-700">{agent.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TAGS */}
                <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-3 px-1">
                        Etiketler
                    </span>
                    <div className="flex flex-wrap gap-2 px-1">
                        {tags.map((tag) => (
                            <span
                                key={tag.label}
                                className={`${tag.bgColor} ${tag.textColor} text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-80 transition-opacity`}
                            >
                                {tag.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ============================== */}
            {/* CENTER: Comment List */}
            {/* ============================== */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                {/* Tabs Header */}
                <div className="flex items-center justify-between px-5 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-1">
                        {/* Select All Checkbox */}
                        <div className="pr-4 py-3">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                            />
                        </div>

                        {/* Tabs */}
                        <button
                            onClick={() => setActiveTab('recent')}
                            className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium transition-colors relative ${activeTab === 'recent' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <MessageSquare size={15} />
                            En Son Yorumlar
                            {activeTab === 'recent' && (
                                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-purple-600 rounded-t-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium transition-colors relative ${activeTab === 'pending' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            <Clock size={15} />
                            Bekleyen Yorumlar
                            {activeTab === 'pending' && (
                                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-purple-600 rounded-t-full" />
                            )}
                        </button>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                            <LayoutGrid size={16} />
                        </button>
                        <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                            <Settings size={16} />
                        </button>
                        <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                </div>

                {/* Comment Rows */}
                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                    {comments.map((comment) => {
                        const isSelected = selectedComment?.id === comment.id;
                        return (
                            <div
                                key={comment.id}
                                onClick={() => setDetailComment(comment)}
                                className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors group ${isSelected ? 'bg-purple-50/60' : 'hover:bg-gray-50/70'
                                    }`}
                            >
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={comment.isChecked}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        toggleCheck(comment.id);
                                    }}
                                    className="w-4 h-4 mt-1.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer shrink-0"
                                />

                                {/* Star */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleStar(comment.id);
                                    }}
                                    className="mt-1 shrink-0"
                                >
                                    <Star
                                        size={16}
                                        className={`transition-colors ${comment.isStarred
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300 hover:text-yellow-400'
                                            }`}
                                    />
                                </button>

                                {/* Avatar */}
                                <div className={`w-8 h-8 ${comment.authorColor} rounded-full flex items-center justify-center shrink-0 mt-0.5`}>
                                    <span className="text-white font-bold text-xs">{comment.authorInitial}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-sm text-gray-600 font-medium truncate">
                                            {comment.authorName || comment.authorEmail}
                                        </span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-xs text-gray-400 shrink-0">{comment.time}</span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-[#202023] mb-1 truncate">
                                        {comment.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                        {comment.message}
                                    </p>
                                </div>

                                {/* Action Icons (on hover) */}
                                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                                    <button
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <Copy size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <Paperclip size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <MoreVertical size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end px-5 py-3 border-t border-gray-100 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:border-purple-300 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        {[1, 2, 3, 4].map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-semibold transition-colors ${currentPage === page
                                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                                    : 'border border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:border-purple-300 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ============================== */}
            {/* RIGHT: Detail Panel */}
            {/* ============================== */}
            {selectedComment && (
                <div className="w-[280px] bg-white border-l border-gray-100 flex flex-col shrink-0 overflow-y-auto">
                    {/* Company Info */}
                    {selectedComment.companyName && (
                        <div className="p-5 border-b border-gray-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-semibold text-[#202023] truncate">{selectedComment.companyName}</span>
                                        <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                                    </div>
                                    {selectedComment.rating && (
                                        <div className="flex gap-0.5 mt-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    size={12}
                                                    className={s <= selectedComment.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Comment Detail */}
                    <div className="p-5 flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <div className={`w-8 h-8 ${selectedComment.authorColor} rounded-full flex items-center justify-center shrink-0`}>
                                <span className="text-white font-bold text-xs">{selectedComment.authorInitial}</span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-[#202023] truncate">
                                    {selectedComment.authorName || selectedComment.authorEmail}
                                </p>
                                <p className="text-xs text-gray-400">{selectedComment.time}</p>
                            </div>
                        </div>

                        <h3 className="text-sm font-bold text-[#202023] mb-3">{selectedComment.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{selectedComment.message}</p>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={handleApprove}
                                className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                                Onayla
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                                Reddet
                            </button>
                        </div>
                        <button
                            onClick={handleRevise}
                            className="w-full mt-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-lg transition-colors"
                        >
                            Revize İste
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentsPanel;
