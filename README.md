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
| **Deadlines** | Poster: **17 April 2026** — PDF **§7**: **Monday, 11:59 PM EAT** (use PDF + organizer updates if they differ) |
| **Prizes** | 1st **$300** · 2nd **$200** · 3rd **$100** (payout timing / **KRA** withholding per **§6** of the PDF) |
| **Governing terms** | **[Source Code Submission Terms & Conditions (PDF)](docs/ChamaConnect-Hackathon-Source-Code-Submission-Terms-and-Conditions.pdf)** — IP **§2**, privacy **§4**, cyber conduct **§5**, Kenya / **exclusive Nairobi** jurisdiction **§9.1** |
| **Supplementary repo docs** | `REPOSITORY_TERMS.md` (PDF topic summary), `LICENSE`, `NOTICE`, `CONTRIBUTOR_SIGN_OFF.md` — **subordinate to the PDF** |

Full narrative, priorities, and references: **`Hackathon_Details.md`**.

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
- Settings

Current status: core shell, navigation, and several flows are implemented; some areas remain demo-backed or integration placeholders — see **`Hackathon_Details.md`** (repo priorities) and code under `src/views/` / `src/integrations/`.

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

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Install dependencies:
   - `npm install`
2. Create local environment file:
   - copy `.env.example` to `.env.local`
3. Set environment variables in `.env.local` (see `.env.example` for all options). For Gemini + Copilot you need at least `GEMINI_API_KEY` (or `GOOGLE_API_KEY`).
4. Start development server:
   - `npm run dev`
5. Open:
   - [http://localhost:3000](http://localhost:3000)

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

## Scripts

- `npm run dev` - run local dev server on port `3000`
- `npm run build` - create production build
- `npm run preview` - preview production build
- `npm run lint` - TypeScript type check (`tsc --noEmit`)
- `npm run clean` - remove `dist` directory

## Project Structure

- `src/App.tsx` — main shell, auth gate, navigation, and view wiring
- `src/navigation.ts` — `AppPage` route keys
- `src/domain/` — chama state, reducer, React context (`chamaReducer.ts`, `chamaContext.tsx`, penalties, M-Pesa helpers)
- `src/views/` — page views (dashboard, cases, M-Pesa, etc.)
- `src/seed/lesomDynamics.ts` — demo / seed dataset for hackathon demo mode
- `src/components/` — shared UI (e.g. Chama Copilot)
- `src/integrations/` — third-party integration helpers (e.g. Nobuk, PayHero)
- `src/types.ts` — shared domain types
- `src/data.ts` — additional mock / static data where used
- `src/main.tsx` — app bootstrap
- `src/index.css` — global styles
- `Hackathon_Details.md` — hackathon brief, deadlines, prizes, IP, and repo priorities
- `HACKATHON_PROPOSAL.md` — problem / solution / impact write-up for judges
- `docs/ChamaConnect-Hackathon-Source-Code-Submission-Terms-and-Conditions.pdf` — **binding** submission terms
- `docs/README.md` — index of official hackathon PDF(s)

## Planned Next Increments

- Integrate real API/data layer for all transaction modules
- Implement full CRUD for members, contributions, loans, expenses, goals
- Add validation and role-aware permissions for sensitive flows
- Add record/audit metadata for dispute-prone actions (fines/appeals)
- Add test coverage for critical finance and record workflows

## Submission Readiness Checklist

- [ ] Final features are clearly tied to challenge focus area(s)
- [ ] Repository is public and documentation is complete
- [ ] No secrets are committed (`.env.local` is ignored)
- [ ] Dependencies are fully declared in `package.json`
- [ ] Build and type-check pass (`npm run build` and `npm run lint`)
- [ ] Demo evidence (screenshots/video + walkthrough notes) is attached
- [ ] Proposal/writeup is finalized (`HACKATHON_PROPOSAL.md`)

## Compliance Notes

- Do not commit credentials; use `.env.local` (gitignored) only.
- **Binding contract:** the PDF linked in the table above (and [`docs/README.md`](docs/README.md)). Markdown summaries do not replace **§§2–9** of the PDF.
- Unrelated third parties: see `NOTICE` and `LICENSE` — no assumption of a permissive OSS license for independent commercial use.
