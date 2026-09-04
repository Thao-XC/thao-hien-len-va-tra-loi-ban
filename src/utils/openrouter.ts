export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const DEFAULT_MODELS = [
  'google/gemini-2.5-flash',
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3.3-70b-instruct',
  'deepseek/deepseek-chat',
  'anthropic/claude-3.5-haiku',
];

export async function streamOpenRouterCompletion({
  apiKey,
  model,
  messages,
  temperature = 0.4,
  appUrl = 'https://ai.studio',
  onChunk,
}: {
  apiKey: string;
  model?: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  appUrl?: string;
  onChunk: (text: string) => void;
}): Promise<boolean> {
  const cleanKey = apiKey?.trim();
  if (!cleanKey) return false;

  const candidateModels = [
    model?.trim(),
    ...DEFAULT_MODELS,
  ].filter(Boolean) as string[];

  // Remove duplicates while preserving priority
  const uniqueModels = Array.from(new Set(candidateModels));

  for (const targetModel of uniqueModels) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cleanKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': appUrl,
          'X-Title': 'Sap Boi Thao - Kinh Dich',
        },
        body: JSON.stringify({
          model: targetModel,
          messages,
          stream: true,
          temperature,
        }),
      });

      if (!response.ok || !response.body) {
        const errorBody = await response.text().catch(() => '');
        console.warn(`OpenRouter model ${targetModel} HTTP ${response.status}:`, errorBody.slice(0, 200));
        continue;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let streamedAny = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const dataStr = trimmed.slice(6).trim();
          if (dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              streamedAny = true;
              onChunk(content);
            }
          } catch {
            // Partial JSON chunk, continue
          }
        }
      }

      if (buffer.trim().startsWith('data: ')) {
        const dataStr = buffer.trim().slice(6).trim();
        if (dataStr !== '[DONE]') {
          try {
            const parsed = JSON.parse(dataStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              streamedAny = true;
              onChunk(content);
            }
          } catch {}
        }
      }

      if (streamedAny) {
        return true;
      }
    } catch (err: any) {
      console.warn(`OpenRouter model ${targetModel} stream failed:`, err?.message || err);
    }
  }

  return false;
}
