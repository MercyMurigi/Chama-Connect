import type { LucideIcon } from 'lucide-react';
import {
  ChartNetworkIcon,
  ImageIcon,
  MapIcon,
  PenToolIcon,
  ScanTextIcon,
  SparklesIcon,
} from 'lucide-react';

export type ChamaCopilotPrompt = {
  title: string;
  message: string;
  badgeLabel: string;
  icon: LucideIcon;
  iconClassName: string;
};

export const CHAMA_COPILOT_PROMPTS = [
  {
    title: 'Finance snapshot',
    message:
      'Summarize total paid contributions, income, and expenses for this chama in plain language (English or Kiswahili).',
    badgeLabel: 'Finance snapshot',
    icon: ImageIcon,
    iconClassName: 'text-blue-500',
  },
  {
    title: 'Contribution help',
    message: 'Which members still have pending monthly contributions, and what amounts are due?',
    badgeLabel: 'Contribution help',
    icon: ChartNetworkIcon,
    iconClassName: 'text-orange-500',
  },
  {
    title: 'Run penalties',
    message: 'Run the late-payment penalty evaluation and tell me what changed in the fines list.',
    badgeLabel: 'Run penalties',
    icon: MapIcon,
    iconClassName: 'text-green-500',
  },
  {
    title: 'M-Pesa simulator',
    message: 'How do I simulate an M-Pesa payment for amount 5000 and phone 254712000004?',
    badgeLabel: 'M-Pesa help',
    icon: ScanTextIcon,
    iconClassName: 'text-pink-500',
  },
  {
    title: 'Loans & fines',
    message: 'List open loans and any pending fines, with member names and amounts.',
    badgeLabel: 'Loans & fines',
    icon: PenToolIcon,
    iconClassName: 'text-yellow-500',
  },
  {
    title: 'Group rules',
    message: 'Explain the current group rules (contributions, fines, loans) in simple Kiswahili.',
    badgeLabel: 'Group rules',
    icon: SparklesIcon,
    iconClassName: 'text-purple-500',
  },
] as const satisfies readonly ChamaCopilotPrompt[];

export const CHAMA_COPILOT_SUGGESTIONS_FOR_CONFIG = CHAMA_COPILOT_PROMPTS.map(({ title, message }) => ({
  title,
  message,
}));
