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
  optionA?: string;
  optionB?: string;
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
  } else if (/quý\s*([1-4])/i.test(lower)) {
    const qm = lower.match(/quý\s*([1-4])/i);
    timeframe = `Quý ${qm?.[1]}`;
  } else if (/gần đây|sắp tới|thời gian tới/i.test(lower)) {
    timeframe = 'thời gian sắp tới';
  }

  // 2. Action / Topic
  let action = '';
  if (/kết hôn|cưới|lấy chồng|lấy vợ|kết duyên|đám cưới/i.test(lower)) action = 'kết hôn / lập gia đình';
  else if (/chia tay|ly hôn|dừng lại|buông tay/i.test(lower)) action = 'chia tay / kết thúc mối quan hệ';
  else if (/chuyển việc|nhảy việc|đổi việc|tìm việc mới/i.test(lower)) action = 'chuyển đổi công việc mới';
  else if (/nghỉ việc|thôi việc|từ chức/i.test(lower)) action = 'nghỉ việc';
  else if (/thăng chức|tăng lương|đề bạt/i.test(lower)) action = 'thăng tiến chức vị';
  else if (/mua nhà|mua đất|mua xe|tậu nhà/i.test(lower)) action = 'mua tài sản lớn';
  else if (/đầu tư|khởi nghiệp|kinh doanh|mở quán|mở tiệm|rót vốn/i.test(lower)) action = 'đầu tư kinh doanh';
  else if (/thi đỗ|đậu đại học|tốt nghiệp|du học|thi cử/i.test(lower)) action = 'thi cử / du học đỗ đạt';
  else if (/phẫu thuật|chữa bệnh|khám bệnh/i.test(lower)) action = 'điều trị sức khỏe';

  // 3. Option A vs Option B extraction ("Nên A hay B", "Nên nghỉ việc hay ở lại", "Đi hay Ở")
  let optionA: string | undefined;
  let optionB: string | undefined;
  const orMatch = q.match(/(?:nên\s+)?([^?,;]+?)\s+(?:hay|hay là|hoặc)\s+([^?,;]+)/i);
  if (orMatch && orMatch[1] && orMatch[2]) {
    optionA = orMatch[1].replace(/^(nên|tôi nên|chọn|liệu nên)\s+/i, '').trim();
    optionB = orMatch[2].replace(/^(hay|hay là|hoặc|chọn)\s+/i, '').trim();
  }

  // 4. Subject (extract proper capitalized name like "Mirai", "Nam", "Lan", etc. or pronouns)
  let subject = '';
  const words = q.split(/\s+/);
  const potentialNames = words.filter((w) => {
    const clean = w.replace(/[^a-zA-ZÀ-ỹ]/g, '');
    return (
      /^[A-Z][a-zÀ-ỹ]+$/.test(clean) &&
      !/^(Tôi|Mình|Bạn|Em|Anh|Chị|Có|Không|Năm|Tháng|Hỏi|Xin|Cho|Liệu|Quẻ|Cô|Thảo|Dự|Án|Công|Việc|Tình|Duyên|Nên|Hay|Làm|Sao)$/i.test(
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

  const isPolar =
    /có\s+.*\s+không|được\s+không|thành\s+không|liệu\s+có|nên\s+.*\s+không|có\s+nên/i.test(lower);

  return { subject, timeframe, action, isPolar, optionA, optionB };
}

// 64 Hexagrams Categorization by Nature
const AUSPICIOUS_HEXAGRAMS = new Set([
  1, 2, 11, 14, 15, 19, 26, 30, 31, 35, 42, 45, 46, 50, 53, 55, 57, 58, 61,
]);
const INAUSPICIOUS_HEXAGRAMS = new Set([6, 12, 23, 29, 36, 38, 39, 47, 54]);

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
  if (/nên|chọn|quyết định|thay đổi|bỏ|tiếp tục|đi|ở|rẽ|ngã rẽ|phương án|hay|hoặc/.test(q)) {
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

  // 1. Follow-up conversation reply in ongoing session
  if (history && history.length > 1) {
    const isAuspicious = AUSPICIOUS_HEXAGRAMS.has(queNum);
    const isInauspicious = INAUSPICIOUS_HEXAGRAMS.has(queNum);
    const goDecision = isAuspicious
      ? '🎯 **KẾT LUẬN: [GO - TIẾN HÀNH DỨT KHOÁT]**'
      : isInauspicious
      ? '🎯 **KẾT LUẬN: [NO-GO - TẠM DỪNG / THẬN TRỌNG BẢO TOÀN]**'
      : '🎯 **KẾT LUẬN: [GO CÓ ĐIỀU KIỆN - ĐI TỪNG BƯỚC CHẮC CHẮN]**';

    return (
      `${goDecision}\n\n` +
      `Về câu hỏi tiếp theo của bạn: *"${userQ}"*\n\n` +
      `1. **Căn cứ biến dịch:** Từ Quẻ Chủ #${queNum} (${primaryViet.name}) chuyển hóa qua Hào ${haoNum} động sang #${transformed.number} (${transformedViet.name}).\n` +
      `2. **Chỉ dẫn trọng yếu:** Lời Hào dạy: "${changingLineText.replace(/^Hào \d+[^:]*:\s*/, '')}". Nghĩa là không được hành động theo cảm tính nhất thời. Hãy bám sát thực tế, minh bạch mọi điều khoản và giữ vững lập trường cốt lõi.\n` +
      `3. **Quyết sách thực thi:** ${
        isAuspicious
          ? 'Nắm bắt ngay thời cơ trong giai đoạn này, chủ động liên hệ các bên liên quan để chốt thỏa thuận.'
          : isInauspicious
          ? 'Tạm thời án binh bất động, kiểm tra lại rủi ro pháp lý/tài chính trước khi ký kết hay quyết định lớn.'
          : 'Chuẩn bị đầy đủ phương án dự phòng (kế hoạch B) rồi mới triển khai từng phần nhỏ.'
      }\n\n` +
      `💡 **Lời Cô Thảo:** Lòng có định thì tuệ mới sáng, quyết định dứt khoát sẽ hóa giải mọi hoang mang.`
    );
  }

  // 2. Initial Comprehensive 5-Part GO/NO-GO Reading
  const entities = extractEntities(question || '');
  const isAuspicious = AUSPICIOUS_HEXAGRAMS.has(queNum);
  const isInauspicious = INAUSPICIOUS_HEXAGRAMS.has(queNum);

  // DECISION SUPPORT: Build explicit GO / NO-GO Verdict
  let decisionBadge = '';
  let decisionExplanation = '';
  let concreteAdviceDos: string[] = [];
  let concreteAdviceDonts: string[] = [];
  let timingAndOutcome = '';
  let rootCauseAnalysis = '';

  const focusSubject = entities.subject ? `cho **${entities.subject}**` : '';
  const focusTime = entities.timeframe ? `trong mốc **${entities.timeframe}**` : '';
  const focusAction = entities.action ? `về việc *${entities.action}*` : '';

  // Case A: User asks an "A or B" choice question ("Nên nghỉ việc hay ở lại", "Đi hay Ở")
  if (entities.optionA && entities.optionB) {
    const isDynamicYang = haoNum === 1 || haoNum === 3 || haoNum === 5 || isAuspicious;
    const optimalOption = isDynamicYang ? entities.optionA : entities.optionB;
    const alternateOption = isDynamicYang ? entities.optionB : entities.optionA;

    decisionBadge = `🎯 **KẾT LUẬN TRỰC DIỆN: [PHƯƠNG ÁN TỐI ƯU: CHỌN "${optimalOption.toUpperCase()}"]**`;
    decisionExplanation =
      `Đặt lên bàn cân giữa hai phương án: *"${entities.optionA}"* và *"${entities.optionB}"* ${focusTime}:\n` +
      `- Dựa vào sự vận động của Quẻ Chủ #${queNum} (${primaryViet.name}) và Hào Động #${haoNum} biến sang #${transformed.number} (${transformedViet.name}), năng lượng Dịch Lý chỉ ra rằng phương án **"${optimalOption}"** hội tụ đủ thời vận và sinh khí hơn hẳn.\n` +
      `- Ngược lại, phương án *"${alternateOption}"* tiềm ẩn nhiều nút thắt trì trệ hoặc hao tổn tâm lực không đáng có. Bạn nên dồn toàn lực triển khai phương án tối ưu đã chọn.`;
  } else if (isAuspicious) {
    // Case B: Auspicious Hexagram -> Clear GO
    decisionBadge = `🎯 **KẾT LUẬN TRỰC DIỆN: [GO - RẤT NÊN TIẾN HÀNH / CƠ HỘI THÀNH CÔNG RẤT CAO]**`;
    decisionExplanation =
      `Về câu hỏi ${focusAction} ${focusSubject} ${focusTime}:\n` +
      `- **ĐÁNH GIÁ: CÁT KHÍ HANH THÔNG (GO).** Lời quẻ khẳng định đây là thời điểm thiên thời địa lợi và nhân hòa cùng hội tụ.\n` +
      `- Mọi điều kiện khách quan đang xoay chuyển ủng hộ bạn. Bạn hoàn toàn nên chủ động nắm bắt cơ hội, không nên chần chừ hay e ngại mà bỏ lỡ thời cơ vàng.`;
  } else if (isInauspicious) {
    // Case C: Inauspicious Hexagram -> Clear NO-GO
    decisionBadge = `🎯 **KẾT LUẬN TRỰC DIỆN: [NO-GO - TẠM DỪNG / RỦI RO LỚN - NÊN TRÁNH]**`;
    decisionExplanation =
      `Về câu hỏi ${focusAction} ${focusSubject} ${focusTime}:\n` +
      `- **ĐÁNH GIÁ: BẤT LỢI / NGUY HIỂM (NO-GO).** Quẻ mang điềm báo trước mắt có nhiều chướng ngại ngầm, cạm bẫy hoặc sự bất đồng chưa lộ diện.\n` +
      `- Nếu cố tình đốt cháy giai đoạn hoặc mạo hiểm dấn thân ngay lúc này, nguy cơ thất bại, đổ vỡ hoặc tổn thất tài chính/tinh thần là rất lớn. Phương án khôn ngoan nhất là **TẠM DỪNG / GIỮ VỮNG VỊ TRÍ HIỆN TẠI** để củng cố phòng thủ.`;
  } else {
    // Case D: Transformational / Conditional Hexagram -> CONDITIONAL GO
    decisionBadge = `🎯 **KẾT LUẬN TRỰC DIỆN: [GO CÓ ĐIỀU KIỆN - CHƯA VỘI BỨT PHÁ, CHỈ TIẾN HÀNH KHI ĐÃ CỦNG CỐ PHÒNG BỊ]**`;
    decisionExplanation =
      `Về câu hỏi ${focusAction} ${focusSubject} ${focusTime}:\n` +
      `- **ĐÁNH GIÁ: CƠ HỘI ĐI KÈM THỬ THÁCH (CONDITIONAL GO).** Việc này hoàn toàn có thể thành tựu, nhưng tuyệt đối không thể thành công bằng sự vội vàng hấp tấp.\n` +
      `- Bạn chỉ nên "GO" khi đã rà soát kỹ lưỡng các điều kiện thực tế, chuẩn bị kế hoạch dự phòng chu đáo và có sự đồng thuận từ những người quan trọng.`;
  }

  // Domain-specific tailored analysis
  switch (category.type) {
    case 'career':
      rootCauseAnalysis =
        `Nút thắt cốt lõi nằm ở thế tương quan giữa năng lực nội tại và môi trường bên ngoài: quẻ #${queNum} (${primaryViet.name}) chỉ ra rằng ` +
        (isAuspicious
          ? `bạn đã tích lũy đủ độ chín muồi, rào cản hiện tại chỉ là phép thử sự tự tin và khả năng quyết đoán.`
          : isInauspicious
          ? `môi trường công việc đang có luồng sóng ngầm hoặc quyền lực bất lợi, việc nóng vội thể hiện bản thân sẽ dễ biến bạn thành đích ngắm của thị phi.`
          : `bạn đang đứng giữa ngã rẽ chuyển giao, đòi hỏi phải tái cấu trúc lại kế hoạch và kỹ năng trước khi nhận trọng trách mới.`);
      concreteAdviceDos = [
        'Rà soát kỹ các văn bản thỏa thuận, điều khoản hợp đồng và số liệu thực tế trước khi đặt bút ký kết.',
        'Chủ động xây dựng liên minh với cấp trên hoặc đối tác có uy tín, giữ thái độ khiêm nhường nhưng dứt khoát.',
      ];
      concreteAdviceDonts = [
        'Tuyệt đối tránh tranh cãi trực diện nơi công sở hoặc bộc lộ tham vọng quá sớm.',
        'Không nhảy việc hoặc đổi định hướng chỉ vì cảm xúc bất mãn nhất thời.',
      ];
      timingAndOutcome =
        `Quẻ Biến #${transformed.number} (${transformedViet.name}) cho thấy: ${
          entities.timeframe ? `Vào khoảng ${entities.timeframe}` : 'Khi bạn thực thi triệt để 2 hành động trên'
        }, cục diện sẽ xoay chuyển theo chiều hướng tích cực, công danh thông suốt và khẳng định được vị thế vững chắc.`;
      break;

    case 'love':
      rootCauseAnalysis =
        `Về mặt tình duyên, quẻ #${queNum} (${primaryViet.name}) phản ánh bản chất của sự kết nối: ` +
        (isAuspicious
          ? `hai tâm hồn đang có sự đồng điệu sâu sắc; nút thắt duy nhất chỉ là sự e dè hoặc chưa có bước tiến chính thức rõ ràng.`
          : isInauspicious
          ? `giữa hai bên đang tồn tại sự xung đột về quan điểm sống hoặc kỳ vọng bất cân xứng, nếu không tháo gỡ thì càng gắn kết càng tổn thương.`
          : `mối quan hệ đang ở giai đoạn cần sự thấu cảm và thử thách độ kiên nhẫn; sự chân thành sẽ là chìa khóa then chốt.`);
      concreteAdviceDos = [
        'Mở lòng đối thoại thẳng thắn với thái độ lắng nghe chân thành, làm rõ những điều còn hoài nghi.',
        'Dành sự quan tâm bằng những hành động thực tế, chăm sóc cuộc sống hàng ngày thay vì chỉ nói lời hoa mỹ.',
      ];
      concreteAdviceDonts = [
        'Tuyệt đối tránh chiến tranh lạnh, suy diễn vô căn cứ hoặc bới móc sai lầm trong quá khứ.',
        'Không để sự tác động từ người ngoài (gia đình, bạn bè) làm lung lay tình cảm chân thật của hai bạn.',
      ];
      timingAndOutcome =
        `Quẻ Biến #${transformed.number} (${transformedViet.name}) dự báo: ${
          entities.timeframe ? `Mốc ${entities.timeframe}` : 'Sau khi nút thắt đối thoại được giải tỏa'
        }, tình cảm sẽ bước sang trang mới tươi sáng, hai bên tìm được tiếng nói chung và đi đến cam kết gắn bó bền chặt.`;
      break;

    case 'finance':
      rootCauseAnalysis =
        `Về tài chính, quẻ #${queNum} (${primaryViet.name}) cho thấy quy luật vận hành của dòng tiền: ` +
        (isAuspicious
          ? `dòng tiền đang có xu hướng quy tụ về bạn; cơ hội đầu tư sinh lời đang mở ra nếu bạn biết nắm bắt đúng nhịp.`
          : isInauspicious
          ? `vận tài đang ở thế hao hụt hoặc cạm bẫy tài chính; nếu tham lam lợi nhuận ngắn hạn sẽ dễ rơi vào thế bị động khó gỡ.`
          : `nguồn thu nhập cơ bản duy trì ổn định nhưng chưa thích hợp để bung vốn quy mô lớn.`);
      concreteAdviceDos = [
        'Tập trung bảo toàn vốn gốc, chỉ giải ngân vào những lĩnh vực hoặc tài sản mà bạn nắm rõ bản chất.',
        'Lập bảng cân đối thu chi minh bạch và trích lập ngay quỹ dự phòng rủi ro khẩn cấp.',
      ];
      concreteAdviceDonts = [
        'Tuyệt đối không tham gia các kênh đầu tư mập mờ, đòn bẩy quá cao hoặc cam kết lãi suất ảo phi lý.',
        'Tránh vay mượn hộ người khác hoặc cho vay mà thiếu cam kết pháp lý rõ ràng.',
      ];
      timingAndOutcome =
        `Quẻ Biến #${transformed.number} (${transformedViet.name}) chỉ rõ: Giữ chặt kỷ luật tài chính thì ${
          entities.timeframe ? `đến ${entities.timeframe}` : 'vận tài sẽ từng bước hồi phục'
        }, túi tiền đong đầy và tâm trí an nhàn.`;
      break;

    case 'exam':
      rootCauseAnalysis =
        `Về đường học vấn - thi cử, quẻ #${queNum} (${primaryViet.name}) nhắc nhở: Sự đỗ đạt không đến từ may rủi mà là kết quả của sự rèn giũa có phương pháp. Nút thắt lớn nhất lúc này là tâm lý phòng thi và sự phân bổ thời gian.`;
      concreteAdviceDos = [
        'Lập thời gian biểu ôn tập khoa học, tập trung giải quyết dứt điểm các lỗ hổng kiến thức trọng tâm.',
        'Giữ nhịp sinh hoạt điều độ, ngủ đủ giấc để trí não luôn minh mẫn và sáng suốt.',
      ];
      concreteAdviceDonts = [
        'Tránh học nhồi nhét thâu đêm sát giờ thi khiến thần trí kiệt quệ.',
        'Không để áp lực kỳ vọng từ người khác làm lung lay niềm tin vào sự chuẩn bị của chính mình.',
      ];
      timingAndOutcome =
        `Quẻ Biến #${transformed.number} (${transformedViet.name}): Điểm số và kết quả thi cử sẽ tương xứng với nỗ lực kỷ luật của bạn, bảng vàng ghi danh thuận lợi.`;
      break;

    default:
      rootCauseAnalysis =
        `Xét toàn cục vận trình, quẻ #${queNum} (${primaryViet.name}) cho thấy bạn đang ở thế: ${primaryViet.meaning}. ` +
        `Thoán Từ: *"${primaryThoan}"*. Bản chất nút thắt không phải do bên ngoài cản trở mà chính là ở sự định tâm bên trong của bạn.`;
      concreteAdviceDos = [
        `Hành động thực tế, kiên trì theo tinh thần của quẻ ${primaryViet.name}: cẩn trọng nhưng dứt khoát.`,
        'Xác định rõ mục tiêu ưu tiên số một và tập trung nguồn lực thực hiện cho xong trước.',
      ];
      concreteAdviceDonts = [
        'Tránh nóng vội hành động khi chưa có kế hoạch cụ thể.',
        'Không để những lời bàn tán phiến diện xung quanh làm phân tâm.',
      ];
      timingAndOutcome =
        `Quẻ Biến #${transformed.number} (${transformedViet.name}): Vấn đề bạn trăn trở sẽ có câu trả lời ngã ngũ rõ ràng ${
          entities.timeframe ? `trong ${entities.timeframe}` : 'trong thời gian tới'
        }, mang lại sự an tâm và vững bước.`;
      break;
  }

  // ASSEMBLE 100% VIETNAMESE 5-PART MASTERPIECE
  return (
    `${decisionBadge}\n\n` +
    `${decisionExplanation}\n\n` +
    `🔍 **BẢN CHẤT NÚT THẮT (Quẻ Chủ #${queNum} - ${primaryViet.name}):**\n` +
    `Quẻ mang tượng **${primaryViet.symbol}** (${primaryViet.element}). Thoán Từ cổ văn: *"${primaryThoan}"*.\n` +
    `${rootCauseAnalysis}\n\n` +
    `⚡ **KẾ SÁCH HÀNH ĐỘNG GỠ RỐI (Hào Động #${haoNum}):**\n` +
    `Lời Hào biến dịch: *"${changingLineText}"*.\n` +
    `- ✔️ **Hành động then chốt 1:** ${concreteAdviceDos[0]}\n` +
    `- ✔️ **Hành động then chốt 2:** ${concreteAdviceDos[1]}\n` +
    `- ❌ **Tử huyệt tối kỵ cần tránh:** ${concreteAdviceDonts[0]} ${concreteAdviceDonts[1]}\n\n` +
    `🔮 **DỰ BÁO KẾT CỤC & MỐC THỜI GIAN (Quẻ Biến #${transformed.number} - ${transformedViet.name}):**\n` +
    `Chuyển hóa sang Thoán Từ: *"${transformedThoan}"*.\n` +
    `${timingAndOutcome}\n\n` +
    `💡 **CÔ THẢO CHỐT HẠ:**\n` +
    `"Đường đi dưới chân do tâm định, thời vận trong tay bởi đức dày. Hãy tin tưởng vào sự lựa chọn sáng suốt của bạn và hành động dứt khoát!"`
  );
}
