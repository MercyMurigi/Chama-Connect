import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Calendar,
  CreditCard,
  Flag,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useChama } from '@/src/domain/chamaContext';
import type { AppPage } from '@/src/navigation';
import type { ChamaAppState, Member } from '@/src/types';
import { formatKsh } from '@/src/lib/format';
import { cn } from '@/lib/utils';

const DAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

function nextDueDates(meetingDay: string, count: number): string[] {
  const target = DAY_INDEX[meetingDay] ?? 6;
  const out: string[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  for (let step = 0; step < 400 && out.length < count; step++) {
    if (d.getDay() === target) out.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function avgMonthlyContributions(state: ChamaAppState) {
  const byMonth = new Map<string, number>();
  state.contributions.forEach((c) => {
    if (c.status !== 'Paid') return;
    const k = c.date.slice(0, 7);
    byMonth.set(k, (byMonth.get(k) ?? 0) + c.amount);
  });
  const vals = [...byMonth.values()].slice(-3);
  if (!vals.length) return state.schedule.monthlyContributionAmount * state.members.length;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function memberHealth(m: Member, state: ChamaAppState): number {
  const mine = state.contributions.filter((c) => c.memberId === m.id);
  const monthly = mine.filter((c) => c.type === 'Monthly');
  const paid = monthly.filter((c) => c.status === 'Paid').length;
  const total = Math.max(monthly.length, 1);
  let score = Math.round((paid / total) * 72);
  const overdue = state.loans.some((l) => l.memberId === m.id && l.status === 'Overdue');
  if (overdue) score -= 18;
  const pendingFine = state.fines.some((f) => f.memberId === m.id && f.status === 'Pending');
  if (pendingFine) score -= 10;
  return Math.max(0, Math.min(100, score));
}

function fallbackMonthlySummary(state: ChamaAppState): string {
  const paid = state.contributions.filter((c) => c.status === 'Paid');
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const key = lastMonth.toISOString().slice(0, 7);
  const thisKey = new Date().toISOString().slice(0, 7);
  const prev = paid.filter((c) => c.date.startsWith(key)).reduce((s, c) => s + c.amount, 0);
  const cur = paid.filter((c) => c.date.startsWith(thisKey)).reduce((s, c) => s + c.amount, 0);
  const growth = prev > 0 ? Math.round(((cur - prev) / prev) * 100) : 12;
  const missed = state.members.filter((mem) => {
    const pend = state.contributions.filter(
      (c) => c.memberId === mem.id && c.status === 'Pending' && c.type === 'Monthly',
    );
    return pend.length >= 2;
  }).length;
  return `Your chama grew about ${growth}% this month (demo projection). ${missed} member(s) have 2+ pending monthly contributions. Net paid-in this cycle: ${formatKsh(cur || prev)}.`;
}

function icdmsStats(state: ChamaAppState) {
  const open = state.cases.filter((c) => c.status === 'open' || c.status === 'in_review').length;
  const resolved = state.cases.filter((c) => c.status === 'resolved');
  let avgDays = 0;
  if (resolved.length) {
    const days = resolved.map((c) => {
      const start = new Date(c.createdAt).getTime();
      const end = new Date(c.updatedAt).getTime();
      return Math.max(1, (end - start) / (86400000));
    });
    avgDays = Math.round(days.reduce((a, b) => a + b, 0) / days.length);
  }
  const load = state.cases.filter((c) => c.assignedReviewerId === 'm1' && c.status !== 'resolved').length;
  return { open, avgDays, load };
}

export function DashboardView({ onNavigate }: { onNavigate: (p: AppPage) => void }) {
  const { state, dispatch } = useChama();
  const [summary, setSummary] = useState<string>(() => fallbackMonthlySummary(state));
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [contribOpen, setContribOpen] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false);
  const [memberId, setMemberId] = useState(state.members[0]?.id ?? '');
  const [loanMemberId, setLoanMemberId] = useState(state.members[0]?.id ?? '');
  const [loanAmount, setLoanAmount] = useState('25000');

  const totalContrib = useMemo(
    () => state.contributions.filter((c) => c.status === 'Paid').reduce((s, c) => s + c.amount, 0),
    [state.contributions],
  );
  const totalIncome = useMemo(() => state.income.reduce((s, i) => s + i.amount, 0), [state.income]);
  const totalExpense = useMemo(() => state.expenses.reduce((s, e) => s + e.amount, 0), [state.expenses]);

  const chartData = useMemo(() => {
    const t = state.monthlyTrend.length
      ? state.monthlyTrend
      : [{ month: '—', contributions: 0, expenses: 0 }];
    return t.map((row) => ({
      ...row,
      peer: Math.round(row.contributions * 0.88),
    }));
  }, [state.monthlyTrend]);

  const healthRows = useMemo(() => {
    return [...state.members]
      .map((m) => ({ m, score: memberHealth(m, state) }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);
  }, [state.members, state.contributions, state.loans, state.fines]);

  const dues = useMemo(() => nextDueDates(state.schedule.meetingDay, 6), [state.schedule.meetingDay]);
  const avgMo = useMemo(() => avgMonthlyContributions(state), [state]);
  const stats = useMemo(() => icdmsStats(state), [state.cases]);

  const refreshSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await fetch('/api/llm/monthly-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupName: state.groupName,
          totals: { totalContrib, totalIncome, totalExpense },
          memberCount: state.members.length,
          openCases: stats.open,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { summary?: string };
        if (data.summary) setSummary(data.summary);
        else setSummary(fallbackMonthlySummary(state));
      } else setSummary(fallbackMonthlySummary(state));
    } catch {
      setSummary(fallbackMonthlySummary(state));
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[32px] font-bold text-[#111827] tracking-tight">Welcome back, Kevin</h1>
          <p className="text-neutral-500 text-sm">Here's what's happening with your chama</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="h-10 border-neutral-200 font-semibold text-sm"
            onClick={() => onNavigate('cases')}
          >
            <Flag className="w-4 h-4 mr-2 text-amber-600" />
            Cases ({stats.open} open)
          </Button>
          <Button className="h-10 bg-[#047857] hover:bg-[#065f46] text-white font-semibold text-sm" onClick={() => setContribOpen(true)}>
            <Zap className="w-4 h-4 mr-2" />
            Record contribution
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Contributions" value={formatKsh(totalContrib)} icon={<CreditCard className="w-5 h-5" />} color="text-emerald-600" />
        <StatCard label="Income Analysis" value={formatKsh(totalIncome)} icon={<TrendingUp className="w-5 h-5" />} color="text-emerald-600" />
        <StatCard label="Expense Analysis" value={formatKsh(totalExpense)} icon={<TrendingUp className="w-5 h-5 rotate-45" />} color="text-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-100 p-8 shadow-sm">
            <h3 className="text-[13px] font-bold text-neutral-900 mb-6 uppercase tracking-wider">Contribution trend</h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-100" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} width={44} />
                  <Tooltip formatter={(v: number) => formatKsh(v)} />
                  <Area type="monotone" dataKey="contributions" name="Contributions" stroke="#059669" fill="url(#fillC)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-100 p-8 shadow-sm">
            <h3 className="text-[13px] font-bold text-neutral-900 mb-6 uppercase tracking-wider">Group comparison (vs demo peer)</h3>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-100" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} width={44} />
                  <Tooltip formatter={(v: number) => formatKsh(v)} />
                  <Bar dataKey="contributions" name="LESOM" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="peer" name="Peer avg" fill="#93c5af" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-100 p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="text-[13px] font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                AI monthly summary
              </h3>
              <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-neutral-200" onClick={refreshSummary} disabled={summaryLoading}>
                {summaryLoading ? 'Refreshing…' : 'Refresh insight'}
              </Button>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed font-medium">{summary}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-100 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-neutral-900 mb-4 uppercase tracking-wider">ICDMS pulse</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between font-medium text-neutral-600">
                <span>Open + in review</span>
                <span className="font-bold text-neutral-900">{stats.open}</span>
              </div>
              <div className="flex justify-between font-medium text-neutral-600">
                <span>Avg. resolution (days)</span>
                <span className="font-bold text-neutral-900">{stats.avgDays || '—'}</span>
              </div>
              <div className="flex justify-between font-medium text-neutral-600">
                <span>Your assigned load</span>
                <span className="font-bold text-emerald-700">{stats.load}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-100 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-neutral-900 mb-4 uppercase tracking-wider">Quick actions</h3>
            <div className="flex flex-col gap-2">
              <Button className="justify-start h-10 bg-[#047857] hover:bg-[#065f46] text-white font-semibold text-sm" onClick={() => setContribOpen(true)}>
                Record contribution
              </Button>
              <Button variant="outline" className="justify-start h-10 border-neutral-200 font-semibold text-sm" onClick={() => setLoanOpen(true)}>
                Issue loan
              </Button>
              <Button variant="outline" className="justify-start h-10 border-neutral-200 font-semibold text-sm" onClick={() => onNavigate('cases')}>
                Flag case
              </Button>
              <Button variant="outline" className="justify-start h-10 border-neutral-200 font-semibold text-sm" onClick={() => onNavigate('mpesa')}>
                M-Pesa simulator
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-100 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-neutral-900 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              Upcoming payments
            </h3>
            <ul className="space-y-2 text-sm font-medium text-neutral-600">
              {dues.map((d) => (
                <li key={d} className="flex justify-between border-b border-neutral-50 pb-2 last:border-0">
                  <span>{d}</span>
                  <span className="text-emerald-700">{formatKsh(state.schedule.monthlyContributionAmount)}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-neutral-400 mt-3 font-medium">
              Based on {state.schedule.meetingDay} meetings · {state.schedule.contributionFrequency}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-neutral-100 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-neutral-900 mb-4 uppercase tracking-wider">Member health (lowest scores)</h3>
            <div className="space-y-3">
              {healthRows.map(({ m, score }) => (
                <div key={m.id}>
                  <div className="flex justify-between text-xs font-bold text-neutral-700 mb-1">
                    <span>{m.name}</span>
                    <span className={score < 55 ? 'text-rose-600' : 'text-emerald-700'}>{score}</span>
                  </div>
                  <Progress value={score} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-100 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-neutral-900 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-500" />
              Goals & projection
            </h3>
            <div className="space-y-5">
              {state.goals.map((g) => {
                const rem = Math.max(0, g.targetAmount - g.currentAmount);
                const months = avgMo > 0 ? Math.ceil(rem / avgMo) : null;
                const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                return (
                  <div key={g.id} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-neutral-900">
                      <span>{g.title}</span>
                      <span className="text-neutral-500">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                    <p className="text-[11px] text-neutral-500 font-medium leading-snug">
                      {months != null
                        ? `Projected completion ~${months} mo at current pace (${formatKsh(avgMo)}/mo avg).`
                        : 'Add more contribution history to project completion.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={contribOpen} onOpenChange={setContribOpen}>
        <DialogContent className="sm:max-w-md bg-white border-neutral-100">
          <DialogHeader>
            <DialogTitle className="text-neutral-900">Record contribution</DialogTitle>
            <DialogDescription>Creates a paid monthly contribution for the selected member.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase text-neutral-500">Member</Label>
            <select
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm font-medium bg-white"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            >
              {state.members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button
              className="bg-[#047857] hover:bg-[#065f46] text-white"
              onClick={() => {
                dispatch({ type: 'RECORD_CONTRIBUTION', memberId });
                setContribOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={loanOpen} onOpenChange={setLoanOpen}>
        <DialogContent className="sm:max-w-md bg-white border-neutral-100">
          <DialogHeader>
            <DialogTitle className="text-neutral-900">Issue loan</DialogTitle>
            <DialogDescription>Creates an active loan record (demo).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase text-neutral-500">Member</Label>
            <select
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm font-medium bg-white"
              value={loanMemberId}
              onChange={(e) => setLoanMemberId(e.target.value)}
            >
              {state.members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <Label className="text-xs font-bold uppercase text-neutral-500">Amount (Ksh)</Label>
            <input
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm font-medium"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              className="bg-[#047857] hover:bg-[#065f46] text-white"
              onClick={() => {
                const m = state.members.find((x) => x.id === loanMemberId);
                if (!m) return;
                const amt = Number(loanAmount.replace(/,/g, '')) || 0;
                const due = new Date();
                due.setMonth(due.getMonth() + 6);
                dispatch({
                  type: 'ADD_LOAN',
                  loan: {
                    memberId: m.id,
                    memberName: m.name,
                    amount: amt,
                    interest: 10,
                    issuedDate: new Date().toISOString().slice(0, 10),
                    dueDate: due.toISOString().slice(0, 10),
                    status: 'Active',
                  },
                });
                setLoanOpen(false);
              }}
            >
              Create loan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-100 flex flex-col justify-between h-[140px] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-neutral-500">{label}</span>
        <div className={cn(color)}>{icon}</div>
      </div>
      <div className="text-[28px] font-bold text-[#111827] tracking-tight">{value}</div>
    </div>
  );
}
