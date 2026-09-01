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
import { HexagramDataset, Hexagram } from './types';
import localHexagrams from './hexagrams.json' with { type: 'json' };
import { Volume2, VolumeX, Globe, BookOpen, Sparkles, ArrowLeft, RefreshCw, Flame } from 'lucide-react';
import { HEXAGRAM_DATA } from './utils/hexagramPatterns';
import { playGong } from './utils/audio';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'vi'>('vi');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [dataset, setDataset] = useState<HexagramDataset>(localHexagrams as HexagramDataset);

  // FLOW STATE:
  // 1/ User asks question in Lady Thao's Temple Sạp Bói
  // 2/ Shake the wooden sticks box
  // 3/ The xăm falls out and shows the wooden stick
  // 4/ Lady Thao appears with folklore clouds and delivers AI interpretation
  const [question, setQuestion] = useState<string>('');
  const [fallenQue, setFallenQue] = useState<number | null>(null);
  const [fallenHao, setFallenHao] = useState<number | null>(null);
  const [isThaoAppeared, setIsThaoAppeared] = useState<boolean>(false);
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);

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

  // Step 3 callback: The stick has fallen out of the box
  const handleStickFallen = (que: number, hao: number) => {
    setFallenQue(que);
    setFallenHao(hao);
  };

  // Step 4 callback: User clicks "Ask Thao / Hỏi Thảo" -> Lady Thao appears with cloud & aura effects!
  const handleAskThao = (que: number, hao: number) => {
    setFallenQue(que);
    setFallenHao(hao);
    setIsThaoAppeared(true);
    if (soundEnabled) {
      playGong(0.4);
    }
  };

  const handleReset = () => {
    setFallenQue(null);
    setFallenHao(null);
    setIsThaoAppeared(false);
    setQuestion('');
  };

  const handleSelectFromCodex = (que: number) => {
    const defaultHao = 1;
    setFallenQue(que);
    setFallenHao(defaultHao);
    setIsThaoAppeared(true);
    if (!question) {
      setQuestion(language === 'vi' ? 'Ý nghĩa tổng quan quẻ này là gì?' : 'What is the general guidance of this hexagram?');
    }
  };

  const sampleQuestions = language === 'vi'
    ? [
        'Dự án công việc sắp tới có thuận buồm xuôi gió không?',
        'Chuyện tình duyên và tình cảm sắp tới thế nào?',
        'Tôi nên quyết định đổi mới hay kiên trì hướng đi cũ?',
        'Lời khuyên cho việc tài lộc, đầu tư và sự nghiệp?',
      ]
    : [
        'Will my upcoming endeavor and career succeed?',
        'What guidance is there for my relationship path?',
        'Should I embark on a new venture or persevere?',
        'What do the ancients advise for my financial health?',
      ];

  const currentHexagram: Hexagram | null = fallenQue ? dataset[String(fallenQue)] : null;
  const currentMeta = fallenQue ? HEXAGRAM_DATA[fallenQue] : null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start py-3 px-3 sm:px-6 relative overflow-x-hidden bg-[#F4EAD4]">
      {/* Background: Traditional Vietnamese Ink Wash & Folk Art Motifs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 select-none">
        {/* Distant Misty Mountain Ink Wash */}
        <svg className="absolute top-0 left-0 right-0 w-full h-48 text-[#8C6D2F]" viewBox="0 0 1200 300" preserveAspectRatio="none" fill="currentColor">
          <path d="M0 300 L0 180 Q 200 60, 400 160 T 800 100 T 1200 190 L 1200 300 Z" opacity="0.25" />
          <path d="M0 300 L0 220 Q 300 130, 600 230 T 1200 170 L 1200 300 Z" opacity="0.35" />
        </svg>

        {/* Traditional Auspicious Floating Clouds (Dong Ho style) Left */}
        <svg className="absolute top-20 -left-10 w-64 h-36 text-[#AD8A2E] animate-cloud-drift opacity-40" viewBox="0 0 160 90" fill="none" stroke="currentColor">
          <path d="M10 60 C 10 40, 30 30, 50 35 C 60 15, 90 15, 105 28 C 125 20, 145 35, 140 55 C 135 70, 105 72, 85 68 C 65 72, 30 72, 10 60 Z" strokeWidth="1.2" />
          <path d="M50 35 C 65 42, 70 55, 65 65" strokeWidth="0.8" />
          <path d="M105 28 C 110 40, 105 52, 95 60" strokeWidth="0.8" />
        </svg>

        {/* Traditional Floating Clouds Right */}
        <svg className="absolute top-48 -right-10 w-72 h-40 text-[#AD8A2E] opacity-35" viewBox="0 0 160 90" fill="none" stroke="currentColor">
          <path d="M10 60 C 10 40, 30 30, 50 35 C 60 15, 90 15, 105 28 C 125 20, 145 35, 140 55 C 135 70, 105 72, 85 68 C 65 72, 30 72, 10 60 Z" strokeWidth="1.2" />
        </svg>

        {/* Bamboo Stalk Silhouettes */}
        <svg className="hidden lg:block absolute bottom-0 left-6 w-24 h-96 text-[#5A7256] opacity-30" viewBox="0 0 100 400" fill="currentColor">
          <rect x="20" y="20" width="6" height="70" rx="2" />
          <rect x="20" y="100" width="6" height="85" rx="2" />
          <rect x="20" y="195" width="6" height="95" rx="2" />
          <rect x="20" y="300" width="6" height="100" rx="2" />
        </svg>

        {/* Red Lotus Blossom */}
        <svg className="hidden sm:block absolute bottom-0 right-4 w-44 h-48 text-[#B23B28] opacity-25" viewBox="0 0 160 160" fill="currentColor">
          <path d="M80 30 C 70 60, 50 85, 30 110 C 65 115, 105 115, 140 110 C 120 85, 100 60, 80 30 Z" opacity="0.4" />
          <path d="M80 15 C 75 45, 65 70, 50 90 C 70 98, 90 98, 110 90 C 95 70, 85 45, 80 15 Z" opacity="0.6" />
        </svg>
      </div>

      {/* Top App Bar (GitHub link removed as requested, clean layout) */}
      <header className={`w-full ${isThaoAppeared ? 'max-w-3xl' : 'max-w-xl'} flex items-center justify-between py-2 px-1 mb-1 z-30 relative transition-all duration-500`}>
        {/* Sạp Bói Brand Badge with Rotating Bát Quái Magic Circle */}
        <div className="flex items-center gap-2">
          <BatQuaiIcon size={32} animate={true} className="border border-[#E9CE84] shadow-xs" />
          <div className="w-8 h-8 rounded-full border border-[#AD8A2E] overflow-hidden shadow-xs ring-2 ring-[#B23B28]/40">
            <img src="/lady_thao_ghibli.jpg" alt="Lady Thao" className="w-full h-full object-cover" />
          </div>
          <span className="font-serif italic font-bold text-base sm:text-lg text-[#7C2A1C] tracking-tight flex items-center gap-1.5">
            <span>Sạp Bói Cô Thảo</span>
            <span className="text-xs text-[#FF9EAA]">🌸</span>
          </span>
        </div>

        {/* Top Utility Controls */}
        <div className="flex items-center gap-1.5">
          {/* Instructions & 64 Hexagrams Codex Button */}
          <button
            type="button"
            id="open-codex-button"
            onClick={() => setIsCodexOpen(true)}
            className="px-2.5 py-1 rounded-xs bg-[#EFE4CB]/90 hover:bg-[#EFE4CB] border border-[#AD8A2E]/50 text-[#7C2A1C] hover:text-[#B23B28] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs font-sans text-xs font-semibold"
            title={language === 'vi' ? 'Hướng dẫn xin quẻ & 64 Quẻ Kinh Dịch' : 'Instructions & 64 Hexagrams'}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#B23B28]" />
            <span className="inline">{language === 'vi' ? 'Sổ 64 Quẻ' : 'Codex'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            id="toggle-sound-button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-xs bg-[#EFE4CB]/80 hover:bg-[#EFE4CB] border border-[#AD8A2E]/40 text-[#6E5C3E] transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            id="toggle-language-button"
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className="px-2 py-1 rounded-xs bg-[#EFE4CB]/80 hover:bg-[#EFE4CB] border border-[#AD8A2E]/40 text-xs font-sans font-semibold text-[#6E5C3E] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3 h-3" />
            <span>{language.toUpperCase()}</span>
          </button>
        </div>
      </header>

      {/* Main Scroll Artwork Wrapper */}
      <ParchmentFrame maxWidthClassName={isThaoAppeared ? 'max-w-3xl' : 'max-w-xl'}>
        {/* =========================================================================
            SCREEN 1: SẠP BÓI BY LADY THAO (TEMPLE ROOM SCENE, ASKING, BAMBOO STICKS)
           ========================================================================= */}
        {!isThaoAppeared && (
          <div className="space-y-4">
            {/* SẠP BÓI TEMPLE ROOM HERO CARD */}
            <div className="relative rounded-lg overflow-hidden border border-[#AD8A2E]/60 shadow-[0_8px_24px_rgba(46,36,21,0.14)] bg-[#2E2415]">
              {/* Antique Temple Atmosphere Room Banner */}
              <div className="relative w-full h-44 sm:h-52 overflow-hidden">
                <img
                  src="/sap_boi_anime.jpg"
                  alt="Sạp Bói Cô Thảo Anime Magical Temple Room"
                  className="w-full h-full object-cover object-center transform scale-102 hover:scale-105 transition-transform duration-700"
                />
                {/* Atmospheric Warm Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1610] via-[#1C1610]/40 to-transparent" />

                {/* Lantern & Incense Glow Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#1C1610]/80 backdrop-blur-xs border border-[#E9CE84]/60 text-[#E9CE84] text-[0.68rem] font-sans font-semibold flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#FF9EAA] animate-pulse" />
                  <span>{language === 'vi' ? 'Sạp Bói Dịch Cổ Truyền · Phong Cách Huyền Ảo' : 'Sacred I-Ching Shrine · Anime Folk Art'}</span>
                </div>

                {/* Temple Eaves Title on Hero */}
                <div className="absolute bottom-2.5 left-3 right-3 text-left">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[0.66rem] font-sans uppercase tracking-[0.2em] text-[#E9CE84] font-bold">
                      {language === 'vi' ? 'KINH DỊCH CHIÊM BÓI' : 'ANCIENT I CHING'}
                    </span>
                  </div>
                  <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#FFFDF7] tracking-tight drop-shadow-md">
                    Sạp Bói Thảo
                  </h1>
                  <p className="font-serif italic text-xs sm:text-sm text-[#F7F0E1]/90 drop-shadow-xs line-clamp-1">
                    {language === 'vi'
                      ? 'Gieo xăm cầu cát hung & Thấu tỏ huyền cơ cùng Cô Thảo'
                      : 'Divine fortune & wisdom through ancient I Ching bamboo sticks'}
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 1: LADY THAO SITTING IN TEMPLE ROOM ASKING - '🌸 Tại sao con khóc?' */}
            <div className="space-y-3 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E3] to-[#F5E8D0] p-4 sm:p-5 rounded-xs border border-[#AD8A2E]/40 shadow-xs relative overflow-hidden">
              {/* Traditional Cinnabar Corner Ornaments */}
              <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#B23B28]" />
              <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#B23B28]" />
              <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#B23B28]" />
              <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#B23B28]" />

              {/* Lady Thao Warm Consultation Dialogue Header */}
              <div className="flex items-start gap-3.5">
                {/* Lady Thao Portrait Avatar (Young, Pretty, I-Ching Nails) */}
                <LadyThaoAvatar sizeClassName="w-14 h-14 sm:w-16 sm:h-16" />

                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-serif italic font-bold text-lg sm:text-xl text-[#7C2A1C] tracking-tight">
                      {language === 'vi' ? '🌸 "Tại sao con khóc?"' : '🌸 "Why dost thou weep, seeker?"'}
                    </span>
                  </div>

                  <p className="font-serif italic text-xs sm:text-sm text-[#4A3B22] leading-relaxed">
                    {language === 'vi'
                      ? 'Có điều chi nặng lòng hay băn khoăn về công danh, tình duyên, vận trình tương lai? Hãy giãi bày cùng Thảo trước khi gieo xăm nhé:'
                      : 'What troubles your heart or weighs on your mind regarding career, love, or fortune? Share with Lady Thao before shaking the sticks:'}
                  </p>
                </div>
              </div>

              {/* Seeker's Question Box */}
              <textarea
                id="user-question-input"
                rows={2}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={
                  language === 'vi'
                    ? 'Ví dụ: Công việc sắp tới có thuận lợi không, tình duyên sắp tới ra sao, có nên đầu tư đổi mới không?...'
                    : 'E.g., How will my upcoming career transition unfold, what guidance for my relationship?...'
                }
                className="w-full px-3.5 py-2.5 text-sm font-serif bg-white border border-[#AD8A2E]/50 rounded-xs text-[#2E2415] placeholder:text-[#6E5C3E]/60 focus:outline-none focus:border-[#B23B28] focus:ring-1 focus:ring-[#B23B28] resize-none shadow-2xs leading-relaxed"
              />

              {/* Suggested Questions Grid */}
              <div className="pt-0.5">
                <div className="text-[0.66rem] font-sans uppercase font-bold tracking-wider text-[#AD8A2E] mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#B23B28]" />
                  <span>{language === 'vi' ? 'Chạm nhanh câu hỏi gợi ý:' : 'Tap a suggested question:'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {sampleQuestions.map((sq, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setQuestion(sq)}
                      className="text-[0.74rem] font-sans text-[#6E5C3E] bg-[#EFE4CB]/70 hover:bg-[#EFE4CB] hover:text-[#7C2A1C] px-2.5 py-1.5 rounded-xs border border-[#AD8A2E]/30 transition-colors text-left cursor-pointer active:scale-98 line-clamp-1"
                    >
                      • {sq}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* BAMBOO FORTUNE TUBE (ỐNG XĂM BÓI DỊCH) */}
            <div className="pt-1">
              <StickTube
                onStickFallen={handleStickFallen}
                onAskThao={handleAskThao}
                disabled={false}
                soundEnabled={soundEnabled}
                language={language}
                hasQuestion={Boolean(question.trim())}
                isEnlarged={Boolean(question.trim())}
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
                  <span>{language === 'vi' ? 'Về Sạp Bói / Gieo quẻ khác' : 'Return to Sạp Bói / Draw again'}</span>
                </button>

                <div className="text-[0.7rem] sm:text-xs font-sans uppercase tracking-widest text-[#7C2A1C] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B23B28]" />
                  <span>{language === 'vi' ? 'CÔ THẢO GIẢI QUẺ' : 'LADY THAO DECIPHERING'}</span>
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
                        <span>{language === 'vi' ? 'Cô Thảo Thuận Lòng Giải Quẻ' : 'Lady Thao’s Divination'}</span>
                      </span>
                    </div>

                    <p className="font-serif text-sm sm:text-base text-[#2E2415] leading-relaxed">
                      {language === 'vi' ? (
                        <>
                          <span className="font-bold text-[#7C2A1C]">"Thảo chào bạn! </span>
                          {question.trim() ? (
                            <>
                              Về băn khoăn:{' '}
                              <span className="font-semibold text-[#B23B28]">"{question}"</span>,{' '}
                            </>
                          ) : null}
                          thẻ xăm Kinh Dịch linh ứng chỉ ra{' '}
                          <span className="font-semibold text-[#7C2A1C]">
                            Quẻ #{fallenQue} ({currentMeta?.vietnameseName}) · Hào Động {fallenHao}
                          </span>
                          . Hãy xem biến chuyển quẻ và lắng nghe lời luận giải chi tiết bên dưới."
                        </>
                      ) : (
                        <>
                          <span className="font-bold text-[#7C2A1C]">"Greetings, seeker! </span>
                          {question.trim() ? (
                            <>
                              Regarding your question:{' '}
                              <span className="font-semibold text-[#B23B28]">"{question}"</span>,{' '}
                            </>
                          ) : null}
                          the sacred oracle has revealed{' '}
                          <span className="font-semibold text-[#7C2A1C]">
                            Hexagram #{fallenQue} ({currentHexagram.english}) · Line {fallenHao}
                          </span>
                          . Let us observe the hexagram transition and receive your reading below."
                        </>
                      )}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Hexagram Visualizer with 6 Lines and Classical Text (Quẻ Chủ ➔ Hào Động ➔ Quẻ Biến) */}
              <HexagramVisualizer
                que={fallenQue}
                hao={fallenHao}
                hexagram={currentHexagram}
                language={language}
              />

              {/* Live Oracle AI Dialogue Streaming with Lady Thao */}
              <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E3] to-[#F5E8D0] p-3.5 sm:p-4 rounded-xs border border-[#AD8A2E]/40 shadow-xs">
                <OracleChat
                  que={fallenQue}
                  hao={fallenHao}
                  hexagram={currentHexagram}
                  initialQuestion={question}
                  language={language}
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
          {language === 'vi'
            ? 'Kinh Dịch cổ truyền 64 Quẻ · Bản dịch Wilhelm-Baynes chuẩn xác · Cảm hứng Sạp Bói & Tranh Dân Gian Việt Nam'
            : 'Classical 64 I Ching Hexagrams · Wilhelm-Baynes Grounded · Vietnamese Folklore Inspiration'}
        </p>
      </footer>

      {/* 64 Hexagrams Codex Modal */}
      <HexagramCodexModal
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
        dataset={dataset}
        language={language}
        onSelectHexagram={handleSelectFromCodex}
      />
    </div>
  );
}
