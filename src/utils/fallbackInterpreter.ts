import { VIETNAMESE_HEXAGRAMS } from '../data/vietnameseHexagrams';
import { HEXAGRAM_DATA, getTransformedHexagram } from './hexagramPatterns';

interface QuestionCategory {
  type: 'career' | 'love' | 'decision' | 'finance' | 'exam' | 'health' | 'general';
  topicVi: string;
}

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
      `🌸 **Cô Thảo lắng nghe chia sẻ tiếp theo của bạn về:** *${userQ}*\n\n` +
      `Nhìn lại gốc quẻ #${queNum} (${primaryViet.name}) đang chuyển động tại Hào ${haoNum} biến sang #${transformed.number} (${transformedViet.name}):\n\n` +
      `💡 **Lời khuyên tức thời cho bạn:**\n` +
      `- **Trọng tâm:** ${primaryViet.meaning}\n` +
      `- **Hành động:** Thuận theo đạo lý của Hào ${haoNum} ("${changingLineText.replace(/^Hào \d+[^:]*:\s*/, '')}").\n` +
      `- **Lưu ý:** Lấy sự chân thành, minh bạch và kiên nhẫn làm gốc rễ. Khi tâm bạn vững vàng, mọi khúc mắc sẽ tự tìm được lối mở hanh thông.`
    );
  }

  // Initial rich tailored reading in 100% Vietnamese
  let verdictAssessment = '';
  let concreteAdviceDos: string[] = [];
  let concreteAdviceDonts: string[] = [];
  let timingAndOutcome = '';

  switch (category.type) {
    case 'career':
      verdictAssessment = `🎯 **PHÁN ĐOÁN TRỰC DIỆN & VẬN THẾ:**\nĐối với công việc và định hướng của bạn — Thời vận báo hiệu: **${
        queNum === 1 || queNum === 11 || queNum === 14 || queNum === 35 || queNum === 42 || queNum === 50
          ? 'ĐẠI CÁT HANH THÔNG'
          : queNum === 6 || queNum === 12 || queNum === 23 || queNum === 29 || queNum === 47
          ? 'CẦN CẨN TRỌNG & TÍCH LŨY NỘI LỰC'
          : 'THỜI CƠ ĐANG CHUYỂN BIẾN THUẬN LỢI NẾU HÀNH XỬ ĐÚNG ĐẠO'
      }**. Dự định bạn ấp ủ hoàn toàn có cơ hội thành tựu, nhưng chìa khóa quyết định nằm ở sự bền bỉ và cách bạn xử lý tại mắt xích Hào ${haoNum}.`;
      concreteAdviceDos = [
        `Rà soát kỹ lưỡng các điều khoản, kế hoạch cụ thể và trau dồi chuyên môn cốt lõi theo tinh thần quẻ ${primaryViet.name}.`,
        'Chủ động tìm kiếm sự cố vấn từ người có uy tín, bề trên hoặc đối tác tin cậy ("lợi kiến đại nhân").',
        'Tập trung hoàn thiện từng hạng mục nhỏ một cách chỉn chu trước khi mở rộng quy mô.',
      ];
      concreteAdviceDonts = [
        'Tránh nóng vội đòi hỏi kết quả tức thì hoặc vội vàng đối đầu trực diện khi chưa nắm chắc phần thắng.',
        'Tuyệt đối không để cảm xúc nhất thời làm ảnh hưởng đến các thỏa thuận công việc dài hạn.',
      ];
      timingAndOutcome = `Dưới tác động chuyển hóa sang Quẻ Biến #${transformed.number} (${transformedViet.name}), khi bạn thực hiện đúng chiến lược trên, công việc sẽ bước vào quỹ đạo hanh thông, gặt hái sự ghi nhận xứng đáng và mở ra cơ hội hợp tác mới.`;
      break;

    case 'love':
      verdictAssessment = `🎯 **PHÁN ĐOÁN TRỰC DIỆN & VẬN THẾ:**\nVề chuyện tình duyên & mối quan hệ của bạn — Quẻ báo hiệu: **${
        queNum === 31 || queNum === 11 || queNum === 37 || queNum === 8 || queNum === 61
          ? 'TƯƠNG HỢP CÁT LÀNH & ĐỒNG ĐIỆU'
          : queNum === 38 || queNum === 54 || queNum === 6 || queNum === 12
          ? 'CẦN HÓA GIẢI BẤT ĐỒNG & LẮNG NGHE CHÂN THÀNH'
          : 'THUẬN THEO TỰ NHIÊN, CẦN SỰ CHÂN THÀNH VUN ĐẮP'
      }**. Mối quan hệ đang ở thời điểm cần sự thấu cảm, hạ bớt cái tôi và đối thoại chân tình.`;
      concreteAdviceDos = [
        'Mở lòng chia sẻ cảm xúc một cách nhẹ nhàng, chân thật, tạo không gian để đối phương giãi bày.',
        'Vun vén những hành động quan tâm giản dị mỗi ngày thay vì chỉ tập trung vào những lời hứa hẹn xa vời.',
        'Lấy lòng bao dung và sự tôn trọng làm nền tảng kết nối bền chặt.',
      ];
      concreteAdviceDonts = [
        'Tránh suy diễn, nghi ngờ hoặc nhắc lại những khúc mắc trong quá khứ.',
        'Không nên gượng ép hay áp đặt quan điểm của mình lên đối phương.',
      ];
      timingAndOutcome = `Khi năng lượng chuyển sang Quẻ Biến #${transformed.number} (${transformedViet.name}), những hiểu lầm sẽ được hóa giải êm đẹp, tình cảm trở nên sâu sắc, thắm thiết và bền vững hơn.`;
      break;

    case 'finance':
      verdictAssessment = `🎯 **PHÁN ĐOÁN TRỰC DIỆN & VẬN THẾ:**\nVề tiền bạc, tài lộc & các kế hoạch chi tiêu/đầu tư — Quẻ phán: **${
        queNum === 14 || queNum === 26 || queNum === 42 || queNum === 11
          ? 'TÀI LỘC TÍCH TỤ, SINH SÔI VỮNG CHẮC'
          : queNum === 41 || queNum === 47 || queNum === 29 || queNum === 60
          ? 'ƯU TIÊN BẢO TOÀN VỐN & TIẾT CHẾ CHI TIÊU'
          : 'TIẾN BƯỚC TỪNG BƯỚC, RÕ RÀNG MINH BẠCH'
      }**. Cơ hội tài chính có dấu hiệu khởi sắc nhưng đòi hỏi bạn phải có sự tính toán thực tế và kiểm soát rủi ro nghiêm ngặt.`;
      concreteAdviceDos = [
        'Quản lý chặt chẽ dòng tiền, ưu tiên đầu tư vào các lĩnh vực mình am hiểu tường tận và có cơ sở pháp lý minh bạch.',
        'Duy trì quỹ dự phòng an toàn trước khi tính đến các khoản đầu tư sinh lời lớn.',
        'Lắng nghe ý kiến phân tích khách quan từ các chuyên gia hoặc đối tác có kinh nghiệm.',
      ];
      concreteAdviceDonts = [
        'Tránh tâm lý chạy theo đám đông hoặc tin vào những lời rủ rê siêu lợi nhuận thiếu căn cứ.',
        'Không vay mượn quá mức hay đầu tư vượt quá khả năng chịu đựng tài chính của bản thân.',
      ];
      timingAndOutcome = `Khi cục diện bước vào Quẻ Biến #${transformed.number} (${transformedViet.name}), nguồn tài lộc sẽ tích lũy đều đặn, mang lại sự ổn định và an tâm tài chính lâu dài cho bạn.`;
      break;

    case 'exam':
      verdictAssessment = `🎯 **PHÁN ĐOÁN TRỰC DIỆN & VẬN THẾ:**\nVề việc học tập, thi cử và trau dồi chuyên môn — Quẻ phán: **${
        queNum === 30 || queNum === 4 || queNum === 26 || queNum === 46 || queNum === 50
          ? 'TRÍ TUỆ MINH MẪN, BẢNG VÀNG ĐỀ DANH'
          : 'CẦN TẬP TRUNG TẬN TÂM & BÌNH TĨNH TỰ TIN'
      }**. Nỗ lực bồi dưỡng thực chất của bạn sẽ mang lại quả ngọt xứng đáng.`;
      concreteAdviceDos = [
        'Lập thời gian biểu ôn luyện khoa học, chú trọng nắm vững kiến thức căn bản trước khi đào sâu bài khó.',
        'Giữ tinh thần thoải mái, ăn uống nghỉ ngơi điều độ để có sự tập trung cao độ.',
      ];
      concreteAdviceDonts = [
        'Tránh tâm lý chủ quan coi thường các chi tiết nhỏ hay học dồn dập vào phút chót.',
        'Không để sự âu lo làm xao nhãng tâm trí trong phòng thi.',
      ];
      timingAndOutcome = `Quẻ Biến #${transformed.number} (${transformedViet.name}) báo hiệu kết quả thi cử sẽ tương xứng với công sức bạn đã dày công bỏ ra, mang lại niềm vui lớn cho bạn và gia đình.`;
      break;

    default:
      verdictAssessment = `🎯 **PHÁN ĐOÁN TRỰC DIỆN & VẬN THẾ:**\nVề điều bạn đang trăn trở: "${userQ}" — Quẻ Kinh Dịch phán: **${
        queNum === 1 || queNum === 11 || queNum === 14 || queNum === 15 || queNum === 42
          ? 'CÁT LỢI THÔNG SUỐT'
          : queNum === 12 || queNum === 23 || queNum === 29 || queNum === 39
          ? 'VẠN SỰ KHỞI ĐẦU NAN, CẦN KIÊN TRÌ GIỮ ĐẠO TRUNG CHÍNH'
          : 'THỜI CƠ THUẬN LỢI ĐANG MỞ RA NẾU GIỮ TÂM SÁNG SUỐT'
      }**. Bản chất tình huống đòi hỏi bạn định vị rõ nội lực bản thân và thuận theo nhịp điệu của tự nhiên.`;
      concreteAdviceDos = [
        `Thực hành theo lời khuyên của quẻ ${primaryViet.name}: "${primaryViet.meaning}".`,
        'Giữ thái độ khiêm nhường, lắng nghe và luôn chuẩn bị phương án dự phòng chu đáo.',
        'Hành động quyết đoán khi thời điểm và điều kiện thực tế đã hội đủ.',
      ];
      concreteAdviceDonts = [
        'Tránh để sự hoài nghi hay những lời bàn tán xung quanh làm lung lay lập trường đúng đắn.',
        'Không nên hành động bốc đồng khi tâm trí còn xáo động.',
      ];
      timingAndOutcome = `Sự biến chuyển sang Quẻ Biến #${transformed.number} (${transformedViet.name}) sẽ đưa vận trình của bạn vào giai đoạn hanh thông mới, hóa giải âu lo và mang lại sự an lạc trọn vẹn.`;
      break;
  }

  return (
    `🌸 **Thảo chào bạn!** Về điều bạn đang tâm niệm: *"${userQ}"*, Thảo đã thấu suốt huyền cơ của thẻ xăm linh ứng:\n\n` +
    `${verdictAssessment}\n\n` +
    `📜 **1. HIỆN TRẠNG & BỐI CẢNH (Quẻ Chủ #${queNum} - ${primaryViet.name}):**\n` +
    `Quẻ mang tượng **${primaryViet.symbol}** (Ngũ hành: **${primaryViet.element}**). Lời Thoán dạy rằng: *"${primaryThoan}"*. Bối cảnh hiện nay cho thấy: ${primaryViet.meaning}\n\n` +
    `⚡ **2. ĐIỂM THEN CHỐT & CHIẾN LƯỢC HÀNH ĐỘNG (Hào Động ${haoNum}):**\n` +
    `Lời Hào then chốt truyền lại: *"${changingLineText}"*.\n` +
    `Đây là mắt xích mấu chốt quyết định sự chuyển hóa cục diện từ Quẻ Chủ sang Quẻ Biến:\n` +
    `- **✔️ Việc NÊN LÀM:**\n` +
    `  • ${concreteAdviceDos[0]}\n` +
    `  • ${concreteAdviceDos[1]}\n` +
    (concreteAdviceDos[2] ? `  • ${concreteAdviceDos[2]}\n` : '') +
    `- **❌ Điều CẦN TRÁNH:**\n` +
    `  • ${concreteAdviceDonts[0]}\n` +
    `  • ${concreteAdviceDonts[1]}\n\n` +
    `✨ **3. KẾT QUẢ TƯƠNG LAI & THỜI CƠ (Quẻ Biến #${transformed.number} - ${transformedViet.name}):**\n` +
    `Lời Thoán Quẻ Biến: *"${transformedThoan}"*.\n` +
    `${timingAndOutcome}\n\n` +
    `🧭 **4. LỜI DẶN DÒ TÂM HUYẾT TỪ CÔ THẢO:**\n` +
    `Cổ nhân có câu: *"Tận nhân lực, tri thiên mệnh"*. Quẻ Kinh Dịch khai mở trí tuệ định hướng, nhưng chính tâm thế vững vàng, lòng chính trực và sự nỗ lực kiên trì của bạn mới là ngọn đèn dẫn lối đến mọi thành tựu. Thảo chúc bạn luôn an vui, sáng suốt và vạn sự hanh thông!`
  );
}
