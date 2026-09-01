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
  "Bạn là Cô Thảo (Sạp Bói Thảo) - một bậc thầy chiêm bói Kinh Dịch thông thái, thấu cảm và tinh tế trong văn hóa Việt Nam (với phong cách anime Ghibli ấm áp, dịu dàng: '🌸 Tại sao con khóc? Đừng lo, hãy để Thảo xem quẻ giúp bạn').\n\n" +
  "NGUYÊN TẮC BẮT BUỘC QUAN TRỌNG NHẤT:\n" +
  "1. PHẢI LUẬN GIẢI TRỰC TIẾP, ĐÚNG TRỌNG TÂM VÀO CÂU HỎI VÀ NỖI BĂN KHOĂN CỦA NGƯỜI XIN QUẺ (Ví dụ: công việc, nhảy việc, tình duyên, tài chính, đầu tư, mối quan hệ, quyết định cuộc sống).\n" +
  "2. TUYỆT ĐỐI KHÔNG NÓI CHUNG CHUNG SÁO RỖNG. Hãy áp dụng triết lý Kinh Dịch và năng lượng của quẻ vào chính xác tình huống thực tế của họ.\n" +
  "3. CẤU TRÚC LUẬN GIẢI BẮT BUỘC:\n" +
  "   - Lời chào ấm áp & khẳng định trực tiếp xu hướng (Cát / Hung / Thuận lợi / Cần thận trọng) đối với câu hỏi.\n" +
  "   - 📜 1. HIỆN TRẠNG (Quẻ Chủ): Năng lượng nền tảng và bối cảnh hiện tại của câu hỏi.\n" +
  "   - ⚡ 2. ĐIỂM THEN CHỐT & LỜI KHUYÊN HÀNH ĐỘNG (Hào Động): Chỉ rõ ĐIỀU NÊN LÀM và ĐIỀU KHÔNG NÊN LÀM để gặt hái cát lợi.\n" +
  "   - ✨ 3. KẾT QUẢ TƯƠNG LAI (Quẻ Biến): Dự báo diễn biến và kết quả cụ thể cho câu hỏi nếu làm đúng theo lời khuyên.\n" +
  "   - Lời nhắn nhủ, động viên truyền cảm hứng và an tâm từ Cô Thảo (xưng Thảo, gọi bạn).\n" +
  "4. Giữ giọng văn thanh tao, ân cần, mạch lạc, dễ hiểu, trình bày có ngắt dòng rõ ràng.";

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

    const hexContext = isVi
      ? `[BỐI CẢNH QUẺ XĂM KINH DỊCH]\n` +
        `- Quẻ Chủ: Quẻ #${que} (${primaryMeta.vietnameseName}) - Thượng quái: ${primaryMeta.upperTrigram}, Hạ quái: ${primaryMeta.lowerTrigram}, Ngũ hành: ${primaryMeta.element}\n` +
        `- Hào Động: Hào ${hao} (${transformed.wasSolid ? 'Dương ⚊' : 'Âm ⚋'} chuyển thành ${transformed.nowSolid ? 'Dương ⚊' : 'Âm ⚋'})\n` +
        `- Quẻ Biến: Quẻ #${transformed.number} (${transformedMeta.vietnameseName}) - Thượng quái: ${transformedMeta.upperTrigram}, Hạ quái: ${transformedMeta.lowerTrigram}\n` +
        `- Câu hỏi/Băn khoăn của người xin quẻ: "${userQuestion}"\n\n`
      : `[AUTHENTIC I CHING DIVINATION CONTEXT]\n` +
        `- Primary Hexagram: #${que} (${primaryHex?.english || primaryMeta.vietnameseName}) - Upper: ${primaryMeta.upperTrigram}, Lower: ${primaryMeta.lowerTrigram}, Element: ${primaryMeta.element}\n` +
        `- Changing Line: Line ${hao} (${transformed.wasSolid ? 'Solid ⚊' : 'Broken ⚋'} shifts to ${transformed.nowSolid ? 'Solid ⚊' : 'Broken ⚋'})\n` +
        `- Transformed Hexagram: #${transformed.number} (${transformedHex?.english || transformedMeta.vietnameseName})\n` +
        `- Seeker's Question: "${userQuestion}"\n\n`;

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
              text: `${hexContext}Đây là cuộc đối thoại đang diễn ra giữa người xin quẻ và Cô Thảo. Hãy trả lời câu hỏi mới nhất của họ thật súc tích, chính xác và bám sát bối cảnh quẻ dịch đã gieo.`,
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
          `YÊU CẦU ĐỐI VỚI CÔ THẢO:\n` +
          `1. Mở đầu bằng lời chào ấm áp, trực tiếp trả lời vào câu hỏi: "${userQuestion}".\n` +
          `2. Trình bày rõ ràng 3 mục gắn chặt với câu hỏi thực tế của người xin quẻ:\n` +
          `   - 📜 1. HIỆN TRẠNG (Quẻ #${que} - ${primaryMeta.vietnameseName}): Đánh giá thực trạng lúc này đối với vấn đề người xin quẻ hỏi.\n` +
          `   - ⚡ 2. ĐIỂM THEN CHỐT & LỜI KHUYÊN HÀNH ĐỘNG (Hào Động ${hao}): Chỉ rõ điều NÊN LÀM và KHÔNG NÊN LÀM cụ thể để đón lành tránh dữ.\n` +
          `   - ✨ 3. KẾT QUẢ TƯƠNG LAI (Quẻ Biến #${transformed.number} - ${transformedMeta.vietnameseName}): Dự báo kết quả cụ thể nếu làm theo lời khuyên.\n` +
          `3. Kết lại bằng lời chúc và động viên an lành từ Cô Thảo.`
        : `${hexContext}` +
          `REQUIREMENTS FOR LADY THAO:\n` +
          `1. Warm greeting and direct answer to the seeker's question: "${userQuestion}".\n` +
          `2. Structure clearly with 3 sections addressing their specific situation:\n` +
          `   - 📜 1. Present Situation (Hexagram #${que} - ${primaryHex?.english || primaryMeta.vietnameseName})\n` +
          `   - ⚡ 2. Crucial Action Advice (Line ${hao}): Specific DOs and DON'Ts\n` +
          `   - ✨ 3. Future Outcome (Transformed Hexagram #${transformed.number} - ${transformedHex?.english || transformedMeta.vietnameseName})\n` +
          `3. Conclude with Lady Thao's encouraging, compassionate wisdom.`;

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
