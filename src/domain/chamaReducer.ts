import { v4 as uuidv4 } from 'uuid';
import { createLesomSeedState } from '../seed/lesomDynamics';
import type {
  CaseEvent,
  CaseStatus,
  ChamaAppState,
  ChamaCase,
  Contribution,
  FineRule,
  GroupRules,
  GroupSchedule,
  IntegrationToggles,
  Loan,
  NotificationItem,
} from '../types';
import {
  buildMismatchCase,
  matchMpesaToMember,
  mpesaMatchedNotification,
  mpesaSmsBody,
  normalizePhone,
} from './mpesa';
import { evaluateLatePenalties } from './penalties';

export const CURRENT_ACTOR = { id: 'm1', name: 'Kevin Isom' };

function pushAudit(
  state: ChamaAppState,
  action: string,
  entityType: string,
  entityId: string | undefined,
  snapshot: unknown,
): ChamaAppState {
  const entry = {
    id: `aud-${uuidv4()}`,
    at: new Date().toISOString(),
    actorId: CURRENT_ACTOR.id,
    actorName: CURRENT_ACTOR.name,
    action,
    entityType,
    entityId,
    snapshot: JSON.stringify(snapshot ?? {}),
  };
  return { ...state, auditLog: [...state.auditLog, entry] };
}

export type ChamaAction =
  | { type: 'REPLACE_STATE'; payload: ChamaAppState }
  | { type: 'RECORD_CONTRIBUTION'; memberId: string; amount?: number; date?: string }
  | { type: 'ADD_LOAN'; loan: Omit<Loan, 'id'> }
  | { type: 'ADD_CASE'; draft: Omit<ChamaCase, 'id' | 'events' | 'evidence' | 'createdAt' | 'updatedAt' | 'groupId'> }
  | { type: 'UPDATE_CASE_STATUS'; caseId: string; status: CaseStatus; note?: string }
  | { type: 'ASSIGN_CASE_REVIEWER'; caseId: string; reviewerId: string; reviewerName: string }
  | { type: 'ADD_CASE_COMMENT'; caseId: string; message: string }
  | { type: 'ADD_CASE_EVIDENCE'; caseId: string; name: string; url: string }
  | { type: 'SET_CASE_AI_SUGGESTION'; caseId: string; text: string }
  | { type: 'DISPUTE_FINE'; fineId: string }
  | { type: 'RUN_PENALTIES' }
  | { type: 'SIMULATE_MPESA'; amount: number; phone: string; receipt?: string }
  | { type: 'MARK_NOTIFICATIONS_READ' }
  | { type: 'SET_FINE_RULES'; rules: FineRule }
  | { type: 'SET_SCHEDULE'; schedule: GroupSchedule }
  | { type: 'SET_GROUP_RULES'; rules: GroupRules }
  | { type: 'SET_INTEGRATIONS'; integrations: IntegrationToggles };

export function chamaReducer(state: ChamaAppState, action: ChamaAction): ChamaAppState {
  switch (action.type) {
    case 'REPLACE_STATE':
      return action.payload;
    case 'RECORD_CONTRIBUTION': {
      const member = state.members.find((m) => m.id === action.memberId);
      if (!member) return state;
      const amount = action.amount ?? state.schedule.monthlyContributionAmount;
      const date = action.date ?? new Date().toISOString().slice(0, 10);
      const c: Contribution = {
        id: `ct-${uuidv4()}`,
        memberId: member.id,
        memberName: member.name,
        amount,
        date,
        type: 'Monthly',
        status: 'Paid',
        dueDate: date,
      };
      let next = {
        ...state,
        contributions: [...state.contributions, c],
      };
      next = pushAudit(next, 'contribution.recorded', 'contribution', c.id, c);
      return {
        ...next,
        notifications: [
          ...next.notifications,
          {
            id: uuidv4(),
            at: new Date().toISOString(),
            title: 'Contribution recorded',
            body: `${member.name} — Ksh ${amount.toLocaleString('en-KE')}`,
            read: false,
            kind: 'success',
          },
        ],
      };
    }
    case 'ADD_LOAN': {
      const loan: Loan = {
        ...action.loan,
        id: `l-${uuidv4()}`,
      };
      let next = { ...state, loans: [...state.loans, loan] };
      next = pushAudit(next, 'loan.created', 'loan', loan.id, loan);
      return next;
    }
    case 'ADD_CASE': {
      const now = new Date().toISOString();
      const id = `case-${uuidv4()}`;
      const newCase: ChamaCase = {
        ...action.draft,
        id,
        groupId: state.groupId,
        createdAt: now,
        updatedAt: now,
        events: [
          {
            id: `ev-${uuidv4()}`,
            caseId: id,
            at: now,
            actorId: CURRENT_ACTOR.id,
            actorName: CURRENT_ACTOR.name,
            type: 'created',
            message: `Case opened: ${action.draft.title}`,
          },
        ],
        evidence: [],
      };
      let next = { ...state, cases: [...state.cases, newCase] };
      next = pushAudit(next, 'case.created', 'case', id, { title: newCase.title });
      return next;
    }
    case 'UPDATE_CASE_STATUS': {
      const now = new Date().toISOString();
      const cases = state.cases.map((c) => {
        if (c.id !== action.caseId) return c;
        const ev: CaseEvent = {
          id: `ev-${uuidv4()}`,
          caseId: c.id,
          at: now,
          actorId: CURRENT_ACTOR.id,
          actorName: CURRENT_ACTOR.name,
          type: 'status_change',
          message: action.note ?? `Status → ${action.status}`,
          meta: { from: c.status, to: action.status },
        };
        return {
          ...c,
          status: action.status,
          updatedAt: now,
          events: [...c.events, ev],
          resolutionNotes: action.status === 'resolved' ? action.note ?? c.resolutionNotes : c.resolutionNotes,
        };
      });
      let next = { ...state, cases };
      next = pushAudit(next, 'case.status', 'case', action.caseId, { status: action.status });
      return next;
    }
    case 'ASSIGN_CASE_REVIEWER': {
      const now = new Date().toISOString();
      const cases = state.cases.map((c) => {
        if (c.id !== action.caseId) return c;
        const ev: CaseEvent = {
          id: `ev-${uuidv4()}`,
          caseId: c.id,
          at: now,
          actorId: CURRENT_ACTOR.id,
          actorName: CURRENT_ACTOR.name,
          type: 'assignment',
          message: `Assigned reviewer: ${action.reviewerName}`,
        };
        return {
          ...c,
          assignedReviewerId: action.reviewerId,
          assignedReviewerName: action.reviewerName,
          updatedAt: now,
          events: [...c.events, ev],
        };
      });
      let next = { ...state, cases };
      next = pushAudit(next, 'case.assign', 'case', action.caseId, { reviewerId: action.reviewerId });
      return next;
    }
    case 'ADD_CASE_COMMENT': {
      const now = new Date().toISOString();
      const cases = state.cases.map((c) => {
        if (c.id !== action.caseId) return c;
        const ev: CaseEvent = {
          id: `ev-${uuidv4()}`,
          caseId: c.id,
          at: now,
          actorId: CURRENT_ACTOR.id,
          actorName: CURRENT_ACTOR.name,
          type: 'comment',
          message: action.message,
        };
        return { ...c, updatedAt: now, events: [...c.events, ev] };
      });
      return pushAudit({ ...state, cases }, 'case.comment', 'case', action.caseId, { message: action.message });
    }
    case 'ADD_CASE_EVIDENCE': {
      const now = new Date().toISOString();
      const cases = state.cases.map((c) => {
        if (c.id !== action.caseId) return c;
        const evId = `evd-${uuidv4()}`;
        const evObj = {
          id: evId,
          name: action.name,
          uploadedAt: now,
          url: action.url,
          uploadedBy: CURRENT_ACTOR.name,
        };
        const ev: CaseEvent = {
          id: `ev-${uuidv4()}`,
          caseId: c.id,
          at: now,
          actorId: CURRENT_ACTOR.id,
          actorName: CURRENT_ACTOR.name,
          type: 'evidence_added',
          message: `Evidence: ${action.name}`,
        };
        return { ...c, updatedAt: now, evidence: [...c.evidence, evObj], events: [...c.events, ev] };
      });
      return pushAudit({ ...state, cases }, 'case.evidence', 'case', action.caseId, { name: action.name });
    }
    case 'SET_CASE_AI_SUGGESTION': {
      const cases = state.cases.map((c) =>
        c.id === action.caseId ? { ...c, aiSuggestion: action.text, updatedAt: new Date().toISOString() } : c,
      );
      return { ...state, cases };
    }
    case 'DISPUTE_FINE': {
      const fine = state.fines.find((f) => f.id === action.fineId);
      if (!fine) return state;
      const now = new Date().toISOString();
      const caseId = `case-${uuidv4()}`;
      const fines = state.fines.map((f) =>
        f.id === action.fineId ? { ...f, status: 'Disputed' as const, relatedCaseId: caseId } : f,
      );
      const newCase: ChamaCase = {
        id: caseId,
        groupId: state.groupId,
        title: `Fine dispute: ${fine.memberName}`,
        description: `Member disputes fine: ${fine.reason} (Ksh ${fine.amount})`,
        category: 'fine_dispute',
        status: 'open',
        createdAt: now,
        updatedAt: now,
        createdById: fine.memberId,
        createdByName: fine.memberName,
        evidence: [],
        events: [
          {
            id: `ev-${uuidv4()}`,
            caseId,
            at: now,
            actorId: CURRENT_ACTOR.id,
            actorName: CURRENT_ACTOR.name,
            type: 'created',
            message: 'Dispute logged from Fines view',
          },
        ],
      };
      let next = { ...state, fines, cases: [...state.cases, newCase] };
      next = pushAudit(next, 'fine.disputed', 'fine', fine.id, { caseId });
      return {
        ...next,
        notifications: [
          ...next.notifications,
          {
            id: uuidv4(),
            at: now,
            title: 'Fine disputed',
            body: `ICDMS case opened for ${fine.memberName}`,
            read: false,
            kind: 'warning',
          },
        ],
      };
    }
    case 'RUN_PENALTIES': {
      const { fines, notifications } = evaluateLatePenalties(state);
      let next = { ...state, fines, notifications: [...state.notifications, ...notifications] };
      next = pushAudit(next, 'penalties.evaluated', 'group', state.groupId, { newFines: fines.length - state.fines.length });
      return next;
    }
    case 'SIMULATE_MPESA': {
      const receipt = action.receipt || `SIM${Date.now().toString(36).toUpperCase()}`;
      const phone = normalizePhone(action.phone);
      const match = matchMpesaToMember(action.amount, action.phone, state.members, state.schedule.monthlyContributionAmount);
      const timestamp = new Date().toISOString();
      if (match.status === 'matched') {
        const { member } = match;
        const pending = [...state.contributions]
          .reverse()
          .find((c) => c.memberId === member.id && c.status === 'Pending');
        let contributions = state.contributions;
        if (pending) {
          contributions = contributions.map((c) =>
            c.id === pending.id
              ? { ...c, status: 'Paid' as const, amount: action.amount, date: timestamp.slice(0, 10) }
              : c,
          );
        } else {
          contributions = [
            ...contributions,
            {
              id: `ct-${uuidv4()}`,
              memberId: member.id,
              memberName: member.name,
              amount: action.amount,
              date: timestamp.slice(0, 10),
              type: 'Monthly' as const,
              status: 'Paid' as const,
              dueDate: timestamp.slice(0, 10),
            },
          ];
        }
        const tx = {
          id: `mp-${uuidv4()}`,
          receipt,
          amount: action.amount,
          phone,
          timestamp,
          matchedMemberId: member.id,
          matchedMemberName: member.name,
          status: 'matched' as const,
          narrative: 'SIMULATED',
        };
        let next: ChamaAppState = {
          ...state,
          contributions,
          mpesaTransactions: [tx, ...state.mpesaTransactions],
          notifications: [mpesaMatchedNotification(member.name, action.amount), ...state.notifications],
          smsOutbox: [
            {
              id: `sms-${uuidv4()}`,
              at: timestamp,
              toPhone: member.phone ?? `+${phone}`,
              body: mpesaSmsBody(member.name, action.amount),
              status: 'simulated_sent' as const,
            },
            ...state.smsOutbox,
          ],
        };
        next = pushAudit(next, 'mpesa.matched', 'mpesa', tx.id, tx);
        return next;
      }
      const tx: (typeof state.mpesaTransactions)[0] = {
        id: `mp-${uuidv4()}`,
        receipt,
        amount: action.amount,
        phone,
        timestamp,
        status: 'unmatched',
        narrative: 'SIMULATED',
      };
      const newCase = buildMismatchCase(tx, state.groupId, CURRENT_ACTOR.id, CURRENT_ACTOR.name);
      let next: ChamaAppState = {
        ...state,
        mpesaTransactions: [tx, ...state.mpesaTransactions],
        cases: [...state.cases, newCase],
        notifications: [
          {
            id: uuidv4(),
            at: timestamp,
            title: 'M-Pesa needs review',
            body: `Could not match ${receipt} — ICDMS case created.`,
            read: false,
            kind: 'warning',
          },
          ...state.notifications,
        ],
      };
      next = pushAudit(next, 'mpesa.unmatched', 'mpesa', tx.id, tx);
      return next;
    }
    case 'MARK_NOTIFICATIONS_READ': {
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };
    }
    case 'SET_FINE_RULES': {
      let next = { ...state, fineRules: action.rules };
      next = pushAudit(next, 'settings.fineRules', 'group', state.groupId, action.rules);
      return next;
    }
    case 'SET_SCHEDULE': {
      let next = { ...state, schedule: action.schedule };
      next = pushAudit(next, 'settings.schedule', 'group', state.groupId, action.schedule);
      return next;
    }
    case 'SET_GROUP_RULES': {
      let next = { ...state, groupRules: action.rules };
      next = pushAudit(next, 'settings.groupRules', 'group', state.groupId, action.rules);
      return next;
    }
    case 'SET_INTEGRATIONS': {
      return { ...state, integrations: action.integrations };
    }
    default:
      return state;
  }
}

export function getInitialPersistedState(): ChamaAppState {
  try {
    const demo = localStorage.getItem('chama-connect-demo') !== 'false';
    if (demo) return createLesomSeedState();
    const raw = localStorage.getItem('chama-connect-state');
    if (raw) return JSON.parse(raw) as ChamaAppState;
  } catch {
    /* ignore */
  }
  return createLesomSeedState();
}
