import { v4 as uuidv4 } from 'uuid';
import type { ChamaCase, Member, MpesaTransaction, NotificationItem } from '../types';

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  if (digits.startsWith('254')) return digits;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

export type MatchOutcome =
  | { status: 'matched'; member: Member }
  | { status: 'unmatched' };

export function matchMpesaToMember(
  amount: number,
  phone: string,
  members: Member[],
  expectedAmount?: number,
): MatchOutcome {
  const norm = normalizePhone(phone);
  const member = members.find((m) => m.phone && normalizePhone(m.phone) === norm);
  if (!member) return { status: 'unmatched' };
  if (expectedAmount != null && amount !== expectedAmount) return { status: 'unmatched' };
  return { status: 'matched', member };
}

export function buildMismatchCase(
  tx: MpesaTransaction,
  groupId: string,
  createdById: string,
  createdByName: string,
): ChamaCase {
  const now = new Date().toISOString();
  const caseId = `case-${uuidv4()}`;
  return {
    id: caseId,
    groupId,
    title: `M-Pesa mismatch: ${tx.receipt}`,
    description: `Amount Ksh ${tx.amount.toLocaleString('en-KE')} from ${tx.phone} could not be auto-matched.`,
    category: 'mpesa_mismatch',
    status: 'open',
    createdAt: now,
    updatedAt: now,
    createdById,
    createdByName,
    evidence: [],
    events: [
      {
        id: `ev-${uuidv4()}`,
        caseId,
        at: now,
        actorId: 'system',
        actorName: 'System',
        type: 'created',
        message: `Auto-created from M-Pesa receipt ${tx.receipt}`,
        meta: { mpesaId: tx.id },
      },
    ],
  };
}

export function mpesaMatchedNotification(memberName: string, amount: number): NotificationItem {
  return {
    id: uuidv4(),
    at: new Date().toISOString(),
    title: 'M-Pesa matched',
    body: `${memberName} — Ksh ${amount.toLocaleString('en-KE')} reconciled.`,
    read: false,
    kind: 'success',
  };
}

export function mpesaSmsBody(memberName: string, amount: number) {
  return `ChamaConnect 2.0: Hello ${memberName}, we received Ksh ${amount.toLocaleString('en-KE')}. Asante!`;
}
