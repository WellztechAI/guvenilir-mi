import React, { useState } from 'react';

export const Pagination: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <React.Fragment key={i}>
          <button
            onClick={() => handlePageChange(i)}
            className={`hover:bg-gray-100 transition-colors ${
              currentPage === i ? 'font-semibold' : ''
            }`}
          >
            {i}
          </button>
          {i < totalPages && (
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/93092e4756ca321b68d3ba8ef85a0cf95b8d4432?placeholderIfAbsent=true"
              alt=""
              className="object-contain w-0 shadow-[0px_1px_0px_rgba(255,255,255,1)] shrink-0"
            />
          )}
        </React.Fragment>
      );
    }
    return pages;
  };

  return (
    <nav 
      className="bg-[rgba(240,240,240,1)] flex w-[864px] max-w-full items-stretch gap-5 text-xs text-black font-medium text-center tracking-[-0.48px] leading-loose flex-wrap justify-between ml-11 mt-[15px] px-[26px] py-[11px] rounded-[25px] max-md:px-5"
      aria-label="Pagination navigation"
    >
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Önceki Sayfa
      </button>
      <div className="flex items-stretch gap-4 whitespace-nowrap">
        <div className="flex items-stretch gap-3.5">
          {renderPageNumbers()}
        </div>
      </div>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-black hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sonraki Sayfa
      </button>
    </nav>
  );
};
