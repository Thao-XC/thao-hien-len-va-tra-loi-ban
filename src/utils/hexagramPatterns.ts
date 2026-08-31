/**
 * Classical King Wen 64 Hexagram line definitions (lines 1 to 6, bottom to top: true = Yang ⚊, false = Yin ⚋)
 * and Vietnamese traditional names.
 */

export interface HexagramMeta {
  number: number;
  lines: [boolean, boolean, boolean, boolean, boolean, boolean]; // Line 1 (bottom) to Line 6 (top)
  vietnameseName: string;
  chinese: string;
  upperTrigram: string;
  lowerTrigram: string;
  element: string;
}

export const HEXAGRAM_DATA: Record<number, HexagramMeta> = {
  1: { number: 1, lines: [true, true, true, true, true, true], vietnameseName: 'Thuần Càn (Trời)', chinese: '乾', upperTrigram: 'Càn (Trời)', lowerTrigram: 'Càn (Trời)', element: 'Kim' },
  2: { number: 2, lines: [false, false, false, false, false, false], vietnameseName: 'Thuần Khôn (Đất)', chinese: '坤', upperTrigram: 'Khôn (Đất)', lowerTrigram: 'Khôn (Đất)', element: 'Thổ' },
  3: { number: 3, lines: [true, false, false, false, true, false], vietnameseName: 'Thủy Lôi Truân (Khởi Đầu Gian Nan)', chinese: '屯', upperTrigram: 'Khảm (Nước)', lowerTrigram: 'Chấn (Sấm)', element: 'Thủy' },
  4: { number: 4, lines: [false, true, false, false, false, true], vietnameseName: 'Sơn Thủy Mông (Ấu Thơ Mở Mang)', chinese: '蒙', upperTrigram: 'Cấn (Núi)', lowerTrigram: 'Khảm (Nước)', element: 'Hỏa' },
  5: { number: 5, lines: [true, true, true, false, true, false], vietnameseName: 'Thủy Thiên Nhu (Chờ Đợi Thời Cơ)', chinese: '需', upperTrigram: 'Khảm (Nước)', lowerTrigram: 'Càn (Trời)', element: 'Kim' },
  6: { number: 6, lines: [false, true, false, true, true, true], vietnameseName: 'Thiên Thủy Tụng (Tranh Chấp Kiện Cáo)', chinese: '訟', upperTrigram: 'Càn (Trời)', lowerTrigram: 'Khảm (Nước)', element: 'Kim' },
  7: { number: 7, lines: [false, true, false, false, false, false], vietnameseName: 'Địa Thủy Sư (Quân Đội Tập Hợp)', chinese: '師', upperTrigram: 'Khôn (Đất)', lowerTrigram: 'Khảm (Nước)', element: 'Thủy' },
  8: { number: 8, lines: [false, false, false, false, true, false], vietnameseName: 'Thủy Địa Tỷ (Gắn Kết Thân Ái)', chinese: '比', upperTrigram: 'Khảm (Nước)', lowerTrigram: 'Khôn (Đất)', element: 'Thủy' },
  9: { number: 9, lines: [true, true, true, false, true, true], vietnameseName: 'Phong Thiên Tiểu Súc (Tích Lũy Nhỏ)', chinese: '小畜', upperTrigram: 'Tốn (Gió)', lowerTrigram: 'Càn (Trời)', element: 'Mộc' },
  10: { number: 10, lines: [true, true, false, true, true, true], vietnameseName: 'Thiên Trạch Lý (Lễ Nghi Cẩn Trọng)', chinese: '履', upperTrigram: 'Càn (Trời)', lowerTrigram: 'Đoài (Hồ)', element: 'Thổ' },
  11: { number: 11, lines: [true, true, true, false, false, false], vietnameseName: 'Địa Thiên Thái (Thông Suốt Thái Bình)', chinese: '泰', upperTrigram: 'Khôn (Đất)', lowerTrigram: 'Càn (Trời)', element: 'Thổ' },
  12: { number: 12, lines: [false, false, false, true, true, true], vietnameseName: 'Thiên Địa Bĩ (Bế Tắc Trắc Trở)', chinese: '否', upperTrigram: 'Càn (Trời)', lowerTrigram: 'Khôn (Đất)', element: 'Kim' },
  13: { number: 13, lines: [true, false, true, true, true, true], vietnameseName: 'Thiên Hỏa Đồng Nhân (Đoàn Kết Đồng Tâm)', chinese: '同人', upperTrigram: 'Càn (Trời)', lowerTrigram: 'Ly (Lửa)', element: 'Kim' },
  14: { number: 14, lines: [true, true, true, true, false, true], vietnameseName: 'Hỏa Thiên Đại Hữu (Sở Hữu Lớn Lao)', chinese: '大有', upperTrigram: 'Ly (Lửa)', lowerTrigram: 'Càn (Trời)', element: 'Kim' },
  15: { number: 15, lines: [false, false, true, false, false, false], vietnameseName: 'Địa Sơn Khiêm (Khiêm Tốn Nhún Nhường)', chinese: '謙', upperTrigram: 'Khôn (Đất)', lowerTrigram: 'Cấn (Núi)', element: 'Kim' },
  16: { number: 16, lines: [false, false, false, true, false, false], vietnameseName: 'Lôi Địa Dự (Vui Vẻ Thuận Lòng)', chinese: '豫', upperTrigram: 'Chấn (Sấm)', lowerTrigram: 'Khôn (Đất)', element: 'Mộc' },
  17: { number: 17, lines: [true, false, false, true, true, false], vietnameseName: 'Trạch Lôi Tùy (Tùy Thuận Thời Thế)', chinese: '隨', upperTrigram: 'Đoài (Hồ)', lowerTrigram: 'Chấn (Sấm)', element: 'Mộc' },
  18: { number: 18, lines: [false, true, true, false, false, true], vietnameseName: 'Sơn Phong Cổ (Sửa Chữa Sai Lầm)', chinese: '蠱', upperTrigram: 'Cấn (Núi)', lowerTrigram: 'Tốn (Gió)', element: 'Mộc' },
  19: { number: 19, lines: [true, true, false, false, false, false], vietnameseName: 'Địa Trạch Lâm (Tiếp Cận Đến Gần)', chinese: '臨', upperTrigram: 'Khôn (Đất)', lowerTrigram: 'Đoài (Hồ)', element: 'Kim' },
  20: { number: 20, lines: [false, false, false, false, true, true], vietnameseName: 'Phong Địa Quan (Quan Sát Tĩnh Lặng)', chinese: '觀', upperTrigram: 'Tốn (Gió)', lowerTrigram: 'Khôn (Đất)', element: 'Kim' },
  21: { number: 21, lines: [true, false, false, true, false, true], vietnameseName: 'Hỏa Lôi Phệ Hạp (Cắn Xuyên Trở Ngại)', chinese: '噬嗑', upperTrigram: 'Ly (Lửa)', lowerTrigram: 'Chấn (Sấm)', element: 'Mộc' },
  22: { number: 22, lines: [true, false, true, false, false, true], vietnameseName: 'Sơn Hỏa Bí (Trang Hoàng Vẻ Đẹp)', chinese: '賁', upperTrigram: 'Cấn (Núi)', lowerTrigram: 'Ly (Lửa)', element: 'Thổ' },
  23: { number: 23, lines: [false, false, false, false, false, true], vietnameseName: 'Sơn Địa Bác (Rơi Rụng Suy Thoái)', chinese: '剝', upperTrigram: 'Cấn (Núi)', lowerTrigram: 'Khôn (Đất)', element: 'Kim' },
  24: { number: 24, lines: [true, false, false, false, false, false], vietnameseName: 'Địa Lôi Phục (Trở Về Tái Sinh)', chinese: '復', upperTrigram: 'Khôn (Đất)', lowerTrigram: 'Chấn (Sấm)', element: 'Thổ' },
  25: { number: 25, lines: [true, false, false, true, true, true], vietnameseName: 'Thiên Lôi Vô Vọng (Chân Thật Tự Nhiên)', chinese: '無妄', upperTrigram: 'Càn (Trời)', lowerTrigram: 'Chấn (Sấm)', element: 'Mộc' },
  26: { number: 26, lines: [true, true, true, false, false, true], vietnameseName: 'Sơn Thiên Đại Súc (Tích Lũy Lớn Lao)', chinese: '大畜', upperTrigram: 'Cấn (Núi)', lowerTrigram: 'Càn (Trời)', element: 'Thổ' },
  27: { number: 27, lines: [true, false, false, false, false, true], vietnameseName: 'Sơn Lôi Di (Nuôi Dưỡng Thân Tâm)', chinese: '頤', upperTrigram: 'Cấn (Núi)', lowerTrigram: 'Chấn (Sấm)', element: 'Mộc' },
  28: { number: 28, lines: [false, true, true, true, true, false], vietnameseName: 'Trạch Phong Đại Quá (Gánh Nặng Vượt Mức)', chinese: '大過', upperTrigram: 'Đoài (Hồ)', lowerTrigram: 'Tốn (Gió)', element: 'Mộc' },
  29: { number: 29, lines: [false, true, false, false, true, false], vietnameseName: 'Thuần Khảm (Nước Hiểm Nguy)', chinese: '坎', upperTrigram: 'Khảm (Nước)', lowerTrigram: 'Khảm (Nước)', element: 'Thủy' },
  30: { number: 30, lines: [true, false, true, true, false, true], vietnameseName: 'Thuần Ly (Lửa Soi Sáng)', chinese: '離', upperTrigram: 'Ly (Lửa)', lowerTrigram: 'Ly (Lửa)', element: 'Hỏa' },
  31: { number: 31, lines: [false, false, true, true, true, false], vietnameseName: 'Trạch Sơn Hàm (Cảm Ứng Giao Duyên)', chinese: '咸', upperTrigram: 'Đoài (Hồ)', lowerTrigram: 'Cấn (Núi)', element: 'Kim' },
  32: { number: 32, lines: [false, true, true, true, false, false], vietnameseName: 'Lôi Phong Hằng (Bền Vững Lâu Dài)', chinese: '恆', upperTrigram: 'Chấn (Sấm)', lowerTrigram: 'Tốn (Gió)', element: 'Mộc' },
  33: { number: 33, lines: [false, false, true, true, true, true], vietnameseName: 'Thiên Sơn Độn (Ẩn Thoát Lánh Xa)', chinese: '遯', upperTrigram: 'Càn (Trời)', lowerTrigram: 'Cấn (Núi)', element: 'Kim' },
  34: { number: 34, lines: [true, true, true, true, false, false], vietnameseName: 'Lôi Thiên Đại Tráng (Hùng Mạnh Cương Trực)', chinese: '大壯', upperTrigram: 'Chấn (Sấm)', lowerTrigram: 'Càn (Trời)', element: 'Kim' },
  35: { number: 35, lines: [false, false, false, true, false, true], vietnameseName: 'Hỏa Địa Tấn (Tiến Lên Sáng Sủa)', chinese: '晉', upperTrigram: 'Ly (Lửa)', lowerTrigram: 'Khôn (Đất)', element: 'Kim' },
  36: { number: 36, lines: [true, false, true, false, false, false], vietnameseName: 'Địa Hỏa Minh Di (Thương Tích Giấu Sáng)', chinese: '明夷', upperTrigram: 'Khôn (Đất)', lowerTrigram: 'Ly (Lửa)', element: 'Thủy' },
  37: { number: 37, lines: [true, false, true, false, true, true], vietnameseName: 'Phong Hỏa Gia Nhân (Gia Đình Hòa Thuận)', chinese: '家人', upperTrigram: 'Tốn (Gió)', lowerTrigram: 'Ly (Lửa)', element: 'Mộc' },
  38: { number: 38, lines: [true, true, false, true, false, true], vietnameseName: 'Hỏa Trạch Khuê (Bất Đồng Khác Biệt)', chinese: '睽', upperTrigram: 'Ly (Lửa)', lowerTrigram: 'Đoài (Hồ)', element: 'Thổ' },
  39: { number: 39, lines: [false, false, true, false, true, false], vietnameseName: 'Thủy Sơn Kiển (Khó Khăn Hiểm Trở)', chinese: '蹇', upperTrigram: 'Khảm (Nước)', lowerTrigram: 'Cấn (Núi)', element: 'Thủy' },
  40: { number: 40, lines: [false, true, false, true, false, false], vietnameseName: 'Lôi Thủy Giải (Giải Tỏa Tháo Gỡ)', chinese: '解', upperTrigram: 'Chấn (Sấm)', lowerTrigram: 'Khảm (Nước)', element: 'Mộc' },
  41: { number: 41, lines: [true, true, false, false, false, true], vietnameseName: 'Sơn Trạch Tổn (Bớt Dưới Thêm Trên)', chinese: '損', upperTrigram: 'Cấn (Núi)', lowerTrigram: 'Đoài (Hồ)', element: 'Thổ' },
  42: { number: 42, lines: [true, false, false, false, true, true], vietnameseName: 'Phong Lôi Ích (Tăng Thêm Lợi Ích)', chinese: '益', upperTrigram: 'Tốn (Gió)', lowerTrigram: 'Chấn (Sấm)', element: 'Mộc' },
  43: { number: 43, lines: [true, true, true, true, true, false], vietnameseName: 'Trạch Thiên Quải (Quyết Đoán Loại Bỏ)', chinese: '夬', upperTrigram: 'Đoài (Hồ)', lowerTrigram: 'Càn (Trời)', element: 'Kim' },
  44: { number: 44, lines: [false, true, true, true, true, true], vietnameseName: 'Thiên Phong Cấu (Gặp Gỡ Bất Ngờ)', chinese: '姤', upperTrigram: 'Càn (Trời)', lowerTrigram: 'Tốn (Gió)', element: 'Kim' },
  45: { number: 45, lines: [false, false, false, true, true, false], vietnameseName: 'Trạch Địa Tụy (Họp Mặt Tụ Tụ)', chinese: '萃', upperTrigram: 'Đoài (Hồ)', lowerTrigram: 'Khôn (Đất)', element: 'Kim' },
  46: { number: 46, lines: [false, true, true, false, false, false], vietnameseName: 'Địa Phong Thăng (Thăng Tiến Dần Dần)', chinese: '升', upperTrigram: 'Khôn (Đất)', lowerTrigram: 'Tốn (Gió)', element: 'Mộc' },
  47: { number: 47, lines: [false, true, false, true, true, false], vietnameseName: 'Trạch Thủy Khốn (Khốn Đốn Gian Nan)', chinese: '困', upperTrigram: 'Đoài (Hồ)', lowerTrigram: 'Khảm (Nước)', element: 'Kim' },
  48: { number: 48, lines: [false, true, true, false, true, false], vietnameseName: 'Thủy Phong Tỉnh (Giếng Nước Nuôi Đời)', chinese: '井', upperTrigram: 'Khảm (Nước)', lowerTrigram: 'Tốn (Gió)', element: 'Mộc' },
  49: { number: 49, lines: [true, false, true, true, true, false], vietnameseName: 'Trạch Hỏa Cách (Cải Cách Thay Đổi)', chinese: '革', upperTrigram: 'Đoài (Hồ)', lowerTrigram: 'Ly (Lửa)', element: 'Thủy' },
  50: { number: 50, lines: [false, true, true, true, false, true], vietnameseName: 'Hỏa Phong Đỉnh (Đỉnh Đồng Vững Vàng)', chinese: '鼎', upperTrigram: 'Ly (Lửa)', lowerTrigram: 'Tốn (Gió)', element: 'Mộc' },
  51: { number: 51, lines: [true, false, false, true, false, false], vietnameseName: 'Thuần Chấn (Sấm Động Giật Mình)', chinese: '震', upperTrigram: 'Chấn (Sấm)', lowerTrigram: 'Chấn (Sấm)', element: 'Mộc' },
  52: { number: 52, lines: [false, false, true, false, false, true], vietnameseName: 'Thuần Cấn (Núi Tĩnh Lặng)', chinese: '艮', upperTrigram: 'Cấn (Núi)', lowerTrigram: 'Cấn (Núi)', element: 'Thổ' },
  53: { number: 53, lines: [false, false, true, false, true, true], vietnameseName: 'Phong Sơn Tiệm (Tiến Bước Vững Vàng)', chinese: '漸', upperTrigram: 'Tốn (Gió)', lowerTrigram: 'Cấn (Núi)', element: 'Mộc' },
  54: { number: 54, lines: [true, true, false, true, false, false], vietnameseName: 'Lôi Trạch Quy Muội (Gả Con Gái Nhỏ)', chinese: '歸妹', upperTrigram: 'Chấn (Sấm)', lowerTrigram: 'Đoài (Hồ)', element: 'Kim' },
  55: { number: 55, lines: [true, false, true, true, false, false], vietnameseName: 'Lôi Hỏa Phong (Thịnh Vượng Đầy Đủ)', chinese: '豐', upperTrigram: 'Chấn (Sấm)', lowerTrigram: 'Ly (Lửa)', element: 'Thủy' },
  56: { number: 56, lines: [false, false, true, true, false, true], vietnameseName: 'Hỏa Sơn Lữ (Lữ Khách Đơn Độc)', chinese: '旅', upperTrigram: 'Ly (Lửa)', lowerTrigram: 'Cấn (Núi)', element: 'Hỏa' },
  57: { number: 57, lines: [false, true, true, false, true, true], vietnameseName: 'Thuần Tốn (Gió Thuận Khiêm Nhường)', chinese: '巽', upperTrigram: 'Tốn (Gió)', lowerTrigram: 'Tốn (Gió)', element: 'Mộc' },
  58: { number: 58, lines: [true, true, false, true, true, false], vietnameseName: 'Thuần Đoài (Đầm Hồ Vui Vẻ)', chinese: '兌', upperTrigram: 'Đoài (Hồ)', lowerTrigram: 'Đoài (Hồ)', element: 'Kim' },
  59: { number: 59, lines: [false, true, false, false, true, true], vietnameseName: 'Phong Thủy Hoán (Tan Biến Tiêu Tan)', chinese: '渙', upperTrigram: 'Tốn (Gió)', lowerTrigram: 'Khảm (Nước)', element: 'Hỏa' },
  60: { number: 60, lines: [true, true, false, false, true, false], vietnameseName: 'Thủy Trạch Tiết (Tiết Chế Ngăn Nắp)', chinese: '節', upperTrigram: 'Khảm (Nước)', lowerTrigram: 'Đoài (Hồ)', element: 'Thủy' },
  61: { number: 61, lines: [true, true, false, false, true, true], vietnameseName: 'Phong Trạch Trung Phu (Thành Tín Chân Thật)', chinese: '中孚', upperTrigram: 'Tốn (Gió)', lowerTrigram: 'Đoài (Hồ)', element: 'Thổ' },
  62: { number: 62, lines: [false, false, true, true, false, false], vietnameseName: 'Lôi Sơn Tiểu Quá (Vượt Nhỏ Khiêm Tốn)', chinese: '小過', upperTrigram: 'Chấn (Sấm)', lowerTrigram: 'Cấn (Núi)', element: 'Mộc' },
  63: { number: 63, lines: [true, false, true, false, true, false], vietnameseName: 'Thủy Hỏa Ký Tế (Đã Hoàn Thành)', chinese: '既濟', upperTrigram: 'Khảm (Nước)', lowerTrigram: 'Ly (Lửa)', element: 'Thủy' },
  64: { number: 64, lines: [false, true, false, true, false, true], vietnameseName: 'Hỏa Thủy Vị Tế (Chưa Xong Còn Tiếp)', chinese: '未濟', upperTrigram: 'Ly (Lửa)', lowerTrigram: 'Khảm (Nước)', element: 'Hỏa' },
};

export function getHexagramLines(queNumber: number): boolean[] {
  const meta = HEXAGRAM_DATA[queNumber];
  if (meta) {
    return meta.lines;
  }
  // Fallback procedural seed if ever out of bounds
  const lines: boolean[] = [];
  let seed = (queNumber * 2654435761) % 2 ** 32;
  for (let i = 1; i <= 6; i++) {
    seed = (seed * 1103515245 + 12345) % 2 ** 31;
    lines.push(seed % 2 === 0);
  }
  return lines;
}

/**
 * Authentic I Ching Changing Line Transformation (Quẻ Chủ -> Hào Động -> Quẻ Biến)
 * Inverts the designated changing line (1-indexed bottom to top) and finds the resulting King Wen hexagram.
 */
export function getTransformedHexagram(primaryQue: number, haoDong: number): {
  number: number;
  meta: HexagramMeta;
  changedLineIndex: number; // 0 to 5
  wasSolid: boolean;
  nowSolid: boolean;
  transformedLines: [boolean, boolean, boolean, boolean, boolean, boolean];
} {
  const primaryMeta = HEXAGRAM_DATA[primaryQue] || HEXAGRAM_DATA[1];
  const originalLines = primaryMeta.lines;
  const lineIdx = Math.max(0, Math.min(5, haoDong - 1));
  const wasSolid = originalLines[lineIdx];
  const nowSolid = !wasSolid;

  const newLines: [boolean, boolean, boolean, boolean, boolean, boolean] = [
    originalLines[0],
    originalLines[1],
    originalLines[2],
    originalLines[3],
    originalLines[4],
    originalLines[5],
  ];
  newLines[lineIdx] = nowSolid;

  // Search for the matching hexagram among 64 hexagrams
  for (let num = 1; num <= 64; num++) {
    const candidate = HEXAGRAM_DATA[num];
    if (candidate) {
      const isMatch = candidate.lines.every((val, i) => val === newLines[i]);
      if (isMatch) {
        return {
          number: num,
          meta: candidate,
          changedLineIndex: lineIdx,
          wasSolid,
          nowSolid,
          transformedLines: newLines,
        };
      }
    }
  }

  // Fallback if not found
  return {
    number: primaryQue,
    meta: primaryMeta,
    changedLineIndex: lineIdx,
    wasSolid,
    nowSolid,
    transformedLines: newLines,
  };
}
