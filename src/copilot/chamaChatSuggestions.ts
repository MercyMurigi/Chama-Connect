export const CHAMA_COPILOT_SUGGESTIONS = [
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
  {
    title: 'Group plan',
    message: 'Help me draft a simple monthly meeting agenda for our chama treasurer report and approvals.',
  },
  {
    title: 'Writing help',
    message: 'Draft a short SMS to remind members about the upcoming contribution deadline in a polite tone.',
  },
] as const;

export type ChamaCopilotSuggestion = (typeof CHAMA_COPILOT_SUGGESTIONS)[number];
