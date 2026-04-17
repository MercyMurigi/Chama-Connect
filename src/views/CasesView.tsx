import React, { useMemo, useState } from 'react';
import { ArrowLeft, Flag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useChama } from '@/src/domain/chamaContext';
import type { CaseStatus, ChamaCase } from '@/src/types';

const STATUS_LABEL: Record<CaseStatus, string> = {
  open: 'Open',
  in_review: 'In review',
  resolved: 'Resolved',
  escalated: 'Escalated',
};

export function CasesView({ groupName, onBack }: { groupName: string; onBack: () => void }) {
  const { state, dispatch } = useChama();
  const [selectedId, setSelectedId] = useState<string | null>(state.cases[0]?.id ?? null);
  const [comment, setComment] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const selected = useMemo(() => state.cases.find((c) => c.id === selectedId) ?? null, [state.cases, selectedId]);

  const suggest = async (c: ChamaCase) => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/llm/case-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case: {
            title: c.title,
            description: c.description,
            category: c.category,
            status: c.status,
            events: c.events.slice(-8),
          },
          groupRules: state.groupRules,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { suggestion?: string };
        if (data.suggestion) dispatch({ type: 'SET_CASE_AI_SUGGESTION', caseId: c.id, text: data.suggestion });
        else
          dispatch({
            type: 'SET_CASE_AI_SUGGESTION',
            caseId: c.id,
            text: 'Treasurer: verify ledger vs M-Pesa statement. Chair: schedule a brief hearing. Default: allow 7 days for evidence upload.',
          });
      } else {
        dispatch({
          type: 'SET_CASE_AI_SUGGESTION',
          caseId: c.id,
          text: 'Verify constitution fine rules and loan policy sections. Request written statements from both parties.',
        });
      }
    } catch {
      dispatch({
        type: 'SET_CASE_AI_SUGGESTION',
        caseId: c.id,
        text: 'Offline suggestion: reconcile payments line-by-line with meeting minutes and group rules.',
      });
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 bg-[#F9FAFB] -m-8 p-8 min-h-[calc(100vh-64px)]">
      <div className="mb-8 space-y-4">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-[#047857] hover:underline text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to {groupName}
        </button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#111827] tracking-tight">ICDMS — Cases</h1>
            <p className="text-neutral-500 mt-1 text-sm font-medium">Structured disputes, evidence, and audit-backed actions</p>
          </div>
          <Button
            className="bg-[#047857] hover:bg-[#065f46] text-white font-semibold"
            onClick={() => {
              dispatch({
                type: 'ADD_CASE',
                draft: {
                  title: 'New member issue',
                  description: 'Raised from dashboard quick action.',
                  category: 'member_complaint',
                  status: 'open',
                  createdById: 'm1',
                  createdByName: 'Kevin Isom',
                },
              });
            }}
          >
            <Flag className="w-4 h-4 mr-2" />
            New case
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-2">
          {state.cases.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={cn(
                'w-full text-left rounded-xl border p-4 transition-all shadow-sm',
                selectedId === c.id ? 'border-emerald-300 bg-emerald-50/50' : 'border-neutral-100 bg-white hover:border-emerald-100',
              )}
            >
              <div className="flex justify-between gap-2">
                <span className="font-bold text-sm text-neutral-900">{c.title}</span>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                  {STATUS_LABEL[c.status]}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{c.description}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 bg-white rounded-xl border border-neutral-100 shadow-sm p-6 min-h-[480px]">
          {!selected ? (
            <p className="text-neutral-400 text-sm">Select a case</p>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{selected.title}</h2>
                <p className="text-sm text-neutral-600 mt-2 leading-relaxed">{selected.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                    {selected.category.replace(/_/g, ' ')}
                  </span>
                  {selected.assignedReviewerName && (
                    <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-1 rounded">
                      Reviewer: {selected.assignedReviewerName}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-bold border-neutral-200"
                  disabled={selected.status === 'open'}
                  onClick={() => dispatch({ type: 'UPDATE_CASE_STATUS', caseId: selected.id, status: 'open' })}
                >
                  Open
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-bold border-neutral-200"
                  onClick={() => dispatch({ type: 'UPDATE_CASE_STATUS', caseId: selected.id, status: 'in_review' })}
                >
                  In review
                </Button>
                <Button
                  size="sm"
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE_CASE_STATUS',
                      caseId: selected.id,
                      status: 'resolved',
                      note: 'Marked resolved from ICDMS.',
                    })
                  }
                >
                  Resolve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-bold border-neutral-200"
                  onClick={() => dispatch({ type: 'ASSIGN_CASE_REVIEWER', caseId: selected.id, reviewerId: 'm3', reviewerName: 'Peter Otieno' })}
                >
                  Assign Peter
                </Button>
              </div>

              <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[11px] font-black uppercase tracking-wider text-neutral-500">AI suggested next steps</h3>
                  <Button size="sm" variant="ghost" className="h-7 text-xs font-bold text-emerald-700" onClick={() => suggest(selected)} disabled={aiLoading}>
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    {aiLoading ? '…' : 'Refresh'}
                  </Button>
                </div>
                <p className="text-sm text-neutral-700 whitespace-pre-wrap">{selected.aiSuggestion ?? 'Click Refresh to generate a suggestion.'}</p>
              </div>

              <div>
                <h3 className="text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-3">Timeline</h3>
                <ul className="space-y-3 border-l-2 border-emerald-100 pl-4 ml-1">
                  {[...selected.events]
                    .sort((a, b) => a.at.localeCompare(b.at))
                    .map((e) => (
                      <li key={e.id} className="relative">
                        <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                        <p className="text-xs font-bold text-neutral-400">{new Date(e.at).toLocaleString()}</p>
                        <p className="text-sm font-semibold text-neutral-900">{e.actorName}</p>
                        <p className="text-sm text-neutral-600">{e.message}</p>
                      </li>
                    ))}
                </ul>
              </div>

              <div>
                <h3 className="text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-2">Evidence</h3>
                <ul className="text-sm text-neutral-600 space-y-1 mb-3">
                  {selected.evidence.length === 0 ? <li className="italic text-neutral-400">No files yet</li> : null}
                  {selected.evidence.map((ev) => (
                    <li key={ev.id}>
                      <a href={ev.url} className="text-emerald-700 font-semibold hover:underline">
                        {ev.name}
                      </a>
                      <span className="text-neutral-400 text-xs"> · {ev.uploadedBy}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-bold border-neutral-200 mb-4"
                  onClick={() =>
                    dispatch({
                      type: 'ADD_CASE_EVIDENCE',
                      caseId: selected.id,
                      name: `Attachment-${Date.now()}.txt`,
                      url: '#demo-evidence',
                    })
                  }
                >
                  Add demo evidence
                </Button>
                <Label className="text-xs font-bold uppercase text-neutral-500">Add comment</Label>
                <div className="flex gap-2 mt-1">
                  <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Timeline note…" className="text-sm" />
                  <Button
                    className="shrink-0 bg-[#047857] hover:bg-[#065f46] text-white"
                    onClick={() => {
                      if (!comment.trim()) return;
                      dispatch({ type: 'ADD_CASE_COMMENT', caseId: selected.id, message: comment.trim() });
                      setComment('');
                    }}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
