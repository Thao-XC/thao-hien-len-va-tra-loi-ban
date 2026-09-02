import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Hand, Fan, Info, Compass, ShieldCheck } from 'lucide-react';
import { JadeFanIcon } from './JadeFanIcon';
import { BatQuaiIcon } from './BatQuaiIcon';

interface LadyThaoHandsFanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LadyThaoHandsFanModal: React.FC<LadyThaoHandsFanModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedNail, setSelectedNail] = useState<number | null>(null);

  const NAIL_LORE = [
    {
      finger: 'Ngón Cái (Tay Phải)',
      symbol: '☰',
      name: 'Càn (Thiên - Trời)',
      element: 'Kim / Thuần Dương',
      meaning: 'Chủ quyền lực, định hướng đại cục, trí tuệ sáng suốt và khởi đầu hanh thông.',
      color: 'bg-amber-100 text-amber-900 border-amber-400',
    },
    {
      finger: 'Ngón Trỏ (Tay Phải)',
      symbol: '☲',
      name: 'Ly (Hỏa - Lửa)',
      element: 'Hỏa / Ánh Sáng',
      meaning: 'Chủ thị phi, khai mở trực giác tâm linh, soi rọi tương lai và công danh hiển hách.',
      color: 'bg-rose-100 text-rose-900 border-rose-400',
    },
    {
      finger: 'Ngón Giữa (Tay Phải)',
      symbol: '☳',
      name: 'Chấn (Lôi - Sấm)',
      element: 'Mộc / Động Khí',
      meaning: 'Chủ biến cố bất ngờ, hành động quyết đoán, phá tan u tối và đón nhận thời cơ lớn.',
      color: 'bg-emerald-100 text-emerald-900 border-emerald-400',
    },
    {
      finger: 'Ngón Áp Út (Tay Phải)',
      symbol: '☴',
      name: 'Tốn (Phong - Gió)',
      element: 'Mộc / Nhu Thuận',
      meaning: 'Chủ tài lộc lan tỏa, sự khéo léo mềm mỏng, nhân duyên hòa hợp và quý nhân tương trợ.',
      color: 'bg-teal-100 text-teal-900 border-teal-400',
    },
    {
      finger: 'Ngón Út (Tay Phải)',
      symbol: '☱',
      name: 'Đoài (Trạch - Đầm)',
      element: 'Kim / Hỷ Lạc',
      meaning: 'Chủ khẩu tài giao tiếp, may mắn bất ngờ, niềm vui sum vầy và thu hoạch thắng lợi.',
      color: 'bg-orange-100 text-orange-900 border-orange-400',
    },
    {
      finger: 'Ngón Cái (Tay Trái)',
      symbol: '☷',
      name: 'Khôn (Địa - Đất)',
      element: 'Thổ / Thuần Âm',
      meaning: 'Chủ nền tảng vững chắc, đức tính bao dung, tích lũy điền sản và hậu vận an yên.',
      color: 'bg-yellow-100 text-yellow-900 border-yellow-400',
    },
    {
      finger: 'Ngón Giữa (Tay Trái)',
      symbol: '☵',
      name: 'Khảm (Thủy - Nước)',
      element: 'Thủy / Hiểm Trở',
      meaning: 'Chủ mưu lược sâu kín, vượt qua cạm bẫy trắc trở, dòng chảy tài lộc hanh thông.',
      color: 'bg-blue-100 text-blue-900 border-blue-400',
    },
    {
      finger: 'Ngón Trỏ (Tay Trái)',
      symbol: '☶',
      name: 'Cấn (Sơn - Núi)',
      element: 'Thổ / Tĩnh Lặng',
      meaning: 'Chủ điềm tĩnh giữ mình, biết dừng đúng lúc, kiên nhẫn tích đức và bảo toàn tài khí.',
      color: 'bg-stone-100 text-stone-900 border-stone-400',
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E3] to-[#F3E5CA] border-2 border-[#D4AF37] rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-10 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#D4AF37]/50 bg-gradient-to-r from-[#591008] via-[#7C180E] to-[#400702] text-[#FFE082]">
            <div className="flex items-center gap-2.5">
              <JadeFanIcon size={34} animate={true} />
              <div>
                <h2 className="font-serif font-bold text-base sm:text-lg tracking-tight flex items-center gap-1.5 text-[#FFE082]">
                  <span>Đôi Tay Quạt Ngọc & Móng Bát Quái</span>
                  <span className="text-xs text-[#FF9EAA]">🌸</span>
                </h2>
                <p className="text-[0.68rem] text-[#F3DE97] font-sans">
                  Tuyệt kỹ bói toán của Cô Thảo qua Thần Quạt & Ấn Bát Quái trên mười đầu ngón tay
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#FFE082] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 flex flex-col gap-4">
            {/* Top Showcase: Close-up Portrait Artwork */}
            <div className="relative w-full rounded-sm overflow-hidden border-2 border-[#D4AF37]/70 shadow-md bg-[#241308] group">
              <img
                src="/thao_hands_fan_nails.jpg"
                alt="Bàn tay Cô Thảo cầm quạt ngọc và vẽ móng Bát Quái"
                referrerPolicy="no-referrer"
                className="w-full h-64 sm:h-80 object-cover object-center transform group-hover:scale-102 transition-transform duration-700"
              />

              {/* Radiant Golden Corner Filigrees */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#FFE082]" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#FFE082]" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#FFE082]" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#FFE082]" />

              {/* Banner Badge Overlay */}
              <div className="absolute bottom-2 left-2 right-2 bg-[#2A0E0A]/85 backdrop-blur-xs p-2.5 rounded-xs border border-[#FFE082]/60 text-left">
                <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#FFE082]">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFE082]" />
                  <span>Quạt Ngọc Bích Cung Đình & Móng Tay Vẽ Linh Phù Bát Quái</span>
                </div>
                <p className="text-[0.72rem] text-[#F3DE97] font-serif italic mt-0.5 leading-relaxed">
                  "Mỗi đầu ngón tay của Thảo được điểm xuyết một quẻ đơn trong Bát Quái bằng bột chu sa và vàng lá, kết hợp cùng chiếc quạt ngọc bích để định khí, gom linh quang khi gieo quẻ xăm."
                </p>
              </div>
            </div>

            {/* Interactive Nail Art & Trigram Guide */}
            <div className="bg-[#FAF0DA] p-3.5 rounded-xs border border-[#D4AF37]/50 shadow-xs">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#D4AF37]/30">
                <div className="flex items-center gap-2">
                  <span className="text-base">💅</span>
                  <h3 className="font-serif font-bold text-sm text-[#7C2A1C] uppercase tracking-wider">
                    Ý Nghĩa Bát Quái Trên Mười Đầu Móng Tay
                  </h3>
                </div>
                <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-[#7C2A1C] text-[#FFE082] font-mono font-bold">
                  Bấm để xem
                </span>
              </div>

              {/* Grid of Nails */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {NAIL_LORE.map((nail, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedNail(selectedNail === idx ? null : idx)}
                    className={`p-2 rounded-xs border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedNail === idx
                        ? 'bg-[#7C180E] text-[#FFE082] border-[#FFE082] shadow-sm scale-102 ring-1 ring-[#FFE082]'
                        : `${nail.color} hover:brightness-95`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-lg leading-none">{nail.symbol}</span>
                      <span className="text-[0.6rem] font-sans font-semibold opacity-80 uppercase">{nail.element}</span>
                    </div>
                    <div className="mt-1 font-serif font-bold text-xs leading-tight">
                      {nail.name}
                    </div>
                    <div className="text-[0.62rem] opacity-75 mt-0.5 font-sans truncate">
                      {nail.finger}
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Nail Detail Box */}
              {selectedNail !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-gradient-to-r from-[#FFFDF9] to-[#FAF3E3] rounded-xs border-2 border-[#B23B28] text-left shadow-xs"
                >
                  <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#7C2A1C] mb-1">
                    <span className="text-base">{NAIL_LORE[selectedNail].symbol}</span>
                    <span>{NAIL_LORE[selectedNail].finger}: Quẻ {NAIL_LORE[selectedNail].name} ({NAIL_LORE[selectedNail].element})</span>
                  </div>
                  <p className="text-xs text-[#3E2D18] font-sans leading-relaxed">
                    {NAIL_LORE[selectedNail].meaning}
                  </p>
                </motion.div>
              )}
            </div>

            {/* 3 Modes Explanation */}
            <div className="bg-[#EFE4CB]/70 p-3 rounded-xs border border-[#AD8A2E]/40 text-left">
              <h4 className="font-serif font-bold text-xs text-[#7C2A1C] mb-1 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#B23B28]" />
                <span>3 Chế Độ Lắc Ống Xăm Tại Sạp Bói:</span>
              </h4>
              <ul className="text-[0.72rem] text-[#4A3B22] font-sans space-y-1 pl-1">
                <li>• <strong>📱 Lắc Bằng Điện Thoại</strong>: Sử dụng cảm biến gia tốc thực trên điện thoại của bạn.</li>
                <li>• <strong>⚡ Tự Động Lắc</strong>: Hệ thống mô phỏng rung lắc nhịp điệu nhanh và chuẩn xác.</li>
                <li>• <strong>🌸 Cô Thảo Lắc Dùm</strong>: Đôi tay thon thả của Cô Thảo với móng vẽ Bát Quái sẽ ôm lấy ống xăm và lắc linh nghiệm cho bạn!</li>
              </ul>
            </div>
          </div>

          {/* Footer Close */}
          <div className="px-4 py-3 border-t border-[#D4AF37]/40 bg-[#FAF3E3] flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xs bg-gradient-to-b from-[#B23B28] to-[#7C2A1C] hover:from-[#C8402C] hover:to-[#8E2F20] text-[#FFE082] font-serif font-bold text-xs tracking-wider border border-[#FFE082]/60 shadow-xs cursor-pointer"
            >
              Đã Hiểu & Quay Lại Sạp Bói
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
