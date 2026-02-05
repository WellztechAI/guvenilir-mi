import React, { useState } from 'react';
import { RatingStars } from './RatingStars';

interface ReviewCardProps {
  author: string;
  date: string;
  rating: number;
  content: string;
  helpful: number;
  avatar: string;
  isExpanded?: boolean;
  showFullContent?: boolean;
  onLike?: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  author,
  date,
  rating,
  content,
  helpful,
  avatar,
  showFullContent = false,
  onLike
}) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(helpful);

  const handleHelpfulClick = () => {
    if (onLike) {
      onLike();
    }
    if (isHelpful) {
      setHelpfulCount(prev => prev - 1);
    } else {
      setHelpfulCount(prev => prev + 1);
    }
    setIsHelpful(!isHelpful);
  };

  return (
    <article className="bg-[rgba(253,253,253,1)] shadow-[0px_6px_10px_rgba(177,177,177,0.08)] border border flex w-full flex-col items-stretch font-medium mx-auto pt-8 pb-[17px] px-[30px] rounded-2xl border-solid max-md:max-w-full max-md:mt-10 max-md:px-5">
      <header className="flex items-stretch gap-3 text-[26px] text-[#202023] font-semibold text-center leading-[1.4]">
        <img
          src={avatar}
          alt={`${author} avatar`}
          className="aspect-[1] object-contain w-[52px] shrink-0 rounded-[50%]"
        />
        <div className="text-[#202023] basis-auto">
          {author}
        </div>
      </header>
      <time className="text-[#6B6B6E] text-base mt-2">
        {date}
      </time>
      {/* Rating Stars */}
      <div className="mt-2">
        <RatingStars rating={rating} size="small" />
      </div>
      <p className="text-[rgba(65,65,65,1)] text-xs font-normal leading-[18px] tracking-[-0.48px] mt-12 max-md:max-w-full max-md:mt-10">
        {content}
      </p>
      <footer className="flex w-full items-stretch gap-5 flex-wrap justify-between mt-[31px] max-md:max-w-full">
        <div className="flex items-stretch gap-2.5 text-sm text-[#6B6B6E]">
          <button
            onClick={handleHelpfulClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            aria-label={`Mark as helpful (${helpfulCount} people found this helpful)`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            <span className="text-[#6B6B6E] font-medium">
              Yararlı <span className="font-semibold">{helpfulCount}</span>
            </span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span className="text-[#6B6B6E] font-medium">
              Paylaş
            </span>
          </button>
        </div>
        {!showFullContent && (
          <button className="bg-[rgba(0,0,0,0.04)] flex items-center gap-1.5 text-xs text-black text-center tracking-[-0.48px] leading-loose justify-center px-2.5 py-1 rounded-md hover:bg-[rgba(0,0,0,0.08)] transition-colors">
            <span className="self-stretch my-auto">
              Tamamını Gör
            </span>
          </button>
        )}
      </footer>
    </article>
  );
};
