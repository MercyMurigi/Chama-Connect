import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { CopilotRuntime, BuiltInAgent } from '@copilotkit/runtime/v2';
import { createCopilotExpressHandler } from '@copilotkit/runtime/v2/express';
import { llmRouter } from './llmRoutes.ts';

const PORT = Number(process.env.PORT || 3001);

const SYSTEM = `You are Chama AI Financial Advisor for Kenyan chamas (table banking / SACCO style).
- Ground every numeric claim in CONTEXT the user provides; never invent balances.
- Respond in English or Kiswahili depending on the user's language.
- Offer practical next steps: contributions, loans, fines, ICDMS cases, M-Pesa reconciliation.
- When drafting notices or letters, use markdown and formal but warm tone.`;

function buildAgent(): BuiltInAgent {
  const prov = (process.env.LLM_PROVIDER || 'gemini').toLowerCase();
  if (prov === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
    return new BuiltInAgent({
      model: 'anthropic/claude-3.5-haiku',
      apiKey: process.env.ANTHROPIC_API_KEY,
      prompt: SYSTEM,
      forwardSystemMessages: true,
    });
  }
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!geminiKey) {
    throw new Error('Set GEMINI_API_KEY (or GOOGLE_API_KEY), or ANTHROPIC_API_KEY for CopilotKit BuiltInAgent');
  }
  return new BuiltInAgent({
    model: 'google/gemini-2.5-flash',
    apiKey: geminiKey,
    prompt: SYSTEM,
    forwardSystemMessages: true,
  });
}

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '4mb' }));

app.use('/api/llm', llmRouter);

app.post('/api/mpesa/simulate', (req, res) => {
  res.json({
    ok: true,
    note: 'Client applies M-Pesa simulation via domain store; this endpoint is for future treasurer API.',
    echo: req.body,
  });
});

let copilotMounted = false;
try {
  const runtime = new CopilotRuntime({
    agents: {
      default: buildAgent(),
    },
  });
  app.use(
    createCopilotExpressHandler({
      runtime,
      basePath: '/api/copilotkit',
      cors: true,
    }),
  );
  copilotMounted = true;
} catch (e) {
  console.warn('[ChamaConnect] CopilotKit runtime disabled:', e);
  app.use('/api/copilotkit', (_req, res) => {
    res.status(503).json({ error: 'CopilotKit unavailable', detail: String(e) });
  });
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, copilot: copilotMounted, port: PORT });
});

app.listen(PORT, () => {
  console.log(`ChamaConnect API listening on http://localhost:${PORT}`);
});
