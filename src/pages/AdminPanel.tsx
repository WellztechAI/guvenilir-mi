import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminView } from '@/components/admin/AdminSidebar';
import StatCards from '@/components/admin/widgets/StatCards';
import RecentComments from '@/components/admin/widgets/RecentComments';
import BrandsQuickView from '@/components/admin/widgets/BrandsQuickView';
import BrandsGrid from '@/components/admin/widgets/BrandsGrid';
import UsersGrid from '@/components/admin/widgets/UsersGrid';
import CommentsPanel from '@/components/admin/widgets/CommentsPanel';
import InvoicesTable from '@/components/admin/widgets/InvoicesTable';
import { Download, Calendar, ChevronDown } from 'lucide-react';

// ============================================
// Dashboard View (Anasayfa)
// ============================================

const DashboardView: React.FC = () => (
  <>
    {/* Page Header */}
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-[#202023]">Analizler</h1>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 transition-colors shadow-sm">
          <Calendar size={16} className="text-purple-500" />
          <span className="font-medium">Dönem Seçin</span>
          <span className="text-gray-400 text-xs ml-1">August 28th - October 28th, 2020</span>
          <ChevronDown size={16} className="text-gray-400 ml-1" />
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm shadow-purple-200">
          <Download size={16} />
          Raporu İndirin
        </button>
      </div>
    </div>

    {/* Stat Cards */}
    <div className="mb-6">
      <StatCards />
    </div>

    {/* Bottom: Comments + Brands Quick View */}
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <RecentComments />
      </div>
      <BrandsQuickView />
    </div>
  </>
);

// ============================================
// Placeholder Views
// ============================================

const PlaceholderView: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-[#202023] mb-2">{title}</h1>
      <p className="text-gray-400">{description}</p>
    </div>
  </div>
);

// ============================================
// View Router
// ============================================

const renderView = (view: AdminView) => {
  switch (view) {
    case 'dashboard':
      return <DashboardView />;
    case 'brands':
      return <BrandsGrid />;
    case 'users':
      return <UsersGrid />;
    case 'comments':
      return <CommentsPanel />;
    case 'invoices':
      return <InvoicesTable />;
    case 'settings':
      return <PlaceholderView title="Ayarlar" description="Ayarlar paneli yakında aktif olacak" />;
    default:
      return <DashboardView />;
  }
};

// ============================================
// Main Admin Panel
// ============================================

const AdminPanel = () => {
  return (
    <AdminLayout>
      {(activeView) => renderView(activeView)}
    </AdminLayout>
  );
};

export default AdminPanel;
