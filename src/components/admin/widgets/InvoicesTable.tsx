import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Mail,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Clock,
    Send,
    FileText,
    ArrowLeft,
    Download,
    Printer,
    Phone,
} from 'lucide-react';

// ============================================
// Types
// ============================================

type InvoiceStatus = 'completed' | 'invoice_sent' | 'pending';

interface InvoiceRow {
    id: string;
    invoiceId: string;
    date: string;
    companyName: string;
    companyType: string;
    email: string;
    amount: string;
    status: InvoiceStatus;
    avatarInitial: string;
    avatarColor: string;
}

// ============================================
// Placeholder Data
// ============================================

function generateInvoices(): InvoiceRow[] {
    const companies = [
        { name: 'Higspeed Studios', type: 'Kreatif Ajans', color: 'bg-green-500' },
        { name: 'Portalio Inc.', type: 'Ağ Hizmetleri', color: 'bg-orange-500' },
        { name: 'Jean Graphic Inc.', type: 'Çevrimiçi Mağaza', color: 'bg-purple-500' },
        { name: 'Wedepeloper', type: 'Yazılım Evi', color: 'bg-teal-500' },
        { name: 'Fictiv Home', type: 'Yazılım Evi', color: 'bg-pink-400' },
        { name: 'Humbly Humble', type: 'Oyun Şirketi', color: 'bg-indigo-500' },
        { name: 'Fullspeedo Crew', type: 'Fotoğraf Ajansı', color: 'bg-violet-500' },
        { name: 'Ken Graphic Inc.', type: 'Kreatif Ajans', color: 'bg-amber-500' },
        { name: 'Starter Labs', type: 'Teknoloji Girişimi', color: 'bg-blue-500' },
        { name: 'CloudNine', type: 'SaaS Sağlayıcı', color: 'bg-cyan-500' },
        { name: 'Pixel Perfect', type: 'Tasarım Stüdyosu', color: 'bg-rose-500' },
        { name: 'DataStream Co.', type: 'Analitik', color: 'bg-emerald-500' },
        { name: 'AppForge', type: 'Mobil Geliştirme', color: 'bg-sky-500' },
        { name: 'NetBridge', type: 'Danışmanlık', color: 'bg-lime-600' },
        { name: 'SoundWave Inc.', type: 'Medya Şirketi', color: 'bg-fuchsia-500' },
        { name: 'BuildRight', type: 'İnşaat Teknolojisi', color: 'bg-stone-500' },
        { name: 'FreshMart', type: 'E-Ticaret', color: 'bg-yellow-500' },
        { name: 'EduSpark', type: 'Eğitim Teknolojisi', color: 'bg-red-500' },
        { name: 'GreenLeaf', type: 'Sürdürülebilirlik', color: 'bg-green-600' },
        { name: 'VoltEnergy', type: 'Enerji Sektörü', color: 'bg-orange-600' },
    ];

    const statuses: InvoiceStatus[] = ['completed', 'invoice_sent', 'pending', 'completed', 'pending', 'invoice_sent', 'pending', 'invoice_sent', 'completed', 'completed'];
    const amounts = [
        '650,036.34', '650,036.34', '2,456,221.55', '1,672.45', '800,561.00',
        '245,662.32', '998.45', '700.00', '3,200.00', '12,450.00',
        '89,000.00', '5,400.50', '125,000.00', '34,750.00', '67,200.00',
        '9,100.00', '450,000.00', '22,300.00', '78,600.00', '1,500.00',
    ];
    const dates = [
        'June 1, 2020, 08:22 AM',
        'June 1, 2020, 08:22 AM',
        'June 1, 2020, 08:22 AM',
        'June 1, 2020, 08:22 AM',
        'June 1, 2020, 08:22 AM',
        'June 1, 2020, 08:22 AM',
        'June 1, 2020, 08:22 AM',
        'June 1, 2020, 08:22 AM',
        'May 28, 2020, 03:15 PM',
        'May 27, 2020, 10:30 AM',
        'May 25, 2020, 09:45 AM',
        'May 22, 2020, 01:20 PM',
        'May 20, 2020, 11:00 AM',
        'May 18, 2020, 04:55 PM',
        'May 15, 2020, 07:30 AM',
        'May 12, 2020, 02:10 PM',
        'May 10, 2020, 06:00 PM',
        'May 8, 2020, 12:45 PM',
        'May 5, 2020, 08:20 AM',
        'May 3, 2020, 05:30 PM',
    ];

    return Array.from({ length: 46 }, (_, i) => {
        const c = companies[i % companies.length];
        const initials = c.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
        return {
            id: `inv-${i}`,
            invoiceId: `#INV-${String(1234 + i).padStart(7, '0')}`,
            date: dates[i % dates.length],
            companyName: c.name,
            companyType: c.type,
            email: `${c.name.toLowerCase().replace(/[^a-z]/g, '').substring(0, 10)}@mail.com`,
            amount: `$ ${amounts[i % amounts.length]}`,
            status: statuses[i % statuses.length],
            avatarInitial: initials,
            avatarColor: c.color,
        };
    });
};

const ITEMS_PER_PAGE = 10;

// ============================================
// Status Badge
// ============================================

const StatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
    const config = {
        completed: {
            icon: <CheckCircle2 size={13} />,
            label: 'Tamamlandı',
            classes: 'bg-green-50 text-green-600 border-green-200',
        },
        invoice_sent: {
            icon: <Send size={13} />,
            label: 'Fatura Gönderildi',
            classes: 'bg-purple-50 text-purple-600 border-purple-200',
        },
        pending: {
            icon: <Clock size={13} />,
            label: 'Beklemede',
            classes: 'bg-orange-50 text-orange-600 border-orange-200',
        },
    };

    const c = config[status];

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${c.classes}`}>
            {c.icon}
            {c.label}
        </span>
    );
};

// ============================================
// Invoice Detail View
// ============================================

const InvoiceDetail: React.FC<{ invoice: InvoiceRow; onBack: () => void }> = ({ invoice, onBack }) => {
    const statusLabel = {
        completed: 'Tamamlandı',
        invoice_sent: 'Fatura Gönderildi',
        pending: 'Beklemede',
    };

    // Placeholder line items
    const lineItems = [
        { description: 'Kasım Ayı Plus Üyelik Bedeli', content: 'Dijital Hizmet Bedeli', quantity: 1, tax: '60.00₺', price: '350₺' },
    ];
    const subtotal = '350₺';
    const taxTotal = '60₺';
    const total = '410₺';

    return (
        <div>
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Title Row */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <h1 className="text-2xl font-bold text-[#202023]">
                            FATURA{' '}
                            <span className="text-gray-400 font-normal text-lg">{invoice.invoiceId}</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <StatusBadge status={invoice.status} />
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm shadow-purple-200">
                            <Download size={15} />
                            İndir
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                            <Printer size={16} />
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                            <MoreVertical size={16} />
                        </button>
                    </div>
                </div>

                {/* Issuer / Customer */}
                <div className="grid grid-cols-2 gap-8 px-8 py-6">
                    {/* Issuer */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Faturayı Kesen</p>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                FA
                            </div>
                            <div>
                                <p className="text-base font-bold text-[#202023]">Fuat Han Albar</p>
                                <p className="text-sm text-gray-400">Muhasebe Departmanı</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Müşteri</p>
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 ${invoice.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                                {invoice.avatarInitial}
                            </div>
                            <div>
                                <p className="text-base font-bold text-[#202023]">{invoice.companyName}</p>
                                <p className="text-sm text-gray-400 mt-0.5">Barbaros Bulvarı, Beyoğlu, İstanbul 34353</p>
                                <p className="text-sm text-gray-400">Türkiye</p>
                                <div className="flex items-center gap-4 mt-1.5">
                                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Mail size={12} className="text-gray-400" />
                                        {invoice.email}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Phone size={12} className="text-gray-400" />
                                        tel:(012) 3456 789
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gradient Divider */}
                <div className="mx-8 h-1 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400" />

                {/* Line Items */}
                <div className="px-8 py-6">
                    <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 mb-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fatura İçeriği</p>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">İçerik</p>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-20 text-right">Miktar</p>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-24 text-right">KDV</p>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-24 text-right">Ücret</p>
                    </div>
                    {lineItems.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 py-3">
                            <div>
                                <p className="text-sm font-bold text-[#202023]">{item.description}</p>
                                <p className="text-xs text-gray-400 mt-1">Fatura Tarihi</p>
                                <p className="text-xs text-purple-500 font-medium">21 Kasım 2024, 13:50</p>
                            </div>
                            <p className="text-sm text-gray-600 pt-1">{item.content}</p>
                            <p className="text-sm text-gray-600 w-20 text-right pt-1">{item.quantity}</p>
                            <p className="text-sm text-gray-600 w-24 text-right pt-1">{item.tax}</p>
                            <p className="text-sm font-bold text-[#202023] w-24 text-right pt-1">{item.price}</p>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-100 px-8 py-5">
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-12 text-sm">
                            <span className="text-gray-400 uppercase tracking-wider text-xs font-semibold">ARA TOPLAM</span>
                            <span className="font-semibold text-[#202023] w-24 text-right">{subtotal}</span>
                        </div>
                        <div className="flex items-center gap-12 text-sm">
                            <span className="text-gray-400 uppercase tracking-wider text-xs font-semibold">VERGİ</span>
                            <span className="font-semibold text-[#202023] w-24 text-right">{taxTotal}</span>
                        </div>
                        <div className="w-32 h-px bg-gray-200 my-1" />
                        <div className="flex items-center gap-12 text-sm">
                            <span className="text-gray-400 uppercase tracking-wider text-xs font-bold">TOPLAM</span>
                            <span className="font-bold text-lg text-purple-600 w-24 text-right">{total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// Component
// ============================================

const InvoicesTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [invoices] = useState<InvoiceRow[]>(generateInvoices);
    const [selectedRow, setSelectedRow] = useState<string | null>(null);
    const [detailInvoice, setDetailInvoice] = useState<InvoiceRow | null>(null);
    const [checkedRows, setCheckedRows] = useState<Set<string>>(new Set());

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Filter
    const filtered = invoices.filter((inv) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            inv.companyName.toLowerCase().includes(term) ||
            inv.invoiceId.toLowerCase().includes(term) ||
            inv.email.toLowerCase().includes(term)
        );
    });

    // Pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginated = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const toggleCheck = (id: string) => {
        setCheckedRows((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleAll = () => {
        if (checkedRows.size === paginated.length) {
            setCheckedRows(new Set());
        } else {
            setCheckedRows(new Set(paginated.map((r) => r.id)));
        }
    };

    // If detail view is open, show it
    if (detailInvoice) {
        return <InvoiceDetail invoice={detailInvoice} onBack={() => setDetailInvoice(null)} />;
    }

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#202023]">Fatura Listesi</h1>
                    <p className="text-sm text-gray-400 mt-1">Tüm faturaları buradan yönetebilirsiniz</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative w-[260px]">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Fatura Ara"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all"
                        />
                    </div>

                    {/* Add Invoice */}
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm shadow-purple-200">
                        <FileText size={16} />
                        + Yeni Fatura
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="w-12 px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={checkedRows.size === paginated.length && paginated.length > 0}
                                    onChange={toggleAll}
                                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                />
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                                Fatura ID
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                                Tarih
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                                Müşteri
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                                İletişim
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                                Miktar
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                                Durum
                            </th>
                            <th className="w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {paginated.map((inv) => {
                            const isSelected = selectedRow === inv.id;
                            const isChecked = checkedRows.has(inv.id);
                            return (
                                <tr
                                    key={inv.id}
                                    onClick={() => setDetailInvoice(inv)}
                                    className={`transition-colors cursor-pointer group ${isSelected
                                        ? 'bg-purple-50/40 border-l-[3px] border-l-yellow-400'
                                        : 'hover:bg-gray-50/60'
                                        }`}
                                >
                                    <td className="px-4 py-3.5">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                toggleCheck(inv.id);
                                            }}
                                            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-4 py-3.5 text-sm font-medium text-[#202023]">
                                        {inv.invoiceId}
                                    </td>
                                    <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                                        {inv.date}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 ${inv.avatarColor} rounded-full flex items-center justify-center shrink-0`}>
                                                <span className="text-white font-bold text-xs">{inv.avatarInitial}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-[#202023] truncate">{inv.companyName}</p>
                                                <p className="text-xs text-gray-400 truncate">{inv.companyType}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                            <Mail size={13} className="text-gray-400 shrink-0" />
                                            <span className="truncate">{inv.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-sm font-semibold text-[#202023] whitespace-nowrap">
                                        {inv.amount}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <StatusBadge status={inv.status} />
                                    </td>
                                    <td className="px-3 py-3.5">
                                        <button
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-1.5 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Gösterilen <span className="font-semibold text-[#202023]">{startIdx + 1}-{Math.min(startIdx + ITEMS_PER_PAGE, totalItems)}</span> /{' '}
                    <span className="font-semibold text-[#202023]">{totalItems}</span> kayıt
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

export default InvoicesTable;
