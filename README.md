# ChamaConnect Refactored (Hackathon Submission)

Hackathon project for improving ChamaConnect, a digital platform for managing chama operations (members, contributions, loans, expenses, goals, and governance flows).

Theme alignment: `ChamaConnect: Refactored - Scaling the Circle`

<div align="center">
<img width="1200" height="auto" alt="Chama Connect Virtual Hackathon official announcement poster" src="./Chama-Connect_Announcement.jpeg" />
</div>

---

## Official hackathon snapshot

| Item | Detail |
|------|--------|
| **Event** | Chama Connect Virtual Hackathon |
| **Partners** | Salamander Tech Hub × Muiaa Ltd (Muiruri & Associates / Muiaa Labs) |
| **Theme** | `ChamaConnect: Refactored - Scaling the Circle` |
| **Tagline** | `build.test.improve.innovate` |
| **Platform scope** | Improve **ChamaConnect** at **chamaconnect.io** / **chamaconnect.co.ke** |
| **Focus** | (1) Feature enhancement — (2) **ICDMS** optimization (Integrated Case Data Management System) |
| **Submission** | Public **GitHub**; original work; declare dependencies (`package.json`); **no secrets**; no harmful testing on live production |
| **Deadlines** | Poster: **17 April 2026** — PDF section 7: **Monday, 11:59 PM EAT** (use PDF + organizer updates if they differ) |
| **Prizes** | 1st **$300** · 2nd **$200** · 3rd **$100** (payout timing / **KRA** withholding per section 6 of the PDF) |
| **Governing terms** | **[Source Code Submission Terms & Conditions (PDF)](docs/ChamaConnect-Hackathon-Source-Code-Submission-Terms-and-Conditions.pdf)** — IP, privacy, cyber conduct, Kenya / **exclusive Nairobi** jurisdiction (see PDF sections 2–9) |
| **Supplementary repo docs** | `REPOSITORY_TERMS.md` (PDF topic summary), `LICENSE`, `NOTICE`, `CONTRIBUTOR_SIGN_OFF.md` — **subordinate to the PDF** |

Full narrative, priorities, and references: **`Hackathon_Details.md`**.

**Judge / submission write-ups**

- **`HACKATHON_PROPOSAL.md`** — concise problem, solution, hackathon alignment, demo script  
- **`docs/TECHNICAL_PROPOSAL.md`** — technical proposal **source** (export to PDF for portals that request a “Technical Proposal Upload”)

If you also use the organizer **PRD** (*ChamaConnect PRD & Agent Execution Spec*, often Next.js + Prisma + on-chain modules), treat **`docs/TECHNICAL_PROPOSAL.md` §4** as the mapping from that document to **this** React/Vite codebase.

---

## Why This Matters

Many chama groups still rely on fragmented manual workflows (spreadsheets, chat threads, verbal updates), which leads to:

- delayed financial visibility
- poor auditability for fines/appeals and member actions
- inconsistent operational records across meetings

This project focuses on creating a cleaner admin workspace that makes group operations easier to manage and scale.

## What This Repository Currently Delivers

The app provides a modern admin workspace with **typed domain state** (`src/domain/`), demo seed data (`src/seed/lesomDynamics.ts`), and page-level modules aligned to `src/navigation.ts`:

- Dashboard
- My Chamas
- Members
- Finances (group money overview)
- Contributions
- **Cases** (ICDMS-style records / case flows)
- **M-Pesa** (payments integration surface)
- Fines and Appeals
- Goals
- Share Capital
- Settings (group info, fine rules, integrations, **Audit** log, governance text, **constitution** and **technical proposal PDF** file pickers — filenames only in demo; see `src/types.ts` `GroupRules`)

**Chama AI Advisor** (CopilotKit sidebar): asks about the live demo chama in English or Kiswahili using grounded context (members, totals, loans, open cases, rules). Starter prompts and suggestions are defined in `src/domain/chamaCopilotPrompts.ts` and `src/copilot/chamaChatSuggestions.ts`. The assistant can invoke **frontend tools** to record a contribution, run the penalty engine, or simulate an M-Pesa payment—those actions update the same in-memory state as the rest of the admin UI.

**Server LLM helpers** (Express, `server/src/llmRoutes.ts`): `POST /api/llm/monthly-summary` (dashboard narrative) and `POST /api/llm/case-suggest` (ICDMS case suggestions grounded in group rules). Vite proxies `/api` to the API port during dev (see `vite.config.ts`).

Current status: core shell, navigation, several flows, the AI sidebar, audit trail, and LLM routes are implemented; persistence, live M-Pesa, and on-chain modules remain roadmap — see **`Hackathon_Details.md`**, **`docs/TECHNICAL_PROPOSAL.md`**, and code under `src/views/` / `src/integrations/`.

## Challenge Mapping

- **Feature Enhancement:** richer and cleaner workflow structure across core chama operations
- **ICDMS Optimization:** improved organization for records-heavy areas such as members, fines/appeals, and settings metadata

See `Hackathon_Details.md` for the event brief and submission policy notes.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Motion (animations)
- Lucide React (icons)
- CopilotKit (v2 React sidebar + Express runtime)
- Express (local API: `/api/copilotkit`, `/api/llm/*`, `/api/health`)
- Zod (tool parameters)
- `@google/genai` / optional Anthropic keys (see `.env.example`)

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Install dependencies:
   - `npm install`
2. Create local environment file:
   - copy `.env.example` to `.env.local`
3. Set environment variables in `.env.local` (see `.env.example` for all options). For the AI advisor you need at least one LLM key Copilot can use: **`GEMINI_API_KEY`** or **`GOOGLE_API_KEY`** (Gemini), or **`ANTHROPIC_API_KEY`** when **`LLM_PROVIDER=anthropic`**. Optional: **`PORT`** for the API (default **3001**; Vite on **3000** proxies `/api` to it).
4. Start the app **with** the API (required for Chama AI Advisor). In **two terminals** from the repo root:
   - Terminal A: `npm run dev:server`
   - Terminal B: `npm run dev`  
   Optional: after `npm i -D concurrently`, you can use **`npm run dev:all`** to run both with one command.
5. Open:
   - [http://localhost:3000](http://localhost:3000)

`npm run dev` alone serves the UI, but **CopilotKit requests fail** until the Express process is running and keys are set.

## Demo Walkthrough (for Judges)

Use this sequence to quickly evaluate the current implementation:

1. Open `Dashboard` to review the overall shell and financial summary card layout.
2. Open `My Chamas` for group-level overview and empty-state handling.
3. Open `Members` to inspect table design and admin identity state.
4. Open `Cases` for ICDMS-aligned record / case handling UI (if enabled in your build).
5. Open `M-Pesa` to review the payments integration surface (demo / configuration as applicable).
6. Open `Fines` and switch between `Fines`/`Appeals` tabs to view records flow structure.
7. Open `Share Capital` to inspect ownership and utilization views.
8. Open `Settings` to review grouped governance/configuration forms.
9. Open **Chama AI Advisor** from the Copilot sidebar: try a suggested prompt, then optional tools (contribution / penalties / M-Pesa simulation) and confirm the main views reflect updates.

## Scripts

- `npm run dev` — Vite dev server on port **3000** (proxies `/api` to `PORT`, default **3001**)
- `npm run dev:server` / `npm run dev:api` — Express API (Copilot + other `/api` routes)
- `npm run dev:all` — API + Vite together (requires dev dependency **`concurrently`**; install with `npm i -D concurrently` if the script is missing)
- `npm run build` — production build
- `npm run preview` — preview production build (with `/api` proxy to `PORT`)
- `npm run lint` — TypeScript check for the app (`tsc --noEmit`)
- `npm run typecheck:server` — TypeScript check for `server/`
- `npm run clean` — remove `dist`

## Project Structure

- `src/App.tsx` — main shell, auth gate, navigation, and view wiring
- `src/navigation.ts` — `AppPage` route keys
- `src/domain/` — chama state, reducer, React context (`chamaReducer.ts`, `chamaContext.tsx`, penalties, M-Pesa helpers), plus `chamaCopilotPrompts.ts` (starter prompt copy for the AI card)
- `src/copilot/chamaChatSuggestions.ts` — Copilot suggestion chips (before first message)
- `src/views/` — page views (dashboard, cases, M-Pesa, etc.)
- `src/seed/lesomDynamics.ts` — demo / seed dataset for hackathon demo mode
- `src/components/ChamaCopilot.tsx` — CopilotKit provider, sidebar, agent context, and frontend tools
- `components/ui/` — shared UI primitives (e.g. `ai-assistant-card.tsx`, shadcn-style components)
- `server/` — Express app (`server/src/app.ts`) and entrypoint; CopilotKit at `/api/copilotkit`; LLM JSON routes at `/api/llm` (`server/src/llmRoutes.ts`)
- `src/integrations/` — third-party integration helpers (e.g. Nobuk, PayHero)
- `src/types.ts` — shared domain types
- `src/data.ts` — additional mock / static data where used
- `src/main.tsx` — app bootstrap
- `src/index.css` — global styles
- `Hackathon_Details.md` — hackathon brief, deadlines, prizes, IP, and repo priorities
- `HACKATHON_PROPOSAL.md` — problem / solution / impact write-up for judges  
- `docs/TECHNICAL_PROPOSAL.md` — technical proposal source (export to PDF)
- `docs/ChamaConnect-Hackathon-Source-Code-Submission-Terms-and-Conditions.pdf` — **binding** submission terms
- `docs/README.md` — index of official hackathon PDF(s) and `TECHNICAL_PROPOSAL.md`

## Planned Next Increments

- Integrate real API/data layer for all transaction modules (align with PRD Prisma/API shape if adopting that spec)
- Implement full CRUD for members, contributions, loans, expenses, goals
- Add validation and role-aware permissions for sensitive flows
- Extend audit metadata for additional dispute-prone actions as flows grow
- M-Pesa Daraja STK + webhooks + reconciliation log (per PRD Module F)
- Add test coverage for critical finance and record workflows

## Submission Readiness Checklist

- [ ] Final features are clearly tied to challenge focus area(s)
- [ ] Repository is public and documentation is complete
- [ ] No secrets are committed (`.env.local` is ignored)
- [ ] Dependencies are fully declared in `package.json`
- [ ] Build and type-check pass (`npm run build` and `npm run lint`)
- [ ] Demo evidence (screenshots/video + walkthrough notes) is attached
- [ ] Proposal/writeup is finalized (`HACKATHON_PROPOSAL.md`)
- [ ] Technical proposal PDF exported from `docs/TECHNICAL_PROPOSAL.md` (fill placeholders first) and attached if required by organizers

## Compliance Notes

- Do not commit credentials; use `.env.local` (gitignored) only.
- **Binding contract:** the PDF linked in the table above (and [`docs/README.md`](docs/README.md)). Markdown summaries do not replace sections 2–9 of the PDF.
- Unrelated third parties: see `NOTICE` and `LICENSE` — no assumption of a permissive OSS license for independent commercial use.
