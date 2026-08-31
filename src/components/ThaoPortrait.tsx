import React from 'react';
import { motion } from 'motion/react';

interface ThaoPortraitProps {
  className?: string;
  isSpeaking?: boolean;
  showAura?: boolean;
}

export const ThaoPortrait: React.FC<ThaoPortraitProps> = ({
  className = 'w-36 sm:w-40 h-auto',
  isSpeaking = false,
  showAura = true,
}) => {
  return (
    <div className="flex justify-center my-1 relative overflow-visible">
      {/* Mystical Golden & Cinnabar Aura Radiance behind Lady Thao */}
      {showAura && (
        <div
          className={`absolute inset-0 m-auto w-36 h-36 rounded-full bg-gradient-to-tr from-[#E9CE84]/40 via-[#B23B28]/25 to-[#E9CE84]/50 blur-2xl pointer-events-none transition-all duration-700 ${
            isSpeaking ? 'animate-aura-glow scale-125' : 'opacity-70 scale-105'
          }`}
        />
      )}

      {/* Atmospheric Parting Clouds (Mây Tiên Cổ Điển) Layer 1 - Left Floating Cloud */}
      <motion.div
        initial={{ x: -60, opacity: 0, scale: 0.7 }}
        animate={{ x: 0, opacity: 0.55, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute -left-6 top-8 pointer-events-none z-0"
      >
        <svg className="w-24 h-16 text-[#AD8A2E] opacity-60" viewBox="0 0 120 70" fill="none" stroke="currentColor">
          <path
            d="M10 50 C 10 35, 25 25, 40 30 C 45 15, 65 15, 75 25 C 90 20, 105 32, 100 48 C 95 60, 75 62, 60 58 C 45 62, 20 62, 10 50 Z"
            strokeWidth="1.2"
            fill="#FBF6E8"
            fillOpacity="0.45"
          />
          <path d="M40 30 C 50 35, 55 45, 50 55" strokeWidth="0.8" />
          <path d="M75 25 C 78 35, 75 45, 65 52" strokeWidth="0.8" />
        </svg>
      </motion.div>

      {/* Atmospheric Parting Clouds Layer 2 - Right Floating Cloud */}
      <motion.div
        initial={{ x: 60, opacity: 0, scale: 0.7 }}
        animate={{ x: 0, opacity: 0.55, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
        className="absolute -right-6 top-10 pointer-events-none z-0"
      >
        <svg className="w-24 h-16 text-[#AD8A2E] opacity-60" viewBox="0 0 120 70" fill="none" stroke="currentColor">
          <path
            d="M10 50 C 10 35, 25 25, 40 30 C 45 15, 65 15, 75 25 C 90 20, 105 32, 100 48 C 95 60, 75 62, 60 58 C 45 62, 20 62, 10 50 Z"
            strokeWidth="1.2"
            fill="#FBF6E8"
            fillOpacity="0.45"
          />
          <path d="M40 30 C 50 35, 55 45, 50 55" strokeWidth="0.8" />
        </svg>
      </motion.div>

      {/* Swirling Mystical Smoke Ribbons at Base */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 0.4, scaleY: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-48 h-10 pointer-events-none z-20"
      >
        <svg className="w-full h-full text-[#AD8A2E]" viewBox="0 0 200 40" fill="none" stroke="currentColor">
          <path d="M10 35 Q 50 15, 100 35 T 190 35" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <path d="M30 38 Q 75 22, 120 38 T 170 38" strokeWidth="0.8" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Main Vector SVG Portrait of Lady Thao */}
      <svg
        className={`filter drop-shadow-[0_12px_24px_rgba(46,36,21,0.28)] relative z-10 transition-transform duration-500 ${className} ${
          isSpeaking ? 'animate-float-slow' : ''
        }`}
        viewBox="0 0 160 190"
        aria-label="Lady Thao Fortune Teller Portrait"
      >
        {/* Soft ground shadow base */}
        <ellipse cx="80" cy="155" rx="58" ry="12" fill="#2A241C" opacity="0.08" />

        {/* Traditional Auspicious Halo Arc */}
        <circle
          cx="80"
          cy="75"
          r="68"
          fill="none"
          stroke="#E9CE84"
          strokeWidth="0.9"
          strokeDasharray="3 3"
          opacity="0.6"
        />

        {/* Vietnamese Silk Robe / Áo Dài Tơ Tằm Cổ Truyền (Deep Emerald Jade with Cinnabar Under-layer) */}
        <path
          d="M32 96 C 30 130, 34 160, 40 186 L120 186 C 126 160, 130 130, 128 96 Z"
          fill="#2D4D3D"
        />
        <path
          d="M32 96 C 30 130, 34 160, 40 186 L120 186 C 126 160, 130 130, 128 96 Z"
          fill="none"
          stroke="#1F1A14"
          strokeWidth="1.2"
        />

        {/* Inner Silk Lapel (Traditional Lotus Pink / Cinnabar) */}
        <path
          d="M62 90 L80 125 L98 90 Z"
          fill="#9C2C1E"
          stroke="#1F1A14"
          strokeWidth="0.8"
        />

        {/* Golden Silk Cloud & Lotus Embroidery on Robe */}
        <path
          d="M56 110 C 54 135, 56 160, 58 186"
          fill="none"
          stroke="#E9CE84"
          strokeWidth="1"
          opacity="0.85"
        />
        <path
          d="M104 110 C 106 135, 104 160, 102 186"
          fill="none"
          stroke="#E9CE84"
          strokeWidth="1"
          opacity="0.85"
        />
        {/* Subtle Lotus Petal Embroidery Motif */}
        <path
          d="M74 140 C 77 134, 83 134, 86 140 C 80 144, 76 142, 74 140 Z"
          fill="none"
          stroke="#E9CE84"
          strokeWidth="0.8"
          opacity="0.75"
        />

        {/* High Mandarin Collar & Imperial Jade Pendant */}
        <path
          d="M58 82 C 56 90, 58 98, 62 102 L98 102 C 102 98, 104 90, 102 82 Z"
          fill="#2D4D3D"
          stroke="#1F1A14"
          strokeWidth="1.1"
        />
        <path
          d="M64 82 C 66 90, 70 96, 80 98 C 90 96, 94 90, 96 82"
          fill="none"
          stroke="#E9CE84"
          strokeWidth="1"
        />
        {/* Imperial Jade Medallion */}
        <circle cx="80" cy="91" r="4.5" fill="#4B785E" stroke="#E9CE84" strokeWidth="1" />
        <circle cx="80" cy="91" r="1.6" fill="#E9CE84" />

        {/* Slender Neck & Graceful Face Contour */}
        <path d="M60 46 C 58 62, 60 76, 66 86 L94 86 C 100 76, 102 62, 100 46 Z" fill="#EAC9A4" />

        {/* Long Silk Hair Flowing Back */}
        <path
          d="M46 40 C 44 60, 48 78, 54 92 C 44 90, 36 78, 36 60 C 36 46, 40 34, 46 24 Z"
          fill="#1C1610"
        />
        <path
          d="M114 40 C 116 60, 112 78, 106 92 C 116 90, 124 78, 124 60 C 124 46, 120 34, 114 24 Z"
          fill="#1C1610"
        />

        {/* Hair Top, Traditional Vietnamese Chignon Bun & Silk Crown */}
        <path
          d="M50 20 C 58 10, 70 4, 80 4 C 90 4, 102 10, 110 20 C 112 28, 110 36, 106 42 C 100 30, 90 22, 80 22 C 70 22, 60 30, 54 42 C 50 36, 48 28, 50 20 Z"
          fill="#1C1610"
        />
        <ellipse cx="80" cy="12" rx="14" ry="9" fill="#1C1610" />

        {/* Golden Lotus Hairpin (Trâm Cài Hoa Sen) */}
        <path d="M92 8 C 98 6, 105 7, 108 13" fill="none" stroke="#E9CE84" strokeWidth="1.3" />
        {/* Lotus Blossom on Pin */}
        <circle cx="108" cy="13" r="2.2" fill="#B4574A" />
        <circle cx="108" cy="13" r="0.9" fill="#E9CE84" />

        {/* Willow-leaf Eyebrows (Lông Mày Lá Liễu) */}
        <path
          d="M53 57 C 56 54, 61 54, 63 56"
          fill="none"
          stroke="#2A241C"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M97 56 C 99 54, 104 54, 107 57"
          fill="none"
          stroke="#2A241C"
          strokeWidth="1.1"
          strokeLinecap="round"
        />

        {/* Almond Eyes with Gentle Insight & Warmth */}
        <path
          d="M55 63 C 58 60, 63 60, 66 63 C 63 66, 58 66, 55 63 Z"
          fill="#FFFFFF"
          stroke="#2A241C"
          strokeWidth="0.9"
        />
        <circle cx="61" cy="63" r="2" fill="#241B14" />
        <circle cx="60" cy="62" r="0.7" fill="#FFFFFF" />

        <path
          d="M94 63 C 97 60, 102 60, 105 63 C 102 66, 97 66, 94 63 Z"
          fill="#FFFFFF"
          stroke="#2A241C"
          strokeWidth="0.9"
        />
        <circle cx="99" cy="63" r="2" fill="#241B14" />
        <circle cx="98" cy="62" r="0.7" fill="#FFFFFF" />

        {/* Soft Peach Cheeks (Má Ửng Đào) */}
        <ellipse cx="57" cy="71" rx="5.5" ry="3.5" fill="#B4574A" opacity="0.28" />
        <ellipse cx="103" cy="71" rx="5.5" ry="3.5" fill="#B4574A" opacity="0.28" />

        {/* Graceful Nose & Serene Smile */}
        <path
          d="M78 67 C 79 70, 79 72, 78 74"
          fill="none"
          stroke="#2A241C"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <path
          d="M73 78 C 76 80.5, 84 80.5, 87 78"
          fill="none"
          stroke="#8C2B20"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
