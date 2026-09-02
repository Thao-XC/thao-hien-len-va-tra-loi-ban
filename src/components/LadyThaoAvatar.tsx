import React, { useState } from 'react';

interface LadyThaoAvatarProps {
  className?: string;
  sizeClassName?: string;
  showBorder?: boolean;
  animate?: boolean;
}

export const LADY_THAO_ICON_URL = '/lady_thao_ghibli.jpg';

export const LadyThaoAvatar: React.FC<LadyThaoAvatarProps> = ({
  className = '',
  sizeClassName = 'w-10 h-10',
  showBorder = true,
  animate = false,
}) => {
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const imageSources = [
    '/lady_thao_ghibli.jpg',
    '/lady_thao_young.jpg',
    '/lady_thao_anime.jpg',
    '/thao_icon.jpg',
  ];

  const handleImageError = () => {
    if (currentSrcIndex < imageSources.length - 1) {
      setCurrentSrcIndex((prev) => prev + 1);
    } else {
      setCurrentSrcIndex(-1); // Show SVG fallback
    }
  };

  return (
    <div
      className={`relative rounded-full overflow-hidden flex-shrink-0 bg-[#2D4D3D] ${
        showBorder ? 'border-2 border-[#E9CE84] shadow-md ring-2 ring-[#B23B28]/50' : ''
      } ${animate ? 'ring-4 ring-[#FFDF85]/60 animate-pulse' : ''} ${sizeClassName} ${className}`}
    >
      {currentSrcIndex >= 0 ? (
        <img
          src={imageSources[currentSrcIndex]}
          alt="Cô Thảo (Lady Thao)"
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover"
        />
      ) : (
        /* Traditional Vietnamese Folk Art Fallback Vector */
        <svg className="w-full h-full" viewBox="0 0 160 160" aria-label="Cô Thảo Thầy Bói">
          <rect width="160" height="160" fill="#FDF7EA" />
          <circle cx="80" cy="72" r="60" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.7" />
          <path d="M35 110 C 32 135, 40 160, 48 160 L112 160 C 120 160, 128 135, 125 110 Z" fill="#2D4D3D" stroke="#1F1A14" strokeWidth="1.5" />
          <path d="M62 105 L80 135 L98 105 Z" fill="#9C2C1E" />
          <path d="M64 70 C 62 85, 65 98, 70 106 L90 106 C 95 98, 98 85, 96 70 Z" fill="#FCEAD4" stroke="#1F1A14" strokeWidth="1" />
          <path d="M50 50 C 58 35, 70 30, 80 30 C 90 30, 102 35, 110 50 C 112 60, 108 68, 104 74 C 98 62, 90 54, 80 54 C 70 54, 62 62, 56 74 C 52 68, 48 60, 50 50 Z" fill="#1C1610" />
          <ellipse cx="80" cy="34" rx="14" ry="9" fill="#1C1610" />
          <path d="M92 30 C 98 28, 105 29, 108 35" fill="none" stroke="#E9CE84" strokeWidth="1.5" />
          <circle cx="108" cy="35" r="2.5" fill="#B23B28" />
          <path d="M60 66 C 63 64, 67 64, 70 66" fill="none" stroke="#1C1610" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M90 66 C 93 64, 97 64, 100 66" fill="none" stroke="#1C1610" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="65" cy="72" r="1.8" fill="#1C1610" />
          <circle cx="95" cy="72" r="1.8" fill="#1C1610" />
          <ellipse cx="61" cy="78" rx="4" ry="2.5" fill="#B23B28" opacity="0.3" />
          <ellipse cx="99" cy="78" rx="4" ry="2.5" fill="#B23B28" opacity="0.3" />
          <path d="M74 84 Q 80 88 86 84" stroke="#8C2B20" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
};

