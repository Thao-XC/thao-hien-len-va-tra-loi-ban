import { GoogleGenAI } from '@google/genai';
import { HEXAGRAM_DATA, getTransformedHexagram } from '../src/utils/hexagramPatterns';
import { VIETNAMESE_HEXAGRAMS } from '../src/data/vietnameseHexagrams';
import { generateRichFallbackInterpretation } from '../src/utils/fallbackInterpreter';
import { streamOpenRouterCompletion } from '../src/utils/openrouter';

const SYSTEM_PROMPT =
  "Bạn là Cô Thảo (Sạp Bói Thảo) - bậc thầy giải quẻ Kinh Dịch thực chiến, chuyên giải mã huyền cơ và ĐƯA RA GIẢI PHÁP TRIỆT ĐỂ CHO MỌI BẾ TẮC CỦA NGƯỜI XIN QUẺ.\n\n" +
  "TÔN CHỈ BẮT BUỘC (TUÂN THỦ 100% - KHÔNG NGOẠI LỆ):\n" +
  "1. ĐI THẲNG VÀO TRỌNG TÂM CÂU HỎI NGAY TỪ CÂU ĐẦU TIÊN (ZERO FLUFF):\n" +
  "   - Cấm mở đầu bằng chào hỏi rườm rà, cấm nói đạo lý xa vời, cấm văn phong mơ hồ nước đôi.\n" +
  "   - Nếu câu hỏi CÓ LỰA CHỌN (Nên A hay B? Đi hay Ở? Tiếp tục hay Dừng lại?):\n" +
  "     -> BẮT BUỘC CHỌN RÕ 1 PHƯƠNG ÁN TỐI ƯU NHẤT theo quẻ và hào động. Tuyệt đối KHÔNG trả lời kiểu 'tùy bạn cân nhắc' hay 'cả hai đều có lý'.\n" +
  "   - Nếu câu hỏi CÓ / KHÔNG (Có được không? Có kết hôn không? Có tăng lương không?):\n" +
  "     -> BẮT BUỘC khẳng định rõ mức độ khả thi ngay câu đầu: [CÓ KHẢ NĂNG RẤT CAO / CHƯA PHẢI THỜI ĐIỂM / RỦI RO LỚN - NÊN TRÁNH].\n" +
  "   - Nếu câu hỏi có TÊN RIÊNG (ví dụ: 'Mirai', 'Nam'...), MỐC THỜI GIAN (ví dụ: 'năm 2028', 'tháng 5'...), hoặc SỰ VIỆC CỤ THỂ:\n" +
  "     -> BẮT BUỘC gọi đích danh người đó, mốc thời gian đó và sự việc đó ngay câu mở đầu!\n\n" +
  "2. TẬP TRUNG GIẢI QUYẾT VẤN ĐỀ THỰC TẾ (PROBLEM-SOLVING):\n" +
  "   - Người xin quẻ đang gặp trăn trở, bế tắc cụ thể trong công việc, tình cảm, tiền bạc hoặc các mối quan hệ.\n" +
  "   - Đừng chỉ giải thích tượng quẻ học thuật. Phải bóc tách:\n" +
  "     * Nút thắt thực sự ở đâu? Vì sao việc đang tắc nghẽn?\n" +
  "     * Kế sách tháo gỡ từng bước (làm gì ngay, xử sự thế nào)?\n" +
  "     * Đâu là tử huyệt / sai lầm chết người cần tránh?\n\n" +
  "3. CẤU TRÚC 5 PHẦN BẮT BUỘC, SẮC BÉN VÀ GÃY GỌN:\n" +
  "   🎯 **KẾT LUẬN TRỰC DIỆN & PHƯƠNG ÁN TỐI ƯU:**\n" +
  "   (1-2 câu trả lời thẳng tắp vào câu hỏi, gọi tên người và mốc thời gian nếu có, chốt phương án dứt khoát).\n\n" +
  "   🔍 **BẢN CHẤT NÚT THẮT:**\n" +
  "   (1-2 câu chỉ rõ nguyên nhân gốc rễ và thực trạng bế tắc dựa trên Quẻ Chủ và Thoán Từ).\n\n" +
  "   ⚡ **KẾ SÁCH HÀNH ĐỘNG GỠ RỐI (Hào Động):**\n" +
  "   - ✔️ **Bước 1 (Làm ngay):** 1 hành động thực tế, cụ thể triển khai ngay.\n" +
  "   - ✔️ **Bước 2 (Chiến lược):** 1 cách thức ứng xử, đàm phán hoặc cách bảo vệ vị thế an toàn.\n" +
  "   - ❌ **Tử huyệt tối kỵ:** 1 sai lầm hoặc cạm bẫy nguy hiểm nhất tuyệt đối không được phạm vào.\n\n" +
  "   🔮 **DỰ BÁO KẾT CỤC & MỐC THỜI GIAN (Quẻ Biến):**\n" +
  "   (1-2 câu dự báo kết quả khi làm theo kế sách và mốc thời gian/tháng nào việc sẽ ngã ngũ hoặc chuyển biến rõ rệt).\n\n" +
  "   💡 **CÔ THẢO CHỐT HẠ:**\n" +
  "   (1 câu kim chỉ nam đanh thép, định hướng hành động dứt khoát).";

function getGeminiKey(): string {
  return (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
}

function getOpenRouterKey(): string {
  return (
    process.env.OPENROUTER_API_KEY ||
    process.env.OPENROUTE_API_KEY ||
    process.env.OPEN_ROUTE_API_KEY ||
    ''
  ).trim();
}

// --- Decisiveness compliance check -----------------------------------------
// The system prompt demands the reply open with a clear verdict. LLMs don't
// always follow every rule in a long prompt, so we verify the actual output
// before it reaches the user, and retry once with a reinforced instruction
// if the required verdict language is missing.

const VERDICT_MARKERS = [
  'KẾT LUẬN TRỰC DIỆN',
  'CÓ KHẢ NĂNG RẤT CAO',
  'CHƯA PHẢI THỜI ĐIỂM',
  'KHẢ NĂNG THẤP',
  'RỦI RO LỚN',
  'NÊN TRÁNH',
  'RẤT NÊN TIẾN HÀNH',
  'CHƯA NÊN VỘI VÃ',
];

function isCompliant(text: string): boolean {
  if (!text) return false;
  const head = text.slice(0, 500).toUpperCase();
  return VERDICT_MARKERS.some((marker) => head.includes(marker));
}

async function generateOnce(ai: GoogleGenAI, modelName: string, contents: any[]): Promise<string> {
  const result: any = await ai.models.generateContent({
    model: modelName,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.4,
    },
    contents,
  });
  return result?.text || result?.response?.text?.() || '';
}

async function streamTextAsWords(res: any, text: string) {
  const words = text.split(' ');
  for (const word of words) {
    if (res.writableEnded) break;
    res.write(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`);
    await new Promise((r) => setTimeout(r, 12));
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { que, hao, question, history, language } = req.body || {};

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const streamFallback = async () => {
    const fallbackText = generateRichFallbackInterpretation(
      Number(que) || 1,
      Number(hao) || 1,
      question || '',
      language || 'vi',
      history
    );
    const words = fallbackText.split(' ');
    for (const word of words) {
      if (res.writableEnded) break;
      res.write(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`);
      await new Promise((r) => setTimeout(r, 16));
    }
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }
  };

  try {
    const geminiKey = getGeminiKey();
    const openRouterKey = getOpenRouterKey();
    const queNum = Number(que) || 1;
    const haoNum = Number(hao) || 1;

    const primaryViet = VIETNAMESE_HEXAGRAMS[queNum] || VIETNAMESE_HEXAGRAMS[1];
    const transformed = getTransformedHexagram(queNum, haoNum);
    const transformedViet = VIETNAMESE_HEXAGRAMS[transformed.number] || VIETNAMESE_HEXAGRAMS[1];

    if (!geminiKey && !openRouterKey) {
      await streamFallback();
      return;
    }

    const userQuestion = question?.trim() || 'Xin Cô Thảo luận giải vận trình và hướng đi phía trước cho tôi.';

    const primaryThoan = primaryViet.thoanTu;
    const changingLineText = primaryViet.haoTu[haoNum] || primaryViet.haoTu[1];
    const transformedThoan = transformedViet.thoanTu;

    const hexContext =
      `[TƯ LIỆU KINH DỊCH CỔ TRUYỀN THUẦN VIỆT]\n` +
      `• Quẻ Chủ: Quẻ số #${queNum} - ${primaryViet.name} (${primaryViet.chinese})\n` +
      `  - Tượng Quẻ: ${primaryViet.symbol} (Ngũ hành: ${primaryViet.element})\n` +
      `  - Thoán Từ: "${primaryThoan}"\n` +
      `  - Tượng Truyện: "${primaryViet.tuongTruyen}"\n` +
      `  - Ý nghĩa quẻ: ${primaryViet.meaning}\n` +
      `• Hào Động: Hào số ${haoNum} (${transformed.wasSolid ? 'Dương ⚊ hào động chuyển thành Âm ⚋' : 'Âm ⚋ hào động chuyển thành Dương ⚊'})\n` +
      `  - Lời Hào Từ: "${changingLineText}"\n` +
      `• Quẻ Biến: Quẻ số #${transformed.number} - ${transformedViet.name} (${transformedViet.chinese})\n` +
      `  - Tượng Quẻ Biến: ${transformedViet.symbol} (Ngũ hành: ${transformedViet.element})\n` +
      `  - Thoán Từ Quẻ Biến: "${transformedThoan}"\n` +
      `• Câu hỏi & Băn khoăn thực tế của người xin quẻ: "${userQuestion}"\n\n`;

    const promptInstruction =
      `${hexContext}` +
      `BẠN ĐANG GIẢI QUẺ CHO CÂU HỎI CỦA NGƯỜI XIN QUẺ: "${userQuestion}"\n` +
      `HÃY TRẢ LỜI TRỰC DIỆN, THẲNG THẮN, GIẢI QUYẾT TRIỆT ĐỂ VẤN ĐỀ THEO ĐÚNG 5 PHẦN DƯỚI ĐÂY (Tuyệt đối không chào hỏi rườm rà, không nói đạo lý xa vời):\n\n` +
      `🎯 **KẾT LUẬN TRỰC DIỆN & PHƯƠNG ÁN TỐI ƯU:**\n` +
      `- Nếu câu hỏi có LỰA CHỌN (A hay B? Đi hay Ở? Tiếp tục hay Dừng?): BẮT BUỘC CHỌN 1 HƯỚNG TỐI ƯU NHẤT. Cấm nói 'tùy bạn'.\n` +
      `- Nếu câu hỏi CÓ / KHÔNG (Có được không? Có kết hôn năm X không?): Câu đầu tiên trả lời thẳng: [CÓ KHẢ NĂNG RẤT CAO / CHƯA PHẢI THỜI ĐIỂM / KHẢ NĂNG THẤP].\n` +
      `- Nếu có TÊN NGƯỜI hoặc NĂM/THÁNG: Gọi đích danh người đó và mốc thời gian đó ngay câu mở đầu (Ví dụ: 'Về việc Mirai có kết hôn vào năm 2028: Dựa theo quẻ ${primaryViet.name}...').\n\n` +
      `🔍 **BẢN CHẤT NÚT THẮT (Quẻ #${queNum} - ${primaryViet.name}):**\n` +
      `Đúng 2 câu vạch trần căn nguyên thực trạng và lý do vì sao sự việc đang bế tắc hoặc cần thận trọng, dựa trên quẻ ${primaryViet.name} và lời Thoán: "${primaryThoan}".\n\n` +
      `⚡ **KẾ SÁCH HÀNH ĐỘNG GỠ RỐI (Hào Động ${haoNum}):**\n` +
      `Dựa trên lời Hào Từ: "${changingLineText}", hãy chỉ ra giải pháp thực chiến:\n` +
      `- ✔️ **Bước 1 (Làm ngay):** 1 việc cụ thể người hỏi cần thực hiện ngay trong 24-48 giờ tới để nắm thế chủ động.\n` +
      `- ✔️ **Bước 2 (Chiến lược):** 1 cách thức ứng xử, đàm phán hoặc cách bảo vệ quyền lợi an toàn nhất.\n` +
      `- ❌ **Tử huyệt cần tránh:** 1 cạm bẫy hoặc sai lầm tối kỵ nếu phạm phải sẽ làm hỏng việc.\n\n` +
      `🔮 **DỰ BÁO KẾT CỤC & MỐC THỜI GIAN (Quẻ Biến #${transformed.number} - ${transformedViet.name}):**\n` +
      `Dự báo 1-2 câu về kết quả khi thực hiện đúng kế sách và mốc thời gian/tháng cụ thể sự việc sẽ ngã ngũ hoặc chuyển biến hanh thông.\n\n` +
      `💡 **CÔ THẢO CHỐT HẠ:**\n` +
      `1 câu đúc kết đanh thép, định hướng hành động dứt khoát nhất để người hỏi tự tin quyết định.`;

    let streamedAny = false;

    // --- PIPELINE 1: Gemini API ---
    if (geminiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        let contentsArray: any[] = [];
        if (history && Array.isArray(history) && history.length > 1) {
          const formattedHistory = history.map((m: any) => ({
            role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.text }],
          }));
          contentsArray = [
            {
              role: 'user',
              parts: [
                {
                  text: `${hexContext}Đây là cuộc đối thoại đang tiếp diễn. Hãy trả lời câu hỏi mới nhất của họ TRỰC DIỆN, ĐÚNG TRỌNG TÂM, THỰC TẾ và DỨT KHOÁT, bám sát người và mốc thời gian được hỏi.`,
                },
              ],
            },
            {
              role: 'model',
              parts: [{ text: 'Thảo đã rõ câu hỏi. Trả lời thẳng vào việc bạn cần biết:' }],
            },
            ...formattedHistory,
          ];
        } else {
          contentsArray = [{ role: 'user', parts: [{ text: promptInstruction }] }];
        }

        const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
        const isInitialReading = !(history && Array.isArray(history) && history.length > 1);

        if (isInitialReading) {
          // Initial reading: this is where a decisive verdict matters most.
          // Generate once, check for the required verdict language, and
          // retry a single time with a reinforced instruction if it's missing
          // — before anything is shown to the user.
          for (const modelName of CANDIDATE_MODELS) {
            if (streamedAny) break;
            try {
              let finalText = await generateOnce(ai, modelName, contentsArray);

              if (finalText && !isCompliant(finalText)) {
                console.warn(`Gemini model ${modelName} gave a non-decisive answer, retrying once...`);
                const retryContents = [
                  ...contentsArray,
                  { role: 'model', parts: [{ text: finalText }] },
                  {
                    role: 'user',
                    parts: [
                      {
                        text:
                          'Câu trả lời trên THIẾU phần 🎯 KẾT LUẬN TRỰC DIỆN rõ ràng ở đầu. ' +
                          'Hãy viết lại TOÀN BỘ câu trả lời, bắt đầu ngay bằng "🎯 **KẾT LUẬN TRỰC DIỆN:**" ' +
                          'và một khẳng định dứt khoát (CÓ KHẢ NĂNG RẤT CAO / CHƯA PHẢI THỜI ĐIỂM / KHẢ NĂNG THẤP / RỦI RO LỚN - NÊN TRÁNH). ' +
                          'Tuyệt đối không được mơ hồ hay nói "tùy bạn".',
                      },
                    ],
                  },
                ];
                const retryText = await generateOnce(ai, modelName, retryContents);
                if (retryText) finalText = retryText;
              }

              if (finalText) {
                streamedAny = true;
                await streamTextAsWords(res, finalText);
                break;
              }
            } catch (modelErr: any) {
              console.warn(`Gemini model ${modelName} error in /api/interpret:`, modelErr?.message || modelErr);
            }
          }
        } else {
          // Follow-up turn in an ongoing conversation: stream normally.
          for (const modelName of CANDIDATE_MODELS) {
            if (streamedAny) break;
            try {
              const responseStream = await ai.models.generateContentStream({
                model: modelName,
                config: {
                  systemInstruction: SYSTEM_PROMPT,
                  temperature: 0.4,
                },
                contents: contentsArray,
              });

              for await (const chunk of responseStream) {
                if (chunk.text && !res.writableEnded) {
                  streamedAny = true;
                  res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
                }
              }
              if (streamedAny) break;
            } catch (modelErr: any) {
              console.warn(`Gemini model ${modelName} error in /api/interpret:`, modelErr?.message || modelErr);
            }
          }
        }
      } catch (geminiErr: any) {
        console.warn('Gemini stream error in /api/interpret:', geminiErr?.message || geminiErr);
      }
    }

    // --- PIPELINE 2: OpenRouter API ---
    if (!streamedAny && openRouterKey) {
      try {
        console.log('/api/interpret: Routing to OpenRouter API...');
        const openRouterMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
          { role: 'system', content: SYSTEM_PROMPT },
        ];

        if (history && Array.isArray(history) && history.length > 1) {
          openRouterMessages.push({
            role: 'user',
            content: `${hexContext}Đây là cuộc đối thoại đang tiếp diễn. Trả lời câu hỏi mới nhất TRỰC DIỆN, ĐÚNG TRỌNG TÂM, THỰC TẾ.`,
          });
          openRouterMessages.push({
            role: 'assistant',
            content: 'Thảo đã rõ câu hỏi. Trả lời thẳng vào việc bạn cần biết:',
          });
          for (const m of history) {
            openRouterMessages.push({
              role: m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user',
              content: m.text,
            });
          }
        } else {
          openRouterMessages.push({
            role: 'user',
            content: promptInstruction,
          });
        }

        const openRouterSuccess = await streamOpenRouterCompletion({
          apiKey: openRouterKey,
          model: process.env.OPENROUTER_MODEL,
          messages: openRouterMessages,
          temperature: 0.4,
          appUrl: process.env.APP_URL || 'https://ai.studio',
          onChunk: (textChunk) => {
            if (!res.writableEnded) {
              streamedAny = true;
              res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
            }
          },
        });

        if (openRouterSuccess) {
          streamedAny = true;
        }
      } catch (openRouterErr: any) {
        console.warn('/api/interpret: OpenRouter stream error:', openRouterErr?.message || openRouterErr);
      }
    }

    if (!streamedAny) {
      await streamFallback();
      return;
    }

    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }
  } catch (err: any) {
    console.error('/api/interpret handler error:', err);
    try {
      if (!res.writableEnded) {
        await streamFallback();
      }
    } catch {
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ error: 'Quẻ đang được chiêm nghiệm. Xin bạn thử lại.' })}\n\n`);
        res.end();
      }
    }
  }
}
