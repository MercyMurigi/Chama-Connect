import { Member, Contribution, Loan, Chama, Expense, Income, Fine, Goal, Share } from './types';

export const MOCK_CHAMAS: Chama[] = [
  { id: 'ch1', name: 'Unity Investment Group', memberCount: 15, totalCapital: 2450000, lastActivity: '2 hours ago', role: 'Admin', status: 'Active' },
  { id: 'ch2', name: 'Westlands Real Estate Club', memberCount: 8, totalCapital: 5800000, lastActivity: '1 day ago', role: 'Member', status: 'Active' },
  { id: 'ch3', name: 'Family Savings Circle', memberCount: 5, totalCapital: 450000, lastActivity: '3 days ago', role: 'Treasurer', status: 'Active' },
];

export const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Chairperson', joinedDate: '2023-01-10', avatar: 'https://picsum.photos/seed/john/40/40' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Treasurer', joinedDate: '2023-01-15', avatar: 'https://picsum.photos/seed/jane/40/40' },
  { id: '3', name: 'Alice Johnson', email: 'alice@example.com', role: 'Secretary', joinedDate: '2023-02-01', avatar: 'https://picsum.photos/seed/alice/40/40' },
  { id: '4', name: 'Bob Brown', email: 'bob@example.com', role: 'Member', joinedDate: '2023-03-12', avatar: 'https://picsum.photos/seed/bob/40/40' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', role: 'Member', joinedDate: '2023-04-05', avatar: 'https://picsum.photos/seed/charlie/40/40' },
];

export const MOCK_CONTRIBUTIONS: Contribution[] = [
  { id: 'c1', memberId: '1', memberName: 'John Doe', amount: 5000, date: '2024-03-01', type: 'Monthly', status: 'Paid' },
  { id: 'c2', memberId: '2', memberName: 'Jane Smith', amount: 5000, date: '2024-03-01', type: 'Monthly', status: 'Paid' },
  { id: 'c3', memberId: '3', memberName: 'Alice Johnson', amount: 5000, date: '2024-03-02', type: 'Monthly', status: 'Pending' },
  { id: 'c4', memberId: '4', memberName: 'Bob Brown', amount: 5000, date: '2024-03-05', type: 'Monthly', status: 'Paid' },
  { id: 'c5', memberId: '5', memberName: 'Charlie Davis', amount: 5000, date: '2024-03-07', type: 'Monthly', status: 'Paid' },
];

export const MOCK_LOANS: Loan[] = [
  { id: 'l1', memberId: '4', memberName: 'Bob Brown', amount: 20000, interest: 10, issuedDate: '2024-01-15', dueDate: '2024-04-15', status: 'Active' },
  { id: 'l2', memberId: '5', memberName: 'Charlie Davis', amount: 15000, interest: 10, issuedDate: '2023-12-01', dueDate: '2024-03-01', status: 'Paid' },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', category: 'Registration', amount: 2000, date: '2024-01-05', description: 'Annual group registration' },
  { id: 'e2', category: 'Welfare', amount: 5000, date: '2024-02-10', description: 'Member visit contribution' },
];

export const MOCK_INCOME: Income[] = [
  { id: 'i1', source: 'Interest', amount: 1500, date: '2024-03-15', description: 'Interest from fixed deposit' },
  { id: 'i2', source: 'Donation', amount: 10000, date: '2024-03-20', description: 'Community support fund' },
];

export const MOCK_FINES: Fine[] = [
  { id: 'f1', memberId: '4', memberName: 'Bob Brown', amount: 200, reason: 'Late for meeting', date: '2024-03-10', status: 'Paid' },
  { id: 'f2', memberId: '3', memberName: 'Alice Johnson', amount: 500, reason: 'Late contribution', date: '2024-03-15', status: 'Pending' },
];

export const MOCK_GOALS: Goal[] = [
  { id: 'g1', title: 'Land Purchase', targetAmount: 2000000, currentAmount: 850000, deadline: '2025-12-31', category: 'Asset' },
  { id: 'g2', title: 'Welfare Reserve', targetAmount: 100000, currentAmount: 45000, deadline: '2024-12-31', category: 'Reserve' },
];

export const MOCK_SHARES: Share[] = [
  { memberId: '1', memberName: 'John Doe', sharesOwned: 120, totalValue: 120000 },
  { memberId: '2', memberName: 'Jane Smith', sharesOwned: 110, totalValue: 110000 },
];

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Sarah Kimani',
    role: 'Treasurer, Upendo Women Chama',
    content: 'ChamaConnect 2.0 transformed our records. We used to spend hours manually balancing books. Now, everything is instant.',
    avatar: 'https://picsum.photos/seed/sarah/100/100'
  },
  {
    id: 't2',
    name: 'David Otieno',
    role: 'Chairman, Westlands Investment',
    content: 'The loan tracking system is a lifesaver. No more disputes about interest or due dates. Highly professional.',
    avatar: 'https://picsum.photos/seed/david/100/100'
  },
  {
    id: 't3',
    name: 'Grace Wambui',
    role: 'Secretary, Green Valley Group',
    content: 'The mobile responsiveness is amazing. Our members can check their balances and performance from anywhere.',
    avatar: 'https://picsum.photos/seed/grace/100/100'
  }
];

export const PARTNERS = [
  { name: 'Equity Bank', logo: 'https://picsum.photos/seed/equity/200/80?grayscale' },
  { name: 'Safaricom', logo: 'https://picsum.photos/seed/safaricom/200/80?grayscale' },
  { name: 'KCB Bank', logo: 'https://picsum.photos/seed/kcb/200/80?grayscale' },
  { name: 'Co-op Bank', logo: 'https://picsum.photos/seed/coop/200/80?grayscale' },
];

export const MONTHLY_SUMMARY = [
  { month: 'Oct', contributions: 25000, loans: 10000 },
  { month: 'Nov', contributions: 28000, loans: 5000 },
  { month: 'Dec', contributions: 30000, loans: 15000 },
  { month: 'Jan', contributions: 32000, loans: 20000 },
  { month: 'Feb', contributions: 35000, loans: 8000 },
  { month: 'Mar', contributions: 25000, loans: 0 },
];
