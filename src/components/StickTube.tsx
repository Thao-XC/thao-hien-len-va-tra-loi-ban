import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playStickClack, playGong } from '../utils/audio';
import { Sparkles, Smartphone, ArrowRight, RefreshCw, Compass } from 'lucide-react';
import { HEXAGRAM_DATA, getTransformedHexagram } from '../utils/hexagramPatterns';

interface StickTubeProps {
  onStickFallen: (que: number, hao: number) => void;
  onAskThao: (que: number, hao: number) => void;
  disabled?: boolean;
  soundEnabled?: boolean;
  language: 'en' | 'vi';
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
  language,
  hasQuestion = false,
  isEnlarged = false,
}) => {
  // Flow states: idle -> shaking -> ejecting -> fallen
  const [phase, setPhase] = useState<'idle' | 'shaking' | 'ejecting' | 'fallen'>('idle');
  const [drawnQue, setDrawnQue] = useState<number | null>(null);
  const [drawnHao, setDrawnHao] = useState<number | null>(null);
  const [motionPermNeeded, setMotionPermNeeded] = useState<boolean>(false);
  const [shakeDetectedFeedback, setShakeDetectedFeedback] = useState<boolean>(false);

  // Realistic fan of 11 authentic bamboo sticks inside the cylinder
  const initialSticks: StickState[] = [
    { id: 1, height: 105, rotation: -14, offsetX: -28, offsetY: 4, cinnabarRatio: 26 },
    { id: 2, height: 118, rotation: -9, offsetX: -20, offsetY: -2, cinnabarRatio: 28 },
    { id: 3, height: 126, rotation: -5, offsetX: -12, offsetY: -8, cinnabarRatio: 30 },
    { id: 4, height: 132, rotation: -2, offsetX: -6, offsetY: -12, cinnabarRatio: 32 },
    { id: 5, height: 138, rotation: 1, offsetX: 0, offsetY: -16, cinnabarRatio: 34 },
    { id: 6, height: 134, rotation: 3, offsetX: 6, offsetY: -13, cinnabarRatio: 32 },
    { id: 7, height: 128, rotation: 6, offsetX: 12, offsetY: -9, cinnabarRatio: 30 },
    { id: 8, height: 120, rotation: 10, offsetX: 20, offsetY: -4, cinnabarRatio: 28 },
    { id: 9, height: 110, rotation: 15, offsetX: 28, offsetY: 2, cinnabarRatio: 26 },
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

  // STEP 2: SHAKE THE AUTHENTIC BAMBOO TUBE
  const startShakeSequence = () => {
    if (phase === 'shaking' || phase === 'ejecting' || disabled) return;

    const que = Math.floor(Math.random() * 64) + 1;
    const hao = Math.floor(Math.random() * 6) + 1;
    setDrawnQue(que);
    setDrawnHao(hao);
    setPhase('shaking');

    // Clattering stick sound
    if (soundEnabled) {
      playStickClack(0.48);
      let count = 0;
      shakeIntervalRef.current = setInterval(() => {
        playStickClack(0.32 + Math.random() * 0.25);
        count++;
        if (count > 8) clearInterval(shakeIntervalRef.current);
      }, 150);
    }

    // 1.35s of intense authentic tube shaking
    setTimeout(() => {
      if (shakeIntervalRef.current) clearInterval(shakeIntervalRef.current);
      setPhase('ejecting');

      // The drawn stick dramatically rises above the others
      setSticks([
        { id: 1, height: 105, rotation: -22, offsetX: -32, offsetY: -18, cinnabarRatio: 26 },
        { id: 2, height: 118, rotation: -14, offsetX: -22, offsetY: -30, cinnabarRatio: 28 },
        { id: 3, height: 126, rotation: -8, offsetX: -14, offsetY: -42, cinnabarRatio: 30 },
        { id: 4, height: 132, rotation: -3, offsetX: -6, offsetY: -58, cinnabarRatio: 32 },
        { id: 5, height: 156, rotation: 1, offsetX: 0, offsetY: -118, isWinner: true, cinnabarRatio: 36 },
        { id: 6, height: 134, rotation: 5, offsetX: 8, offsetY: -60, cinnabarRatio: 32 },
        { id: 7, height: 128, rotation: 11, offsetX: 16, offsetY: -46, cinnabarRatio: 30 },
        { id: 8, height: 120, rotation: 18, offsetX: 24, offsetY: -32, cinnabarRatio: 28 },
        { id: 9, height: 110, rotation: 25, offsetX: 34, offsetY: -20, cinnabarRatio: 26 },
      ]);

      // STEP 3: THE XĂM FALLS OUT & REVEALS AUTHENTIC I CHING PLAQUE
      setTimeout(() => {
        setPhase('fallen');
        if (soundEnabled) {
          playGong(0.45);
        }
        onStickFallen(que, hao);
      }, 950);
    }, 1350);
  };

  const handleConsultThao = () => {
    if (drawnQue !== null && drawnHao !== null) {
      onAskThao(drawnQue, drawnHao);
    } else {
      const que = Math.floor(Math.random() * 64) + 1;
      const hao = Math.floor(Math.random() * 6) + 1;
      setDrawnQue(que);
      setDrawnHao(hao);
      onAskThao(que, hao);
    }
  };

  const resetShake = () => {
    setPhase('idle');
    setDrawnQue(null);
    setDrawnHao(null);
    setSticks(initialSticks);
  };

  const drawnMeta = drawnQue ? HEXAGRAM_DATA[drawnQue] : null;
  const transformed = (drawnQue && drawnHao) ? getTransformedHexagram(drawnQue, drawnHao) : null;

  return (
    <div className="relative w-full flex flex-col items-center my-1 transition-all duration-500">
      {/* Altar Stage Frame with Traditional Vietnamese Parchment Texture */}
      <div
        className={`relative w-full transition-all duration-500 border border-[#AD8A2E]/45 p-4 sm:p-5 pt-3 bg-gradient-to-b from-[#FAF4E6] via-[#F4EBD8] to-[#ECE0C4] shadow-[0_12px_32px_rgba(46,36,21,0.18)] rounded-xs overflow-hidden ${
          isEnlarged ? 'max-w-[450px] ring-2 ring-[#B23B28]/25' : 'max-w-[400px]'
        }`}
      >
        {/* Dynamic Shake Phone Callout Banner at the top of the box when in Shaking stage */}
        <div className="mb-2">
          {phase === 'idle' ? (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#B23B28]/15 via-[#AD8A2E]/20 to-[#B23B28]/15 border border-[#B23B28]/35 rounded-xs py-1.5 px-3 flex items-center justify-center gap-2 text-center"
            >
              <Smartphone
                className={`w-4 h-4 text-[#B23B28] ${
                  shakeDetectedFeedback ? 'scale-125 rotate-12' : 'animate-bounce'
                }`}
              />
              <span className="font-sans text-xs font-bold text-[#7C2A1C] uppercase tracking-wider">
                {language === 'vi'
                  ? '📱 LẮC ĐIỆN THOẠI HOẶC BẤM NÚT ĐỂ GIEO QUẺ!'
                  : '📱 SHAKE YOUR PHONE OR CLICK TO DRAW!'}
              </span>
            </motion.div>
          ) : phase === 'shaking' ? (
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 0.4 }}
              className="bg-[#B23B28] text-white rounded-xs py-1 px-3 flex items-center justify-center gap-2 shadow-sm text-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFE599] animate-spin" />
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#FFE599]">
                {language === 'vi' ? 'ĐANG LẮC ỐNG XĂM...' : 'SHAKING BAMBOO TUBE...'}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#FFE599] animate-spin" />
            </motion.div>
          ) : null}
        </div>

        {/* Traditional Cloud & Lotus Art Watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden select-none">
          <svg className="absolute top-2 left-2 w-28 h-16 text-[#7A6444]" viewBox="0 0 120 70" fill="none" stroke="currentColor">
            <path d="M10 50 C 10 35, 25 25, 40 30 C 45 15, 65 15, 75 25 C 90 20, 105 32, 100 48 C 95 60, 75 62, 60 58 C 45 62, 20 62, 10 50 Z" strokeWidth="1.2" />
            <path d="M40 30 C 50 35, 55 45, 50 55" strokeWidth="0.8" />
            <path d="M75 25 C 78 35, 75 45, 65 52" strokeWidth="0.8" />
          </svg>
          <svg className="absolute -bottom-2 -right-2 w-32 h-28 text-[#B23B28]" viewBox="0 0 140 120" fill="currentColor">
            <path d="M70 20 C 60 45, 45 65, 30 85 C 55 90, 85 90, 110 85 C 95 65, 80 45, 70 20 Z" opacity="0.3" />
            <path d="M70 10 C 66 35, 58 55, 48 70 C 62 76, 78 76, 92 70 C 82 55, 74 35, 70 10 Z" opacity="0.4" />
          </svg>
        </div>

        {/* Traditional Corner Gold Brackets */}
        <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#AD8A2E]/60 pointer-events-none" />
        <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#AD8A2E]/60 pointer-events-none" />
        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#AD8A2E]/60 pointer-events-none" />
        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#AD8A2E]/60 pointer-events-none" />

        {/* 3D Tube & Ejected Stick Stage */}
        <div className="relative min-h-[245px] w-full flex items-end justify-center overflow-visible z-10 pt-4 pb-2">
          {/* Animated Incense Smoke Trails */}
          <div className="absolute bottom-[125px] left-1/2 -translate-x-1/2 pointer-events-none z-0">
            <svg
              className={`w-8 h-32 stroke-[#7A6444]/60 fill-none transition-opacity duration-700 ${
                phase === 'shaking' ? 'opacity-90 scale-110' : 'opacity-40'
              }`}
              viewBox="0 0 30 120"
            >
              <path
                d="M15 120 Q 8 90 22 60 T 14 0"
                strokeWidth="1.5"
                className={phase === 'shaking' ? 'animate-pulse' : ''}
              />
              <path
                d="M12 120 Q 24 80 8 40 T 17 0"
                strokeWidth="1.1"
                opacity="0.65"
              />
            </svg>
          </div>

          {/* STEP 3: THE FALLEN XĂM (THẺ XĂM RƠI RA) - AUTHENTIC I CHING PLAQUE WITH QUẺ CHỦ -> HÀO ĐỘNG -> QUẺ BIẾN */}
          <AnimatePresence>
            {phase === 'fallen' && drawnQue !== null && drawnHao !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.45, y: -10, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, y: -110, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="absolute z-30 flex flex-col items-center w-[92%] max-w-[340px]"
              >
                {/* Traditional Wooden Plaque with Cinnabar Header and Gold Foil Inlay */}
                <div className="relative w-full flex flex-col items-center bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E3] to-[#F1DFC0] border-2 border-[#B23B28] p-3.5 rounded-xs shadow-[0_16px_36px_rgba(178,59,40,0.36),0_4px_12px_rgba(0,0,0,0.15)]">
                  {/* Top Red Cinnabar Cap with Auspicious Gold Rivet */}
                  <div className="w-14 h-2.5 bg-gradient-to-r from-[#9C2C1E] via-[#C8402C] to-[#9C2C1E] rounded-t-xs -mt-4 mb-1.5 border border-[#7C2A1C] flex items-center justify-center shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFE599]" />
                  </div>

                  {/* Auspicious Badge Header */}
                  <div className="flex items-center gap-1.5 text-[0.68rem] tracking-[0.2em] uppercase font-sans text-[#AD8A2E] font-extrabold mb-1">
                    <Sparkles className="w-3 h-3 text-[#B23B28]" />
                    <span>{language === 'vi' ? 'THẺ XĂM ĐÃ RƠI RA' : 'THE STICK HAS FALLEN'}</span>
                    <Sparkles className="w-3 h-3 text-[#B23B28]" />
                  </div>

                  {/* Main Primary Hexagram Title */}
                  <div className="font-serif italic text-2xl sm:text-3xl font-bold text-[#7C2A1C] whitespace-nowrap tracking-tight text-center">
                    {language === 'vi' ? `Quẻ Số ${drawnQue}` : `Hexagram #${drawnQue}`}
                  </div>

                  {/* Quẻ Chủ Name */}
                  <div className="font-serif font-bold text-sm sm:text-base text-[#2E2415] text-center mt-0.5 mb-1.5">
                    {language === 'vi' ? drawnMeta?.vietnameseName : `Hexagram ${drawnQue} (${drawnMeta?.chinese})`}
                  </div>

                  {/* The Authentic 3-Step Transformation Plaque (Quẻ Chủ -> Hào Động -> Quẻ Biến) */}
                  <div className="w-full bg-[#EFE4CB]/85 border border-[#AD8A2E]/35 rounded-xs p-2 my-1 text-xs font-sans">
                    <div className="flex items-center justify-between text-[#6E5C3E] font-medium border-b border-[#AD8A2E]/20 pb-1 mb-1">
                      <span className="text-[#7C2A1C] font-bold">
                        {language === 'vi' ? '① Quẻ Chủ (Gốc)' : '① Primary Que'}
                      </span>
                      <span className="text-[#2E2415] font-semibold">#{drawnQue}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#6E5C3E] font-medium border-b border-[#AD8A2E]/20 pb-1 mb-1">
                      <span className="text-[#B23B28] font-bold flex items-center gap-1">
                        <span>⚡</span>
                        {language === 'vi' ? `② Hào Động Số ${drawnHao}` : `② Active Line ${drawnHao}`}
                      </span>
                      <span className="text-[#B23B28] font-bold">
                        {transformed?.wasSolid ? '⚊ Dương ➔ ⚋ Âm' : '⚋ Âm ➔ ⚊ Dương'}
                      </span>
                    </div>

                    {transformed && (
                      <div className="flex items-center justify-between text-[#6E5C3E] font-medium pt-0.5">
                        <span className="text-[#2E7D32] font-bold">
                          {language === 'vi' ? '③ Biến Thành Quẻ' : '③ Resulting Que'}
                        </span>
                        <span className="text-[#1B5E20] font-bold">
                          #{transformed.number} {language === 'vi' ? transformed.meta.vietnameseName.split(' ')[0] + ' ' + transformed.meta.vietnameseName.split(' ')[1] : `Hex ${transformed.number}`}
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

          {/* Bamboo Sticks Inside Cylinder */}
          <div className="absolute top-[28px] left-1/2 -translate-x-1/2 flex justify-center z-10 pointer-events-none">
            {sticks.map((stick) => (
              <motion.div
                key={stick.id}
                animate={{
                  y: stick.offsetY,
                  x: stick.offsetX,
                  rotate: stick.rotation,
                  scale: stick.isWinner && phase === 'fallen' ? 1.2 : 1,
                }}
                transition={{
                  type: 'spring',
                  stiffness: phase === 'shaking' ? 400 : 240,
                  damping: 15,
                }}
                style={{ height: `${stick.height}px` }}
                className={`w-[7px] mx-[1px] rounded-t-sm rounded-b-xs border-[0.5px] border-[#4A3B22]/40 relative shadow-sm ${
                  stick.isWinner && phase === 'fallen'
                    ? 'bg-gradient-to-b from-[#C8402C] via-[#E9CE84] to-[#C9B98F] shadow-[0_0_18px_rgba(200,64,44,0.85)]'
                    : 'bg-gradient-to-b from-[#EFE5CE] via-[#DECBA0] to-[#BFA878]'
                }`}
              >
                {/* Natural Bamboo Wood Grain Texture */}
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(70,50,20,0.3) 50%, transparent 100%)',
                  }}
                />

                {/* Dipped Traditional Cinnabar Red Cap */}
                <div
                  style={{ height: `${stick.cinnabarRatio || 30}%` }}
                  className={`w-full rounded-t-sm shadow-inner transition-colors duration-300 ${
                    stick.isWinner && phase === 'fallen'
                      ? 'bg-gradient-to-b from-[#D32F2F] to-[#8E0000]'
                      : 'bg-gradient-to-b from-[#B23B28] to-[#7C2A1C]'
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Silk Altar Mat Underneath Tube */}
          <div className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[160px] h-[18px] bg-gradient-to-r from-[#7C2A1C]/20 via-[#B23B28]/40 to-[#7C2A1C]/20 rounded-full blur-[2px] pointer-events-none z-0" />

          {/* AUTHENTIC VIETNAMESE BAMBOO & ROSEWOOD FORTUNE TUBE (ỐNG XĂM CỔ TRUYỀN) */}
          <motion.div
            animate={
              phase === 'shaking'
                ? {
                    rotate: [0, -12, 11, -9, 10, -7, 0],
                    x: [0, -8, 8, -6, 7, -4, 0],
                    y: [0, -5, 4, -6, 4, -2, 0],
                  }
                : { rotate: 0, x: 0, y: 0 }
            }
            transition={
              phase === 'shaking'
                ? { repeat: Infinity, duration: 0.28, ease: 'easeInOut' }
                : { duration: 0.3 }
            }
            className="relative w-[112px] h-[178px] z-20 overflow-visible"
          >
            {/* Hanging Traditional Red Silk Tassel / Cát Tường Knot on Left */}
            <div className="absolute top-[48px] -left-[14px] pointer-events-none z-30 flex flex-col items-center">
              {/* Chinese / Vietnamese Knot */}
              <div className="w-3.5 h-3.5 bg-[#B23B28] rotate-45 border border-[#FFE599]/80 shadow-sm" />
              {/* Gold bead */}
              <div className="w-2 h-2 rounded-full bg-[#E5C368] -mt-0.5 shadow-sm" />
              {/* Silk Red Tassel */}
              <div className="w-1.5 h-12 bg-gradient-to-b from-[#B23B28] via-[#C8402C] to-[#7C2A1C] rounded-b-full shadow-md" />
            </div>

            {/* Cylinder Outer Body with Polished Aged Bamboo & Lacquer Sheen */}
            <div
              className="relative w-full h-full rounded-t-[14px] rounded-b-[18px] shadow-[0_20px_35px_rgba(0,0,0,0.55),inset_0_0_0_1px_rgba(255,230,150,0.22)] overflow-hidden border border-[#2D1B0D]"
              style={{
                background: `
                  linear-gradient(108deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 25%, transparent 40%, rgba(0,0,0,0.5) 85%, rgba(0,0,0,0.8) 100%),
                  repeating-linear-gradient(90deg, rgba(45,25,10,0.18) 0px, rgba(45,25,10,0.18) 1px, transparent 1px, transparent 8px),
                  linear-gradient(180deg, #B83A26 0%, #8C2518 45%, #56140B 85%, #2B0803 100%)
                `,
              }}
            >
              {/* Top Rim Deep Opening Inset */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-[#180A04] via-[#38160B] to-transparent z-10" />

              {/* Upper Antique Brass Hoop */}
              <div className="absolute top-[16px] left-0 right-0 h-[8px] bg-gradient-to-b from-[#F3D78A] via-[#C99C3B] to-[#7A5B18] border-y border-[#381E0B] shadow-sm z-10 flex items-center justify-around px-2">
                <div className="w-1 h-1 rounded-full bg-[#381E0B]/60" />
                <div className="w-1 h-1 rounded-full bg-[#381E0B]/60" />
                <div className="w-1 h-1 rounded-full bg-[#381E0B]/60" />
              </div>

              {/* Classical Cloud Fretwork Band */}
              <div className="absolute top-[28px] left-0 right-0 h-[10px] opacity-80 z-10">
                <svg className="w-full h-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path
                    d="M0 5 H10 V0 H20 V5 H30 V0 H40 V5 H50 V0 H60 V5 H70 V0 H80 V5 H90 V0 H100"
                    fill="none"
                    stroke="#F3D78A"
                    strokeWidth="1.3"
                  />
                </svg>
              </div>

              {/* Center Traditional Taiji & Bagua Medallion (Mặt Nguyệt Bát Quái Cổ) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-13 h-13 rounded-full border-2 border-[#F3D78A]/90 flex items-center justify-center bg-gradient-to-br from-[#3D140D] to-[#1A0604] shadow-[0_2px_10px_rgba(0,0,0,0.6),inset_0_1px_3px_rgba(243,215,138,0.4)] z-10">
                <svg className="w-9 h-9" viewBox="0 0 36 36">
                  {/* Outer circle */}
                  <circle cx="18" cy="18" r="16.5" fill="none" stroke="#F3D78A" strokeWidth="1.2" strokeDasharray="2.5 1.5" />
                  {/* Yin-Yang swirl */}
                  <circle cx="18" cy="18" r="14" fill="#200A06" />
                  <path d="M18 4 A 14 14 0 0 0 18 32 A 7 7 0 0 1 18 18 A 7 7 0 0 0 18 4" fill="#F3D78A" opacity="0.92" />
                  <circle cx="18" cy="11" r="2.2" fill="#200A06" />
                  <circle cx="18" cy="25" r="2.2" fill="#F3D78A" />
                </svg>
              </div>

              {/* Lower Greek Key / Fretwork Band */}
              <div className="absolute bottom-[34px] left-0 right-0 h-[10px] opacity-80 z-10">
                <svg className="w-full h-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path
                    d="M0 5 H10 V10 H20 V5 H30 V10 H40 V5 H50 V10 H60 V5 H70 V10 H80 V5 H90 V10 H100"
                    fill="none"
                    stroke="#F3D78A"
                    strokeWidth="1.3"
                  />
                </svg>
              </div>

              {/* Lower Antique Brass Hoop */}
              <div className="absolute bottom-[20px] left-0 right-0 h-[8px] bg-gradient-to-b from-[#F3D78A] via-[#C99C3B] to-[#7A5B18] border-y border-[#381E0B] shadow-sm z-10 flex items-center justify-around px-2">
                <div className="w-1 h-1 rounded-full bg-[#381E0B]/60" />
                <div className="w-1 h-1 rounded-full bg-[#381E0B]/60" />
                <div className="w-1 h-1 rounded-full bg-[#381E0B]/60" />
              </div>

              {/* Heavy Carved Dark Rosewood Base Ring */}
              <div className="absolute bottom-0 left-0 right-0 h-[14px] bg-gradient-to-b from-[#38180E] via-[#200A06] to-[#0E0301] border-t border-[#F3D78A]/40" />
            </div>
          </motion.div>
        </div>

        {/* Guidance Prompt & Shake Status */}
        <div className="text-center font-serif italic text-xs sm:text-sm text-[#6E5C3E] min-h-[1.5rem] mt-3 mb-1">
          {phase === 'shaking' && (language === 'vi' ? 'Đang lắc ống xăm linh nghiệm...' : 'Shaking the bamboo tube...')}
          {phase === 'ejecting' && (language === 'vi' ? 'Thẻ xăm đang nhô ra...' : 'The fortune stick is rising...')}
          {phase === 'fallen' && (
            <span className="text-[#7C2A1C] font-semibold">
              {language === 'vi'
                ? 'Thẻ xăm đã rơi ra! Mời bạn bấm Hỏi Thảo để nhận lời giải quẻ.'
                : 'The stick has fallen out! Click Ask Thao to receive her reading.'}
            </span>
          )}
          {phase === 'idle' && (
            <div className="flex items-center justify-center gap-1.5">
              <Smartphone className={`w-3.5 h-3.5 text-[#B23B28] ${shakeDetectedFeedback ? 'animate-bounce' : 'animate-pulse'}`} />
              <span>
                {language === 'vi'
                  ? 'Lắc ống xăm (hoặc lắc điện thoại) để gieo quẻ'
                  : 'Shake the bamboo tube (or shake phone) to draw'}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons Area */}
        <div className="flex flex-col gap-2 justify-center items-center mt-2 z-20 relative">
          {/* STEP 4: LADY THAO APPEARS BUTTON (Active after stick falls out) */}
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
                <span>{language === 'vi' ? '✨ HỎI THẢO (DIỆN KIẾN LUẬN QUẺ)' : '✨ ASK THAO (CONSULT READING)'}</span>
                <ArrowRight className="w-4 h-4 text-[#E9CE84]" />
              </button>

              {/* Re-shake option */}
              <button
                type="button"
                onClick={resetShake}
                className="w-full py-1.5 rounded-xs text-xs font-sans text-[#6E5C3E] hover:text-[#2E2415] transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{language === 'vi' ? 'Gieo lại xăm khác' : 'Shake again for another stick'}</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col sm:flex-row gap-2 justify-center items-center">
              {/* STEP 2 BUTTON: SHAKE WOODEN STICKS BOX */}
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
                    ? language === 'vi'
                      ? 'Lắc Ống Xăm Xin Quẻ'
                      : 'Shake Bamboo Sticks Tube'
                    : language === 'vi'
                    ? 'Đang Lắc Ống Xăm...'
                    : 'Shaking Bamboo Tube...'}
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
              <span>{language === 'vi' ? 'Bật cảm biến lắc điện thoại (iOS)' : 'Enable phone shake (iOS)'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
