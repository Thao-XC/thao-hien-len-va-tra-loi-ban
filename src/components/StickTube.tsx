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

  // Dense vertical bundle of authentic fortune sticks packed inside the cylinder opening
  const initialSticks: StickState[] = [
    // Back & Middle Layer (taller, densely packed parallel sticks)
    { id: 1, height: 132, rotation: -3, offsetX: -34, offsetY: -38, cinnabarRatio: 55 },
    { id: 2, height: 138, rotation: -2, offsetX: -29, offsetY: -42, cinnabarRatio: 58 },
    { id: 3, height: 144, rotation: -1, offsetX: -24, offsetY: -46, cinnabarRatio: 60 },
    { id: 4, height: 148, rotation: -1, offsetX: -19, offsetY: -49, cinnabarRatio: 62 },
    { id: 5, height: 152, rotation: 0, offsetX: -14, offsetY: -52, cinnabarRatio: 64 },
    { id: 6, height: 155, rotation: 0, offsetX: -9, offsetY: -54, cinnabarRatio: 65 },
    { id: 7, height: 156, rotation: 0, offsetX: -4, offsetY: -55, cinnabarRatio: 65 },
    { id: 8, height: 156, rotation: 0, offsetX: 1, offsetY: -55, cinnabarRatio: 65 },
    { id: 9, height: 155, rotation: 0, offsetX: 6, offsetY: -54, cinnabarRatio: 65 },
    { id: 10, height: 152, rotation: 1, offsetX: 11, offsetY: -52, cinnabarRatio: 64 },
    { id: 11, height: 148, rotation: 1, offsetX: 16, offsetY: -49, cinnabarRatio: 62 },
    { id: 12, height: 144, rotation: 1, offsetX: 21, offsetY: -46, cinnabarRatio: 60 },
    { id: 13, height: 138, rotation: 2, offsetX: 26, offsetY: -42, cinnabarRatio: 58 },
    { id: 14, height: 132, rotation: 3, offsetX: 31, offsetY: -38, cinnabarRatio: 55 },
    // Front staggered layer
    { id: 15, height: 136, rotation: -1.5, offsetX: -21, offsetY: -40, cinnabarRatio: 58 },
    { id: 16, height: 142, rotation: -0.5, offsetX: -11, offsetY: -45, cinnabarRatio: 62 },
    { id: 17, height: 145, rotation: 0, offsetX: -1, offsetY: -48, cinnabarRatio: 64 },
    { id: 18, height: 142, rotation: 0.5, offsetX: 9, offsetY: -45, cinnabarRatio: 62 },
    { id: 19, height: 136, rotation: 1.5, offsetX: 19, offsetY: -40, cinnabarRatio: 58 },
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
      setSticks((prev) =>
        prev.map((s) =>
          s.id === 10
            ? { ...s, offsetY: -125, isWinner: true }
            : { ...s, offsetY: s.offsetY + (Math.random() * 8 - 4) }
        )
      );

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

          {/* 3D TUBE & STICKS STAGE */}
          <div className="relative min-h-[260px] w-full flex items-end justify-center overflow-visible z-10 pt-4 pb-2">
            {/* Animated Incense Smoke Trails */}
            <div className="absolute bottom-[140px] left-1/2 -translate-x-1/2 pointer-events-none z-0">
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

            {/* Silk Altar Mat Underneath Tube */}
            <div className="absolute bottom-[0px] left-1/2 -translate-x-1/2 w-[180px] h-[22px] bg-gradient-to-r from-[#7C2A1C]/25 via-[#B23B28]/45 to-[#7C2A1C]/25 rounded-full blur-[2px] pointer-events-none z-0" />

            {/* THE COMPLETE 3D BAMBOO TUBE (ỐNG XĂM) CONTAINER WITH PROPER INSIDE CAVITY & FRONT/BACK LAYERING */}
            <motion.div
              animate={
                phase === 'shaking'
                  ? {
                      rotate: [0, -14, 13, -11, 12, -8, 7, 0],
                      x: [0, -9, 9, -7, 8, -5, 4, 0],
                      y: [0, -5, 4, -6, 5, -2, 2, 0],
                    }
                  : { rotate: 0, x: 0, y: 0 }
              }
              transition={
                phase === 'shaking'
                  ? { repeat: Infinity, duration: 0.3, ease: 'easeInOut' }
                  : { duration: 0.35 }
              }
              className="relative w-[124px] h-[195px] overflow-visible flex items-end justify-center z-10"
            >
              {/* Hanging Traditional Red Silk Tassel / Cát Tường Knot on Left */}
              <div className="absolute top-[52px] -left-[15px] pointer-events-none z-30 flex flex-col items-center">
                <div className="w-3.5 h-3.5 bg-[#B23B28] rotate-45 border border-[#FFE599]/80 shadow-sm" />
                <div className="w-2 h-2 rounded-full bg-[#E5C368] -mt-0.5 shadow-sm" />
                <div className="w-1.5 h-12 bg-gradient-to-b from-[#B23B28] via-[#C8402C] to-[#7C2A1C] rounded-b-full shadow-md" />
              </div>

              {/* 1. BACK INTERIOR WALL & CAVITY OF TUBE (z-index: 5) */}
              <div className="absolute inset-0 z-5 flex flex-col items-center pointer-events-none">
                {/* Top Back Rim of the Opening */}
                <div className="w-[116px] h-[22px] rounded-[50%] bg-[#120502] border-t-2 border-[#38160B] shadow-inner" />
                {/* Dark Inner Hollow Space */}
                <div className="w-[108px] h-[168px] -mt-[11px] rounded-b-[14px] bg-gradient-to-b from-[#180703] via-[#2A0F07] to-[#120502] shadow-[inset_0_12px_24px_rgba(0,0,0,0.9)]" />
              </div>

              {/* 2. BAMBOO STICKS RESTING INSIDE THE TUBE (z-index: 15 - Between Back Wall and Front Wall) */}
              <div className="absolute top-[0px] left-1/2 -translate-x-1/2 z-15 flex justify-center items-end pointer-events-none w-[100px] h-[175px] overflow-visible">
                {sticks.map((stick) => {
                  const isEjectingWinner = stick.isWinner && (phase === 'ejecting' || phase === 'fallen');
                  return (
                    <motion.div
                      key={stick.id}
                      animate={
                        phase === 'shaking'
                          ? {
                              y: [stick.offsetY, stick.offsetY - 26, stick.offsetY + 3, stick.offsetY - 18, stick.offsetY],
                              x: stick.offsetX + (Math.random() * 3 - 1.5),
                              rotate: stick.rotation + (Math.random() * 2 - 1),
                            }
                          : isEjectingWinner
                          ? {
                              y: -115,
                              x: stick.offsetX,
                              rotate: stick.rotation * 0.5,
                              scale: 1.06,
                            }
                          : {
                              y: stick.offsetY,
                              x: stick.offsetX,
                              rotate: stick.rotation,
                              scale: 1,
                            }
                      }
                      transition={
                        phase === 'shaking'
                          ? { repeat: Infinity, duration: 0.26, ease: 'easeInOut' }
                          : { type: 'spring', stiffness: 280, damping: 18 }
                      }
                      style={{
                        height: `${stick.height + 45}px`,
                        clipPath: 'polygon(50% 0%, 100% 7px, 100% 100%, 0% 100%, 0% 7px)',
                      }}
                      className={`w-[7.8px] mx-[0.5px] border-x-[0.5px] border-[#2A0F07]/70 relative shadow-sm flex-shrink-0 ${
                        isEjectingWinner
                          ? 'bg-gradient-to-b from-[#C62828] via-[#E53935] to-[#B71C1C] shadow-[0_0_16px_rgba(255,215,0,0.9)] ring-1 ring-[#FFE599]'
                          : 'bg-gradient-to-b from-[#8E0000] via-[#C62828] to-[#DECBA0]'
                      }`}
                    >
                      {/* Rich Traditional Red Cinnabar Lacquer (Son Son Thếp Vàng) */}
                      <div
                        style={{ height: `${stick.cinnabarRatio || 60}%` }}
                        className={`w-full relative shadow-inner ${
                          isEjectingWinner
                            ? 'bg-gradient-to-b from-[#E53935] via-[#C62828] to-[#8E0000]'
                            : 'bg-gradient-to-b from-[#B71C1C] via-[#C62828] to-[#7F0000]'
                        }`}
                      >
                        {/* High-gloss vertical lacquer reflection */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-transparent to-black/20" />
                        
                        {/* Gold accent dot on winner stick */}
                        {isEjectingWinner && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FFE599] mx-auto mt-2.5 shadow-sm border border-[#AD8A2E]" />
                        )}
                      </div>

                      {/* Natural Aged Bamboo Body at bottom */}
                      <div className="w-full h-full bg-gradient-to-b from-[#DECBA0] to-[#A89467] border-t border-[#AD8A2E]/40 relative">
                        <div
                          className="absolute inset-0 opacity-35 pointer-events-none"
                          style={{
                            backgroundImage:
                              'linear-gradient(90deg, transparent 0%, rgba(70,50,20,0.4) 50%, transparent 100%)',
                          }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* 3. FRONT HALF OF BAMBOO TUBE (z-index: 25 - Visibly covers lower half of sticks) */}
              <div className="relative w-full z-25 flex flex-col items-center pointer-events-none">
                {/* Front Lip / Opening Rim Rim (Gờ miệng ống xăm) */}
                <div
                  className="w-[124px] h-[22px] rounded-[50%] border-t border-[#F3D78A]/60 shadow-md -mb-[11px] relative z-2"
                  style={{
                    background: 'linear-gradient(180deg, #A83321 0%, #7C2416 60%, #4D140B 100%)',
                  }}
                >
                  <div className="w-full h-full rounded-[50%] border border-[#FFE599]/30" />
                </div>

                {/* Front Cylinder Body */}
                <div
                  className="w-full h-[174px] rounded-b-[18px] shadow-[0_22px_38px_rgba(0,0,0,0.65),inset_0_0_0_1px_rgba(255,230,150,0.22)] overflow-hidden border-x border-b border-[#2D1B0D] relative"
                  style={{
                    background: `
                      linear-gradient(108deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.06) 25%, transparent 42%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.75) 100%),
                      repeating-linear-gradient(90deg, rgba(45,25,10,0.16) 0px, rgba(45,25,10,0.16) 1px, transparent 1px, transparent 8px),
                      linear-gradient(180deg, #B83A26 0%, #8C2518 45%, #56140B 85%, #2B0803 100%)
                    `,
                  }}
                >
                  {/* Upper Antique Brass Hoop */}
                  <div className="absolute top-[14px] left-0 right-0 h-[8px] bg-gradient-to-b from-[#F3D78A] via-[#C99C3B] to-[#7A5B18] border-y border-[#381E0B] shadow-sm z-10 flex items-center justify-around px-2">
                    <div className="w-1 h-1 rounded-full bg-[#381E0B]/60" />
                    <div className="w-1 h-1 rounded-full bg-[#381E0B]/60" />
                    <div className="w-1 h-1 rounded-full bg-[#381E0B]/60" />
                  </div>

                  {/* Classical Cloud Fretwork Band */}
                  <div className="absolute top-[26px] left-0 right-0 h-[9px] opacity-80 z-10">
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
                      <circle cx="18" cy="18" r="16.5" fill="none" stroke="#F3D78A" strokeWidth="1.2" strokeDasharray="2.5 1.5" />
                      <circle cx="18" cy="18" r="14" fill="#200A06" />
                      <path d="M18 4 A 14 14 0 0 0 18 32 A 7 7 0 0 1 18 18 A 7 7 0 0 0 18 4" fill="#F3D78A" opacity="0.92" />
                      <circle cx="18" cy="11" r="2.2" fill="#200A06" />
                      <circle cx="18" cy="25" r="2.2" fill="#F3D78A" />
                    </svg>
                  </div>

                  {/* Lower Greek Key / Fretwork Band */}
                  <div className="absolute bottom-[32px] left-0 right-0 h-[9px] opacity-80 z-10">
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
                  <div className="absolute bottom-[18px] left-0 right-0 h-[8px] bg-gradient-to-b from-[#F3D78A] via-[#C99C3B] to-[#7A5B18] border-y border-[#381E0B] shadow-sm z-10 flex items-center justify-around px-2">
                    <div className="w-1 h-1 rounded-full bg-[#381E0B]/60" />
                    <div className="w-1 h-1 rounded-full bg-[#381E0B]/60" />
                    <div className="w-1 h-1 rounded-full bg-[#381E0B]/60" />
                  </div>

                  {/* Heavy Carved Dark Rosewood Base Ring */}
                  <div className="absolute bottom-0 left-0 right-0 h-[14px] bg-gradient-to-b from-[#38180E] via-[#200A06] to-[#0E0301] border-t border-[#F3D78A]/40" />
                </div>
              </div>
            </motion.div>

            {/* 4. THE FALLEN XĂM (THẺ XĂM RƠI RA TRƯỚC HỘP TRÊN BÀN) & I CHING PLAQUE (z-index: 40) */}
            <AnimatePresence>
              {phase === 'fallen' && drawnQue !== null && drawnHao !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: -20, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, y: -105, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  className="absolute z-40 flex flex-col items-center w-[94%] max-w-[350px]"
                >
                  {/* The Physical Wooden Stick That Has Fallen Out in Front of the Box */}
                  <motion.div
                    initial={{ y: -30, rotate: -25, opacity: 0 }}
                    animate={{ y: 0, rotate: -8, opacity: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 16 }}
                    className="w-[200px] h-[14px] bg-gradient-to-r from-[#B23B28] via-[#E8D4A2] to-[#BFA878] rounded-full border border-[#4A3B22] shadow-[0_8px_18px_rgba(0,0,0,0.45)] mb-2 flex items-center justify-between px-3 relative"
                  >
                    <div className="w-5 h-full bg-[#9C2C1E] -ml-3 rounded-l-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FFE599]" />
                    </div>
                    <span className="font-serif italic font-bold text-[0.72rem] text-[#4A3B22] tracking-wider">
                      {language === 'vi' ? `THẺ XĂM QUẺ #${drawnQue} · HÀO ${drawnHao}` : `STICK #${drawnQue} · LINE ${drawnHao}`}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-[#B23B28]/40" />
                  </motion.div>

                  {/* Traditional Wooden Plaque with Cinnabar Header and Gold Foil Inlay */}
                  <div className="relative w-full flex flex-col items-center bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E3] to-[#F1DFC0] border-2 border-[#B23B28] p-3.5 rounded-xs shadow-[0_18px_40px_rgba(178,59,40,0.4),0_6px_16px_rgba(0,0,0,0.18)]">
                    {/* Auspicious Badge Header */}
                    <div className="flex items-center gap-1.5 text-[0.68rem] tracking-[0.2em] uppercase font-sans text-[#AD8A2E] font-extrabold mb-1">
                      <Sparkles className="w-3 h-3 text-[#B23B28]" />
                      <span>{language === 'vi' ? 'THẺ XĂM ĐÃ RƠI RA KHỎI ỐNG' : 'THE STICK HAS FALLEN OUT'}</span>
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
