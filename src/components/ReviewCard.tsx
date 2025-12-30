import React, { useState } from 'react';

interface ReviewCardProps {
  author: string;
  date: string;
  content: string;
  helpful: number;
  avatar: string;
  isExpanded?: boolean;
  showFullContent?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  author,
  date,
  content,
  helpful,
  avatar,
  showFullContent = false
}) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(helpful);

  const handleHelpfulClick = () => {
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
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/c22ea5c06d3e32cccee372a43e8b48bcc63daa3a?placeholderIfAbsent=true"
          alt="Verified user"
          className="aspect-[0.92] object-contain w-[11px] shrink-0 my-auto rounded-2xl"
        />
      </header>
      <time className="text-[#6B6B6E] text-base">
        {date}
      </time>
      <p className="text-[rgba(65,65,65,1)] text-xs font-normal leading-[18px] tracking-[-0.48px] mt-12 max-md:max-w-full max-md:mt-10">
        {content}
      </p>
      <footer className="flex w-full items-stretch gap-5 flex-wrap justify-between mt-[31px] max-md:max-w-full">
        <div className="flex items-stretch gap-2.5 text-[9px] text-[#6B6B6E]">
          <button 
            onClick={handleHelpfulClick}
            className="flex items-stretch gap-[5px] hover:opacity-70 transition-opacity"
            aria-label={`Mark as helpful (${helpfulCount} people found this helpful)`}
          >
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/cda5d30bf91ddd8a2cf9b2d41fd388fa8a727988?placeholderIfAbsent=true"
              alt="Helpful"
              className="aspect-[1] object-contain w-[26px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.36)] shrink-0 rounded-2xl"
            />
            <span className="text-[#6B6B6E] my-auto">
              Yararlı <span className="font-semibold">{helpfulCount}</span>
            </span>
          </button>
          <button className="flex items-stretch gap-[5px] hover:opacity-70 transition-opacity">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/30ece041f9dccfb8d681f7cf59fd4f92fb8a1390?placeholderIfAbsent=true"
              alt="Share"
              className="aspect-[1] object-contain w-[26px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.36)] shrink-0 rounded-2xl"
            />
            <span className="text-[#6B6B6E] my-auto">
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
