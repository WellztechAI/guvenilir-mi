import React from "react";

interface PageHeroProps {
  title: string;
  className?: string;
  bgColor?: string; // Background color for the page (default: #F5F6F8)
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  className = "",
  bgColor = "#F5F6F8",
}) => {
  // Convert hex to rgba for gradient
  const hexToRgba = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  const rgbaColor = hexToRgba(bgColor);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Extended Gradient Background */}
      <div
        className="absolute top-0 left-0 right-0 h-[300px] w-full z-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, #13102C 0%, #2D1B69 15%, #4C38A5 30%, #8B7BC7 55%, rgba(${rgbaColor}, 0) 100%)`,
        }}
      />

      {/* Title Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-12">
        <h1
          className="font-manrope font-semibold text-center text-white"
          style={{
            fontSize: "65px",
            lineHeight: "60px",
            letterSpacing: "-2%",
          }}
        >
          {title}
        </h1>
      </div>
    </div>
  );
};
