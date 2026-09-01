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
  "You are Lady Thao (Cô Thảo Bói Quẻ), an extraordinarily perceptive, warm, and wise Vietnamese I Ching fortune teller and divination master who runs Sạp Bói Thảo. " +
  "You combine the deep wisdom of ancient I Ching (Kinh Dịch) with a delightful, compassionate anime-folklore charm (reminiscent of '🌸 Tại sao con khóc? Đừng lo, hãy để Thảo xem quẻ giúp bạn').\n\n" +
  "YOUR PRIME DIRECTIVE: PROVIDE DEEPLY TAILORED, HIGHLY RELEVANT, AND ACTIONABLE ANSWERS TO THE USER'S SPECIFIC QUESTION.\n" +
  "- Never give generic horoscope platitudes. Directly address the user's exact dilemma (e.g. career choices, job promotion, love/crush/marriage, finances, investments, life crossroads, health, relationships).\n" +
  "- Ground every insight in the authentic I Ching Triad:\n" +
  "  1. Quẻ Chủ (Primary Hexagram): Explains the seeker's current real-world state and root energy.\n" +
  "  2. Hào Động (Changing Line): The exact turning point and specific DOs and DON'Ts for their question.\n" +
  "  3. Quẻ Biến (Transformed Hexagram): The resulting outcome and future trajectory if they heed the advice.\n\n" +
  "TONE & STYLE GUIDELINES:\n" +
  "- Speak warmly and naturally as Cô Thảo (xưng Thảo, gọi bạn / bạn hữu). Be empathetic yet honest and objective.\n" +
  "- When responding in Vietnamese, use rich, elegant, evocative, and clear Vietnamese with clear formatting.\n" +
  "- Structure your response cleanly with brief headers so it is easy to read.\n" +
  "- Keep the initial reading rich and insightful (~180-250 words) and follow-up answers clear and focused (~100-150 words).";

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
      await new Promise((r) => setTimeout(r, 20));
    }
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    }
  };

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const hexMap = hexagramsData as Record<string, any>;
    const primaryHex = hexMap[String(que)];
    const primaryMeta = HEXAGRAM_DATA[que] || HEXAGRAM_DATA[1];

    // Compute Transformed Hexagram (Quẻ Biến)
    const transformed = getTransformedHexagram(Number(que) || 1, Number(hao) || 1);
    const transformedHex = hexMap[String(transformed.number)] || primaryHex;
    const transformedMeta = transformed.meta;

    const primaryJudgment = primaryHex?.wilhelm_judgment?.text || 'Wisdom unfolds in patience.';
    const primaryLineText = primaryHex?.wilhelm_lines?.[String(hao)]?.text || 'Remain centered and observant.';
    const transformedJudgment = transformedHex?.wilhelm_judgment?.text || 'Future unfolds step by step.';

    if (!apiKey) {
      await streamFallback();
      return;
    }

    const ai = getAI();
    if (!ai) {
      await streamFallback();
      return;
    }

    let contentsArray: any[] = [];

    const contextPreamble =
      `[AUTHENTIC I CHING HEXAGRAM DRAWING CONTEXT]\n` +
      `- Quẻ Chủ (Primary Hexagram): #${que} - ${primaryMeta.vietnameseName} (${primaryHex?.english})\n` +
      `  * Trigrams: Thượng ${primaryMeta.upperTrigram} / Hạ ${primaryMeta.lowerTrigram}, Ngũ Hành: ${primaryMeta.element}\n` +
      `  * Thoán Từ (Judgment): "${primaryJudgment}"\n` +
      `- Hào Động (Changing Line): Hào ${hao} (${transformed.wasSolid ? 'Dương ⚊' : 'Âm ⚋'} biến ${transformed.nowSolid ? 'Dương ⚊' : 'Âm ⚋'})\n` +
      `  * Lời Hào (Line Text): "${primaryLineText}"\n` +
      `- Quẻ Biến (Transformed Result Hexagram): #${transformed.number} - ${transformedMeta.vietnameseName} (${transformedHex?.english})\n` +
      `  * Thoán Từ Quẻ Biến (Resulting Judgment): "${transformedJudgment}"\n\n`;

    if (history && Array.isArray(history) && history.length > 0) {
      // For conversational history, include system context as first turn
      contentsArray = [
        {
          role: 'user',
          parts: [{ text: `${contextPreamble}The user previously cast this hexagram. Below is our ongoing conversation.` }],
        },
        {
          role: 'model',
          parts: [{ text: 'Thảo đã hiểu rõ hoàn cảnh và quẻ xăm của bạn. Mời bạn tiếp tục hỏi.' }],
        },
        ...history.map((m: any) => ({
          role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.text }],
        })),
      ];
    } else {
      const userQuestion = question || (language === 'vi' ? 'Xin Thảo luận giải vận trình và hướng đi cho tôi.' : 'Please interpret my path and give guidance.');

      const promptInstruction = language === 'vi'
        ? `${contextPreamble}` +
          `CÂU HỎI CỦA NGƯỜI XIN QUẺ: "${userQuestion}"\n\n` +
          `YÊU CẦU CỦA CÔ THẢO:\n` +
          `1. Mở đầu bằng lời chào thân tình và trực tiếp giải đáp câu hỏi "${userQuestion}" (không vòng vo).\n` +
          `2. Trình bày rõ ràng 3 phần gắn liền với câu hỏi cụ thể:\n` +
          `   - 📜 Hiện Trạng (Quẻ Chủ #${que} - ${primaryMeta.vietnameseName}): Đánh giá tình thế hiện tại của câu hỏi theo Thoán Từ.\n` +
          `   - ⚡ Điểm Then Chốt & Lời Khuyên Hành Động (Hào Động ${hao}): Chỉ rõ điều NÊN LÀM và KHÔNG NÊN LÀM dựa trên Lời Hào.\n` +
          `   - ✨ Xu Hướng Tương Lai (Quẻ Biến #${transformed.number} - ${transformedMeta.vietnameseName}): Dự báo kết quả cụ thể cho câu hỏi.\n` +
          `3. Lời đúc kết ngắn gọn, truyền cảm hứng và sự an tâm từ Thảo.`
        : `${contextPreamble}` +
          `SEEKER'S SPECIFIC QUESTION: "${userQuestion}"\n\n` +
          `INSTRUCTIONS FOR LADY THAO:\n` +
          `1. Begin with a warm greeting and directly answer their question "${userQuestion}".\n` +
          `2. Clearly explain how the Primary Hexagram, Changing Line #${hao}, and Transformed Hexagram #${transformed.number} directly apply with specific action advice.\n` +
          `3. End with Lady Thao's comforting and empowering wisdom.`;

      contentsArray = [{ role: 'user', parts: [{ text: promptInstruction }] }];
    }

    // Try models in order to prevent quota exhaustion outages
    const CANDIDATE_MODELS = ['gemini-2.5-flash', 'gemini-3.7-flash', 'gemini-flash-latest'];
    let streamedAny = false;

    for (const modelName of CANDIDATE_MODELS) {
      if (streamedAny) break;
      try {
        const geminiPromise = ai.models.generateContentStream({
          model: modelName,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.6,
          },
          contents: contentsArray,
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI response timed out')), 6000)
        );

        const responseStream: any = await Promise.race([geminiPromise, timeoutPromise]);

        for await (const chunk of responseStream) {
          if (chunk.text && !res.writableEnded) {
            streamedAny = true;
            res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
          }
        }
        if (streamedAny) break;
      } catch (modelErr: any) {
        console.warn(`Model ${modelName} failed or quota exceeded:`, modelErr?.message || modelErr);
        // Continue loop to try next candidate model
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
    console.error('Interpret API error or timeout, falling back smoothly to authentic I Ching interpretation:', err);
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
