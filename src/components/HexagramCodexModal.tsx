import React, { useState, useEffect } from 'react';
import { HexagramDataset } from '../types';
import { HEXAGRAM_DATA, getHexagramLines } from '../utils/hexagramPatterns';
import {
  Search,
  X,
  BookOpen,
  Layers,
  Sparkles,
  Smartphone,
  Compass,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Download,
  Share,
  PlusSquare,
  Monitor,
  Laptop,
  Check,
} from 'lucide-react';

interface HexagramCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: HexagramDataset;
  language: 'en' | 'vi';
  onSelectHexagram: (que: number) => void;
  initialTab?: 'instructions' | 'install' | 'codex';
}

export const HexagramCodexModal: React.FC<HexagramCodexModalProps> = ({
  isOpen,
  onClose,
  dataset,
  language,
  onSelectHexagram,
  initialTab = 'instructions',
}) => {
  const [activeTab, setActiveTab] = useState<'instructions' | 'install' | 'codex'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNum, setSelectedNum] = useState<number>(1);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  const hexagramNumbers = Array.from({ length: 64 }, (_, i) => i + 1);

  const filteredNumbers = hexagramNumbers.filter((num) => {
    const raw = dataset[String(num)];
    const meta = HEXAGRAM_DATA[num];
    const term = searchTerm.toLowerCase();

    return (
      String(num).includes(term) ||
      (raw && raw.english.toLowerCase().includes(term)) ||
      (meta && meta.vietnameseName.toLowerCase().includes(term)) ||
      (meta && meta.chinese.includes(term)) ||
      (meta && meta.upperTrigram.toLowerCase().includes(term)) ||
      (meta && meta.lowerTrigram.toLowerCase().includes(term))
    );
  });

  const activeHex = dataset[String(selectedNum)];
  const activeMeta = HEXAGRAM_DATA[selectedNum];
  const activeLines = getHexagramLines(selectedNum);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-[#FBF5E8] to-[#F3E7D0] border-2 border-[#AD8A2E] shadow-2xl rounded-xs flex flex-col overflow-hidden text-[#2E2415]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[#AD8A2E]/40 bg-[#EFE4CB]/90">
          <div className="flex items-center gap-2.5">
            <img
              src="/src/assets/images/thao_app_icon_1788162188158.jpg"
              alt="Thao Fortune Teller App Icon"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full border border-[#AD8A2E] shadow-xs object-cover"
            />
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#7C2A1C] tracking-tight leading-tight">
                {language === 'vi' ? 'Thao Fortune Teller' : 'Thao Fortune Teller'}
              </h2>
              <p className="font-sans text-[0.68rem] text-[#6E5C3E] uppercase tracking-wider">
                {language === 'vi' ? 'Bảo Điển & Cài Đặt Ứng Dụng' : 'Sacred Codex & Installation Guide'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xs hover:bg-[#B23B28]/10 text-[#6E5C3E] hover:text-[#B23B28] transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (Instructions vs Install App vs 64 Hexagrams) */}
        <div className="flex border-b border-[#AD8A2E]/30 bg-[#E8DCBF]/60 px-3 sm:px-5 gap-1 sm:gap-2 pt-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('instructions')}
            className={`pb-2 px-2.5 sm:px-3 text-xs sm:text-sm font-sans font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'instructions'
                ? 'border-[#B23B28] text-[#7C2A1C]'
                : 'border-transparent text-[#6E5C3E] hover:text-[#2E2415]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#B23B28]" />
            <span>{language === 'vi' ? '📜 Hướng Dẫn' : '📜 How to Consult'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('install')}
            className={`pb-2 px-2.5 sm:px-3 text-xs sm:text-sm font-sans font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'install'
                ? 'border-[#B23B28] text-[#7C2A1C]'
                : 'border-transparent text-[#6E5C3E] hover:text-[#2E2415]'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-[#B23B28]" />
            <span>{language === 'vi' ? '📲 Cài Đặt Ứng Dụng' : '📲 Install App'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('codex')}
            className={`pb-2 px-2.5 sm:px-3 text-xs sm:text-sm font-sans font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'codex'
                ? 'border-[#B23B28] text-[#7C2A1C]'
                : 'border-transparent text-[#6E5C3E] hover:text-[#2E2415]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#B23B28]" />
            <span>{language === 'vi' ? '📖 64 Quẻ Toàn Thư' : '📖 64 Hexagrams'}</span>
          </button>
        </div>

        {/* TAB 1: INSTRUCTIONS & ORACLE WISDOM */}
        {activeTab === 'instructions' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FAF3E4]/70">
            {/* Intro Welcome Card */}
            <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF1DE] to-[#FFFDF9] border border-[#AD8A2E]/40 p-4 rounded-xs shadow-xs text-center relative overflow-hidden">
              <div className="font-serif italic font-bold text-lg sm:text-xl text-[#7C2A1C] mb-1">
                {language === 'vi'
                  ? '🌸 "Tâm thành tất ứng — Vạn sự tùy duyên"'
                  : '🌸 "Sincerity connects with the Cosmos"'}
              </div>
              <p className="font-serif italic text-xs sm:text-sm text-[#4A3B22] max-w-xl mx-auto leading-relaxed">
                {language === 'vi'
                  ? 'Thao Fortune Teller kết hợp tinh hoa bói xăm dân gian Việt Nam với 64 Quẻ Kinh Dịch cổ truyền theo bản dịch chuẩn Wilhelm-Baynes, giúp bạn thấu suốt hiện tại và tìm ra định hướng sáng suốt.'
                  : 'Thao Fortune Teller blends traditional Vietnamese temple fortune sticks with the 64 classical I Ching hexagrams (Wilhelm-Baynes translation) to illuminate your present circumstance and future trajectory.'}
              </p>
            </div>

            {/* 4 Steps Journey Cards */}
            <div className="space-y-2.5">
              <h3 className="font-sans uppercase text-xs font-bold text-[#7C2A1C] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B23B28]" />
                <span>
                  {language === 'vi'
                    ? 'Quy Trình 4 Bước Gieo Quẻ Cùng Thảo'
                    : 'The 4-Stage Consultation Journey'}
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Step 1 */}
                <div className="bg-white/80 border border-[#AD8A2E]/30 p-3.5 rounded-xs shadow-2xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#B23B28] text-white flex items-center justify-center text-xs font-bold font-sans">
                      1
                    </span>
                    <span className="font-serif font-bold text-sm text-[#2E2415]">
                      {language === 'vi' ? 'Tâm Niệm Câu Hỏi' : 'Formulate Your Inquiry'}
                    </span>
                  </div>
                  <p className="font-serif italic text-xs text-[#5C4B33] leading-relaxed pl-7">
                    {language === 'vi'
                      ? 'Tĩnh tâm suy ngẫm điều bạn băn khoăn (công việc, tài lộc, tình duyên...). Thảo sẽ ân cần lắng nghe bạn.'
                      : 'Center your thoughts on what troubles you (career, love, decision). Lady Thao welcomes you with warm compassion.'}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white/80 border border-[#AD8A2E]/30 p-3.5 rounded-xs shadow-2xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#B23B28] text-white flex items-center justify-center text-xs font-bold font-sans">
                      2
                    </span>
                    <span className="font-serif font-bold text-sm text-[#2E2415]">
                      {language === 'vi' ? 'Lắc Ống Xăm Tre' : 'Shake the Bamboo Tube'}
                    </span>
                  </div>
                  <p className="font-serif italic text-xs text-[#5C4B33] leading-relaxed pl-7">
                    {language === 'vi'
                      ? 'Cầm điện thoại lắc nhẹ (hoặc nhấn nút "Lắc Ống Xăm") để các thẻ xăm xáo trộn tự nhiên.'
                      : 'Shake your smartphone gently (or click the Shake Tube button) to clatter the authentic bamboo sticks.'}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white/80 border border-[#AD8A2E]/30 p-3.5 rounded-xs shadow-2xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#B23B28] text-white flex items-center justify-center text-xs font-bold font-sans">
                      3
                    </span>
                    <span className="font-serif font-bold text-sm text-[#2E2415]">
                      {language === 'vi' ? 'Thẻ Xăm Xuất Hiện' : 'Stick Falls Out'}
                    </span>
                  </div>
                  <p className="font-serif italic text-xs text-[#5C4B33] leading-relaxed pl-7">
                    {language === 'vi'
                      ? 'Một thẻ xăm linh nghiệm nhô lên và rơi ra, biểu thị Quẻ Chủ (1-64) và Hào Động (1-6).'
                      : 'The chosen fortune stick rises and drops, revealing your Primary Hexagram (1-64) and Changing Line (1-6).'}
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-white/80 border border-[#AD8A2E]/30 p-3.5 rounded-xs shadow-2xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#B23B28] text-white flex items-center justify-center text-xs font-bold font-sans">
                      4
                    </span>
                    <span className="font-serif font-bold text-sm text-[#2E2415]">
                      {language === 'vi' ? 'Thảo Luận Giải Tam Biến' : 'Lady Thao Deciphers'}
                    </span>
                  </div>
                  <p className="font-serif italic text-xs text-[#5C4B33] leading-relaxed pl-7">
                    {language === 'vi'
                      ? 'Thảo hiện diện để giải nghĩa trọn vẹn: Quẻ Chủ ➔ Hào Động ➔ Quẻ Biến tương lai.'
                      : 'Lady Thao appears through the mist to interpret the full triad: Primary ➔ Changing Line ➔ Transformed Future.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Authentic I Ching Methodology Explainer */}
            <div className="bg-[#EFE4CB]/70 border border-[#AD8A2E]/35 p-3.5 rounded-xs space-y-2">
              <h4 className="font-sans font-bold text-xs uppercase text-[#7C2A1C] tracking-wide flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#B23B28]" />
                <span>
                  {language === 'vi'
                    ? 'Ý Nghĩa Tam Biến Kinh Dịch (Quẻ Chủ ➔ Hào Động ➔ Quẻ Biến)'
                    : 'Understanding the I Ching Triad'}
                </span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-serif italic text-[#4A3B22]">
                <div className="bg-white/60 p-2.5 rounded-xs border border-[#AD8A2E]/20">
                  <div className="font-sans font-bold text-[#7C2A1C] mb-0.5">① Quẻ Chủ (Gốc)</div>
                  <div>
                    {language === 'vi'
                      ? 'Phản ánh hoàn cảnh thực tại, nguồn gốc sự việc và năng lượng gốc.'
                      : 'Reflects your current state, root situation, and foundational energy.'}
                  </div>
                </div>

                <div className="bg-white/60 p-2.5 rounded-xs border border-[#B23B28]/20">
                  <div className="font-sans font-bold text-[#B23B28] mb-0.5">② Hào Động (Biến)</div>
                  <div>
                    {language === 'vi'
                      ? 'Điểm nút then chốt, chuyển hóa Âm sang Dương hoặc ngược lại, chỉ dẫn hành động.'
                      : 'The critical turning point mutating Yin/Yang, providing specific action advice.'}
                  </div>
                </div>

                <div className="bg-white/60 p-2.5 rounded-xs border border-[#2E7D32]/20">
                  <div className="font-sans font-bold text-[#2E7D32] mb-0.5">③ Quẻ Biến (Quả)</div>
                  <div>
                    {language === 'vi'
                      ? 'Xu thế phát triển và kết quả trong tương lai sau khi hành động đúng đạo.'
                      : 'The resulting trajectory and future outcome after navigating the change.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions CTA */}
            <div className="pt-1 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('install')}
                className="px-4 py-2 bg-[#EFE4CB] hover:bg-[#E2D4B5] border border-[#AD8A2E]/50 text-[#7C2A1C] font-sans font-bold text-xs uppercase tracking-wider rounded-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-[#B23B28]" />
                <span>{language === 'vi' ? 'Xem Cách Cài Ứng Dụng' : 'How to Install App'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-[#B23B28] to-[#7C2A1C] hover:from-[#C8402C] hover:to-[#8E2F20] text-[#FFFDF9] font-sans font-bold text-xs uppercase tracking-wider rounded-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{language === 'vi' ? 'Bắt Đầu Xin Quẻ' : 'Start Consultation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: APP INSTALLATION GUIDANCE */}
        {activeTab === 'install' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FAF3E4]/70">
            {/* App Branding Card */}
            <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF1DE] to-[#FFFDF9] border border-[#AD8A2E]/40 p-4 rounded-xs shadow-xs flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img
                src="/src/assets/images/thao_app_icon_1788162188158.jpg"
                alt="Thao Fortune Teller App Icon"
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-2xl border-2 border-[#AD8A2E] shadow-md object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h3 className="font-serif font-bold text-xl text-[#7C2A1C]">Thao Fortune Teller</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#B23B28] text-white text-[0.65rem] font-sans font-bold uppercase tracking-wider">
                    PWA App
                  </span>
                </div>
                <p className="font-serif italic text-xs text-[#5C4B33] leading-relaxed mb-2">
                  {language === 'vi'
                    ? 'Cài đặt Thao Fortune Teller trực tiếp lên màn hình chính điện thoại hoặc máy tính để xin quẻ nhanh chóng, trải nghiệm toàn màn hình và lắc điện thoại gieo xăm mượt mà nhất.'
                    : 'Install Thao Fortune Teller directly to your phone or desktop home screen for one-tap access, full-screen immersion, and smooth phone-shaking gestures.'}
                </p>

                {deferredPrompt && !isInstalled && (
                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="px-4 py-1.5 bg-[#B23B28] hover:bg-[#8E2F20] text-white text-xs font-sans font-bold rounded-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#FFE599]" />
                    <span>{language === 'vi' ? 'Cài Đặt Ngay (1 Chạm)' : 'Install Now (1-Tap)'}</span>
                  </button>
                )}

                {isInstalled && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-green-700 font-sans font-bold">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>{language === 'vi' ? 'Đã cài đặt trên thiết bị này' : 'Installed on this device'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Guides */}
            <div className="space-y-4">
              <h4 className="font-sans font-bold text-xs uppercase text-[#7C2A1C] tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B23B28]" />
                <span>
                  {language === 'vi' ? 'Hướng Dẫn Cài Đặt Theo Từng Thiết Bị' : 'Step-by-Step Device Instructions'}
                </span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. iOS Safari */}
                <div className="bg-white/85 border border-[#AD8A2E]/30 p-3.5 rounded-xs shadow-2xs space-y-2 flex flex-col">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-[#AD8A2E]/20">
                    <Smartphone className="w-4 h-4 text-[#B23B28]" />
                    <span className="font-serif font-bold text-sm text-[#2E2415]">
                      iPhone / iPad (Safari)
                    </span>
                  </div>

                  <ol className="text-xs font-serif text-[#4A3B22] space-y-2 flex-1 pl-1">
                    <li className="flex items-start gap-1.5">
                      <span className="font-sans font-bold text-[#B23B28]">1.</span>
                      <span>
                        {language === 'vi'
                          ? 'Mở trang web trong trình duyệt Safari.'
                          : 'Open this website in Safari.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-sans font-bold text-[#B23B28]">2.</span>
                      <span>
                        {language === 'vi' ? (
                          <>
                            Nhấn nút <strong className="text-[#7C2A1C]">Chia sẻ (Share)</strong> ở thanh dưới cùng (biểu tượng ô vuông mũi tên chỉ lên <Share className="w-3 h-3 inline text-[#B23B28]" />).
                          </>
                        ) : (
                          <>
                            Tap the <strong className="text-[#7C2A1C]">Share</strong> button at bottom toolbar (square with arrow up <Share className="w-3 h-3 inline text-[#B23B28]" />).
                          </>
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-sans font-bold text-[#B23B28]">3.</span>
                      <span>
                        {language === 'vi' ? (
                          <>
                            Cuộn xuống và chọn <strong className="text-[#7C2A1C]">"Thêm vào Màn hình chính"</strong> (<PlusSquare className="w-3 h-3 inline text-[#B23B28]" /> Add to Home Screen).
                          </>
                        ) : (
                          <>
                            Scroll and tap <strong className="text-[#7C2A1C]">"Add to Home Screen"</strong> (<PlusSquare className="w-3 h-3 inline text-[#B23B28]" />).
                          </>
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-sans font-bold text-[#B23B28]">4.</span>
                      <span>
                        {language === 'vi'
                          ? 'Nhấn "Thêm" ở góc trên bên phải để hoàn tất.'
                          : 'Tap "Add" in top-right corner to finish.'}
                      </span>
                    </li>
                  </ol>
                </div>

                {/* 2. Android Chrome */}
                <div className="bg-white/85 border border-[#AD8A2E]/30 p-3.5 rounded-xs shadow-2xs space-y-2 flex flex-col">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-[#AD8A2E]/20">
                    <Smartphone className="w-4 h-4 text-[#B23B28]" />
                    <span className="font-serif font-bold text-sm text-[#2E2415]">
                      Android (Chrome / Brave)
                    </span>
                  </div>

                  <ol className="text-xs font-serif text-[#4A3B22] space-y-2 flex-1 pl-1">
                    <li className="flex items-start gap-1.5">
                      <span className="font-sans font-bold text-[#B23B28]">1.</span>
                      <span>
                        {language === 'vi'
                          ? 'Mở trang web trong trình duyệt Google Chrome hoặc Brave.'
                          : 'Open this website in Chrome or Brave.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-sans font-bold text-[#B23B28]">2.</span>
                      <span>
                        {language === 'vi' ? (
                          <>
                            Nhấn biểu tượng <strong className="text-[#7C2A1C]">ba chấm (⋮)</strong> ở góc trên bên phải màn hình.
                          </>
                        ) : (
                          <>
                            Tap the <strong className="text-[#7C2A1C]">three dots (⋮)</strong> menu at top right.
                          </>
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-sans font-bold text-[#B23B28]">3.</span>
                      <span>
                        {language === 'vi' ? (
                          <>
                            Chọn <strong className="text-[#7C2A1C]">"Cài đặt ứng dụng"</strong> hoặc <strong className="text-[#7C2A1C]">"Thêm vào Màn hình chính"</strong>.
                          </>
                        ) : (
                          <>
                            Select <strong className="text-[#7C2A1C]">"Install app"</strong> or <strong className="text-[#7C2A1C]">"Add to Home screen"</strong>.
                          </>
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-sans font-bold text-[#B23B28]">4.</span>
                      <span>
                        {language === 'vi'
                          ? 'Nhấn "Cài đặt" để biểu tượng Thao Fortune Teller xuất hiện trên máy.'
                          : 'Confirm "Install" to place the app on your home screen.'}
                      </span>
                    </li>
                  </ol>
                </div>

                {/* 3. Desktop / Laptop */}
                <div className="bg-white/85 border border-[#AD8A2E]/30 p-3.5 rounded-xs shadow-2xs space-y-2 flex flex-col">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-[#AD8A2E]/20">
                    <Laptop className="w-4 h-4 text-[#B23B28]" />
                    <span className="font-serif font-bold text-sm text-[#2E2415]">
                      Máy Tính (Chrome / Edge)
                    </span>
                  </div>

                  <ol className="text-xs font-serif text-[#4A3B22] space-y-2 flex-1 pl-1">
                    <li className="flex items-start gap-1.5">
                      <span className="font-sans font-bold text-[#B23B28]">1.</span>
                      <span>
                        {language === 'vi'
                          ? 'Mở trang web trong Google Chrome, Microsoft Edge hoặc Safari.'
                          : 'Open in Chrome, Edge, or desktop browser.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-sans font-bold text-[#B23B28]">2.</span>
                      <span>
                        {language === 'vi' ? (
                          <>
                            Nhìn vào <strong className="text-[#7C2A1C]">thanh địa chỉ URL</strong>, bấm biểu tượng <Download className="w-3 h-3 inline text-[#B23B28]" /> (Cài đặt ứng dụng).
                          </>
                        ) : (
                          <>
                            Look at the <strong className="text-[#7C2A1C]">URL address bar</strong>, click the <Download className="w-3 h-3 inline text-[#B23B28]" /> (Install) icon.
                          </>
                        )}
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-sans font-bold text-[#B23B28]">3.</span>
                      <span>
                        {language === 'vi'
                          ? 'Nhấn "Cài đặt" để mở app độc lập như một phần mềm máy tính.'
                          : 'Click "Install" to launch as a standalone desktop app.'}
                      </span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Benefits of Installing */}
            <div className="bg-[#EFE4CB]/70 border border-[#AD8A2E]/35 p-3.5 rounded-xs space-y-2">
              <h4 className="font-sans font-bold text-xs uppercase text-[#7C2A1C] tracking-wide">
                {language === 'vi' ? '✨ Lợi Ích Khi Cài Đặt Thao Fortune Teller' : '✨ Benefits of Installing'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-serif italic text-[#4A3B22]">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-green-700 flex-shrink-0" />
                  <span>{language === 'vi' ? 'Mở 1 chạm nhanh chóng' : 'Fast 1-tap launch'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-green-700 flex-shrink-0" />
                  <span>{language === 'vi' ? 'Trải nghiệm không viền thanh duyệt' : 'Immersive full-screen'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-green-700 flex-shrink-0" />
                  <span>{language === 'vi' ? 'Lắc điện thoại gieo quẻ cực nhạy' : 'Responsive motion shake'}</span>
                </div>
              </div>
            </div>

            {/* CTA Back to Reading */}
            <div className="pt-1 flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-[#B23B28] to-[#7C2A1C] hover:from-[#C8402C] hover:to-[#8E2F20] text-[#FFFDF9] font-sans font-bold text-xs uppercase tracking-wider rounded-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{language === 'vi' ? 'Trở Lại Sạp Bói' : 'Return to Fortune Stall'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: 64 HEXAGRAMS CODEX */}
        {activeTab === 'codex' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Bar */}
            <div className="px-5 py-2.5 bg-white/50 border-b border-[#AD8A2E]/25 flex items-center gap-2">
              <Search className="w-4 h-4 text-[#6E5C3E]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  language === 'vi'
                    ? 'Tìm theo số quẻ, tên quẻ, quái (Càn, Khôn, Thái, Bĩ...)...'
                    : 'Search hexagrams by number, name, or trigram...'
                }
                className="w-full bg-transparent text-sm font-sans focus:outline-none placeholder:text-[#6E5C3E]/60"
              />
            </div>

            {/* Main 2-Column Body */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              {/* Left: 64 Hexagrams Grid / List */}
              <div className="md:col-span-5 border-r border-[#AD8A2E]/30 p-3 overflow-y-auto max-h-[35vh] md:max-h-full space-y-1 bg-[#F7F0E1]/50">
                {filteredNumbers.length === 0 ? (
                  <div className="text-center py-6 font-serif italic text-sm text-[#6E5C3E]">
                    {language === 'vi' ? 'Không tìm thấy quẻ phù hợp' : 'No hexagram found'}
                  </div>
                ) : (
                  filteredNumbers.map((num) => {
                    const hex = dataset[String(num)];
                    const meta = HEXAGRAM_DATA[num];
                    const isSelected = num === selectedNum;

                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSelectedNum(num)}
                        className={`w-full text-left px-3 py-2 rounded-xs border transition-all flex items-center justify-between text-xs sm:text-sm cursor-pointer ${
                          isSelected
                            ? 'bg-[#B23B28] text-[#F7F0E1] border-[#7C2A1C] shadow-xs'
                            : 'bg-white/50 hover:bg-white/80 border-[#AD8A2E]/20 text-[#2E2415]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`font-mono font-bold ${isSelected ? 'text-[#E9CE84]' : 'text-[#B23B28]'}`}>
                            #{num}
                          </span>
                          <span className="font-serif font-medium truncate">
                            {language === 'vi' && meta ? meta.vietnameseName : hex?.english}
                          </span>
                        </div>
                        {meta?.chinese && (
                          <span className="font-serif text-sm opacity-85 ml-2">{meta.chinese}</span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Right: Selected Hexagram Detail */}
              <div className="md:col-span-7 p-4 sm:p-5 overflow-y-auto max-h-[50vh] md:max-h-full space-y-4 bg-white/40">
                {activeHex && activeMeta ? (
                  <>
                    <div className="flex items-start justify-between border-b border-[#AD8A2E]/30 pb-3">
                      <div>
                        <div className="text-xs font-sans uppercase tracking-widest text-[#B23B28] font-bold">
                          {language === 'vi' ? `Quẻ Số ${selectedNum}` : `Hexagram #${selectedNum}`}
                        </div>
                        <h3 className="font-serif font-bold text-xl text-[#2E2415]">
                          {language === 'vi' ? activeMeta.vietnameseName : activeHex.english}
                        </h3>
                        <div className="text-xs text-[#6E5C3E] font-sans mt-0.5">
                          {activeMeta.upperTrigram} &bull; {activeMeta.lowerTrigram} &bull; Hành {activeMeta.element}
                        </div>
                      </div>

                      <div className="text-3xl font-serif text-[#7C2A1C] px-3 py-1 bg-[#EFE4CB] border border-[#AD8A2E]/30 rounded-xs">
                        {activeMeta.chinese}
                      </div>
                    </div>

                    {/* Mini 6-line display */}
                    <div className="flex justify-center my-2">
                      <div className="flex flex-col-reverse gap-1.5 p-2.5 bg-[#F7F0E1] border border-[#AD8A2E]/30 rounded-xs">
                        {activeLines.map((isSolid, idx) => (
                          <div key={idx} className="w-24 h-2 flex items-center">
                            {isSolid ? (
                              <div className="w-full h-full bg-[#6E5C3E] rounded-xs" />
                            ) : (
                              <div className="w-full h-full flex justify-between">
                                <div className="w-[45%] h-full bg-[#6E5C3E] rounded-xs" />
                                <div className="w-[45%] h-full bg-[#6E5C3E] rounded-xs" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Classical Judgment */}
                    <div className="bg-[#F7F0E1] border-l-2 border-[#B23B28] p-3 rounded-r-xs">
                      <div className="text-xs font-sans uppercase font-bold text-[#AD8A2E]">
                        {language === 'vi' ? 'Phán Từ (Wilhelm Judgment)' : 'The Wilhelm Judgment'}
                      </div>
                      <p className="font-serif italic text-sm text-[#2E2415] mt-1 leading-relaxed">
                        "{activeHex.wilhelm_judgment?.text}"
                      </p>
                    </div>

                    {/* 6 Lines Description Accordion / List */}
                    <div className="space-y-2">
                      <div className="text-xs font-sans uppercase font-bold text-[#6E5C3E]">
                        {language === 'vi' ? 'Ý Nghĩa 6 Hào' : 'The 6 Changing Lines'}
                      </div>
                      <div className="space-y-1.5">
                        {[1, 2, 3, 4, 5, 6].map((lineNum) => {
                          const lineInfo = activeHex.wilhelm_lines?.[String(lineNum)];
                          return (
                            <div
                              key={lineNum}
                              className="text-xs p-2.5 rounded-xs bg-white/60 border border-[#AD8A2E]/20"
                            >
                              <span className="font-sans font-bold text-[#B23B28] mr-2">
                                {language === 'vi' ? `Hào ${lineNum}:` : `Line ${lineNum}:`}
                              </span>
                              <span className="font-serif italic text-[#2E2415]">
                                {lineInfo?.text || 'Standard line progression.'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action button: Consult this hexagram */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectHexagram(selectedNum);
                          onClose();
                        }}
                        className="w-full py-2 bg-[#7C2A1C] hover:bg-[#B23B28] text-[#F7F0E1] rounded-xs text-xs font-sans font-semibold tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{language === 'vi' ? 'Xem luận giải quẻ này' : 'Consult this Hexagram'}</span>
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

