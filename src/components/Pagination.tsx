import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  // Don't render if there's no content or only one page
  if (totalPages <= 0 || totalItems <= 0) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  /**
   * Generate page numbers to display based on current position and total pages
   *
   * Logic:
   * - For small page counts (≤7 pages): show all pages
   * - For large page counts: show a sliding window centered on current page
   *   - Window size of ~5 visible pages
   *   - Use ellipsis (...) for gaps
   */
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const windowSize = 5; // Number of page buttons to show in the sliding window

    if (totalPages <= 7) {
      // Show all pages for small counts
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // For large page counts, use a sliding window approach

      // Always show first page
      pages.push(1);

      // Calculate the start and end of the window centered on current page
      let windowStart = Math.max(2, currentPage - Math.floor(windowSize / 2));
      let windowEnd = Math.min(totalPages - 1, windowStart + windowSize - 1);

      // Adjust window if we're near the end
      if (windowEnd === totalPages - 1) {
        windowStart = Math.max(2, windowEnd - windowSize + 1);
      }

      // Add ellipsis if there's a gap after page 1
      if (windowStart > 2) {
        pages.push('ellipsis');
      }

      // Add the window pages
      for (let i = windowStart; i <= windowEnd; i++) {
        pages.push(i);
      }

      // Add ellipsis if there's a gap before the last page
      if (windowEnd < totalPages - 1) {
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculate the range of items being displayed
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <nav
      className="bg-[rgba(240,240,240,1)] flex w-full max-w-[864px] items-center gap-3 text-xs text-black font-medium text-center tracking-[-0.48px] leading-loose flex-wrap justify-between ml-11 mt-[15px] px-[26px] py-[11px] rounded-[25px] max-md:px-5 max-md:ml-0"
      aria-label="Pagination navigation"
    >
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Önceki sayfa"
      >
        ← Önceki Sayfa
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1 text-gray-500"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[32px] h-8 px-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#4C38A5] text-white font-semibold'
                  : 'hover:bg-gray-200'
              }`}
              aria-label={`Sayfa ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Sonraki sayfa"
      >
        Sonraki Sayfa →
      </button>

      {/* Total Count Info */}
      <div className="w-full text-center text-gray-600 text-[11px] mt-2">
        {totalItems} yorumdan {startItem}-{endItem} arası gösteriliyor
      </div>
    </nav>
  );
};
