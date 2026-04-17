import { v4 as uuidv4 } from 'uuid';
import type { ChamaAppState, Contribution, Fine, NotificationItem } from '../types';

function parseIso(d: string) {
  return new Date(d + (d.length <= 10 ? 'T23:59:59' : '')).getTime();
}

export type PenaltyResult = {
  fines: Fine[];
  notifications: NotificationItem[];
};

/** Append new fines for pending contributions past due + grace. Idempotent per member+dueDate. */
export function evaluateLatePenalties(state: ChamaAppState, asOf: Date = new Date()): PenaltyResult {
  const { fineRules, contributions, fines, members } = state;
  const graceMs = fineRules.graceHoursAfterDue * 3600 * 1000;
  const asOfMs = asOf.getTime();
  const nextFines = [...fines];
  const notifications: NotificationItem[] = [];
  const existingKeys = new Set(
    fines.map((f) => `${f.memberId}|${f.reason}`),
  );

  const pending = contributions.filter((c) => c.status === 'Pending' && c.dueDate);
  for (const c of pending) {
    const dueMs = parseIso(c.dueDate!);
    if (asOfMs <= dueMs + graceMs) continue;
    const daysLate = Math.min(
      fineRules.maxLateDays,
      Math.ceil((asOfMs - (dueMs + graceMs)) / (24 * 3600 * 1000)),
    );
    if (daysLate <= 0) continue;
    const amount = Math.min(
      daysLate * fineRules.amountPerDayLate,
      fineRules.maxLateDays * fineRules.amountPerDayLate,
    );
    const reason = `Late contribution (${daysLate}d, due ${c.dueDate})`;
    const key = `${c.memberId}|${reason}`;
    if (existingKeys.has(key)) continue;
    existingKeys.add(key);
    const id = `fine-${uuidv4()}`;
    nextFines.push({
      id,
      memberId: c.memberId,
      memberName: c.memberName,
      amount,
      reason,
      date: asOf.toISOString().slice(0, 10),
      status: 'Pending',
      daysLate,
    });
    notifications.push({
      id: uuidv4(),
      at: asOf.toISOString(),
      title: 'Fine assessed',
      body: `${c.memberName}: ${reason} — Ksh ${amount.toLocaleString('en-KE')}`,
      read: false,
      kind: 'fine',
    });
  }

  return { fines: nextFines, notifications };
}

export function contributionTotals(contributions: Contribution[]) {
  const paid = contributions.filter((c) => c.status === 'Paid');
  return paid.reduce((s, c) => s + c.amount, 0);
}
