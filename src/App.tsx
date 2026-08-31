import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ParchmentFrame } from './components/ParchmentFrame';
import { ThaoPortrait } from './components/ThaoPortrait';
import { StickTube } from './components/StickTube';
import { HexagramVisualizer } from './components/HexagramVisualizer';
import { OracleChat } from './components/OracleChat';
import { HexagramCodexModal } from './components/HexagramCodexModal';
import { HexagramDataset, Hexagram } from './types';
import localHexagrams from './hexagrams.json' with { type: 'json' };
import { Volume2, VolumeX, Globe, BookOpen, Sparkles, HelpCircle, ExternalLink, RefreshCw, ArrowLeft, Cloud } from 'lucide-react';
import { HEXAGRAM_DATA } from './utils/hexagramPatterns';
import { playGong } from './utils/audio';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'vi'>('vi');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [dataset, setDataset] = useState<HexagramDataset>(localHexagrams as HexagramDataset);
  
  // FLOW STATE:
  // 1/ User asks question
  // 2/ Shake the wooden sticks box
  // 3/ The xăm falls out and shows the wooden stick
  // 4/ Lady Thao appears *with effects, with clouds* and delivers in-depth interpretation
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
      {/* Background: Vietnamese Traditional Folk Painting Motifs */}
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

      {/* Top Floating App Bar */}
      <header className="w-full max-w-[450px] flex items-center justify-between py-2 px-1 mb-1 z-30 relative">
        {/* GitHub Source Reference Pill */}
        <a
          href="https://github.com/thao-xc/test-tu-vi"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#AD8A2E]/15 hover:bg-[#AD8A2E]/25 text-[#6E5C3E] text-xs font-sans font-medium transition-colors border border-[#AD8A2E]/30 shadow-2xs"
          title="Synced with GitHub repository thao-xc/test-tu-vi"
        >
          <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
          <span>GitHub: thao-xc/test-tu-vi</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>

        {/* Quick Utility Actions */}
        <div className="flex items-center gap-1.5">
          {/* Instructions & 64 Hexagrams Codex Button */}
          <button
            type="button"
            id="open-codex-button"
            onClick={() => setIsCodexOpen(true)}
            className="px-2.5 py-1 rounded-xs bg-[#EFE4CB]/90 hover:bg-[#EFE4CB] border border-[#AD8A2E]/50 text-[#7C2A1C] hover:text-[#B23B28] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs font-sans text-xs font-semibold"
            title={language === 'vi' ? 'Hướng dẫn xin quẻ & 64 Quẻ Kinh Dịch' : 'Instructions & 64 Hexagrams'}
          >
            <BookOpen className="w-4 h-4 text-[#B23B28]" />
            <span className="inline">{language === 'vi' ? 'Hướng Dẫn' : 'Guide'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            id="toggle-sound-button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-xs bg-[#EFE4CB]/80 hover:bg-[#EFE4CB] border border-[#AD8A2E]/40 text-[#6E5C3E] transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            id="toggle-language-button"
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className="px-2 py-1 rounded-xs bg-[#EFE4CB]/80 hover:bg-[#EFE4CB] border border-[#AD8A2E]/40 text-xs font-sans font-semibold text-[#6E5C3E] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language.toUpperCase()}</span>
          </button>
        </div>
      </header>

      {/* Main Scroll Artwork Wrapper */}
      <ParchmentFrame>
        {/* STEPS 1, 2, 3: USER ASKS QUESTION -> SHAKES WOODEN STICKS BOX -> XĂM FALLS OUT & SHOWS STICK */}
        {!isThaoAppeared && (
          <div className="space-y-3.5">
            {/* Header & Flow Title */}
            <div className="text-center">
              <p className="font-sans text-[0.66rem] tracking-[0.24em] uppercase text-[#AD8A2E] font-bold mb-1">
                {language === 'vi' ? 'QUẺ · HÀO · KINH DỊCH · TỬ VI' : 'QUE · HAO · FORTUNE · I CHING'}
              </p>

              <div className="flex items-center justify-center gap-2 mb-1">
                <img
                  src="/src/assets/images/thao_app_icon_1788162188158.jpg"
                  alt="Thao Fortune Teller Icon"
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#AD8A2E] shadow-2xs object-cover"
                />
                <h1 className="font-serif italic font-bold text-2xl sm:text-3xl text-[#2E2415] tracking-tight">
                  Thao Fortune Teller
                </h1>
              </div>

              <p className="font-serif italic text-xs sm:text-sm text-[#6E5C3E]">
                {language === 'vi'
                  ? 'Sạp Bói Thảo · Gieo xăm cầu cát hung & Thấu tỏ vạn sự cùng Kinh Dịch'
                  : 'Lady Thao · Divine fortune & wisdom through ancient I Ching bamboo sticks'}
              </p>
            </div>

            {/* Oriental Filigree Divider */}
            <div className="flex justify-center my-1 opacity-75">
              <svg className="w-44 h-3.5 text-[#AD8A2E]" viewBox="0 0 220 20">
                <path d="M2 10 Q 40 4, 80 10 T 160 10" stroke="currentColor" strokeWidth="1" fill="none" />
                <circle cx="110" cy="10" r="3" fill="#B23B28" />
                <path d="M160 10 Q 190 4, 218 10" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
            </div>

            {/* STEP 1: LADY THAO'S FRIENDLY GREETING - 'Tại sao con khóc?' */}
            <div className="space-y-2.5 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E3] to-[#F5E8D0] p-3.5 sm:p-4 rounded-xs border border-[#AD8A2E]/40 shadow-xs relative overflow-hidden">
              {/* Traditional Gold Accent Corner */}
              <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#B23B28]" />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#B23B28]" />

              {/* Lady Thao Friendly Fairy Godmother Prompt */}
              <div className="flex items-start gap-3">
                {/* Lady Thao App Icon Avatar */}
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-[#E9CE84] bg-[#2E2415] flex-shrink-0 shadow-md overflow-hidden relative">
                  <img
                    src="/src/assets/images/thao_app_icon_1788162188158.jpg"
                    alt="Lady Thao Avatar"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-serif italic font-bold text-lg sm:text-xl text-[#7C2A1C] tracking-tight">
                      {language === 'vi' ? '🌸 "Tại sao con khóc?"' : '🌸 "Why dost thou weep, child?"'}
                    </span>
                  </div>

                  <p className="font-serif italic text-xs sm:text-sm text-[#4A3B22] leading-relaxed">
                    {language === 'vi'
                      ? 'Có điều chi trăn trở, duyên cớ nào đưa bạn ghé Thao Fortune Teller hôm nay? Hãy nói Thảo nghe nhé:'
                      : 'What brings you to consult Thao Fortune Teller today? What troubles your heart and mind? Tell me below:'}
                  </p>
                </div>
              </div>

              <textarea
                id="user-question-input"
                rows={2}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={
                  language === 'vi'
                    ? 'Ví dụ: Tháng này công việc của con có suôn sẻ không, tình duyên sắp tới ra sao, có nên đầu tư không?...'
                    : 'E.g., How will my career or relationship unfold, should I pursue this new project?...'
                }
                className="w-full px-3 py-2 text-sm font-serif bg-white border border-[#AD8A2E]/40 rounded-xs text-[#2E2415] placeholder:text-[#6E5C3E]/50 focus:outline-none focus:border-[#B23B28] focus:ring-1 focus:ring-[#B23B28] resize-none shadow-2xs"
              />

              {/* Sample Topic Chips */}
              <div className="pt-0.5">
                <div className="text-[0.64rem] font-sans uppercase font-bold tracking-wider text-[#AD8A2E] mb-1 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#B23B28]" />
                  <span>{language === 'vi' ? 'Hoặc chọn nhanh câu hỏi gợi ý:' : 'Or tap a suggested question:'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sampleQuestions.map((sq, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setQuestion(sq)}
                      className="text-[0.72rem] font-sans text-[#6E5C3E] bg-[#EFE4CB]/70 hover:bg-[#EFE4CB] hover:text-[#7C2A1C] px-2 py-0.5 rounded-xs border border-[#AD8A2E]/25 transition-colors text-left cursor-pointer active:scale-95"
                    >
                      {sq}
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

        {/* STEP 4: LADY THAO APPEARS *WITH EFFECTS, WITH CLOUDS* AND DELIVERS IN-DEPTH INTERPRETATION */}
        <AnimatePresence>
          {isThaoAppeared && fallenQue !== null && fallenHao !== null && currentHexagram && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="space-y-3 relative"
            >
              {/* MAGICAL CLOUD ENTRANCE OVERLAY (Mây Tiên Giáng Trần) */}
              <motion.div
                initial={{ opacity: 0.8, scale: 1.4 }}
                animate={{ opacity: 0, scale: 2 }}
                transition={{ duration: 1.6, ease: 'easeOut' }}
                className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center"
              >
                <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-[#E9CE84]/60 via-[#FDF5E6]/90 to-[#B23B28]/30 blur-2xl" />
              </motion.div>

              {/* Navigation Back to Sticks Box */}
              <div className="flex items-center justify-between pb-1 border-b border-[#AD8A2E]/30">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#B23B28] hover:text-[#7C2A1C] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Gieo lại quẻ khác' : 'Draw another stick'}</span>
                </button>

                <div className="text-[0.68rem] font-sans uppercase tracking-widest text-[#AD8A2E] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#B23B28]" />
                  <span>{language === 'vi' ? 'THẦY BÓI THẢO DIỆN KIẾN' : 'LADY THAO CONSULTATION'}</span>
                </div>
              </div>

              {/* LADY THAO PORTRAIT APPEARS WITH SWIRLING CLOUDS & RADIANT AURA */}
              <div className="text-center pt-2 relative">
                {/* Flowing Floating Clouds framing Lady Thao */}
                <div className="relative">
                  <ThaoPortrait isSpeaking={true} showAura={true} className="w-36 sm:w-42 h-auto" />
                </div>

                {/* Welcoming Speech from Lady Thao */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="relative mt-2 p-3 bg-gradient-to-b from-[#FFFDF9] to-[#FDF5E6] border border-[#AD8A2E]/40 rounded-xs shadow-[0_6px_20px_rgba(46,36,21,0.1)]"
                >
                  {/* Bubble Pointer Arrow */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FFFDF9] border-t border-l border-[#AD8A2E]/40 rotate-45" />

                  <p className="font-serif italic text-sm text-[#2E2415] leading-relaxed">
                    {language === 'vi' ? (
                      <>
                        <span className="font-bold text-[#7C2A1C]">"Thảo chào bạn! </span>
                        {question.trim() ? (
                          <>
                            Có phải bạn đang trăn trở về chuyện:{' '}
                            <span className="font-semibold text-[#B23B28]">"{question}"</span>?{' '}
                          </>
                        ) : null}
                        Đừng quá âu lo, quẻ Kinh Dịch đã hiện rõ huyền cơ:{' '}
                        <span className="font-semibold text-[#7C2A1C]">
                          Quẻ Chủ #{fallenQue} ({currentMeta?.vietnameseName}) · Hào Động {fallenHao}
                        </span>
                        . Hãy để Thảo soi tỏ thiên cơ và luận giải cho bạn ngay sau đây..."
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-[#7C2A1C]">"Greetings, dear seeker! </span>
                        {question.trim() ? (
                          <>
                            You came asking:{' '}
                            <span className="font-semibold text-[#B23B28]">"{question}"</span>.{' '}
                          </>
                        ) : null}
                        Cast aside your worries; the oracle has unveiled:{' '}
                        <span className="font-semibold text-[#7C2A1C]">
                          Primary Hexagram #{fallenQue} ({currentHexagram.english}) · Line {fallenHao}
                        </span>
                        . Let us examine the divine transformation..."
                      </>
                    )}
                  </p>
                </motion.div>
              </div>

              {/* Hexagram Visualizer with 6 Lines and Classical Text based on the wooden stick */}
              <HexagramVisualizer
                que={fallenQue}
                hao={fallenHao}
                hexagram={currentHexagram}
                language={language}
              />

              {/* Live Oracle AI Dialogue Streaming with Thao */}
              <OracleChat
                que={fallenQue}
                hao={fallenHao}
                hexagram={currentHexagram}
                initialQuestion={question}
                language={language}
                soundEnabled={soundEnabled}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ParchmentFrame>

      {/* Footer Details */}
      <footer className="w-full max-w-[450px] text-center my-3 text-xs font-serif text-[#6E5C3E]/80">
        <p>
          {language === 'vi'
            ? 'Kinh Dịch cổ truyền 64 Quẻ · Bản dịch Wilhelm-Baynes chuẩn xác · Cảm hứng Tranh Dân Gian Việt Nam'
            : 'Classical 64 I Ching Hexagrams · Wilhelm-Baynes Grounded · Vietnamese Folk Art Inspiration'}
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
