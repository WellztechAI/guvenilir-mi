import React, { useState } from 'react';

export const ReviewFilters: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState('1');

  const ratingOptions = [
    { value: '1', label: '1-Çok Kötü' },
    { value: '2', label: '2-Kötü' },
    { value: '3', label: '3-İdare Eder' },
    { value: '4', label: '4-İyi' },
  ];

  return (
    <div className="w-full">
      <div className="flex w-full flex-col items-stretch">
        <h2 className="text-[rgba(55,55,55,1)] text-[28px] font-semibold leading-none tracking-[-0.56px] text-center">
          Tüm Yorumlar
        </h2>
        <div className="bg-[rgba(240,240,240,1)] flex items-stretch gap-3.5 text-xs text-black font-medium text-center tracking-[-0.48px] leading-loose mt-4 px-[22px] py-[15px] rounded-[25px] max-md:mr-1.5 max-md:px-5">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/ac27ab23a834258956d66109e1168554f2722e81?placeholderIfAbsent=true"
            alt="Search"
            className="aspect-[1] object-contain w-5 shrink-0"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Bir kelime arayın..."
            className="grow shrink w-[324px] basis-auto bg-transparent outline-none"
            aria-label="Search reviews"
          />
        </div>
        <div className="flex w-full flex-col text-[#1F2026] mt-2.5 pl-[13px]">
          <h3 className="text-[#1F2026] text-xl font-semibold leading-[1.3] tracking-[-0.2px]">
            Puanlamaya göre sıralama
          </h3>
          <p className="text-[#1F2026] text-xs font-medium leading-loose tracking-[-0.48px]">
            Lütfen 1-5 arası bir puan seçin
          </p>
          <div className="self-stretch flex w-full items-stretch text-sm text-[#99B2C6] font-normal leading-none mt-1.5">
            {ratingOptions.map((option, index) => (
              <button
                key={option.value}
                onClick={() => setSelectedRating(option.value)}
                className={`justify-center items-center border flex gap-2 overflow-hidden px-4 py-2.5 border-solid border-[#D9E1E7] ${
                  selectedRating === option.value 
                    ? 'text-[#17181A] bg-white' 
                    : 'text-[#99B2C6] bg-[#F1F5F7]'
                } ${
                  index === 0 ? 'rounded-[8px_0_0_8px]' : ''
                } hover:bg-white hover:text-[#17181A] transition-colors`}
              >
                <span className="self-stretch my-auto">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
