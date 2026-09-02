import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import hexagramsData from './src/hexagrams.json' with { type: 'json' };
import { HEXAGRAM_DATA, getTransformedHexagram } from './src/utils/hexagramPatterns.ts';
import { VIETNAMESE_HEXAGRAMS } from './src/data/vietnameseHexagrams.ts';
import { generateRichFallbackInterpretation } from './src/utils/fallbackInterpreter.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

const SYSTEM_PROMPT =
  "Bạn là Cô Thảo (Sạp Bói Thảo) - chuyên gia giải quẻ Kinh Dịch sắc bén, thực tế và trả lời TRỰC DIỆN VÀO TRỌNG TÂM câu hỏi của người dùng.\n\n" +
  "NGUYÊN TẮC BẮT BUỘC:\n" +
  "1. ĐI THẲNG VÀO CÂU TRẢ LỜI: Tuyệt đối KHÔNG chào hỏi vòng vo, KHÔNG giải thích dài dòng lan man, KHÔNG nói triết lý sáo rỗng. Người dùng cần câu trả lời dứt khoát, chính xác và có thể hành động ngay.\n" +
  "2. 100% TIẾNG VIỆT THUẦN TÚY: Rõ ràng, gãy gọn, sắc sảo.\n" +
  "3. ÁP DỤNG TRỰC TIẾP QUẺ & HÀO ĐỘNG VÀO ĐÚNG CÂU HỎI:\n" +
  "   - Nếu hỏi 'Có nên làm X không?': Trả lời rõ Nên / Không nên / Thời điểm nào.\n" +
  "   - Nếu hỏi 'Tình cảm / công việc ra sao?': Đưa ra kết luận cụ thể (tốt/xấu, thuận lợi hay trắc trở ở đâu).\n" +
  "4. CẤU TRÚC BẢN GIẢI QUẺ NGẮN GỌN, ĐẦY ĐỦ TRỌNG TÂM:\n" +
  "   - 🎯 **KẾT LUẬN TRỰC DIỆN:** (1-2 câu trả lời thẳng vào câu hỏi: Nên/Không nên, Cát/Hung, Được/Mất, Thành/Bại và thời cơ).\n" +
  "   - 📜 **QUẺ CHỦ & BỐI CẢNH THỰC TẾ:** (2 câu ngắn gọn giải mã cục diện hiện tại dựa trên Quẻ Chủ và Thoán Từ).\n" +
  "   - ⚡ **HÀNH ĐỘNG CỤ THỂ (Hào Động):**\n" +
  "     * ✔️ **Nên làm:** 2 việc cụ thể, thực tế, làm được ngay.\n" +
  "     * ❌ **Cần tránh:** 2 việc tối kỵ, nguy cơ cụ thể.\n" +
  "   - 🔮 **DỰ ĐOÁN KẾT QUẢ & THỜI ĐIỂM (Quẻ Biến):** (1-2 câu dự báo kết cục và mốc thời gian chuyển biến).\n" +
  "   - 💡 **LỜI KHUYÊN CỐT LÕI TỪ CÔ THẢO:** (1 câu đúc kết dứt khoát, định hướng hành động rõ ràng).";

let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
});

// API Hexagrams info
app.get('/api/hexagrams', (req, res) => {
  res.json(hexagramsData);
});

// Interpretation streaming endpoint
app.post('/api/interpret', async (req, res) => {
  const { que, hao, question, history, language } = req.body;

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  if (typeof res.flushHeaders === 'function') {
    res.flushHeaders();
  }

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
    const apiKey = process.env.GEMINI_API_KEY;
    const queNum = Number(que) || 1;
    const haoNum = Number(hao) || 1;

    const primaryViet = VIETNAMESE_HEXAGRAMS[queNum] || VIETNAMESE_HEXAGRAMS[1];
    const primaryMeta = HEXAGRAM_DATA[queNum] || HEXAGRAM_DATA[1];

    // Compute Transformed Hexagram (Quẻ Biến)
    const transformed = getTransformedHexagram(queNum, haoNum);
    const transformedViet = VIETNAMESE_HEXAGRAMS[transformed.number] || VIETNAMESE_HEXAGRAMS[1];
    const transformedMeta = transformed.meta;

    if (!apiKey) {
      await streamFallback();
      return;
    }

    const ai = getAI();
    if (!ai) {
      await streamFallback();
      return;
    }

    const userQuestion = question?.trim() || 'Xin Cô Thảo luận giải vận trình và hướng đi phía trước cho tôi.';

    let contentsArray: any[] = [];

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

    if (history && Array.isArray(history) && history.length > 1) {
      // Conversational follow-up: Include original hex context and entire conversation history
      const formattedHistory = history.map((m: any) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      contentsArray = [
        {
          role: 'user',
          parts: [
            {
              text: `${hexContext}Đây là cuộc đối thoại đang tiếp diễn. Hãy trả lời câu hỏi mới nhất của họ TRỰC DIỆN, ĐÚNG TRỌNG TÂM, THỰC TẾ và DỨT KHOÁT, không vòng vo, bám sát nghĩa quẻ đã gieo.`,
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
      const promptInstruction =
        `${hexContext}` +
        `HÃY TRẢ LỜI TRỰC TIẾP, ĐÚNG TRỌNG TÂM CÂU HỎI "${userQuestion}" THEO CẤU TRÚC GỌN GÀNG DƯỚI ĐÂY (Không chào hỏi rườm rà, đi thẳng vào vấn đề):\n\n` +
        `🎯 **KẾT LUẬN TRỰC DIỆN:**\n` +
        `Trả lời thẳng 1-2 câu dứt khoát cho câu hỏi "${userQuestion}": Nên hay Không nên? Thành hay Bại? Thuận lợi hay Khó khăn? Thời cơ thế nào?\n\n` +
        `📜 **QUẺ CHỦ & CỤC DIỆN HIỆN TẠI (Quẻ #${queNum} - ${primaryViet.name}):**\n` +
        `Đúng 2 câu giải thích thực trạng bạn đang gặp phải dựa trên quẻ ${primaryViet.name} và lời Thoán: "${primaryThoan}".\n\n` +
        `⚡ **HÀNH ĐỘNG CỤ THỂ (Hào Động ${haoNum}):**\n` +
        `- ✔️ **Nên làm:** 2 hành động cụ thể, thực tế áp dụng ngay.\n` +
        `- ❌ **Cần tránh:** 2 sai lầm hoặc rủi ro tối kỵ cần dẹp bỏ.\n\n` +
        `🔮 **KẾT QUẢ & THỜI ĐIỂM (Quẻ Biến #${transformed.number} - ${transformedViet.name}):**\n` +
        `Dự báo 1-2 câu về kết quả cụ thể và thời điểm mọi việc ngã ngũ/hanh thông.\n\n` +
        `💡 **LỜI KHUYÊN CỐT LÕI TỪ CÔ THẢO:**\n` +
        `1 câu chốt dứt khoát, chuẩn xác nhất để người hỏi tự tin quyết định.`;

      contentsArray = [{ role: 'user', parts: [{ text: promptInstruction }] }];
    }

    // High-speed, reliable model candidate list with gemini-3.1-flash-lite as first priority
    const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.7-flash', 'gemini-flash-latest'];
    let streamedAny = false;

    for (const modelName of CANDIDATE_MODELS) {
      if (streamedAny) break;
      try {
        const responseStream = await ai.models.generateContentStream({
          model: modelName,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.5,
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
        console.warn(`Model ${modelName} encountered error:`, modelErr?.message || modelErr);
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
    console.error('Interpret API error, streaming authentic fallback:', err);
    try {
      if (!res.writableEnded) {
        await streamFallback();
      }
    } catch (fallbackErr) {
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ error: 'Quẻ đang được chiêm nghiệm. Xin bạn thử lại.' })}\n\n`);
        res.end();
      }
    }
  }
});

// Vite / static middleware
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sạp Bói Thảo (Thao Fortune Teller) server running on http://localhost:${PORT}`);
  });
}

start();
