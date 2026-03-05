import React from 'react';

interface RatingStarsProps {
  rating: number;
  size?: 'small' | 'medium';
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, size = 'small' }) => {
  const boxSize = size === 'small' ? 'w-6 h-6' : 'w-8 h-8';
  const checkSize = size === 'small' ? 'w-3 h-3' : 'w-4 h-4';
  
  const getFilledBoxes = (rating: number) => {
    return Math.min(rating, 5);
  };

  const filled = getFilledBoxes(rating);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= Math.floor(filled);
        const isPartial = star === Math.ceil(filled) && filled % 1 !== 0;
        const partialPercent = isPartial ? (filled % 1) * 100 : 0;

        return (
          <div
            key={star}
            className={`${boxSize} rounded flex items-center justify-center relative overflow-hidden`}
            style={{
              backgroundColor: isFilled ? '#FECE07' : '#D8D8D8',
            }}
          >
            {isPartial && (
              <div
                className="absolute left-0 top-0 h-full"
                style={{
                  width: `${partialPercent}%`,
                  backgroundColor: '#FECE07',
                }}
              />
            )}
            <img
              src="/Vector.png"
              alt="check"
              className={`${checkSize} object-contain relative z-10 brightness-0 invert`}
            />
          </div>
        );
      })}
    </div>
  );
};
