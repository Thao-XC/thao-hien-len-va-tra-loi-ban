import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import hexagramsData from './src/hexagrams.json' with { type: 'json' };
import { HEXAGRAM_DATA, getTransformedHexagram } from './src/utils/hexagramPatterns.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

const SYSTEM_PROMPT =
  "You are Thao, a wise, warm, delightfully friendly, and perceptive fortune teller who runs Sạp Bói Thảo (Thao's Fortune Stall), " +
  "reading the I Ching (Kinh Dịch) through traditional Vietnamese bamboo fortune sticks (thẻ xăm). " +
  "You carry a warm, compassionate folk-fairy charm (reminiscent of 'Tại sao con khóc? Đừng lo, hãy để Thảo xem quẻ giúp bạn').\n\n" +
  "AUTHENTIC I CHING METHODOLOGY (QUẺ CHỦ → HÀO ĐỘNG → QUẺ BIẾN):\n" +
  "1. Quẻ Chủ (Primary Hexagram): Represents the present situation, foundational dynamics, and root energy.\n" +
  "2. Hào Động (Changing Line): The critical inflection point, the root cause of change, and precise action advice.\n" +
  "3. Quẻ Biến (Transformed Hexagram): The resulting situation, future trajectory, and outcome when following or defying the line's guidance.\n\n" +
  "YOUR ABSOLUTE TOP PRIORITY IS STRICT FIDELITY TO CLASSICAL I CHING TEXTS, OBJECTIVITY, AND CONCISENESS.\n" +
  "- You are provided with the exact classical Judgment (Thoán Từ) and Line Text (Hào Từ) for Quẻ Chủ, as well as the Judgment of Quẻ Biến.\n" +
  "- Ground your interpretation rigorously on these exact texts, not generic horoscope fluff.\n" +
  "- If the omen is challenging, cautionary, or unfavorable, explain it honestly with tact and clarity — do not artificially sugarcoat or force positive spin.\n" +
  "- Keep your initial reading concise (under 140 words) and follow-up answers under 100 words.\n" +
  "- Speak warmly and directly like a wise, compassionate elder or close confidante (xưng Thảo, gọi bạn / bạn hữu). No rigid bullet points or robotic lists. If asked in Vietnamese, reply in natural, evocative, graceful Vietnamese.";

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

function generateRichFallbackInterpretation(
  que: number,
  hao: number,
  question: string,
  language: 'en' | 'vi',
  history?: any[]
): string {
  const hexMap = hexagramsData as Record<string, any>;
  const primaryHex = hexMap[String(que)];
  const primaryMeta = HEXAGRAM_DATA[que] || HEXAGRAM_DATA[1];
  const transformed = getTransformedHexagram(Number(que) || 1, Number(hao) || 1);
  const transformedHex = hexMap[String(transformed.number)] || primaryHex;
  const transformedMeta = transformed.meta;

  const primaryJudgment = primaryHex?.wilhelm_judgment?.text || 'Thuận theo đạo trung chính, giữ tâm kiên định ắt vạn sự hanh thông.';
  const primaryLineText = primaryHex?.wilhelm_lines?.[String(hao)]?.text || 'Hành sự cẩn trọng, quan sát thời thế trước khi dốc toàn lực.';
  const transformedJudgment = transformedHex?.wilhelm_judgment?.text || 'Tương lai rộng mở khi bước qua biến cố chuyển hóa.';

  // If this is a follow-up question
  if (history && history.length > 1) {
    if (language === 'vi') {
      return `Thảo hiểu băn khoăn của bạn! Với câu hỏi này, quẻ gốc #${que} (${primaryMeta.vietnameseName}) đang chuyển dịch mạnh mẽ tại Hào ${hao} để tiến tới quẻ #${transformed.number} (${transformedMeta.vietnameseName}).\n\n` +
        `Lời khuyên mấu chốt: "${primaryLineText}". Bạn chớ nên nóng vội hay cưỡng cầu điều chưa chín muồi. Hãy tập trung củng cố nội lực (${primaryMeta.element}), giữ sự chân thành và khiêm nhường thì mọi sự sẽ dần thuận buồm xuôi gió.`;
    } else {
      return `Lady Thao hears your heart! For your follow-up, Primary Hexagram #${que} (${primaryHex?.english || 'The Oracle'}) shifting at Line ${hao} toward Hexagram #${transformed.number} (${transformedHex?.english || 'The Future'}) advises:\n\n` +
        `"${primaryLineText}". Do not rush or force premature outcomes. Nurture your inner composure and act with sincerity to navigate toward clarity.`;
    }
  }

  // Initial interpretation
  if (language === 'vi') {
    return `🌸 Chào bạn, hãy an lòng. Thảo đã gieo được quẻ xăm linh ứng cho bạn:\n\n` +
      `📜 Quẻ Chủ: #${que} - ${primaryMeta.vietnameseName} (${primaryMeta.upperTrigram} trên ${primaryMeta.lowerTrigram}, ngũ hành ${primaryMeta.element}).\n` +
      `Thoán Từ dạy rằng: "${primaryJudgment}". Đây là nền tảng hiện tại của sự việc.\n\n` +
      `⚡ Hào Động: Hào ${hao} (${transformed.wasSolid ? 'Hào Dương' : 'Hào Âm'} biến đổi).\n` +
      `Lời Hào mách nước: "${primaryLineText}". Đây chính là điểm then chốt nhất mà bạn cần lưu tâm.\n\n` +
      `✨ Quẻ Biến: #${transformed.number} - ${transformedMeta.vietnameseName} (${transformedHex?.english || ''}).\n` +
      `Thoán Từ Quẻ Biến: "${transformedJudgment}".\n\n` +
      `🔮 Lời Thảo nhắn gửi về câu hỏi "${question || 'vận trình'}": Hãy lắng nghe lời răn của Hào ${hao}, giữ tâm trung chính, thuận theo lẽ tự nhiên thì điềm hung cũng hóa cát, tiền đồ sẽ hanh thông sáng rõ.`;
  } else {
    return `🌸 Welcome, dear traveler. Lady Thao has cast the sacred bamboo stick for you:\n\n` +
      `📜 Primary Hexagram: #${que} - ${primaryHex?.english || 'The Creative'} (Upper: ${primaryMeta.upperTrigram}, Lower: ${primaryMeta.lowerTrigram}, Element: ${primaryMeta.element}).\n` +
      `Judgment: "${primaryJudgment}". This reflects your present root condition.\n\n` +
      `⚡ Changing Line: Line ${hao} (${transformed.wasSolid ? 'Solid Line' : 'Broken Line'} transforming).\n` +
      `Line Oracle: "${primaryLineText}". This is the precise turning point.\n\n` +
      `✨ Transformed Hexagram: #${transformed.number} - ${transformedHex?.english || 'The Result'}.\n` +
      `Resulting Judgment: "${transformedJudgment}".\n\n` +
      `🔮 Lady Thao's Insight for "${question || 'your question'}": Pay close attention to Line ${hao}. By aligning action with virtue and patience, challenges will transform into fruitful outcomes.`;
  }
}

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

    if (history && Array.isArray(history) && history.length > 0) {
      contentsArray = history.map((m: any) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));
    } else {
      const langInstruction = language === 'vi' 
        ? 'Hãy luận giải bằng tiếng Việt thật tinh tế, thấu đáo, chuẩn Kinh Dịch, xưng Thảo và gọi người hỏi là bạn.'
        : 'Please interpret in English warmly, concisely, and grounded in classical I Ching wisdom.';

      const openingPrompt =
        `[DRAWING DATA FROM TRADITIONAL I CHING STICKS]\n` +
        `- Quẻ Chủ (Primary Hexagram): #${que} - ${primaryMeta.vietnameseName} (${primaryHex?.english})\n` +
        `  * Thượng quái: ${primaryMeta.upperTrigram}, Hạ quái: ${primaryMeta.lowerTrigram}, Ngũ hành: ${primaryMeta.element}\n` +
        `  * Thoán Từ (Judgment): "${primaryJudgment}"\n` +
        `- Hào Động (Changing Line): Hào ${hao} (${transformed.wasSolid ? 'Dương ⚊' : 'Âm ⚋'} biến ${transformed.nowSolid ? 'Dương ⚊' : 'Âm ⚋'})\n` +
        `  * Lời Hào (Line Text): "${primaryLineText}"\n` +
        `- Quẻ Biến (Transformed Result Hexagram): #${transformed.number} - ${transformedMeta.vietnameseName} (${transformedHex?.english})\n` +
        `  * Thoán Từ Quẻ Biến: "${transformedJudgment}"\n\n` +
        `User's question: "${question || 'What guidance does this hold for my current circumstance?'}"\n\n` +
        `${langInstruction}`;

      contentsArray = [{ role: 'user', parts: [{ text: openingPrompt }] }];
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
            temperature: 0.65,
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
