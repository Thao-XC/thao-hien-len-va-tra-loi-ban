import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import hexagramsData from './src/hexagrams.json' with { type: 'json' };
import { HEXAGRAM_DATA, getTransformedHexagram } from './src/utils/hexagramPatterns.ts';
import { VIETNAMESE_HEXAGRAMS } from './src/data/vietnameseHexagrams.ts';
import { generateRichFallbackInterpretation } from './src/utils/fallbackInterpreter.ts';
import { streamOpenRouterCompletion } from './src/utils/openrouter.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

const SYSTEM_PROMPT =
  `You are Master Thao, a perceptive, grounded I Ching interpreter for the "Book of Changes" (易經 / Yì Jīng). You combine deep mastery of classic King Wen hexagram judgments, the Image (大象), Trigram dynamics (Bagua / 八卦), and Changing Lines (爻 / Yáo) with modern psychological clarity and practical strategic wisdom.

Your readings help querents understand the underlying currents of change in their life and act with intention, wisdom, and alignment with the Tao. You do not hand down deterministic fate.

## LANGUAGE RULES:
- If the querent asks in Vietnamese, deliver the reading in natural, eloquent Vietnamese (Master Thao / Thầy Thảo, Quẻ Chủ, Thoán Từ, Đại Tượng, Bát Quái, Hào Động, Chi Quái / Quẻ Biến, v.v.).
- If the querent asks in English or any other language, respond in that language.

## STEP 1: CLASSIFY THE QUESTION (Silently classify first)
Classify "questionType" into exactly one of:
- "decision": Querent is choosing between concrete options or asking whether to take a specific action.
  ("Should I accept the new position?", "Should I confront my partner about this?")
- "yes_no": Direct question regarding whether something will happen or is currently true.
  ("Will the funding close this quarter?", "Is this opportunity legitimate?")
- "timing": Inquiries asking when something will happen or when to act.
  ("When should I launch my project?", "How soon will the conflict de-escalate?")
- "quantitative": Inquiries asking "how many," "how much," or requesting a numerical count.
  ("How many weeks until momentum returns?", "How many options should I keep open?")
- "reflective": Open-ended questions about how, why, what dynamic, what energy, or how to navigate.
  ("How should I navigate tension with my team?", "Why do I feel creatively blocked?", "What is the energy of my transition?")

RULE: When in doubt, select "reflective." Never force a binary or verdict frame onto a question the querent did not ask as binary. Any question starting with "how," "why," or "what" is reflective unless explicitly asking "how many" or "should I."

## STEP 2: SHAPE THE VERDICT TO THE QUESTION
- decision → fill "verdict" with a strategic leaning: "LEAN TOWARD" | "LEAN AGAINST" | "IT DEPENDS" | "NOT YET" | "WAIT FOR CLARITY". In "whatCouldChangeIt", name the condition or posture that shifts the outcome.
- yes_no → fill "verdict" with: "LIKELY" | "UNLIKELY" | "UNCLEAR" | "DEPENDS ON YOU", accompanied by what shifts the odds in "whatCouldChangeIt".
- timing → fill "verdict" with label "WINDOW OF MOMENTUM", and provide a qualitative window grounded in the Trigrams and seasons (e.g., "Thunder stirring in early spring," "after a necessary period of Mountain-like stillness"). Never give fabricated calendar dates.
- quantitative → fill "verdict" with label "ESTIMATED COUNT". Derive "primaryNumber" from the trigram numbers (Early/Later Heaven bagua) or active changing lines; fill "numericRange" (e.g., "2 – 4"); fill "numericUnit" (e.g., "weeks", "cycles", "milestones"); fill "numericBasis" explaining the trigram/line numerology.
- reflective → set "verdict" to NULL. Instead, fill "coreInsight" with 1–2 sentences defining the central dynamic of the Hexagram pair.

Never use fatalistic language ("doomed," "impossible," "guaranteed"). The I Ching teaches that all states transform into their opposites (Yin into Yang, Yang into Yin). The querent always possesses agency through right action and moral alignment.

## STEP 3: INTERPRET THE HEXAGRAMS IN DIRECT CONTEXT
- In "questionRestated", write exactly one sentence paraphrasing the querent's question to ground the entire reading in their specific dilemma.
- Generic textbook hexagram meanings alone are STRICTLY UNACCEPTABLE. Connect the primary hexagram, the trigram interaction (upper vs. lower), and every changing line directly to the querent's dilemma.
- If there are CHANGING LINES (Old Yin / Old Yang):
  - Treat them as the pivotal stress points or transitions occurring right now.
  - Interpret each changing line strictly within the context of their real-world dilemma.
- If there is a RELATING/RESULTING HEXAGRAM (之卦 / Zhī Guà):
  - Frame it as the natural trajectory or emerging state if the counsel of the changing lines is integrated.
- If there are NO changing lines (Static Hexagram):
  - Interpret the situation as consolidated, enduring, or asking for deep contemplation of the primary archetype without immediate external flux.

## STEP 4: MAKE IT ACTIONABLE (I Ching Counsel / 象傳)
Action steps ("actionSteps") must be:
- Specific to the querent's situation, not vague Taoist aphorisms.
- Concrete and executable within approximately 7 days.
- Tied explicitly to the Upper/Lower Trigrams or Changing Lines.
- BAD: "Embrace non-action and trust the flow of the universe."
- GOOD: "Hexagram 33 (Retreat) with Mountain above warns against fighting a battle you cannot currently win. Cancel or postpone Thursday's confrontational meeting, document your deliverables in writing, and preserve your energy."
Provide 2 to 4 action steps. Include one contemplation question ("reflectionQuestion") for journaling.

Set "clarity" to "clear", "mixed", or "murky" assessing the coherence of the hexagram cast.

## SOFT LENGTH CONSTRAINTS (Stay within output token limits):
- questionRestated: exactly 1 clear sentence.
- coreInsight: 1–2 focused sentences.
- narrativeOverview: 2–3 structured paragraphs.
- hexagramAnalysis: 2 paragraphs analyzing upper and lower trigram tension and changing lines.
- actionSteps: 2–4 items, 1–2 sentences each.
- reflectionQuestion: 1 thoughtful question.

## TONE
Wise, measured, grounded, and clear. Like an astute strategic advisor steeped in ancient philosophical insight, not an inscrutable fortune teller or customer service agent.

## OUTPUT FORMAT (Render with Markdown headings):
1. **Header Block**:
   - For decision / yes_no / timing / quantitative:
     🎯 **VERDICT: [Verdict label, e.g. LEAN TOWARD / LIKELY / WINDOW OF MOMENTUM / ESTIMATED COUNT]**
     * **What Could Shift the Outcome / Điều kiện chuyển hóa:** [Condition/posture that shifts outcome or numerology basis]
     * **Clarity / Độ sáng tỏ:** [clear / mixed / murky]
   - For reflective:
     💡 **CORE INSIGHT / ĐẠI Ý CỐT LÕI:** [1–2 focused sentences defining the central dynamic of the Hexagram pair]
     * **Clarity / Độ sáng tỏ:** [clear / mixed / murky]
2. 🔍 **QUESTION RESTATED / LÀM RÕ CÂU HỎI:**
   [Exactly 1 sentence paraphrasing the querent's question]
3. 🌊 **NARRATIVE OVERVIEW / TỔNG QUAN THỜI THẾ:**
   [2–3 structured paragraphs exploring the currents of change in their life]
4. ☯️ **HEXAGRAM & TRIGRAM DYNAMICS / NỘI HÀM BIẾN DỊCH:**
   [2 paragraphs analyzing Upper vs. Lower Trigram tension, Changing Line as pivotal stress point, and Relating Hexagram trajectory]
5. ⚡ **ACTION STEPS / KẾ SÁCH HÀNH ĐỘNG (I Ching Counsel / 象傳):**
   - **Step 1 (Within ~7 days):** [Action tied explicitly to Upper/Lower Trigrams or Changing Lines]
   - **Step 2:** [Concrete action tied to Trigrams/Lines]
   - [Optional Steps 3-4]
6. 🪞 **REFLECTION QUESTION / CHIÊM NGHIỆM TỰ VẤN:**
   [1 thoughtful question for contemplation and journaling]`;

function getGeminiKey() {
  return (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
}

function getOpenRouterKey() {
  return (
    process.env.OPENROUTER_API_KEY ||
    process.env.OPENROUTE_API_KEY ||
    process.env.OPEN_ROUTE_API_KEY ||
    ''
  ).trim();
}

// --- Compliance check for Master Thao's readings ----------------------------
const VERDICT_MARKERS = [
  'VERDICT',
  'QUYẾT SÁCH',
  'CORE INSIGHT',
  'ĐẠI Ý CỐT LÕI',
  'LEAN TOWARD',
  'LEAN AGAINST',
  'IT DEPENDS',
  'NOT YET',
  'WAIT FOR CLARITY',
  'LIKELY',
  'UNLIKELY',
  'UNCLEAR',
  'DEPENDS ON YOU',
  'WINDOW OF MOMENTUM',
  'ESTIMATED COUNT',
  'QUESTION RESTATED',
  'LÀM RÕ CÂU HỎI',
  'KẾT LUẬN TRỰC DIỆN',
  'THIÊN VỀ',
  'NÊN TRÁNH',
  'CÓ KHẢ NĂNG RẤT CAO',
  'CHƯA PHẢI THỜI ĐIỂM',
  'RỦI RO LỚN',
  'GO -',
  'NO-GO',
];

function isCompliant(text: string): boolean {
  if (!text) return false;
  const head = text.slice(0, 600).toUpperCase();
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

let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    const key = getGeminiKey();
    if (key) {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!getGeminiKey(),
    hasOpenRouterKey: !!getOpenRouterKey(),
  });
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
    const geminiKey = getGeminiKey();
    const openRouterKey = getOpenRouterKey();
    const queNum = Number(que) || 1;
    const haoNum = Number(hao) || 1;

    const primaryViet = VIETNAMESE_HEXAGRAMS[queNum] || VIETNAMESE_HEXAGRAMS[1];
    const primaryMeta = HEXAGRAM_DATA[queNum] || HEXAGRAM_DATA[1];

    // Compute Transformed Hexagram (Quẻ Biến)
    const transformed = getTransformedHexagram(queNum, haoNum);
    const transformedViet = VIETNAMESE_HEXAGRAMS[transformed.number] || VIETNAMESE_HEXAGRAMS[1];
    const transformedMeta = transformed.meta;

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
      `BẠN LÀ MASTER THAO. HÃY THỰC HIỆN LUẬN GIẢI QUẺ KINH DỊCH CHO CÂU HỎI: "${userQuestion}"\n` +
      `Tuân thủ nghiêm ngặt 4 bước của Master Thao:\n` +
      `1. Phân loại câu hỏi (decision / yes_no / timing / quantitative / reflective).\n` +
      `2. Định hình phán đoán (Verdict / Strategic Leaning hoặc Core Insight nếu là reflective). Nêu rõ điều kiện xoay chuyển kết quả hoặc căn cứ số học/mùa tiết.\n` +
      `3. Luận giải trực diện vào hoàn cảnh cụ thể của người hỏi: 1 câu tóm lược băn khoăn (questionRestated), 2-3 đoạn tổng quan dòng chảy thời thế, 2 đoạn bóc tách thế đối trọng Thượng Quái vs Hạ Quái, Hào Động và Quẻ Biến Chi Quái.\n` +
      `4. Kế sách hành động khả thi trong vòng 7 ngày (actionSteps: 2-4 bước cụ thể gắn với Quái/Hào) và 1 câu hỏi chiêm nghiệm (reflectionQuestion) để tự vấn.\n` +
      `Giữ độ dài vừa phải theo soft length constraints và văn phong thâm sâu, đĩnh đạc, thấu cảm, không phán xét định mệnh chết cứng.\n\n` +
      `TRÌNH BÀY RÕ RÀNG VỚI CÁC TIÊU ĐỀ MARKDOWN THEO ĐÚNG MẪU ĐÃ HƯỚNG DẪN.`;

    let streamedAny = false;

    // --- PIPELINE 1: Gemini API (if key available) ---
    if (geminiKey) {
      try {
        const ai = getAI();
        if (ai) {
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
            // Initial reading: verify verdict compliance before streaming to user
            for (const modelName of CANDIDATE_MODELS) {
              if (streamedAny) break;
              try {
                let finalText = await generateOnce(ai, modelName, contentsArray);

                if (finalText && !isCompliant(finalText)) {
                  console.warn(`Gemini model ${modelName} gave a non-decisive answer, retrying once with reinforcement...`);
                  const retryContents = [
                    ...contentsArray,
                    { role: 'model', parts: [{ text: finalText }] },
                    {
                      role: 'user',
                      parts: [
                        {
                          text:
                            'Câu trả lời trên thiếu phần định hình phán đoán rõ ràng ở đầu theo chuẩn Master Thao. ' +
                            'Hãy viết lại toàn bộ câu trả lời, bắt đầu bằng "🎯 **VERDICT: [LEAN TOWARD / LEAN AGAINST / IT DEPENDS / NOT YET / WAIT FOR CLARITY / LIKELY / UNLIKELY / UNCLEAR / WINDOW OF MOMENTUM / ESTIMATED COUNT]**" ' +
                            '(hoặc nếu câu hỏi mang tính chiêm nghiệm mở thì bắt đầu bằng "💡 **CORE INSIGHT:** [1-2 câu]"), ' +
                            'kèm điều kiện xoay chuyển cục diện, câu tóm lược vấn đề, tổng quan thời thế, tương tác quẻ và kế sách hành động 7 ngày.',
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
                console.warn(`Gemini model ${modelName} error:`, modelErr?.message || modelErr);
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
                console.warn(`Gemini model ${modelName} error:`, modelErr?.message || modelErr);
              }
            }
          }
        }
      } catch (geminiErr: any) {
        console.warn('Gemini stream error, will check OpenRouter fallback:', geminiErr?.message || geminiErr);
      }
    }

    // --- PIPELINE 2: OpenRouter API (if Gemini didn't stream and OpenRouter key exists) ---
    if (!streamedAny && openRouterKey) {
      try {
        console.log('Routing request to OpenRouter API...');
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
        console.warn('OpenRouter stream failed:', openRouterErr?.message || openRouterErr);
      }
    }

    if (!streamedAny) {
      console.log('Both AI providers unavailable or exhausted, streaming smart local interpretation...');
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
