import { VIETNAMESE_HEXAGRAMS } from '../data/vietnameseHexagrams';
import { HEXAGRAM_DATA, getTransformedHexagram } from './hexagramPatterns';

export type QuestionType = 'decision' | 'yes_no' | 'timing' | 'quantitative' | 'reflective';

export interface QuestionEntities {
  subject: string;
  timeframe: string;
  action: string;
  isPolar: boolean;
  optionA?: string;
  optionB?: string;
  questionType: QuestionType;
}

export interface HexagramVerdict {
  type: 'GO' | 'NO_GO' | 'CONDITIONAL' | 'OPTION_CHOSEN' | 'TIMING' | 'COUNT' | 'INSIGHT';
  badge: string;
  shortVerdict: string;
  actionSummary: string;
  themeColor: 'emerald' | 'ruby' | 'amber';
  optimalOption?: string;
  questionType: QuestionType;
  clarity: 'clear' | 'mixed' | 'murky';
  whatCouldChangeIt?: string;
  coreInsight?: string;
  windowOfMomentum?: string;
  estimatedCount?: {
    primaryNumber: number;
    numericRange: string;
    numericUnit: string;
    numericBasis: string;
  };
}

export interface TrigramInfo {
  name: string;
  element: string;
  earlyHeaven: number;
  laterHeaven: number;
  season: string;
  archetype: string;
  dynamic: string;
}

export const TRIGRAM_MAP: Record<string, TrigramInfo> = {
  'Càn (Trời)': {
    name: 'Càn / Heaven / 乾',
    element: 'Kim',
    earlyHeaven: 1,
    laterHeaven: 6,
    season: 'Cuối thu sang đầu đông (Late Autumn)',
    archetype: 'Người khởi xướng, sức mạnh sáng tạo thuần dương',
    dynamic: 'Cương kiện, kiên định, chủ động tiên phong',
  },
  'Khôn (Đất)': {
    name: 'Khôn / Earth / 坤',
    element: 'Thổ',
    earlyHeaven: 8,
    laterHeaven: 2,
    season: 'Cuối hạ chớm thu (Late Summer)',
    archetype: 'Người bao dung nâng đỡ, mảnh đất nuôi dưỡng',
    dynamic: 'Nhu thuận, tiếp nhận, kiên nhẫn tích lũy',
  },
  'Chấn (Sấm)': {
    name: 'Chấn / Thunder / 震',
    element: 'Mộc',
    earlyHeaven: 4,
    laterHeaven: 3,
    season: 'Đầu xuân (Early Spring)',
    archetype: 'Sấm động thức tỉnh, xung lực khai phá',
    dynamic: 'Khởi phát, lay chuyển quán tính, thức thời hành động',
  },
  'Tốn (Gió)': {
    name: 'Tốn / Wind / 巽',
    element: 'Mộc',
    earlyHeaven: 5,
    laterHeaven: 4,
    season: 'Cuối xuân sang hạ (Late Spring)',
    archetype: 'Ngọn gió len lỏi, sự thẩm thấu mềm dẻo',
    dynamic: 'Thấu cảm, hòa nhã, linh hoạt ứng biến từng bước',
  },
  'Khảm (Nước)': {
    name: 'Khảm / Water / 坎',
    element: 'Thủy',
    earlyHeaven: 6,
    laterHeaven: 1,
    season: 'Giữa mùa đông (Mid-Winter)',
    archetype: 'Dòng nước qua vực sâu, thử thách lòng dũng cảm',
    dynamic: 'Tĩnh tại quan sát, thận trọng định hướng, kiên trì vượt hiểm',
  },
  'Ly (Lửa)': {
    name: 'Ly / Fire / 離',
    element: 'Hỏa',
    earlyHeaven: 3,
    laterHeaven: 9,
    season: 'Chính hạ (Mid-Summer)',
    archetype: 'Ngọn lửa soi sáng, trí tuệ minh triết',
    dynamic: 'Làm sáng tỏ thực tế, gắn kết văn minh, phân định thị phi',
  },
  'Cấn (Núi)': {
    name: 'Cấn / Mountain / 艮',
    element: 'Thổ',
    earlyHeaven: 7,
    laterHeaven: 8,
    season: 'Giao thoa đông xuân (Late Winter / Early Spring)',
    archetype: 'Rặng núi tĩnh lặng, ranh giới dừng lại đúng lúc',
    dynamic: 'Chặn đứng bốc đồng, giữ vững vị thế, định tâm trước biến cố',
  },
  'Đoài (Hồ)': {
    name: 'Đoài / Lake / 兌',
    element: 'Kim',
    earlyHeaven: 2,
    laterHeaven: 7,
    season: 'Chính thu (Mid-Autumn)',
    archetype: 'Mặt hồ an vui, sự truyền cảm hứng và hòa duyệt',
    dynamic: 'Giao tiếp chân thành, lan tỏa hân hoan, thỏa hiệp tích cực',
  },
};

export function getTrigramDetails(trigramRaw: string): TrigramInfo {
  for (const key of Object.keys(TRIGRAM_MAP)) {
    if (trigramRaw && (trigramRaw.includes(key) || key.includes(trigramRaw))) {
      return TRIGRAM_MAP[key];
    }
  }
  // Generic fallback if matched by base name
  if (/càn|trời|heaven/i.test(trigramRaw)) return TRIGRAM_MAP['Càn (Trời)'];
  if (/khôn|đất|earth/i.test(trigramRaw)) return TRIGRAM_MAP['Khôn (Đất)'];
  if (/chấn|sấm|thunder/i.test(trigramRaw)) return TRIGRAM_MAP['Chấn (Sấm)'];
  if (/tốn|gió|wind/i.test(trigramRaw)) return TRIGRAM_MAP['Tốn (Gió)'];
  if (/khảm|nước|water/i.test(trigramRaw)) return TRIGRAM_MAP['Khảm (Nước)'];
  if (/ly|lửa|fire/i.test(trigramRaw)) return TRIGRAM_MAP['Ly (Lửa)'];
  if (/cấn|núi|mountain/i.test(trigramRaw)) return TRIGRAM_MAP['Cấn (Núi)'];
  if (/đoài|hồ|đầm|lake/i.test(trigramRaw)) return TRIGRAM_MAP['Đoài (Hồ)'];
  return TRIGRAM_MAP['Càn (Trời)'];
}

// 64 Hexagrams Categorization by Nature in I Ching
export const AUSPICIOUS_HEXAGRAMS = new Set([
  1, 2, 11, 14, 15, 19, 26, 30, 31, 35, 42, 45, 46, 50, 53, 55, 57, 58, 61,
]);
export const INAUSPICIOUS_HEXAGRAMS = new Set([6, 12, 23, 29, 36, 38, 39, 47, 54]);

/**
 * STEP 1: CLASSIFY THE QUESTION (Silently classify first)
 * RULE: When in doubt, select "reflective." Never force a binary or verdict frame onto a question the querent did not ask as binary.
 * Any question starting with "how," "why," or "what" is reflective unless explicitly asking "how many" or "should I."
 */
export function classifyQuestion(rawQ: string): QuestionType {
  const q = (rawQ || '').trim().toLowerCase();
  if (!q) return 'reflective';

  // Quantitative: "how many", "how much", "mấy", "bao nhiêu", "số lượng"
  if (
    /how many|how much|bao nhiêu|mấy (tháng|tuần|năm|người|lần|bước|lựa chọn)|số lượng/i.test(q)
  ) {
    return 'quantitative';
  }

  // Timing: "when", "how soon", "khi nào", "bao giờ", "thời điểm nào", "lúc nào", "mấy tháng nữa", "bao lâu"
  if (
    /when|how soon|khi nào|bao giờ|thời điểm nào|lúc nào|mấy tháng nữa|bao lâu nữa|khi nao|bao gio/i.test(
      q
    )
  ) {
    return 'timing';
  }

  // Decision: "should i", "có nên", "chọn", "nên a hay b", "đi hay ở", "tiếp tục hay dừng lại"
  if (
    /should i|có nên|liệu có nên|chọn|nên chọn|nên làm|nên tiếp tục|hay nên|a hay b|đi hay ở|tiếp tục hay dừng|ở lại hay/i.test(
      q
    )
  ) {
    return 'decision';
  }

  // Yes / No: Direct question regarding whether something will happen or is currently true.
  // "Will funding close?", "Is this legit?", "Có được không?", "Thành không?", "Liệu có... không?"
  if (
    /^(will|is it|is this|can i|does|do|did|are we)\b/i.test(q) ||
    /có\s+.*(?:không|ko|chăng)|được\s+không|thành\s+không|liệu\s+có|phải\s+không|hợp\s+không/i.test(q)
  ) {
    return 'yes_no';
  }

  // Explicit reflective signals ("how", "why", "what", "như thế nào", "vì sao", "tại sao", "thế nào", "năng lượng")
  if (
    /^(how|why|what|thế nào|như thế nào|vì sao|tại sao|nguyên nhân|năng lượng|bản chất)\b/i.test(q) ||
    /thế nào|ra sao|như thế nào|hướng đi|lời khuyên|ý nghĩa/i.test(q)
  ) {
    return 'reflective';
  }

  // Default rule: when in doubt, select "reflective"
  return 'reflective';
}

export function extractEntities(rawQ: string): QuestionEntities {
  const q = (rawQ || '').trim();
  const lower = q.toLowerCase();

  const questionType = classifyQuestion(rawQ);

  // Timeframe extraction
  let timeframe = '';
  const yearMatch = q.match(/(?:năm\s*)?(202[4-9]|203[0-9])/i);
  if (yearMatch) {
    timeframe = `năm ${yearMatch[1]}`;
  } else if (/năm nay/i.test(lower)) {
    timeframe = 'năm nay';
  } else if (/sang năm|năm sau|năm tới/i.test(lower)) {
    timeframe = 'năm tới';
  } else if (/tháng\s*([0-9]{1,2})/i.test(lower)) {
    const m = lower.match(/tháng\s*([0-9]{1,2})/i);
    timeframe = `tháng ${m?.[1]}`;
  } else if (/quý\s*([1-4])/i.test(lower)) {
    const qm = lower.match(/quý\s*([1-4])/i);
    timeframe = `Quý ${qm?.[1]}`;
  } else if (/gần đây|sắp tới|thời gian tới/i.test(lower)) {
    timeframe = 'thời gian sắp tới';
  }

  // Action / Topic extraction
  let action = '';
  if (/kết hôn|cưới|lấy chồng|lấy vợ|kết duyên|đám cưới/i.test(lower)) action = 'kết hôn / lập gia đình';
  else if (/chia tay|ly hôn|dừng lại|buông tay/i.test(lower)) action = 'chia tay / dừng lại mối quan hệ';
  else if (/chuyển việc|nhảy việc|đổi việc|tìm việc mới/i.test(lower)) action = 'chuyển đổi công việc mới';
  else if (/nghỉ việc|thôi việc|từ chức/i.test(lower)) action = 'nghỉ việc';
  else if (/thăng chức|tăng lương|đề bạt/i.test(lower)) action = 'thăng tiến chức vị';
  else if (/mua nhà|mua đất|mua xe|tậu nhà/i.test(lower)) action = 'mua tài sản lớn';
  else if (/đầu tư|khởi nghiệp|kinh doanh|mở quán|mở tiệm|rót vốn/i.test(lower)) action = 'đầu tư kinh doanh';
  else if (/thi đỗ|đậu đại học|tốt nghiệp|du học|thi cử/i.test(lower)) action = 'thi cử / du học';
  else if (/phẫu thuật|chữa bệnh|khám bệnh/i.test(lower)) action = 'điều trị sức khỏe';

  // Options A vs B
  let optionA: string | undefined;
  let optionB: string | undefined;
  const orMatch = q.match(/(?:nên\s+)?([^?,;]+?)\s+(?:hay|hay là|hoặc)\s+([^?,;]+)/i);
  if (orMatch && orMatch[1] && orMatch[2]) {
    optionA = orMatch[1].replace(/^(nên|tôi nên|chọn|liệu nên)\s+/i, '').trim();
    optionB = orMatch[2].replace(/^(hay|hay là|hoặc|chọn)\s+/i, '').trim();
  }

  // Subject extraction (proper nouns or key roles)
  let subject = '';
  const words = q.split(/\s+/);
  const potentialNames = words.filter((w) => {
    const clean = w.replace(/[^a-zA-ZÀ-ỹ]/g, '');
    return (
      /^[A-Z][a-zÀ-ỹ]+$/.test(clean) &&
      !/^(Tôi|Mình|Bạn|Em|Anh|Chị|Có|Không|Năm|Tháng|Hỏi|Xin|Cho|Liệu|Quẻ|Cô|Thầy|Thảo|Dự|Án|Công|Việc|Tình|Duyên|Nên|Hay|Làm|Sao|Về|Nào|Master)$/i.test(
        clean
      )
    );
  });
  if (potentialNames.length > 0) {
    subject = potentialNames.join(' ');
  } else if (/người ấy|crush|bạn gái|bạn trai|người yêu/i.test(lower)) {
    subject = 'người ấy';
  } else if (/đối tác|sếp|khách hàng/i.test(lower)) {
    subject = 'đối tác';
  }

  const isPolar = questionType === 'yes_no';

  return { subject, timeframe, action, isPolar, optionA, optionB, questionType };
}

/**
 * STEP 2: SHAPE THE VERDICT TO THE QUESTION (Master Thao Framework)
 */
export function getQuickHexagramVerdict(
  que: number,
  hao: number,
  question?: string
): HexagramVerdict {
  const queNum = Number(que) || 1;
  const haoNum = Number(hao) || 1;
  const rawQ = question || '';
  const entities = extractEntities(rawQ);
  const qType = entities.questionType;

  const primaryMeta = HEXAGRAM_DATA[queNum] || HEXAGRAM_DATA[1];
  const upperTrigram = getTrigramDetails(primaryMeta.upperTrigram);
  const lowerTrigram = getTrigramDetails(primaryMeta.lowerTrigram);
  const transformed = getTransformedHexagram(queNum, haoNum);

  const isBaseAuspicious = AUSPICIOUS_HEXAGRAMS.has(queNum);
  const isBaseInauspicious = INAUSPICIOUS_HEXAGRAMS.has(queNum);

  // Line dynamics
  const isOverreachLine = haoNum === 6 && [1, 28, 34, 43, 54].includes(queNum);
  const isPrimeSovereign = haoNum === 5 || (haoNum === 2 && isBaseAuspicious);
  const isTransitionTurn = haoNum === 4 || haoNum === 3;

  // Assess Clarity: "clear", "mixed", or "murky"
  let clarity: 'clear' | 'mixed' | 'murky' = 'clear';
  if (isBaseInauspicious && transformed.number in AUSPICIOUS_HEXAGRAMS) {
    clarity = 'mixed';
  } else if (isOverreachLine || (isBaseInauspicious && !isPrimeSovereign)) {
    clarity = 'murky';
  }

  // 1. If options A or B explicitly present
  if (entities.optionA && entities.optionB) {
    const isDynamic = haoNum === 1 || haoNum === 3 || haoNum === 5 || isBaseAuspicious;
    const optimal = isDynamic ? entities.optionA : entities.optionB;
    return {
      type: 'OPTION_CHOSEN',
      badge: `🎯 **VERDICT: [PHƯƠNG ÁN TỐI ƯU: CHỌN "${optimal.toUpperCase()}"]**`,
      shortVerdict: `CHỌN "${optimal.toUpperCase()}"`,
      actionSummary: `Nội lực quẻ ủng hộ dồn lực vào phương án "${optimal}"`,
      themeColor: 'emerald',
      optimalOption: optimal,
      questionType: 'decision',
      clarity,
      whatCouldChangeIt: `Nếu đối phương thay đổi cam kết văn bản hoặc vị thế đàm phán suy yếu.`,
    };
  }

  // 2. TIMING QUESTIONS
  if (qType === 'timing') {
    const timingWindow = `${upperTrigram.dynamic} giao thoa cùng ${lowerTrigram.dynamic} — thời vận thuận lợi mở ra vào tiết ${upperTrigram.season}, sau một chu kỳ tích lũy nội tại vững chãi.`;
    return {
      type: 'TIMING',
      badge: `🎯 **VERDICT: [WINDOW OF MOMENTUM — THỜI ĐIỂM THUẬN LỢI]**`,
      shortVerdict: 'WINDOW OF MOMENTUM',
      actionSummary: timingWindow,
      themeColor: 'emerald',
      questionType: 'timing',
      clarity,
      windowOfMomentum: timingWindow,
      whatCouldChangeIt: `Thời cơ sẽ đến sớm hơn nếu bạn hoàn thiện triệt để khâu chuẩn bị từ trước.`,
    };
  }

  // 3. QUANTITATIVE QUESTIONS
  if (qType === 'quantitative') {
    const baguaNum = (upperTrigram.earlyHeaven + lowerTrigram.laterHeaven + haoNum) % 8 || 3;
    const rangeLow = Math.max(1, baguaNum - 1);
    const rangeHigh = baguaNum + 2;
    const unit = /tuần/i.test(rawQ)
      ? 'tuần (weeks)'
      : /tháng/i.test(rawQ)
      ? 'tháng (months)'
      : /lựa chọn|phương án/i.test(rawQ)
      ? 'lựa chọn trọng tâm (options)'
      : 'chu kỳ / mốc then chốt (cycles)';
    const basis = `Số học Bát Quái Tiên Thiên (${upperTrigram.name}: ${upperTrigram.earlyHeaven}) kết hợp Hậu Thiên (${lowerTrigram.name}: ${lowerTrigram.laterHeaven}) và Hào Động số ${haoNum}.`;

    return {
      type: 'COUNT',
      badge: `🎯 **VERDICT: [ESTIMATED COUNT — DỰ TOÁN: ${baguaNum} (${rangeLow} – ${rangeHigh} ${unit})]**`,
      shortVerdict: `DỰ TOÁN: ~${baguaNum} ${unit}`,
      actionSummary: `Ước lượng ${rangeLow} – ${rangeHigh} ${unit} theo chu kỳ Bát Quái`,
      themeColor: 'amber',
      questionType: 'quantitative',
      clarity,
      estimatedCount: {
        primaryNumber: baguaNum,
        numericRange: `${rangeLow} – ${rangeHigh}`,
        numericUnit: unit,
        numericBasis: basis,
      },
      whatCouldChangeIt: `Nhịp độ có thể rút ngắn nếu bạn tập trung giải quyết dứt điểm rào cản ở Hào ${haoNum}.`,
    };
  }

  // 4. REFLECTIVE QUESTIONS (RULE: set verdict to NULL / omit verdict frame, use Core Insight)
  if (qType === 'reflective') {
    const coreInsight = `Sự tương tác giữa ${upperTrigram.name} ở trên và ${lowerTrigram.name} ở dưới phản ánh quá trình chuyển hóa: ${primaryMeta.vietnameseName} không đòi hỏi áp đặt ngoại cảnh, mà yêu cầu thấu suốt nội tâm và điều chỉnh hành vi cho tương thích với đạo Trời Đất.`;
    return {
      type: 'INSIGHT',
      badge: `💡 **CORE INSIGHT (ĐẠI Ý CỐT LÕI):**`,
      shortVerdict: 'CHIÊM NGHIỆM ĐẠO BIẾN DỊCH',
      actionSummary: coreInsight,
      themeColor: 'emerald',
      questionType: 'reflective',
      clarity,
      coreInsight,
    };
  }

  // 5. YES / NO QUESTIONS
  if (qType === 'yes_no') {
    let verdictLabel: 'LIKELY' | 'UNLIKELY' | 'UNCLEAR' | 'DEPENDS ON YOU';
    let themeColor: 'emerald' | 'ruby' | 'amber';
    let shiftCondition = '';

    if (isOverreachLine || (isBaseInauspicious && !isPrimeSovereign)) {
      verdictLabel = 'UNLIKELY';
      themeColor = 'ruby';
      shiftCondition = `Cục diện chỉ đảo chiều nếu bạn chủ động lui một bước để củng cố nền tảng, tránh đối đầu trực diện.`;
    } else if (isBaseAuspicious || isPrimeSovereign) {
      verdictLabel = 'LIKELY';
      themeColor = 'emerald';
      shiftCondition = `Khả năng thành công rất cao nếu duy trì sự chính trực và không chủ quan khinh suất.`;
    } else if (isTransitionTurn) {
      verdictLabel = 'DEPENDS ON YOU';
      themeColor = 'amber';
      shiftCondition = `Kết quả phụ thuộc trực tiếp vào bản lĩnh xử lý xung đột và sự minh bạch trong giao tiếp của bạn.`;
    } else {
      verdictLabel = 'UNCLEAR';
      themeColor = 'amber';
      shiftCondition = `Tình thế còn đang trong màn sương mờ; cần đợi thêm dữ kiện xác thực trước khi kết luận.`;
    }

    return {
      type: verdictLabel === 'LIKELY' ? 'GO' : verdictLabel === 'UNLIKELY' ? 'NO_GO' : 'CONDITIONAL',
      badge: `🎯 **VERDICT: [${verdictLabel}]**`,
      shortVerdict: verdictLabel,
      actionSummary: shiftCondition,
      themeColor,
      questionType: 'yes_no',
      clarity,
      whatCouldChangeIt: shiftCondition,
    };
  }

  // 6. DECISION QUESTIONS ("Should I accept?", "Nên tiến hành hay dừng lại?")
  let decisionLabel: 'LEAN TOWARD' | 'LEAN AGAINST' | 'IT DEPENDS' | 'NOT YET' | 'WAIT FOR CLARITY';
  let decisionTheme: 'emerald' | 'ruby' | 'amber';
  let postureShift = '';

  if (isOverreachLine) {
    decisionLabel = 'LEAN AGAINST';
    decisionTheme = 'ruby';
    postureShift = `Dấu hiệu của sự quá tầm và hao lực; chuyển sang phòng thủ và bảo toàn vị thế sẽ mang lại bình an.`;
  } else if (isBaseInauspicious && !isPrimeSovereign) {
    decisionLabel = 'NOT YET';
    decisionTheme = 'amber';
    postureShift = `Nền móng chưa vững chắc; hãy kiên nhẫn tích lũy thêm nội lực thay vì đốt cháy giai đoạn.`;
  } else if (isBaseAuspicious || isPrimeSovereign) {
    decisionLabel = 'LEAN TOWARD';
    decisionTheme = 'emerald';
    postureShift = `Thiên thời địa lợi tương hỗ; hành động với tâm thế chân chính và chuẩn bị kỹ lưỡng sẽ gặt hái cát lợi.`;
  } else if (isTransitionTurn) {
    decisionLabel = 'IT DEPENDS';
    decisionTheme = 'amber';
    postureShift = `Tùy thuộc vào việc bạn có đủ phương án dự phòng và sự đồng thuận của các bên liên quan hay không.`;
  } else {
    decisionLabel = 'WAIT FOR CLARITY';
    decisionTheme = 'amber';
    postureShift = `Đợi các tín hiệu mâu thuẫn được giải tỏa; không đưa ra quyết định hệ trọng trong lúc tâm trí xáo trộn.`;
  }

  return {
    type: decisionLabel === 'LEAN TOWARD' ? 'GO' : decisionLabel === 'LEAN AGAINST' ? 'NO_GO' : 'CONDITIONAL',
    badge: `🎯 **VERDICT: [${decisionLabel}]**`,
    shortVerdict: decisionLabel,
    actionSummary: postureShift,
    themeColor: decisionTheme,
    questionType: 'decision',
    clarity,
    whatCouldChangeIt: postureShift,
  };
}

/**
 * STEP 3 & STEP 4: GENERATE RICH FALLBACK INTERPRETATION
 * Implements Master Thao's complete 4-step framework with Soft Length Constraints and grounded I Ching wisdom.
 */
export function generateRichFallbackInterpretation(
  queNum: number,
  haoNum: number,
  question: string,
  _language = 'vi',
  _history?: any[]
): string {
  const primaryViet = VIETNAMESE_HEXAGRAMS[queNum] || VIETNAMESE_HEXAGRAMS[1];
  const primaryMeta = HEXAGRAM_DATA[queNum] || HEXAGRAM_DATA[1];
  const transformed = getTransformedHexagram(queNum, haoNum);
  const transformedViet = VIETNAMESE_HEXAGRAMS[transformed.number] || VIETNAMESE_HEXAGRAMS[1];
  const transformedMeta = transformed.meta;

  const upperTrigram = getTrigramDetails(primaryMeta.upperTrigram);
  const lowerTrigram = getTrigramDetails(primaryMeta.lowerTrigram);
  const transUpper = getTrigramDetails(transformedMeta.upperTrigram);
  const transLower = getTrigramDetails(transformedMeta.lowerTrigram);

  const rawQ = (question || '').trim();
  const entities = extractEntities(rawQ);
  const verdict = getQuickHexagramVerdict(queNum, haoNum, rawQ);

  const primaryThoan = primaryViet.thoanTu;
  const changingLineText = primaryViet.haoTu[haoNum] || primaryViet.haoTu[1];
  const transformedThoan = transformedViet.thoanTu;

  // STEP 3: questionRestated (Exactly one clear sentence)
  const targetSubject = entities.subject ? `đối với ${entities.subject}` : 'cho bản thân bạn';
  const targetAction = entities.action || 'định hướng chuyển biến hiện tại';
  const targetTime = entities.timeframe ? `trong ${entities.timeframe}` : 'ở thời điểm này';
  const questionRestated = rawQ
    ? `Băn khoăn của bạn xoay quanh việc thấu suốt hoàn cảnh ${targetSubject} về ${targetAction} ${targetTime}, nhằm tìm ra quyết sách chuẩn xác và thuận theo Đạo.`
    : `Bạn đang tìm kiếm sự định hướng sáng suốt của Kinh Dịch để nhận biết dòng chảy thời vận và đưa ra hành động tối ưu cho chặng đường phía trước.`;

  // STEP 3: narrativeOverview (2-3 structured paragraphs)
  const paragraph1 =
    `Quẻ **#${queNum} - ${primaryViet.name} (${primaryViet.chinese})** phản ánh bức tranh toàn cảnh nơi bạn đang đứng. ` +
    `Tượng quẻ là **${primaryViet.symbol}** (${primaryViet.element}), gắn với lời Thoán cổ văn: *"${primaryThoan}"*. ` +
    `Trong Kinh Dịch, trạng thái này không phải là một định mệnh bất di bất dịch, mà là sự hội tụ tạm thời giữa năng lượng bên trong và môi trường bên ngoài. ` +
    `${primaryViet.meaning}.`;

  const paragraph2 =
    `Khi nhìn vào thế tương quan giữa hai cõi Trời - Đất trong quẻ, Thượng Quái là **${upperTrigram.name}** đại diện cho ngoại cảnh và áp lực bên ngoài (${upperTrigram.dynamic}), trong khi Hạ Quái là **${lowerTrigram.name}** phản ánh căn cơ nội lực và tâm thế bên trong của bạn (${lowerTrigram.dynamic}). ` +
    `Sự tương tác giữa ${upperTrigram.element} ở trên và ${lowerTrigram.element} ở dưới cho thấy vấn đề của bạn đang ở giai đoạn cần sự thấu suốt về ranh giới quyền lực và vị thế. ` +
    `Nếu nóng vội áp đặt ý chí cá nhân, bạn sẽ gặp lực cản; nhưng nếu biết thuận thế điều chỉnh, rào cản sẽ hóa thành bậc thang nâng đỡ.`;

  const paragraph3 =
    `Đặc biệt, Hào Động thứ **${haoNum}** (${transformed.wasSolid ? 'Dương ⚊ biến thành Âm ⚋' : 'Âm ⚋ biến thành Dương ⚊'}) chính là điểm xoay chuyển then chốt nhất của toàn bộ cục diện ngay lúc này. ` +
    `Lời Hào cảnh báo và trao gửi: *"${changingLineText}"*. ` +
    `Điểm nút này nhắc nhở rằng mọi việc muốn hanh thông đều cần đi qua bài học chuyển hóa ở tầng nấc thứ ${haoNum}, biến xung đột thành cơ hội tự hoàn thiện.`;

  const narrativeOverview = `${paragraph1}\n\n${paragraph2}\n\n${paragraph3}`;

  // STEP 3: hexagramAnalysis (2 paragraphs analyzing trigram tension and relating hexagram trajectory)
  const hexAnalysis1 =
    `Về mặt cấu trúc Bát Quái, sự đối thoại giữa Thượng Quái **${upperTrigram.name}** và Hạ Quái **${lowerTrigram.name}** tạo nên trường lực chủ đạo: ` +
    `${upperTrigram.archetype} đang đối diện với ${lowerTrigram.archetype}. ` +
    `Sự giằng co này làm bộc lộ điểm ứng nghiệm tại Hào số ${haoNum}, nơi năng lượng cũ đã tích lũy đến cực điểm và đòi hỏi sự thay đổi cấu trúc hành vi. ` +
    `Hào ${haoNum} không chỉ là điểm chịu lực mà còn là cánh cửa giải phóng sự bế tắc của người quân tử.`;

  const hexAnalysis2 =
    `Từ sự chuyển động của Hào ${haoNum}, Quẻ Chủ dịch chuyển sang Quẻ Biến (Chi Quái 之卦) **#${transformed.number} - ${transformedViet.name} (${transformedViet.chinese})**, ` +
    `với cấu trúc mới giữa Thượng Quái ${transUpper.name} và Hạ Quái ${transLower.name}. Thoán Từ quẻ biến chỉ rõ: *"${transformedThoan}"*. ` +
    `Đây chính là quỹ đạo tự nhiên sẽ diễn ra nếu bạn tích hợp trọn vẹn bài học của Hào Động: hoàn cảnh sẽ dần chuyển biến từ bấp bênh sang ${transformedViet.meaning.toLowerCase()}, mở ra không gian cho những cam kết vững bền.`;

  const hexagramAnalysis = `${hexAnalysis1}\n\n${hexAnalysis2}`;

  // STEP 4: actionSteps (2-4 concrete items executable within ~7 days tied explicitly to Upper/Lower trigram or changing line)
  let actionSteps: string[] = [];
  if (upperTrigram.name.includes('Càn')) {
    actionSteps.push(
      `**Hành động 1 (Tương ứng Thượng Quái Càn):** Thể hiện lập trường kiên định và chính trực trong các cuộc trao đổi quan trọng trong 3 ngày tới; nói không với sự thỏa hiệp mập mờ làm tổn hại danh dự.`
    );
  } else if (upperTrigram.name.includes('Khảm')) {
    actionSteps.push(
      `**Hành động 1 (Tương ứng Thượng Quái Khảm):** Tạm dừng ký kết hoặc cam kết tài chính/hợp đồng chưa rõ ràng trong vòng 5 ngày; rà soát kỹ mọi văn bản để phòng ngừa rủi ro tiềm ẩn.`
    );
  } else if (upperTrigram.name.includes('Cấn')) {
    actionSteps.push(
      `**Hành động 1 (Tương ứng Thượng Quái Cấn):** Chủ động thiết lập ranh giới bảo vệ bản thân; hoãn các cuộc gặp gỡ có nguy cơ đối đầu căng thẳng và giữ sự tĩnh lặng để tái tạo năng lượng.`
    );
  } else {
    actionSteps.push(
      `**Hành động 1 (Tương ứng Thượng Quái ${upperTrigram.name.split(' ')[0]}):** Khéo léo quan sát các động thái từ cấp trên hoặc đối tác; chủ động xây dựng mạng lưới ủng hộ với thái độ khiêm nhường nhưng dứt khoát trong 48 giờ tới.`
    );
  }

  actionSteps.push(
    `**Hành động 2 (Ứng xử theo Hào Động ${haoNum}):** Khắc ghi lời hào *"${changingLineText.slice(0, 50)}..."* bằng cách điều chỉnh cách giao tiếp: chuyển từ phản kháng sang lắng nghe có chọn lọc, ghi chép lại mọi cam kết thành văn bản cụ thể trong vòng 7 ngày.`
  );

  actionSteps.push(
    `**Hành động 3 (Hướng tới Chi Quái #${transformed.number}):** Tập trung hoàn thành dứt điểm 1 nhiệm vụ trọng tâm duy nhất còn tồn đọng thay vì dàn trải sức lực, tạo đà cho bước chuyển hóa thuận lợi.`
  );

  // Reflection Question for journaling
  const reflectionQuestion =
    `"Trong tình huống hiện tại, đâu là điểm tôi đang cố chấp kiểm soát ngoại cảnh thay vì quay về tu dưỡng tâm thế và kỷ luật tự thân?"`;

  // ASSEMBLE OUTPUT
  let headerBlock = '';
  if (verdict.questionType === 'reflective') {
    headerBlock =
      `💡 **CORE INSIGHT (ĐẠI Ý CỐT LÕI):**\n` +
      `${verdict.coreInsight}\n\n` +
      `* **Độ sáng tỏ (Clarity):** ${verdict.clarity === 'clear' ? 'Sáng tỏ (Clear)' : verdict.clarity === 'mixed' ? 'Hòa trộn (Mixed)' : 'Cần chiêm nghiệm thêm (Murky)'}`;
  } else if (verdict.questionType === 'timing') {
    headerBlock =
      `🎯 **VERDICT: [WINDOW OF MOMENTUM — THỜI ĐIỂM THUẬN LỢI]**\n` +
      `* **Thời vận:** ${verdict.windowOfMomentum}\n` +
      `* **Điều kiện chuyển hóa:** ${verdict.whatCouldChangeIt}\n` +
      `* **Độ sáng tỏ (Clarity):** ${verdict.clarity === 'clear' ? 'Sáng tỏ (Clear)' : verdict.clarity === 'mixed' ? 'Hòa trộn (Mixed)' : 'Cần tĩnh tâm (Murky)'}`;
  } else if (verdict.questionType === 'quantitative' && verdict.estimatedCount) {
    headerBlock =
      `🎯 **VERDICT: [ESTIMATED COUNT — DỰ TOÁN: ~${verdict.estimatedCount.primaryNumber} (${verdict.estimatedCount.numericRange} ${verdict.estimatedCount.numericUnit})]**\n` +
      `* **Căn cứ Bát Quái:** ${verdict.estimatedCount.numericBasis}\n` +
      `* **Điều kiện rút ngắn/thay đổi:** ${verdict.whatCouldChangeIt}\n` +
      `* **Độ sáng tỏ (Clarity):** ${verdict.clarity === 'clear' ? 'Sáng tỏ (Clear)' : 'Hòa trộn (Mixed)'}`;
  } else {
    // decision or yes_no
    headerBlock =
      `${verdict.badge}\n` +
      `* **Điều kiện xoay chuyển cục diện (What could change it):** ${verdict.whatCouldChangeIt}\n` +
      `* **Độ sáng tỏ (Clarity):** ${verdict.clarity === 'clear' ? 'Sáng tỏ (Clear)' : verdict.clarity === 'mixed' ? 'Hòa trộn (Mixed)' : 'Mờ ảo (Murky)'}`;
  }

  return (
    `${headerBlock}\n\n` +
    `🔍 **LÀM RÕ CÂU HỎI (QUESTION RESTATED):**\n` +
    `${questionRestated}\n\n` +
    `🌊 **TỔNG QUAN THỜI THẾ & DÒNG CHẢY BIẾN DỊCH (NARRATIVE OVERVIEW):**\n` +
    `${narrativeOverview}\n\n` +
    `☯️ **TƯƠNG TÁC QUẺ VÀ NỘI HÀM BÁT QUÁI (HEXAGRAM & TRIGRAM DYNAMICS):**\n` +
    `${hexagramAnalysis}\n\n` +
    `⚡ **KẾ SÁCH HÀNH ĐỘNG 7 NGÀY (I CHING COUNSEL / 象傳):**\n` +
    `${actionSteps.join('\n')}\n\n` +
    `🪞 **CÂU HỎI CHIÊM NGHIỆM ĐỂ TỰ VẤN (REFLECTION QUESTION):**\n` +
    `${reflectionQuestion}`
  );
}
