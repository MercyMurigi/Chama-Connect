import { useMemo } from 'react';
import { CopilotKit, useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotSidebar } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { useChama } from '@/src/domain/chamaContext';

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

  useCopilotReadable(
    {
      description: 'Live chama data for grounded answers (English/Kiswahili)',
      value: snapshot,
    },
    [snapshot],
  );

  useCopilotAction({
    name: 'record_contribution',
    description: 'Record a paid monthly contribution for a member by id (e.g. m1)',
    parameters: [
      { name: 'memberId', type: 'string', description: 'Member id from roster', required: true },
    ],
    handler: async ({ memberId }) => {
      dispatch({ type: 'RECORD_CONTRIBUTION', memberId: String(memberId) });
      return 'Contribution recorded.';
    },
  });

  useCopilotAction({
    name: 'run_penalty_engine',
    description: 'Run late-payment penalty evaluation for the group',
    parameters: [],
    handler: async () => {
      dispatch({ type: 'RUN_PENALTIES' });
      return 'Penalty engine executed.';
    },
  });

  useCopilotAction({
    name: 'simulate_mpesa',
    description: 'Simulate an M-Pesa webhook (amount + phone 254…)',
    parameters: [
      { name: 'amount', type: 'string', description: 'Amount in Ksh (numeric string)', required: true },
      { name: 'phone', type: 'string', description: 'MSISDN e.g. 254712000004', required: true },
    ],
    handler: async ({ amount, phone }) => {
      dispatch({ type: 'SIMULATE_MPESA', amount: Number(String(amount).replace(/,/g, '')), phone: String(phone) });
      return 'M-Pesa simulation applied.';
    },
  });

  return (
    <CopilotSidebar
      defaultOpen={false}
      clickOutsideToClose
      labels={{
        title: 'Chama AI Advisor',
      }}
      instructions="Use only numbers from readable context. Support Kiswahili. For legal matters, remind users to verify with the group constitution."
    />
  );
}

export function ChamaCopilotProvider({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="default" showDevConsole={false}>
      <ChamaCopilotContext />
      {children}
    </CopilotKit>
  );
}
