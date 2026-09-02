import React, { useState, useEffect } from 'react';
import { HexagramDataset } from '../types';
import { HEXAGRAM_DATA, getHexagramLines } from '../utils/hexagramPatterns';
import { VIETNAMESE_HEXAGRAMS } from '../data/vietnameseHexagrams';
import { LadyThaoAvatar } from './LadyThaoAvatar';
import { JadeFanIcon } from './JadeFanIcon';
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
  language?: 'vi';
  onSelectHexagram: (que: number) => void;
  initialTab?: 'instructions' | 'install' | 'codex';
}

export const HexagramCodexModal: React.FC<HexagramCodexModalProps> = ({
  isOpen,
  onClose,
  dataset,
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
    const viet = VIETNAMESE_HEXAGRAMS[num];
    const term = searchTerm.toLowerCase();

    return (
      String(num).includes(term) ||
      (viet && viet.name.toLowerCase().includes(term)) ||
      (meta && meta.vietnameseName.toLowerCase().includes(term)) ||
      (meta && meta.chinese.includes(term)) ||
      (meta && meta.upperTrigram.toLowerCase().includes(term)) ||
      (meta && meta.lowerTrigram.toLowerCase().includes(term))
    );
  });

  const activeHex = dataset[String(selectedNum)];
  const activeMeta = HEXAGRAM_DATA[selectedNum];
  const activeViet = VIETNAMESE_HEXAGRAMS[selectedNum] || VIETNAMESE_HEXAGRAMS[1];
  const activeLines = getHexagramLines(selectedNum);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-[#FBF5E8] to-[#F3E7D0] border-2 border-[#AD8A2E] shadow-2xl rounded-xs flex flex-col overflow-hidden text-[#2E2415]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[#AD8A2E]/40 bg-[#EFE4CB]/90">
          <div className="flex items-center gap-2.5">
            <JadeFanIcon size={34} />
            <LadyThaoAvatar sizeClassName="w-8 h-8" />
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#7C2A1C] tracking-tight leading-tight">
                Sạp Bói Cô Thảo
              </h2>
              <p className="font-sans text-[0.68rem] text-[#6E5C3E] uppercase tracking-wider">
                Kinh Dịch Cổ Truyền 64 Quẻ & Hướng Dẫn
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xs hover:bg-[#B23B28]/10 text-[#6E5C3E] hover:text-[#B23B28] transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
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
            <span>📜 Hướng Dẫn Xin Quẻ</span>
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
            <span>📲 Cài Đặt Ứng Dụng</span>
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
            <BookOpen className="w-3.5 h-3.5 text-[#B23B28]" />
            <span>📖 Tra Cứu 64 Quẻ</span>
          </button>
        </div>

        {/* TAB 1: INSTRUCTIONS */}
        {activeTab === 'instructions' && (
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh] space-y-4">
            <div className="border-l-2 border-[#B23B28] pl-3 py-1 bg-[#EFE4CB]/50">
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#7C2A1C]">
                Đạo Khai Quẻ & Nghi Thức Tâm Thành
              </h3>
              <p className="font-serif italic text-xs sm:text-sm text-[#4A3B22] mt-0.5">
                "Tâm thành tất ứng · Vạn sự tùy duyên · Thấu suốt âm dương"
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/80 p-3.5 rounded-xs border border-[#AD8A2E]/30 shadow-2xs space-y-1.5">
                <div className="w-7 h-7 rounded-full bg-[#B23B28] text-[#FFFDF9] font-sans font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h4 className="font-serif font-bold text-sm text-[#7C2A1C]">Nhập Câu Hỏi</h4>
                <p className="font-serif text-xs text-[#4A3B22] leading-relaxed">
                  Nhập rõ điều bạn băn khoăn (công việc, tài lộc, tình cảm, hay một quyết định cụ thể).
                </p>
              </div>

              <div className="bg-white/80 p-3.5 rounded-xs border border-[#AD8A2E]/30 shadow-2xs space-y-1.5">
                <div className="w-7 h-7 rounded-full bg-[#B23B28] text-[#FFFDF9] font-sans font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <h4 className="font-serif font-bold text-sm text-[#7C2A1C]">Lắc Ống Xăm</h4>
                <p className="font-serif text-xs text-[#4A3B22] leading-relaxed">
                  Bấm nút Lắc Ống Xăm hoặc lắc chiếc điện thoại của bạn để rút ra một thẻ xăm ngẫu nhiên chuẩn xác.
                </p>
              </div>

              <div className="bg-white/80 p-3.5 rounded-xs border border-[#AD8A2E]/30 shadow-2xs space-y-1.5">
                <div className="w-7 h-7 rounded-full bg-[#B23B28] text-[#FFFDF9] font-sans font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <h4 className="font-serif font-bold text-sm text-[#7C2A1C]">Khai Mành Luận Giải</h4>
                <p className="font-serif text-xs text-[#4A3B22] leading-relaxed">
                  Diện kiến Cô Thảo, lắng nghe phân tích Quẻ Chủ, Hào Động, Quẻ Biến và trò chuyện trực tiếp để thấu suốt hướng đi.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-[#B23B28] to-[#7C2A1C] hover:from-[#C8402C] hover:to-[#8E2F20] text-[#FFFDF9] font-sans font-bold text-xs uppercase tracking-wider rounded-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Bắt Đầu Xin Quẻ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: INSTALL APP PWA */}
        {activeTab === 'install' && (
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh] space-y-4">
            <div className="bg-white/90 border border-[#AD8A2E]/40 p-4 rounded-xs shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#B23B28] to-[#7C2A1C] flex items-center justify-center text-[#FFE082] shadow-sm border border-[#FFE082]/40 flex-shrink-0">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#7C2A1C]">
                    Cài Đặt Sạp Bói Cô Thảo Lên Màn Hình Chính
                  </h3>
                  <p className="font-serif text-xs text-[#6E5C3E]">
                    Mở 1 chạm nhanh chóng, dùng offline mượt mà không cần mở trình duyệt
                  </p>
                </div>
              </div>

              {deferredPrompt && !isInstalled && (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="px-5 py-2.5 bg-[#B23B28] hover:bg-[#7C2A1C] text-[#FFFDF9] font-sans font-bold text-xs uppercase tracking-wider rounded-xs shadow-md transition-all flex items-center gap-2 cursor-pointer flex-shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Cài Đặt Ngay</span>
                </button>
              )}

              {isInstalled && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-sans font-semibold border border-green-300">
                  <CheckCircle2 className="w-4 h-4 text-green-700" />
                  <span>Đã cài đặt</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* iOS Safari */}
              <div className="bg-white/80 p-4 rounded-xs border border-[#AD8A2E]/30 space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#7C2A1C]">
                  <Smartphone className="w-4 h-4 text-[#B23B28]" />
                  <span>Dành cho iPhone / iPad (Safari)</span>
                </div>
                <ol className="text-xs font-serif text-[#4A3B22] space-y-1.5 pl-4 list-decimal">
                  <li>Mở ứng dụng trên trình duyệt <strong className="text-[#7C2A1C]">Safari</strong>.</li>
                  <li>Bấm vào biểu tượng <strong className="text-[#7C2A1C]">Chia sẻ (Share)</strong> ở thanh dưới cùng.</li>
                  <li>Chọn <strong className="text-[#7C2A1C]">"Thêm vào Màn hình chính" (Add to Home Screen)</strong>.</li>
                </ol>
              </div>

              {/* Android Chrome */}
              <div className="bg-white/80 p-4 rounded-xs border border-[#AD8A2E]/30 space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#7C2A1C]">
                  <Smartphone className="w-4 h-4 text-[#B23B28]" />
                  <span>Dành cho Android (Google Chrome)</span>
                </div>
                <ol className="text-xs font-serif text-[#4A3B22] space-y-1.5 pl-4 list-decimal">
                  <li>Mở ứng dụng trong trình duyệt <strong className="text-[#7C2A1C]">Google Chrome</strong>.</li>
                  <li>Bấm vào biểu tượng <strong className="text-[#7C2A1C]">3 dấu chấm (Menu)</strong> ở góc trên bên phải.</li>
                  <li>Chọn <strong className="text-[#7C2A1C]">"Cài đặt ứng dụng"</strong> hoặc <strong className="text-[#7C2A1C]">"Thêm vào Màn hình chính"</strong>.</li>
                </ol>
              </div>
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
                placeholder="Tìm theo số quẻ, tên quẻ (Càn, Khôn, Thái, Bĩ, Đỉnh...)..."
                className="w-full bg-transparent text-sm font-sans focus:outline-none placeholder:text-[#6E5C3E]/60"
              />
            </div>

            {/* Main 2-Column Body */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              {/* Left: 64 Hexagrams Grid / List */}
              <div className="md:col-span-5 border-r border-[#AD8A2E]/30 p-3 overflow-y-auto max-h-[35vh] md:max-h-full space-y-1 bg-[#F7F0E1]/50">
                {filteredNumbers.length === 0 ? (
                  <div className="text-center py-6 font-serif italic text-sm text-[#6E5C3E]">
                    Không tìm thấy quẻ phù hợp
                  </div>
                ) : (
                  filteredNumbers.map((num) => {
                    const meta = HEXAGRAM_DATA[num];
                    const viet = VIETNAMESE_HEXAGRAMS[num];
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
                            {viet?.name || meta?.vietnameseName}
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
                {activeViet && activeMeta ? (
                  <>
                    <div className="flex items-start justify-between border-b border-[#AD8A2E]/30 pb-3">
                      <div>
                        <div className="text-xs font-sans uppercase tracking-widest text-[#B23B28] font-bold">
                          Quẻ Số #{selectedNum}
                        </div>
                        <h3 className="font-serif font-bold text-xl text-[#2E2415]">
                          {activeViet.name}
                        </h3>
                        <div className="text-xs text-[#6E5C3E] font-sans mt-0.5">
                          Tượng: {activeViet.symbol} &bull; Hành {activeViet.element}
                        </div>
                      </div>

                      <div className="text-3xl font-serif text-[#7C2A1C] px-3 py-1 bg-[#EFE4CB] border border-[#AD8A2E]/30 rounded-xs">
                        {activeViet.chinese}
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

                    {/* Thoán Từ */}
                    <div className="bg-[#F7F0E1] border-l-2 border-[#B23B28] p-3 rounded-r-xs">
                      <div className="text-xs font-sans uppercase font-bold text-[#AD8A2E]">
                        Thoán Từ
                      </div>
                      <p className="font-serif italic text-sm text-[#2E2415] mt-1 leading-relaxed">
                        "{activeViet.thoanTu}"
                      </p>
                    </div>

                    {/* Ý Nghĩa & Tượng Truyện */}
                    <div className="space-y-1 text-xs text-[#2E2415] bg-white/60 p-3 border border-[#AD8A2E]/20 rounded-xs">
                      <div className="font-sans font-bold text-[#7C2A1C] uppercase">Ý Nghĩa Tổng Thể:</div>
                      <p className="font-serif">{activeViet.meaning}</p>
                      <div className="font-sans font-bold text-[#7C2A1C] uppercase pt-1">Tượng Truyện:</div>
                      <p className="font-serif italic">{activeViet.tuongTruyen}</p>
                    </div>

                    {/* 6 Lines Description */}
                    <div className="space-y-2">
                      <div className="text-xs font-sans uppercase font-bold text-[#6E5C3E]">
                        Ý Nghĩa 6 Hào
                      </div>
                      <div className="space-y-1.5">
                        {[1, 2, 3, 4, 5, 6].map((lineNum) => {
                          const lineInfo = activeViet.haoTu[lineNum];
                          return (
                            <div
                              key={lineNum}
                              className="text-xs p-2.5 rounded-xs bg-white/60 border border-[#AD8A2E]/20"
                            >
                              <span className="font-sans font-bold text-[#B23B28] mr-2">
                                Hào {lineNum}:
                              </span>
                              <span className="font-serif italic text-[#2E2415]">
                                {lineInfo || 'Đang diễn tiến.'}
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
                        <span>Xem luận giải quẻ này</span>
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
