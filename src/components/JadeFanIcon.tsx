import React, { useState } from 'react';
import { motion } from 'motion/react';

interface JadeFanIconProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export const JadeFanIcon: React.FC<JadeFanIconProps> = ({
  className = '',
  size = 36,
  animate = true,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0 select-none shadow-md border border-[#FFE082]/70 ring-1 ring-[#0D5C4B]/40 bg-gradient-to-br from-[#0D5C4B] via-[#1B7E67] to-[#0A4739] ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Soft Golden Halo Glow */}
      <div className="absolute inset-0 rounded-full bg-[#FFE082]/25 blur-xs pointer-events-none" />

      {/* Jade Fan with Bat Quai Pattern */}
      {!imgError ? (
        <motion.div
          animate={
            animate
              ? {
                  rotate: [-3, 3, -3],
                  scale: [1, 1.03, 1],
                }
              : undefined
          }
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full relative flex items-center justify-center p-0.5"
        >
          <img
            src="/jade_fan_icon.jpg"
            alt="Quạt Ngọc Bát Quái - Sạp Bói Cô Thảo"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>
      ) : (
        /* Traditional Vietnamese Jade Fan (Quạt Xanh Ngọc Bát Quái) Fallback Vector */
        <svg className="w-full h-full p-1 text-[#FFE082]" viewBox="0 0 100 100" fill="currentColor">
          {/* Fan Ribs & Arc in Emerald / Jade */}
          <path
            d="M50 85 L20 30 C 35 15, 65 15, 80 30 Z"
            fill="#0D5C4B"
            stroke="#FFE082"
            strokeWidth="2"
          />
          {/* Gold Filigree Lines */}
          <path d="M50 85 L35 22 M50 85 L50 18 M50 85 L65 22" stroke="#FFE082" strokeWidth="1.2" />
          {/* Bát Quái / Yin Yang Center on Fan */}
          <circle cx="50" cy="45" r="9" fill="#FBF5E8" stroke="#FFE082" strokeWidth="1" />
          <path d="M50 36 A9 9 0 0 1 50 54 A4.5 4.5 0 0 1 50 45 A4.5 4.5 0 0 0 50 36 Z" fill="#7C2A1C" />
          <circle cx="50" cy="40.5" r="1.2" fill="#FBF5E8" />
          <circle cx="50" cy="49.5" r="1.2" fill="#7C2A1C" />
          {/* Red Silk Tassel */}
          <circle cx="50" cy="88" r="2.5" fill="#FFE082" />
          <path d="M50 90 L47 99 L53 99 Z" fill="#B23B28" />
        </svg>
      )}
    </div>
  );
};
