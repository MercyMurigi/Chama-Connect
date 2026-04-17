import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Wallet, 
  HandCoins, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Search,
  ChevronRight,
  Plus,
  ArrowLeft,
  LayoutGrid,
  Info,
  TrendingUp,
  TrendingDown,
  Gavel,
  Target,
  PieChart,
  DollarSign,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  MOCK_MEMBERS, 
  MOCK_CONTRIBUTIONS, 
  MOCK_LOANS, 
  MONTHLY_SUMMARY, 
  MOCK_CHAMAS,
  MOCK_INCOME,
  MOCK_EXPENSES,
  MOCK_FINES,
  MOCK_GOALS,
  MOCK_SHARES
} from './data';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Chama, Income, Expense, Fine, Goal, Share } from './types';
import { Progress } from '@/components/ui/progress';

type Tab = 'overview' | 'members' | 'contributions' | 'income' | 'loans' | 'expenses' | 'fines' | 'goals' | 'shares' | 'settings';
type View = 'landing' | 'chama-list' | 'dashboard';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedChama, setSelectedChama] = useState<Chama | null>(null);

  if (view === 'landing') {
    return <LandingPage onEnter={() => setView('chama-list')} />;
  }

  if (view === 'chama-list') {
    return (
      <ChamaSelection 
        onSelect={(chama) => {
          setSelectedChama(chama);
          setView('dashboard');
        }} 
        onLogout={() => setView('landing')}
      />
    );
  }

  const sidebarItems = [
    { id: 'overview', icon: BarChart3, label: 'Overview' },
    { id: 'members', icon: Users, label: 'Members' },
    { id: 'contributions', icon: Wallet, label: 'Contributions' },
    { id: 'income', icon: TrendingUp, label: 'Income' },
    { id: 'loans', icon: HandCoins, label: 'Loans' },
    { id: 'expenses', icon: TrendingDown, label: 'Expenses' },
    { id: 'fines', icon: Gavel, label: 'Fines' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'shares', icon: PieChart, label: 'Shares' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const totalContributions = MOCK_CONTRIBUTIONS.reduce((acc, curr) => acc + curr.amount, 0);
  const activeLoans = MOCK_LOANS.filter(l => l.status === 'Active').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex h-screen bg-neutral-50 font-sans text-neutral-900">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="fixed left-0 top-0 z-40 h-screen border-r border-neutral-200 bg-white"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => setView('chama-list')}>
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-emerald-600">ChamaConnect</span>}
          </div>

          <nav className="flex-1 px-4 mt-4 space-y-1">
            <button
               onClick={() => setView('chama-list')}
               className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors mb-4 border border-dashed border-neutral-200"
            >
              <ArrowLeft className="w-4 h-4" />
              {isSidebarOpen && <span className="text-sm font-medium">Switch Chama</span>}
            </button>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                  activeTab === item.id 
                    ? "bg-emerald-50 text-emerald-600 shadow-sm" 
                    : "text-neutral-500 hover:bg-neutral-100"
                )}
              >
                <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-emerald-600" : "text-neutral-400 group-hover:text-neutral-600")} />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                {activeTab === item.id && isSidebarOpen && (
                  <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600" />
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-neutral-100">
            {isSidebarOpen && (
              <div className="mb-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                 <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Active Chama</p>
                 <p className="text-sm font-bold truncate">{selectedChama?.name || 'Unity Group'}</p>
              </div>
            )}
            <button 
              onClick={() => setView('landing')}
              className="w-full flex items-center gap-3 px-3 py-3 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span className="font-medium">Sign Out</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isSidebarOpen ? "pl-[260px]" : "pl-[80px]"
      )}>
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 border-bottom border-neutral-200 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="relative group min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search transactions, members..." 
                className="w-full pl-10 pr-4 py-2 bg-neutral-100 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-neutral-100 rounded-full relative text-neutral-500">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-neutral-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-neutral-900 leading-none">Chama Admin</p>
                <p className="text-xs text-neutral-500 mt-1">Investment Group</p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-neutral-200">
                <AvatarImage src="https://picsum.photos/seed/admin/40/40" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && <OverviewStats totalContributions={totalContributions} activeLoans={activeLoans} />}
              {activeTab === 'members' && <MembersList />}
              {activeTab === 'contributions' && <ContributionsTable />}
              {activeTab === 'income' && <IncomeDashboard />}
              {activeTab === 'loans' && <LoansDashboard />}
              {activeTab === 'expenses' && <ExpensesDashboard />}
              {activeTab === 'fines' && <FinesDashboard />}
              {activeTab === 'goals' && <GoalsDashboard />}
              {activeTab === 'shares' && <SharesDashboard />}
              {activeTab === 'settings' && <SettingsPlaceholder />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function IncomeDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Income Tracker</h1>
          <p className="text-neutral-500">Manage non-contribution revenue streams.</p>
        </div>
        <Button className="bg-emerald-600 rounded-xl gap-2">
           <Plus className="w-4 h-4" />
           Record Income
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'This Month', value: 'KES 15,200', change: '+8%', icon: TrendingUp },
          { label: 'Year to Date', value: 'KES 184,000', change: '+24%', icon: DollarSign },
          { label: 'Pending Collections', value: 'KES 3,000', change: '0%', icon: Wallet },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <stat.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <Badge variant="secondary" className="text-[10px]">{stat.change}</Badge>
            </div>
            <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_INCOME.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-semibold">{i.source}</TableCell>
                <TableCell className="text-emerald-600 font-bold">KES {i.amount.toLocaleString()}</TableCell>
                <TableCell className="text-neutral-500 text-sm">{i.date}</TableCell>
                <TableCell className="text-neutral-500 text-sm">{i.description}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function ExpensesDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Expense Management</h1>
          <p className="text-neutral-500">Track and approve group expenditures.</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl gap-2">
           <Plus className="w-4 h-4" />
           Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Spent (MTD)', value: 'KES 7,000', color: 'text-red-600' },
          { label: 'Average Monthly', value: 'KES 4,500', color: 'text-neutral-900' },
          { label: 'Largest Category', value: 'Welfare', color: 'text-neutral-500' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm p-6 text-center">
            <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
            <h3 className={cn("text-2xl font-bold mt-1", stat.color)}>{stat.value}</h3>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_EXPENSES.map((e) => (
              <TableRow key={e.id}>
                <TableCell>
                  <Badge variant="outline">{e.category}</Badge>
                </TableCell>
                <TableCell className="text-red-600 font-bold">KES {e.amount.toLocaleString()}</TableCell>
                <TableCell className="text-neutral-500 text-sm">{e.date}</TableCell>
                <TableCell className="text-neutral-500 text-sm">{e.description}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Receipt className="w-4 h-4" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function FinesDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Penalties & Fines</h1>
          <p className="text-neutral-500">Managing group discipline and late payments.</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl gap-2">
           <Gavel className="w-4 h-4" />
           Issue Fine
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_FINES.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-semibold">{f.memberName}</TableCell>
                <TableCell className="text-neutral-500 text-sm">{f.reason}</TableCell>
                <TableCell className="font-bold">KES {f.amount.toLocaleString()}</TableCell>
                <TableCell className="text-neutral-500 text-sm">{f.date}</TableCell>
                <TableCell>
                  <Badge className={cn(
                    "rounded-full",
                    f.status === 'Paid' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {f.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {f.status === 'Pending' && <Button size="sm" className="bg-emerald-600">Clear</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function GoalsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Group Goals</h1>
          <p className="text-neutral-500">Projects and saving targets for the chama.</p>
        </div>
        <Button className="bg-emerald-600 rounded-xl">New Goal</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_GOALS.map((goal) => (
          <Card key={goal.id} className="border-none shadow-sm p-8">
            <div className="flex items-start justify-between mb-6">
               <div className="space-y-1">
                 <Badge variant="outline" className="mb-2 uppercase text-[10px] tracking-widest">{goal.category}</Badge>
                 <h3 className="text-xl font-bold">{goal.title}</h3>
                 <p className="text-sm text-neutral-500">Deadline: {goal.deadline}</p>
               </div>
               <div className="text-right">
                 <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest leading-none mb-1">Target</p>
                 <p className="text-lg font-bold">KES {(goal.targetAmount / 1000).toLocaleString()}K</p>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-end justify-between text-sm">
                  <p className="font-medium text-neutral-600">Current Progress</p>
                  <p className="font-bold">{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</p>
               </div>
               <Progress value={(goal.currentAmount / goal.targetAmount) * 100} className="h-3 bg-neutral-100" />
               <div className="flex justify-between text-xs text-neutral-400">
                  <p>KES {goal.currentAmount.toLocaleString()} saved</p>
                  <p>KES {(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining</p>
               </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SharesDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Equity & Shares</h1>
          <p className="text-neutral-500">Tracking member ownership and share distribution.</p>
        </div>
        <Button variant="outline" className="rounded-xl">Dividend Distribution</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
            <Table>
               <TableHeader className="bg-neutral-50">
                  <TableRow>
                     <TableHead>Member</TableHead>
                     <TableHead>Shares Owned</TableHead>
                     <TableHead>Equity Value</TableHead>
                     <TableHead>Market Share</TableHead>
                     <TableHead className="text-right">Action</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {MOCK_SHARES.map((s) => (
                    <TableRow key={s.memberId}>
                       <TableCell className="font-semibold">{s.memberName}</TableCell>
                       <TableCell className="font-mono">{s.sharesOwned}</TableCell>
                       <TableCell className="font-bold">KES {s.totalValue.toLocaleString()}</TableCell>
                       <TableCell>
                          <div className="flex items-center gap-2">
                             <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: '15%' }} />
                             </div>
                             <span className="text-xs font-medium text-neutral-500">15%</span>
                          </div>
                       </TableCell>
                       <TableCell className="text-right">
                          <Button variant="ghost" size="sm">History</Button>
                       </TableCell>
                    </TableRow>
                  ))}
               </TableBody>
            </Table>
         </Card>

         <Card className="border-none shadow-sm p-6 flex flex-col items-center justify-center text-center">
            <PieChart className="w-12 h-12 text-emerald-100 mb-4" />
            <h3 className="font-bold text-lg">Group Asset Value</h3>
            <p className="text-3xl font-bold text-emerald-600 mt-2">KES 8,450,000</p>
            <p className="text-sm text-neutral-500 mt-4 leading-relaxed">
               Total assets including cash reserves, property portfolio, and active loan principal.
            </p>
            <Button className="w-full mt-8 bg-emerald-600 rounded-xl py-6">Re-evaluate Assets</Button>
         </Card>
      </div>
    </div>
  );
}
function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
          <span className="font-bold text-xl tracking-tight text-emerald-600">ChamaConnect</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-emerald-600 transition-colors">Pricing</a>
          <a href="#contact" className="hover:text-emerald-600 transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onEnter} className="text-sm font-medium font-sans">Login</Button>
          <Button onClick={onEnter} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none px-4 py-1.5 rounded-full mb-6">
            Digitally transforming Chamas worldwide
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 mb-6 leading-[1.1]">
            Digitize Your Chama.<br />
            <span className="text-emerald-600">Empower Your Future.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-neutral-600 mb-10 leading-relaxed">
            ChamaConnect is the all-in-one platform for your informal investment groups. 
            Automate recordings, track contributions, manage loans, and generate reports instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={onEnter} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-10 py-7 text-lg shadow-xl shadow-emerald-500/20">
              Go to My Chamas
            </Button>
            <Button variant="outline" className="rounded-xl px-10 py-7 text-lg border-neutral-200">
              Watch How it Works
            </Button>
          </div>

          <div className="mt-20 relative px-4">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
            <img 
              src="https://picsum.photos/seed/dashboard/1200/675" 
              alt="ChamaConnect Dashboard Preview" 
              className="rounded-3xl shadow-2xl border border-neutral-200 mx-auto max-w-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-neutral-50 py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 gap-3 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need to manage your group</h2>
            <p className="text-neutral-500 max-w-xl">Built for trust, transparency, and simplicity. Focus on growth, we'll handle the math.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Automated Contributions', desc: 'Track member payments instantly. Automatic reminders for pending contributions.', icon: Wallet },
              { title: 'Smart Loan Management', desc: 'Issue loans with custom interest rates and repayment schedules. Real-time updates.', icon: HandCoins },
              { title: 'Real-time Reports', desc: 'Generate financial statements, member audits, and group balance sheets in seconds.', icon: BarChart3 },
              { title: 'Member Directory', desc: 'Keep all member information organized. Roles and permissions management.', icon: Users },
              { title: 'Secure & Transparent', desc: 'Bank-grade security features and activity logs to ensure every cent is accounted for.', icon: Bell },
              { title: 'Smart Notifications', desc: 'Stay updated with SMS and email notifications for meetings, dues, and announcements.', icon: ChevronRight },
            ].map((feature, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all group">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl shadow-sm border border-neutral-100 mb-6 group-hover:bg-emerald-600 transition-colors">
                    <feature.icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-neutral-500 leading-relaxed text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-24 px-8 text-center max-w-7xl mx-auto border-t border-neutral-100">
        <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-12">Trusted by 1000+ Chamas across East Africa</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
          {['Bank Alpha', 'TechVentures', 'Heritage Trust', 'Global Group', 'Unity Invest'].map(logo => (
            <span key={logo} className="text-2xl font-serif italic font-bold">{logo}</span>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-8">
               <div className="w-12 h-1 bg-emerald-600" />
               <h2 className="text-4xl font-bold leading-tight">Hear from the Chamas<br />growing with us</h2>
               <p className="text-neutral-500">Real stories from real groups transforming their financial future through digitalization.</p>
               <div className="grid grid-cols-2 gap-8 pt-8">
                 <div>
                   <p className="text-3xl font-bold text-emerald-600">99.9%</p>
                   <p className="text-sm text-neutral-500 mt-2 text-sans font-medium uppercase tracking-wide">Uptime</p>
                 </div>
                 <div>
                   <p className="text-3xl font-bold text-emerald-600">KES 500M+</p>
                   <p className="text-sm text-neutral-500 mt-2 text-sans font-medium uppercase tracking-wide">Tracked Monthly</p>
                 </div>
               </div>
            </div>
            <div className="flex-1 grid gap-6">
              {[
                { name: 'Sarah W.', role: 'Treasurer, Unity Group', text: 'ChamaConnect saved us hours of manual recording every month. The automated reports are a lifesaver for our audits.' },
                { name: 'David M.', role: 'Chairperson, Heritage Trust', text: 'Transparency has reached an all-time high. Every member can see their contributions and loan status in real-time.' },
              ].map((t, i) => (
                <Card key={i} className="border-none shadow-xl shadow-neutral-200/50 p-8 rounded-2xl relative">
                  <span className="absolute top-6 right-8 text-6xl text-emerald-100 font-serif overflow-hidden h-12">“</span>
                  <p className="text-neutral-700 italic relative z-10 mb-6 leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://picsum.photos/seed/${t.name}/40/40`} />
                      <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className="text-xs text-neutral-500">{t.role}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-32">
        <div className="max-w-5xl mx-auto bg-emerald-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-500/30">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to take your Chama to the next level?</h2>
            <p className="text-emerald-100 mb-10 text-lg max-w-xl mx-auto">Join thousands of groups already using ChamaConnect to simplify their financial management.</p>
            <div className="flex flex-col sm:row justify-center gap-4">
               <Button onClick={onEnter} className="bg-white text-emerald-600 hover:bg-neutral-100 rounded-xl px-12 py-7 text-lg font-bold">
                 Access My Chamas
               </Button>
               <Button variant="ghost" className="text-white hover:bg-white/10 rounded-xl px-12 py-3 text-lg">
                 Talk to Sales
               </Button>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-neutral-900 text-white py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
              <span className="font-bold text-xl tracking-tight text-white">ChamaConnect</span>
            </div>
            <p className="text-neutral-400 max-w-xs leading-relaxed">
              Leading the digital revolution for informal investment groups. Empowering communities through technology.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Product</h4>
            <ul className="text-neutral-400 space-y-2 text-sm font-sans">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Solutions</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Company</h4>
            <ul className="text-neutral-400 space-y-2 text-sm font-sans">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-neutral-800 text-neutral-500 text-sm flex flex-col md:row justify-between items-center gap-4">
          <p>© 2024 ChamaConnect Systems. All rights reserved.</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ChamaSelection({ onSelect, onLogout }: { onSelect: (chama: Chama) => void, onLogout: () => void }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [chamas, setChamas] = useState<Chama[]>(MOCK_CHAMAS);

  return (
    <div className="min-h-screen bg-neutral-50 p-8 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">C</div>
             <h1 className="text-2xl font-bold tracking-tight">My Chamas</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onLogout} className="text-neutral-500">Sign Out</Button>
            <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
               <AvatarImage src="https://picsum.photos/seed/admin/40/40" />
               <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddForm(true)}
              className="group h-[240px] border-2 border-dashed border-neutral-300 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:border-emerald-500 hover:bg-emerald-50 transition-all"
           >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-neutral-200 group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-colors">
                 <Plus className="w-8 h-8 text-neutral-400 group-hover:text-white transition-colors" />
              </div>
              <div className="text-center">
                 <p className="font-bold text-lg text-neutral-800">Add New Chama</p>
                 <p className="text-sm text-neutral-500">Create a new investment group</p>
              </div>
           </motion.button>

           {chamas.map((chama, i) => (
             <motion.div
               key={chama.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="group relative"
             >
                <Card className="h-[240px] border-none shadow-sm hover:shadow-xl transition-all rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden cursor-pointer" onClick={() => onSelect(chama)}>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-100 transition-colors" />
                   
                   <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                         <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-neutral-100 flex items-center justify-center">
                            <Users className="w-6 h-6 text-emerald-600" />
                         </div>
                         <Badge  className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-bold text-[10px] uppercase tracking-wider">{chama.role}</Badge>
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900 group-hover:text-emerald-600 transition-colors line-clamp-1">{chama.name}</h3>
                      <p className="text-sm text-neutral-500 mt-1">{chama.memberCount} active members</p>
                   </div>

                   <div className="relative border-t border-neutral-100 pt-6 flex items-center justify-between">
                      <div>
                         <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Total Capital</p>
                         <p className="font-bold text-neutral-900">KES {(chama.totalCapital / 1000).toLocaleString()}K</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Activity</p>
                         <p className="text-xs font-medium text-neutral-600">{chama.lastActivity}</p>
                      </div>
                   </div>
                </Card>
             </motion.div>
           ))}
        </div>

        <section className="mt-20">
           <div className="flex items-center gap-2 mb-8">
              <BarChart3 className="w-5 h-5 text-neutral-400" />
              <h2 className="text-lg font-bold">Group Aggregated Performance</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Combined Capital', value: 'KES 8.7M', icon: Wallet, color: 'text-emerald-600' },
                { label: 'Overall Yield (YoY)', value: '+14.2%', icon: BarChart3, color: 'text-emerald-600' },
                { label: 'Personal Contributions', value: 'KES 142K', icon: LayoutGrid, color: 'text-emerald-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 flex items-center gap-4">
                   <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center">
                      <stat.icon className={cn("w-6 h-6", stat.color)} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-xl font-bold">{stat.value}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
               onClick={() => setShowAddForm(false)}
             />
             <motion.div
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-10 overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full translate-x-1/2 -translate-y-1/2 -z-0" />
                <div className="relative z-10">
                   <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                         <Plus className="w-6 h-6" />
                      </div>
                      <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400">
                         <X className="w-6 h-6" />
                      </button>
                   </div>
                   
                   <h2 className="text-3xl font-bold text-neutral-900 mb-2">Create a New Chama</h2>
                   <p className="text-neutral-500 mb-8">Set up your investment group and invite members to start growth together.</p>

                   <form className="space-y-6" onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const name = formData.get('name') as string;
                      if (!name) return;
                      const newChama: Chama = {
                        id: `ch${Date.now()}`,
                        name,
                        memberCount: 1,
                        totalCapital: 0,
                        lastActivity: 'Just created',
                        role: 'Admin',
                        status: 'Active'
                      };
                      setChamas([newChama, ...chamas]);
                      setShowAddForm(false);
                   }}>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700 ml-1">Group Name</label>
                        <input name="name" required type="text" placeholder="e.g., Diamond Savings Club" className="w-full px-5 py-4 bg-neutral-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700 ml-1">Group Description (Optional)</label>
                        <textarea placeholder="Tell us about your chama's mission..." className="w-full px-5 py-4 bg-neutral-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium h-32 resize-none" />
                      </div>
                      
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                         <Info className="w-5 h-5 text-emerald-600 mt-0.5" />
                         <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                            By creating a group, you'll be set as the 1st Administrator. 
                            You can invite other members and assign roles later.
                         </p>
                      </div>

                      <div className="pt-4">
                         <Button type="submit" className="w-full py-7 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-500/20">
                            Create & Launch Chama
                         </Button>
                      </div>
                   </form>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OverviewStats({ totalContributions, activeLoans }: { totalContributions: number, activeLoans: number }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Dashboard Overview</h1>
          <p className="text-neutral-500 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-6 shadow-lg shadow-emerald-500/20 gap-2">
          <Plus className="w-5 h-5" />
          New Contribution
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Capital', value: 'KES 2,450,000', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+12.5%' },
          { label: 'Active Loans', value: `KES ${activeLoans.toLocaleString()}`, icon: HandCoins, color: 'text-orange-600', bg: 'bg-orange-50', change: '-2.4%' },
          { label: 'Total Members', value: MOCK_MEMBERS.length.toString(), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+1' },
          { label: 'Monthly Contributions', value: `KES ${totalContributions.toLocaleString()}`, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50', change: '+5.2%' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <Badge variant="secondary" className="bg-neutral-100 text-neutral-600 text-xs font-semibold px-2 py-1">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-neutral-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 text-neutral-900">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Financial Performance</CardTitle>
            <CardDescription>Visualizing contributions vs loans issued over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_SUMMARY}>
                <defs>
                  <linearGradient id="colorCont" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="contributions" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorCont)" />
                <Area type="monotone" dataKey="loans" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorLoans)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {MOCK_CONTRIBUTIONS.slice(0, 5).map((activity, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://picsum.photos/seed/${activity.memberName}/40/40`} />
                    <AvatarFallback>{activity.memberName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate group-hover:text-emerald-600 transition-colors">{activity.memberName}</p>
                    <p className="text-xs text-neutral-500">Paid contribution • {activity.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">+ KES {activity.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
              View All Activities <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm mt-8 lg:mt-0">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { title: 'Monthly Strategy Review', date: 'April 20, 2024', time: '10:00 AM', type: 'Virtual' },
                { title: 'Project Funding Vote', date: 'May 05, 2024', time: '02:30 PM', type: 'In-person' },
              ].map((meeting, i) => (
                <div key={i} className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-white text-[10px]">{meeting.type}</Badge>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{meeting.time}</span>
                  </div>
                  <p className="font-bold text-sm text-neutral-800">{meeting.title}</p>
                  <p className="text-xs text-neutral-500">{meeting.date}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 rounded-xl border-neutral-200">
              Schedule Meeting
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MembersList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Group Members</h1>
          <p className="text-neutral-500">Manage your chama members and their roles.</p>
        </div>
        <Button className="bg-emerald-600 rounded-xl">Add Member</Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_MEMBERS.map((member) => (
              <TableRow key={member.id} className="hover:bg-neutral-50/50 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "rounded-md px-2 py-0",
                    member.role === 'Chairperson' && "border-emerald-200 bg-emerald-50 text-emerald-700",
                    member.role === 'Treasurer' && "border-emerald-200 bg-emerald-50 text-emerald-700",
                    member.role === 'Secretary' && "border-amber-200 bg-amber-50 text-amber-700",
                    member.role === 'Member' && "border-neutral-200 bg-neutral-50 text-neutral-600"
                  )}>
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-neutral-500 text-sm">{member.joinedDate}</TableCell>
                <TableCell className="text-neutral-500 text-sm">{member.email}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-neutral-500">Manage</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function ContributionsTable() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contribution History</h1>
          <p className="text-neutral-500">View and track all group contributions.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl">Export CSV</Button>
          <Button className="bg-emerald-600 rounded-xl">Register New Payment</Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_CONTRIBUTIONS.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="text-xs font-mono text-neutral-400 capitalize">{c.id}</TableCell>
                <TableCell className="font-medium">{c.memberName}</TableCell>
                <TableCell className="font-bold">KES {c.amount.toLocaleString()}</TableCell>
                <TableCell className="text-neutral-500 text-sm">{c.date}</TableCell>
                <TableCell>
                  <span className="text-xs font-medium text-neutral-600 bg-neutral-200 px-2 py-1 rounded-full">{c.type}</span>
                </TableCell>
                <TableCell>
                  <Badge className={cn(
                    "rounded-full px-3",
                    c.status === 'Paid' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-100"
                  )}>
                    {c.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function LoansDashboard() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Loan Management</h1>
          <p className="text-neutral-500">Track group loans, interests and repayments.</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl">Issue New Loan</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-orange-600 text-white">
          <CardContent className="p-6">
            <p className="text-orange-100 text-sm font-medium">Total Loan Principal</p>
            <h3 className="text-3xl font-bold mt-2">KES 450,000</h3>
            <div className="mt-4 flex items-center gap-2 text-xs text-orange-200">
              <span className="bg-white/20 px-2 py-0.5 rounded">Active</span>
              <span>12 loans currently active</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-neutral-500 text-sm font-medium">Interest Earned</p>
            <h3 className="text-3xl font-bold mt-2 text-emerald-600">KES 42,300</h3>
            <p className="text-xs text-neutral-400 mt-2">Overall group revenue from loans</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <p className="text-neutral-500 text-sm font-medium">Overdue Amount</p>
            <h3 className="text-3xl font-bold mt-2 text-red-600">KES 12,000</h3>
            <p className="text-xs text-red-400 mt-2">2 members have outstanding balances</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50">
            <TableRow>
              <TableHead>Borrower</TableHead>
              <TableHead>Principal</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_LOANS.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className="font-medium">{loan.memberName}</TableCell>
                <TableCell className="font-bold">KES {loan.amount.toLocaleString()}</TableCell>
                <TableCell className="text-neutral-500 text-sm">{loan.interest}%</TableCell>
                <TableCell className="text-neutral-500 text-sm">{loan.issuedDate}</TableCell>
                <TableCell className="text-neutral-500 text-sm">{loan.dueDate}</TableCell>
                <TableCell>
                  <Badge className={cn(
                    "rounded-full px-3",
                    loan.status === 'Active' && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
                    loan.status === 'Paid' && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
                    loan.status === 'Overdue' && "bg-red-100 text-red-700 hover:bg-red-100"
                  )}>
                    {loan.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function SettingsPlaceholder() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Group Settings</h1>
        <p className="text-neutral-500">Configure your Chama's rules and details.</p>
      </div>
      
      <Card className="border-none shadow-sm">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Chama Name</label>
            <input type="text" defaultValue="Unity Investment Group" className="w-full px-4 py-3 bg-neutral-100 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Monthly Contribution Amount (KES)</label>
            <input type="number" defaultValue="5000" className="w-full px-4 py-3 bg-neutral-100 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Loan Interest Rate (%)</label>
            <input type="number" defaultValue="10" className="w-full px-4 py-3 bg-neutral-100 rounded-xl border-none outline-none focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <Button className="w-full bg-emerald-600 rounded-xl py-6">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
