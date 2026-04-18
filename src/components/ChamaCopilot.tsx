import { useMemo } from 'react';
import {
  CopilotKit,
  CopilotSidebar,
  useAgentContext,
  useConfigureSuggestions,
  useFrontendTool,
} from '@copilotkit/react-core/v2';
import '@copilotkit/react-core/v2/styles.css';
import { z } from 'zod';
import { useChama } from '@/src/domain/chamaContext';

const CHAT_SUGGESTIONS = [
  {
    title: 'Finance snapshot',
    message:
      'Summarize total paid contributions, income, and expenses for this chama in plain language (English or Kiswahili).',
  },
  {
    title: 'Contribution help',
    message: 'Which members still have pending monthly contributions, and what amounts are due?',
  },
  {
    title: 'Run penalties',
    message: 'Run the late-payment penalty evaluation and tell me what changed in the fines list.',
  },
  {
    title: 'M-Pesa simulator',
    message: 'How do I simulate an M-Pesa payment for amount 5000 and phone 254712000004?',
  },
] as const;

function ChamaCopilotContext() {
  const { state, dispatch } = useChama();

  const snapshot = useMemo(
    () => ({
      groupName: state.groupName,
      members: state.members.map((m) => ({ id: m.id, name: m.name, role: m.role, phone: m.phone })),
      totals: {
        contributionsPaid: state.contributions.filter((c) => c.status === 'Paid').reduce((s, c) => s + c.amount, 0),
        income: state.income.reduce((s, i) => s + i.amount, 0),
        expenses: state.expenses.reduce((s, e) => s + e.amount, 0),
        finesPending: state.fines.filter((f) => f.status === 'Pending').length,
      },
      loans: state.loans.map((l) => ({ member: l.memberName, amount: l.amount, status: l.status })),
      openCases: state.cases.filter((c) => c.status === 'open' || c.status === 'in_review').length,
      monthlyContribution: state.schedule.monthlyContributionAmount,
      rules: state.groupRules,
    }),
    [state],
  );

  useAgentContext({
    description: 'Live chama data for grounded answers (English/Kiswahili)',
    value: snapshot,
  });

  useConfigureSuggestions(
    {
      suggestions: [...CHAT_SUGGESTIONS],
      available: 'before-first-message',
      consumerAgentId: 'default',
    },
    [],
  );

  useFrontendTool(
    {
      name: 'record_contribution',
      description: 'Record a paid monthly contribution for a member by id (e.g. m1)',
      parameters: z.object({
        memberId: z.string().describe('Member id from roster'),
      }),
      handler: async ({ memberId }) => {
        dispatch({ type: 'RECORD_CONTRIBUTION', memberId: String(memberId) });
        return 'Contribution recorded.';
      },
    },
    [dispatch],
  );

  useFrontendTool(
    {
      name: 'run_penalty_engine',
      description: 'Run late-payment penalty evaluation for the group',
      parameters: z.object({}),
      handler: async () => {
        dispatch({ type: 'RUN_PENALTIES' });
        return 'Penalty engine executed.';
      },
    },
    [dispatch],
  );

  useFrontendTool(
    {
      name: 'simulate_mpesa',
      description: 'Simulate an M-Pesa webhook (amount + phone 254…)',
      parameters: z.object({
        amount: z.string().describe('Amount in Ksh (numeric string)'),
        phone: z.string().describe('MSISDN e.g. 254712000004'),
      }),
      handler: async ({ amount, phone }) => {
        dispatch({
          type: 'SIMULATE_MPESA',
          amount: Number(String(amount).replace(/,/g, '')),
          phone: String(phone),
        });
        return 'M-Pesa simulation applied.';
      },
    },
    [dispatch],
  );

  return (
    <CopilotSidebar
      className="copilot-chama-connect"
      agentId="default"
      defaultOpen={false}
      clickOutsideToClose
      width={420}
      labels={{
        modalHeaderTitle: 'Chama AI Advisor',
        chatInputPlaceholder: 'Ask about contributions, fines, loans, or M-Pesa…',
      }}
      instructions="Use only numbers from readable context. Support Kiswahili. For legal matters, remind users to verify with the group constitution."
    />
  );
}

export function ChamaCopilotProvider({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" showDevConsole={false}>
      <ChamaCopilotContext />
      {children}
    </CopilotKit>
  );
}
