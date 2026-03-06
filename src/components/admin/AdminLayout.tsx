import React, { useState } from 'react';
import AdminSidebar, { AdminView } from './AdminSidebar';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
    children: (activeView: AdminView) => React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [activeView, setActiveView] = useState<AdminView>('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-[#f5f5fa] overflow-hidden">
            <AdminSidebar
                activeView={activeView}
                onViewChange={setActiveView}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-6">
                    {children(activeView)}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
