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
  const primaryJudgment = primaryHex?.wilhelm_judgment?.text || '';
  const changingLineText = primaryHex?.wilhelm_lines?.[String(hao)]?.text || '';

  // Follow-up conversation
  if (history && history.length > 1) {
    if (language === 'vi') {
      return (
        `🌸 Thảo đã lắng nghe câu hỏi tiếp theo của bạn về vấn đề ${category.topicVi}!\n\n` +
        `Quẻ gốc #${que} (${primaryMeta.vietnameseName}) đang chuyển hóa tại Hào ${hao} sang quẻ #${transformed.number} (${transformedMeta.vietnameseName}):\n\n` +
        `💡 **Lời khuyên hành động tức thời:**\n` +
        `- **Điều nên làm:** Giữ vững bình tĩnh, xem xét lại các dữ liệu và thỏa thuận thực tế, ưu tiên giao tiếp chân thành và rõ ràng.\n` +
        `- **Điều cần tránh:** Tuyệt đối không đưa ra quyết định quan trọng trong lúc tâm lý còn dao động hoặc khi chưa có phương án dự phòng.\n\n` +
        `Thảo tin rằng khi bạn vững tâm theo đạo trung chính của quẻ, mọi nút thắt đều sẽ được mở ra êm đẹp.`
      );
    } else {
      return (
        `🌸 Lady Thao hears your question on ${category.topicEn}!\n\n` +
        `Grounding your dilemma in Hexagram #${que} shifting at Line ${hao} toward Hexagram #${transformed.number}:\n\n` +
        `💡 **Actionable Counsel:**\n` +
        `- **DO:** Take measured, clear steps with transparency and steady patience.\n` +
        `- **AVOID:** Avoid rash emotional reactions or rushing unvetted commitments.\n\n` +
        `Stay centered in truth, and the path ahead will become effortless.`
      );
    }
  }

  // Initial tailored reading
  if (language === 'vi') {
    let verdict = '';
    let dos: string[] = [];
    let donts: string[] = [];
    let futureForecast = '';

    switch (category.type) {
      case 'career':
        verdict = `🎯 **PHÁN ĐOÁN TRỰC DIỆN:** Về công việc và dự định của bạn — Thời vận lúc này là **ĐẮC THỜI CÓ THỬ THÁCH ĐẦU VÀO**. Bạn đang có tiềm năng phát triển lớn nhưng cần vượt qua giai đoạn củng cố nền tảng trước khi bứt phá.`;
        dos = [
          'Chủ động trau dồi chuyên môn, rà soát lại quy trình công việc và tìm kiếm sự hỗ trợ từ cấp trên hoặc người có kinh nghiệm ("lợi kiến đại nhân").',
          'Tập trung hoàn thành xuất sắc các mục tiêu ngắn hạn để tạo dựng niềm tin và uy tín vững chắc.',
        ];
        donts = [
          'Tránh đối đầu trực diện, tranh chấp quyền lợi hoặc nhảy việc khi chưa có bến đỗ an toàn.',
          'Không nên thể hiện cái tôi quá sớm khi vị thế chưa thực sự vững vàng.',
        ];
        futureForecast = `Khi năng lượng chuyển hóa hoàn tất sang Quẻ Biến #${transformed.number} (${transformedMeta.vietnameseName}), công việc sẽ hanh thông, những cơ hội thăng tiến hoặc hợp tác mới đầy hứa hẹn sẽ mở ra rõ rệt.`;
        break;

      case 'love':
        verdict = `🎯 **PHÁN ĐOÁN TRỰC DIỆN:** Về nhân duyên & tình cảm — Quẻ báo hiệu vận trình **CẦN SỰ CHÂN THÀNH & LẮNG NGHE**. Giai đoạn này đòi hỏi sự thấu cảm thay vì gượng ép hay nghi ngờ.`;
        dos = [
          'Chủ động chia sẻ suy nghĩ bằng lời nói ấm áp, tôn trọng cảm xúc và không gian riêng của đối phương.',
          'Dành thời gian vun đắp những kỷ niệm và hành động quan tâm giản dị nhưng chân thành.',
        ];
        donts = [
          'Tuyệt đối tránh việc nhắc lại lỗi lầm cũ hoặc phán xét vội vã.',
          'Không nên để sự nóng giận nhất thời làm tổn thương mối quan hệ.',
        ];
        futureForecast = `Khi bước sang Quẻ Biến #${transformed.number} (${transformedMeta.vietnameseName}), hai người sẽ tìm được tiếng nói chung sâu sắc, tình cảm được hàn gắn và ngày càng thắm thiết.`;
        break;

      case 'finance':
        verdict = `🎯 **PHÁN ĐOÁN TRỰC DIỆN:** Về tiền bạc & đầu tư — Thời vận hiện tại là **THẬN TRỌNG TÍCH LŨY, TRÁNH MẠO HIỂM**. Không nên vội vàng chạy theo các cơ hội siêu lợi nhuận chưa rõ ràng.`;
        dos = [
          'Kiểm soát chặt chẽ chi tiêu, ưu tiên bảo toàn vốn và đầu tư vào các kênh minh bạch, dài hạn.',
          'Tham khảo ý kiến của các chuyên gia hoặc đối tác đáng tin cậy trước khi xuống tiền.',
        ];
        donts = [
          'Tránh vay mượn quá đà hoặc dốc toàn bộ vốn vào một canh bạc mạo hiểm.',
          'Không nghe theo lời rủ rê đầu tư siêu tốc không có căn cứ thực tế.',
        ];
        futureForecast = `Khi năng lượng ổn định dưới Quẻ Biến #${transformed.number} (${transformedMeta.vietnameseName}), dòng tiền sẽ dần sinh sôi vững chắc, tài lộc tích lũy đều đặn.`;
        break;

      case 'decision':
        verdict = `🎯 **PHÁN ĐOÁN TRỰC DIỆN:** Về quyết định ngã rẽ bạn đang trăn trở — Quẻ chỉ rõ **NÊN CÂN NHẮC DÀI HẠN, BÌNH TĨNH HÀNH ĐỘNG**. Hãy lấy sự ổn định và giá trị cốt lõi làm kim chỉ nam.`;
        dos = [
          'Liệt kê rõ ưu - nhược điểm của từng phương án và lắng nghe trực giác mách bảo sau khi đã có dữ liệu thực tế.',
          'Chuẩn bị kỹ kế hoạch dự phòng (Plan B) trước khi thực hiện bước chuyển đổi.',
        ];
        donts = [
          'Tránh quyết định trong trạng thái bốc đồng, lo âu hoặc chịu sức ép từ dư luận xung quanh.',
          'Không đốt cháy giai đoạn hay vội vã phá vỡ những điều đang ổn định.',
        ];
        futureForecast = `Dưới sự dẫn lối của Quẻ Biến #${transformed.number} (${transformedMeta.vietnameseName}), con đường mới sẽ quang đãng, mang lại sự tự tin và thành tựu vững bền cho bạn.`;
        break;

      default:
        verdict = `🎯 **PHÁN ĐOÁN TRỰC DIỆN:** Về băn khoăn của bạn — Thời vận lúc này là **CÁT LỢI KHI GIỮ TÂM TRUNG CHÍNH**. Hãy thuận theo tự nhiên và kiên định với mục tiêu đúng đắn.`;
        dos = [
          'Tập trung bồi dưỡng nội lực, giữ thái độ hòa nhã, khiêm nhu trong mọi việc.',
          'Hành động quyết đoán khi thời cơ chín muồi.',
        ];
        donts = [
          'Tránh nản lòng trước những khó khăn bước đầu.',
          'Không để sự hoài nghi làm lung lay ý chí.',
        ];
        futureForecast = `Năng lượng chuyển sang Quẻ Biến #${transformed.number} (${transformedMeta.vietnameseName}) sẽ đưa mọi sự vào quỹ đạo hanh thông, mang lại bình an và may mắn.`;
    }

    return (
      `🌸 Thảo chào bạn! Về điều bạn đang trăn trở: "${question || 'Xin luận giải vận trình'}", Thảo đã thấu suốt huyền cơ của quẻ xăm:\n\n` +
      `${verdict}\n\n` +
      `📜 **1. HIỆN TRẠNG & BỐI CẢNH (Quẻ Chủ #${que} - ${primaryMeta.vietnameseName}):**\n` +
      `Quẻ mang năng lượng **${primaryMeta.element}** (${primaryMeta.upperTrigram} / ${primaryMeta.lowerTrigram}). Lời Thoán dạy: "${primaryJudgment || 'Giữ lòng trung chính, thuận thời thì vạn sự thành.'}". Hoàn cảnh hiện tại đòi hỏi bạn nhìn nhận rõ thực tế và định vị chính xác vị thế của mình.\n\n` +
      `⚡ **2. ĐIỂM THEN CHỐT & CHIẾN LƯỢC HÀNH ĐỘNG (Hào Động ${hao}):**\n` +
      `Lời Hào then chốt: "${changingLineText || 'Cần xét rõ biến chuyển để điều chỉnh hành vi.'}". Đây là mắt xích quyết định sự thành bại:\n` +
      `- **✔️ Việc NÊN LÀM:**\n` +
      `  • ${dos[0]}\n` +
      `  • ${dos[1]}\n` +
      `- **❌ Điều CẦN TRÁNH:**\n` +
      `  • ${donts[0]}\n` +
      `  • ${donts[1]}\n\n` +
      `✨ **3. KẾT QUẢ TƯƠNG LAI & THỜI CƠ (Quẻ Biến #${transformed.number} - ${transformedMeta.vietnameseName}):**\n` +
      `${futureForecast}\n\n` +
      `🧭 **4. LỜI DẶN DÒ TÂM HUYẾT TỪ CÔ THẢO:**\n` +
      `Người xưa có câu: *"Tận nhân lực, tri thiên mệnh"*. Quẻ Kinh Dịch mở ra đường đi sáng suốt, nhưng bản lĩnh và sự kiên trì của chính bạn mới là chìa khóa tạo nên thành quả. Thảo chúc bạn luôn an lòng, sáng suốt và gặt hái nhiều cát lành!`
    );
  } else {
    return (
      `🌸 Welcome, seeker! For your inquiry: "${question || 'General Life Guidance'}", Lady Thao has unraveled the sacred oracle:\n\n` +
      `🎯 **DIRECT VERDICT & ASSESSMENT:**\n` +
      `Favorable momentum with early tests. Success depends on maintaining composure and adhering to virtuous discipline.\n\n` +
      `📜 **1. Present State (Hexagram #${que} - ${primaryHex?.english || primaryMeta.vietnameseName}):**\n` +
      `Infused with ${primaryMeta.element} energy (${primaryMeta.upperTrigram} over ${primaryMeta.lowerTrigram}). Judgment: "${primaryJudgment}".\n\n` +
      `⚡ **2. Critical Action Strategy (Line ${hao}):**\n` +
      `The changing line instructs: "${changingLineText}".\n` +
      `- **✔️ What to DO:**\n` +
      `  • Build core competencies and seek counsel from trusted mentors.\n` +
      `  • Execute with patience, step by step.\n` +
      `- **❌ What to AVOID:**\n` +
      `  • Avoid impulsive confrontations or risky gambles.\n` +
      `  • Do not act out of anxious urgency.\n\n` +
      `✨ **3. Future Outcome (Transformed Hexagram #${transformed.number} - ${transformedHex?.english || transformedMeta.vietnameseName}):**\n` +
      `Harmonious resolution and steady fruitfulness unfold once alignment is restored.\n\n` +
      `🧭 **4. Lady Thao's Heartfelt Counsel:**\n` +
      `"When inner truth is firm, external winds cannot shake your peace." Walk forward with confidence!`
    );
  }
}
