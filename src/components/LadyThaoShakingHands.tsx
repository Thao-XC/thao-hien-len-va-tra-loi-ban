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
          className="absolute -top-14 z-40 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#591008] via-[#7C180E] to-[#400702] border-2 border-[#FFE082] shadow-[0_6px_20px_rgba(0,0,0,0.65)] flex items-center gap-2 text-xs text-[#FFE082] font-serif font-bold italic whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4 text-[#FFE082] animate-spin [animation-duration:3s]" />
          <span>"Thảo đang dùng ngọc thủ & móng Bát Quái lắc quẻ..."</span>
          <span>🌸</span>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* LEFT HAND OF CÔ THẢO WITH PROMINENT BÁT QUÁI NAIL ART */}
      {/* ========================================================= */}
      <motion.div
        animate={
          isShaking
            ? {
                x: [-4, 5, -6, 4, -3, 0],
                y: [0, -7, 5, -5, 3, 0],
                rotate: [-8, 4, -9, 6, -4],
              }
            : {
                x: 0,
                y: [0, -3, 0],
                rotate: -2,
              }
        }
        transition={
          isShaking
            ? { duration: 0.22, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
        }
        className="absolute -left-16 sm:-left-22 top-[54%] -translate-y-1/2 flex items-center pointer-events-none z-30"
      >
        <svg
          className="w-32 sm:w-40 h-38 sm:h-46 filter drop-shadow-[0_8px_22px_rgba(0,0,0,0.55)] pointer-events-none"
          viewBox="0 0 200 240"
          fill="none"
        >
          <defs>
            {/* Emerald Silk Sleeve Gradient */}
            <linearGradient id="leftSleeveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B2B20" />
              <stop offset="40%" stopColor="#1B5E46" />
              <stop offset="70%" stopColor="#2A7B5F" />
              <stop offset="100%" stopColor="#0D3627" />
            </linearGradient>

            {/* Translucent Imperial Hetian Jade Bangle Gradient */}
            <linearGradient id="jadeBangleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A2E8D8" />
              <stop offset="35%" stopColor="#2ECC71" />
              <stop offset="70%" stopColor="#16A085" />
              <stop offset="100%" stopColor="#0E5A44" />
            </linearGradient>

            {/* Porcelain Skin Gradient with Peach & Rose Blush */}
            <linearGradient id="skinGrad" x1="0%" y1="20%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#FFF7F0" />
              <stop offset="45%" stopColor="#FDE1CF" />
              <stop offset="80%" stopColor="#F5C4A6" />
              <stop offset="100%" stopColor="#E09F7B" />
            </linearGradient>

            {/* Deep Imperial Cinnabar Red Lacquer Base */}
            <linearGradient id="cinnabarNailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A060A" />
              <stop offset="35%" stopColor="#8A0E18" />
              <stop offset="75%" stopColor="#BD1A27" />
              <stop offset="100%" stopColor="#E53935" />
            </linearGradient>

            {/* 24K Real Gold Foil Gradient */}
            <linearGradient id="goldFoilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF3B0" />
              <stop offset="30%" stopColor="#FFD700" />
              <stop offset="70%" stopColor="#E5A910" />
              <stop offset="100%" stopColor="#996E00" />
            </linearGradient>

            {/* High-Gloss Gel Specular Streak */}
            <linearGradient id="nailGlossStreak" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.75" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ================= SLEEVE ================= */}
          {/* Outer Flowing Silk Robe */}
          <path
            d="M 0 35 Q 40 25, 78 65 L 68 185 Q 30 200, 0 175 Z"
            fill="url(#leftSleeveGrad)"
            stroke="#D4AF37"
            strokeWidth="2"
          />
          {/* Inner Golden Silk Lining Cuff */}
          <path
            d="M 68 62 Q 86 115, 60 182"
            stroke="#FFE082"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 63 65 Q 81 115, 55 178"
            stroke="#540B04"
            strokeWidth="1.5"
          />
          {/* Embroidered Golden Phoenix Clouds on Cuff */}
          <path
            d="M 40 70 Q 55 85, 42 100 Q 60 115, 48 135 Q 62 150, 45 168"
            stroke="#FFF1A8"
            strokeWidth="1.8"
            strokeDasharray="3 4"
            fill="none"
          />

          {/* ================= WRIST & JADE BANGLE ================= */}
          {/* Slender Wrist */}
          <path
            d="M 72 82 Q 95 86, 110 95 L 105 142 Q 88 140, 65 130 Z"
            fill="url(#skinGrad)"
            stroke="#C58B6D"
            strokeWidth="1.2"
          />

          {/* Imperial Hetian Translucent Jade Bangle */}
          <g transform="rotate(-12 85 112)">
            {/* Jade Bangle Shadow */}
            <ellipse cx="85" cy="114" rx="8" ry="28" fill="rgba(0,0,0,0.3)" />
            {/* Jade Ring */}
            <ellipse
              cx="85"
              cy="112"
              rx="8" ry="26"
              fill="url(#jadeBangleGrad)"
              stroke="#D4AF37"
              strokeWidth="2"
            />
            {/* Translucent Luster Highlight */}
            <ellipse cx="83" cy="104" rx="3.5" ry="16" fill="white" opacity="0.45" />
            {/* Gold Filigree Band Wrap on Jade */}
            <rect x="80" y="108" width="10" height="7" rx="2" fill="url(#goldFoilGrad)" stroke="#540B04" strokeWidth="0.8" />
            <circle cx="85" cy="111.5" r="1.8" fill="#B23B28" stroke="#FFE082" strokeWidth="0.6" />
          </g>

          {/* ================= PALM & KNUCKLES ================= */}
          <path
            d="M 104 92 Q 128 92, 142 105 Q 148 132, 136 155 Q 112 148, 100 138 Z"
            fill="url(#skinGrad)"
            stroke="#C58B6D"
            strokeWidth="1.2"
          />
          {/* Soft Palm Crease / Venus Mount Shadow */}
          <path
            d="M 112 105 Q 126 122, 122 144"
            stroke="#C58B6D"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
            fill="none"
          />

          {/* ================= FINGERS & PROMINENT NAIL ART ================= */}

          {/* ----------------- FINGER 4: PINKY (NGÓN ÚT) ----------------- */}
          {/* Finger Flesh */}
          <path
            d="M 125 146 Q 145 152, 158 162 Q 155 174, 134 165 Z"
            fill="url(#skinGrad)"
            stroke="#C58B6D"
            strokeWidth="1.2"
          />
          {/* Fingertip Rosy Warmth */}
          <circle cx="152" cy="162" r="5" fill="#F8AFA6" opacity="0.5" />

          {/* NAIL: ☱ ĐOÀI (TRẠCH) - ALMOND STILETTO NAIL */}
          <g transform="rotate(22 152 163)">
            {/* Nail Base Drop Shadow */}
            <path d="M 148 156 Q 166 158, 172 164 Q 166 171, 148 168 Z" fill="rgba(0,0,0,0.4)" />
            {/* Cinnabar Lacquer Nail Body */}
            <path
              d="M 147 155 Q 168 157, 174 164 Q 168 171, 147 169 Z"
              fill="url(#cinnabarNailGrad)"
              stroke="url(#goldFoilGrad)"
              strokeWidth="1.5"
            />
            {/* 3D Gel Gloss Streak */}
            <path d="M 150 157 Q 164 159, 169 162" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" fill="none" />
            {/* TRIGRAM: ☱ ĐOÀI (Broken top, solid middle, solid bottom) */}
            <g stroke="#FFF3B0" strokeWidth="1.6" strokeLinecap="round">
              {/* Broken Line */}
              <line x1="154" y1="160" x2="157" y2="160" />
              <line x1="160" y1="160" x2="163" y2="160" />
              {/* Solid Line */}
              <line x1="154" y1="163" x2="163" y2="163" />
              {/* Solid Line */}
              <line x1="154" y1="166" x2="163" y2="166" />
            </g>
            {/* Gold Caviar Cuticle Beads */}
            <circle cx="148.5" cy="162" r="1" fill="#FFE57F" stroke="#996E00" strokeWidth="0.4" />
          </g>

          {/* ----------------- FINGER 3: RING (NGÓN ÁP ÚT) ----------------- */}
          {/* Finger Flesh */}
          <path
            d="M 132 132 Q 158 135, 172 142 Q 168 155, 138 148 Z"
            fill="url(#skinGrad)"
            stroke="#C58B6D"
            strokeWidth="1.2"
          />
          {/* Knuckle shadow */}
          <path d="M 148 135 Q 150 144, 144 148" stroke="#D19875" strokeWidth="1" fill="none" />
          <circle cx="166" cy="142" r="6" fill="#F8AFA6" opacity="0.5" />

          {/* NAIL: ☳ CHẤN (LÔI) - PROMINENT ALMOND NAIL */}
          <g transform="rotate(14 168 143)">
            <path d="M 162 135 Q 183 137, 191 144 Q 183 152, 162 149 Z" fill="rgba(0,0,0,0.4)" />
            <path
              d="M 161 134 Q 185 136, 193 144 Q 185 152, 161 150 Z"
              fill="url(#cinnabarNailGrad)"
              stroke="url(#goldFoilGrad)"
              strokeWidth="1.6"
            />
            {/* Gel Gloss Streak */}
            <path d="M 165 137 Q 181 139, 187 142" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" fill="none" />
            {/* TRIGRAM: ☳ CHẤN (Broken, Broken, Solid) */}
            <g stroke="#FFF3B0" strokeWidth="1.7" strokeLinecap="round">
              {/* Broken 1 */}
              <line x1="168" y1="139" x2="172" y2="139" />
              <line x1="175" y1="139" x2="179" y2="139" />
              {/* Broken 2 */}
              <line x1="168" y1="143" x2="172" y2="143" />
              <line x1="175" y1="143" x2="179" y2="143" />
              {/* Solid 3 */}
              <line x1="168" y1="147" x2="179" y2="147" />
            </g>
            {/* Gold Stud at Cuticle */}
            <circle cx="163" cy="143" r="1.3" fill="#FFE57F" stroke="#996E00" strokeWidth="0.5" />
          </g>

          {/* ----------------- FINGER 2: MIDDLE (NGÓN GIỮA - LONGEST) ----------------- */}
          {/* Finger Flesh */}
          <path
            d="M 134 112 Q 166 114, 184 121 Q 178 135, 140 128 Z"
            fill="url(#skinGrad)"
            stroke="#C58B6D"
            strokeWidth="1.2"
          />
          {/* Golden Lotus Ring on Middle Finger */}
          <g transform="translate(150 114)">
            <rect x="0" y="0" width="7" height="15" rx="3" fill="url(#goldFoilGrad)" stroke="#540B04" strokeWidth="1" />
            {/* Ruby Gem in Lotus setting */}
            <circle cx="3.5" cy="7.5" r="2.8" fill="#D32F2F" stroke="#FFE082" strokeWidth="0.8" />
            <circle cx="2.5" cy="6.5" r="0.9" fill="white" opacity="0.8" />
          </g>
          {/* Rosy tip */}
          <circle cx="178" cy="122" r="6" fill="#F8AFA6" opacity="0.5" />

          {/* NAIL: ☲ LY (HỎA) - VERY PROMINENT CENTER NAIL */}
          <g transform="rotate(8 180 122)">
            <path d="M 174 113 Q 198 115, 206 123 Q 198 132, 174 129 Z" fill="rgba(0,0,0,0.4)" />
            <path
              d="M 173 112 Q 200 114, 208 123 Q 200 132, 173 130 Z"
              fill="url(#cinnabarNailGrad)"
              stroke="url(#goldFoilGrad)"
              strokeWidth="1.8"
            />
            {/* High-Gloss Light Streak */}
            <path d="M 177 115 Q 195 117, 202 121" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" fill="none" />
            {/* TRIGRAM: ☲ LY (Solid, Broken, Solid) */}
            <g stroke="#FFF3B0" strokeWidth="1.8" strokeLinecap="round">
              {/* Solid 1 */}
              <line x1="181" y1="117" x2="193" y2="117" />
              {/* Broken 2 */}
              <line x1="181" y1="122" x2="185.5" y2="122" />
              <line x1="188.5" y1="122" x2="193" y2="122" />
              {/* Solid 3 */}
              <line x1="181" y1="126" x2="193" y2="126" />
            </g>
            {/* Jeweled Caviar Beads at Base */}
            <circle cx="175.5" cy="122" r="1.5" fill="#FFE57F" stroke="#996E00" strokeWidth="0.5" />
            <circle cx="175.5" cy="118.5" r="1" fill="#FFD700" />
            <circle cx="175.5" cy="125.5" r="1" fill="#FFD700" />
          </g>

          {/* ----------------- FINGER 1: INDEX (NGÓN TRỎ) ----------------- */}
          {/* Finger Flesh */}
          <path
            d="M 128 92 Q 158 94, 175 102 Q 170 116, 134 110 Z"
            fill="url(#skinGrad)"
            stroke="#C58B6D"
            strokeWidth="1.2"
          />
          {/* Knuckle highlight */}
          <path d="M 144 94 Q 146 103, 140 109" stroke="#D19875" strokeWidth="1" fill="none" />
          <circle cx="168" cy="102" r="6" fill="#F8AFA6" opacity="0.5" />

          {/* NAIL: ☰ CÀN (THIÊN - THUẦN DƯƠNG) */}
          <g transform="rotate(3 170 102)">
            <path d="M 166 93 Q 189 95, 197 103 Q 189 112, 166 109 Z" fill="rgba(0,0,0,0.4)" />
            <path
              d="M 165 92 Q 191 94, 199 103 Q 191 112, 165 110 Z"
              fill="url(#cinnabarNailGrad)"
              stroke="url(#goldFoilGrad)"
              strokeWidth="1.7"
            />
            {/* Gloss Streak */}
            <path d="M 169 95 Q 186 97, 193 101" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" fill="none" />
            {/* TRIGRAM: ☰ CÀN (3 Clean Bold Solid Bars) */}
            <g stroke="#FFF3B0" strokeWidth="1.8" strokeLinecap="round">
              <line x1="173" y1="97" x2="185" y2="97" />
              <line x1="173" y1="102" x2="185" y2="102" />
              <line x1="173" y1="106" x2="185" y2="106" />
            </g>
            {/* Diamond Gem Cuticle */}
            <polygon points="167,102 169,100 171,102 169,104" fill="#FFFFFF" stroke="#FFE082" strokeWidth="0.5" />
          </g>

          {/* ----------------- THUMB: (NGÓN CÁI - RESTING FRONT) ----------------- */}
          {/* Graceful curving thumb reaching upward-right */}
          <path
            d="M 98 90 Q 124 72, 148 74 Q 155 86, 130 96 Q 112 98, 98 90 Z"
            fill="url(#skinGrad)"
            stroke="#C58B6D"
            strokeWidth="1.2"
          />
          <circle cx="145" cy="76" r="6.5" fill="#F8AFA6" opacity="0.55" />

          {/* PROMINENT THUMB NAIL: ☯ THÁI CỰC ĐỒ (YIN-YANG) */}
          <g transform="rotate(-6 148 76)">
            {/* Nail Base & 24K Gold Trim */}
            <path d="M 140 65 Q 166 67, 175 76 Q 166 86, 140 83 Z" fill="rgba(0,0,0,0.4)" />
            <path
              d="M 139 64 Q 168 66, 177 76 Q 168 86, 139 84 Z"
              fill="url(#cinnabarNailGrad)"
              stroke="url(#goldFoilGrad)"
              strokeWidth="2"
            />
            {/* Gloss Highlight */}
            <path d="M 143 67 Q 163 69, 171 73" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" fill="none" />

            {/* EMBEDDED ☯ THÁI CỰC ĐỒ SEAL */}
            <g transform="translate(153 74)">
              {/* Outer Golden Halo Ring */}
              <circle cx="0" cy="0" r="6.5" fill="#2E0407" stroke="url(#goldFoilGrad)" strokeWidth="1.2" />
              {/* Light Gold Half */}
              <path d="M 0 -6.5 A 6.5 6.5 0 0 1 0 6.5 A 3.25 3.25 0 0 1 0 0 A 3.25 3.25 0 0 0 0 -6.5 Z" fill="#FFE57F" />
              {/* Dark Half */}
              <path d="M 0 -6.5 A 3.25 3.25 0 0 1 0 0 A 3.25 3.25 0 0 0 0 6.5 A 6.5 6.5 0 0 1 0 -6.5 Z" fill="#400702" />
              {/* Yang Eye */}
              <circle cx="0" cy="-3.25" r="1.1" fill="#400702" />
              {/* Yin Eye */}
              <circle cx="0" cy="3.25" r="1.1" fill="#FFE57F" />
            </g>

            {/* Gold Caviar Cuticle Wrap */}
            <circle cx="141" cy="74" r="1.4" fill="#FFE57F" stroke="#996E00" strokeWidth="0.5" />
            <circle cx="142" cy="70" r="1" fill="#FFD700" />
            <circle cx="142" cy="78" r="1" fill="#FFD700" />
          </g>
        </svg>
      </motion.div>

      {/* ========================================================= */}
      {/* RIGHT HAND OF CÔ THẢO WITH PROMINENT BÁT QUÁI NAIL ART */}
      {/* ========================================================= */}
      <motion.div
        animate={
          isShaking
            ? {
                x: [4, -5, 6, -4, 3, 0],
                y: [0, 7, -5, 5, -3, 0],
                rotate: [8, -4, 9, -6, 4],
              }
            : {
                x: 0,
                y: [0, 3, 0],
                rotate: 2,
              }
        }
        transition={
          isShaking
            ? { duration: 0.22, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
        }
        className="absolute -right-16 sm:-right-22 top-[54%] -translate-y-1/2 flex items-center pointer-events-none z-30"
      >
        <svg
          className="w-32 sm:w-40 h-38 sm:h-46 filter drop-shadow-[0_8px_22px_rgba(0,0,0,0.55)] pointer-events-none"
          viewBox="0 0 200 240"
          fill="none"
        >
          <defs>
            <linearGradient id="rightSleeveGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0B2B20" />
              <stop offset="40%" stopColor="#1B5E46" />
              <stop offset="70%" stopColor="#2A7B5F" />
              <stop offset="100%" stopColor="#0D3627" />
            </linearGradient>
            <linearGradient id="jadeBangleGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A2E8D8" />
              <stop offset="35%" stopColor="#2ECC71" />
              <stop offset="70%" stopColor="#16A085" />
              <stop offset="100%" stopColor="#0E5A44" />
            </linearGradient>
          </defs>

          {/* ================= SLEEVE ================= */}
          <path
            d="M 200 35 Q 160 25, 122 65 L 132 185 Q 170 200, 200 175 Z"
            fill="url(#rightSleeveGrad)"
            stroke="#D4AF37"
            strokeWidth="2"
          />
          {/* Inner Golden Silk Cuff */}
          <path
            d="M 132 62 Q 114 115, 140 182"
            stroke="#FFE082"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 137 65 Q 119 115, 145 178"
            stroke="#540B04"
            strokeWidth="1.5"
          />
          {/* Gold Clouds on Cuff */}
          <path
            d="M 160 70 Q 145 85, 158 100 Q 140 115, 152 135 Q 138 150, 155 168"
            stroke="#FFF1A8"
            strokeWidth="1.8"
            strokeDasharray="3 4"
            fill="none"
          />

          {/* ================= WRIST & JADE BANGLE ================= */}
          <path
            d="M 128 82 Q 105 86, 90 95 L 95 142 Q 112 140, 135 130 Z"
            fill="url(#skinGrad)"
            stroke="#C58B6D"
            strokeWidth="1.2"
          />

          {/* Hetian Jade Bangle Right */}
          <g transform="rotate(12 115 112)">
            <ellipse cx="115" cy="114" rx="8" ry="28" fill="rgba(0,0,0,0.3)" />
            <ellipse
              cx="115"
              cy="112"
              rx="8" ry="26"
              fill="url(#jadeBangleGradRight)"
              stroke="#D4AF37"
              strokeWidth="2"
            />
            <ellipse cx="117" cy="104" rx="3.5" ry="16" fill="white" opacity="0.45" />
            <rect x="110" y="108" width="10" height="7" rx="2" fill="url(#goldFoilGrad)" stroke="#540B04" strokeWidth="0.8" />
            <circle cx="115" cy="111.5" r="1.8" fill="#B23B28" stroke="#FFE082" strokeWidth="0.6" />
          </g>

          {/* ================= PALM ================= */}
          <path
            d="M 96 92 Q 72 92, 58 105 Q 52 132, 64 155 Q 88 148, 100 138 Z"
            fill="url(#skinGrad)"
            stroke="#C58B6D"
            strokeWidth="1.2"
          />
          <path
            d="M 88 105 Q 74 122, 78 144"
            stroke="#C58B6D"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
            fill="none"
          />

          {/* ================= FINGERS REACHING LEFT ================= */}

          {/* ----------------- PINKY (NGÓN ÚT) ----------------- */}
          <path
            d="M 75 146 Q 55 152, 42 162 Q 45 174, 66 165 Z"
            fill="url(#skinGrad)"
            stroke="#C58B6D"
            strokeWidth="1.2"
          />
          <circle cx="48" cy="162" r="5" fill="#F8AFA6" opacity="0.5" />

          {/* NAIL: ☴ TỐN (PHONG) */}
          <g transform="rotate(-22 48 163)">
            <path d="M 52 156 Q 34 158, 28 164 Q 34 171, 52 168 Z" fill="rgba(0,0,0,0.4)" />
            <path
              d="M 53 155 Q 32 157, 26 164 Q 32 171, 53 169 Z"
              fill="url(#cinnabarNailGrad)"
              stroke="url(#goldFoilGrad)"
              strokeWidth="1.5"
            />
            <path d="M 50 157 Q 36 159, 31 162" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" fill="none" />
            {/* TRIGRAM: ☴ TỐN (Solid, Solid, Broken) */}
            <g stroke="#FFF3B0" strokeWidth="1.6" strokeLinecap="round">
              <line x1="37" y1="160" x2="46" y2="160" />
              <line x1="37" y1="163" x2="46" y2="163" />
              <line x1="37" y1="166" x2="40.5" y2="166" />
              <line x1="42.5" y1="166" x2="46" y2="166" />
            </g>
            <circle cx="51.5" cy="162" r="1" fill="#FFE57F" stroke="#996E00" strokeWidth="0.4" />
          </g>

          {/* ----------------- RING FINGER (NGÓN ÁP ÚT) ----------------- */}
          <path
            d="M 68 132 Q 42 135, 28 142 Q 32 155, 62 148 Z"
            fill="url(#skinGrad)"
            stroke="#C58B6D"
            strokeWidth="1.2"
          />
          {/* Filigree Ring on Ring Finger */}
          <g transform="translate(45 133)">
            <rect x="0" y="0" width="6" height="14" rx="2.5" fill="url(#goldFoilGrad)" stroke="#540B04" strokeWidth="0.8" />
            <circle cx="3" cy="7" r="1.8" fill="#FFE57F" />
          </g>
          <circle cx="34" cy="142" r="6" fill="#F8AFA6" opacity="0.5" />

          {/* NAIL: ☶ CẤN (SƠN) */}
          <g transform="rotate(-14 32 143)">
            <path d="M 38 135 Q 17 137, 9 144 Q 17 152, 38 149 Z" fill="rgba(0,0,0,0.4)" />
            <path
              d="M 39 134 Q 15 136, 7 144 Q 15 152, 39 150 Z"
              fill="url(#cinnabarNailGrad)"
              stroke="url(#goldFoilGrad)"
              strokeWidth="1.6"
            />
            <path d="M 35 137 Q 19 139, 13 142" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" fill="none" />
            {/* TRIGRAM: ☶ CẤN (Solid, Broken, Broken) */}
            <g stroke="#FFF3B0" strokeWidth="1.7" strokeLinecap="round">
              <line x1="21" y1="139" x2="32" y2="139" />
              <line x1="21" y1="143" x2="25" y2="143" />
              <line x1="28" y1="143" x2="32" y2="143" />
              <line x1="21" y1="147" x2="25" y2="147" />
              <line x1="28" y1="147" x2="32" y2="147" />
            </g>
            <circle cx="37" cy="143" r="1.3" fill="#FFE57F" stroke="#996E00" strokeWidth="0.5" />
          </g>

          {/* ----------------- MIDDLE FINGER (NGÓN GIỮA) ----------------- */}
          <path
            d="M 66 112 Q 34 114, 16 121 Q 22 135, 60 128 Z"
            fill="url(#skinGrad)"
            stroke="#C58B6D"
            strokeWidth="1.2"
          />
          <circle cx="22" cy="122" r="6" fill="#F8AFA6" opacity="0.5" />

          {/* NAIL: ☵ KHẢM (THỦY) - HIGHLY PROMINENT */}
          <g transform="rotate(-8 20 122)">
            <path d="M 26 113 Q 2 115, -6 123 Q 2 132, 26 129 Z" fill="rgba(0,0,0,0.4)" />
            <path
              d="M 27 112 Q 0 114, -8 123 Q 0 132, 27 130 Z"
              fill="url(#cinnabarNailGrad)"
              stroke="url(#goldFoilGrad)"
              strokeWidth="1.8"
            />
            <path d="M 23 115 Q 5 117, -2 121" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" fill="none" />
            {/* TRIGRAM: ☵ KHẢM (Broken, Solid, Broken) */}
            <g stroke="#FFF3B0" strokeWidth="1.8" strokeLinecap="round">
              <line x1="7" y1="117" x2="11.5" y2="117" />
              <line x1="14.5" y1="117" x2="19" y2="117" />
              <line x1="7" y1="122" x2="19" y2="122" />
              <line x1="7" y1="126" x2="11.5" y2="126" />
              <line x1="14.5" y1="126" x2="19" y2="126" />
            </g>
            <circle cx="24.5" cy="122" r="1.5" fill="#FFE57F" stroke="#996E00" strokeWidth="0.5" />
            <circle cx="24.5" cy="118.5" r="1" fill="#FFD700" />
            <circle cx="24.5" cy="125.5" r="1" fill="#FFD700" />
          </g>

          {/* ----------------- INDEX FINGER (NGÓN TRỎ) ----------------- */}
          <path
            d="M 72 92 Q 42 94, 25 102 Q 30 116, 66 110 Z"
            fill="url(#skinGrad)"
            stroke="#C58B6D"
            strokeWidth="1.2"
          />
          <circle cx="32" cy="102" r="6" fill="#F8AFA6" opacity="0.5" />

          {/* NAIL: ☷ KHÔN (ĐỊA - THUẦN ÂM) */}
          <g transform="rotate(-3 30 102)">
            <path d="M 34 93 Q 11 95, 3 103 Q 11 112, 34 109 Z" fill="rgba(0,0,0,0.4)" />
            <path
              d="M 35 92 Q 9 94, 1 103 Q 9 112, 35 110 Z"
              fill="url(#cinnabarNailGrad)"
              stroke="url(#goldFoilGrad)"
              strokeWidth="1.7"
            />
            <path d="M 31 95 Q 14 97, 7 101" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" fill="none" />
            {/* TRIGRAM: ☷ KHÔN (3 Pairs of Broken Lines) */}
            <g stroke="#FFF3B0" strokeWidth="1.8" strokeLinecap="round">
              <line x1="15" y1="97" x2="19.5" y2="97" />
              <line x1="22.5" y1="97" x2="27" y2="97" />
              <line x1="15" y1="102" x2="19.5" y2="102" />
              <line x1="22.5" y1="102" x2="27" y2="102" />
              <line x1="15" y1="106" x2="19.5" y2="106" />
              <line x1="22.5" y1="106" x2="27" y2="106" />
            </g>
            <circle cx="33" cy="102" r="1.5" fill="#E53935" stroke="#FFE082" strokeWidth="0.8" />
          </g>

          {/* ----------------- THUMB (NGÓN CÁI) ----------------- */}
          <path
            d="M 102 90 Q 76 72, 52 74 Q 45 86, 70 96 Q 88 98, 102 90 Z"
            fill="url(#skinGrad)"
            stroke="#C58B6D"
            strokeWidth="1.2"
          />
          <circle cx="55" cy="76" r="6.5" fill="#F8AFA6" opacity="0.55" />

          {/* PROMINENT THUMB NAIL: ☯ GOLDEN LOTUS EMBLEM */}
          <g transform="rotate(6 52 76)">
            <path d="M 60 65 Q 34 67, 25 76 Q 34 86, 60 83 Z" fill="rgba(0,0,0,0.4)" />
            <path
              d="M 61 64 Q 32 66, 23 76 Q 32 86, 61 84 Z"
              fill="url(#cinnabarNailGrad)"
              stroke="url(#goldFoilGrad)"
              strokeWidth="2"
            />
            <path d="M 57 67 Q 37 69, 29 73" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" fill="none" />

            {/* GOLDEN LOTUS & YIN-YANG MEDALLION */}
            <g transform="translate(47 74)">
              <circle cx="0" cy="0" r="6.5" fill="#2E0407" stroke="url(#goldFoilGrad)" strokeWidth="1.2" />
              {/* Golden Lotus Petals */}
              <path d="M 0 -5 C 2.5 -3, 3.5 0, 0 4 C -3.5 0, -2.5 -3, 0 -5 Z" fill="#FFE57F" stroke="#996E00" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1.6" fill="#D32F2F" stroke="#FFE082" strokeWidth="0.5" />
            </g>

            <circle cx="59" cy="74" r="1.4" fill="#FFE57F" stroke="#996E00" strokeWidth="0.5" />
            <circle cx="58" cy="70" r="1" fill="#FFD700" />
            <circle cx="58" cy="78" r="1" fill="#FFD700" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
};
