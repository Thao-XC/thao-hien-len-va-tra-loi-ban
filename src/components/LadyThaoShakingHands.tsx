import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface LadyThaoShakingHandsProps {
  isShaking: boolean;
  isActiveMode: boolean;
}

export const LadyThaoShakingHands: React.FC<LadyThaoShakingHandsProps> = ({
  isShaking,
  isActiveMode,
}) => {
  if (!isActiveMode) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
      {/* Speech Bubble from Cô Thảo when shaking */}
      {isShaking && (
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute -top-12 z-40 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#591008] via-[#7C180E] to-[#400702] border border-[#FFE082] shadow-lg flex items-center gap-1.5 text-xs text-[#FFE082] font-serif italic"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FFE082] animate-spin [animation-duration:3s]" />
          <span>"Thảo đang thành tâm khấn nguyện và lắc quẻ..."</span>
          <span>🌸</span>
        </motion.div>
      )}

      {/* LEFT HAND OF CÔ THẢO WITH BÁT QUÁI NAILS CLASPING TUBE */}
      <motion.div
        animate={
          isShaking
            ? {
                x: [-3, 4, -5, 3, -2, 0],
                y: [0, -6, 4, -4, 2, 0],
                rotate: [-6, 3, -8, 5, -3],
              }
            : {
                x: 0,
                y: [0, -2, 0],
                rotate: -2,
              }
        }
        transition={
          isShaking
            ? { duration: 0.22, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
        }
        className="absolute -left-7 sm:-left-9 top-1/2 -translate-y-1/2 flex items-center pointer-events-none"
      >
        {/* Left Sleeve & Hand SVG */}
        <svg
          className="w-18 sm:w-22 h-20 sm:h-24 filter drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)] pointer-events-none"
          viewBox="0 0 120 140"
          fill="none"
        >
          {/* Imperial Emerald Silk Robe Sleeve */}
          <path
            d="M 5 20 Q 30 15, 60 45 L 50 115 Q 20 130, 0 110 Z"
            fill="url(#leftSleeveGrad)"
            stroke="#FFE082"
            strokeWidth="1.5"
          />
          {/* Golden Embroidered Floral Wave on Sleeve Cuff */}
          <path
            d="M 45 42 Q 55 75, 42 110"
            stroke="#FFE082"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 40 46 Q 50 75, 37 105"
            stroke="#E9CE84"
            strokeWidth="1"
            strokeDasharray="2 3"
          />

          {/* Jade Bracelet on Wrist */}
          <ellipse
            cx="58"
            cy="70"
            rx="5"
            ry="18"
            fill="url(#jadeBangleGrad)"
            stroke="#D4AF37"
            strokeWidth="1.2"
          />

          {/* Slender Wrist & Palm */}
          <path
            d="M 56 58 Q 75 60, 88 65 Q 92 80, 85 92 Q 68 85, 54 82 Z"
            fill="#FFEAD8"
            stroke="#D1A78B"
            strokeWidth="1"
          />

          {/* Golden Ring on Middle Finger */}
          <circle cx="85" cy="74" r="2.5" fill="#FFE082" stroke="#B23B28" strokeWidth="0.8" />

          {/* Finger 1 (Index) Clasping Tube Rim */}
          <path
            d="M 85 64 Q 102 60, 112 66 Q 110 73, 98 72 Z"
            fill="#FFF0E2"
            stroke="#D1A78B"
            strokeWidth="0.8"
          />
          {/* Bát Quái Cinnabar & Gold Nail: ☲ (Ly - Hỏa) */}
          <rect x="106" y="63" width="5.5" height="4" rx="2" fill="#B23B28" stroke="#FFE082" strokeWidth="0.8" />
          <line x1="107.5" y1="64.5" x2="110" y2="64.5" stroke="#FFE082" strokeWidth="0.8" />

          {/* Finger 2 (Middle) Clasping Tube Center */}
          <path
            d="M 88 72 Q 108 72, 116 77 Q 113 84, 96 82 Z"
            fill="#FFEAD8"
            stroke="#D1A78B"
            strokeWidth="0.8"
          />
          {/* Bát Quái Cinnabar & Gold Nail: ☳ (Chấn - Lôi) */}
          <rect x="110" y="74" width="5.5" height="4" rx="2" fill="#B23B28" stroke="#FFE082" strokeWidth="0.8" />
          <line x1="111.5" y1="75.5" x2="114" y2="75.5" stroke="#FFE082" strokeWidth="0.8" />

          {/* Finger 3 (Ring) Clasping Lower Tube */}
          <path
            d="M 86 80 Q 104 82, 111 88 Q 107 94, 92 90 Z"
            fill="#FFF0E2"
            stroke="#D1A78B"
            strokeWidth="0.8"
          />
          {/* Bát Quái Cinnabar & Gold Nail: ☴ (Tốn - Phong) */}
          <rect x="105" y="85" width="5.5" height="4" rx="2" fill="#B23B28" stroke="#FFE082" strokeWidth="0.8" />
          <line x1="106.5" y1="86.5" x2="109" y2="86.5" stroke="#FFE082" strokeWidth="0.8" />

          {/* Finger 4 (Little/Pinky) Clasping Bottom */}
          <path
            d="M 82 88 Q 96 92, 102 98 Q 98 103, 86 96 Z"
            fill="#FFEAD8"
            stroke="#D1A78B"
            strokeWidth="0.8"
          />
          {/* Bát Quái Cinnabar & Gold Nail: ☱ (Đoài - Trạch) */}
          <rect x="96" y="95" width="5" height="3.5" rx="1.5" fill="#B23B28" stroke="#FFE082" strokeWidth="0.8" />

          {/* Thumb Clasping Front Plate with Yin-Yang ☯ */}
          <path
            d="M 68 54 Q 85 45, 96 52 Q 95 60, 80 62 Z"
            fill="#FFF0E2"
            stroke="#D1A78B"
            strokeWidth="0.8"
          />
          {/* Thumb Nail: ☰ (Càn - Thiên) */}
          <rect x="90" y="49" width="6" height="4.5" rx="2" fill="#8C1D13" stroke="#FFE082" strokeWidth="0.9" />
          <line x1="91.5" y1="50.5" x2="94.5" y2="50.5" stroke="#FFE082" strokeWidth="0.8" />
          <line x1="91.5" y1="52" x2="94.5" y2="52" stroke="#FFE082" strokeWidth="0.8" />

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="leftSleeveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1B4D3E" />
              <stop offset="50%" stopColor="#2E7D62" />
              <stop offset="100%" stopColor="#0F3327" />
            </linearGradient>
            <linearGradient id="jadeBangleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A3E4D7" />
              <stop offset="50%" stopColor="#1ABC9C" />
              <stop offset="100%" stopColor="#0E6251" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* RIGHT HAND OF CÔ THẢO WITH BÁT QUÁI NAILS CLASPING TUBE */}
      <motion.div
        animate={
          isShaking
            ? {
                x: [3, -4, 5, -3, 2, 0],
                y: [0, 6, -4, 4, -2, 0],
                rotate: [6, -3, 8, -5, 3],
              }
            : {
                x: 0,
                y: [0, 2, 0],
                rotate: 2,
              }
        }
        transition={
          isShaking
            ? { duration: 0.22, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
        }
        className="absolute -right-7 sm:-right-9 top-1/2 -translate-y-1/2 flex items-center pointer-events-none"
      >
        {/* Right Sleeve & Hand SVG (Mirrored) */}
        <svg
          className="w-18 sm:w-22 h-20 sm:h-24 filter drop-shadow-[0_3px_8px_rgba(0,0,0,0.45)] transform -scale-x-100 pointer-events-none"
          viewBox="0 0 120 140"
          fill="none"
        >
          {/* Imperial Emerald Silk Robe Sleeve */}
          <path
            d="M 5 20 Q 30 15, 60 45 L 50 115 Q 20 130, 0 110 Z"
            fill="url(#rightSleeveGrad)"
            stroke="#FFE082"
            strokeWidth="1.5"
          />
          {/* Golden Floral Wave */}
          <path
            d="M 45 42 Q 55 75, 42 110"
            stroke="#FFE082"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Jade Bracelet */}
          <ellipse
            cx="58"
            cy="70"
            rx="5"
            ry="18"
            fill="url(#jadeBangleGradRight)"
            stroke="#D4AF37"
            strokeWidth="1.2"
          />

          {/* Slender Wrist & Palm */}
          <path
            d="M 56 58 Q 75 60, 88 65 Q 92 80, 85 92 Q 68 85, 54 82 Z"
            fill="#FFEAD8"
            stroke="#D1A78B"
            strokeWidth="1"
          />

          {/* Golden Ring */}
          <circle cx="85" cy="74" r="2.5" fill="#FFE082" stroke="#B23B28" strokeWidth="0.8" />

          {/* Finger 1 (Index) Clasping Tube Rim */}
          <path
            d="M 85 64 Q 102 60, 112 66 Q 110 73, 98 72 Z"
            fill="#FFF0E2"
            stroke="#D1A78B"
            strokeWidth="0.8"
          />
          {/* Bát Quái Nail: ☶ (Cấn - Sơn) */}
          <rect x="106" y="63" width="5.5" height="4" rx="2" fill="#B23B28" stroke="#FFE082" strokeWidth="0.8" />
          <line x1="107.5" y1="64.5" x2="110" y2="64.5" stroke="#FFE082" strokeWidth="0.8" />

          {/* Finger 2 (Middle) Clasping Tube Center */}
          <path
            d="M 88 72 Q 108 72, 116 77 Q 113 84, 96 82 Z"
            fill="#FFEAD8"
            stroke="#D1A78B"
            strokeWidth="0.8"
          />
          {/* Bát Quái Nail: ☵ (Khảm - Thủy) */}
          <rect x="110" y="74" width="5.5" height="4" rx="2" fill="#B23B28" stroke="#FFE082" strokeWidth="0.8" />
          <line x1="111.5" y1="75.5" x2="114" y2="75.5" stroke="#FFE082" strokeWidth="0.8" />

          {/* Finger 3 (Ring) Clasping Lower Tube */}
          <path
            d="M 86 80 Q 104 82, 111 88 Q 107 94, 92 90 Z"
            fill="#FFF0E2"
            stroke="#D1A78B"
            strokeWidth="0.8"
          />
          {/* Bát Quái Nail: ☷ (Khôn - Địa) */}
          <rect x="105" y="85" width="5.5" height="4" rx="2" fill="#B23B28" stroke="#FFE082" strokeWidth="0.8" />

          {/* Finger 4 (Little) Clasping Bottom */}
          <path
            d="M 82 88 Q 96 92, 102 98 Q 98 103, 86 96 Z"
            fill="#FFEAD8"
            stroke="#D1A78B"
            strokeWidth="0.8"
          />
          {/* Bát Quái Nail: ☯ (Âm Dương Thái Cực) */}
          <rect x="96" y="95" width="5" height="3.5" rx="1.5" fill="#8C1D13" stroke="#FFE082" strokeWidth="0.8" />

          {/* Thumb Clasping Front */}
          <path
            d="M 68 54 Q 85 45, 96 52 Q 95 60, 80 62 Z"
            fill="#FFF0E2"
            stroke="#D1A78B"
            strokeWidth="0.8"
          />
          {/* Thumb Nail */}
          <rect x="90" y="49" width="6" height="4.5" rx="2" fill="#B23B28" stroke="#FFE082" strokeWidth="0.9" />
          <line x1="91.5" y1="50.5" x2="94.5" y2="50.5" stroke="#FFE082" strokeWidth="0.8" />

          <defs>
            <linearGradient id="rightSleeveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1B4D3E" />
              <stop offset="50%" stopColor="#2E7D62" />
              <stop offset="100%" stopColor="#0F3327" />
            </linearGradient>
            <linearGradient id="jadeBangleGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A3E4D7" />
              <stop offset="50%" stopColor="#1ABC9C" />
              <stop offset="100%" stopColor="#0E6251" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
};
