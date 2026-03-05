import React from "react";
import { Comment } from "@/types";
import { RatingStars } from "./RatingStars";

interface ReviewItemProps {
  review: Comment;
  onLike: (commentId: string) => void;
  companyName?: string;
}

// Format date helper
const formatDate = (date: Date | string | undefined | null): string => {
  if (!date) return "Tarih bilinmiyor";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "Tarih bilinmiyor";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateObj);
};

export const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  onLike,
  companyName,
}) => {
  return (
    <article className="w-full">
      <div className="flex w-full items-stretch gap-[40px_65px]">
        <div className="flex items-stretch gap-[13px] grow shrink basis-auto">
          <img
            src={
              review.authorAvatar ||
              "https://api.builder.io/api/v1/image/assets/TEMP/ed4d506d869550e63301cda115d2a37f3f3d8102?placeholderIfAbsent=true"
            }
            alt={`${review.authorName} avatar`}
            className="aspect-[1] object-cover w-[52px] shrink-0 my-auto rounded-[50%]"
          />
          <div className="flex flex-col items-stretch">
            <div className="flex items-stretch gap-[7px] text-[26px] text-[#202023] font-semibold leading-[1.4]">
              <div className="text-[#202023]">{review.authorName}</div>
            </div>
            <div className="text-[#6B6B6E] text-base font-medium mt-2">
              {formatDate(review.date)}
            </div>
            {/* Rating Stars */}
            <div className="mt-2">
              <RatingStars rating={review.rating} size="small" />
            </div>
          </div>
        </div>
      </div>
      <p className="text-[rgba(65,65,65,1)] text-xs font-normal leading-[18px] tracking-[-0.48px] mt-11 max-md:mt-10">
        {review.message}
      </p>

      {/* Company Answer Section */}
      {review.answer && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4 border-l-4 border-[#7EDA48]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center shrink-0">
              <span className="text-purple-700 text-sm font-bold">
                {(companyName || review.companyName || "Firma")
                  .substring(0, 2)
                  .toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-900 text-sm">
                  {companyName || review.companyName || "Firma"}
                </span>
                <span className="text-xs text-gray-500">• Firma Cevabı</span>
              </div>
              <p className="text-gray-700 text-xs leading-relaxed">
                {review.answer}
              </p>
              {review.answerDate && (
                <div className="text-xs text-gray-500 mt-2">
                  {formatDate(review.answerDate)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full gap-5 text-sm text-[#6B6B6E] font-medium mt-6 max-md:mr-[5px]">
        <button
          onClick={() => onLike(review.id)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
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
            Yararlı <span className="font-semibold">{review.likesCount}</span>
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
      <hr className="w-full mt-[31px] border-t border-gray-200" />
    </article>
  );
};
