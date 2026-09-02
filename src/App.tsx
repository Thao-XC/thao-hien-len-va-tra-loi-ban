import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ParchmentFrame } from './components/ParchmentFrame';
import { LadyThaoAvatar } from './components/LadyThaoAvatar';
import { ThaoPortrait } from './components/ThaoPortrait';
import { StickTube } from './components/StickTube';
import { HexagramVisualizer } from './components/HexagramVisualizer';
import { OracleChat } from './components/OracleChat';
import { HexagramCodexModal } from './components/HexagramCodexModal';
import { BatQuaiIcon } from './components/BatQuaiIcon';
import { TraditionalCurtain } from './components/TraditionalCurtain';
import { HexagramDataset, Hexagram } from './types';
import localHexagrams from './hexagrams.json' with { type: 'json' };
import { Volume2, VolumeX, BookOpen, Sparkles, ArrowLeft, RefreshCw, Flame, DoorOpen } from 'lucide-react';
import { HEXAGRAM_DATA } from './utils/hexagramPatterns';
import { VIETNAMESE_HEXAGRAMS } from './data/vietnameseHexagrams';
import { playGong } from './utils/audio';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [dataset, setDataset] = useState<HexagramDataset>(localHexagrams as HexagramDataset);

  // FLOW STATE:
  // 1/ User asks question in Lady Thao's Temple Sạp Bói
  // 2/ Shake the wooden sticks box
  // 3/ The xăm falls out and shows the wooden stick
  // 4/ Traditional Curtain opens -> Lady Thao appears with folklore clouds and delivers AI interpretation
  const [question, setQuestion] = useState<string>('');
  const [fallenQue, setFallenQue] = useState<number | null>(null);
  const [fallenHao, setFallenHao] = useState<number | null>(null);
  const [isThaoAppeared, setIsThaoAppeared] = useState<boolean>(false);
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);

  // Traditional Curtain Window Opening Effect State
  const [showCurtain, setShowCurtain] = useState<boolean>(false);
  const [curtainOpen, setCurtainOpen] = useState<boolean>(false);

  // Load backend dataset if available
  useEffect(() => {
    fetch('/api/hexagrams')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setDataset(data);
        }
      })
      .catch(() => {
        // Fallback to local imported dataset
      });
  }, []);

  const triggerCurtainReveal = () => {
    setShowCurtain(true);
    setCurtainOpen(false);
    if (soundEnabled) {
      playGong(0.45);
    }
    // Trigger opening animation smoothly after slight beat
    setTimeout(() => {
      setCurtainOpen(true);
    }, 120);
  };

  // Step 3 callback: The stick has fallen out of the box
  const handleStickFallen = (que: number, hao: number) => {
    setFallenQue(que);
    setFallenHao(hao);
  };

  // Step 4 callback: User clicks "DIỆN KIẾN CÔ THẢO" -> Traditional curtain opens & Lady Thao appears!
  const handleAskThao = (que: number, hao: number) => {
    setFallenQue(que);
    setFallenHao(hao);
    setIsThaoAppeared(true);
    triggerCurtainReveal();
  };

  const handleReset = () => {
    setFallenQue(null);
    setFallenHao(null);
    setIsThaoAppeared(false);
    setQuestion('');
    setShowCurtain(false);
    setCurtainOpen(false);
  };

  const handleSelectFromCodex = (que: number) => {
    const defaultHao = 1;
    setFallenQue(que);
    setFallenHao(defaultHao);
    setIsThaoAppeared(true);
    if (!question) {
      setQuestion('Ý nghĩa tổng quan và lời khuyên quẻ này cho tôi là gì?');
    }
    triggerCurtainReveal();
  };

  const sampleQuestions = [
    'Dự án công việc sắp tới có thuận buồm xuôi gió không?',
    'Chuyện tình duyên và tình cảm sắp tới thế nào?',
    'Tôi nên quyết định đổi mới hay kiên trì hướng đi cũ?',
    'Lời khuyên cho việc tài lộc, đầu tư và sự nghiệp?',
  ];

  const currentHexagram: Hexagram | null = fallenQue ? dataset[String(fallenQue)] : null;
  const currentViet = fallenQue ? VIETNAMESE_HEXAGRAMS[fallenQue] : null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-3 px-3 sm:px-6 relative overflow-x-hidden bg-[#F4EAD4]">
      {/* Atmospheric Traditional Sạp Bói Temple / Divination Room Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Sạp Bói Room Image Backdrop with Fallback */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 opacity-30 sm:opacity-35 scale-105"
          style={{
            backgroundImage: `url('/sap_boi_room.jpg'), url('/sap_boi_anime.jpg')`,
          }}
        />
        {/* Warm Amber & Crimson Temple Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A0E0A]/40 via-[#F4EAD4]/80 to-[#1C0D0A]/70 mix-blend-multiply" />
        {/* Soft Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,235,180,0.35)_0%,rgba(42,14,10,0.6)_100%)]" />

        {/* Floating Auspicious Incense Sparks */}
        <div className="absolute inset-0 bg-[radial-gradient(#FFE082_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

        {/* Traditional Auspicious Floating Clouds Left */}
        <svg className="absolute top-20 -left-10 w-64 h-36 text-[#AD8A2E] animate-cloud-drift opacity-40" viewBox="0 0 160 90" fill="none" stroke="currentColor">
          <path d="M10 60 C 10 40, 30 30, 50 35 C 60 15, 90 15, 105 28 C 125 20, 145 35, 140 55 C 135 70, 105 72, 85 68 C 65 72, 30 72, 10 60 Z" strokeWidth="1.2" />
          <path d="M50 35 C 65 42, 70 55, 65 65" strokeWidth="0.8" />
          <path d="M105 28 C 110 40, 105 52, 95 60" strokeWidth="0.8" />
        </svg>

        {/* Traditional Floating Clouds Right */}
        <svg className="absolute top-48 -right-10 w-72 h-40 text-[#AD8A2E] opacity-35" viewBox="0 0 160 90" fill="none" stroke="currentColor">
          <path d="M10 60 C 10 40, 30 30, 50 35 C 60 15, 90 15, 105 28 C 125 20, 145 35, 140 55 C 135 70, 105 72, 85 68 C 65 72, 30 72, 10 60 Z" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Top App Bar */}
      <header className={`w-full ${isThaoAppeared ? 'max-w-3xl' : 'max-w-xl'} flex items-center justify-between py-2 px-1 mb-1 z-30 relative transition-all duration-500`}>
        {/* Sạp Bói Brand Badge with Rotating Bát Quái Magic Circle & Cô Thảo Avatar */}
        <div className="flex items-center gap-2">
          <BatQuaiIcon size={32} animate={true} className="border border-[#E9CE84] shadow-xs" />
          <LadyThaoAvatar sizeClassName="w-8 h-8 sm:w-9 sm:h-9" animate={true} />
          <span className="font-serif italic font-bold text-base sm:text-lg text-[#7C2A1C] tracking-tight flex items-center gap-1.5">
            <span>Sạp Bói Cô Thảo</span>
            <span className="text-xs text-[#FF9EAA]">🌸</span>
          </span>
        </div>

        {/* Top Utility Controls */}
        <div className="flex items-center gap-2">
          {/* Instructions & 64 Hexagrams Codex Button */}
          <button
            type="button"
            id="open-codex-button"
            onClick={() => setIsCodexOpen(true)}
            className="px-2.5 py-1 rounded-xs bg-[#EFE4CB]/90 hover:bg-[#EFE4CB] border border-[#AD8A2E]/50 text-[#7C2A1C] hover:text-[#B23B28] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs font-sans text-xs font-semibold"
            title="Hướng dẫn xin quẻ & Sổ 64 Quẻ Kinh Dịch"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#B23B28]" />
            <span className="inline">Sổ 64 Quẻ</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            id="toggle-sound-button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-xs bg-[#EFE4CB]/80 hover:bg-[#EFE4CB] border border-[#AD8A2E]/40 text-[#6E5C3E] transition-colors cursor-pointer"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
          </button>
        </div>
      </header>

      {/* Main Authentic Vietnamese Sạp Bói Container */}
      <ParchmentFrame maxWidthClassName={`w-full ${isThaoAppeared ? 'max-w-3xl' : 'max-w-xl'} transition-all duration-500`}>
        {/* =========================================================================
            SCREEN 1: THE FOLKLORE TEMPLE SẠP BÓI & BAMBOO TUBE SHAKING
           ========================================================================= */}
        {!isThaoAppeared && (
          <div className="space-y-4">
            {/* Sạp Bói Header & Temple Entrance Banner */}
            <div className="text-center relative pb-2 border-b border-[#AD8A2E]/30">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#B23B28]/10 text-[#7C2A1C] text-xs font-sans font-bold uppercase tracking-wider mb-1 border border-[#B23B28]/20">
                <Sparkles className="w-3 h-3 text-[#B23B28]" />
                <span>KINH DỊCH CỔ TRUYỀN · 64 QUẺ</span>
                <Sparkles className="w-3 h-3 text-[#B23B28]" />
              </div>

              <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#7C2A1C] tracking-tight">
                Sạp Bói Cô Thảo
              </h1>

              {/* Catchphrase */}
              <p className="font-serif text-xs sm:text-sm text-[#4A3B22] mt-1 italic">
                "🌸 Tại sao con khóc? Đừng lo, hãy để Thảo xem quẻ giúp bạn."
              </p>
            </div>

            {/* CÔ THẢO WELCOMING AVATAR & DIALOGUE AT SẠP BÓI ENTRANCE */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 bg-gradient-to-r from-[#FFFDF8] via-[#FAF3E3] to-[#F5E8D0] p-3.5 sm:p-4 rounded-xs border border-[#AD8A2E]/50 shadow-xs relative overflow-hidden">
              {/* Corner Accents */}
              <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#B23B28]" />
              <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-[#B23B28]" />

              {/* Avatar of Cô Thảo with Aura */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="relative">
                  <LadyThaoAvatar sizeClassName="w-20 h-20 sm:w-24 sm:h-24" animate={true} showBorder={true} />
                  <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#7C2A1C] text-[#FFE082] text-[0.62rem] font-sans font-bold border border-[#FFE082]/60 shadow-xs flex items-center gap-1">
                    <span>Cô Thảo</span>
                    <span>🌸</span>
                  </div>
                </div>
              </div>

              {/* Welcoming Speech Bubble */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-sans font-bold text-[#7C2A1C] uppercase tracking-wider flex items-center gap-1">
                    <span>🌸</span>
                    <span>Cô Thảo Tiếp Chuyện</span>
                  </span>
                  <span className="text-[0.65rem] px-2 py-0.2 rounded-full bg-[#B23B28]/10 text-[#B23B28] font-mono font-semibold">
                    Đang ở sạp
                  </span>
                </div>
                <p className="font-serif text-xs sm:text-sm text-[#2E2415] leading-relaxed italic">
                  "Chào bạn ghé thăm Sạp Bói! Dù là chuyện công danh, sự nghiệp, tài lộc hay tình cảm, bạn hãy nhập câu hỏi vào ô bên dưới rồi bấm <strong className="text-[#B23B28] not-italic">Lắc Ống Xăm</strong> để Thảo khai mở quẻ Dịch linh ứng cho bạn nhé."
                </p>
              </div>
            </div>

            {/* STEP 1: USER ASKS QUESTION INPUT AREA */}
            <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF4E6] p-3.5 sm:p-4 rounded-xs border border-[#AD8A2E]/40 shadow-xs relative">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B23B28]" />
                <label
                  htmlFor="question-input"
                  className="font-sans font-bold text-xs uppercase tracking-wider text-[#7C2A1C]"
                >
                  Bước 1: Nhập điều bạn đang trăn trở
                </label>
              </div>

              <div className="relative">
                <textarea
                  id="question-input"
                  rows={2}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ví dụ: Dự án công việc sắp tới có thuận lợi không? Tôi nên chọn hướng đi nào?..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#AD8A2E]/50 rounded-xs text-sm font-serif text-[#2E2415] placeholder:text-[#6E5C3E]/60 focus:outline-none focus:border-[#B23B28] focus:ring-1 focus:ring-[#B23B28] shadow-2xs resize-none"
                />
              </div>

              {/* Sample Auspicious Questions Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[0.68rem] font-sans text-[#6E5C3E] uppercase font-semibold">Gợi ý:</span>
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuestion(q)}
                    className="text-[0.72rem] font-serif px-2 py-0.5 rounded-full bg-[#EFE4CB]/70 hover:bg-[#EFE4CB] hover:text-[#7C2A1C] text-[#6E5C3E] border border-[#AD8A2E]/30 transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2 & 3: THE BAMBOO TUBE SHAKING & WINNING STICK FALLING */}
            <div className="relative pt-1">
              <div className="text-center mb-1">
                <span className="text-[0.7rem] font-sans font-bold uppercase tracking-widest text-[#B23B28]">
                  Bước 2: Lắc ống xăm để rút quẻ
                </span>
              </div>

              <StickTube
                onStickFallen={handleStickFallen}
                onAskThao={handleAskThao}
                soundEnabled={soundEnabled}
                hasQuestion={question.trim().length > 0}
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 2: LADY THAO APPEARS WITH FOLKLORE CLOUD EFFECTS & DECIPHERS
           ========================================================================= */}
        <AnimatePresence mode="wait">
          {isThaoAppeared && fallenQue !== null && fallenHao !== null && currentHexagram && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-3.5 relative overflow-hidden"
            >
              {/* Navigation Bar Back to Sạp Bói & Reset */}
              <div className="flex items-center justify-between pb-2 border-b border-[#AD8A2E]/30">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans font-semibold text-[#B23B28] hover:text-[#7C2A1C] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Về Sạp Bói / Gieo quẻ khác</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={triggerCurtainReveal}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#B23B28]/10 hover:bg-[#B23B28]/20 border border-[#B23B28]/30 text-xs font-serif text-[#7C2A1C] transition-colors cursor-pointer"
                    title="Xem lại hiệu ứng khai mành cung đình"
                  >
                    <DoorOpen className="w-3.5 h-3.5 text-[#B23B28]" />
                    <span className="hidden sm:inline">Khai mành lại</span>
                  </button>

                  <div className="text-[0.7rem] sm:text-xs font-sans uppercase tracking-widest text-[#7C2A1C] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B23B28]" />
                    <span>CÔ THẢO GIẢI QUẺ</span>
                  </div>
                </div>
              </div>

              {/* TOP CONSULTATION SECTION: LADY THAO PORTRAIT + WELCOMING DIALOGUE */}
              <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E3] to-[#F5E8D0] p-3.5 sm:p-4 rounded-xs border border-[#AD8A2E]/40 shadow-xs relative">
                {/* Corner Accents */}
                <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#B23B28]" />
                <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#B23B28]" />

                <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-5">
                  {/* Young Pretty Lady Thao Portrait with Folklore Cloud Halo & I-Ching Nails */}
                  <div className="flex-shrink-0">
                    <ThaoPortrait isSpeaking={true} showAura={true} className="w-36 sm:w-44 h-auto" />
                  </div>

                  {/* Welcoming Speech Card from Lady Thao */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="flex-1 text-left relative p-3.5 bg-white/95 border border-[#AD8A2E]/40 rounded-xs shadow-[0_2px_8px_rgba(46,36,21,0.06)]"
                  >
                    {/* Speaking speech bubble arrow */}
                    <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-b border-l border-[#AD8A2E]/40 rotate-45" />

                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#7C2A1C] flex items-center gap-1">
                        <span>🌸</span>
                        <span>Cô Thảo Thuận Lòng Giải Quẻ</span>
                      </span>
                    </div>

                    <p className="font-serif text-sm sm:text-base text-[#2E2415] leading-relaxed">
                      <span className="font-bold text-[#7C2A1C]">"Thảo chào bạn! </span>
                      {question.trim() ? (
                        <>
                          Về băn khoăn:{' '}
                          <span className="font-semibold text-[#B23B28]">"{question}"</span>,{' '}
                        </>
                      ) : null}
                      thẻ xăm Kinh Dịch linh ứng chỉ ra{' '}
                      <span className="font-semibold text-[#7C2A1C]">
                        Quẻ #{fallenQue} ({currentViet?.name}) · Hào Động {fallenHao}
                      </span>
                      . Hãy xem biến chuyển quẻ và lắng nghe lời luận giải chi tiết bên dưới."
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Hexagram Visualizer with 6 Lines and Classical Text (Quẻ Chủ ➔ Hào Động ➔ Quẻ Biến) */}
              <HexagramVisualizer
                que={fallenQue}
                hao={fallenHao}
                hexagram={currentHexagram}
              />

              {/* Live Oracle AI Dialogue Streaming with Lady Thao */}
              <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E3] to-[#F5E8D0] p-3.5 sm:p-4 rounded-xs border border-[#AD8A2E]/40 shadow-xs">
                <OracleChat
                  que={fallenQue}
                  hao={fallenHao}
                  hexagram={currentHexagram}
                  initialQuestion={question}
                  soundEnabled={soundEnabled}
                  onReset={handleReset}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ParchmentFrame>

      {/* Footer Details */}
      <footer className={`w-full ${isThaoAppeared ? 'max-w-3xl' : 'max-w-xl'} text-center my-3 text-xs font-serif text-[#6E5C3E]/80 transition-all duration-500`}>
        <p>
          Kinh Dịch cổ truyền 64 Quẻ · Bản giải nghĩa thuần Việt chuẩn xác · Cảm hứng Sạp Bói Dân Gian Việt Nam
        </p>
      </footer>

      {/* 64 Hexagrams Codex Modal */}
      <HexagramCodexModal
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
        dataset={dataset}
        onSelectHexagram={handleSelectFromCodex}
      />

      {/* Traditional Palace Window Curtain Opening Effect */}
      {showCurtain && (
        <TraditionalCurtain
          isOpen={curtainOpen}
          onOpened={() => setShowCurtain(false)}
          language="vi"
        />
      )}
    </div>
  );
}
