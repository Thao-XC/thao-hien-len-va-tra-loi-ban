import hexagramsData from '../hexagrams.json' with { type: 'json' };
import { HEXAGRAM_DATA, getTransformedHexagram } from './hexagramPatterns';

interface QuestionCategory {
  type: 'career' | 'love' | 'decision' | 'finance' | 'general';
  topicVi: string;
  topicEn: string;
}

function detectCategory(question: string): QuestionCategory {
  const q = question.toLowerCase();
  
  if (/công việc|sự nghiệp|việc làm|công ty|sếp|đồng nghiệp|nhảy việc|phỏng vấn|thăng chức|dự án|career|job|work|boss|promotion|project|interview/.test(q)) {
    return { type: 'career', topicVi: 'công việc & sự nghiệp', topicEn: 'career & professional path' };
  }
  if (/tình|yêu|duyên|crush|người ấy|hẹn hò|kết hôn|chia tay|vợ|chồng|bạn gái|bạn trai|love|relationship|dating|marriage|partner|ex|romance/.test(q)) {
    return { type: 'love', topicVi: 'tình cảm & nhân duyên', topicEn: 'love & relationships' };
  }
  if (/tiền|tài lộc|tài chính|đầu tư|mua|bán|kinh doanh|buôn bán|lời|lỗ|money|finance|wealth|invest|business|profit/.test(q)) {
    return { type: 'finance', topicVi: 'tài chính, đầu tư & tài lộc', topicEn: 'finances, wealth & business' };
  }
  if (/nên|chọn|quyết định|thay đổi|bỏ|tiếp tục|đi|ở|should|decide|choice|change|stay|leave/.test(q)) {
    return { type: 'decision', topicVi: 'lựa chọn & quyết định cuộc sống', topicEn: 'choices & life decisions' };
  }
  return { type: 'general', topicVi: 'vận trình & hướng đi sắp tới', topicEn: 'life path & future direction' };
}

export function generateRichFallbackInterpretation(
  que: number,
  hao: number,
  question: string,
  language: 'en' | 'vi',
  history?: any[]
): string {
  const hexMap = hexagramsData as Record<string, any>;
  const primaryHex = hexMap[String(que)] || hexMap['1'];
  const primaryMeta = HEXAGRAM_DATA[que] || HEXAGRAM_DATA[1];
  const transformed = getTransformedHexagram(Number(que) || 1, Number(hao) || 1);
  const transformedHex = hexMap[String(transformed.number)] || primaryHex;
  const transformedMeta = transformed.meta;

  const category = detectCategory(question || '');

  const primaryJudgment =
    primaryHex?.wilhelm_judgment?.text ||
    'Thuận theo đạo trung chính, giữ tâm kiên định ắt vạn sự hanh thông.';
  const primaryLineText =
    primaryHex?.wilhelm_lines?.[String(hao)]?.text ||
    'Hành sự cẩn trọng, quan sát thời thế trước khi dốc toàn lực.';
  const transformedJudgment =
    transformedHex?.wilhelm_judgment?.text ||
    'Tương lai rộng mở khi bước qua biến cố chuyển hóa.';

  // Follow-up conversation
  if (history && history.length > 1) {
    if (language === 'vi') {
      return (
        `🌸 Thảo đã thấu suốt câu hỏi tiếp theo của bạn về ${category.topicVi}!\n\n` +
        `Quẻ gốc #${que} (${primaryMeta.vietnameseName}) đang chuyển hóa tại Hào ${hao} sang quẻ #${transformed.number} (${transformedMeta.vietnameseName}):\n\n` +
        `💡 Lời khuyên cụ thể cho bạn: "${primaryLineText}".\n` +
        `Đối với vấn đề bạn vừa hỏi, điều cốt lõi lúc này là không nên hấp tấp hành động theo cảm tính. Hãy nắm chắc thực lực (${primaryMeta.element}), giữ thái độ khách quan, lắng nghe người có kinh nghiệm thì mọi khúc mắc sẽ được tháo gỡ suôn sẻ.`
      );
    } else {
      return (
        `🌸 Lady Thao hears your heart on ${category.topicEn}!\n\n` +
        `With Primary Hexagram #${que} (${primaryHex?.english || 'The Oracle'}) shifting at Line ${hao} toward Hexagram #${transformed.number} (${transformedHex?.english || 'The Future'}):\n\n` +
        `💡 Direct Advice: "${primaryLineText}".\n` +
        `For your question, do not rush ahead or force an early outcome. Ground yourself in composure and clarity (${primaryMeta.element}), align with reality, and the path forward will open naturally.`
      );
    }
  }

  // Initial tailored reading
  if (language === 'vi') {
    let tailoredAdvice = '';
    switch (category.type) {
      case 'career':
        tailoredAdvice = `Về câu hỏi công việc: Quẻ cho thấy giai đoạn này đòi hỏi bạn tập trung củng cố chuyên môn và sự chuẩn bị kỹ lưỡng. Lời Hào ${hao} khuyên chớ vội vàng mạo hiểm hay đối đầu trực diện; hãy quan sát kỹ thời cơ và giữ mối quan hệ hòa nhã với đồng nghiệp, cấp trên. Khi bước sang Quẻ Biến #${transformed.number} (${transformedMeta.vietnameseName}), công việc sẽ có sự chuyển biến tích cực và cơ hội mới mở ra.`;
        break;
      case 'love':
        tailoredAdvice = `Về chuyện tình cảm & nhân duyên: Quẻ phản ánh năng lượng chuyển giao cảm xúc. Hào ${hao} nhắc nhở bạn cần sự chân thành, biết lắng nghe và hạ bớt cái tôi trong giao tiếp. Tránh nghi ngờ hay gượng ép đối phương. Hãy để mọi thứ phát triển tự nhiên theo tinh thần quẻ #${transformed.number} (${transformedMeta.vietnameseName}), tình cảm sẽ ngày càng thấu hiểu và bền chặt.`;
        break;
      case 'finance':
        tailoredAdvice = `Về tài chính & tài lộc: Thời điểm này nên ưu tiên quản lý chặt chẽ dòng tiền và hạn chế đầu tư rủi ro lớn. Lời Hào ${hao} cảnh báo nên đi từng bước vững chắc, tích lũy nội lực. Khi quẻ chuyển hóa thành #${transformed.number} (${transformedMeta.vietnameseName}), nguồn thu và tài vận sẽ dần ổn định trở lại.`;
        break;
      case 'decision':
        tailoredAdvice = `Về quyết định bạn đang băn khoăn: Quẻ khuyên bạn hãy cân nhắc kỹ giữa lợi ích trước mắt và giá trị lâu dài. Hào ${hao} chỉ rõ thời điểm then chốt nằm ở việc giữ vững nguyên tắc và không để cảm xúc nhất thời chi phối. Quẻ Biến #${transformed.number} (${transformedMeta.vietnameseName}) mở ra kết quả thuận lợi nếu bạn quyết định một cách tỉnh táo và có chuẩn bị.`;
        break;
      default:
        tailoredAdvice = `Đối với điều bạn đang trăn trở ("${question || 'vận trình tổng quan'}"): Hãy lấy lời răn của Hào ${hao} làm kim chỉ nam. Giữ tâm thái an tĩnh, hành sự trung chính thì mọi trắc trở ban đầu đều sẽ chuyển hóa thành cát lợi, giúp bạn vững bước tiến tới quẻ #${transformed.number} (${transformedMeta.vietnameseName}).`;
    }

    return (
      `🌸 Thảo chào bạn! Về câu hỏi của bạn: "${question || 'Xin luận giải vận trình'}", Thảo đã xem xét kỹ lưỡng huyền cơ trong thẻ xăm:\n\n` +
      `📜 1. Hiện Trạng (Quẻ Chủ #${que} - ${primaryMeta.vietnameseName}):\n` +
      `Thoán Từ: "${primaryJudgment}". Tượng trưng cho hoàn cảnh nền tảng lúc này mang ngũ hành ${primaryMeta.element}.\n\n` +
      `⚡ 2. Điểm Then Chốt (Hào Động ${hao}):\n` +
      `Lời Hào mách nước: "${primaryLineText}". Đây chính là yếu tố quyết định sự chuyển biến của sự việc.\n\n` +
      `✨ 3. Xu Hướng Tương Lai (Quẻ Biến #${transformed.number} - ${transformedMeta.vietnameseName}):\n` +
      `Thoán Từ Quẻ Biến: "${transformedJudgment}".\n\n` +
      `🔮 4. Luận Giải & Lời Khuyên Của Thảo:\n` +
      `${tailoredAdvice}`
    );
  } else {
    let tailoredAdvice = '';
    switch (category.type) {
      case 'career':
        tailoredAdvice = `Regarding your career inquiry: The oracle indicates a pivotal period where groundwork and patience are paramount. Line ${hao} counsels against reckless risks or confrontations; observe the environment and build your competencies. As the energy shifts to Transformed Hexagram #${transformed.number} (${transformedHex?.english || ''}), favorable momentum and new doors will open.`;
        break;
      case 'love':
        tailoredAdvice = `Regarding your relationship inquiry: The hexagram mirrors an evolving emotional phase. Line ${hao} reminds you to lead with empathy, open communication, and patience. Avoid forcing outcomes. Moving into Hexagram #${transformed.number} (${transformedHex?.english || ''}), mutual trust and deep clarity will blossom.`;
        break;
      case 'finance':
        tailoredAdvice = `Regarding your financial inquiry: Prudence and careful asset management are favored over speculative gambles. Line ${hao} advises step-by-step consolidation. As Hexagram #${transformed.number} (${transformedHex?.english || ''}) takes form, stability and rewards will align.`;
        break;
      default:
        tailoredAdvice = `Regarding your question ("${question || 'life guidance'}"): Take the counsel of Line ${hao} as your beacon. Cultivate balance and patient determination, allowing initial hurdles to transform into harmonious progress under Hexagram #${transformed.number} (${transformedHex?.english || ''}).`;
    }

    return (
      `🌸 Welcome, seeker! For your question: "${question || 'General Guidance'}", Lady Thao has deciphered the divine oracle:\n\n` +
      `📜 1. Present Situation (Primary Hexagram #${que} - ${primaryHex?.english || 'The Oracle'}):\n` +
      `Judgment: "${primaryJudgment}". Governed by the elemental force of ${primaryMeta.element}.\n\n` +
      `⚡ 2. The Turning Point (Changing Line ${hao}):\n` +
      `Line Oracle: "${primaryLineText}". This is the vital inflection point.\n\n` +
      `✨ 3. Resulting Trajectory (Transformed Hexagram #${transformed.number} - ${transformedHex?.english || 'The Result'}):\n` +
      `Judgment: "${transformedJudgment}".\n\n` +
      `🔮 4. Lady Thao's Tailored Guidance:\n` +
      `${tailoredAdvice}`
    );
  }
}
