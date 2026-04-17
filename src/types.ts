export interface Chama {
  id: string;
  name: string;
  memberCount: number;
  totalCapital: number;
  lastActivity: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export type MemberRole = 'Chairperson' | 'Treasurer' | 'Secretary' | 'Member' | 'ChamaAdmin';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  joinedDate: string;
  avatar?: string;
  phone?: string;
}

export interface Contribution {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  type: 'Monthly' | 'Special' | 'Fines';
  status: 'Paid' | 'Pending';
  /** ISO date — expected payment for penalty engine */
  dueDate?: string;
}

export interface Loan {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  interest: number;
  issuedDate: string;
  dueDate: string;
  status: 'Active' | 'Paid' | 'Overdue';
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
  description: string;
}

export interface Fine {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  reason: string;
  date: string;
  status: 'Paid' | 'Pending' | 'Disputed';
  relatedCaseId?: string;
  /** days late used for calculation */
  daysLate?: number;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

export interface Share {
  memberId: string;
  memberName: string;
  sharesOwned: number;
  totalValue: number;
}

export type CaseStatus = 'open' | 'in_review' | 'resolved' | 'escalated';

export type CaseCategory =
  | 'missed_contribution'
  | 'loan_dispute'
  | 'member_complaint'
  | 'fine_dispute'
  | 'mpesa_mismatch';

export interface CaseEvidence {
  id: string;
  name: string;
  uploadedAt: string;
  /** blob: or placeholder */
  url: string;
  uploadedBy: string;
}

export type CaseEventType =
  | 'created'
  | 'status_change'
  | 'comment'
  | 'assignment'
  | 'evidence_added'
  | 'resolution_suggested';

export interface CaseEvent {
  id: string;
  caseId: string;
  at: string;
  actorId: string;
  actorName: string;
  type: CaseEventType;
  message: string;
  meta?: Record<string, string | number | boolean | undefined>;
}

export interface ChamaCase {
  id: string;
  groupId: string;
  title: string;
  description: string;
  category: CaseCategory;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdByName: string;
  assignedReviewerId?: string;
  assignedReviewerName?: string;
  events: CaseEvent[];
  evidence: CaseEvidence[];
  resolutionNotes?: string;
  /** Last ICDMS AI suggestion text (refreshed on demand) */
  aiSuggestion?: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId?: string;
  snapshot: string;
}

export interface FineRule {
  amountPerDayLate: number;
  maxLateDays: number;
  graceHoursAfterDue: number;
  /** legacy % from UI — optional top-up */
  finePercentage: number;
}

export type MpesaMatchStatus = 'matched' | 'unmatched' | 'disputed';

export interface MpesaTransaction {
  id: string;
  receipt: string;
  amount: number;
  phone: string;
  timestamp: string;
  matchedMemberId?: string;
  matchedMemberName?: string;
  status: MpesaMatchStatus;
  narrative?: string;
}

export type NotificationKind = 'info' | 'success' | 'warning' | 'fine' | 'mpesa';

export interface NotificationItem {
  id: string;
  at: string;
  title: string;
  body: string;
  read: boolean;
  kind: NotificationKind;
}

export interface SmsOutboxEntry {
  id: string;
  at: string;
  toPhone: string;
  body: string;
  status: 'simulated_sent' | 'queued';
}

export type ChamaKind = 'SACCO' | 'Investment Group' | 'Welfare Club';

export interface GroupRules {
  constitutionSnippet: string;
  loanPolicySnippet: string;
  contributionPolicySnippet: string;
  /** Group model shown in settings */
  chamaKind: ChamaKind;
  /** Last constitution file picked in-browser (name only; demo) */
  constitutionFileName?: string;
}

export interface GroupSchedule {
  contributionFrequency: 'Once per Month' | 'Weekly' | 'Bi-Weekly' | 'Quarterly';
  meetingDay: string;
  meetingTime: string;
  monthlyContributionAmount: number;
}

export interface IntegrationToggles {
  nobukConnected: boolean;
  payheroConnected: boolean;
}

export interface MonthlyTrendPoint {
  month: string;
  contributions: number;
  expenses: number;
}

export interface ChamaAppState {
  groupId: string;
  groupName: string;
  schedule: GroupSchedule;
  groupRules: GroupRules;
  fineRules: FineRule;
  members: Member[];
  contributions: Contribution[];
  loans: Loan[];
  expenses: Expense[];
  income: Income[];
  fines: Fine[];
  goals: Goal[];
  shares: Share[];
  chamas: Chama[];
  cases: ChamaCase[];
  auditLog: AuditEntry[];
  mpesaTransactions: MpesaTransaction[];
  notifications: NotificationItem[];
  smsOutbox: SmsOutboxEntry[];
  integrations: IntegrationToggles;
  monthlyTrend: MonthlyTrendPoint[];
}
