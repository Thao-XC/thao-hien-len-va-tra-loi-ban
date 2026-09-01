import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface ThaoPortraitProps {
  className?: string;
  isSpeaking?: boolean;
  showAura?: boolean;
}

export const ThaoPortrait: React.FC<ThaoPortraitProps> = ({
  className = 'w-44 sm:w-52 h-auto',
  isSpeaking = true,
  showAura = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 8 Trigrams (Bát Quái) for Cardcaptor Sakura style magical runes
  const TRIGRAMS = ['☰ Càn', '☱ Đoài', '☲ Ly', '☳ Chấn', '☴ Tốn', '☵ Khảm', '☶ Cấn', '☷ Khôn'];

  return (
    <div
      className="flex flex-col items-center justify-center relative select-none w-full max-w-[280px] sm:max-w-[320px] mx-auto py-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* =========================================================================
          1. CARDCAPTOR SAKURA X VIETNAMESE FOLKLORE ROTATING BAGUA MAGIC CIRCLE
         ========================================================================= */}
      {showAura && (
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
          {/* Outer Radiant Magical Aura Bloom */}
          <div
            className={`absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-[#E9CE84]/50 via-[#B23B28]/35 to-[#FFDF85]/60 blur-2xl transition-all duration-700 ${
              isSpeaking || isHovered ? 'scale-110 opacity-90' : 'opacity-70 scale-95'
            }`}
          />

          {/* Rotating Cardcaptor Sakura Style Sun/Moon Magic Circle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
            className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center opacity-70"
          >
            <svg className="w-full h-full text-[#E9CE84]" viewBox="0 0 300 300" fill="none">
              {/* Outer Golden Band with Stars and Runes */}
              <circle cx="150" cy="150" r="140" stroke="#E9CE84" strokeWidth="2.5" opacity="0.8" />
              <circle cx="150" cy="150" r="132" stroke="#B23B28" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7" />
              <circle cx="150" cy="150" r="120" stroke="#E9CE84" strokeWidth="1.2" opacity="0.6" />

              {/* 12 Celestial Rays & Stars */}
              {[...Array(12)].map((_, i) => (
                <g key={i} transform={`rotate(${i * 30} 150 150)`}>
                  <line x1="150" y1="10" x2="150" y2="24" stroke="#E9CE84" strokeWidth="1.8" />
                  <circle cx="150" cy="27" r="2" fill="#B23B28" />
                </g>
              ))}

              {/* Double Interlocking Squares (Cardcaptor Sakura Octagram Motif) */}
              <rect
                x="65"
                y="65"
                width="170"
                height="170"
                stroke="#E9CE84"
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />
              <rect
                x="65"
                y="65"
                width="170"
                height="170"
                stroke="#B23B28"
                strokeWidth="1.5"
                fill="none"
                transform="rotate(45 150 150)"
                opacity="0.6"
              />

              {/* Inner Sacred Sun & Moon Orbit */}
              <circle cx="150" cy="150" r="85" stroke="#E9CE84" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
            </svg>
          </motion.div>

          {/* Counter-Rotating Inner Bagua Trigrams Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            className="absolute w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center opacity-80"
          >
            <svg className="w-full h-full text-[#AD8A2E]" viewBox="0 0 260 260" fill="none">
              <circle cx="130" cy="130" r="105" stroke="#AD8A2E" strokeWidth="1.2" opacity="0.5" />
              {TRIGRAMS.map((tri, i) => {
                const angle = (i * 45 * Math.PI) / 180;
                const x = 130 + 105 * Math.cos(angle);
                const y = 130 + 105 * Math.sin(angle);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    fill="#7C2A1C"
                    fontSize="11"
                    fontFamily="serif"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {tri.split(' ')[0]}
                  </text>
                );
              })}
            </svg>
          </motion.div>
        </div>
      )}

      {/* =========================================================================
          2. FLOATING TALISMAN CARDS & FOLKLORE CLOUDS
         ========================================================================= */}
      {/* Left Auspicious Cloud (Đông Hồ) */}
      <motion.div
        animate={{
          x: [-3, 3, -3],
          y: [0, -3, 0],
        }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-0 top-3 pointer-events-none z-20 opacity-85"
      >
        <svg className="w-20 sm:w-24 h-14 text-[#AD8A2E] drop-shadow-sm" viewBox="0 0 160 90" fill="none" stroke="currentColor">
          <path
            d="M10 60 C 10 40, 30 30, 50 35 C 60 15, 90 15, 105 28 C 125 20, 145 35, 140 55 C 135 70, 105 72, 85 68 C 65 72, 30 72, 10 60 Z"
            strokeWidth="1.8"
            fill="#FFFDF7"
            fillOpacity="0.92"
          />
          <path d="M50 35 C 65 42, 70 55, 65 65" strokeWidth="1.2" stroke="#AD8A2E" />
          <circle cx="50" cy="50" r="2.5" fill="#B23B28" />
        </svg>
      </motion.div>

      {/* Right Auspicious Cloud (Ngũ Sắc) */}
      <motion.div
        animate={{
          x: [3, -3, 3],
          y: [-2, 2, -2],
        }}
        transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute right-0 top-5 pointer-events-none z-20 opacity-85"
      >
        <svg className="w-20 sm:w-24 h-14 text-[#AD8A2E] drop-shadow-sm" viewBox="0 0 160 90" fill="none" stroke="currentColor">
          <path
            d="M10 60 C 10 40, 30 30, 50 35 C 60 15, 90 15, 105 28 C 125 20, 145 35, 140 55 C 135 70, 105 72, 85 68 C 65 72, 30 72, 10 60 Z"
            strokeWidth="1.8"
            fill="#FFFDF7"
            fillOpacity="0.92"
          />
          <path d="M50 35 C 65 42, 70 55, 65 65" strokeWidth="1.2" stroke="#AD8A2E" />
          <circle cx="75" cy="50" r="2.5" fill="#B23B28" />
        </svg>
      </motion.div>

      {/* Drifting Lotus/Sakura Petal */}
      <motion.div
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.4, 0.9, 0.4],
          rotate: [0, 90, 180],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-4 top-2 text-[#E9CE84] pointer-events-none z-25"
      >
        <Sparkles className="w-3.5 h-3.5 fill-[#E9CE84]" />
      </motion.div>

      {/* =========================================================================
          3. MAIN ANIME CARDCAPTOR SAKURA LADY THAO PORTRAIT IN ÁO DÀI WITH I-CHING NAILS
         ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.02 }}
        className={`relative z-10 ${className}`}
      >
        {/* Ornate Gold & Cinnabar Frame */}
        <div className="relative p-1 rounded-2xl bg-gradient-to-b from-[#E9CE84] via-[#B23B28] to-[#7C2A1C] shadow-[0_8px_24px_rgba(46,36,21,0.22)]">
          {/* Inner Golden Border */}
          <div className="relative rounded-[14px] overflow-hidden border-2 border-[#FFFDF7] bg-[#2D4D3D] aspect-square">
            {!imageError ? (
              <img
                src="/lady_thao_ghibli.jpg"
                alt="Lady Thao (Cô Thảo Bói Quẻ) - Studio Ghibli x Traditional Vietnamese Folk Painting"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#2D4D3D]">
                <img
                  src="/lady_thao_young.jpg"
                  alt="Lady Thao"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1610]/45 via-transparent to-transparent pointer-events-none" />

            {/* Badge */}
            <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-[#1C1610]/85 backdrop-blur-xs border border-[#E9CE84] text-[#E9CE84] text-[0.62rem] font-sans font-bold flex items-center gap-1 shadow-md">
              <span className="text-[#FF9EAA]">🌸</span>
              <span>Cô Thảo · ☯ Móng Bát Quái</span>
            </div>
          </div>

          {/* Corner Ornaments */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#E9CE84]" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#E9CE84]" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#E9CE84]" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#E9CE84]" />
        </div>
      </motion.div>
    </div>
  );
};
