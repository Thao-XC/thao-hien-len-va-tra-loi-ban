import React, { useState } from 'react';
import { Hexagram } from '../types';
import { HEXAGRAM_DATA, getHexagramLines, getTransformedHexagram } from '../utils/hexagramPatterns';
import { BookOpen, Compass, Layers, ArrowRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface HexagramVisualizerProps {
  que: number;
  hao: number;
  hexagram: Hexagram;
  language: 'en' | 'vi';
}

export const HexagramVisualizer: React.FC<HexagramVisualizerProps> = ({
  que,
  hao,
  hexagram,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'triad' | 'primary' | 'line' | 'transformed'>('triad');
  const metaPrimary = HEXAGRAM_DATA[que];
  const primaryLines = getHexagramLines(que);

  // Compute Transformed Hexagram (Quẻ Biến)
  const transformed = getTransformedHexagram(que, hao);
  const metaTransformed = transformed ? transformed.meta : null;
  const transformedLines = transformed ? transformed.transformedLines : primaryLines;

  const judgmentPrimary = hexagram.wilhelm_judgment?.text || '';
  const lineText = hexagram.wilhelm_lines?.[String(hao)]?.text || '';

  return (
    <div className="w-full bg-[#FAF4E6]/95 border border-[#AD8A2E]/40 p-4 sm:p-5 shadow-[0_8px_24px_rgba(46,36,21,0.08)] rounded-xs my-3 relative overflow-hidden">
      {/* Traditional Watermark Background */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#B23B28]">
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M50 5 A 45 45 0 0 0 50 95 A 22.5 22.5 0 0 1 50 50 A 22.5 22.5 0 0 0 50 5" />
        </svg>
      </div>

      {/* Header: I Ching Triad Title */}
      <div className="text-center mb-4 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B23B28]/10 text-[#B23B28] font-sans text-xs font-bold uppercase tracking-wider mb-1.5 border border-[#B23B28]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#B23B28]" />
          <span>{language === 'vi' ? 'QUẺ KINH DỊCH ĐÃ GIEO' : 'I CHING READING TRIAD'}</span>
          <Sparkles className="w-3.5 h-3.5 text-[#B23B28]" />
        </div>
        <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#2E2415]">
          {language === 'vi'
            ? `${metaPrimary?.vietnameseName || ''} · Hào ${hao} Động`
            : `${hexagram.english} · Line ${hao} Active`}
        </h2>
        <div className="font-sans text-xs text-[#AD8A2E] font-semibold mt-0.5 tracking-wide">
          {language === 'vi'
            ? `Quẻ Chủ (#${que}) ➔ Hào Động (${hao}) ➔ Quẻ Biến (#${transformed?.number || '?'})`
            : `Primary (#${que}) ➔ Line (${hao}) ➔ Transformed (#${transformed?.number || '?'})`}
        </div>
      </div>

      {/* Triad Dual Visualizer (Quẻ Chủ vs Quẻ Biến) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch my-4 relative z-10">
        {/* Left Column: QUẺ CHỦ (Primary Hexagram) */}
        <div className="bg-[#FFFDF9] border border-[#AD8A2E]/30 rounded-xs p-3.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-[#AD8A2E]/20 pb-1.5 mb-2">
              <span className="text-xs font-sans font-bold text-[#7C2A1C] uppercase tracking-wider">
                {language === 'vi' ? '1. Quẻ Chủ (Hiện Trạng)' : '1. Primary Que (Present)'}
              </span>
              <span className="text-xs font-serif font-bold text-[#AD8A2E]">
                #{que} {metaPrimary?.chinese}
              </span>
            </div>
            <div className="font-serif font-bold text-base text-[#2E2415]">
              {language === 'vi' ? metaPrimary?.vietnameseName : hexagram.english}
            </div>
            {metaPrimary && (
              <div className="text-[0.72rem] font-sans text-[#6E5C3E] my-1">
                {language === 'vi'
                  ? `Thượng: ${metaPrimary.upperTrigram} | Hạ: ${metaPrimary.lowerTrigram} | Hành ${metaPrimary.element}`
                  : `Upper: ${metaPrimary.upperTrigram} | Lower: ${metaPrimary.lowerTrigram} | ${metaPrimary.element}`}
              </div>
            )}
          </div>

          {/* 6 Lines of Primary Hexagram */}
          <div className="flex flex-col-reverse gap-1.5 p-3 bg-[#FAF4E6]/80 border border-[#AD8A2E]/25 rounded-xs mt-2.5">
            {primaryLines.map((isSolid, idx) => {
              const lineNum = idx + 1;
              const isHaoActive = lineNum === hao;
              return (
                <div key={lineNum} className="flex items-center gap-2">
                  <span className={`text-[0.68rem] font-sans font-bold w-3 text-right ${isHaoActive ? 'text-[#B23B28]' : 'text-[#6E5C3E]/60'}`}>
                    {lineNum}
                  </span>
                  <div className="flex-1 h-3 flex items-center">
                    {isSolid ? (
                      <div className={`w-full h-full rounded-xs transition-all ${isHaoActive ? 'bg-[#B23B28] shadow-[0_0_8px_rgba(178,59,40,0.7)]' : 'bg-[#6E5C3E]'}`} />
                    ) : (
                      <div className="w-full h-full flex justify-between">
                        <div className={`w-[44%] h-full rounded-xs transition-all ${isHaoActive ? 'bg-[#B23B28] shadow-[0_0_8px_rgba(178,59,40,0.7)]' : 'bg-[#6E5C3E]'}`} />
                        <div className={`w-[44%] h-full rounded-xs transition-all ${isHaoActive ? 'bg-[#B23B28] shadow-[0_0_8px_rgba(178,59,40,0.7)]' : 'bg-[#6E5C3E]'}`} />
                      </div>
                    )}
                  </div>
                  <span className="w-16 text-right text-[0.65rem] font-sans font-bold">
                    {isHaoActive ? (
                      <span className="text-[#B23B28] animate-pulse">
                        ⚡ {language === 'vi' ? 'Hào Động' : 'Active'}
                      </span>
                    ) : (
                      <span className="text-[#6E5C3E]/50 font-normal">
                        {isSolid ? (language === 'vi' ? 'Dương' : 'Yang') : (language === 'vi' ? 'Âm' : 'Yin')}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: QUẺ BIẾN (Transformed Hexagram) */}
        {transformed && metaTransformed && (
          <div className="bg-[#FFFDF9] border border-[#2E7D32]/35 rounded-xs p-3.5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between border-b border-[#2E7D32]/20 pb-1.5 mb-2">
                <span className="text-xs font-sans font-bold text-[#2E7D32] uppercase tracking-wider">
                  {language === 'vi' ? '2. Quẻ Biến (Xu Thế Tương Lai)' : '2. Transformed Que (Future)'}
                </span>
                <span className="text-xs font-serif font-bold text-[#2E7D32]">
                  #{transformed.number} {metaTransformed.chinese}
                </span>
              </div>
              <div className="font-serif font-bold text-base text-[#1B5E20]">
                {language === 'vi' ? metaTransformed.vietnameseName : `Hexagram ${transformed.number} (${metaTransformed.chinese})`}
              </div>
              <div className="text-[0.72rem] font-sans text-[#4E6B4A] my-1">
                {language === 'vi'
                  ? `Thượng: ${metaTransformed.upperTrigram} | Hạ: ${metaTransformed.lowerTrigram} | Hành ${metaTransformed.element}`
                  : `Upper: ${metaTransformed.upperTrigram} | Lower: ${metaTransformed.lowerTrigram} | ${metaTransformed.element}`}
              </div>
            </div>

            {/* 6 Lines of Transformed Hexagram */}
            <div className="flex flex-col-reverse gap-1.5 p-3 bg-[#E8F5E9]/60 border border-[#2E7D32]/25 rounded-xs mt-2.5">
              {transformedLines.map((isSolid, idx) => {
                const lineNum = idx + 1;
                const wasChanged = lineNum === hao;
                return (
                  <div key={lineNum} className="flex items-center gap-2">
                    <span className={`text-[0.68rem] font-sans font-bold w-3 text-right ${wasChanged ? 'text-[#2E7D32]' : 'text-[#4E6B4A]/60'}`}>
                      {lineNum}
                    </span>
                    <div className="flex-1 h-3 flex items-center">
                      {isSolid ? (
                        <div className={`w-full h-full rounded-xs transition-all ${wasChanged ? 'bg-[#2E7D32] shadow-[0_0_8px_rgba(46,125,50,0.7)]' : 'bg-[#4E6B4A]'}`} />
                      ) : (
                        <div className="w-full h-full flex justify-between">
                          <div className={`w-[44%] h-full rounded-xs transition-all ${wasChanged ? 'bg-[#2E7D32] shadow-[0_0_8px_rgba(46,125,50,0.7)]' : 'bg-[#4E6B4A]'}`} />
                          <div className={`w-[44%] h-full rounded-xs transition-all ${wasChanged ? 'bg-[#2E7D32] shadow-[0_0_8px_rgba(46,125,50,0.7)]' : 'bg-[#4E6B4A]'}`} />
                        </div>
                      )}
                    </div>
                    <span className="w-16 text-right text-[0.65rem] font-sans font-bold">
                      {wasChanged ? (
                        <span className="text-[#2E7D32]">
                          ✨ {language === 'vi' ? 'Đã Biến' : 'Transformed'}
                        </span>
                      ) : (
                        <span className="text-[#4E6B4A]/50 font-normal">
                          {isSolid ? (language === 'vi' ? 'Dương' : 'Yang') : (language === 'vi' ? 'Âm' : 'Yin')}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Classical Text Accordion Grounding (Wilhelm / Baynes) */}
      <div className="mt-4 bg-[#FFFDF9] border border-[#AD8A2E]/35 rounded-xs p-3.5 shadow-xs space-y-3 relative z-10">
        {/* Thoán Từ Quẻ Chủ */}
        <div>
          <div className="flex items-center gap-1.5 text-[0.72rem] font-sans uppercase font-bold tracking-wider text-[#7C2A1C] mb-1">
            <BookOpen className="w-3.5 h-3.5 text-[#B23B28]" />
            <span>
              {language === 'vi'
                ? `Thoán Từ Quẻ Chủ #${que} (${metaPrimary?.vietnameseName || ''})`
                : `Primary Judgment (Hexagram #${que})`}
            </span>
          </div>
          <p className="font-serif italic text-[#2E2415] text-xs sm:text-sm leading-relaxed pl-3 border-l-2 border-[#B23B28]/60">
            "{judgmentPrimary}"
          </p>
        </div>

        {/* Lời Hào Động */}
        <div className="pt-2 border-t border-[#AD8A2E]/20">
          <div className="flex items-center gap-1.5 text-[0.72rem] font-sans uppercase font-bold tracking-wider text-[#B23B28] mb-1">
            <Layers className="w-3.5 h-3.5 text-[#B23B28]" />
            <span>
              {language === 'vi'
                ? `Lời Hào Động ${hao} (Điểm Mấu Chốt Chuyển Hóa)`
                : `Changing Line ${hao} Text`}
            </span>
          </div>
          <p className="font-serif italic text-[#7C2A1C] text-xs sm:text-sm leading-relaxed font-semibold pl-3 border-l-2 border-[#B23B28]">
            "{lineText}"
          </p>
        </div>
      </div>
    </div>
  );
};
