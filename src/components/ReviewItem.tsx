import React from "react";
import { Comment } from "@/types";

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
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/985808fc9f99c5d1e1a76b39516ff8232cc5213c?placeholderIfAbsent=true"
                alt="Verified"
                className="aspect-[0.85] object-contain w-[11px] shrink-0 mt-3.5"
              />
            </div>
            <div className="text-[#6B6B6E] text-base font-medium mt-2 flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill={star <= review.rating ? "#FFD700" : "#E5E7EB"}
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="text-[#6B6B6E] text-[13px] font-medium my-auto">
          {formatDate(review.date)}
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

      <div className="flex w-full gap-5 text-[9px] text-[#6B6B6E] font-medium mt-6 max-md:mr-[5px]">
        <button
          onClick={() => onLike(review.id)}
          className="flex items-stretch gap-[5px] hover:opacity-70 transition-opacity"
        >
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/07dc1f4467d8862ae84366171051235f3f317d39?placeholderIfAbsent=true"
            alt="Helpful"
            className="aspect-[1] object-contain w-3.5 shrink-0"
          />
          <span className="text-[#6B6B6E]">
            Yararlı <span className="font-semibold">{review.likesCount}</span>
          </span>
        </button>
      </div>
      <hr className="w-full mt-[31px] border-t border-gray-200" />
    </article>
  );
};
