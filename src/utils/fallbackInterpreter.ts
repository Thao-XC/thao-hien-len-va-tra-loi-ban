import { VIETNAMESE_HEXAGRAMS } from '../data/vietnameseHexagrams';
import { HEXAGRAM_DATA, getTransformedHexagram } from './hexagramPatterns';

interface QuestionCategory {
  type: 'career' | 'love' | 'decision' | 'finance' | 'exam' | 'health' | 'general';
  topicVi: string;
}

interface QuestionEntities {
  subject: string;
  timeframe: string;
  action: string;
  isPolar: boolean;
}

function extractEntities(rawQ: string): QuestionEntities {
  const q = (rawQ || '').trim();
  const lower = q.toLowerCase();

  // 1. Timeframe
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
  }

  // 2. Action
  let action = '';
  if (/kết hôn|cưới|lấy chồng|lấy vợ|kết duyên/i.test(lower)) action = 'kết hôn';
  else if (/chia tay|ly hôn|dừng lại/i.test(lower)) action = 'chia tay';
  else if (/chuyển việc|nhảy việc|đổi việc/i.test(lower)) action = 'chuyển đổi công việc';
  else if (/thăng chức|tăng lương/i.test(lower)) action = 'thăng tiến';
  else if (/mua nhà|mua đất|mua xe/i.test(lower)) action = 'mua tài sản lớn';
  else if (/đầu tư|khởi nghiệp|kinh doanh|mở quán/i.test(lower)) action = 'đầu tư kinh doanh';
  else if (/thi đỗ|đậu đại học|tốt nghiệp|du học/i.test(lower)) action = 'thi cử đỗ đạt';

  // 3. Subject (extract proper capitalized name like "Mirai", "Nam", etc. or pronouns)
  let subject = '';
  const words = q.split(/\s+/);
  const potentialNames = words.filter((w) => {
    const clean = w.replace(/[^a-zA-ZÀ-ỹ]/g, '');
    return (
      /^[A-Z][a-zÀ-ỹ]+$/.test(clean) &&
      !/^(Tôi|Mình|Bạn|Em|Anh|Chị|Có|Không|Năm|Tháng|Hỏi|Xin|Cho|Liệu|Quẻ|Cô|Thảo)$/i.test(clean)
    );
  });
  if (potentialNames.length > 0) {
    subject = potentialNames.join(' ');
  } else if (/người ấy|crush|bạn gái|bạn trai|người yêu/i.test(lower)) {
    subject = 'người ấy';
  }

  const isPolar = /có\s+.*\s+không|được\s+không|thành\s+không|liệu\s+có|nên\s+.*\s+không/i.test(lower);

  return { subject, timeframe, action, isPolar };
}

const AUSPICIOUS_HEXAGRAMS = new Set([
  1, 11, 14, 15, 19, 26, 30, 31, 35, 42, 45, 46, 50, 53, 55, 57, 58, 61,
]);
const INAUSPICIOUS_HEXAGRAMS = new Set([6, 12, 23, 29, 38, 39, 47, 54]);

function detectCategory(question: string): QuestionCategory {
  const q = (question || '').toLowerCase();

  if (
    /công việc|sự nghiệp|việc làm|công ty|sếp|đồng nghiệp|nhảy việc|phỏng vấn|thăng chức|dự án|hợp đồng|khởi nghiệp|kinh doanh|mở quán|buôn bán/.test(
      q
    )
  ) {
    return { type: 'career', topicVi: 'công danh, sự nghiệp & dự án phát triển' };
  }
  if (
    /tình|yêu|duyên|crush|người ấy|hẹn hò|kết hôn|chia tay|vợ|chồng|bạn gái|bạn trai|tình cảm|gặp lại|quay lại|cưới/.test(
      q
    )
  ) {
    return { type: 'love', topicVi: 'tình duyên, hôn nhân & các mối quan hệ' };
  }
  if (
    /tiền|tài lộc|tài chính|đầu tư|mua|bán|chứng khoán|đất|nhà|bất động sản|lợi nhuận|lỗ|lãi|vay|trả nợ/.test(
      q
    )
  ) {
    return { type: 'finance', topicVi: 'tài chính, tiền tài & quyết định đầu tư' };
  }
  if (/thi|học|đỗ|tốt nghiệp|bằng|chứng chỉ|điểm|du học/.test(q)) {
    return { type: 'exam', topicVi: 'học tập, thi cử & bồi dưỡng năng lực' };
  }
  if (/sức khỏe|bệnh|mệt|tâm an|ngủ|chữa|khỏe|bình an/.test(q)) {
    return { type: 'health', topicVi: 'sức khỏe, thể chất & sự bình an tâm trí' };
  }
  if (/nên|chọn|quyết định|thay đổi|bỏ|tiếp tục|đi|ở|rẽ|ngã rẽ|phương án/.test(q)) {
    return { type: 'decision', topicVi: 'ngã rẽ chọn lựa & định hướng cuộc sống' };
  }
  return { type: 'general', topicVi: 'vận trình & thời vận tổng quát' };
}

export function generateRichFallbackInterpretation(
  que: number,
  hao: number,
  question: string,
  _language: string = 'vi',
  history?: any[]
): string {
  const queNum = Number(que) || 1;
  const haoNum = Number(hao) || 1;

  const primaryViet = VIETNAMESE_HEXAGRAMS[queNum] || VIETNAMESE_HEXAGRAMS[1];
  const primaryMeta = HEXAGRAM_DATA[queNum] || HEXAGRAM_DATA[1];
  const transformed = getTransformedHexagram(queNum, haoNum);
  const transformedViet = VIETNAMESE_HEXAGRAMS[transformed.number] || VIETNAMESE_HEXAGRAMS[1];
  const transformedMeta = transformed.meta;

  const category = detectCategory(question || '');
  const userQ = question?.trim() || 'Xin luận giải vận trình và hướng đi phía trước';

  const primaryThoan = primaryViet.thoanTu;
  const changingLineText = primaryViet.haoTu[haoNum] || primaryViet.haoTu[1];
  const transformedThoan = transformedViet.thoanTu;

  // Follow-up conversation reply
  if (history && history.length > 1) {
    return (
      `🎯 **TRẢ LỜI TRỰC TIẾP:**\n` +
      `Về việc bạn hỏi: *"${userQ}"*\n\n` +
      `- **Cục diện hiện tại:** Quẻ #${queNum} (${primaryViet.name}) - ${primaryViet.meaning}\n` +
      `- **Hành động then chốt (Hào ${haoNum}):** Thuận theo lời Hào "${changingLineText.replace(/^Hào \d+[^:]*:\s*/, '')}".\n` +
      `- **Kết luận & lời khuyên:** Cần dứt khoát, minh bạch và kiên trì với phương án đã chọn. Tránh dao động hoặc nghe theo lời bàn tán xung quanh.`
    );
  }

  // Initial rich tailored reading in 100% Vietnamese
  const entities = extractEntities(question || '');
  const isAuspicious = AUSPICIOUS_HEXAGRAMS.has(queNum);
  const isInauspicious = INAUSPICIOUS_HEXAGRAMS.has(queNum);

  let directVerdict = '';
  let concreteAdviceDos: string[] = [];
  let concreteAdviceDonts: string[] = [];
  let timingAndOutcome = '';

  // If user asked about a specific person, timeframe (e.g. 2028), or specific action, directly address it!
  if (entities.subject || entities.timeframe || entities.action) {
    const focusTarget = entities.subject ? `**${entities.subject}**` : 'bạn';
    const focusAction = entities.action ? `có ${entities.action}` : 'có đạt được dự định';
    const focusTime = entities.timeframe ? `vào **${entities.timeframe}**` : '';

    const verdictCore = isAuspicious
      ? 'CÓ KHẢ NĂNG RẤT CAO (CÁT KHÍ & THỜI CƠ THUẬN LỢI)'
      : isInauspicious
      ? 'CHƯA PHẢI THỜI ĐIỂM CHÍN MUỒI (CÒN NHIỀU TRỞ NGẠI)'
      : 'HOÀN TOÀN CÓ THỂ ĐẠT ĐƯỢC NẾU CHỦ ĐỘNG HÓA GIẢI KHÚC MẮC';

    directVerdict =
      `🎯 **KẾT LUẬN TRỰC DIỆN:**\n` +
      `Về câu hỏi *${focusTarget} ${focusAction} ${focusTime} hay không*:\n` +
      `Dựa theo quẻ #${queNum} (${primaryViet.name}) và Hào ${haoNum} động biến sang #${transformed.number} (${transformedViet.name}):\n` +
      `-> **KẾT QUẢ: ${verdictCore}**.\n` +
      `${entities.timeframe ? `Mốc thời gian ${entities.timeframe} ` : 'Giai đoạn này '}${
        isAuspicious
          ? `là thời điểm hội tụ nhân duyên và điều kiện thuận lợi để tiến tới bước ngoặt lớn.`
          : `vẫn cần thêm sự kiên nhẫn, tháo gỡ từng khúc mắc thực tế trước khi đi đến quyết định chung kết.`
      }`;
  }

  switch (category.type) {
    case 'career':
      if (!directVerdict) {
        directVerdict = `🎯 **KẾT LUẬN TRỰC DIỆN:**\n` +
          `Về công việc/dự định: **${
            queNum === 1 || queNum === 11 || queNum === 14 || queNum === 35 || queNum === 42 || queNum === 50
              ? 'RẤT NÊN TIẾN HÀNH (ĐẠI CÁT)'
              : queNum === 6 || queNum === 12 || queNum === 23 || queNum === 29 || queNum === 47
              ? 'CHƯA NÊN VỘI VÃ (CẦN CỦNG CỐ THÊM NỘI LỰC)'
              : 'NÊN THỰC HIỆN TỪNG BƯỚC CHẮC CHẮN'
          }**. ${
            queNum === 6 || queNum === 12 || queNum === 29
              ? 'Hiện tại chưa phải thời cơ chín muồi, cần rà soát lại kỹ lưỡng.'
              : 'Cơ hội thành công cao nếu bạn chủ động và tập trung dứt điểm từng mục tiêu.'
          }`;
      }
      concreteAdviceDos = [
        `Rà soát kỹ hợp đồng, thỏa thuận và trau dồi năng lực chuyên môn cốt lõi.`,
        'Chủ động xin ý kiến hoặc hợp tác với người có thẩm quyền/uy tín cao.',
      ];
      concreteAdviceDonts = [
        'Tránh nóng vội tranh cãi hay thay đổi định hướng đột ngột.',
        'Tuyệt đối không để cảm xúc cá nhân chi phối quyết định công việc.',
      ];
      timingAndOutcome = `Quẻ Biến #${transformed.number} (${transformedViet.name}) cho thấy: ${
        entities.timeframe ? `Đến ${entities.timeframe}` : 'Khi bạn làm đúng 2 điều trên'
      }, kết quả sẽ chuyển biến rõ rệt, công việc thông suốt và đạt sự công nhận.`;
      break;

    case 'love':
      if (!directVerdict) {
        directVerdict = `🎯 **KẾT LUẬN TRỰC DIỆN:**\n` +
          `Về chuyện tình cảm/mối quan hệ: **${
            queNum === 31 || queNum === 11 || queNum === 37 || queNum === 8 || queNum === 61
              ? 'RẤT THUẬN LỢI & CÓ DUYÊN TỐT'
              : queNum === 38 || queNum === 54 || queNum === 6 || queNum === 12
              ? 'CÓ KHÚC MẮC CẦN GIẢI QUYẾT NGAY'
              : 'CẦN CHỦ ĐỘNG VÀ CHÂN THÀNH HƠN'
          }**. ${
            queNum === 38 || queNum === 6
              ? 'Hai bên đang thiếu sự thấu hiểu, cần nói chuyện thẳng thắn.'
              : 'Tình cảm đang có cơ hội gắn kết sâu sắc nếu biết trân trọng.'
          }`;
      }
      concreteAdviceDos = [
        'Mở lòng nói chuyện thẳng thắn, rõ ràng với thái độ lắng nghe.',
        'Thể hiện sự quan tâm bằng hành động thực tế mỗi ngày.',
      ];
      concreteAdviceDonts = [
        'Tránh suy diễn, im lặng kéo dài (chiến tranh lạnh) hoặc bới móc chuyện cũ.',
        'Không áp đặt mong muốn của bản thân lên đối phương.',
      ];
      timingAndOutcome = `Quẻ Biến #${transformed.number} (${transformedViet.name}): ${
        entities.timeframe
          ? `Mốc ${entities.timeframe} là thời điểm mối quan hệ sẽ có câu trả lời và bước chuyển then chốt.`
          : 'Mọi hiểu lầm sẽ được tháo gỡ khi hai bên chủ động đối thoại chân thành.'
      }`;
      break;

    case 'finance':
      directVerdict = `🎯 **KẾT LUẬN TRỰC DIỆN:**\n` +
        `Về tài chính/tiền bạc/đầu tư: **${
          queNum === 14 || queNum === 26 || queNum === 42 || queNum === 11
            ? 'THỜI CƠ SINH LỜI TỐT - NÊN ĐẦU TƯ CÓ TÍNH TOÁN'
            : queNum === 41 || queNum === 47 || queNum === 29 || queNum === 60
            ? 'KHÔNG NÊN MẠO HIỂM - CẦN GIỮ CHẶT TÚI TIỀN'
            : 'THU NHẬP ỔN ĐỊNH - NÊN ĐI TỪNG BƯỚC AN TOÀN'
        }**.`;
      concreteAdviceDos = [
        'Quản lý chặt chẽ dòng tiền, chỉ chi tiêu và đầu tư vào kênh bạn hiểu rõ.',
        'Lập quỹ dự phòng an toàn trước khi mở rộng kinh doanh.',
      ];
      concreteAdviceDonts = [
        'Tuyệt đối không tham gia các kênh đầu tư mập mờ, cam kết lãi suất ảo.',
        'Tránh vay mượn vượt quá khả năng chi trả.',
      ];
      timingAndOutcome = `Quẻ Biến #${transformed.number} (${transformedViet.name}): Nguồn tài chính sẽ tăng trưởng ổn định và an toàn khi bạn giữ vững kỷ luật.`;
      break;

    case 'exam':
      directVerdict = `🎯 **KẾT LUẬN TRỰC DIỆN:**\n` +
        `Về thi cử/học tập: **${
          queNum === 30 || queNum === 4 || queNum === 26 || queNum === 46 || queNum === 50
            ? 'KẾT QUẢ ĐẠT KỲ VỌNG - ĐỖ ĐẠT KHẢ QUAN'
            : 'CẦN TẬP TRUNG CAO ĐỘ ĐỂ BÙ ĐẮP LỖ HỔNG KIẾN THỨC'
        }**.`;
      concreteAdviceDos = [
        'Ôn luyện bám sát cấu trúc đề thi, nắm chắc kiến thức nền tảng.',
        'Giữ tinh thần thoải mái, ngủ đủ giấc trước ngày thi.',
      ];
      concreteAdviceDonts = [
        'Tránh chủ quan hoặc học dồn dập thức khuya sát giờ thi.',
        'Không để tâm lý hoang mang làm phân tán sự tập trung.',
      ];
      timingAndOutcome = `Quẻ Biến #${transformed.number} (${transformedViet.name}): Điểm số và kết quả sẽ xứng đáng với mức độ nghiêm túc ôn tập của bạn.`;
      break;

    default:
      directVerdict = `🎯 **KẾT LUẬN TRỰC DIỆN:**\n` +
        `Về câu hỏi: *"${userQ}"* — **${
          queNum === 1 || queNum === 11 || queNum === 14 || queNum === 15 || queNum === 42
            ? 'VẬN THẾ HANH THÔNG - NÊN QUYẾT ĐOÁN HÀNH ĐỘNG'
            : queNum === 12 || queNum === 23 || queNum === 29 || queNum === 39
            ? 'CẦN THẬN TRỌNG - NÊN CHỜ THÊM THỜI CƠ THÍCH HỢP'
            : 'ĐIỀU KIỆN ĐANG THUẬN LỢI NẾU BẠN CHỦ ĐỘNG'
        }**.`;
      concreteAdviceDos = [
        `Hành động thực tế theo nguyên lý quẻ ${primaryViet.name}: "${primaryViet.meaning}".`,
        'Chuẩn bị phương án dự phòng và kiên định với mục tiêu.',
      ];
      concreteAdviceDonts = [
        'Tránh bốc đồng hoặc nghe theo những lời bàn tán thiếu căn cứ.',
        'Không trì hoãn khi điều kiện thuận lợi đã xuất hiện.',
      ];
      timingAndOutcome = `Quẻ Biến #${transformed.number} (${transformedViet.name}): Vấn đề sẽ có lời giải rõ ràng và chuyển biến tích cực trong thời gian tới.`;
      break;
  }

  return (
    `${directVerdict}\n\n` +
    `📜 **QUẺ CHỦ & CỤC DIỆN (Quẻ #${queNum} - ${primaryViet.name}):**\n` +
    `Quẻ mang tượng **${primaryViet.symbol}** (${primaryViet.element}). Thoán Từ: *"${primaryThoan}"*. Thực trạng: ${primaryViet.meaning}\n\n` +
    `⚡ **HÀNH ĐỘNG CỤ THỂ (Hào Động ${haoNum}):**\n` +
    `Lời Hào: *"${changingLineText}"*.\n` +
    `- ✔️ **Nên làm:**\n` +
    `  1. ${concreteAdviceDos[0]}\n` +
    `  2. ${concreteAdviceDos[1]}\n` +
    `- ❌ **Cần tránh:**\n` +
    `  1. ${concreteAdviceDonts[0]}\n` +
    `  2. ${concreteAdviceDonts[1]}\n\n` +
    `🔮 **KẾT QUẢ & THỜI ĐIỂM (Quẻ Biến #${transformed.number} - ${transformedViet.name}):**\n` +
    `${timingAndOutcome}\n\n` +
    `💡 **LỜI KHUYÊN CỐT LÕI TỪ CÔ THẢO:**\n` +
    `Hãy tin vào năng lực và sự chuẩn bị của chính bạn; hành động chuẩn xác, dứt khoát sẽ mang lại kết quả tốt nhất.`
  );
}
