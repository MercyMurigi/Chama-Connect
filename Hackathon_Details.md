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

Build meaningful improvements for ChamaConnect, a platform for managing chama operations such as members, contributions, loans, finances, and related records.

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

- **Announcement poster deadline:** `17th April, 2026`
- **Brief text variant in prior notes:** `Monday, 11:59 PM EAT`

If an official organizer channel provides a final authoritative cutoff, use that value for submission timing and keep this file updated.

## Prize Pool

- **1st Place:** `$300`
- **2nd Place:** `$200`
- **3rd Place:** `$100`

Payout note from prior brief: prizes are paid within 14 days and may be subject to a 15% KRA withholding tax.

## IP and Licensing Note

Based on the provided brief, submission implies an irrevocable transfer of IP rights to Muiaa Ltd and the community, while contributor attribution is retained as "Original Contributor."  
Confirm final legal language with official event terms before final submission.

## Repository Ownership and Use Terms

This repository adopts a conditional ownership and usage framework documented in `REPOSITORY_TERMS.md` (**governing law: Republic of Kenya**), together with `LICENSE` (all rights reserved), `NOTICE` (third-party clarity), and `CONTRIBUTOR_SIGN_OFF.md` (contributions).

- Ownership transfers to the ChamaConnect Team (Muiaa Ltd (Muiaa Labs) and/or Salamander Community) only if:
  1. this project is officially declared a hackathon winner; and
  2. the corresponding hackathon payout has been received.
- Before those two conditions are met, commercial use and private-benefit use are prohibited except limited non-commercial review/evaluation/internal development as defined in `REPOSITORY_TERMS.md`.

## Repo-Specific Implementation Priorities

To align this codebase with the hackathon objective, prioritize:

- Wiring real data/APIs into currently static dashboard modules
- Completing CRUD flows for members, contributions, loans, expenses, and goals
- Improving auditability and consistency for fines/appeals and settings workflows
- Tightening validation, error handling, and role-based behavior
- Adding test coverage for critical financial and record-management flows

## Quick Reference

- Main project documentation: `README.md`
- Current code entry point: `src/App.tsx`
- Data models: `src/types.ts`
