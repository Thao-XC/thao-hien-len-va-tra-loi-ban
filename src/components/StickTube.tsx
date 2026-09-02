import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playStickClack, playGong } from '../utils/audio';
import { Sparkles, Smartphone, ArrowRight, RefreshCw, Compass } from 'lucide-react';
import { HEXAGRAM_DATA, getTransformedHexagram } from '../utils/hexagramPatterns';
import { VIETNAMESE_HEXAGRAMS } from '../data/vietnameseHexagrams';

interface StickTubeProps {
  onStickFallen: (que: number, hao: number) => void;
  onAskThao: (que: number, hao: number) => void;
  disabled?: boolean;
  soundEnabled?: boolean;
  language?: 'vi';
  hasQuestion?: boolean;
  isEnlarged?: boolean;
}

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
      {/* Wooden Hexagonal Table Stand & Bamboo Cylinder */}
      <div className="relative flex flex-col items-center justify-center p-3 sm:p-5 w-full max-w-sm mx-auto">
        {/* Halo Glow behind the tube */}
        <div className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-b from-[#E9CE84]/30 via-[#B23B28]/10 to-transparent blur-2xl pointer-events-none" />

        {/* Shaking Stage */}
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
          className="relative flex flex-col items-center cursor-pointer group"
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

          {/* THE MASTER BAMBOO FORTUNE TUBE (ỐNG XĂM TRE KHẮC CHỮ NHO) */}
          <div className="relative z-20 w-36 sm:w-40 h-52 sm:h-56 rounded-t-lg rounded-b-xl bg-gradient-to-r from-[#2A170A] via-[#4D2D18] via-30% via-[#6B3F22] via-60% to-[#241308] border-2 border-[#8C5E35] shadow-[0_14px_28px_rgba(0,0,0,0.5),0_6px_10px_rgba(0,0,0,0.3)] flex flex-col items-center justify-between p-2.5 overflow-hidden">
            {/* Top Lacquer Bamboo Lip Ring */}
            <div className="w-full h-4 rounded-t-md bg-gradient-to-r from-[#1A0D06] via-[#8C4A26] to-[#1A0D06] border-b-2 border-[#D4AF37] flex items-center justify-center">
              <div className="w-3/4 h-1 bg-[#D4AF37]/50 rounded-full" />
            </div>

            {/* Vertical Bamboo Grain Texture */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(90deg,#000_0px,#000_2px,transparent_2px,transparent_10px)]" />

            {/* Traditional Auspicious Gold Inscription: "KINH DỊCH THẦN QUẺ" */}
            <div className="relative z-10 flex flex-col items-center my-auto py-1">
              <div className="w-16 h-20 sm:w-18 sm:h-24 rounded-xs border border-[#D4AF37]/80 bg-[#1F1008]/80 p-1 flex flex-col items-center justify-center shadow-inner">
                {/* Traditional Eight Trigrams (Bát Quái) Center Seal */}
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

            {/* Bottom Brass Reinforced Band */}
            <div className="w-full h-5 rounded-b-md bg-gradient-to-r from-[#5C3D1E] via-[#D4AF37] to-[#5C3D1E] border-t border-[#FFE599]/60 flex items-center justify-around px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1A0D06]" />
              <div className="w-8 h-1 bg-[#1A0D06]/40 rounded-full" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#1A0D06]" />
            </div>
          </div>
        </motion.div>

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
          {phase === 'shaking' && 'Đang lắc ống xăm linh nghiệm...'}
          {phase === 'ejecting' && 'Thẻ xăm đang nhô ra...'}
          {phase === 'fallen' && (
            <span className="text-[#7C2A1C] font-semibold">
              Thẻ xăm đã rơi ra! Mời bạn bấm Diễn Kiến Cô Thảo để khai mành giải quẻ.
            </span>
          )}
          {phase === 'idle' && (
            <div className="flex items-center justify-center gap-1.5">
              <Smartphone className={`w-3.5 h-3.5 text-[#B23B28] ${shakeDetectedFeedback ? 'animate-bounce' : 'animate-pulse'}`} />
              <span>
                Lắc ống xăm (hoặc lắc điện thoại) để gieo quẻ
              </span>
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
            <div className="w-full flex flex-col sm:flex-row gap-2 justify-center items-center">
              {/* SHAKE WOODEN STICKS BOX */}
              <button
                type="button"
                id="shake-tube-button"
                disabled={phase === 'shaking' || phase === 'ejecting' || disabled}
                onClick={startShakeSequence}
                className={`w-full py-3 px-5 rounded-xs font-sans font-bold text-sm tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                  phase === 'shaking' || phase === 'ejecting' || disabled
                    ? 'opacity-60 cursor-not-allowed bg-[#7C2A1C] text-[#F7F0E1]'
                    : 'bg-gradient-to-b from-[#B23B28] to-[#7C2A1C] hover:from-[#C8402C] hover:to-[#8E2F20] text-[#F7F0E1] border border-[#E9CE84]/50 hover:shadow-[0_4px_16px_rgba(178,59,40,0.35)]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#E9CE84]" />
                <span>
                  {phase === 'idle'
                    ? 'Lắc Ống Xăm Xin Quẻ'
                    : 'Đang Lắc Ống Xăm...'}
                </span>
              </button>
            </div>
          )}

          {/* iOS Accelerometer permission prompt button if needed */}
          {motionPermNeeded && (
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
    </div>
  );
};
