import React, { useState } from 'react';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChama } from '@/src/domain/chamaContext';
import { formatKsh } from '@/src/lib/format';

export function MpesaView({ groupName, onBack }: { groupName: string; onBack: () => void }) {
  const { state, dispatch } = useChama();
  const [amount, setAmount] = useState(String(state.schedule.monthlyContributionAmount));
  const [phone, setPhone] = useState('254712000004');
  const [receipt, setReceipt] = useState('');

  return (
    <div className="animate-in fade-in duration-500 bg-[#F9FAFB] -m-8 p-8 min-h-[calc(100vh-64px)]">
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-[#047857] hover:underline text-sm font-medium mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to {groupName}
      </button>
      <h1 className="text-3xl font-bold text-[#111827] tracking-tight mb-2">M-Pesa reconciliation (simulated)</h1>
      <p className="text-neutral-500 text-sm font-medium mb-8 max-w-2xl">
        Live Safaricom integration is coming soon. Use this simulator to mimic STK/webhook callbacks; matches use amount + phone against member records.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        <div className="bg-white rounded-xl border border-neutral-100 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-neutral-900">Simulate webhook</h2>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-neutral-500">Amount (Ksh)</Label>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-neutral-500">Phone (254…)</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="254712000004" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-neutral-500">Receipt (optional)</Label>
            <Input value={receipt} onChange={(e) => setReceipt(e.target.value)} placeholder="Auto if empty" />
          </div>
          <Button
            className="w-full bg-[#047857] hover:bg-[#065f46] text-white font-bold"
            onClick={() => {
              const a = Number(amount.replace(/,/g, '')) || 0;
              dispatch({ type: 'SIMULATE_MPESA', amount: a, phone, receipt: receipt || undefined });
            }}
          >
            Apply simulation
          </Button>
          <p className="text-[11px] text-neutral-400 font-medium">Expected monthly amount: {formatKsh(state.schedule.monthlyContributionAmount)}</p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900">Recent transactions</h2>
            <RefreshCcw className="w-4 h-4 text-neutral-300" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] font-black uppercase text-neutral-400 border-b border-neutral-100">
                <tr>
                  <th className="py-2 pr-2">Receipt</th>
                  <th className="py-2 pr-2">Amount</th>
                  <th className="py-2 pr-2">Status</th>
                  <th className="py-2">Member</th>
                </tr>
              </thead>
              <tbody>
                {state.mpesaTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-neutral-50">
                    <td className="py-3 font-mono text-xs">{t.receipt}</td>
                    <td className="py-3 font-bold">{formatKsh(t.amount)}</td>
                    <td className="py-3">
                      <span
                        className={
                          t.status === 'matched'
                            ? 'text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full'
                            : 'text-[10px] font-black uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full'
                        }
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 text-neutral-600">{t.matchedMemberName ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8 max-w-5xl bg-white rounded-xl border border-neutral-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-neutral-900 mb-4">SMS outbox (simulated)</h2>
        <ul className="space-y-3 text-sm">
          {state.smsOutbox.map((s) => (
            <li key={s.id} className="border-b border-neutral-50 pb-3 last:border-0">
              <span className="text-xs text-neutral-400 font-bold">{s.at}</span>
              <p className="font-semibold text-neutral-800 mt-1">{s.toPhone}</p>
              <p className="text-neutral-600">{s.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
