import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardData {
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
}

const defaultCards: StatCardData[] = [
    { label: 'Toplam Onaylanmamış Yorum Sayısı', value: '421', change: '+0.5%', isPositive: true },
    { label: 'Onay Bekleyen Yorum Sayısı', value: '421', change: '+0.5%', isPositive: true },
    { label: 'Toplam Onaylı Marka', value: '874', change: '-6.4%', isPositive: false },
    { label: 'Toplam Onay Reddedilen Marka', value: '874', change: '-6.4%', isPositive: false },
    { label: 'Toplam Ziyaretçi Sayısı', value: '421', change: '+0.5%', isPositive: true },
    { label: 'Toplam Revize Yorum Sayısı', value: '421', change: '+0.5%', isPositive: true },
    { label: 'Toplam Onayda Bekleyen Marka Sayısı', value: '874', change: '-6.4%', isPositive: false },
    { label: 'Toplam Onaysız Açılan Marka Sayısı', value: '874', change: '-6.4%', isPositive: false },
];

interface StatCardsProps {
    cards?: StatCardData[];
}

const StatCards: React.FC<StatCardsProps> = ({ cards = defaultCards }) => {
    return (
        <div className="grid grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                    <p className="text-sm text-gray-500 font-medium mb-3 leading-snug min-h-[40px]">
                        {card.label}
                    </p>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-[#202023]">{card.value}</span>
                        <span
                            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${card.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                                }`}
                        >
                            {card.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {card.change}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatCards;
