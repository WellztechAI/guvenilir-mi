import React from 'react';
import {
    Search,
    Bell,
    Mail,
    MessageSquare,
    FileText,
} from 'lucide-react';

const AdminHeader: React.FC = () => {
    return (
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
            {/* Search Bar */}
            <div className="relative w-[360px]">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Panelde Ara"
                    className="w-full pl-11 pr-4 py-2.5 bg-[#f5f5fa] border border-gray-200 rounded-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all"
                />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-5">
                {/* Notification Icons */}
                <div className="flex items-center gap-2">
                    <NotifButton icon={<Mail size={20} />} count={12} color="bg-green-500" />
                    <NotifButton icon={<Bell size={20} />} count={4} color="bg-purple-500" />
                    <NotifButton icon={<MessageSquare size={20} />} count={2} color="bg-blue-500" />
                    <NotifButton icon={<FileText size={20} />} count={1} color="bg-orange-500" />
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-200" />

                {/* User Info */}
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        FA
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-[#202023] leading-tight">Fuat Han Albar</p>
                        <p className="text-xs text-gray-400">Süper Yönetici</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

const NotifButton: React.FC<{
    icon: React.ReactNode;
    count: number;
    color: string;
}> = ({ icon, count, color }) => (
    <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
        <span className="text-gray-500">{icon}</span>
        <span
            className={`absolute -top-0.5 -right-0.5 w-5 h-5 ${color} text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white`}
        >
            {count}
        </span>
    </button>
);

export default AdminHeader;
