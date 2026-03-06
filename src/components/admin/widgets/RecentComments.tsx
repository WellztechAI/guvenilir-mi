import React, { useState } from 'react';
import { Star, Copy, Info, Paperclip, MessageCircle, X, Check } from 'lucide-react';

interface CommentItem {
    id: string;
    email: string;
    time: string;
    title: string;
    description: string;
    isStarred: boolean;
    avatarColor: string;
}

const placeholderComments: CommentItem[] = [
    {
        id: '1',
        email: 'kevinhard@mail.com',
        time: '24 min ago',
        title: 'Pandemi döneminde çalışma sürenizi nasıl yönetirsiniz',
        description:
            'Gönderilen yorum içeriği burada görüntülenecektir. Kullanıcı deneyimlerini, şikayetlerini veya önerilerini içeren bu yorumlar moderasyon sürecinden geçirilmektedir...',
        isStarred: true,
        avatarColor: 'bg-purple-500',
    },
    {
        id: '2',
        email: 'joannahistepu@mail.com',
        time: 'Yesterday, at 11:24 AM',
        title: 'Çalışmanızı 10 dakika sonra kaydetmeyi unutmayın',
        description:
            'Gönderilen yorum içeriği burada görüntülenecektir. Kullanıcı deneyimlerini, şikayetlerini veya önerilerini içeren bu yorumlar moderasyon sürecinden geçirilmektedir...',
        isStarred: false,
        avatarColor: 'bg-orange-400',
    },
    {
        id: '3',
        email: 'machelgreen@mail.com',
        time: 'October 25th, 2020  08:55 AM',
        title: 'Devletten gelen önemli belge',
        description:
            'Gönderilen yorum içeriği burada görüntülenecektir. Kullanıcı deneyimlerini, şikayetlerini veya önerilerini içeren bu yorumlar moderasyon sürecinden geçirilmektedir...',
        isStarred: false,
        avatarColor: 'bg-purple-500',
    },
];

const RecentComments: React.FC = () => {
    const [activeTab, setActiveTab] = useState('seen');

    const tabs = [
        { id: 'seen', label: 'Görülenler', icon: <MessageCircle size={14} /> },
        { id: 'unapproved', label: 'Onaylanmamış', icon: <X size={14} /> },
        { id: 'revised', label: 'Revize', icon: <Check size={14} /> },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-5 pb-0">
                <div>
                    <h2 className="text-lg font-bold text-[#202023]">Son Yorumlar</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Son gelen yorumları buradan takip edebilirsiniz</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mt-4 border-b border-gray-100">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 pb-3 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                ? 'text-purple-600'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-purple-600 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Comment List */}
            <div className="divide-y divide-gray-50">
                {placeholderComments.map((comment) => (
                    <div
                        key={comment.id}
                        className="flex gap-4 p-5 hover:bg-gray-50/50 transition-colors group relative"
                    >
                        {/* Left accent for starred */}
                        {comment.isStarred && (
                            <div className="absolute left-0 top-2 bottom-2 w-1 bg-purple-500 rounded-r" />
                        )}

                        {/* Star */}
                        <button className="mt-1 shrink-0">
                            <Star
                                size={18}
                                className={`transition-colors ${comment.isStarred
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300 hover:text-yellow-400'
                                    }`}
                            />
                        </button>

                        {/* Avatar */}
                        <div className={`w-10 h-10 ${comment.avatarColor} rounded-full shrink-0 mt-0.5`} />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-gray-500">{comment.email}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-gray-400">{comment.time}</span>
                            </div>
                            <h3 className="text-sm font-semibold text-[#202023] mb-1.5">{comment.title}</h3>
                            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                                {comment.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-start gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                <Copy size={16} />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                <Info size={16} />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                <Paperclip size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentComments;
