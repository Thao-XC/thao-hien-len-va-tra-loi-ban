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
  "Bạn là Cô Thảo (Sạp Bói Thảo) - bậc thầy chiêm bói Kinh Dịch thông thái, thấu cảm và tinh tường văn hóa Việt Nam (với phong cách anime Ghibli ấm áp, chân thành: '🌸 Tại sao con khóc? Đừng lo, hãy để Thảo xem quẻ giúp bạn').\n\n" +
  "NGUYÊN TẮC BẮT BUỘC:\n" +
  "1. HOÀN TOÀN THUẦN TIẾNG VIỆT 100%: Tuyệt đối không dùng tiếng Anh, không pha trộn từ ngữ ngoại quốc trong bài luận giải.\n" +
  "2. TƯƠNG QUAN CHẶT CHẼ VỚI QUẺ VÀ HÀO ĐƯỢC GIEO: Đối chiếu chính xác Quẻ Chủ, Quái Tượng, Ngũ Hành, Thoán Từ, Lời Tượng và Lời Hào của Hào Động được truyền vào.\n" +
  "3. TRẢ LỜI TRỰC DIỆN, THỰC TẾ & ĐÚNG TRỌNG TÂM CÂU HỎI: Áp dụng trực tiếp triết lý Kinh Dịch vào hoàn cảnh cụ thể người hỏi đang băn khoăn (công việc, chuyển việc, tình cảm, tài chính, đầu tư, học hành, quyết định quan trọng). Tuyệt đối không nói chung chung hay dùng văn mẫu sáo rỗng.\n" +
  "4. CẤU TRÚC BẢN GIẢI QUẺ BẮT BUỘC:\n" +
  "   - 🎯 **PHÁN ĐOÁN TRỰC DIỆN & VẬN THẾ:** Khẳng định ngay 1 câu rõ ràng về câu hỏi (Cát / Đại Cát / Bình Hòa / Cần Thận Trọng / Án Binh Bất Động) và câu trả lời trực tiếp cho việc người hỏi đang trăn trở.\n" +
  "   - 📜 **1. HIỆN TRẠNG & BỐI CẢNH (Quẻ Chủ & Thoán Từ):** Phân tích thế trận thực tại của người hỏi dựa trên Ngũ Hành và Thoán Từ của Quẻ Chủ.\n" +
  "   - ⚡ **2. ĐIỂM THEN CHỐT & CHIẾN LƯỢC HÀNH ĐỘNG (Hào Động & Lời Hào):** Chỉ rõ bước ngoặt từ Lời Hào Động và nêu rõ:\n" +
  "     * ✔️ Việc NÊN LÀM: 2-3 hành động cụ thể, thực tiễn, áp dụng ngay vào đời thực.\n" +
  "     * ❌ Điều CẦN TRÁNH: 2-3 cạm bẫy, rủi ro hoặc thái độ nóng vội cần phòng ngừa.\n" +
  "   - ✨ **3. KẾT QUẢ TƯƠNG LAI & THỜI CƠ (Quẻ Biến & Thoán Từ Quẻ Biến):** Dự báo kết quả cụ thể nếu đi đúng hướng và thời điểm chuyển biến thuận lợi.\n" +
  "   - 🧭 **4. LỜI DẶN DÒ TÂM HUYẾT TỪ CÔ THẢO:** Lời nhắn nhủ ấm áp, tiếp thêm bản lĩnh và sự an tâm (xưng Thảo, gọi bạn / bạn hữu).\n" +
  "5. Giọng văn: Thanh tao, thấu hiểu, mạch lạc, dễ hiểu, dùng tiếng Việt chuẩn mực, xuống dòng rõ ràng giữa các mục.";

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
              text: `${hexContext}Đây là cuộc đối thoại đang tiếp diễn giữa người xin quẻ và Cô Thảo. Hãy trả lời câu hỏi mới nhất của họ bằng tiếng Việt thuần túy, thật súc tích, thực tế, chính xác và bám sát mạch Kinh Dịch đã gieo.`,
            },
          ],
        },
        {
          role: 'model',
          parts: [{ text: 'Thảo đã thấu tỏ quẻ xăm và câu hỏi của bạn. Mời bạn trao đổi tiếp.' }],
        },
        ...formattedHistory,
      ];
    } else {
      const promptInstruction =
        `${hexContext}` +
        `HÃY LUẬN GIẢI HOÀN TOÀN BẰNG TIẾNG VIỆT THEO ĐÚNG CẤU TRÚC SAU (Trình bày thanh thoát, giàu tính thực tiễn):\n\n` +
        `🎯 **PHÁN ĐOÁN TRỰC DIỆN & VẬN THẾ:**\n` +
        `Khẳng định ngay 1 câu rõ ràng về câu hỏi "${userQuestion}" (Cát/Đại Cát/Tiểu Cát/Bình Hòa/Cần Thận Trọng/Án Binh Bất Động) và câu trả lời trực tiếp cho việc họ đang trăn trở.\n\n` +
        `📜 **1. HIỆN TRẠNG & BỐI CẢNH (Quẻ Chủ #${queNum} - ${primaryViet.name}):**\n` +
        `Phân tích nguyên nhân và hoàn cảnh thực tế lúc này của người hỏi dựa trên năng lượng ngũ hành ${primaryViet.element}, tượng quẻ "${primaryViet.symbol}" và Thoán Từ "${primaryThoan}".\n\n` +
        `⚡ **2. ĐIỂM THEN CHỐT & CHIẾN LƯỢC HÀNH ĐỘNG (Hào Động ${haoNum}):**\n` +
        `Chỉ rõ bước ngoặt từ Lời Hào "${changingLineText}". Đưa ra chiến lược thực tế:\n` +
        `- **✔️ Việc NÊN LÀM:** (2-3 hành động cụ thể, rõ ràng, áp dụng ngay vào đời thực)\n` +
        `- **❌ Điều CẦN TRÁNH:** (2-3 cạm bẫy, rủi ro hoặc thái độ nóng vội cần tuyệt đối tránh)\n\n` +
        `✨ **3. KẾT QUẢ TƯƠNG LAI & THỜI CƠ (Quẻ Biến #${transformed.number} - ${transformedViet.name}):**\n` +
        `Dự báo kết quả cụ thể nếu họ làm theo đúng chiến lược trên và thời điểm chuyển biến thuận lợi dựa trên Thoán Từ Quẻ Biến: "${transformedThoan}".\n\n` +
        `🧭 **4. LỜI DẶN DÒ TÂM HUYẾT TỪ CÔ THẢO:**\n` +
        `Lời khuyên đúc kết từ tâm từ Cô Thảo, giúp họ bình tâm, vững tin và sáng suốt.`;

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
