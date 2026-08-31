import React from 'react';

interface ParchmentFrameProps {
  children: React.ReactNode;
}

export const ParchmentFrame: React.FC<ParchmentFrameProps> = ({ children }) => {
  return (
    <div className="relative w-full max-w-[450px] mx-auto my-2 sm:my-5">
      {/* Top Scroll Wood Roller Bar with Cinnabar & Gold Caps */}
      <div className="relative h-4 bg-gradient-to-b from-[#B23B28] via-[#9C2C1E] to-[#6E1C12] rounded-xs shadow-md z-20 flex items-center justify-between px-1">
        {/* Left Cap */}
        <div className="absolute -left-3 -top-1 w-6 h-6 rounded-full bg-gradient-to-b from-[#B23B28] via-[#7C2A1C] to-[#4A1109] border border-[#E9CE84]/60 shadow-md flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#E9CE84]/80" />
        </div>

        {/* Roller Gold Rings */}
        <div className="h-full w-2 bg-[#E9CE84]/40 border-x border-[#E9CE84]/60 ml-2" />
        <div className="h-full w-2 bg-[#E9CE84]/40 border-x border-[#E9CE84]/60 mr-2" />

        {/* Right Cap */}
        <div className="absolute -right-3 -top-1 w-6 h-6 rounded-full bg-gradient-to-b from-[#B23B28] via-[#7C2A1C] to-[#4A1109] border border-[#E9CE84]/60 shadow-md flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#E9CE84]/80" />
        </div>
      </div>

      {/* Main Parchment Scroll Body (Vietnamese Giấy Dó & Silk Texture) */}
      <div className="relative px-4 sm:px-6 py-6 bg-gradient-to-b from-[#FDF8ED] via-[#F6EDE0] to-[#EFE2C6] border-x-2 border-[#AD8A2E]/40 shadow-[0_14px_40px_rgba(46,36,21,0.18)] overflow-hidden">
        {/* Vietnamese Traditional Folk Painting Art Backdrop (Dong Ho & Hang Trong Motifs) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Top Traditional Auspicious Cloud Curvature (Mây Cuộn Cổ) */}
          <svg
            className="absolute top-0 left-0 right-0 w-full h-24 text-[#8C6D2F] opacity-15 pointer-events-none"
            viewBox="0 0 400 90"
            preserveAspectRatio="none"
          >
            <path
              d="M0 45 Q 40 10, 80 40 T 160 30 T 240 45 T 320 25 T 400 40 L 400 0 L 0 0 Z"
              fill="currentColor"
            />
            <path
              d="M30 35 C 45 20, 70 20, 85 35 C 100 25, 125 25, 140 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M260 35 C 275 20, 300 20, 315 35 C 330 25, 355 25, 370 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>

          {/* Vietnamese Folk Lotus Bloom (Hoa Sen Đông Hồ) Top-Right */}
          <svg
            className="absolute -top-2 -right-2 w-32 h-36 opacity-35 pointer-events-none"
            viewBox="0 0 130 140"
          >
            {/* Lotus Stem */}
            <path
              d="M125 0 C 110 30, 95 65, 80 120"
              fill="none"
              stroke="#5A7256"
              strokeWidth="1.5"
            />
            {/* Lotus Leaf */}
            <path
              d="M110 50 C 90 40, 70 55, 60 70 C 75 80, 105 75, 110 50 Z"
              fill="#5A7256"
              opacity="0.5"
            />
            {/* Lotus Petals (Pink/Cinnabar) */}
            <path
              d="M95 25 C 80 15, 65 30, 65 45 C 80 50, 95 40, 95 25 Z"
              fill="#B23B28"
              opacity="0.4"
            />
            <path
              d="M90 20 C 85 5, 75 10, 70 25 C 80 30, 90 25, 90 20 Z"
              fill="#B23B28"
              opacity="0.6"
            />
            <circle cx="80" cy="30" r="3" fill="#E9CE84" opacity="0.8" />
          </svg>

          {/* Vietnamese Sacred Crane Flying Silhouette (Chim Hạc Vút Bay) Left */}
          <svg
            className="absolute top-28 -left-1 w-20 h-16 opacity-25 pointer-events-none text-[#7A6444]"
            viewBox="0 0 90 60"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M5 38 C 18 22, 32 14, 46 20 C 40 10, 42 4, 52 2 C 54 10, 52 16, 58 22 C 70 24, 80 34, 88 30"
              strokeWidth="1.2"
            />
            <path d="M46 20 C 50 26, 54 30, 58 40 C 60 46, 62 50, 68 56" strokeWidth="1" />
            <path d="M15 32 C 22 28, 30 26, 38 28" strokeWidth="0.8" />
          </svg>

          {/* Traditional Thủy Ba Wave Motif on Bottom */}
          <svg
            className="absolute bottom-0 left-0 right-0 w-full h-12 text-[#7A6444] opacity-15 pointer-events-none"
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
          >
            <path
              d="M0 40 Q 25 15, 50 40 T 100 40 T 150 40 T 200 40 T 250 40 T 300 40 T 350 40 T 400 40 L 400 40 L 0 40 Z"
              fill="currentColor"
            />
            <path
              d="M0 38 Q 25 20, 50 38 T 100 38 T 150 38 T 200 38 T 250 38 T 300 38 T 350 38 T 400 38"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>

          {/* Red Traditional Cinnabar Stamp Seal Top-Right (Thảo 印) */}
          <div className="absolute top-4 right-4 w-10 h-10 border-2 border-[#B23B28] bg-[#B23B28]/10 rounded-xs flex flex-col items-center justify-center -rotate-3 pointer-events-none shadow-xs">
            <span className="font-serif font-bold text-xs text-[#B23B28] tracking-tighter leading-none">
              草
            </span>
            <span className="text-[0.55rem] font-sans font-bold text-[#B23B28] leading-none mt-0.5">
              THẢO
            </span>
          </div>
        </div>

        {/* Inner Content Slot */}
        <div className="relative z-10">{children}</div>
      </div>

      {/* Bottom Scroll Wood Roller Bar with Cinnabar & Gold Caps */}
      <div className="relative h-4 bg-gradient-to-b from-[#B23B28] via-[#9C2C1E] to-[#6E1C12] rounded-xs shadow-md z-20 flex items-center justify-between px-1">
        {/* Left Cap */}
        <div className="absolute -left-3 -top-1 w-6 h-6 rounded-full bg-gradient-to-b from-[#B23B28] via-[#7C2A1C] to-[#4A1109] border border-[#E9CE84]/60 shadow-md flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#E9CE84]/80" />
        </div>

        {/* Roller Gold Rings */}
        <div className="h-full w-2 bg-[#E9CE84]/40 border-x border-[#E9CE84]/60 ml-2" />
        <div className="h-full w-2 bg-[#E9CE84]/40 border-x border-[#E9CE84]/60 mr-2" />

        {/* Right Cap */}
        <div className="absolute -right-3 -top-1 w-6 h-6 rounded-full bg-gradient-to-b from-[#B23B28] via-[#7C2A1C] to-[#4A1109] border border-[#E9CE84]/60 shadow-md flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#E9CE84]/80" />
        </div>
      </div>
    </div>
  );
};
