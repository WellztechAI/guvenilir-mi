import React from 'react';
import { Plus, Mail, MoreVertical } from 'lucide-react';

interface BrandPerson {
    id: string;
    name: string;
    role: string;
    avatarColor: string;
    hasMessage?: boolean;
}

const placeholderPeople: BrandPerson[] = [
    { id: '1', name: 'Angela Moss', role: 'Pazarlama Müdürü', avatarColor: 'bg-blue-400' },
    { id: '2', name: 'Andy Law', role: 'Grafik Tasarımcı', avatarColor: 'bg-green-400', hasMessage: true },
    { id: '3', name: 'Benny Kenn', role: 'Yazılım Mühendisi', avatarColor: 'bg-orange-400' },
    { id: '4', name: 'Chynthia Lawra', role: 'CEO', avatarColor: 'bg-pink-400' },
    { id: '5', name: 'Della Samantha', role: 'Genel Müdür', avatarColor: 'bg-purple-400' },
];

interface BrandsQuickViewProps {
    onViewAll?: () => void;
}

const BrandsQuickView: React.FC<BrandsQuickViewProps> = ({ onViewAll }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-gray-100">
                <div>
                    <h2 className="text-lg font-bold text-[#202023]">Markalar</h2>
                    <p className="text-sm text-gray-400 mt-0.5">68 Kayıtlı Marka</p>
                </div>
                <button className="w-9 h-9 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors shadow-sm shadow-purple-200">
                    <Plus size={18} />
                </button>
            </div>

            {/* People List */}
            <div className="divide-y divide-gray-50">
                {placeholderPeople.map((person) => (
                    <div
                        key={person.id}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
                    >
                        <div className={`w-9 h-9 ${person.avatarColor} rounded-full shrink-0`} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#202023] truncate">{person.name}</p>
                            <p className="text-xs text-gray-400 truncate">{person.role}</p>
                        </div>
                        {person.hasMessage ? (
                            <button className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-50 transition-colors">
                                <Mail size={16} />
                            </button>
                        ) : (
                            <button className="p-1.5 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-500 transition-colors">
                                <MoreVertical size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* View More */}
            <div className="p-4">
                <button
                    onClick={onViewAll}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shadow-purple-200"
                >
                    Tümünü Görüntüle
                </button>
            </div>
        </div>
    );
};

export default BrandsQuickView;
