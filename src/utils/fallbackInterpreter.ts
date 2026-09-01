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

  // Authentic Vietnamese translations of fundamental energies
  const defaultViJudgment = `Thời vận của quẻ mang năng lượng ${primaryMeta.element} (${primaryMeta.upperTrigram}/${primaryMeta.lowerTrigram}), khuyên bạn giữ tâm trung chính, biết tùy thời biến chuyển thì mưu sự tất thành.`;
  const defaultViLine = `Hào ${hao} là hào biến động then chốt, nhắc bạn chớ manh động, cần xét rõ thời cơ và hành sự cẩn trọng.`;
  const defaultViTransformedJudgment = `Quẻ Biến mở ra hướng đi mới thuận hòa, tiền đồ quang đãng khi bạn vượt qua được thử thách chuyển dịch.`;

  // Follow-up conversation
  if (history && history.length > 1) {
    if (language === 'vi') {
      return (
        `🌸 Thảo đã lắng nghe câu hỏi tiếp theo của bạn về vấn đề ${category.topicVi}!\n\n` +
        `Quẻ gốc #${que} (${primaryMeta.vietnameseName}) đang chuyển hóa tại Hào ${hao} sang quẻ #${transformed.number} (${transformedMeta.vietnameseName}):\n\n` +
        `💡 Lời khuyên cụ thể cho bạn: ${defaultViLine}\n` +
        `Đối với thắc mắc này, điều cốt lõi lúc này là không nên hấp tấp hành động theo cảm tính. Hãy nắm chắc thực lực (${primaryMeta.element}), giữ thái độ khiêm nhu và sáng suốt thì mọi khúc mắc sẽ được tháo gỡ suôn sẻ.`
      );
    } else {
      return (
        `🌸 Lady Thao hears your heart on ${category.topicEn}!\n\n` +
        `With Primary Hexagram #${que} (${primaryHex?.english || 'The Oracle'}) shifting at Line ${hao} toward Hexagram #${transformed.number} (${transformedHex?.english || 'The Future'}):\n\n` +
        `💡 Direct Advice: Ground yourself in composure and clarity (${primaryMeta.element}). Align with reality, and the path forward will open naturally.`
      );
    }
  }

  // Initial tailored reading
  if (language === 'vi') {
    let tailoredAdvice = '';
    switch (category.type) {
      case 'career':
        tailoredAdvice = `Về công việc & dự định của bạn: Quẻ cho thấy giai đoạn này bạn đang nắm trong tay cơ hội tốt nhưng cần sự chuẩn bị kỹ lưỡng. Lời Hào ${hao} khuyên chớ vội vàng mạo hiểm hay đối đầu trực diện; hãy chủ động trau dồi chuyên môn và tìm kiếm sự hỗ trợ từ cấp trên hoặc người có kinh nghiệm ("lợi kiến đại nhân"). Khi bước sang Quẻ Biến #${transformed.number} (${transformedMeta.vietnameseName}), công việc sẽ có sự chuyển biến tích cực và thành quả xứng đáng sẽ đến.`;
        break;
      case 'love':
        tailoredAdvice = `Về chuyện tình cảm & nhân duyên: Quẻ phản ánh năng lượng chuyển giao cảm xúc. Hào ${hao} nhắc nhở bạn cần sự chân thành, biết lắng nghe và hạ bớt cái tôi trong giao tiếp. Tránh nghi ngờ hay gượng ép đối phương. Hãy để mọi thứ phát triển tự nhiên theo tinh thần quẻ #${transformed.number} (${transformedMeta.vietnameseName}), tình cảm sẽ ngày càng thấu hiểu và gắn kết bền chặt.`;
        break;
      case 'finance':
        tailoredAdvice = `Về tài chính & tiền tài: Thời điểm này nên ưu tiên quản lý chặt chẽ dòng tiền và hạn chế đầu tư rủi ro lớn. Lời Hào ${hao} cảnh báo nên đi từng bước vững chắc, tích lũy nội lực. Khi quẻ chuyển hóa thành #${transformed.number} (${transformedMeta.vietnameseName}), nguồn thu và tài vận sẽ dần sinh sôi, ổn định vững vàng.`;
        break;
      case 'decision':
        tailoredAdvice = `Về quyết định bạn đang trăn trở: Quẻ khuyên bạn hãy cân nhắc kỹ giữa lợi ích trước mắt và giá trị lâu dài. Hào ${hao} chỉ rõ thời điểm then chốt nằm ở việc giữ vững nguyên tắc và không để cảm xúc nhất thời chi phối. Quẻ Biến #${transformed.number} (${transformedMeta.vietnameseName}) mở ra kết quả thuận lợi nếu bạn quyết định một cách tỉnh táo và có chuẩn bị.`;
        break;
      default:
        tailoredAdvice = `Đối với điều bạn đang trăn trở ("${question || 'vận trình tổng quan'}"): Hãy lấy năng lượng trung chính của Hào ${hao} làm kim chỉ nam. Giữ tâm thái an tĩnh, hành sự có đạo lý thì mọi trắc trở ban đầu đều sẽ chuyển hóa thành cát lợi, giúp bạn vững bước tiến tới quẻ #${transformed.number} (${transformedMeta.vietnameseName}).`;
    }

    return (
      `🌸 Thảo chào bạn! Về câu hỏi của bạn: "${question || 'Xin luận giải vận trình'}", Thảo đã xem xét kỹ lưỡng huyền cơ trong thẻ xăm:\n\n` +
      `📜 1. HIỆN TRẠNG (Quẻ Chủ #${que} - ${primaryMeta.vietnameseName}):\n` +
      `${defaultViJudgment}\n\n` +
      `⚡ 2. ĐIỂM THEN CHỐT & LỜI KHUYÊN (Hào Động ${hao}):\n` +
      `${defaultViLine}\n\n` +
      `✨ 3. KẾT QUẢ TƯƠNG LAI (Quẻ Biến #${transformed.number} - ${transformedMeta.vietnameseName}):\n` +
      `${defaultViTransformedJudgment}\n\n` +
      `🔮 4. LỜI KHUYÊN CỦA CÔ THẢO DÀNH RIÊNG CHO BẠN:\n` +
      `${tailoredAdvice}\n\n` +
      `Chúc bạn luôn an yên và vững tin vào sự lựa chọn của mình!`
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
      `Governed by the elemental force of ${primaryMeta.element} (${primaryMeta.upperTrigram} / ${primaryMeta.lowerTrigram}).\n\n` +
      `⚡ 2. The Turning Point (Changing Line ${hao}):\n` +
      `Line ${hao} is the vital inflection point: balance caution with foresight.\n\n` +
      `✨ 3. Resulting Trajectory (Transformed Hexagram #${transformed.number} - ${transformedHex?.english || 'The Result'}):\n` +
      `A harmonious resolution emerges as the transformation completes.\n\n` +
      `🔮 4. Lady Thao's Tailored Guidance:\n` +
      `${tailoredAdvice}`
    );
  }
}
