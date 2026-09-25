import { VIETNAMESE_HEXAGRAMS } from '../data/vietnameseHexagrams';
import { HEXAGRAM_DATA, getTransformedHexagram } from './hexagramPatterns';

export type QuestionType = 'decision' | 'yes_no' | 'timing' | 'quantitative' | 'reflective';
export type DomainCategory = 'career' | 'love' | 'finance' | 'exam' | 'health' | 'decision' | 'general';

export interface QuestionEntities {
  rawQuestion: string;
  subject: string;
  timeframe: string;
  action: string;
  domain: DomainCategory;
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
    name: 'Càn (Trời / Heaven / 乾)',
    element: 'Kim',
    earlyHeaven: 1,
    laterHeaven: 6,
    season: 'Cuối thu sang đầu đông (Late Autumn)',
    archetype: 'Người khởi xướng, sức mạnh sáng tạo thuần dương',
    dynamic: 'Cương kiện, kiên định, chủ động tiên phong',
  },
  'Khôn (Đất)': {
    name: 'Khôn (Đất / Earth / 坤)',
    element: 'Thổ',
    earlyHeaven: 8,
    laterHeaven: 2,
    season: 'Cuối hạ chớm thu (Late Summer)',
    archetype: 'Người bao dung nâng đỡ, mảnh đất nuôi dưỡng',
    dynamic: 'Nhu thuận, tiếp nhận, kiên nhẫn tích lũy',
  },
  'Chấn (Sấm)': {
    name: 'Chấn (Sấm / Thunder / 震)',
    element: 'Mộc',
    earlyHeaven: 4,
    laterHeaven: 3,
    season: 'Đầu xuân (Early Spring)',
    archetype: 'Sấm động thức tỉnh, xung lực khai phá',
    dynamic: 'Khởi phát, lay chuyển quán tính, thức thời hành động',
  },
  'Tốn (Gió)': {
    name: 'Tốn (Gió / Wind / 巽)',
    element: 'Mộc',
    earlyHeaven: 5,
    laterHeaven: 4,
    season: 'Cuối xuân sang hạ (Late Spring)',
    archetype: 'Ngọn gió len lỏi, sự thẩm thấu mềm dẻo',
    dynamic: 'Thấu cảm, hòa nhã, linh hoạt ứng biến từng bước',
  },
  'Khảm (Nước)': {
    name: 'Khảm (Nước / Water / 坎)',
    element: 'Thủy',
    earlyHeaven: 6,
    laterHeaven: 1,
    season: 'Giữa mùa đông (Mid-Winter)',
    archetype: 'Dòng nước qua vực sâu, thử thách bản lĩnh',
    dynamic: 'Tĩnh tại quan sát, thận trọng định hướng, kiên trì vượt hiểm',
  },
  'Ly (Lửa)': {
    name: 'Ly (Lửa / Fire / 離)',
    element: 'Hỏa',
    earlyHeaven: 3,
    laterHeaven: 9,
    season: 'Chính hạ (Mid-Summer)',
    archetype: 'Ngọn lửa soi sáng, trí tuệ minh triết',
    dynamic: 'Làm sáng tỏ thực tế, gắn kết văn minh, phân định thị phi',
  },
  'Cấn (Núi)': {
    name: 'Cấn (Núi / Mountain / 艮)',
    element: 'Thổ',
    earlyHeaven: 7,
    laterHeaven: 8,
    season: 'Giao thoa đông xuân (Late Winter / Early Spring)',
    archetype: 'Rặng núi tĩnh lặng, ranh giới dừng lại đúng lúc',
    dynamic: 'Chặn đứng bốc đồng, giữ vững vị thế, định tâm trước biến cố',
  },
  'Đoài (Hồ)': {
    name: 'Đoài (Hồ / Lake / 兌)',
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

export const AUSPICIOUS_HEXAGRAMS = new Set([
  1, 2, 11, 14, 15, 19, 26, 30, 31, 35, 42, 45, 46, 50, 53, 55, 57, 58, 61,
]);
export const INAUSPICIOUS_HEXAGRAMS = new Set([6, 12, 23, 29, 36, 38, 39, 47, 54]);

/**
 * STEP 1: CLASSIFY THE QUESTION (Master Thao Framework)
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
  if (
    /^(will|is it|is this|can i|does|do|did|are we)\b/i.test(q) ||
    /có\s+.*(?:không|ko|chăng)|được\s+không|thành\s+không|liệu\s+có|phải\s+không|hợp\s+không/i.test(q)
  ) {
    return 'yes_no';
  }

  // Explicit reflective signals
  if (
    /^(how|why|what|thế nào|như thế nào|vì sao|tại sao|nguyên nhân|năng lượng|bản chất)\b/i.test(q) ||
    /thế nào|ra sao|như thế nào|hướng đi|lời khuyên|ý nghĩa/i.test(q)
  ) {
    return 'reflective';
  }

  return 'reflective';
}

export function detectDomain(rawQ: string): DomainCategory {
  const q = (rawQ || '').toLowerCase();
  if (
    /công việc|sự nghiệp|việc làm|công ty|sếp|đồng nghiệp|nhảy việc|phỏng vấn|thăng chức|dự án|hợp đồng|khởi nghiệp|kinh doanh|mở quán|buôn bán|chức vụ|tăng lương|đối tác/.test(
      q
    )
  ) {
    return 'career';
  }
  if (
    /tình|yêu|duyên|crush|người ấy|hẹn hò|kết hôn|chia tay|vợ|chồng|bạn gái|bạn trai|tình cảm|gặp lại|quay lại|cưới|lấy|ly hôn/.test(
      q
    )
  ) {
    return 'love';
  }
  if (
    /tiền|tài lộc|tài chính|đầu tư|mua|bán|chứng khoán|đất|nhà|bất động sản|lợi nhuận|lỗ|lãi|vay|trả nợ|vốn|tài sản/.test(
      q
    )
  ) {
    return 'finance';
  }
  if (/thi|học|đỗ|tốt nghiệp|bằng|chứng chỉ|điểm|du học|trường|khảo thí|kết quả thi/.test(q)) {
    return 'exam';
  }
  if (/sức khỏe|bệnh|mệt|tâm an|ngủ|chữa|khỏe|bình an|tâm lý|stress|áp lực/.test(q)) {
    return 'health';
  }
  if (/chọn|quyết định|ngã rẽ|a hay b|đi hay ở|tiếp tục hay|đổi hay/.test(q)) {
    return 'decision';
  }
  return 'general';
}

export function extractEntities(rawQ: string): QuestionEntities {
  const q = (rawQ || '').trim();
  const lower = q.toLowerCase();

  const questionType = classifyQuestion(rawQ);
  const domain = detectDomain(rawQ);

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

  // Action extraction
  let action = '';
  if (/kết hôn|cưới|lấy chồng|lấy vợ|đám cưới/i.test(lower)) action = 'kết hôn / lập gia đình';
  else if (/chia tay|ly hôn|dừng lại/i.test(lower)) action = 'chia tay / kết thúc mối quan hệ';
  else if (/chuyển việc|nhảy việc|đổi việc|tìm việc mới/i.test(lower)) action = 'chuyển đổi công việc';
  else if (/nghỉ việc|thôi việc|từ chức/i.test(lower)) action = 'nghỉ việc';
  else if (/thăng chức|tăng lương|đề bạt/i.test(lower)) action = 'thăng chức / tăng lương';
  else if (/mua nhà|mua đất|mua xe|tậu nhà/i.test(lower)) action = 'mua tài sản lớn';
  else if (/đầu tư|khởi nghiệp|kinh doanh|mở quán|rót vốn/i.test(lower)) action = 'đầu tư / kinh doanh';
  else if (/thi đỗ|đậu đại học|tốt nghiệp|du học/i.test(lower)) action = 'thi cử / du học';
  else if (/phẫu thuật|chữa bệnh|khám bệnh/i.test(lower)) action = 'điều trị sức khỏe';

  // Option A vs Option B
  let optionA: string | undefined;
  let optionB: string | undefined;
  const orMatch = q.match(/(?:nên\s+)?([^?,;]+?)\s+(?:hay|hay là|hoặc)\s+([^?,;]+)/i);
  if (orMatch && orMatch[1] && orMatch[2]) {
    optionA = orMatch[1].replace(/^(nên|tôi nên|chọn|liệu nên)\s+/i, '').trim();
    optionB = orMatch[2].replace(/^(hay|hay là|hoặc|chọn)\s+/i, '').trim();
  }

  // Subject extraction
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

  return { rawQuestion: q, subject, timeframe, action, domain, isPolar, optionA, optionB, questionType };
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

  const isOverreachLine = haoNum === 6 && [1, 28, 34, 43, 54].includes(queNum);
  const isPrimeSovereign = haoNum === 5 || (haoNum === 2 && isBaseAuspicious);
  const isTransitionTurn = haoNum === 4 || haoNum === 3;

  let clarity: 'clear' | 'mixed' | 'murky' = 'clear';
  if (isBaseInauspicious && transformed.number in AUSPICIOUS_HEXAGRAMS) {
    clarity = 'mixed';
  } else if (isOverreachLine || (isBaseInauspicious && !isPrimeSovereign)) {
    clarity = 'murky';
  }

  // 1. Concrete choices: Option A vs Option B
  if (entities.optionA && entities.optionB) {
    const isDynamic = haoNum === 1 || haoNum === 3 || haoNum === 5 || isBaseAuspicious;
    const optimal = isDynamic ? entities.optionA : entities.optionB;
    const alternative = isDynamic ? entities.optionB : entities.optionA;
    return {
      type: 'OPTION_CHOSEN',
      badge: `🎯 **VERDICT: [PHƯƠNG ÁN TỐI ƯU: CHỌN "${optimal.toUpperCase()}"]**`,
      shortVerdict: `CHỌN "${optimal.toUpperCase()}"`,
      actionSummary: `Năng lượng Quẻ #${queNum} (${upperTrigram.dynamic}) ủng hộ dồn lực vào "${optimal}", trong khi "${alternative}" chứa nhiều lực cản ngầm.`,
      themeColor: 'emerald',
      optimalOption: optimal,
      questionType: 'decision',
      clarity,
      whatCouldChangeIt: `Nếu đối phương thay đổi cam kết văn bản hoặc chi phí cơ hội của "${alternative}" giảm đột biến.`,
    };
  }

  // 2. TIMING QUESTIONS
  if (qType === 'timing') {
    const timingWindow = `Thời vận thuận lợi mở ra vào tiết ${upperTrigram.season}, khi xung lực của ${upperTrigram.name} giao hòa cùng ${lowerTrigram.name}.`;
    return {
      type: 'TIMING',
      badge: `🎯 **VERDICT: [WINDOW OF MOMENTUM — THỜI ĐIỂM THUẬN LỢI]**`,
      shortVerdict: 'WINDOW OF MOMENTUM',
      actionSummary: timingWindow,
      themeColor: 'emerald',
      questionType: 'timing',
      clarity,
      windowOfMomentum: timingWindow,
      whatCouldChangeIt: `Thời cơ sẽ mở ra sớm hơn nếu bạn hoàn thiện khâu chuẩn bị nội bộ trước khi bước sang tiết khí mới.`,
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
      ? 'lựa chọn then chốt (options)'
      : 'chu kỳ / giai đoạn (stages)';
    const basis = `Số học Bát Quái Tiên Thiên (${upperTrigram.name}: ${upperTrigram.earlyHeaven}) kết hợp Hậu Thiên (${lowerTrigram.name}: ${lowerTrigram.laterHeaven}) và Hào Động #${haoNum}.`;

    return {
      type: 'COUNT',
      badge: `🎯 **VERDICT: [ESTIMATED COUNT — DỰ TOÁN: ${baguaNum} (${rangeLow} – ${rangeHigh} ${unit})]**`,
      shortVerdict: `DỰ TOÁN: ~${baguaNum} ${unit}`,
      actionSummary: `Ước lượng ${rangeLow} – ${rangeHigh} ${unit} theo quy luật biến dịch Bát Quái`,
      themeColor: 'amber',
      questionType: 'quantitative',
      clarity,
      estimatedCount: {
        primaryNumber: baguaNum,
        numericRange: `${rangeLow} – ${rangeHigh}`,
        numericUnit: unit,
        numericBasis: basis,
      },
      whatCouldChangeIt: `Số lượng chu kỳ có thể rút ngắn nếu bạn tập trung giải quyết nút thắt ở Hào Động #${haoNum}.`,
    };
  }

  // 4. REFLECTIVE QUESTIONS (Verdict is NULL / Core Insight)
  if (qType === 'reflective') {
    const coreInsight = `Sự đối thoại giữa ${upperTrigram.name} ở trên và ${lowerTrigram.name} ở dưới cho thấy: vấn đề của bạn không giải quyết bằng sự áp đặt cưỡng cầu, mà bằng việc thấu suốt bản chất chuyển hóa và giữ vững tâm thế chính trực.`;
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
      shiftCondition = `Khả năng thành công thấp nếu tiếp tục cách làm cũ; chỉ đảo chiều khi bạn chủ động lui một bước để tái cơ cấu rủi ro.`;
    } else if (isBaseAuspicious || isPrimeSovereign) {
      verdictLabel = 'LIKELY';
      themeColor = 'emerald';
      shiftCondition = `Xác suất thuận lợi rất cao; điều cốt tử là duy trì kỷ luật và không chủ quan trước những chi tiết nhỏ.`;
    } else if (isTransitionTurn) {
      verdictLabel = 'DEPENDS ON YOU';
      themeColor = 'amber';
      shiftCondition = `Kết quả phụ thuộc trực tiếp vào việc bạn có dám thương lượng thẳng thắn và đặt ra ranh giới rõ ràng hay không.`;
    } else {
      verdictLabel = 'UNCLEAR';
      themeColor = 'amber';
      shiftCondition = `Các luồng thông tin hiện tại chưa đồng nhất; cần đợi thêm dữ kiện xác minh trong 7-10 ngày tới.`;
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

  // 6. DECISION QUESTIONS
  let decisionLabel: 'LEAN TOWARD' | 'LEAN AGAINST' | 'IT DEPENDS' | 'NOT YET' | 'WAIT FOR CLARITY';
  let decisionTheme: 'emerald' | 'ruby' | 'amber';
  let postureShift = '';

  if (isOverreachLine) {
    decisionLabel = 'LEAN AGAINST';
    decisionTheme = 'ruby';
    postureShift = `Năng lượng quẻ cảnh báo vượt ngưỡng an toàn; chuyển sang bảo toàn lực lượng sẽ tránh được tổn thất lớn.`;
  } else if (isBaseInauspicious && !isPrimeSovereign) {
    decisionLabel = 'NOT YET';
    decisionTheme = 'amber';
    postureShift = `Thời cơ chưa chín muồi; tích lũy thêm bằng chứng hoặc năng lực thay vì mạo hiểm dấn thân ngay.`;
  } else if (isBaseAuspicious || isPrimeSovereign) {
    decisionLabel = 'LEAN TOWARD';
    decisionTheme = 'emerald';
    postureShift = `Thiên thời địa lợi tương trợ; hãy tiến hành dứt khoát với kế hoạch phòng thủ rủi ro được chuẩn bị chu đáo.`;
  } else if (isTransitionTurn) {
    decisionLabel = 'IT DEPENDS';
    decisionTheme = 'amber';
    postureShift = `Tùy thuộc vào mức độ cam kết của các bên liên quan và khả năng tự chủ tài chính/thời gian của bạn.`;
  } else {
    decisionLabel = 'WAIT FOR CLARITY';
    decisionTheme = 'amber';
    postureShift = `Đợi cho những xung đột ngầm lộ diện hoàn toàn; tránh đưa ra cam kết dài hạn trong lúc hoàn cảnh chưa ngã ngũ.`;
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
 * Domain-specific action generator tailored explicitly to the querent's question and entities.
 */
function buildDomainSpecificContent(
  domain: DomainCategory,
  entities: QuestionEntities,
  queNum: number,
  haoNum: number,
  upperTrigram: TrigramInfo,
  lowerTrigram: TrigramInfo,
  primaryName: string,
  changingLineText: string,
  transformedNum: number,
  transformedName: string
) {
  const subjectName = entities.subject || 'bạn';
  const timeNote = entities.timeframe ? `trong ${entities.timeframe}` : 'trong giai đoạn sắp tới';

  let questionRestated = '';
  let situationNarrative = '';
  let concreteActions: string[] = [];
  let reflectionQ = '';

  switch (domain) {
    case 'career':
      questionRestated = `Bạn đang trăn trở về định hướng công danh và sự nghiệp ${entities.subject ? `đối với ${entities.subject}` : ''} ${timeNote}, đặc biệt là cách xử sự để nắm thế chủ động và tránh rủi ro nơi làm việc.`;
      situationNarrative =
        `Xét trong bối cảnh công việc, quẻ #${queNum} (${primaryName}) phản ánh sự giằng co giữa môi trường bên ngoài (${upperTrigram.dynamic}) và năng lực nội tại của ${subjectName} (${lowerTrigram.dynamic}). ` +
        `Nút thắt không nằm ở sự thiếu hụt tài năng mà ở cách thức định vị và quản trị kỳ vọng với cấp trên hoặc đối tác. ` +
        `Hào Động #${haoNum} cảnh báo điểm nhạy cảm về ranh giới quyền hạn: việc nôn nóng đòi hỏi kết quả tức thì sẽ dễ bị biến thành đích ngắm của thị phi.`;
      concreteActions = [
        `**Bước 1 (Làm ngay trong 2-3 ngày):** Rà soát lại toàn bộ email, văn bản thỏa thuận và KPI công việc hiện tại; ghi chép minh bạch các đóng góp thực tế thành số liệu để bảo vệ quyền lợi cá nhân.`,
        `**Bước 2 (Chiến lược 7 ngày ứng với Hào Động #${haoNum}):** Điều chỉnh cách tiếp cận với quản lý/đối tác theo tinh thần *"${changingLineText.slice(0, 45)}..."*: lắng nghe nhiều hơn phản biện, chỉ đề xuất giải pháp khi đã có phương án dự phòng khả thi.`,
        `**Bước 3 (Đón đầu Quẻ Biến #${transformedNum} ${transformedName}):** Tạm hoãn mọi tranh luận đối đầu không cần thiết; tập trung hoàn thành dứt điểm 1 dự án trọng điểm để xác lập uy tín vững chắc.`,
      ];
      reflectionQ = `"Trong công việc hiện tại, tôi đang chứng minh cái tôi cá nhân hay đang thực sự kiến tạo giá trị bền vững cho vị thế của mình?"`;
      break;

    case 'love':
      questionRestated = `Băn khoăn của bạn hướng về mối quan hệ tình cảm ${entities.subject ? `với ${entities.subject}` : ''} ${timeNote}, tìm kiếm câu trả lời về sự thấu hiểu, gắn kết và hướng đi hòa hợp nhất.`;
      situationNarrative =
        `Trong chuyện tình cảm, quẻ #${queNum} (${primaryName}) khắc họa rõ nét trường năng lượng giữa hai người: ${upperTrigram.dynamic} đại diện cho thái độ đối phương, còn ${lowerTrigram.dynamic} phản ánh cảm xúc bên trong của bạn. ` +
        `Nút thắt sâu xa là sự lệch pha giữa kỳ vọng và cách bày tỏ, khiến những hiểu lầm nhỏ tích tụ thành khoảng cách. ` +
        `Hào Động #${haoNum} là điểm thử thách lòng kiên nhẫn và sự bao dung: nếu dùng cái tôi để áp đặt sẽ đẩy mối quan hệ vào ngõ cụt.`;
      concreteActions = [
        `**Bước 1 (Trong 48 giờ tới):** Tạm dừng việc tranh cãi đúng-sai hoặc đào xới lỗi lầm cũ; tạo cho cả hai một khoảng không gian tĩnh lặng để hạ nhiệt cảm xúc tiêu cực.`,
        `**Bước 2 (Chiến lược 7 ngày theo Hào Động #${haoNum}):** Chủ động mở lời bằng một cuộc trò chuyện chân thành, chia sẻ cảm xúc thật thay vì lời trách móc; chú trọng lắng nghe không phán xét.`,
        `**Bước 3 (Chuyển hóa sang Quẻ Biến #${transformedNum} ${transformedName}):** Thể hiện sự quan tâm qua một hành động thiết thực trong đời sống hàng ngày, chứng minh sự đồng hành bằng việc làm cụ thể.`,
      ];
      reflectionQ = `"Tôi đang tìm kiếm sự thấu cảm từ người ấy hay đang đòi hỏi họ phải đáp ứng những kỳ vọng chưa từng được chia sẻ rõ ràng?"`;
      break;

    case 'finance':
      questionRestated = `Bạn đang tìm kiếm quyết sách tài chính và đầu tư ${entities.subject ? `cho ${entities.subject}` : ''} ${timeNote}, nhằm tối ưu hóa dòng tiền và phòng tránh nguy cơ thất thoát vốn.`;
      situationNarrative =
        `Về vận tài, quẻ #${queNum} (${primaryName}) chỉ rõ quy luật dịch chuyển của dòng tiền: ngoại cảnh đang ở thế ${upperTrigram.dynamic}, đòi hỏi nội lực ${lowerTrigram.dynamic} phải cực kỳ tỉnh táo. ` +
        `Cạm bẫy lớn nhất lúc này là tâm lý nóng vội muốn sinh lời nhanh hoặc tin vào những lời cam kết thiếu cơ sở pháp lý. ` +
        `Hào Động #${haoNum} là lời cảnh báo về việc quản trị thanh khoản: giữ tiền chặt chẽ quan trọng hơn việc bung vốn mạo hiểm.`;
      concreteActions = [
        `**Bước 1 (Trong 24-48 giờ):** Tạm dừng các quyết định giải ngân lớn hoặc rót vốn vào các kênh có đòn bẩy cao; kiểm tra lại số dư dự phòng khẩn cấp.`,
        `**Bước 2 (Chiến lược 7 ngày theo Hào Động #${haoNum}):** Rà soát từng điều khoản hợp đồng, phí ẩn và cam kết thanh toán; tham vấn ý kiến độc lập từ người có chuyên môn tài chính trước khi ký kết.`,
        `**Bước 3 (Đón đầu Quẻ Biến #${transformedNum} ${transformedName}):** Ưu tiên bảo toàn vốn gốc và cơ cấu lại các khoản nợ tồn đọng để duy trì sự an tâm tuyệt đối.`,
      ];
      reflectionQ = `"Quyết định tài chính này xuất phát từ một kế hoạch có tính toán kỹ lưỡng hay bắt nguồn từ nỗi sợ bỏ lỡ cơ hội (FOMO)?"`;
      break;

    case 'exam':
      questionRestated = `Băn khoăn của bạn tập trung vào kỳ thi và con đường học vấn ${entities.subject ? `của ${entities.subject}` : ''} ${timeNote}, mong muốn biết được độ hanh thông và phương pháp bứt phá điểm số.`;
      situationNarrative =
        `Về học tập và thi cử, quẻ #${queNum} (${primaryName}) cho thấy: bảng vàng ghi danh không đến từ may rủi mà là kết quả của sự tôi luyện có phương pháp. ` +
        `Thượng Quái ${upperTrigram.name} tượng trưng cho độ khó của đề thi và áp lực cạnh tranh, trong khi Hạ Quái ${lowerTrigram.name} là nền tảng tri thức đã tích lũy. ` +
        `Hào Động #${haoNum} chỉ ra rằng điểm yếu lớn nhất cần khắc phục lúc này là tâm lý phòng thi và sự phân bổ thời gian làm bài.`;
      concreteActions = [
        `**Bước 1 (Trong 3 ngày tới):** Lập lại thời khóa biểu ôn luyện khoa học, tập trung bù đắp 2 chuyên đề kiến thức trọng tâm đang còn yếu nhất thay vì học dàn trải.`,
        `**Bước 2 (Chiến lược 7 ngày theo Hào Động #${haoNum}):** Rèn luyện giải đề thi thử dưới áp lực bấm giờ nghiêm ngặt để làm quen với nhịp độ phòng thi và ổn định tâm lý.`,
        `**Bước 3 (Chuyển hóa sang Quẻ Biến #${transformedNum} ${transformedName}):** Giữ gìn sức khỏe, ngủ đủ 7 tiếng mỗi đêm trước ngày thi để trí não luôn minh mẫn sáng suốt.`,
      ];
      reflectionQ = `"Tôi đã thực sự chuẩn bị với tất cả kỷ luật và sự tập trung, hay vẫn đang để những xao nhãng nhất thời làm giảm sút phong độ?"`;
      break;

    default:
      if (entities.optionA && entities.optionB) {
        questionRestated = `Bạn đang đứng trước ngã rẽ lựa chọn giữa "${entities.optionA}" và "${entities.optionB}" ${timeNote}, cần sự phân định sáng suốt về phương án tối ưu và ít rủi ro nhất.`;
        situationNarrative =
          `Đặt hai phương án lên bàn cân Kinh Dịch của Quẻ #${queNum} (${primaryName}): ` +
          `Phương án "${entities.optionA}" tương ứng với chiều hướng vận động của ${upperTrigram.dynamic}, trong khi "${entities.optionB}" gắn liền với thế ${lowerTrigram.dynamic}. ` +
          `Hào Động #${haoNum} cho thấy năng lượng vũ trụ nghiêng về sự vững chắc lâu dài hơn là lợi ích trước mắt.`;
        concreteActions = [
          `**Bước 1 (Trong 48 giờ tới):** Liệt kê chi tiết bảng so sánh 3 tiêu chí: mức độ rủi ro, chi phí thực tế, và khả năng rút lui an toàn của cả hai phương án.`,
          `**Bước 2 (Chiến lược 7 ngày theo Hào Động #${haoNum}):** Trao đổi bí mật với 1 người có kinh nghiệm thực chiến đi trước để kiểm chứng các giả định của bạn.`,
          `**Bước 3 (Đón đầu Quẻ Biến #${transformedNum} ${transformedName}):** Quyết định dứt khoát theo phương án tối ưu đã chọn và dồn toàn lực triển khai, không để tâm trí dao động hai lòng.`,
        ];
        reflectionQ = `"Nếu gạt bỏ nỗi sợ thất bại sang một bên, đâu là lựa chọn giúp tôi phát triển nội lực và tôn trọng phẩm giá của mình nhất?"`;
      } else {
        questionRestated = `Bạn đang tìm kiếm sự định hướng sâu sắc của Kinh Dịch về vận trình và những chuyển biến ${timeNote}, nhằm hành động thuận theo Đạo và đón lành tránh dữ.`;
        situationNarrative =
          `Xét toàn cảnh thời vận, quẻ #${queNum} (${primaryName}) phản ánh sự giao hòa giữa ngoại cảnh (${upperTrigram.dynamic}) và tâm thế nội tại (${lowerTrigram.dynamic}). ` +
          `Thoán Từ khẳng định: mọi biến động bên ngoài đều là tấm gương phản chiếu sự trưởng thành bên trong. ` +
          `Hào Động #${haoNum} chính là điểm mấu chốt nhắc nhở bạn cần thay đổi một thói quen hoặc góc nhìn cố hữu để khơi thông bế tắc.`;
        concreteActions = [
          `**Bước 1 (Trong 24-48 giờ):** Xác định rõ điều gì là ưu tiên số một cần giải quyết dứt điểm trong tuần này và loại bỏ các việc thứ yếu gây phân tán.`,
          `**Bước 2 (Chiến lược 7 ngày theo Hào Động #${haoNum}):** Ứng xử theo lời khuyên hào từ *"${changingLineText.slice(0, 45)}..."*: cẩn trọng trong lời ăn tiếng nói, tránh nóng nảy bốc đồng.`,
          `**Bước 3 (Hướng về Quẻ Biến #${transformedNum} ${transformedName}):** Kiên định với mục tiêu dài hạn, đón nhận sự thay đổi với tâm thế tích cực và chủ động.`,
        ];
        reflectionQ = `"Trong tình thế hiện tại, đâu là điều tôi cần buông bỏ để mở đường cho những cơ hội mới mẻ và lành mạnh bước vào cuộc đời?"`;
      }
      break;
  }

  return { questionRestated, situationNarrative, concreteActions, reflectionQ };
}

/**
 * STEP 3 & STEP 4: GENERATE RICH FALLBACK INTERPRETATION
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

  // Build domain-specific contextual content
  const domainContent = buildDomainSpecificContent(
    entities.domain,
    entities.domain === 'decision' && entities.optionA && entities.optionB ? entities : entities,
    queNum,
    haoNum,
    upperTrigram,
    lowerTrigram,
    primaryViet.name,
    changingLineText,
    transformed.number,
    transformedViet.name
  );

  // STEP 3: narrativeOverview (2-3 structured paragraphs)
  const paragraph1 =
    `Quẻ **#${queNum} - ${primaryViet.name} (${primaryViet.chinese})** phản ánh bức tranh thời thế bạn đang đối diện. ` +
    `Tượng quẻ là **${primaryViet.symbol}** (${primaryViet.element}), gắn với lời Thoán cổ văn: *"${primaryThoan}"*. ` +
    `Kinh Dịch không ban phát định mệnh bất di bất dịch, mà soi rọi các dòng chảy ngầm của hoàn cảnh. ${primaryViet.meaning}.`;

  const paragraph2 = domainContent.situationNarrative;

  const paragraph3 =
    `Đặc biệt, Hào Động thứ **${haoNum}** (${transformed.wasSolid ? 'Dương ⚊ hào động chuyển thành Âm ⚋' : 'Âm ⚋ hào động chuyển thành Dương ⚊'}) chính là điểm chịu lực và kích hoạt bước chuyển biến then chốt. ` +
    `Lời Hào căn dặn: *"${changingLineText}"*. ` +
    `Nắm vững quy luật ở hào này sẽ giúp bạn biến thế bị động thành chủ động, hóa giải nguy nan thành bước ngoặt phát triển.`;

  const narrativeOverview = `${paragraph1}\n\n${paragraph2}\n\n${paragraph3}`;

  // STEP 3: hexagramAnalysis (2 paragraphs)
  const hexAnalysis1 =
    `Về cấu trúc Bát Quái nội tại, Thượng Quái **${upperTrigram.name}** đại diện cho ngoại cảnh và áp lực thực tế, trong khi Hạ Quái **${lowerTrigram.name}** là căn cơ nội lực và tâm thế bên trong của bạn. ` +
    `Sự tương tác giữa ${upperTrigram.element} và ${lowerTrigram.element} tạo nên trường lực: ${upperTrigram.archetype} đang thử thách ${lowerTrigram.archetype}. ` +
    `Điểm ứng nghiệm tại Hào số ${haoNum} nhắc nhở bạn không nên cưỡng cầu ngoại cảnh, mà cần điều chỉnh hành vi từ gốc rễ nội tại.`;

  const hexAnalysis2 =
    `Từ chuyển động của Hào #${haoNum}, Quẻ Chủ biến hóa sang Quẻ Biến (Chi Quái 之卦) **#${transformed.number} - ${transformedViet.name} (${transformedViet.chinese})** ` +
    `(Thượng Quái: ${transUpper.name}, Hạ Quái: ${transLower.name}). Lời Thoán quẻ biến chỉ rõ: *"${transformedThoan}"*. ` +
    `Đây chính là quỹ đạo tương lai tự nhiên nếu bạn thực thi đúng kế sách: sự việc sẽ chuyển biến từ giằng co sang ${transformedViet.meaning.toLowerCase()}, đem lại sự vững vàng và thành tựu bền lâu.`;

  const hexagramAnalysis = `${hexAnalysis1}\n\n${hexAnalysis2}`;

  // Header Block
  let headerBlock = '';
  if (verdict.questionType === 'reflective') {
    headerBlock =
      `💡 **CORE INSIGHT (ĐẠI Ý CỐT LÕI):**\n` +
      `${verdict.coreInsight}\n\n` +
      `* **Độ sáng tỏ (Clarity):** ${verdict.clarity === 'clear' ? 'Sáng tỏ (Clear)' : verdict.clarity === 'mixed' ? 'Hòa trộn (Mixed)' : 'Cần chiêm nghiệm thêm (Murky)'}`;
  } else if (verdict.questionType === 'timing') {
    headerBlock =
      `🎯 **VERDICT: [WINDOW OF MOMENTUM — THỜI ĐIỂM THUẬN LỢI]**\n\n` +
      `* **Thời vận:** ${verdict.windowOfMomentum}\n` +
      `* **Điều kiện chuyển hóa:** ${verdict.whatCouldChangeIt}\n` +
      `* **Độ sáng tỏ (Clarity):** ${verdict.clarity === 'clear' ? 'Sáng tỏ (Clear)' : verdict.clarity === 'mixed' ? 'Hòa trộn (Mixed)' : 'Cần tĩnh tâm (Murky)'}`;
  } else if (verdict.questionType === 'quantitative' && verdict.estimatedCount) {
    headerBlock =
      `🎯 **VERDICT: [ESTIMATED COUNT — DỰ TOÁN: ~${verdict.estimatedCount.primaryNumber} (${verdict.estimatedCount.numericRange} ${verdict.estimatedCount.numericUnit})]**\n\n` +
      `* **Căn cứ Bát Quái:** ${verdict.estimatedCount.numericBasis}\n` +
      `* **Điều kiện thay đổi:** ${verdict.whatCouldChangeIt}\n` +
      `* **Độ sáng tỏ (Clarity):** ${verdict.clarity === 'clear' ? 'Sáng tỏ (Clear)' : 'Hòa trộn (Mixed)'}`;
  } else {
    headerBlock =
      `${verdict.badge}\n\n` +
      `* **Điều kiện xoay chuyển cục diện (What could change it):** ${verdict.whatCouldChangeIt}\n` +
      `* **Độ sáng tỏ (Clarity):** ${verdict.clarity === 'clear' ? 'Sáng tỏ (Clear)' : verdict.clarity === 'mixed' ? 'Hòa trộn (Mixed)' : 'Mờ ảo (Murky)'}`;
  }

  return (
    `${headerBlock}\n\n` +
    `🔍 **LÀM RÕ CÂU HỎI (QUESTION RESTATED):**\n` +
    `${domainContent.questionRestated}\n\n` +
    `🌊 **TỔNG QUAN THỜI THẾ & DÒNG CHẢY BIẾN DỊCH (NARRATIVE OVERVIEW):**\n` +
    `${narrativeOverview}\n\n` +
    `☯️ **TƯƠNG TÁC QUẺ VÀ NỘI HÀM BÁT QUÁI (HEXAGRAM & TRIGRAM DYNAMICS):**\n` +
    `${hexagramAnalysis}\n\n` +
    `⚡ **KẾ SÁCH HÀNH ĐỘNG 7 NGÀY (I CHING COUNSEL / 象傳):**\n` +
    `${domainContent.concreteActions.join('\n')}\n\n` +
    `🪞 **CÂU HỎI CHIÊM NGHIỆM ĐỂ TỰ VẤN (REFLECTION QUESTION):**\n` +
    `${domainContent.reflectionQ}`
  );
}
