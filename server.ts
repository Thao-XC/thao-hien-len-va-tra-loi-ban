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

// Interpretation streaming endpoint
app.post('/api/interpret', async (req, res) => {
  try {
    const { que, hao, question, history, language } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

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
      // Fallback offline grounded interpretation
      const fallbackText = language === 'vi'
        ? `Quẻ Chủ là Quẻ ${que} (${primaryMeta.vietnameseName}), động Hào ${hao} biến thành Quẻ ${transformed.number} (${transformedMeta.vietnameseName}). ` +
          `Phán từ Quẻ Chủ: "${primaryJudgment}". Lời Hào ${hao}: "${primaryLineText}". ` +
          `Xu hướng tương lai ở Quẻ Biến: "${transformedJudgment}". ` +
          `Đối với câu hỏi "${question || 'vận trình'}", bạn đang ở giai đoạn cần cân nhắc cẩn trọng lời Hào ${hao}, thuận theo đạo trung chính để chuyển hung thành cát khi bước sang quẻ ${transformedMeta.vietnameseName}.`
        : `You drew Primary Hexagram ${que} (${primaryHex?.english || 'The Oracle'}), Active Line ${hao}, transforming into Hexagram ${transformed.number} (${transformedHex?.english || 'The Future'}). ` +
          `Primary Judgment: "${primaryJudgment}". Line ${hao}: "${primaryLineText}". Resulting Hexagram: "${transformedJudgment}". ` +
          `For your question "${question || 'your path'}": The current momentum is shifting at line ${hao}. Stay centered and act with sincerity to navigate toward the clarity of Hexagram ${transformed.number}.`;

      // Stream words smoothly
      const words = fallbackText.split(' ');
      for (const word of words) {
        res.write(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`);
        await new Promise((r) => setTimeout(r, 40));
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    }

    const ai = getAI();
    if (!ai) {
      res.write(`data: ${JSON.stringify({ error: 'AI Client could not be initialized' })}\n\n`);
      res.end();
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

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.65,
      },
      contents: contentsArray,
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: any) {
    console.error('Interpret API error:', err);
    res.write(`data: ${JSON.stringify({ error: err.message || 'An error occurred during interpretation' })}\n\n`);
    res.end();
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
