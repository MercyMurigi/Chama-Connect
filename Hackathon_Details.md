# Chama Connect Virtual Hackathon

This document captures the project-aligned hackathon brief for this repository.

<div align="center">
<img width="1200" height="auto" alt="Chama Connect Virtual Hackathon official announcement poster" src="./Chama-Connect_Announcement.jpeg" />
</div>

## Event Overview

- **Event:** Chama Connect Virtual Hackathon
- **Partners:** Salamander Tech Hub x Muiaa Ltd (Muiruri & Associates / Muiaa Labs)
- **Theme:** `ChamaConnect: Refactored - Scaling the Circle`
- **Tagline:** `build.test.improve.innovate`

## Hackathon Goal

Build meaningful improvements for **ChamaConnect** — the live platform at **chamaconnect.io** / **chamaconnect.co.ke** — for managing chama operations such as members, contributions, loans, finances, and related records.

> Do not run disruptive or harmful tests against production; follow **§5** of the [Official Submission Terms](docs/ChamaConnect-Hackathon-Source-Code-Submission-Terms-and-Conditions.pdf) (Computer Misuse and Cybercrimes Act, 2018).

## Core Focus Areas

1. **Feature Enhancement**
   - Add or improve user-facing functionality on ChamaConnect
   - Improve usability, workflows, and admin efficiency

2. **ICDMS Optimization**
   - Strengthen flows connected to the Integrated Case Data Management System
   - Improve structure, traceability, and handling of records/cases where applicable

## Delivery Expectations

- Functional implementation mapped to one or both focus areas
- Clean, maintainable code with clear project documentation
- Safe handling of data and environments (no exposed credentials)

## Submission Requirements

- Submit using a **public GitHub repository**
- Ensure submitted code is **original**
- Declare third-party dependencies through project manifests (for this project: `package.json`)
- Keep credentials and sensitive values out of the repository
- Avoid harmful testing behavior on live production platforms

## Timeline and Deadline

- **Announcement poster:** submission deadline **17 April 2026**
- **Official Submission Terms (PDF §7):** submissions by **Monday, 11:59 PM EAT**; judges’ decision final; appeals within **24 hours** to Muiaa technical lead (see PDF for exact wording)

If the poster date and **§7** ever appear to conflict, **follow the PDF and the latest instruction from organizers** and update this file once confirmed.

## Prize Pool

- **1st Place:** `$300`
- **2nd Place:** `$200`
- **3rd Place:** `$100`

Payout note from prior brief: prizes are paid within 14 days and may be subject to a 15% KRA withholding tax.

## IP and Licensing Note

The **official** position is in  
[`docs/ChamaConnect-Hackathon-Source-Code-Submission-Terms-and-Conditions.pdf`](docs/ChamaConnect-Hackathon-Source-Code-Submission-Terms-and-Conditions.pdf):

- **§2.1** — participants **irrevocably assign** IP in submitted source code, documentation, and assets to **Muiaa Ltd** and the broader community (in consideration of competing for prizes).
- **§2.2** — public GitHub for public benefit; Muiaa Ltd and the community may **modify, distribute, and commercialize** globally.
- **§2.3** — moral rights waived under the **Copyright Act of Kenya**; credit as **“Original Contributors”** where applicable.

Governing law and venue: **§9.1** — laws of **Kenya**; **exclusive jurisdiction** of **courts in Nairobi**.

## Repository Ownership and Use Terms (supplementary)

`REPOSITORY_TERMS.md`, `LICENSE`, `NOTICE`, and `CONTRIBUTOR_SIGN_OFF.md` explain how this **GitHub copy** relates to third parties and contributors. They do **not** replace or narrow **§2** of the PDF. If anything in markdown conflicts with the PDF, **the PDF wins**.

## Repo-Specific Implementation Priorities

To align this codebase with the hackathon objective, prioritize:

- Wiring real data/APIs into currently static dashboard modules
- Completing CRUD flows for members, contributions, loans, expenses, and goals
- Improving auditability and consistency for fines/appeals and settings workflows
- Tightening validation, error handling, and role-based behavior
- Adding test coverage for critical financial and record-management flows

If you use an external **PRD** (e.g. Next.js + Prisma + on-chain modules), keep **`docs/TECHNICAL_PROPOSAL.md`** updated so judges see a clear map between that spec and this repo’s shipped scope.

## Quick Reference

- Main project documentation: `README.md`
- Proposal / judge narrative: `HACKATHON_PROPOSAL.md`
- Technical proposal (export to PDF): `docs/TECHNICAL_PROPOSAL.md`
- Binding submission contract + PDF index: `docs/README.md`
- Convenience summary of PDF topics (subordinate to PDF): `REPOSITORY_TERMS.md`
- Contributor acceptance: `CONTRIBUTOR_SIGN_OFF.md`
- Current code entry point: `src/App.tsx`
- App routes / pages: `src/navigation.ts`
- Domain state and actions: `src/domain/` (e.g. `chamaReducer.ts`, `chamaContext.tsx`)
- Demo seed data: `src/seed/lesomDynamics.ts`
- Data models: `src/types.ts`
