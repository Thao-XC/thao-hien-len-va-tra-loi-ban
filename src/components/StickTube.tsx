import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playStickClack, playGong } from '../utils/audio';
import { Sparkles, Smartphone, ArrowRight, RefreshCw, Compass, Zap, Hand, Eye } from 'lucide-react';
import { HEXAGRAM_DATA, getTransformedHexagram } from '../utils/hexagramPatterns';
import { VIETNAMESE_HEXAGRAMS } from '../data/vietnameseHexagrams';
import { LadyThaoShakingHands } from './LadyThaoShakingHands';
import { LadyThaoHandsFanModal } from './LadyThaoHandsFanModal';
import { JadeFanIcon } from './JadeFanIcon';

interface StickTubeProps {
  onStickFallen: (que: number, hao: number) => void;
  onAskThao: (que: number, hao: number) => void;
  disabled?: boolean;
  soundEnabled?: boolean;
  language?: 'vi';
  hasQuestion?: boolean;
  isEnlarged?: boolean;
}

export type TubeStyleType = 'classic_batquai' | 'octagonal_crimson' | 'cinnabar_royal' | 'aged_bamboo';
export type ShakeModeType = 'phone' | 'auto' | 'co_thao';

interface StickState {
  id: number;
  height: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  isWinner?: boolean;
  cinnabarRatio?: number;
}

export const StickTube: React.FC<StickTubeProps> = ({
  onStickFallen,
  onAskThao,
  disabled = false,
  soundEnabled = true,
  hasQuestion = false,
  isEnlarged = false,
}) => {
  // Flow states: idle -> shaking -> ejecting -> fallen
  const [phase, setPhase] = useState<'idle' | 'shaking' | 'ejecting' | 'fallen'>('idle');
  const [drawnQue, setDrawnQue] = useState<number | null>(null);
  const [drawnHao, setDrawnHao] = useState<number | null>(null);
  const [motionPermNeeded, setMotionPermNeeded] = useState<boolean>(false);
  const [shakeDetectedFeedback, setShakeDetectedFeedback] = useState<boolean>(false);
  const [motionForceMeter, setMotionForceMeter] = useState<number>(0);
  const [isNailModalOpen, setIsNailModalOpen] = useState<boolean>(false);

  // 3 SHAKE MODES: 1/ Phone Shake, 2/ Auto Shake, 3/ Co Thao Shake
  const [shakeMode, setShakeMode] = useState<ShakeModeType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('thao_shake_mode') as ShakeModeType;
      if (saved) return saved;
    }
    return 'co_thao';
  });

  const handleSelectShakeMode = (mode: ShakeModeType) => {
    setShakeMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thao_shake_mode', mode);
    }
  };

  const [tubeStyle, setTubeStyle] = useState<TubeStyleType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('thao_tube_style') as TubeStyleType;
      if (saved && (saved === 'classic_batquai' || saved === 'octagonal_crimson' || saved === 'cinnabar_royal' || saved === 'aged_bamboo')) return saved;
    }
    return 'classic_batquai';
  });

  const handleSelectStyle = (style: TubeStyleType) => {
    setTubeStyle(style);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thao_tube_style', style);
    }
  };

  // Cryptographically robust random generator for 64 Hexagrams & 6 Lines
  const generateCryptographicStick = () => {
    let q = 1;
    let h = 1;
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const buf = new Uint32Array(2);
      window.crypto.getRandomValues(buf);
      q = (buf[0] % 64) + 1;
      h = (buf[1] % 6) + 1;
    } else {
      q = Math.floor(Math.random() * 64) + 1;
      h = Math.floor(Math.random() * 6) + 1;
    }
    return { que: q, hao: h };
  };

  // Authentic tightly-clustered bundle of wooden fortune sticks inside the cylinder mouth
  const initialSticks: StickState[] = [
    { id: 1, height: 135, rotation: -3.5, offsetX: -22, offsetY: 0, cinnabarRatio: 100 },
    { id: 2, height: 138, rotation: -2.5, offsetX: -17, offsetY: -2, cinnabarRatio: 100 },
    { id: 3, height: 140, rotation: -1.8, offsetX: -12, offsetY: -3, cinnabarRatio: 100 },
    { id: 4, height: 142, rotation: -1.0, offsetX: -7, offsetY: -5, cinnabarRatio: 100 },
    { id: 5, height: 144, rotation: -0.5, offsetX: -3, offsetY: -6, cinnabarRatio: 100 },
    { id: 6, height: 145, rotation: 0, offsetX: 0, offsetY: -7, cinnabarRatio: 100 },
    { id: 7, height: 144, rotation: 0.5, offsetX: 3, offsetY: -6, cinnabarRatio: 100 },
    { id: 8, height: 142, rotation: 1.0, offsetX: 7, offsetY: -5, cinnabarRatio: 100 },
    { id: 9, height: 140, rotation: 1.8, offsetX: 12, offsetY: -3, cinnabarRatio: 100 },
    { id: 10, height: 138, rotation: 2.5, offsetX: 17, offsetY: -2, cinnabarRatio: 100 },
    { id: 11, height: 135, rotation: 3.5, offsetX: 22, offsetY: 0, cinnabarRatio: 100 },
  ];

  const [sticks, setSticks] = useState<StickState[]>(initialSticks);
  const shakeIntervalRef = useRef<any>(null);

  // Accelerometer detection for real phone shake
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (typeof DeviceMotionEvent !== 'undefined') {
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        setMotionPermNeeded(true);
      } else {
        startMotionListening();
      }
    }

    return () => {
      stopMotionListening();
    };
  }, []);

  const lastAccelRef = useRef<{ x: number | null; y: number | null; z: number | null; time: number }>({
    x: null,
    y: null,
    z: null,
    time: 0,
  });

  const handleDeviceMotion = (e: DeviceMotionEvent) => {
    if (phase === 'shaking' || phase === 'ejecting' || disabled) return;
    const acc = e.accelerationIncludingGravity;
    if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

    const last = lastAccelRef.current;
    if (last.x !== null && last.y !== null && last.z !== null) {
      const delta = Math.abs(acc.x - last.x) + Math.abs(acc.y - last.y) + Math.abs(acc.z - last.z);
      const now = Date.now();
      if (delta > 13 && now - last.time > 1000) {
        last.time = now;
        setShakeDetectedFeedback(true);
        setTimeout(() => setShakeDetectedFeedback(false), 900);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate([50, 40, 70]);
          } catch {
            // ignore
          }
        }
        startShakeSequence();
      }
    }
    last.x = acc.x;
    last.y = acc.y;
    last.z = acc.z;
  };

  const startMotionListening = () => {
    window.addEventListener('devicemotion', handleDeviceMotion);
  };

  const stopMotionListening = () => {
    window.removeEventListener('devicemotion', handleDeviceMotion);
  };

  const requestMotionPermission = async () => {
    try {
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        const res = await (DeviceMotionEvent as any).requestPermission();
        if (res === 'granted') {
          startMotionListening();
          setMotionPermNeeded(false);
        }
      }
    } catch (e) {
      console.warn('Motion permission request failed', e);
    }
  };

  // SHAKE THE AUTHENTIC BAMBOO TUBE
  const startShakeSequence = () => {
    if (phase === 'shaking' || phase === 'ejecting' || disabled) return;

    const { que, hao } = generateCryptographicStick();
    const winningStickIndex = Math.floor(Math.random() * 11) + 1;
    setDrawnQue(que);
    setDrawnHao(hao);
    setPhase('shaking');

    let clackCount = 0;
    const clackMax = 12;

    if (shakeIntervalRef.current) clearInterval(shakeIntervalRef.current);

    shakeIntervalRef.current = setInterval(() => {
      clackCount++;
      if (soundEnabled) {
        playStickClack(0.28 + Math.random() * 0.15);
      }

      setSticks((prev) =>
        prev.map((s) => ({
          ...s,
          offsetY: s.id === winningStickIndex && clackCount > 6 ? -15 - (clackCount - 6) * 4 : Math.sin(clackCount + s.id) * 6,
          rotation: s.rotation + (Math.random() * 4 - 2),
        }))
      );

      if (clackCount >= clackMax) {
        clearInterval(shakeIntervalRef.current);
        setPhase('ejecting');

        setTimeout(() => {
          setPhase('fallen');
          if (soundEnabled) {
            playGong(0.35);
          }
          onStickFallen(que, hao);
        }, 1100);
      }
    }, 120);
  };

  const resetShake = () => {
    if (shakeIntervalRef.current) clearInterval(shakeIntervalRef.current);
    setPhase('idle');
    setDrawnQue(null);
    setDrawnHao(null);
    setSticks(initialSticks);
  };

  const handleConsultThao = () => {
    if (drawnQue !== null && drawnHao !== null) {
      onAskThao(drawnQue, drawnHao);
    }
  };

  const drawnViet = drawnQue ? VIETNAMESE_HEXAGRAMS[drawnQue] : null;
  const transformed = drawnQue && drawnHao ? getTransformedHexagram(drawnQue, drawnHao) : null;
  const transformedViet = transformed ? VIETNAMESE_HEXAGRAMS[transformed.number] : null;

  return (
    <div className={`flex flex-col items-center select-none w-full ${isEnlarged ? 'scale-105' : ''} transition-all duration-300`}>
      {/* 3 SHAKE MODES SELECTOR (3 CHẾ ĐỘ LẮC ỐNG XĂM) */}
      <div className="w-full max-w-sm mx-auto mb-2 px-1">
        <div className="text-[0.68rem] font-serif font-bold text-[#7C2A1C] uppercase tracking-wider mb-1 flex items-center justify-between px-1">
          <span className="flex items-center gap-1">
            <span>🎲</span>
            <span>3 Cách Lắc Ống Xăm:</span>
          </span>
          <button
            type="button"
            onClick={() => setIsNailModalOpen(true)}
            className="text-[0.65rem] text-[#B23B28] hover:text-[#7C180E] underline flex items-center gap-1 cursor-pointer font-sans normal-case font-bold"
          >
            <span>💅 Móng Bát Quái & Quạt Ngọc</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-1 p-1 bg-[#2D120B]/90 backdrop-blur-xs rounded-full border border-[#D4AF37]/60 shadow-md">
          {/* Mode 1: Phone Shake */}
          <button
            type="button"
            onClick={() => handleSelectShakeMode('phone')}
            className={`flex-1 py-1.5 px-1.5 rounded-full text-[0.65rem] sm:text-[0.7rem] font-serif font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              shakeMode === 'phone'
                ? 'bg-gradient-to-r from-[#B23B28] to-[#7C2A1C] text-[#FFE599] shadow-md border border-[#FFE599]/70 scale-102 ring-1 ring-[#FFE599]/40'
                : 'text-[#E0C9A6] hover:text-white hover:bg-white/10'
            }`}
          >
            <Smartphone className="w-3 h-3 text-[#FFE599]" />
            <span>1. Lắc Đ.Thoại</span>
          </button>

          {/* Mode 2: Auto Shake */}
          <button
            type="button"
            onClick={() => handleSelectShakeMode('auto')}
            className={`flex-1 py-1.5 px-1.5 rounded-full text-[0.65rem] sm:text-[0.7rem] font-serif font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              shakeMode === 'auto'
                ? 'bg-gradient-to-r from-[#B23B28] to-[#7C2A1C] text-[#FFE599] shadow-md border border-[#FFE599]/70 scale-102 ring-1 ring-[#FFE599]/40'
                : 'text-[#E0C9A6] hover:text-white hover:bg-white/10'
            }`}
          >
            <Zap className="w-3 h-3 text-[#FFE599]" />
            <span>2. Tự Động Lắc</span>
          </button>

          {/* Mode 3: Co Thao Shakes */}
          <button
            type="button"
            onClick={() => handleSelectShakeMode('co_thao')}
            className={`flex-1 py-1.5 px-1.5 rounded-full text-[0.65rem] sm:text-[0.7rem] font-serif font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              shakeMode === 'co_thao'
                ? 'bg-gradient-to-r from-[#1B4D3E] via-[#2E7D62] to-[#0F3327] text-[#FFE082] shadow-md border border-[#FFE082] scale-102 ring-1 ring-[#FFE082]/60'
                : 'text-[#E0C9A6] hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🌸</span>
            <span>3. Cô Thảo Lắc</span>
          </button>
        </div>
      </div>

      {/* TUBE STYLE SELECTOR BAR (BỘ SƯU TẬP CÁC KIỂU DÁNG ỐNG XĂM) */}
      <div className="w-full max-w-sm mx-auto mb-2 px-1">
        <div className="flex items-center justify-between gap-1 p-1 bg-[#2D120B]/80 backdrop-blur-xs rounded-full border border-[#D4AF37]/50 shadow-inner">
          <button
            type="button"
            onClick={() => handleSelectStyle('classic_batquai')}
            className={`flex-1 py-1 px-1.5 rounded-full text-[0.65rem] sm:text-[0.7rem] font-serif font-bold transition-all flex items-center justify-center gap-1 ${
              tubeStyle === 'classic_batquai'
                ? 'bg-gradient-to-r from-[#8C1D13] via-[#B23B28] to-[#591008] text-[#FFE599] shadow-xs border border-[#FFE599]/80 scale-102 ring-1 ring-[#FFE599]/50'
                : 'text-[#E0C9A6] hover:text-white hover:bg-white/10'
            }`}
          >
            <span>☯️</span>
            <span>Ống Xăm Cổ Truyền</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectStyle('octagonal_crimson')}
            className={`flex-1 py-1 px-1.5 rounded-full text-[0.65rem] sm:text-[0.7rem] font-serif font-bold transition-all flex items-center justify-center gap-1 ${
              tubeStyle === 'octagonal_crimson'
                ? 'bg-gradient-to-r from-[#D32F2F] to-[#8B0000] text-[#FFE599] shadow-xs border border-[#FFE599]/60 scale-102'
                : 'text-[#E0C9A6] hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🏮</span>
            <span>Đỏ Bát Giác</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectStyle('cinnabar_royal')}
            className={`flex-1 py-1 px-1.5 rounded-full text-[0.65rem] sm:text-[0.7rem] font-serif font-bold transition-all flex items-center justify-center gap-1 ${
              tubeStyle === 'cinnabar_royal'
                ? 'bg-gradient-to-r from-[#8C1D13] to-[#4A0E08] text-[#FFE082] shadow-xs border border-[#FFE082]/60 scale-102'
                : 'text-[#E0C9A6] hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🏛️</span>
            <span>Hoàng Cung</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectStyle('aged_bamboo')}
            className={`flex-1 py-1 px-1.5 rounded-full text-[0.65rem] sm:text-[0.7rem] font-serif font-bold transition-all flex items-center justify-center gap-1 ${
              tubeStyle === 'aged_bamboo'
                ? 'bg-gradient-to-r from-[#5C3A21] to-[#2B170B] text-[#FFE599] shadow-xs border border-[#D4AF37]/60 scale-102'
                : 'text-[#E0C9A6] hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🎋</span>
            <span>Tre Gỗ</span>
          </button>
        </div>
      </div>

      {/* Wooden Table Stand & Fortune Tube */}
      <div className="relative flex flex-col items-center justify-center p-2 sm:p-4 w-full max-w-sm mx-auto">
        {/* Halo Glow behind the tube */}
        <div className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-b from-[#E9CE84]/30 via-[#B23B28]/15 to-transparent blur-2xl pointer-events-none" />

        {/* Shaking Stage */}
        <div className="relative flex flex-col items-center">
          {/* CÔ THẢO HANDS WITH BÁT QUÁI NAIL ART HOLDING AND SHAKING THE TUBE */}
          <LadyThaoShakingHands
            isShaking={phase === 'shaking'}
            isActiveMode={shakeMode === 'co_thao' || phase === 'shaking'}
          />

          <motion.div
            animate={
              phase === 'shaking'
                ? {
                    rotate: [-6, 6, -5, 5, -4, 4, -2, 2, 0],
                    y: [-4, 6, -5, 5, -3, 3, 0],
                    x: [-3, 3, -2, 2, 0],
                  }
                : phase === 'ejecting'
                ? {
                    rotate: [0, -2, 2, 0],
                    y: [0, -4, 0],
                  }
                : { rotate: 0, y: 0, x: 0 }
            }
            transition={{
              repeat: phase === 'shaking' ? Infinity : 0,
              duration: 0.28,
              ease: 'easeInOut',
            }}
            className="relative flex flex-col items-center cursor-pointer group z-10"
            onClick={() => {
              if (phase === 'idle') startShakeSequence();
            }}
          >
          {/* THE BUNDLE OF BAMBOO FORTUNE STICKS PROTRUDING FROM THE CYLINDER MOUTH */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 -mb-8 z-10 flex items-end justify-center overflow-visible">
            {sticks.map((stick) => {
              const isEjectedWinner = phase === 'ejecting' && stick.id === 6;
              return (
                <motion.div
                  key={stick.id}
                  animate={
                    isEjectedWinner
                      ? {
                          y: -95,
                          rotate: 8,
                          scale: 1.05,
                        }
                      : {
                          y: stick.offsetY,
                          rotate: stick.rotation,
                        }
                  }
                  transition={
                    isEjectedWinner
                      ? { duration: 0.9, ease: [0.175, 0.885, 0.32, 1.275] }
                      : { duration: 0.15 }
                  }
                  className="absolute bottom-0 w-2.5 sm:w-3 bg-gradient-to-b from-[#E5C158] via-[#C99E32] to-[#8C6D2F] rounded-t-sm shadow-xs border-t border-l border-[#FFE599]/60 flex flex-col items-center justify-start overflow-hidden"
                  style={{
                    left: `calc(50% + ${stick.offsetX}px)`,
                    height: `${stick.height}px`,
                    transformOrigin: 'bottom center',
                    transform: `translateX(-50%) rotate(${stick.rotation}deg)`,
                  }}
                >
                  {/* Cinnabar Vermilion Dipped Tip (Chu Sa) */}
                  <div className="w-full h-3 bg-gradient-to-b from-[#9C2C1E] to-[#B23B28] rounded-t-xs" />
                  {/* Subtle Wood Grain Lines */}
                  <div className="w-px h-full bg-[#5C451D]/30" />
                </motion.div>
              );
            })}
          </div>

          {/* ========================================================= */}
          {/* STYLE: ỐNG XĂM CỔ TRUYỀN BÁT QUÁI (EXACT REFERENCE DESIGN) */}
          {/* ========================================================= */}
          {tubeStyle === 'classic_batquai' && (
            <div className="relative z-20 w-40 sm:w-46 h-58 sm:h-64 rounded-t-xl rounded-b-3xl bg-gradient-to-r from-[#4A0D07] via-[#751B12] via-30% via-[#942419] via-50% via-[#751B12] via-70% to-[#3B0904] border-2 border-[#FFE599]/80 shadow-[0_16px_40px_rgba(117,27,18,0.5),0_8px_20px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between p-2 overflow-visible">
              {/* Subtle Vertical Wood Slat Plank Grooves */}
              <div
                className="absolute inset-0 rounded-t-xl rounded-b-3xl pointer-events-none opacity-30"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(0, 0, 0, 0.45) 16px, rgba(0, 0, 0, 0.45) 17px, rgba(255, 229, 153, 0.15) 17px, rgba(255, 229, 153, 0.15) 18px)',
                }}
              />

              {/* Side Wooden Upright Bracket Post (Left) */}
              <div className="absolute -left-2.5 top-6 w-2.5 h-38 bg-gradient-to-r from-[#240603] to-[#5E140D] rounded-t-sm rounded-b-xs border-l border-[#FFE599]/60 shadow-md flex flex-col items-center justify-between z-10">
                {/* Red Vermilion Tip */}
                <div className="w-full h-4 bg-gradient-to-b from-[#B23B28] to-[#751B12] rounded-t-xs border-b border-[#FFE599]/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFE599] mb-3 shadow-xs" />
              </div>

              {/* Left Hanging Red Lucky Tassel & Gold Diamond Plaque */}
              <div className="absolute -left-5 top-14 flex flex-col items-center z-30 pointer-events-none">
                {/* Gold Cord Ring */}
                <div className="w-1.5 h-2 rounded-full border border-[#FFE599] bg-[#FFE599]/40" />
                {/* Gold Diamond Plaque (Kim Bài Hình Thoi) */}
                <div className="w-4 h-4 -my-0.5 rotate-45 border-2 border-[#FFE599] bg-[#B23B28] shadow-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFE599]" />
                </div>
                {/* Red Silk Hanging Tassel Cords */}
                <div className="flex gap-0.5 mt-0.5">
                  <div className="w-1 h-14 bg-gradient-to-b from-[#B23B28] via-[#8C1D13] to-[#4A0D07] rounded-b-full shadow-xs" />
                  <div className="w-1 h-16 bg-gradient-to-b from-[#C43825] via-[#8C1D13] to-[#3B0904] rounded-b-full shadow-xs" />
                </div>
              </div>

              {/* Side Wooden Upright Bracket Post (Right) */}
              <div className="absolute -right-2.5 top-6 w-2.5 h-38 bg-gradient-to-l from-[#240603] to-[#5E140D] rounded-t-sm rounded-b-xs border-r border-[#FFE599]/60 shadow-md flex flex-col items-center justify-between z-10">
                {/* Red Vermilion Tip */}
                <div className="w-full h-4 bg-gradient-to-b from-[#B23B28] to-[#751B12] rounded-t-xs border-b border-[#FFE599]/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFE599] mb-3 shadow-xs" />
              </div>

              {/* TOP GOLD BATTLEMENT FRETWORK BAND (ĐAI VÀNG HỒI VĂN RĂNG CƯA TRÊN) */}
              <div className="relative z-20 w-full flex flex-col items-center pt-1">
                {/* Crenellated Greek Fret / Castle Battlement Steps */}
                <div className="w-full flex justify-between px-1 h-2 overflow-hidden">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={`top-notch-${i}`}
                      className="w-2.5 h-2 bg-gradient-to-b from-[#FFE599] to-[#D4AF37] border-t border-x border-[#FFF3B0] shadow-xs"
                    />
                  ))}
                </div>
                {/* Solid Gold Horizontal Bar */}
                <div className="w-full h-3.5 bg-gradient-to-r from-[#99732B] via-[#FFE599] via-50% to-[#99732B] border-y border-[#540B04] shadow-xs flex items-center justify-around px-3">
                  {/* Round Gold Rivets */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#540B04] border border-[#FFE599] shadow-xs" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#540B04] border border-[#FFE599] shadow-xs" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#540B04] border border-[#FFE599] shadow-xs" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#540B04] border border-[#FFE599] shadow-xs" />
                </div>
              </div>

              {/* CENTER CIRCULAR YIN-YANG (THÁI CỰC BÁT QUÁI) MEDALLION */}
              <div className="relative z-20 my-auto flex items-center justify-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-[#FFE599] bg-gradient-to-b from-[#1F0C08] to-[#0A0402] shadow-[0_8px_20px_rgba(0,0,0,0.8),inset_0_2px_6px_rgba(255,229,153,0.3)] flex items-center justify-center p-1">
                  {/* Outer Concentric Dotted / Dashed Gold Ring */}
                  <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#FFE599]/80 pointer-events-none" />

                  {/* High-Fidelity Golden & Dark Lacquer Yin-Yang Symbol (Thái Cực Đồ) */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFE599] overflow-hidden border border-[#D4AF37] shadow-inner flex">
                    {/* Left Dark Yin Half */}
                    <div className="w-1/2 h-full bg-[#2A0E08]" />
                    {/* Right Gold Yang Half */}
                    <div className="w-1/2 h-full bg-[#FFE599]" />

                    {/* Top Yin Disc (Dark with Gold Eye) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#2A0E08] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#FFE599] shadow-xs" />
                    </div>

                    {/* Bottom Yang Disc (Gold with Dark Eye) */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FFE599] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#2A0E08] shadow-xs" />
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM GOLD BATTLEMENT FRETWORK BAND (ĐAI VÀNG HỒI VĂN RĂNG CƯA DƯỚI) */}
              <div className="relative z-20 w-full flex flex-col items-center pb-1">
                {/* Crenellated Greek Fret / Castle Battlement Steps */}
                <div className="w-full flex justify-between px-1 h-2 overflow-hidden">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={`bottom-notch-${i}`}
                      className="w-2.5 h-2 bg-gradient-to-b from-[#FFE599] to-[#D4AF37] border-t border-x border-[#FFF3B0] shadow-xs"
                    />
                  ))}
                </div>
                {/* Solid Gold Horizontal Bar */}
                <div className="w-full h-3.5 bg-gradient-to-r from-[#99732B] via-[#FFE599] via-50% to-[#99732B] border-y border-[#540B04] shadow-xs flex items-center justify-around px-3">
                  {/* Round Gold Rivets */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#540B04] border border-[#FFE599] shadow-xs" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#540B04] border border-[#FFE599] shadow-xs" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#540B04] border border-[#FFE599] shadow-xs" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#540B04] border border-[#FFE599] shadow-xs" />
                </div>
              </div>

              {/* Bottom Rounded Base Trim */}
              <div className="w-full h-3 rounded-b-2xl bg-gradient-to-r from-[#240603] via-[#4A0D07] to-[#240603] -mt-0.5 border-t border-[#FFE599]/30" />
            </div>
          )}

          {/* ========================================================= */}
          {/* STYLE 1: ỐNG XĂM ĐỎ THẮM BÁT GIÁC CUNG ĐÌNH (OCTAGONAL CRIMSON) */}
          {/* ========================================================= */}
          {tubeStyle === 'octagonal_crimson' && (
            <div className="relative z-20 w-38 sm:w-44 h-54 sm:h-60 rounded-t-lg rounded-b-2xl bg-gradient-to-r from-[#690E05] via-[#B81F14] via-30% via-[#D83627] via-50% via-[#B81F14] via-70% to-[#500A03] border-2 border-[#FFE599] shadow-[0_16px_36px_rgba(184,31,20,0.5),0_6px_16px_rgba(0,0,0,0.4)] flex flex-col items-center justify-between p-2.5 overflow-hidden">
              {/* Faceted Octagonal Column Lines */}
              <div className="absolute inset-0 flex justify-between px-7 pointer-events-none opacity-30">
                <div className="w-px h-full bg-gradient-to-b from-white via-[#FFE599] to-transparent shadow-[0_0_2px_#fff]" />
                <div className="w-px h-full bg-gradient-to-b from-white via-[#FFE599] to-transparent shadow-[0_0_2px_#fff]" />
              </div>

              {/* Top Imperial Gold Lip Ring */}
              <div className="w-full h-4.5 rounded-t-md bg-gradient-to-r from-[#99732B] via-[#FFE599] via-50% to-[#99732B] border-b-2 border-[#540B04] flex items-center justify-center shadow-xs">
                <div className="w-3/4 h-1 bg-[#540B04]/40 rounded-full" />
              </div>

              {/* Middle Ornate Plaque with Calligraphy "靈 籤" */}
              <div className="relative z-10 flex flex-col items-center my-auto py-1">
                <div className="w-20 h-24 sm:w-22 sm:h-28 rounded-sm border-2 border-[#FFE599] bg-gradient-to-b from-[#690E05] via-[#8C160B] to-[#400702] p-1.5 flex flex-col items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.6)]">
                  {/* Bát Quái Center Seal */}
                  <div className="w-7 h-7 rounded-full border border-[#FFE599] bg-[#FFE599]/20 flex items-center justify-center mb-0.5 text-xs text-[#FFE599] shadow-xs">
                    ☯
                  </div>
                  {/* Bold Calligraphy */}
                  <div className="font-serif font-black text-lg sm:text-xl text-[#FFE599] tracking-widest leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    靈
                  </div>
                  <div className="font-serif font-black text-lg sm:text-xl text-[#FFE599] tracking-widest leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    籤
                  </div>
                </div>
                <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#400702]/90 border border-[#FFE599]/80 shadow-xs">
                  <span className="font-sans font-black text-[0.65rem] text-[#FFE599] tracking-[0.2em] uppercase">
                    THẦN THIÊM
                  </span>
                </div>
              </div>

              {/* Bottom Brass Studded Ring with Red Lucky Tassel */}
              <div className="w-full h-5.5 rounded-b-xl bg-gradient-to-r from-[#99732B] via-[#FFE599] via-50% to-[#99732B] border-t border-[#540B04]/50 flex items-center justify-around px-2 shadow-xs">
                <div className="w-2 h-2 rounded-full bg-[#540B04] border border-[#FFE599]" />
                <div className="w-12 h-1 bg-[#540B04]/50 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-[#540B04] border border-[#FFE599]" />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STYLE 2: ỐNG XĂM ĐỎ CHU SA HOÀNG CUNG (CINNABAR ROYAL) */}
          {/* ========================================================= */}
          {tubeStyle === 'cinnabar_royal' && (
            <div className="relative z-20 w-36 sm:w-42 h-52 sm:h-58 rounded-t-lg rounded-b-xl bg-gradient-to-r from-[#4A0E08] via-[#8C1D13] via-25% via-[#B23B28] via-50% via-[#9E2417] via-75% to-[#3D0A05] border-2 border-[#E9CE84] shadow-[0_16px_36px_rgba(124,31,22,0.45),0_6px_16px_rgba(0,0,0,0.4)] flex flex-col items-center justify-between p-2.5 overflow-hidden">
              <div className="w-full h-4.5 rounded-t-md bg-gradient-to-r from-[#8C6D2F] via-[#FFE082] via-50% to-[#8C6D2F] border-b-2 border-[#591008] flex items-center justify-center shadow-xs">
                <div className="w-3/4 h-1 bg-[#591008]/40 rounded-full" />
              </div>
              <div className="absolute inset-y-0 left-1/3 w-8 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center my-auto py-1">
                <div className="w-18 h-22 sm:w-20 sm:h-26 rounded-xs border-2 border-[#FFE082] bg-gradient-to-b from-[#591008] via-[#7C180E] to-[#3D0A05] p-1.5 flex flex-col items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                  <div className="w-6 h-6 rounded-full border border-[#FFE082] bg-[#FFE082]/15 flex items-center justify-center mb-0.5 text-[0.65rem] text-[#FFE082] shadow-xs">
                    ☯
                  </div>
                  <div className="font-serif font-black text-base sm:text-lg text-[#FFE082] tracking-widest leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    靈
                  </div>
                  <div className="font-serif font-black text-base sm:text-lg text-[#FFE082] tracking-widest leading-none mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    籤
                  </div>
                </div>
                <div className="mt-1 px-2 py-0.5 rounded-full bg-[#3D0A05]/80 border border-[#FFE082]/70 shadow-xs">
                  <span className="font-sans font-extrabold text-[0.6rem] text-[#FFE082] tracking-[0.2em] uppercase">
                    KINH DỊCH
                  </span>
                </div>
              </div>
              <div className="w-full h-5.5 rounded-b-md bg-gradient-to-r from-[#8C6D2F] via-[#FFE082] via-50% to-[#8C6D2F] border-t border-[#591008]/50 flex items-center justify-around px-2 shadow-xs">
                <div className="w-2 h-2 rounded-full bg-[#591008] border border-[#FFE082]" />
                <div className="w-10 h-1 bg-[#591008]/50 rounded-full" />
                <div className="w-2 h-2 rounded-full bg-[#591008] border border-[#FFE082]" />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STYLE 4: ỐNG TRE GIÀ KHẮC CHỮ NHO (AGED BAMBOO) */}
          {/* ========================================================= */}
          {tubeStyle === 'aged_bamboo' && (
            <div className="relative z-20 w-36 sm:w-40 h-52 sm:h-56 rounded-t-lg rounded-b-xl bg-gradient-to-r from-[#2A170A] via-[#4D2D18] via-30% via-[#6B3F22] via-60% to-[#241308] border-2 border-[#8C5E35] shadow-[0_14px_28px_rgba(0,0,0,0.5),0_6px_10px_rgba(0,0,0,0.3)] flex flex-col items-center justify-between p-2.5 overflow-hidden">
              <div className="w-full h-4 rounded-t-md bg-gradient-to-r from-[#1A0D06] via-[#8C4A26] to-[#1A0D06] border-b-2 border-[#D4AF37] flex items-center justify-center">
                <div className="w-3/4 h-1 bg-[#D4AF37]/50 rounded-full" />
              </div>
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(90deg,#000_0px,#000_2px,transparent_2px,transparent_10px)]" />
              <div className="relative z-10 flex flex-col items-center my-auto py-1">
                <div className="w-16 h-20 sm:w-18 sm:h-24 rounded-xs border border-[#D4AF37]/80 bg-[#1F1008]/80 p-1 flex flex-col items-center justify-center shadow-inner">
                  <div className="w-6 h-6 rounded-full border border-[#D4AF37] flex items-center justify-center mb-1 text-[0.6rem] text-[#FFE599]">
                    ☯
                  </div>
                  <div className="font-serif font-black text-sm sm:text-base text-[#FFE599] tracking-widest leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    靈
                  </div>
                  <div className="font-serif font-black text-sm sm:text-base text-[#FFE599] tracking-widest leading-none mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    籤
                  </div>
                </div>
                <span className="font-sans font-bold text-[0.62rem] text-[#D4AF37] tracking-[0.2em] mt-1 uppercase">
                  KINH DỊCH
                </span>
              </div>
              <div className="w-full h-5 rounded-b-md bg-gradient-to-r from-[#5C3D1E] via-[#D4AF37] to-[#5C3D1E] border-t border-[#FFE599]/60 flex items-center justify-around px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A0D06]" />
                <div className="w-8 h-1 bg-[#1A0D06]/40 rounded-full" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A0D06]" />
              </div>
            </div>
          )}

          {/* Master Red Lacquer & Gold Altar Pedestal (hidden for classic_batquai to match exact reference) */}
          {tubeStyle !== 'classic_batquai' && (
            <div className="relative z-10 -mt-1 w-44 sm:w-50 h-5.5 bg-gradient-to-r from-[#2A0805] via-[#5C140D] via-50% to-[#2A0805] rounded-sm border-t-2 border-b border-[#FFE082] shadow-lg flex items-center justify-between px-3">
              <div className="w-2.5 h-2.5 rounded-full border border-[#FFE082] bg-[#FFE082]/30" />
              <div className="w-20 h-0.5 bg-[#FFE082]/60 rounded-full" />
              <div className="w-2.5 h-2.5 rounded-full border border-[#FFE082] bg-[#FFE082]/30" />
            </div>
          )}
          {/* Subtle Ground Shadow */}
          <div className="w-44 h-3 rounded-full bg-[#000000]/60 blur-xs mt-1.5" />
        </motion.div>
        </div>

        {/* EJECTED / FALLEN WINNING FORTUNE STICK PLAQUE DISPLAY */}
        <div className="w-full mt-3 min-h-[160px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === 'fallen' && drawnQue !== null && drawnHao !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="w-full flex flex-col items-center"
              >
                {/* Horizontal Bamboo Fortune Stick Token with Cinnabar Tip */}
                <motion.div
                  initial={{ rotate: -4 }}
                  animate={{ rotate: 0 }}
                  className="w-full max-w-[280px] h-9 bg-gradient-to-r from-[#D9A036] via-[#F3DE97] to-[#C9932B] rounded-full border border-[#8C6D2F] shadow-md flex items-center justify-between px-3 mb-2 z-10"
                >
                  <div className="w-5 h-full bg-[#9C2C1E] -ml-3 rounded-l-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFE599]" />
                  </div>
                  <span className="font-serif italic font-bold text-[0.72rem] text-[#4A3B22] tracking-wider">
                    THẺ XĂM QUẺ #{drawnQue} · HÀO {drawnHao}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#B23B28]/40" />
                </motion.div>

                {/* Traditional Wooden Plaque with Cinnabar Header and Gold Foil Inlay */}
                <div className="relative w-full flex flex-col items-center bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E3] to-[#F1DFC0] border-2 border-[#B23B28] p-3.5 rounded-xs shadow-[0_18px_40px_rgba(178,59,40,0.4),0_6px_16px_rgba(0,0,0,0.18)]">
                  {/* Auspicious Badge Header */}
                  <div className="flex items-center gap-1.5 text-[0.68rem] tracking-[0.2em] uppercase font-sans text-[#AD8A2E] font-extrabold mb-1">
                    <Sparkles className="w-3 h-3 text-[#B23B28]" />
                    <span>THẺ XĂM ĐÃ RƠI RA KHỎI ỐNG</span>
                    <Sparkles className="w-3 h-3 text-[#B23B28]" />
                  </div>

                  {/* Main Primary Hexagram Title */}
                  <div className="font-serif italic text-2xl sm:text-3xl font-bold text-[#7C2A1C] whitespace-nowrap tracking-tight text-center">
                    Quẻ Số #{drawnQue}
                  </div>

                  {/* Quẻ Chủ Name */}
                  <div className="font-serif font-bold text-sm sm:text-base text-[#2E2415] text-center mt-0.5 mb-1.5">
                    {drawnViet?.name}
                  </div>

                  {/* The Authentic 3-Step Transformation Plaque (Quẻ Chủ -> Hào Động -> Quẻ Biến) */}
                  <div className="w-full bg-[#EFE4CB]/85 border border-[#AD8A2E]/35 rounded-xs p-2 my-1 text-xs font-sans">
                    <div className="flex items-center justify-between text-[#6E5C3E] font-medium border-b border-[#AD8A2E]/20 pb-1 mb-1">
                      <span className="text-[#7C2A1C] font-bold">
                        ① Quẻ Chủ (Gốc)
                      </span>
                      <span className="text-[#2E2415] font-semibold">#{drawnQue} ({drawnViet?.name})</span>
                    </div>

                    <div className="flex items-center justify-between text-[#6E5C3E] font-medium border-b border-[#AD8A2E]/20 pb-1 mb-1">
                      <span className="text-[#B23B28] font-bold flex items-center gap-1">
                        <span>⚡</span>
                        ② Hào Động Số {drawnHao}
                      </span>
                      <span className="text-[#B23B28] font-bold">
                        {transformed?.wasSolid ? '⚊ Dương ➔ ⚋ Âm' : '⚋ Âm ➔ ⚊ Dương'}
                      </span>
                    </div>

                    {transformed && transformedViet && (
                      <div className="flex items-center justify-between text-[#6E5C3E] font-medium pt-0.5">
                        <span className="text-[#2E7D32] font-bold">
                          ③ Biến Thành Quẻ
                        </span>
                        <span className="text-[#1B5E20] font-bold">
                          #{transformed.number} {transformedViet.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Golden Corner Accents */}
                  <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#B23B28]" />
                  <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#B23B28]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Guidance Prompt & Shake Status */}
        <div className="text-center font-serif italic text-xs sm:text-sm text-[#6E5C3E] min-h-[1.5rem] mt-3 mb-1">
          {phase === 'shaking' && (
            <span className="text-[#B23B28] font-bold animate-pulse">
              {shakeMode === 'co_thao'
                ? '🌸 Đôi tay Cô Thảo đang thành tâm lắc ống xăm cầu phúc...'
                : 'Đang lắc ống xăm linh nghiệm...'}
            </span>
          )}
          {phase === 'ejecting' && 'Thẻ xăm đang nhô ra khỏi ống...'}
          {phase === 'fallen' && (
            <span className="text-[#7C2A1C] font-semibold">
              Thẻ xăm đã rơi ra! Mời bạn bấm Diễn Kiến Cô Thảo để khai mành giải quẻ.
            </span>
          )}
          {phase === 'idle' && (
            <div className="flex items-center justify-center gap-1.5">
              {shakeMode === 'phone' && (
                <>
                  <Smartphone className={`w-3.5 h-3.5 text-[#B23B28] ${shakeDetectedFeedback ? 'animate-bounce' : 'animate-pulse'}`} />
                  <span>Cầm điện thoại lắc đều tay (hoặc bấm nút bên dưới) để xin xăm</span>
                </>
              )}
              {shakeMode === 'auto' && (
                <>
                  <Zap className="w-3.5 h-3.5 text-[#B23B28] animate-pulse" />
                  <span>Bấm nút "Tự Động Lắc Nhanh" bên dưới để gieo quẻ</span>
                </>
              )}
              {shakeMode === 'co_thao' && (
                <>
                  <span className="text-xs">🌸</span>
                  <span className="text-[#1B4D3E] font-semibold">
                    Cô Thảo sẽ dùng đôi tay móng Bát Quái ôm ống xăm lắc quẻ cho bạn
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons Area */}
        <div className="flex flex-col gap-2 justify-center items-center mt-2 z-20 relative w-full">
          {phase === 'fallen' ? (
            <div className="w-full flex flex-col gap-2">
              {/* Grand 'ASK THAO / DIỆN KIẾN THẢO' Button */}
              <button
                type="button"
                id="ask-thao-button"
                onClick={handleConsultThao}
                className="w-full py-3.5 px-6 rounded-xs font-sans font-bold text-base tracking-wide bg-gradient-to-r from-[#B23B28] via-[#C8402C] to-[#7C2A1C] hover:from-[#C8402C] hover:to-[#8E2F20] text-[#F7F0E1] border-2 border-[#E9CE84] shadow-[0_8px_22px_rgba(178,59,40,0.45)] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer animate-pulse"
              >
                <Sparkles className="w-5 h-5 text-[#E9CE84]" />
                <span>✨ DIỆN KIẾN CÔ THẢO (KHAI MÀNH GIẢI QUẺ)</span>
                <ArrowRight className="w-4 h-4 text-[#E9CE84]" />
              </button>

              {/* Re-shake option */}
              <button
                type="button"
                onClick={resetShake}
                className="w-full py-1.5 rounded-xs text-xs font-sans text-[#6E5C3E] hover:text-[#2E2415] transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Gieo lại xăm khác</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2 justify-center items-center">
              {/* MAIN ACTION BUTTON BASED ON ACTIVE MODE */}
              <button
                type="button"
                id="shake-tube-button"
                disabled={phase === 'shaking' || phase === 'ejecting' || disabled}
                onClick={startShakeSequence}
                className={`w-full py-3 px-5 rounded-xs font-sans font-bold text-sm tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                  phase === 'shaking' || phase === 'ejecting' || disabled
                    ? 'opacity-60 cursor-not-allowed bg-[#7C2A1C] text-[#F7F0E1]'
                    : shakeMode === 'co_thao'
                    ? 'bg-gradient-to-r from-[#1B4D3E] via-[#2E7D62] to-[#0F3327] hover:brightness-110 text-[#FFE082] border-2 border-[#FFE082] shadow-[0_6px_20px_rgba(30,110,80,0.4)]'
                    : 'bg-gradient-to-b from-[#B23B28] to-[#7C2A1C] hover:from-[#C8402C] hover:to-[#8E2F20] text-[#F7F0E1] border border-[#E9CE84]/50 hover:shadow-[0_4px_16px_rgba(178,59,40,0.35)]'
                }`}
              >
                {shakeMode === 'co_thao' ? (
                  <>
                    <span className="text-base">🌸</span>
                    <span>
                      {phase === 'idle'
                        ? 'Nhờ Cô Thảo Lắc Dùm (Móng Bát Quái)'
                        : 'Cô Thảo Đang Lắc Ống Xăm...'}
                    </span>
                    <Sparkles className="w-4 h-4 text-[#FFE082]" />
                  </>
                ) : shakeMode === 'phone' ? (
                  <>
                    <Smartphone className="w-4 h-4 text-[#FFE599]" />
                    <span>
                      {phase === 'idle'
                        ? 'Lắc Điện Thoại Hoặc Bấm Vào Đây'
                        : 'Đang Lắc Ống Xăm...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-[#FFE599]" />
                    <span>
                      {phase === 'idle'
                        ? 'Tự Động Lắc Nhanh Xin Quẻ'
                        : 'Đang Tự Động Lắc...'}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* iOS Accelerometer permission prompt button if needed */}
          {motionPermNeeded && shakeMode === 'phone' && (
            <button
              type="button"
              id="enable-motion-button"
              onClick={requestMotionPermission}
              className="mt-1 px-3 py-1.5 rounded-xs text-xs font-sans font-medium border border-[#AD8A2E]/50 text-[#6E5C3E] hover:bg-[#AD8A2E]/10 transition-colors flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#B23B28]" />
              <span>Bật cảm biến lắc điện thoại (iOS)</span>
            </button>
          )}
        </div>
      </div>

      {/* MODAL: CHIÊM NGƯỠNG ĐÔI TAY CÔ THẢO CẦM QUẠT NGỌC & MÓNG BÁT QUÁI */}
      <LadyThaoHandsFanModal
        isOpen={isNailModalOpen}
        onClose={() => setIsNailModalOpen(false)}
      />
    </div>
  );
};
