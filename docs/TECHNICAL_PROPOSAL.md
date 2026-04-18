# Technical Proposal — ChamaConnect Refactored

**Scaling the Circle** · Chama Connect Virtual Hackathon 2026

This document is the repository **source** for a judge-facing technical proposal. Export to **PDF** from your editor when a submission portal asks for a “Technical Proposal Upload.” Update placeholders in the table below before exporting.

| Field | Value |
|--------|--------|
| **Product** | ChamaConnect — chamaconnect.io / chamaconnect.co.ke |
| **Repository** | _Add public Git URL_ |
| **Demo / video** | _Add link_ |
| **Team / contact** | _Add names and email_ |
| **Stack (this repo)** | React 19, TypeScript, Vite, Tailwind CSS 4, Express (`server/`), CopilotKit |
| **Binding terms** | [Source Code Submission Terms (PDF)](./ChamaConnect-Hackathon-Source-Code-Submission-Terms-and-Conditions.pdf) |

---

## 1. Executive summary

This submission refactors the **admin experience** for Kenyan **chama** (table banking) operations: members, money in/out, loans, fines, goals, share capital, **ICDMS-style cases**, and **M-Pesa**-oriented flows. It uses **typed client-side domain state** plus **demo seed data** so evaluators always see a coherent product surface, and adds **server-side LLM** endpoints for **dashboard narrative** and **case suggestions**, plus an **embedded AI advisor** (CopilotKit) with optional **frontend tools** (e.g. record contribution, run penalties, simulate M-Pesa).

A separate **Muiaa Labs PRD** (often titled *ChamaConnect PRD & Agent Execution Spec*) describes a broader **Next.js + Prisma + on-chain treasury + Morpho yield + full Daraja M-Pesa** roadmap. **This repository implements a focused subset** of that vision on a **Vite SPA + Express** stack, prioritizing **hackathon tracks**: **feature enhancement** and **ICDMS optimization**.

---

## 2. Problem statement

1. **Operational fragmentation** — Many chamas still rely on spreadsheets, chat threads, and informal memory, which weakens visibility, verification speed, and trust.

2. **Weak first-screen credibility** — Without seeded or live data, dashboards and lists read as **empty products**, which fails both judges and real treasurers.

3. **ICDMS gap** — Disputes, exceptions, and appeals need a **structured case** model (status, assignee, timeline, evidence), not ad hoc messages.

4. **Penalty inconsistency** — Late payments and rule breaches should follow **published, repeatable rules** and link to disputes where needed.

5. **Payments narrative vs integration** — M-Pesa is central to Kenyan chamas; the product must show a **clear path** from **simulation / UX** to **STK push, callbacks, and reconciliation** (production phase).

6. **AI without grounding** — Generic assistants are risky for money; suggestions must use **group rules** (constitution, loan, contribution snippets) and **case facts**.

7. **Longer-horizon PRD items not in this repo** — Multi-sig on-chain vaults, Morpho yield, Prisma persistence, Africa’s Talking SMS, and full CopilotKit **server actions** for every workflow remain **documented follow-ons**, not claimed as shipped here.

---

## 3. Proposed solution and architecture

### 3.1 Architecture

| Layer | Role |
|--------|------|
| **SPA** (`src/`) | Shell, navigation, views, React context + reducer for chama state |
| **Domain** (`src/domain/`) | Single source of truth: members, finances, cases, fines, M-Pesa helpers, penalties, audit hooks |
| **Seed** (`src/seed/lesomDynamics.ts`) | Demo dataset for hackathon mode |
| **API** (`server/src/`) | Express: `/api/llm/*`, `/api/copilotkit`, `/api/health`, M-Pesa placeholder route |
| **Deploy** | Static build + optional Node server (see root `README.md`, `vercel.json` if used) |

### 3.2 Implemented capabilities (code anchors)

- **Navigation and modules** — `src/navigation.ts`, `src/App.tsx`, `src/views/*`
- **ICDMS-style cases** — `src/views/CasesView.tsx`; case actions in `src/domain/chamaReducer.ts`; AI suggest via `POST /api/llm/case-suggest` (`server/src/llmRoutes.ts`)
- **Dashboard AI summary** — `src/views/DashboardView.tsx` → `POST /api/llm/monthly-summary`
- **Fines / penalties** — `src/domain/penalties.ts`, fines UI, `RUN_PENALTIES` action
- **M-Pesa simulation** — `src/domain/mpesa.ts`, M-Pesa view; server echo stub `POST /api/mpesa/simulate` (`server/src/app.ts`)
- **Chama AI Advisor** — `src/components/ChamaCopilot.tsx`, prompts `src/domain/chamaCopilotPrompts.ts`, suggestions `src/copilot/chamaChatSuggestions.ts`
- **Governance & submission artifacts** — Settings: constitution + policy snippets; **constitution file** and **technical proposal PDF** pickers store **filename only** in demo (`src/types.ts` `GroupRules`, `src/App.tsx` Settings)
- **Audit trail** — `auditLog` on state, Settings **Audit** tab and dashboard snippet (`chamaReducer.ts` `pushAudit`)
- **Integrations (roadmap)** — `src/integrations/` (Nobuk, PayHero helpers/links)

---

## 4. PRD alignment (optional external spec)

If your team uses **ChamaConnect_PRD_Agent_Spec (Repaired).pdf** (or equivalent), map this repo as follows:

| PRD module | This repo status |
|------------|------------------|
| **D — Smart dashboard + demo** | Delivered in spirit via seed + dashboard + LLM summary |
| **B — ICDMS** | Partial — SPA domain + UI + AI suggest; no Prisma `Case` tables |
| **E — Penalty engine** | Partial — rules + evaluation in domain; no daily production cron |
| **F — M-Pesa / Nobuk / PayHero** | Partial — simulation + integration stubs; no Daraja STK in repo |
| **C — AI advisor + CopilotKit** | Partial — sidebar + BuiltInAgent + tools; not full backend action suite |
| **A — Blockchain / Morpho** | Not implemented |

---

## 5. Security and compliance

- **No secrets in Git** — use `.env.local` (see `.env.example`).
- **No harmful testing** on production chamaconnect.io — follow PDF **§5** and `Hackathon_Details.md`.
- **IP and use** — governed by the submission terms PDF (**§2**, **§9**).

---

## 6. Roadmap (post-hackathon)

1. Persistent **database** (e.g. Prisma models as in PRD) for cases, penalties, contributions, reconciliation log.  
2. **M-Pesa Daraja** STK + signed callbacks + treasurer review queue.  
3. **Role-based auth** on every API route.  
4. Optional **on-chain** vault + yield per PRD Module A.  
5. Tests (Vitest) for reducer, penalties, M-Pesa matching.

---

## 7. Conclusion

This submission delivers a **credible, demo-ready admin refactor** with **ICDMS-forward cases**, **AI-assisted** summaries and suggestions, **penalty logic**, **M-Pesa simulation**, **auditability**, and **governance uploads**—with an explicit, honest boundary against **not-yet-built** production payments and blockchain modules described in the full PRD.
