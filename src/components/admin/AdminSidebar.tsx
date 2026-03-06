import React, { useState } from 'react';
import {
    Home,
    Building2,
    Users,
    MessageSquare,
    FileText,
    Settings,
    Menu,
    Check,
    ChevronRight,
} from 'lucide-react';

export type AdminView =
    | 'dashboard'
    | 'brands'
    | 'users'
    | 'comments'
    | 'invoices'
    | 'settings';

interface SidebarItem {
    id: AdminView;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
    isNew?: boolean;
    hasSubmenu?: boolean;
}

const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Anasayfa', icon: <Home size={20} /> },
    { id: 'brands', label: 'Markalar', icon: <Building2 size={20} />, badge: 11, badgeColor: 'bg-purple-500' },
    { id: 'users', label: 'Kullanıcılar', icon: <Users size={20} /> },
    { id: 'comments', label: 'Yorumlar', icon: <MessageSquare size={20} />, hasSubmenu: true },
    { id: 'invoices', label: 'Faturalar', icon: <FileText size={20} />, isNew: true },
    { id: 'settings', label: 'Ayarlar', icon: <Settings size={20} /> },
];

interface AdminSidebarProps {
    activeView: AdminView;
    onViewChange: (view: AdminView) => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
    activeView,
    onViewChange,
    collapsed,
    onToggleCollapse,
}) => {
    const [submenuOpen, setSubmenuOpen] = useState(false);

    return (
        <aside
            className={`${collapsed ? 'w-[72px]' : 'w-[240px]'
                } bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shrink-0`}
        >
            {/* Logo Area */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
                <button
                    onClick={onToggleCollapse}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <Menu size={22} />
                </button>
                {!collapsed && (
                    <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center">
                            <Check size={14} className="text-white" />
                        </div>
                        <span className="text-[15px] font-bold text-[#202023]">güvenilir mi?</span>
                    </div>
                )}
            </div>

            {/* Menu Label */}
            {!collapsed && (
                <div className="px-5 pt-6 pb-2">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Menü
                    </span>
                </div>
            )}

            {/* Menu Items */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                        <div key={item.id}>
                            <button
                                onClick={() => {
                                    onViewChange(item.id);
                                    if (item.hasSubmenu) setSubmenuOpen(!submenuOpen);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                    ? 'bg-purple-50 text-purple-700'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                    }`}
                            >
                                <span
                                    className={`${isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'
                                        } transition-colors`}
                                >
                                    {item.icon}
                                </span>
                                {!collapsed && (
                                    <>
                                        <span className="flex-1 text-left">{item.label}</span>
                                        {item.badge && (
                                            <span
                                                className={`${item.badgeColor || 'bg-gray-500'
                                                    } text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center`}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                        {item.isNew && (
                                            <span className="bg-green-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                NEW
                                            </span>
                                        )}
                                        {item.hasSubmenu && (
                                            <ChevronRight
                                                size={16}
                                                className={`text-gray-400 transition-transform duration-200 ${submenuOpen && isActive ? 'rotate-90' : ''
                                                    }`}
                                            />
                                        )}
                                    </>
                                )}
                            </button>

                            {/* Submenu */}
                            {item.hasSubmenu && submenuOpen && isActive && !collapsed && (
                                <div className="ml-9 mt-1 space-y-1">
                                    <button className="w-full text-left text-sm text-gray-500 hover:text-purple-600 py-1.5 px-3 rounded-lg hover:bg-purple-50 transition-colors">
                                        Onay Bekleyen
                                    </button>
                                    <button className="w-full text-left text-sm text-gray-500 hover:text-purple-600 py-1.5 px-3 rounded-lg hover:bg-purple-50 transition-colors">
                                        Onaylananlar
                                    </button>
                                    <button className="w-full text-left text-sm text-gray-500 hover:text-purple-600 py-1.5 px-3 rounded-lg hover:bg-purple-50 transition-colors">
                                        Reddedilenler
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

export default AdminSidebar;
