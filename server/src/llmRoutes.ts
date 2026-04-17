import { Router } from 'express';
import { z } from 'zod';
import { completeText } from './llm/complete.ts';

const router = Router();

const monthlyBody = z.object({
  groupName: z.string(),
  totals: z.object({
    totalContrib: z.number(),
    totalIncome: z.number(),
    totalExpense: z.number(),
  }),
  memberCount: z.number(),
  openCases: z.number(),
});

router.post('/monthly-summary', async (req, res) => {
  try {
    const body = monthlyBody.parse(req.body);
    const prompt = `You are a concise chama treasurer AI. Group: ${body.groupName}. Members: ${body.memberCount}. Totals KES: contributions ${body.totals.totalContrib}, income ${body.totals.totalIncome}, expenses ${body.totals.totalExpense}. Open ICDMS cases: ${body.openCases}. Write 2-3 sentences: growth vibe, risk (missed payments), and one action. Use Ksh prefix. JSON only: {"summary":"..."}`;
    const raw = await completeText(prompt);
    const json = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, '').trim()) as { summary?: string };
    res.json({ summary: json.summary ?? raw });
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

const caseBody = z.object({
  case: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    status: z.string(),
    events: z.array(z.object({ message: z.string() })).optional(),
  }),
  groupRules: z.object({
    constitutionSnippet: z.string(),
    loanPolicySnippet: z.string(),
    contributionPolicySnippet: z.string(),
  }),
});

router.post('/case-suggest', async (req, res) => {
  try {
    const body = caseBody.parse(req.body);
    const prompt = `Group rules:\n${body.groupRules.constitutionSnippet}\nLoans:${body.groupRules.loanPolicySnippet}\nContributions:${body.groupRules.contributionPolicySnippet}\n\nCase: ${body.case.title}. ${body.case.description}. Category ${body.case.category}. Status ${body.case.status}. Recent notes: ${(body.case.events ?? []).map((e) => e.message).join(' | ')}\n\nReturn JSON {"suggestion":"3-5 bullet next steps for chair/treasurer, grounded in rules only."}`;
    const raw = await completeText(prompt);
    let suggestion = raw;
    try {
      const j = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, '').trim()) as { suggestion?: string };
      if (j.suggestion) suggestion = j.suggestion;
    } catch {
      /* use raw */
    }
    res.json({ suggestion });
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

const chatBody = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string() })),
  context: z.record(z.string(), z.any()).optional(),
});

router.post('/chat', async (req, res) => {
  try {
    const body = chatBody.parse(req.body);
    const ctx = JSON.stringify(body.context ?? {});
    const transcript = body.messages.map((m) => `${m.role}: ${m.content}`).join('\n');
    const prompt = `You are Chama AI Financial Advisor (Kenya). Ground answers ONLY in CONTEXT JSON. Support Swahili if user writes Swahili. If data missing, say so. CONTEXT:${ctx}\n\nCHAT:\n${transcript}\n\nassistant:`;
    const reply = await completeText(prompt);
    res.json({ reply });
  } catch (e) {
    res.status(400).json({ error: String(e) });
  }
});

export { router as llmRouter };
