import { v4 as uuidv4 } from 'uuid';
import type {
  AuditEntry,
  Chama,
  ChamaAppState,
  ChamaCase,
  Contribution,
  Expense,
  Fine,
  Goal,
  Income,
  Loan,
  Member,
  MonthlyTrendPoint,
  MpesaTransaction,
  NotificationItem,
  Share,
} from '../types';

export const GROUP_ID = 'lesom-dynamics';
export const GROUP_NAME = 'LESOM Dynamics';

const WESTLANDS_ID = 'ch2';

const members: Member[] = [
  { id: 'm1', name: 'Kevin Isom', email: 'kevinisom9000@gmail.com', role: 'ChamaAdmin', joinedDate: '2023-06-01', phone: '+254758750620' },
  { id: 'm2', name: 'Wanjiku Muthoni', email: 'wanjiku@example.com', role: 'Chairperson', joinedDate: '2023-06-02', phone: '+254712000001' },
  { id: 'm3', name: 'Peter Otieno', email: 'peter@example.com', role: 'Treasurer', joinedDate: '2023-06-03', phone: '+254712000002' },
  { id: 'm4', name: 'Amina Hassan', email: 'amina@example.com', role: 'Secretary', joinedDate: '2023-06-04', phone: '+254712000003' },
  { id: 'm5', name: 'David Kimani', email: 'david@example.com', role: 'Member', joinedDate: '2023-07-01', phone: '+254712000004' },
  { id: 'm6', name: 'Grace Wambui', email: 'grace@example.com', role: 'Member', joinedDate: '2023-07-05', phone: '+254712000005' },
  { id: 'm7', name: 'James Omondi', email: 'james@example.com', role: 'Member', joinedDate: '2023-08-01', phone: '+254712000006' },
  { id: 'm8', name: 'Lucy Akinyi', email: 'lucy@example.com', role: 'Member', joinedDate: '2023-08-10', phone: '+254712000007' },
  { id: 'm9', name: 'Brian Mutua', email: 'brian@example.com', role: 'Member', joinedDate: '2023-09-01', phone: '+254712000008' },
  { id: 'm10', name: 'Esther Njeri', email: 'ester@example.com', role: 'Member', joinedDate: '2023-09-15', phone: '+254712000009' },
  { id: 'm11', name: 'Samuel Kipchoge', email: 'samuel@example.com', role: 'Member', joinedDate: '2023-10-01', phone: '+254712000010' },
  { id: 'm12', name: 'Mary Adhiambo', email: 'mary@example.com', role: 'Member', joinedDate: '2023-10-20', phone: '+254712000011' },
];

function monthIso(year: number, month0: number, day: number) {
  const d = new Date(year, month0, day);
  return d.toISOString().slice(0, 10);
}

function buildContributions(): Contribution[] {
  const list: Contribution[] = [];
  let id = 1;
  const monthly = 5000;
  for (let mo = 0; mo < 8; mo++) {
    const year = 2025;
    const month0 = 6 + mo;
    const due = monthIso(year, month0, 5);
    members.forEach((m, idx) => {
      const paid = mo < 6 || (mo === 6 && idx < 10) || (mo === 7 && idx < 8);
      const late = mo === 6 && idx >= 10;
      list.push({
        id: `ct${id++}`,
        memberId: m.id,
        memberName: m.name,
        amount: monthly,
        date: paid ? monthIso(year, month0, 6 + (idx % 4)) : monthIso(year, month0, 12),
        type: 'Monthly',
        status: paid ? 'Paid' : 'Pending',
        dueDate: due,
      });
    });
  }
  return list;
}

function buildTrendFromContributions(contributions: Contribution[]): MonthlyTrendPoint[] {
  const byMonth = new Map<string, { c: number; e: number }>();
  contributions.forEach((c) => {
    const key = c.date.slice(0, 7);
    if (!byMonth.has(key)) byMonth.set(key, { c: 0, e: 0 });
    const b = byMonth.get(key)!;
    if (c.status === 'Paid') b.c += c.amount;
  });
  const keys = [...byMonth.keys()].sort();
  return keys.map((k) => {
    const { c } = byMonth.get(k)!;
    return { month: k.slice(5), contributions: c, expenses: Math.round(c * 0.08) };
  });
}

const loans: Loan[] = [
  { id: 'l1', memberId: 'm5', memberName: 'David Kimani', amount: 45000, interest: 10, issuedDate: '2025-08-01', dueDate: '2026-02-01', status: 'Active' },
  { id: 'l2', memberId: 'm7', memberName: 'James Omondi', amount: 30000, interest: 10, issuedDate: '2025-05-10', dueDate: '2025-11-10', status: 'Overdue' },
  { id: 'l3', memberId: 'm8', memberName: 'Lucy Akinyi', amount: 20000, interest: 8, issuedDate: '2024-12-01', dueDate: '2025-06-01', status: 'Paid' },
];

const expenses: Expense[] = [
  { id: 'e1', category: 'Venue', amount: 3500, date: '2025-09-01', description: 'Monthly meeting venue' },
  { id: 'e2', category: 'Bank', amount: 1200, date: '2025-10-01', description: 'Account maintenance' },
  { id: 'e3', category: 'Welfare', amount: 8000, date: '2025-11-15', description: 'Member welfare support' },
];

const income: Income[] = [
  { id: 'i1', source: 'Loan interest', amount: 6200, date: '2025-10-28', description: 'Repayments interest pool' },
  { id: 'i2', source: 'Penalties', amount: 1800, date: '2025-11-05', description: 'Fines collected' },
];

const fines: Fine[] = [
  { id: 'f1', memberId: 'm7', memberName: 'James Omondi', amount: 400, reason: 'Late contribution (2 days)', date: '2025-11-06', status: 'Paid', daysLate: 2 },
  { id: 'f2', memberId: 'm9', memberName: 'Brian Mutua', amount: 600, reason: 'Late contribution (3 days)', date: '2025-12-02', status: 'Pending', daysLate: 3 },
];

const goals: Goal[] = [
  { id: 'g1', title: 'Commercial plot deposit', targetAmount: 2500000, currentAmount: 1180000, deadline: '2026-12-31', category: 'Asset' },
  { id: 'g2', title: 'Group emergency fund', targetAmount: 500000, currentAmount: 312000, deadline: '2026-06-30', category: 'Reserve' },
];

const shares: Share[] = members.slice(0, 8).map((m, i) => ({
  memberId: m.id,
  memberName: m.name,
  sharesOwned: 80 - i * 5,
  totalValue: (80 - i * 5) * 1000,
}));

const chamas: Chama[] = [
  { id: GROUP_ID, name: GROUP_NAME, memberCount: 12, totalCapital: 0, lastActivity: '1 hour ago', role: 'Admin', status: 'Active' },
  { id: WESTLANDS_ID, name: 'Westlands Real Estate Club', memberCount: 8, totalCapital: 5800000, lastActivity: '1 day ago', role: 'Member', status: 'Active' },
];

function seedCases(): ChamaCase[] {
  const now = new Date().toISOString();
  const c1: ChamaCase = {
    id: 'case1',
    groupId: GROUP_ID,
    title: 'Missed November contribution',
    description: 'Member claims M-Pesa sent but not reflected in ledger.',
    category: 'missed_contribution',
    status: 'in_review',
    createdAt: '2025-11-28T10:00:00.000Z',
    updatedAt: now,
    createdById: 'm9',
    createdByName: 'Brian Mutua',
    assignedReviewerId: 'm3',
    assignedReviewerName: 'Peter Otieno',
    evidence: [
      {
        id: 'ev1',
        name: 'M-Pesa SMS screenshot.pdf',
        uploadedAt: '2025-11-28T11:00:00.000Z',
        url: '#evidence-demo',
        uploadedBy: 'Brian Mutua',
      },
    ],
    events: [
      {
        id: 'evn1',
        caseId: 'case1',
        at: '2025-11-28T10:00:00.000Z',
        actorId: 'm9',
        actorName: 'Brian Mutua',
        type: 'created',
        message: 'Case opened: missed contribution dispute',
      },
      {
        id: 'evn2',
        caseId: 'case1',
        at: '2025-11-28T14:00:00.000Z',
        actorId: 'm2',
        actorName: 'Wanjiku Muthoni',
        type: 'assignment',
        message: 'Assigned to Peter Otieno for treasury review',
      },
      {
        id: 'evn3',
        caseId: 'case1',
        at: '2025-11-29T09:00:00.000Z',
        actorId: 'm3',
        actorName: 'Peter Otieno',
        type: 'comment',
        message: 'Requested official M-Pesa statement for Nov 27–30.',
      },
    ],
  };
  const c2: ChamaCase = {
    id: 'case2',
    groupId: GROUP_ID,
    title: 'Loan repayment schedule disagreement',
    description: 'Borrower disputes interest calculation on partial payment.',
    category: 'loan_dispute',
    status: 'open',
    createdAt: '2025-12-01T08:00:00.000Z',
    updatedAt: '2025-12-01T08:00:00.000Z',
    createdById: 'm7',
    createdByName: 'James Omondi',
    evidence: [],
    events: [
      {
        id: 'evn4',
        caseId: 'case2',
        at: '2025-12-01T08:00:00.000Z',
        actorId: 'm7',
        actorName: 'James Omondi',
        type: 'created',
        message: 'Case opened',
      },
    ],
  };
  const c3: ChamaCase = {
    id: 'case3',
    groupId: GROUP_ID,
    title: 'Resolved: meeting attendance fine',
    description: 'Fine waived after medical certificate provided.',
    category: 'member_complaint',
    status: 'resolved',
    createdAt: '2025-09-10T12:00:00.000Z',
    updatedAt: '2025-09-18T16:00:00.000Z',
    createdById: 'm6',
    createdByName: 'Grace Wambui',
    assignedReviewerId: 'm2',
    assignedReviewerName: 'Wanjiku Muthoni',
    resolutionNotes: 'Fine waived per welfare policy.',
    evidence: [],
    events: [
      {
        id: 'evn5',
        caseId: 'case3',
        at: '2025-09-10T12:00:00.000Z',
        actorId: 'm6',
        actorName: 'Grace Wambui',
        type: 'created',
        message: 'Appeal submitted',
      },
      {
        id: 'evn6',
        caseId: 'case3',
        at: '2025-09-18T16:00:00.000Z',
        actorId: 'm2',
        actorName: 'Wanjiku Muthoni',
        type: 'status_change',
        message: 'Marked resolved — fine waived',
        meta: { from: 'in_review', to: 'resolved' },
      },
    ],
  };
  return [c1, c2, c3];
}

const mpesaSeed: MpesaTransaction[] = [
  {
    id: 'mp1',
    receipt: 'QGH2ABCDEF',
    amount: 5000,
    phone: '254712000004',
    timestamp: '2025-11-06T14:22:00.000Z',
    matchedMemberId: 'm5',
    matchedMemberName: 'David Kimani',
    status: 'matched',
    narrative: 'NOV CONTRIBUTION',
  },
  {
    id: 'mp2',
    receipt: 'QGH2UNKNOWN',
    amount: 5000,
    phone: '254799999999',
    timestamp: '2025-11-07T09:10:00.000Z',
    status: 'unmatched',
    narrative: 'UNKNOWN PAYER',
  },
];

const notificationsSeed: NotificationItem[] = [
  {
    id: 'n1',
    at: new Date().toISOString(),
    title: 'Contribution received',
    body: 'David Kimani — Ksh 5,000 matched to November cycle.',
    read: false,
    kind: 'mpesa',
  },
  {
    id: 'n2',
    at: new Date().toISOString(),
    title: 'Case assigned',
    body: 'You are reviewing case: Missed November contribution',
    read: false,
    kind: 'info',
  },
];

function totalCapital(contributions: Contribution[], loans: Loan[], income: Income[], expenses: Expense[]) {
  const contrib = contributions.filter((c) => c.status === 'Paid').reduce((s, c) => s + c.amount, 0);
  const activeLoans = loans.filter((l) => l.status === 'Active' || l.status === 'Overdue').reduce((s, l) => s + l.amount, 0);
  const inc = income.reduce((s, i) => s + i.amount, 0);
  const exp = expenses.reduce((s, e) => s + e.amount, 0);
  return contrib + inc - exp - activeLoans * 0.3;
}

export function createLesomSeedState(): ChamaAppState {
  const contributions = buildContributions();
  const trend = buildTrendFromContributions(contributions);
  const capital = Math.max(0, Math.round(totalCapital(contributions, loans, income, expenses)));
  chamas[0] = { ...chamas[0], memberCount: members.length, totalCapital: capital };

  return {
    groupId: GROUP_ID,
    groupName: GROUP_NAME,
    schedule: {
      contributionFrequency: 'Once per Month',
      meetingDay: 'Saturday',
      meetingTime: '05:00 PM',
      monthlyContributionAmount: 5000,
    },
    groupRules: {
      constitutionSnippet:
        'Monthly contributions due by 5th. Late payment attracts fines per Fine Rules. Loans capped at 3x member contributions.',
      loanPolicySnippet: 'Active loans accrue 10% flat interest for 6-month term. Guarantor required above Ksh 40,000.',
      contributionPolicySnippet: 'Each member Ksh 5,000 monthly. Treasurer reconciles M-Pesa within 48 hours.',
      chamaKind: 'SACCO',
    },
    fineRules: {
      amountPerDayLate: 200,
      maxLateDays: 5,
      graceHoursAfterDue: 24,
      finePercentage: 5,
    },
    members,
    contributions,
    loans,
    expenses,
    income,
    fines,
    goals,
    shares,
    chamas,
    cases: seedCases(),
    auditLog: [
      {
        id: 'audit-seed-init',
        at: new Date().toISOString(),
        actorId: 'system',
        actorName: 'System',
        action: 'seed.initialized',
        entityType: 'group',
        entityId: GROUP_ID,
        snapshot: JSON.stringify({ groupName: GROUP_NAME }),
      },
    ],
    mpesaTransactions: mpesaSeed,
    notifications: notificationsSeed,
    smsOutbox: [
      {
        id: 'sms1',
        at: '2025-11-06T14:23:00.000Z',
        toPhone: '+254712000004',
        body: 'ChamaConnect 2.0: Your Ksh 5,000 contribution was received. Asante!',
        status: 'simulated_sent',
      },
    ],
    integrations: { nobukConnected: false, payheroConnected: false },
    monthlyTrend: trend.length ? trend : [{ month: '11', contributions: 55000, expenses: 4000 }],
  };
}

/**
 * Demo workspace switch: full LESOM seed for primary group; slimmer ledgers for other saved chamas.
 * Keeps `chamas` list from `current` when it already includes user-added rows.
 */
export function buildStateForActiveChama(current: ChamaAppState, chamaId: string): ChamaAppState {
  const lesom = createLesomSeedState();
  const mergedChamas = current.chamas.length >= lesom.chamas.length ? current.chamas : lesom.chamas;

  if (chamaId === GROUP_ID) {
    return { ...lesom, chamas: mergedChamas };
  }

  const meta = mergedChamas.find((c) => c.id === chamaId);
  const label = meta?.name ?? 'Chama';

  if (chamaId === WESTLANDS_ID) {
    return {
      ...lesom,
      groupId: WESTLANDS_ID,
      groupName: label,
      chamas: mergedChamas,
      schedule: {
        ...lesom.schedule,
        monthlyContributionAmount: 10000,
        meetingDay: 'Wednesday',
      },
      contributions: lesom.contributions.slice(0, 48),
      cases: [],
      fines: lesom.fines.slice(0, 1),
      goals: lesom.goals.slice(0, 1),
      auditLog: [
        {
          id: `aud-${uuidv4()}`,
          at: new Date().toISOString(),
          actorId: 'm1',
          actorName: 'Kevin Isom',
          action: 'workspace.opened',
          entityType: 'group',
          entityId: WESTLANDS_ID,
          snapshot: JSON.stringify({ groupName: label }),
        },
        ...lesom.auditLog,
      ],
    };
  }

  return {
    ...lesom,
    groupId: chamaId,
    groupName: label,
    chamas: mergedChamas,
    members: lesom.members.slice(0, 4),
    contributions: [],
    loans: [],
    expenses: [],
    income: [],
    fines: [],
    cases: [],
    goals: [],
    shares: lesom.shares.slice(0, 4).map((s, i) => ({ ...s, sharesOwned: i === 0 ? 120 : 40, totalValue: (i === 0 ? 120 : 40) * 1000 })),
    mpesaTransactions: [],
    notifications: [],
    smsOutbox: [],
    auditLog: [
      {
        id: `aud-${uuidv4()}`,
        at: new Date().toISOString(),
        actorId: 'm1',
        actorName: 'Kevin Isom',
        action: 'workspace.opened',
        entityType: 'group',
        entityId: chamaId,
        snapshot: JSON.stringify({ groupName: label }),
      },
    ],
    monthlyTrend: [{ month: '—', contributions: 0, expenses: 0 }],
  };
}
