import React, { useState } from 'react';
import { HexagramDataset } from '../types';
import { HEXAGRAM_DATA, getHexagramLines } from '../utils/hexagramPatterns';
import { Search, X, BookOpen, Layers, Sparkles, Smartphone, Compass, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface HexagramCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: HexagramDataset;
  language: 'en' | 'vi';
  onSelectHexagram: (que: number) => void;
  initialTab?: 'instructions' | 'codex';
}

export const HexagramCodexModal: React.FC<HexagramCodexModalProps> = ({
  isOpen,
  onClose,
  dataset,
  language,
  onSelectHexagram,
  initialTab = 'instructions',
}) => {
  const [activeTab, setActiveTab] = useState<'instructions' | 'codex'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNum, setSelectedNum] = useState<number>(1);

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
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-[#B23B28]/15 border border-[#B23B28]/30">
              <BookOpen className="w-4 h-4 text-[#B23B28]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg text-[#7C2A1C] tracking-tight leading-tight">
                {language === 'vi' ? 'Bảo Điển Sạp Bói Thảo' : "Lady Thao's Sacred Codex"}
              </h2>
              <p className="font-sans text-[0.68rem] text-[#6E5C3E] uppercase tracking-wider">
                {language === 'vi' ? 'Hướng dẫn xin quẻ & Kinh Dịch Toàn Thư' : 'Oracle Instructions & 64 Hexagrams'}
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

        {/* Navigation Tabs (Instructions vs 64 Hexagrams) */}
        <div className="flex border-b border-[#AD8A2E]/30 bg-[#E8DCBF]/60 px-4 sm:px-5 gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('instructions')}
            className={`pb-2 px-3 text-xs sm:text-sm font-sans font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'instructions'
                ? 'border-[#B23B28] text-[#7C2A1C]'
                : 'border-transparent text-[#6E5C3E] hover:text-[#2E2415]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#B23B28]" />
            <span>{language === 'vi' ? '📜 Hướng Dẫn Xin Quẻ' : '📜 How to Consult'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('codex')}
            className={`pb-2 px-3 text-xs sm:text-sm font-sans font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'codex'
                ? 'border-[#B23B28] text-[#7C2A1C]'
                : 'border-transparent text-[#6E5C3E] hover:text-[#2E2415]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#B23B28]" />
            <span>{language === 'vi' ? '📖 64 Quẻ Toàn Thư' : '📖 64 Hexagrams Codex'}</span>
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
                  ? 'Sạp Bói Thảo kết hợp tinh hoa bói xăm dân gian Việt Nam với 64 Quẻ Kinh Dịch cổ truyền theo bản dịch chuẩn Wilhelm-Baynes, giúp bạn thấu suốt hiện tại và tìm ra định hướng sáng suốt.'
                  : 'Lady Thao blends traditional Vietnamese temple fortune sticks with the 64 classical I Ching hexagrams (Wilhelm-Baynes translation) to illuminate your present circumstance and future trajectory.'}
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

            {/* Start Consulting CTA Button */}
            <div className="pt-1 flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-[#B23B28] to-[#7C2A1C] hover:from-[#C8402C] hover:to-[#8E2F20] text-[#FFFDF9] font-sans font-bold text-xs uppercase tracking-wider rounded-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{language === 'vi' ? 'Bắt Đầu Xin Quẻ Ngay' : 'Start Consultation Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: 64 HEXAGRAMS CODEX */}
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

