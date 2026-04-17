export interface Chama {
  id: string;
  name: string;
  memberCount: number;
  totalCapital: number;
  lastActivity: string;
  role: string;
  status: 'Active' | 'Inactive';
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Chairperson' | 'Treasurer' | 'Secretary' | 'Member';
  joinedDate: string;
  avatar?: string;
}

export interface Contribution {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  type: 'Monthly' | 'Special' | 'Fines';
  status: 'Paid' | 'Pending';
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
  status: 'Paid' | 'Pending';
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
