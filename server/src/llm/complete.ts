import { GoogleGenAI } from '@google/genai';

export type LlmProvider = 'gemini' | 'anthropic' | 'openrouter';

export function resolveProvider(): LlmProvider {
  const p = (process.env.LLM_PROVIDER || 'gemini').toLowerCase();
  if (p === 'anthropic' && process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (p === 'openrouter' && process.env.OPENROUTER_API_KEY) return 'openrouter';
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) return 'gemini';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OPENROUTER_API_KEY) return 'openrouter';
  return 'gemini';
}

async function geminiText(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not set');
  const ai = new GoogleGenAI({ apiKey: key });
  const res = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    contents: prompt,
  });
  return res.text ?? '';
}

async function anthropicText(prompt: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not set');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { content?: Array<{ type?: string; text?: string }> };
  const texts = (data.content ?? []).filter((b) => b.type === 'text').map((b) => b.text ?? '');
  return texts.join('\n') || '';
}

async function openRouterText(prompt: string): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('OPENROUTER_API_KEY not set');
  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? '';
}

export async function completeText(userPrompt: string): Promise<string> {
  const prov = resolveProvider();
  if (prov === 'anthropic') return anthropicText(userPrompt);
  if (prov === 'openrouter') return openRouterText(userPrompt);
  return geminiText(userPrompt);
}
