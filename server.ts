import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import hexagramsData from './src/hexagrams.json' with { type: 'json' };
import { HEXAGRAM_DATA, getTransformedHexagram } from './src/utils/hexagramPatterns.ts';
import { generateRichFallbackInterpretation } from './src/utils/fallbackInterpreter.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

const SYSTEM_PROMPT =
  "Bạn là Cô Thảo (Sạp Bói Thảo) - bậc thầy chiêm bói Kinh Dịch thông thái, thấu cảm và tinh tường văn hóa Việt Nam (với phong cách anime Ghibli ấm áp, chân thành: '🌸 Tại sao con khóc? Đừng lo, hãy để Thảo xem quẻ giúp bạn').\n\n" +
  "QUY TẮC CỐT LÕI BẮT BUỘC:\n" +
  "1. TƯƠNG QUAN CHẶT CHẼ VỚI THẺ XĂM ĐƯỢC GIEO: Bạn PHẢI đối chiếu chính xác tên quẻ, quái tượng (Thượng/Hạ quái), Ngũ hành, Thoán Từ, và đặc biệt là Lời Hào của Hào Động được truyền vào. Mọi luận giải phải bắt nguồn từ huyền cơ của chính thẻ xăm này.\n" +
  "2. TRẢ LỜI TRỰC DIỆN, THỰC TẾ & ĐÚNG TRỌNG TÂM CÂU HỎI: Áp dụng trực tiếp ý nghĩa Kinh Dịch của quẻ xăm vào tình huống cụ thể người hỏi đang băn khoăn (công việc, chuyển việc, tình cảm, tài chính, đầu tư, học hành, quyết định quan trọng). Tuyệt đối không nói chung chung, không dùng văn mẫu tử vi sáo rỗng.\n" +
  "3. CẤU TRÚC BẢN GIẢI BẮT BUỘC:\n" +
  "   - 🎯 PHÁN ĐOÁN TRỰC DIỆN & VẬN THẾ: Khẳng định rõ ràng xu hướng cho câu hỏi (Cát / Đại Cát / Bình Hòa / Thận Trọng / Án Binh Bất Động) và câu trả lời trực tiếp cho việc họ đang hỏi.\n" +
  "   - 📜 1. HIỆN TRẠNG & NGUYÊN DO (Quẻ Chủ & Thoán Từ): Đánh giá bối cảnh thực tại, thế trận và tâm thế của người hỏi dựa trên Ngũ Hành và Thoán Từ của Quẻ Chủ.\n" +
  "   - ⚡ 2. ĐIỂM THEN CHỐT & CHIẾN LƯỢC HÀNH ĐỘNG (Hào Động & Lời Hào): Phân tích bước ngoặt từ Lời Hào Động và nêu rõ:\n" +
  "     * ✔️ Việc NÊN LÀM: 2-3 hành động cụ thể, rõ ràng, thực tiễn có thể áp dụng ngay.\n" +
  "     * ❌ Điều CẦN TRÁNH: 2-3 sai lầm, cạm bẫy hoặc hành vi nóng vội cần phòng ngừa.\n" +
  "   - ✨ 3. KẾT QUẢ TƯƠNG LAI & THỜI ĐIỂM (Quẻ Biến & Thoán Từ Biến): Dự báo kết quả cụ thể nếu đi đúng hướng và thời điểm chuyển biến thuận lợi.\n" +
  "   - 🧭 4. LỜI DẶN DÒ TÂM HUYẾT TỪ CÔ THẢO: Lời nhắn nhủ ấm áp, tiếp thêm bản lĩnh và sự an tâm (xưng Thảo, gọi bạn / bạn hữu).\n" +
  "4. Giọng văn: Thanh tao, thấu hiểu, mạch lạc, dễ hiểu, dùng tiếng Việt chuẩn mực, xuống dòng rõ ràng giữa các mục.";

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
    const hexMap = hexagramsData as Record<string, any>;
    const primaryHex = hexMap[String(que)] || hexMap['1'];
    const primaryMeta = HEXAGRAM_DATA[que] || HEXAGRAM_DATA[1];

    // Compute Transformed Hexagram (Quẻ Biến)
    const transformed = getTransformedHexagram(Number(que) || 1, Number(hao) || 1);
    const transformedHex = hexMap[String(transformed.number)] || primaryHex;
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

    const userQuestion =
      question ||
      (language === 'vi'
        ? 'Xin Thảo luận giải vận trình và hướng đi cho tôi.'
        : 'Please interpret my path and give guidance.');

    let contentsArray: any[] = [];

    const isVi = language !== 'en';

    const primaryJudgment = primaryHex?.wilhelm_judgment?.text || '';
    const changingLineText = primaryHex?.wilhelm_lines?.[String(hao)]?.text || '';
    const transformedJudgment = transformedHex?.wilhelm_judgment?.text || '';

    const hexContext = isVi
      ? `[TƯ LIỆU KINH DỊCH CỔ TRUYỀN]\n` +
        `• Quẻ Chủ: Quẻ số #${que} - ${primaryMeta.vietnameseName} (${primaryMeta.chinese})\n` +
        `  - Cấu trúc: Thượng quái ${primaryMeta.upperTrigram} / Hạ quái ${primaryMeta.lowerTrigram} (Ngũ hành: ${primaryMeta.element})\n` +
        `  - Thoán Từ cổ truyền: "${primaryJudgment}"\n` +
        `• Hào Động: Hào số ${hao} (${transformed.wasSolid ? 'Dương ⚊ hào động chuyển thành Âm ⚋' : 'Âm ⚋ hào động chuyển thành Dương ⚊'})\n` +
        `  - Lời Hào cổ truyền (Hào Từ): "${changingLineText}"\n` +
        `• Quẻ Biến: Quẻ số #${transformed.number} - ${transformedMeta.vietnameseName} (${transformedMeta.chinese})\n` +
        `  - Cấu trúc: Thượng quái ${transformedMeta.upperTrigram} / Hạ quái ${transformedMeta.lowerTrigram} (Ngũ hành: ${transformedMeta.element})\n` +
        `  - Thoán Từ Quẻ Biến: "${transformedJudgment}"\n` +
        `• Câu hỏi & Băn khoăn thực tế của người xin quẻ: "${userQuestion}"\n\n`
      : `[AUTHENTIC I CHING DIVINATION CONTEXT]\n` +
        `• Primary Hexagram: #${que} - ${primaryHex?.english || primaryMeta.vietnameseName} (${primaryMeta.chinese})\n` +
        `  - Trigrams: Upper ${primaryMeta.upperTrigram} / Lower ${primaryMeta.lowerTrigram} (Element: ${primaryMeta.element})\n` +
        `  - Judgment Text: "${primaryJudgment}"\n` +
        `• Changing Line: Line ${hao} (${transformed.wasSolid ? 'Solid ⚊ shifts to Broken ⚋' : 'Broken ⚋ shifts to Solid ⚊'})\n` +
        `  - Line Text: "${changingLineText}"\n` +
        `• Transformed Hexagram: #${transformed.number} - ${transformedHex?.english || transformedMeta.vietnameseName} (${transformedMeta.chinese})\n` +
        `  - Judgment: "${transformedJudgment}"\n` +
        `• Seeker's Concrete Question: "${userQuestion}"\n\n`;

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
              text: `${hexContext}Đây là cuộc đối thoại đang tiếp diễn giữa người xin quẻ và Cô Thảo. Hãy trả lời câu hỏi mới nhất của họ thật súc tích, thực tế, chính xác và bám sát mạch Kinh Dịch đã gieo.`,
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
      const promptInstruction = isVi
        ? `${hexContext}` +
          `HÃY LUẬN GIẢI THEO ĐÚNG CẤU TRÚC SAU (Trình bày thanh thoát, giàu tính thực tiễn):\n\n` +
          `🎯 **PHÁN ĐOÁN TRỰC DIỆN & VẬN THẾ:**\n` +
          `Khẳng định ngay 1 câu rõ ràng về câu hỏi "${userQuestion}" (Cát/Đại Cát/Tiểu Cát/Bình Hòa/Cần Án Binh Bất Động) và câu trả lời trực tiếp cho việc họ đang trăn trở.\n\n` +
          `📜 **1. HIỆN TRẠNG & GỐC RỄ (Quẻ Chủ #${que} - ${primaryMeta.vietnameseName}):**\n` +
          `Phân tích nguyên nhân và hoàn cảnh thực tế lúc này của người hỏi dựa trên năng lượng ${primaryMeta.element} và Thoán Từ "${primaryJudgment}".\n\n` +
          `⚡ **2. ĐIỂM THEN CHỐT & CHIẾN LƯỢC HÀNH ĐỘNG (Hào Động ${hao}):**\n` +
          `Chỉ rõ bước ngoặt từ Lời Hào "${changingLineText}". Đưa ra:\n` +
          `- **✔️ Việc NÊN LÀM:** (2-3 hành động cụ thể, rõ ràng, áp dụng ngay vào đời thực)\n` +
          `- **❌ Điều CẦN TRÁNH:** (2-3 cạm bẫy, rủi ro hoặc thái độ nóng vội cần tuyệt đối tránh)\n\n` +
          `✨ **3. KẾT QUẢ TƯƠNG LAI & THỜI CƠ (Quẻ Biến #${transformed.number} - ${transformedMeta.vietnameseName}):**\n` +
          `Dự báo kết quả cụ thể nếu họ làm theo đúng chiến lược trên và thời điểm chuyển biến thuận lợi.\n\n` +
          `🧭 **4. LỜI DẶN DÒ TÂM HUYẾT TỪ CÔ THẢO:**\n` +
          `Lời khuyên đúc kết từ tâm từ Cô Thảo, giúp họ bình tâm, vững tin và sáng suốt.`
        : `${hexContext}` +
          `PLEASE DELIVER A HIGHLY ACTIONABLE & ACCURATE READING FOLLOWING THIS STRUCTURE:\n\n` +
          `🎯 **DIRECT VERDICT & ASSESSMENT:**\n` +
          `Direct 1-sentence answer to the seeker's query "${userQuestion}" with clear auspiciousness rating (Auspicious / Great Success / Caution / Hold Position).\n\n` +
          `📜 **1. Present Foundation (Hexagram #${que} - ${primaryHex?.english || primaryMeta.vietnameseName}):**\n` +
          `Analyze current state using ${primaryMeta.element} energy and judgment "${primaryJudgment}".\n\n` +
          `⚡ **2. Turning Point & Action Strategy (Line ${hao}):**\n` +
          `Unpack classical line text "${changingLineText}". Detail:\n` +
          `- **✔️ What to DO:** (2-3 concrete real-world steps)\n` +
          `- **❌ What to AVOID:** (2-3 fatal pitfalls or impatient behaviors)\n\n` +
          `✨ **3. Future Outcome & Timing (Transformed Hexagram #${transformed.number}):**\n` +
          `Concrete forecast and conditions for success.\n\n` +
          `🧭 **4. Lady Thao's Heartfelt Wisdom:**\n` +
          `Encouraging closure empowering the seeker with clarity and peace.`;

      contentsArray = [{ role: 'user', parts: [{ text: promptInstruction }] }];
    }

    // Active, high-speed, reliable model candidate list with gemini-3.1-flash-lite as first priority
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
        // Continue loop to fallback to next candidate model
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
    console.log(`Sạp Bói Thảo (Thao's Fortune Stall) server running on http://localhost:${PORT}`);
  });
}

start();
