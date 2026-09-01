import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Wand2 } from 'lucide-react';

interface ThaoPortraitProps {
  className?: string;
  isSpeaking?: boolean;
  showAura?: boolean;
}

export const ThaoPortrait: React.FC<ThaoPortraitProps> = ({
  className = 'w-48 sm:w-56 h-auto',
  isSpeaking = true,
  showAura = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 8 Trigrams (Bát Quái) for Cardcaptor Sakura style magical runes
  const TRIGRAMS = ['☰ Càn', '☱ Đoài', '☲ Ly', '☳ Chấn', '☴ Tốn', '☵ Khảm', '☶ Cấn', '☷ Khôn'];

  return (
    <div
      className="flex flex-col items-center justify-center my-2 relative overflow-visible select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* =========================================================================
          1. CARDCAPTOR SAKURA X VIETNAMESE FOLKLORE ROTATING BAGUA MAGIC CIRCLE
         ========================================================================= */}
      {showAura && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-72 sm:h-72 pointer-events-none z-0 flex items-center justify-center">
          {/* Outer Radiant Magical Aura Bloom */}
          <div
            className={`absolute inset-0 m-auto w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-[#E9CE84]/60 via-[#B23B28]/45 to-[#FFDF85]/70 blur-3xl transition-all duration-700 ${
              isSpeaking || isHovered ? 'animate-pulse scale-125 opacity-95' : 'opacity-75 scale-100'
            }`}
          />

          {/* Rotating Cardcaptor Sakura Style Sun/Moon Magic Circle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 flex items-center justify-center opacity-75"
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

              {/* Double Interlocking Squares (Cardcaptor Sakura Star of David / Octagram Motif) */}
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
            className="absolute inset-4 flex items-center justify-center opacity-85"
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
          2. FLOATING CARDCAPTOR SAKURA X I-CHING TALISMAN CARDS (Thẻ Bài Bát Quái)
         ========================================================================= */}
      {/* Left Floating I-Ching Card (Càn - Heaven Card) */}
      <motion.div
        animate={{
          y: [-8, 6, -8],
          rotate: [-6, -2, -6],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden sm:block absolute -left-10 top-12 z-20 pointer-events-none"
      >
        <div className="w-12 h-20 rounded-xs bg-gradient-to-b from-[#FFFDF7] to-[#FAF0D7] border-2 border-[#E9CE84] shadow-[0_6px_16px_rgba(178,59,40,0.3)] p-1 flex flex-col items-center justify-between">
          <div className="text-[0.6rem] font-serif font-bold text-[#B23B28]">☰ CÀN</div>
          <div className="w-6 h-6 rounded-full border border-[#AD8A2E] flex items-center justify-center bg-[#2D4D3D]/10">
            <span className="text-[0.7rem] text-[#2D4D3D]">☯</span>
          </div>
          <div className="text-[0.5rem] font-sans font-semibold text-[#7C2A1C] uppercase tracking-tighter">THE LIGHT</div>
        </div>
      </motion.div>

      {/* Right Floating I-Ching Card (Khôn - Earth Card) */}
      <motion.div
        animate={{
          y: [6, -8, 6],
          rotate: [6, 2, 6],
        }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="hidden sm:block absolute -right-10 top-16 z-20 pointer-events-none"
      >
        <div className="w-12 h-20 rounded-xs bg-gradient-to-b from-[#FFFDF7] to-[#FAF0D7] border-2 border-[#E9CE84] shadow-[0_6px_16px_rgba(178,59,40,0.3)] p-1 flex flex-col items-center justify-between">
          <div className="text-[0.6rem] font-serif font-bold text-[#B23B28]">☷ KHÔN</div>
          <div className="w-6 h-6 rounded-full border border-[#AD8A2E] flex items-center justify-center bg-[#B23B28]/10">
            <span className="text-[0.7rem] text-[#B23B28]">🌸</span>
          </div>
          <div className="text-[0.5rem] font-sans font-semibold text-[#7C2A1C] uppercase tracking-tighter">THE EARTH</div>
        </div>
      </motion.div>

      {/* =========================================================================
          3. VIETNAMESE FOLKLORE AUSPICIOUS CLOUDS (Mây Ngũ Sắc Đông Hồ)
         ========================================================================= */}
      {/* Left Auspicious Cloud */}
      <motion.div
        animate={{
          x: [-4, 4, -4],
          y: [0, -4, 0],
        }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-6 sm:-left-12 top-6 pointer-events-none z-20"
      >
        <svg className="w-28 sm:w-36 h-20 text-[#AD8A2E] drop-shadow-md" viewBox="0 0 160 90" fill="none" stroke="currentColor">
          <path
            d="M10 60 C 10 40, 30 30, 50 35 C 60 15, 90 15, 105 28 C 125 20, 145 35, 140 55 C 135 70, 105 72, 85 68 C 65 72, 30 72, 10 60 Z"
            strokeWidth="1.8"
            fill="#FFFDF7"
            fillOpacity="0.9"
          />
          <path d="M50 35 C 65 42, 70 55, 65 65" strokeWidth="1.2" stroke="#AD8A2E" />
          <path d="M105 28 C 110 40, 105 52, 95 60" strokeWidth="1.2" stroke="#AD8A2E" />
          <circle cx="50" cy="50" r="2.5" fill="#B23B28" />
          <circle cx="95" cy="48" r="2.5" fill="#E9CE84" />
        </svg>
      </motion.div>

      {/* Right Auspicious Cloud */}
      <motion.div
        animate={{
          x: [4, -4, 4],
          y: [-3, 3, -3],
        }}
        transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute -right-6 sm:-right-12 top-10 pointer-events-none z-20"
      >
        <svg className="w-28 sm:w-36 h-20 text-[#AD8A2E] drop-shadow-md" viewBox="0 0 160 90" fill="none" stroke="currentColor">
          <path
            d="M10 60 C 10 40, 30 30, 50 35 C 60 15, 90 15, 105 28 C 125 20, 145 35, 140 55 C 135 70, 105 72, 85 68 C 65 72, 30 72, 10 60 Z"
            strokeWidth="1.8"
            fill="#FFFDF7"
            fillOpacity="0.9"
          />
          <path d="M50 35 C 65 42, 70 55, 65 65" strokeWidth="1.2" stroke="#AD8A2E" />
          <circle cx="75" cy="50" r="2.5" fill="#B23B28" />
        </svg>
      </motion.div>

      {/* =========================================================================
          4. DRIFTING SAKURA / LOTUS PETALS & STARDUST PARTICLES (Cardcaptor Sakura)
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
        {/* Petal 1 */}
        <motion.div
          animate={{
            y: [-15, 120],
            x: [-10, 20],
            rotate: [0, 180],
            opacity: [0, 0.9, 0],
          }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-6 top-0 w-3 h-4 rounded-full bg-gradient-to-br from-[#FFB7C5] to-[#E86F88] transform rotate-45"
        />
        {/* Petal 2 */}
        <motion.div
          animate={{
            y: [-10, 130],
            x: [15, -15],
            rotate: [45, 240],
            opacity: [0, 0.85, 0],
          }}
          transition={{ duration: 5.1, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute right-8 top-0 w-2.5 h-3.5 rounded-full bg-gradient-to-br from-[#FFDF85] to-[#FF9EAA] transform rotate-12"
        />
        {/* Sparkling Star */}
        <motion.div
          animate={{
            scale: [0.5, 1.3, 0.5],
            opacity: [0.3, 1, 0.3],
            rotate: [0, 90, 180],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-4 top-14 text-[#E9CE84]"
        >
          <Sparkles className="w-4 h-4 fill-[#E9CE84]" />
        </motion.div>
      </div>

      {/* =========================================================================
          5. MAIN ANIME CARDCAPTOR SAKURA LADY THAO PORTRAIT IN ÁO DÀI WITH I-CHING NAILS
         ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        whileHover={{ scale: 1.03 }}
        className={`relative z-10 ${className}`}
      >
        {/* Ornate Gold & Cinnabar Magical Girl Frame */}
        <div className="relative p-1 rounded-2xl bg-gradient-to-b from-[#E9CE84] via-[#B23B28] to-[#7C2A1C] shadow-[0_14px_36px_rgba(46,36,21,0.35)]">
          {/* Inner Golden Border */}
          <div className="relative rounded-[14px] overflow-hidden border-2 border-[#FFFDF7] bg-[#2D4D3D] aspect-square">
            {!imageError ? (
              <img
                src="/lady_thao_anime.jpg"
                alt="Lady Thao (Cô Thảo Bói Quẻ) - Cardcaptor Sakura x Traditional Vietnamese Folklore"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transform hover:scale-108 transition-transform duration-700"
              />
            ) : (
              /* Fallback High-Quality Art Vector */
              <div className="w-full h-full flex items-center justify-center bg-[#2D4D3D]">
                <img
                  src="/lady_thao_young.jpg"
                  alt="Lady Thao"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Subtle Vignette & Warm Magical Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1610]/45 via-transparent to-transparent pointer-events-none" />

            {/* Cardcaptor Sakura x I-Ching Nail Art Badge */}
            <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-[#1C1610]/85 backdrop-blur-xs border border-[#E9CE84] text-[#E9CE84] text-[0.62rem] font-sans font-bold flex items-center gap-1 shadow-md">
              <span className="text-[#FF9EAA]">🌸</span>
              <span>Cô Thảo · ☯ Móng Bát Quái</span>
            </div>
          </div>

          {/* 4 Golden Corner Ornaments */}
          <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#E9CE84]" />
          <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#E9CE84]" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#E9CE84]" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#E9CE84]" />
        </div>
      </motion.div>
    </div>
  );
};
