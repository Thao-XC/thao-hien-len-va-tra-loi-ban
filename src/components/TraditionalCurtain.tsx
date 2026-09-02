import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface TraditionalCurtainProps {
  isOpen: boolean;
  onOpened?: () => void;
  language?: 'vi' | 'en';
  title?: string;
  subtitle?: string;
}

export const TraditionalCurtain: React.FC<TraditionalCurtainProps> = ({
  isOpen,
  onOpened,
  language = 'vi',
  title,
  subtitle,
}) => {
  const [hasFinishedAnimation, setHasFinishedAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setHasFinishedAnimation(true);
        if (onOpened) onOpened();
      }, 1400);
      return () => clearTimeout(timer);
    } else {
      setHasFinishedAnimation(false);
    }
  }, [isOpen, onOpened]);

  // If already opened and animation completed, we keep it unrendered or collapsed to avoid blocking pointer events
  if (hasFinishedAnimation && isOpen) {
    return null;
  }

  const defaultTitle = language === 'vi' ? 'DIỆN KIẾN CÔ THẢO' : 'ENTERING SANCTUARY';
  const defaultSubtitle = language === 'vi' ? 'Khai Mành Giao Trì · Thấu Tỏ Quẻ Dịch' : 'Parting the Imperial Curtains of Fate';

  return (
    <AnimatePresence>
      {!hasFinishedAnimation && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isOpen ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: isOpen ? 0.9 : 0 }}
          className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-between overflow-hidden"
          style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
        >
          {/* Top Lacquered Wooden Beam Frame (Thanh Xà Rèm Cung Đình) */}
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: isOpen ? -80 : 0, opacity: isOpen ? 0.8 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full relative z-30 flex flex-col items-center shadow-2xl"
          >
            {/* Dark Rosewood / Lacquer Beam */}
            <div className="w-full h-10 sm:h-12 bg-gradient-to-r from-[#1C0D0A] via-[#3D1812] to-[#1C0D0A] border-b-2 border-[#D4AF37] flex items-center justify-between px-4 sm:px-8 relative">
              {/* Gold Dragon / Floral Carving Accent Left */}
              <div className="flex items-center gap-1 opacity-70">
                <div className="w-3 h-3 rotate-45 bg-[#D4AF37] border border-[#FFE599]" />
                <div className="w-8 h-0.5 bg-[#D4AF37]" />
              </div>

              {/* Ornate Ceremonial Royal Plaque (Biển Hiệu Khai Mành) */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-4 py-1 rounded-sm bg-gradient-to-b from-[#8C1D18] via-[#B23B28] to-[#5C100D] border-2 border-[#FFE082] shadow-[0_4px_16px_rgba(212,175,55,0.4)] text-center flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFE082] animate-pulse" />
                <div>
                  <span className="font-serif font-black text-xs sm:text-sm text-[#FFFDF0] tracking-[0.2em] uppercase drop-shadow-md">
                    {title || defaultTitle}
                  </span>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-[#FFE082] animate-pulse" />
              </motion.div>

              {/* Gold Floral Carving Accent Right */}
              <div className="flex items-center gap-1 opacity-70">
                <div className="w-8 h-0.5 bg-[#D4AF37]" />
                <div className="w-3 h-3 rotate-45 bg-[#D4AF37] border border-[#FFE599]" />
              </div>
            </div>

            {/* Hanging Golden Silk Tassels Row (Tua Rua Chỉ Vàng) */}
            <div className="w-full flex justify-around px-2 sm:px-12 py-0.5 bg-[#2A100C]/90 border-b border-[#D4AF37]/40 overflow-hidden">
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: [0, (i % 2 === 0 ? 3 : -3), 0] }}
                  transition={{ repeat: Infinity, duration: 2 + (i % 3) * 0.4, ease: 'easeInOut' }}
                  className="flex flex-col items-center"
                >
                  <div className="w-1 h-2 bg-[#D4AF37]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E5C158] border border-[#8C6D2F] shadow-2xs" />
                  <div className="w-1.5 h-4 sm:h-5 bg-gradient-to-b from-[#E5C158] to-[#A87B24] rounded-b-xs" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Curtain Center Stage (Hai Vạt Rèm Mành Tre Khắc Hoa Văn Mở Ra 2 Bên) */}
          <div className="relative w-full flex-1 flex overflow-hidden">
            {/* LEFT CURTAIN PANEL (Vạt Mành Lụa & Tre Bên Trái) */}
            <motion.div
              initial={{ x: 0 }}
              animate={{
                x: isOpen ? '-105%' : '0%',
                skewY: isOpen ? -3 : 0,
              }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              className="w-1/2 h-full bg-gradient-to-r from-[#3B0E09] via-[#631812] to-[#7C2A1C] border-r border-[#D4AF37]/80 relative shadow-[10px_0_30px_rgba(0,0,0,0.6)] flex flex-col justify-between p-4 sm:p-8 select-none"
            >
              {/* Bamboo & Silk Texture Lines */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(0deg,#000_0px,#000_2px,transparent_2px,transparent_8px)]" />
              
              {/* Auspicious Brocade Silk Damask Grid Overlay */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FFE082_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Traditional Vietnamese Imperial Bát Quái Watermark */}
              <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-25 pointer-events-none">
                <svg className="w-48 h-48 sm:w-64 sm:h-64 text-[#FFE082]" viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />
                  <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M50 14 A36 36 0 0 1 50 86 A18 18 0 0 1 50 50 A18 18 0 0 0 50 14 Z" opacity="0.6" />
                </svg>
              </div>

              {/* Decorative Golden Left Border Trimming */}
              <div className="absolute top-0 right-0 bottom-0 w-2.5 bg-gradient-to-l from-[#FFE082] via-[#D4AF37] to-[#8C6D2F] border-l border-[#FFE599]/60 shadow-sm" />

              {/* Left Brass Ring Handle / Knot */}
              <div className="absolute top-1/2 right-3 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-[#FFE082] bg-[#5C1610] flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 rounded-full border border-[#FFE082]" />
              </div>

              {/* Poetic Inscription on Left Curtain */}
              <div className="relative z-10 text-[#FFE599]/80 font-serif italic text-xs sm:text-sm max-w-[160px] leading-relaxed hidden sm:block">
                <p>🌸 "Vạn vật hữu duyên,</p>
                <p>Kinh Dịch thấu suốt."</p>
              </div>

              <div className="relative z-10 text-[#FFE599]/40 text-[0.68rem] tracking-widest uppercase">
                SẠP BÓI CÔ THẢO
              </div>
            </motion.div>

            {/* RIGHT CURTAIN PANEL (Vạt Mành Lụa & Tre Bên Phải) */}
            <motion.div
              initial={{ x: 0 }}
              animate={{
                x: isOpen ? '105%' : '0%',
                skewY: isOpen ? 3 : 0,
              }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              className="w-1/2 h-full bg-gradient-to-l from-[#3B0E09] via-[#631812] to-[#7C2A1C] border-l border-[#D4AF37]/80 relative shadow-[-10px_0_30px_rgba(0,0,0,0.6)] flex flex-col justify-between items-end p-4 sm:p-8 select-none"
            >
              {/* Bamboo & Silk Texture Lines */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(0deg,#000_0px,#000_2px,transparent_2px,transparent_8px)]" />

              {/* Auspicious Brocade Silk Damask Grid Overlay */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FFE082_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Traditional Vietnamese Imperial Lotus Watermark */}
              <div className="absolute top-1/2 left-6 -translate-y-1/2 opacity-25 pointer-events-none">
                <svg className="w-48 h-48 sm:w-64 sm:h-64 text-[#FFE082]" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 20 C 40 45, 20 60, 10 80 C 35 85, 65 85, 90 80 C 80 60, 60 45, 50 20 Z" opacity="0.6" />
                  <path d="M50 10 C 46 35, 38 52, 28 65 C 42 70, 58 70, 72 65 C 62 52, 54 35, 50 10 Z" opacity="0.8" />
                </svg>
              </div>

              {/* Decorative Golden Right Border Trimming */}
              <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-gradient-to-r from-[#FFE082] via-[#D4AF37] to-[#8C6D2F] border-r border-[#FFE599]/60 shadow-sm" />

              {/* Right Brass Ring Handle / Knot */}
              <div className="absolute top-1/2 left-3 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-[#FFE082] bg-[#5C1610] flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 rounded-full border border-[#FFE082]" />
              </div>

              {/* Poetic Inscription on Right Curtain */}
              <div className="relative z-10 text-[#FFE599]/80 font-serif italic text-xs sm:text-sm max-w-[160px] text-right leading-relaxed hidden sm:block">
                <p>"Cát hung tường tận,</p>
                <p>Tâm an vạn sự tường." 🌸</p>
              </div>

              <div className="relative z-10 text-[#FFE599]/40 text-[0.68rem] tracking-widest uppercase">
                SACRED I-CHING ORACLE
              </div>
            </motion.div>

            {/* CENTER CEREMONIAL GOLDEN SEAL & CLOUD PARTICLES */}
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{
                scale: isOpen ? 1.4 : 1,
                opacity: isOpen ? 0 : 1,
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none flex flex-col items-center justify-center"
            >
              {/* Golden Auspicious Knot Medallion */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#9E2A2B] via-[#C8402C] to-[#E9CE84] p-1 shadow-[0_0_35px_rgba(212,175,55,0.8)] border-2 border-[#FFF275]">
                <div className="w-full h-full rounded-full bg-[#3B0E09] border border-[#FFE082] flex flex-col items-center justify-center text-center p-1">
                  <Sparkles className="w-5 h-5 text-[#FFE082] animate-spin" />
                  <span className="text-[0.62rem] sm:text-[0.68rem] font-serif font-bold text-[#FFFDF0] tracking-widest mt-0.5">
                    {language === 'vi' ? 'KHAI MÀNH' : 'UNVEIL'}
                  </span>
                </div>
              </div>

              <div className="mt-3 px-3 py-1 bg-[#1C0D0A]/90 backdrop-blur-xs rounded-full border border-[#D4AF37] text-[#FFE082] text-xs font-serif italic shadow-md">
                {subtitle || defaultSubtitle}
              </div>
            </motion.div>
          </div>

          {/* Bottom Golden Trim Bar */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: isOpen ? 80 : 0, opacity: isOpen ? 0.8 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full h-6 bg-gradient-to-r from-[#1C0D0A] via-[#3D1812] to-[#1C0D0A] border-t-2 border-[#D4AF37] z-30"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
