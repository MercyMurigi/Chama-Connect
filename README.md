# ChamaConnect Refactored (Hackathon Submission)

Hackathon project for improving ChamaConnect, a digital platform for managing chama operations (members, contributions, loans, expenses, goals, and governance flows).

Theme alignment: `ChamaConnect: Refactored - Scaling the Circle`

<div align="center">
<img width="1200" height="auto" alt="Chama Connect Virtual Hackathon official announcement poster" src="./Chama-Connect_Announcement.jpeg" />
</div>

---

## Why This Matters

Many chama groups still rely on fragmented manual workflows (spreadsheets, chat threads, verbal updates), which leads to:

- delayed financial visibility
- poor auditability for fines/appeals and member actions
- inconsistent operational records across meetings

This project focuses on creating a cleaner admin workspace that makes group operations easier to manage and scale.

## What This Repository Currently Delivers

The app currently provides a modern, responsive admin UI foundation with key chama modules:

- Dashboard
- My Chamas
- Members
- Contributions
- Income
- Loans
- Expenses
- Fines and Appeals
- Goals
- Share Capital
- Settings

Current status: UI and navigation flows are implemented; many modules are still in scaffold/placeholder state and are ready for API + business logic integration.

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
3. Set required environment variables in `.env.local`:
   - `GEMINI_API_KEY`
   - `APP_URL`
4. Start development server:
   - `npm run dev`
5. Open:
   - [http://localhost:3000](http://localhost:3000)

## Demo Walkthrough (for Judges)

Use this sequence to quickly evaluate the current implementation:

1. Open `Dashboard` to review the overall shell and financial summary card layout.
2. Open `My Chamas` for group-level overview and empty-state handling.
3. Open `Members` to inspect table design and admin identity state.
4. Open `Fines` and switch between `Fines`/`Appeals` tabs to view records flow structure.
5. Open `Share Capital` to inspect ownership and utilization views.
6. Open `Settings` to review grouped governance/configuration forms.

## Scripts

- `npm run dev` - run local dev server on port `3000`
- `npm run build` - create production build
- `npm run preview` - preview production build
- `npm run lint` - TypeScript type check (`tsc --noEmit`)
- `npm run clean` - remove `dist` directory

## Project Structure

- `src/App.tsx` - main shell, navigation, and page-level views
- `src/types.ts` - core domain model interfaces
- `src/data.ts` - mock datasets and sample records
- `src/main.tsx` - app bootstrap
- `src/index.css` - global styles
- `Hackathon_Details.md` - challenge brief context

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

- No credentials are committed in this repository.
- **Binding hackathon terms:** [`docs/ChamaConnect-Hackathon-Source-Code-Submission-Terms-and-Conditions.pdf`](docs/ChamaConnect-Hackathon-Source-Code-Submission-Terms-and-Conditions.pdf) (also indexed in [`docs/README.md`](docs/README.md)). This PDF governs participation, IP (**§2** irrevocable assignment to Muiaa Ltd and the community), privacy (**ODPA**), cyber conduct (**Computer Misuse and Cybercrimes Act, 2018**), prizes/KRA, deadlines, and **Kenya / exclusive Nairobi** jurisdiction (**§9.1**).
- **Supplementary repo clarity:** `REPOSITORY_TERMS.md`, `LICENSE`, `NOTICE`, `CONTRIBUTOR_SIGN_OFF.md` — subordinate to the PDF if anything differs.
- Unrelated third parties must not treat this repo as a blanket commercial OSS license; see `NOTICE` and `LICENSE`.
