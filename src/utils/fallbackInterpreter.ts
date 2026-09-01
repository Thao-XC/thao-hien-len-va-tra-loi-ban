import hexagramsData from '../hexagrams.json' with { type: 'json' };
import { HEXAGRAM_DATA, getTransformedHexagram } from './hexagramPatterns';

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

  const primaryJudgment =
    primaryHex?.wilhelm_judgment?.text ||
    'Thuận theo đạo trung chính, giữ tâm kiên định ắt vạn sự hanh thông.';
  const primaryLineText =
    primaryHex?.wilhelm_lines?.[String(hao)]?.text ||
    'Hành sự cẩn trọng, quan sát thời thế trước khi dốc toàn lực.';
  const transformedJudgment =
    transformedHex?.wilhelm_judgment?.text ||
    'Tương lai rộng mở khi bước qua biến cố chuyển hóa.';

  // If this is a follow-up question
  if (history && history.length > 1) {
    if (language === 'vi') {
      return (
        `Thảo hiểu băn khoăn của bạn! Với câu hỏi này, quẻ gốc #${que} (${primaryMeta.vietnameseName}) đang chuyển dịch mạnh mẽ tại Hào ${hao} để tiến tới quẻ #${transformed.number} (${transformedMeta.vietnameseName}).\n\n` +
        `Lời khuyên mấu chốt: "${primaryLineText}". Bạn chớ nên nóng vội hay cưỡng cầu điều chưa chín muồi. Hãy tập trung củng cố nội lực (${primaryMeta.element}), giữ sự chân thành và khiêm nhường thì mọi sự sẽ dần thuận buồm xuôi gió.`
      );
    } else {
      return (
        `Lady Thao hears your heart! For your follow-up, Primary Hexagram #${que} (${primaryHex?.english || 'The Oracle'}) shifting at Line ${hao} toward Hexagram #${transformed.number} (${transformedHex?.english || 'The Future'}) advises:\n\n` +
        `"${primaryLineText}". Do not rush or force premature outcomes. Nurture your inner composure and act with sincerity to navigate toward clarity.`
      );
    }
  }

  // Initial interpretation
  if (language === 'vi') {
    return (
      `🌸 Chào bạn, hãy an lòng. Thảo đã gieo được quẻ xăm linh ứng cho bạn:\n\n` +
      `📜 Quẻ Chủ: #${que} - ${primaryMeta.vietnameseName} (${primaryMeta.upperTrigram} trên ${primaryMeta.lowerTrigram}, ngũ hành ${primaryMeta.element}).\n` +
      `Thoán Từ dạy rằng: "${primaryJudgment}". Đây là nền tảng hiện tại của sự việc.\n\n` +
      `⚡ Hào Động: Hào ${hao} (${transformed.wasSolid ? 'Hào Dương' : 'Hào Âm'} biến đổi).\n` +
      `Lời Hào mách nước: "${primaryLineText}". Đây chính là điểm then chốt nhất mà bạn cần lưu tâm.\n\n` +
      `✨ Quẻ Biến: #${transformed.number} - ${transformedMeta.vietnameseName} (${transformedHex?.english || ''}).\n` +
      `Thoán Từ Quẻ Biến: "${transformedJudgment}".\n\n` +
      `🔮 Lời Thảo nhắn gửi về câu hỏi "${question || 'vận trình'}": Hãy lắng nghe lời răn của Hào ${hao}, giữ tâm trung chính, thuận theo lẽ tự nhiên thì điềm hung cũng hóa cát, tiền đồ sẽ hanh thông sáng rõ.`
    );
  } else {
    return (
      `🌸 Welcome, dear traveler. Lady Thao has cast the sacred bamboo stick for you:\n\n` +
      `📜 Primary Hexagram: #${que} - ${primaryHex?.english || 'The Creative'} (Upper: ${primaryMeta.upperTrigram}, Lower: ${primaryMeta.lowerTrigram}, Element: ${primaryMeta.element}).\n` +
      `Judgment: "${primaryJudgment}". This reflects your present root condition.\n\n` +
      `⚡ Changing Line: Line ${hao} (${transformed.wasSolid ? 'Solid Line' : 'Broken Line'} transforming).\n` +
      `Line Oracle: "${primaryLineText}". This is the precise turning point.\n\n` +
      `✨ Transformed Hexagram: #${transformed.number} - ${transformedHex?.english || 'The Result'}.\n` +
      `Resulting Judgment: "${transformedJudgment}".\n\n` +
      `🔮 Lady Thao's guidance for "${question || 'your path'}": Heed the wisdom of Line ${hao}, preserve inner rectitude, and align with natural timing to transform obstacles into lasting peace.`
    );
  }
}
