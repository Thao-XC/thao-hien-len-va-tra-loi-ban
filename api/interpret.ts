import { GoogleGenAI } from '@google/genai';
import hexagramsData from '../src/hexagrams.json' with { type: 'json' };
import { HEXAGRAM_DATA, getTransformedHexagram } from '../src/utils/hexagramPatterns';
import { generateRichFallbackInterpretation } from '../src/utils/fallbackInterpreter';

const SYSTEM_PROMPT =
  "You are Thao, a wise, warm, delightfully friendly, and perceptive fortune teller who runs Sạp Bói Thảo (Thao's Fortune Stall), " +
  "reading the I Ching (Kinh Dịch) through traditional Vietnamese bamboo fortune sticks (thẻ xăm). " +
  "You carry a warm, compassionate folk-fairy charm.\n\n" +
  "AUTHENTIC I CHING METHODOLOGY (QUẺ CHỦ → HÀO ĐỘNG → QUẺ BIẾN):\n" +
  "1. Quẻ Chủ (Primary Hexagram): Represents the present situation, foundational dynamics, and root energy.\n" +
  "2. Hào Động (Changing Line): The critical inflection point, the root cause of change, and precise action advice.\n" +
  "3. Quẻ Biến (Transformed Hexagram): The resulting situation, future trajectory, and outcome when following or defying the line's guidance.\n\n" +
  "YOUR ABSOLUTE TOP PRIORITY IS STRICT FIDELITY TO CLASSICAL I CHING TEXTS, OBJECTIVITY, AND CONCISENESS.\n" +
  "- Ground your interpretation rigorously on the classical Judgment and Line text.\n" +
  "- Keep your initial reading concise (under 140 words) and follow-up answers under 100 words.\n" +
  "- Speak warmly and directly (xưng Thảo, gọi bạn / bạn hữu).";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { que, hao, question, history, language } = req.body || {};

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  const streamFallback = async () => {
    const fallbackText = generateRichFallbackInterpretation(
      Number(que) || 1,
      Number(hao) || 1,
      question || '',
      language === 'en' ? 'en' : 'vi',
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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return streamFallback();
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const hexMap = hexagramsData as Record<string, any>;
    const primaryHex = hexMap[String(que)] || hexMap['1'];
    const primaryMeta = HEXAGRAM_DATA[que] || HEXAGRAM_DATA[1];
    const transformed = getTransformedHexagram(Number(que) || 1, Number(hao) || 1);
    const transformedHex = hexMap[String(transformed.number)] || primaryHex;

    const openingPrompt =
      `Người bốc xăm vừa hỏi: "${question || 'Xin chỉ dẫn vận trình'}"\n` +
      `Thẻ xăm linh ứng rơi ra: Quẻ #${que} (${primaryMeta?.vietnameseName || primaryHex?.english}), Hào Động #${hao}.\n` +
      `Thoán Từ Quẻ Chủ: "${primaryHex?.wilhelm_judgment?.text || ''}"\n` +
      `Hào Từ Hào ${hao}: "${primaryHex?.wilhelm_lines?.[String(hao)]?.text || ''}"\n` +
      `Quẻ Biến: Quẻ #${transformed.number} (${transformed.meta?.vietnameseName || transformedHex?.english}).\n` +
      `Thoán Từ Quẻ Biến: "${transformedHex?.wilhelm_judgment?.text || ''}"\n\n` +
      `Ngôn ngữ trả lời: ${language === 'en' ? 'English' : 'Vietnamese'}.\n` +
      `Hãy giải quẻ súc tích, ấm áp theo phong cách Cô Thảo bói xăm Kinh Dịch.`;

    const contentsArray =
      history && history.length > 0
        ? [
            ...history.map((m: any) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.text }],
            })),
            { role: 'user', parts: [{ text: question || 'Lời khuyên thêm' }] },
          ]
        : [{ role: 'user', parts: [{ text: openingPrompt }] }];

    const CANDIDATE_MODELS = ['gemini-2.5-flash', 'gemini-3.7-flash', 'gemini-flash-latest'];
    let streamedAny = false;

    for (const modelName of CANDIDATE_MODELS) {
      if (streamedAny) break;
      try {
        const stream = await ai.models.generateContentStream({
          model: modelName,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.65,
          },
          contents: contentsArray,
        });

        for await (const chunk of stream) {
          if (chunk.text && !res.writableEnded) {
            streamedAny = true;
            res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
          }
        }
        if (streamedAny) break;
      } catch (err) {
        // try next model
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
  } catch (e) {
    await streamFallback();
  }
}
