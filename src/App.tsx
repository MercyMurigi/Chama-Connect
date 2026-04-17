import React, { useState } from 'react';
import { 
  Users, 
  Wallet, 
  Search, 
  Plus, 
  ChevronDown,
  Moon,
  Bell,
  MessageSquare,
  TrendingUp,
  LayoutDashboard,
  CheckCircle2,
  RefreshCcw,
  CreditCard,
  ChevronLeft,
  ArrowLeft,
  Settings,
  ShieldCheck,
  DollarSign,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  Globe,
  Star,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type Page = 'dashboard' | 'my-chamas' | 'members' | 'income' | 'fines' | 'goals' | 'shares' | 'settings' | 'contributions' | 'loans' | 'expenses';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChamasExpanded, setIsChamasExpanded] = useState(true);

  const selectedChama = "LESOM Dynamics";

  const renderContent = () => {
    switch(activePage) {
      case 'dashboard': return <DashboardView />;
      case 'my-chamas': return <MyChamasView />;
      case 'members': return <MembersView groupName={selectedChama} />;
      case 'contributions': return <ContributionsView groupName={selectedChama} />;
      case 'income': return <IncomeView groupName={selectedChama} />;
      case 'loans': return <LoansView groupName={selectedChama} />;
      case 'expenses': return <ExpensesView groupName={selectedChama} />;
      case 'shares': return <SharesView groupName={selectedChama} />;
      case 'settings': return <SettingsView groupName={selectedChama} />;
      case 'goals': return <GoalsView groupName={selectedChama} />;
      case 'fines': return <FinesView groupName={selectedChama} />;
      default: return <div className="p-8 text-neutral-400">Page coming soon: {activePage}</div>;
    }
  };

  if (!isAuthenticated) {
    return <LandingPage onGetStarted={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-white font-sans text-neutral-900 border-t border-neutral-100">
      {/* Sidebar */}
      <aside className={cn(
        "h-screen border-r border-neutral-100 bg-white transition-all duration-300 flex flex-col pt-4 shrink-0 overflow-y-auto no-scrollbar",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="px-6 flex items-center justify-between mb-8 group cursor-pointer">
          <div className="flex items-center gap-2 overflow-hidden" onClick={() => setActivePage('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-white border border-emerald-100 flex items-center justify-center shrink-0">
               <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-emerald-500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l8.5 5v7L12 20l-8.5-5V8L12 3z" />
                <path d="M12 8l4 2.5v3l-4 2.5-4-2.5v-3z" />
               </svg>
            </div>
            {isSidebarOpen && <span className="font-bold text-emerald-500 text-lg tracking-tight whitespace-nowrap">ChamaConnect</span>}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <ChevronLeft className={cn("w-4 h-4 transition-transform duration-300", !isSidebarOpen && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            isActive={activePage === 'dashboard'} 
            isOpen={isSidebarOpen} 
            onClick={() => setActivePage('dashboard')} 
          />
          
          <div className="space-y-1">
            <button
              onClick={() => {
                if(!isSidebarOpen) setIsSidebarOpen(true);
                setIsChamasExpanded(!isChamasExpanded);
              }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left group",
                !isSidebarOpen && "justify-center",
                activePage !== 'dashboard' ? "bg-emerald-50 text-emerald-900" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              <div className="flex items-center gap-3">
                <Wallet className={cn("w-5 h-5", activePage !== 'dashboard' ? "text-emerald-600" : "text-neutral-400 group-hover:text-neutral-600")} />
                {isSidebarOpen && <span className="text-[14px] font-semibold">Chamas</span>}
              </div>
              {isSidebarOpen && (
                <ChevronDown className={cn("w-4 h-4 transition-transform", !isChamasExpanded && "-rotate-90")} />
              )}
            </button>
            
            {isChamasExpanded && isSidebarOpen && (
              <div className="pl-4 space-y-1 mt-1">
                <SubMenuItem label="Back to My Chamas" onClick={() => setActivePage('my-chamas')} isActive={activePage === 'my-chamas'} />
                <SubMenuItem label="Members" onClick={() => setActivePage('members')} isActive={activePage === 'members'} />
                <SubMenuItem label="Contributions" onClick={() => setActivePage('contributions')} isActive={activePage === 'contributions'} />
                <SubMenuItem label="Income" onClick={() => setActivePage('income')} isActive={activePage === 'income'} />
                <SubMenuItem label="Loans" onClick={() => setActivePage('loans')} isActive={activePage === 'loans'} />
                <SubMenuItem label="Expenses" onClick={() => setActivePage('expenses')} isActive={activePage === 'expenses'} />
                <SubMenuItem label="Fines" onClick={() => setActivePage('fines')} isActive={activePage === 'fines'} />
                <SubMenuItem label="Goals" onClick={() => setActivePage('goals')} isActive={activePage === 'goals'} />
                <SubMenuItem label="Shares" onClick={() => setActivePage('shares')} isActive={activePage === 'shares'} />
                <SubMenuItem label="Settings" onClick={() => setActivePage('settings')} isActive={activePage === 'settings'} />
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB]">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-neutral-100 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search users or messages" 
                className="w-full pl-10 pr-4 py-1.5 bg-white border border-emerald-500/30 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-neutral-600">
              <button className="p-1 hover:text-emerald-500 transition-colors"><Moon className="w-5 h-5" /></button>
              <button className="p-1 hover:text-emerald-500 transition-colors"><Bell className="w-5 h-5" /></button>
              <button className="p-1 hover:text-emerald-500 transition-colors"><MessageSquare className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-neutral-100">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 px-2 py-1 rounded-lg transition-all group" onClick={() => setIsAuthenticated(false)}>
                <Avatar className="h-8 w-8 bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-400">
                  <AvatarFallback>KI</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-semibold whitespace-nowrap text-[#111827]">Kevin Isom</span>
                  <LogOut className="w-3.5 h-3.5 text-neutral-400 group-hover:text-rose-500 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View */}
        <main className="flex-1 overflow-y-auto relative min-h-0 bg-white">
          <div className="p-8 max-w-full mx-auto pb-24">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activePage}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <footer className="absolute bottom-0 left-0 right-0 h-12 border-t border-neutral-100 bg-white flex items-center justify-center text-[13px] text-neutral-500">
            © 2026 Chama Connect — Admin
          </footer>
        </main>
      </div>
    </div>
  );
}

function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-neutral-200 rounded-lg bg-white shadow-sm group-hover:border-emerald-200 group-hover:shadow-emerald-50 transition-all">
              <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3l8.5 5v7L12 20l-8.5-5V8L12 3z" />
                  <path d="M12 8l4 2.5v3l-4 2.5-4-2.5v-3z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-800">ChamaConnect</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Features', 'Pricing', 'Company'].map((item) => (
              <a key={item} href="#" className={cn(
                "text-sm font-semibold transition-colors",
                item === 'Home' ? "text-emerald-600 underline underline-offset-4 decoration-2" : "text-neutral-600 hover:text-emerald-600"
              )}>
                {item} {item === 'Company' && <ChevronDown className="inline w-3 h-3 ml-1" />}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
              <Moon className="w-5 h-5" />
            </button>
            <Button className="bg-[#10b981] hover:bg-[#059669] text-white px-6 h-10 rounded-lg font-bold text-sm shadow-sm transition-all" onClick={onGetStarted}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-neutral-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-neutral-100 overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                {['Home', 'Features', 'Pricing', 'Company'].map((item) => (
                  <a key={item} href="#" className="text-lg font-bold text-neutral-900">{item}</a>
                ))}
                <hr className="border-neutral-100" />
                <Button className="bg-emerald-600 w-full h-14 rounded-2xl font-bold" onClick={onGetStarted}>Get Started Free</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="text-emerald-600 font-bold tracking-tight text-sm px-1 flex items-center gap-2">
              Secure • Transparent • Automated
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-neutral-900 leading-[1.1] tracking-tighter">
              The Future of <br />
              Chamas is Here
            </h1>
            <p className="text-lg text-neutral-500 max-w-lg leading-relaxed font-medium">
              Secure, transparent, and automated financial management platform built on blockchain technology for African savings groups.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button className="w-full sm:w-auto bg-[#10b981] hover:bg-[#059669] text-white px-8 h-14 rounded-lg font-bold text-lg shadow-lg shadow-emerald-200/50 group" onClick={onGetStarted}>
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-lg font-bold text-lg border-neutral-200 text-neutral-900 hover:bg-neutral-50" onClick={onGetStarted}>
                Product Demo
              </Button>
            </div>
          </motion.div>

          {/* Phone Mockup Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Background Decorative Pattern */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10 flex items-center justify-center opacity-20 pointer-events-none">
              <div className="w-full h-full max-w-md aspect-square bg-emerald-100 rounded-full blur-[100px]" />
              <svg className="absolute w-full h-full text-emerald-600 opacity-20" viewBox="0 0 200 200">
                <path fill="currentColor" d="M40,-62.1C51.2,-54.1,59.2,-42.6,66.1,-30.2C73,-17.8,78.8,-4.5,77,8.2C75.2,20.9,65.8,33,56.1,43.2C46.3,53.3,36.2,61.4,24.3,66.1C12.4,70.9,-1.2,72.3,-14.8,69.5C-28.3,66.7,-41.7,59.7,-52.1,49.5C-62.5,39.3,-69.8,25.9,-72.6,11.5C-75.3,-2.9,-73.4,-18.2,-66.2,-30.8C-59,-43.3,-46.5,-53,-34,-60.2C-21.4,-67.4,-8.7,-72.1,2.8,-76.3C14.3,-80.6,28.7,-70.2,40,-62.1Z" transform="translate(100 100)" />
              </svg>
            </div>

            <div className="relative flex items-center justify-center">
              {/* Back Phone */}
              <div className="bg-neutral-900 w-[240px] aspect-[9/19] rounded-[40px] border-[8px] border-neutral-800 shadow-2xl relative overflow-hidden -rotate-6 translate-x-12 translate-y-6">
                <img src="https://picsum.photos/seed/mobile1/600/1200" className="w-full h-full object-cover grayscale opacity-50" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 to-transparent p-6 flex flex-col justify-end">
                   <div className="space-y-2">
                     <div className="h-4 w-20 bg-emerald-500 rounded-full" />
                     <div className="h-4 w-full bg-white/20 rounded-full" />
                     <div className="h-4 w-2/3 bg-white/20 rounded-full" />
                   </div>
                </div>
              </div>
              {/* Front Phone */}
              <div className="bg-neutral-900 w-[260px] aspect-[9/19] rounded-[48px] border-[10px] border-neutral-800 shadow-[20px_40px_80px_rgba(0,0,0,0.3)] relative overflow-hidden z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-neutral-800 rounded-b-2xl z-20" />
                <div className="relative h-full bg-emerald-600">
                  <img src="https://picsum.photos/seed/kulture/800/1600" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-emerald-600/30 backdrop-blur-[1px]" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mb-6 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-white" stroke="currentColor" strokeWidth="2">
                        <path d="M12 3l8.5 5v7L12 20l-8.5-5V8L12 3z" />
                        <path d="M12 8l4 2.5v3l-4 2.5-4-2.5v-3z" />
                      </svg>
                    </div>
                    <span className="text-2xl font-black text-white tracking-tighter">ChamaConnect</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-20 border-b border-neutral-100 bg-[#F9FAFB]/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold uppercase text-neutral-400 tracking-[0.2em] mb-12">Trusted by Leading Organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10">
            {['NAIROBI CITY COUNTY', 'COMPUTER AID', 'Women of Destiny', 'HEP', 'NAIROBI CITY COUNCIL'].map((name, i) => (
              <div key={i} className="bg-white px-6 py-4 rounded-xl border border-neutral-200/50 shadow-sm flex items-center gap-3 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 group cursor-default">
                 <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center p-1.5 border border-neutral-100 group-hover:border-emerald-200 transition-colors">
                   {i % 2 === 0 ? <Globe className="w-full h-full text-emerald-500" /> : <ShieldCheck className="w-full h-full text-blue-500" />}
                 </div>
                 <span className="font-bold text-xs tracking-tight text-neutral-800">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-emerald-500/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-duration-500" />
            <img 
              src="https://picsum.photos/seed/working/1200/800" 
              className="rounded-[2.5rem] shadow-[20px_40px_80px_rgba(0,0,0,0.1)] relative z-10 w-full hover:scale-[1.02] transition-transform duration-500"
              alt="Person working"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-8">
            <div className="text-emerald-500 font-bold tracking-[0.2em] text-xs uppercase">Discover</div>
            <h2 className="text-5xl font-black text-neutral-900 leading-tight tracking-tight">How Our Table Banking <br /> System Works</h2>
            <div className="space-y-6 text-neutral-500 font-medium leading-relaxed">
              <p>ChamaConnect streamlines table banking with innovative tools designed for Kenyan groups, blending blockchain security with user-friendly fintech solutions.</p>
              <p>This solution addresses the operational inefficiencies commonly faced by Chama groups, such as manual record-keeping, lack of transparency, and financial mismanagement.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-4">
               {[
                 { icon: <Users className="w-6 h-6" />, title: 'Member Network' },
                 { icon: <DollarSign className="w-6 h-6" />, title: 'Real-time Fund' },
                 { icon: <Wallet className="w-6 h-6" />, title: 'Secure Loans' },
                 { icon: <BarChart3 className="w-6 h-6" />, title: 'Smart Growth' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                      {item.icon}
                    </div>
                    <span className="font-bold text-neutral-800 tracking-tight">{item.title}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid (Light) */}
      <section className="py-24 px-6 bg-[#F9FAFB]/50">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ProcessCard 
            icon={<Users className="w-6 h-6" />}
            title="Create or Join a Group"
            description="Set up a new table banking group in minutes or join an existing one using email, SMS, or shareable links, with customizable settings for savings and loans tailored to your needs."
          />
          <ProcessCard 
            icon={<DollarSign className="w-6 h-6" />}
            title="Manage Finances"
            description="Track contributions and group savings in real-time via intuitive dashboards, set auto-reminders for timely payments, and monitor financial goals effortlessly, all managed by admins through a sleek interface."
          />
          <ProcessCard 
            icon={<Wallet className="w-6 h-6" />}
            title="Simplify Loans and Savings"
            description="Apply for loans instantly on the platform, define repayment terms with automated interest tracking, and manage savings securely—eliminating manual errors and boosting group trust with blockchain precision."
          />
          <ProcessCard 
            icon={<BarChart3 className="w-6 h-6" />}
            title="Generate Financial Reports"
            description="Access instant, detailed reports on savings, loans, and expenses, share them with members for transparency, and leverage insights to drive smart financial decisions, all powered by professional-grade accounting tools."
          />
        </div>
      </section>

      {/* Dark Who We Are Section */}
      <section className="py-32 px-6 bg-[#111827] text-white overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-64 h-64 border border-emerald-500/20 rounded-full scale-[5] opacity-50" />
           <div className="absolute inset-0 grid grid-cols-12 gap-0 opacity-5">
              {[...Array(48)].map((_, i) => (
                <div key={i} className="aspect-square border border-emerald-500/20 rounded-full m-1" />
              ))}
           </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <div className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-[10px]">Who We Are</div>
            <h2 className="text-6xl font-black tracking-tight leading-tight">Built for African Savings Groups</h2>
            <p className="text-neutral-400 text-lg font-medium leading-relaxed">We understand the unique needs of African communities. Our platform combines traditional values with cutting-edge technology to empower financial growth.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <ChamaTypeCard 
              image="https://picsum.photos/seed/table/800/600"
              title="Table Banking Groups"
              description="ChamaConnect helps table banking groups by pooling savings, disbursing loans, tracking guarantors, and managing fines."
            />
            <ChamaTypeCard 
              image="https://picsum.photos/seed/sacco/800/600"
              title="Sacco Groups"
              description="The platform's streamlined features help handle contributions, structured loans, dividends, and guarantor-based loan approvals."
            />
            <ChamaTypeCard 
              image="https://picsum.photos/seed/merry/800/600"
              title="Merry-Go Round Groups"
              description="This simplified system aids in managing contributions, tracking beneficiaries, and maintaining rotation schedules."
            />
          </div>
        </div>
      </section>

      {/* Trusted Platform Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
            <h2 className="text-6xl font-black text-neutral-900 tracking-tighter">The Most Trusted Chama Platform</h2>
            <p className="text-lg text-neutral-500 font-medium leading-relaxed">Experience the power of blockchain technology designed specifically for African savings groups. Professional features that preserve cultural practices with modern innovation.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCardDetailed 
              icon={<ShieldCheck className="w-6 h-6" />}
              title="Immutable Records"
              tag="Blockchain Security"
              description="Built on secure blockchain infrastructure with immutable transaction records. Your group's financial data is protected with enterprise-grade security."
            />
            <FeatureCardDetailed 
              icon={<Zap className="w-6 h-6" />}
              title="Modern Tech Stack"
              tag="TypeScript"
              description="Built with Next.js 15, TypeScript, and React 19. Professional development tools ensure top-tier performance and security."
            />
            <FeatureCardDetailed 
              icon={<Plus className="w-6 h-6" />}
              title="Smart Automation"
              tag="Automated"
              description="Automated loan management, contribution tracking, and penalty calculations. Smart logic ensures transparent and fair financial processes."
            />
            <FeatureCardDetailed 
              icon={<Globe className="w-6 h-6" />}
              title="Kenyan Market Focus"
              tag="Local Focus"
              description="Designed specifically for Kenyan Chama groups with local currency support, cultural understanding, and .co.ke experience."
            />
            <FeatureCardDetailed 
              icon={<BarChart3 className="w-6 h-6" />}
              title="Comprehensive Analytics"
              tag="Real-time Data"
              description="Real-time financial reporting, member tracking, and growth analytics. Generate unlimited reports with advanced dashboards."
            />
            <FeatureCardDetailed 
              icon={<ArrowRight className="w-6 h-6" />}
              title="Scalable Plans"
              tag="15 to ∞ Members"
              description="From free starter plans for 15 members to enterprise solutions for unlimited users. Grow your platform as your Chama expands."
            />
          </div>

          <div className="mt-16 flex justify-center gap-6">
            <Button className="bg-[#10b981] hover:bg-[#059669] text-white px-10 h-14 rounded-lg font-black text-sm" onClick={onGetStarted}>Start Free Trial</Button>
            <Button variant="outline" className="text-neutral-900 border-neutral-200 px-10 h-14 rounded-lg font-black text-sm hover:bg-neutral-50">View Features</Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-emerald-50/30">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
           <div className="absolute inset-0 grid grid-cols-12 gap-0">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="aspect-square border border-emerald-600 rounded-full m-2" />
              ))}
           </div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
           <div className="space-y-2">
             <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Join our newsletter</h3>
             <p className="text-neutral-500 font-medium">Stay up to date on features and releases</p>
           </div>
           
           <div className="max-w-md mx-auto relative">
             <input 
               type="email" 
               placeholder="Enter your email" 
               className="w-full pl-6 pr-12 py-4 bg-white border border-neutral-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none font-medium shadow-sm"
             />
             <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-sm">
                <ArrowRight className="w-5 h-5" />
             </button>
           </div>
        </div>

        {/* Floating Up Arrow */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-50 group border-4 border-white/20"
        >
          <ArrowRight className="w-5 h-5 -rotate-90 group-hover:-translate-y-1 transition-transform" />
        </button>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3l8.5 5v7L12 20l-8.5-5V8L12 3z" />
                  <path d="M12 8l4 2.5v3l-4 2.5-4-2.5v-3z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-800">ChamaConnect</span>
            </div>
            <p className="text-neutral-500 font-medium leading-relaxed max-w-sm">Empowering African savings groups through secure, transparent blockchain-based financial management solutions.</p>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-neutral-900 tracking-tight">Product</h4>
            <div className="flex flex-col gap-4 text-sm font-bold text-neutral-500">
              <a href="#" className="hover:text-emerald-600 transition-colors">Features</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Security</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Pricing</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Resources</a>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-neutral-900 tracking-tight">Legal</h4>
            <div className="flex flex-col gap-4 text-sm font-bold text-neutral-500">
              <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Support</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-neutral-100 flex flex-col md:row items-center justify-between gap-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">© 2026 ChamaConnect SAAS • Built for African Chamas</p>
          <div className="flex gap-6 grayscale opacity-50">
            <div className="w-5 h-5 bg-neutral-900 rounded-full" />
            <div className="w-5 h-5 bg-neutral-900 rounded-full" />
            <div className="w-5 h-5 bg-neutral-900 rounded-full" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProcessCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
    >
      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-black text-neutral-900 mb-4 tracking-tight leading-none">{title}</h3>
      <p className="text-neutral-500 font-medium text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function ChamaTypeCard({ image, title, description }: { image: string, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-neutral-800/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden group shadow-2xl"
    >
      <div className="h-64 relative overflow-hidden">
        <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={title} referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-neutral-900/40" />
      </div>
      <div className="p-10 space-y-6">
         <h3 className="text-3xl font-black text-white tracking-tight leading-none">{title}</h3>
         <p className="text-neutral-400 font-medium leading-relaxed leading-relaxed">{description}</p>
         <button className="text-emerald-500 font-bold hover:underline underline-offset-8 flex items-center gap-2 group/btn">
            Learn more 
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>
    </motion.div>
  );
}

function FeatureCardDetailed({ icon, title, tag, description }: { icon: any, title: string, tag: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="p-10 rounded-[2rem] bg-white border border-neutral-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-100 transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-neutral-900 mb-2 tracking-tight leading-none">{title}</h3>
      <div className="text-emerald-500 font-bold text-xs uppercase tracking-widest mb-4">{tag}</div>
      <p className="text-neutral-500 font-medium leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, color, bgColor }: { icon: any, title: string, description: string, color: string, bgColor: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-10 rounded-[2.5rem] bg-white border border-neutral-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-100 transition-all group"
    >
      <div className={cn("w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-10 transition-transform group-hover:rotate-6 shadow-sm", bgColor, color)}>
        {icon}
      </div>
      <h3 className="text-2xl font-black text-neutral-900 mb-4 tracking-tight leading-none">{title}</h3>
      <p className="text-neutral-500 font-medium leading-relaxed leading-relaxed">{description}</p>
    </motion.div>
  );
}

function SubMenuItem({ label, onClick, isActive }: { label: string, onClick: () => void, isActive: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all",
        isActive ? "text-emerald-600 bg-neutral-50 border border-neutral-100" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50/50"
      )}
    >
      {label}
    </button>
  );
}

function SidebarItem({ icon: Icon, label, isActive, isOpen, onClick }: { icon: any, label: string, isActive: boolean, isOpen: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left group",
        isActive 
          ? "bg-emerald-100 text-emerald-900" 
          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
      )}
    >
      <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-emerald-600" : "text-neutral-400 group-hover:text-neutral-600")} />
      {isOpen && <span className="text-[14px] font-medium">{label}</span>}
    </button>
  );
}

function DashboardView() {
  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-[32px] font-bold text-[#111827] tracking-tight">Welcome back, Kevin</h1>
        <p className="text-neutral-500 text-sm">Here's what's happening with your chama</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total Contributions" 
          value="Ksh 0.00" 
          icon={<CreditCard className="w-5 h-5" />} 
          color="text-emerald-600" 
        />
        <StatCard 
          label="Income Analysis" 
          value="Ksh 0.00" 
          icon={<TrendingUp className="w-5 h-5" />} 
          color="text-emerald-600" 
        />
        <StatCard 
          label="Expense Analysis" 
          value="Ksh 0.00" 
          icon={<TrendingUp className="w-5 h-5 rotate-45" />} 
          color="text-rose-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-neutral-100 p-8 min-h-[400px] flex flex-col shadow-sm">
            <h3 className="text-[13px] font-bold text-neutral-900 mb-6 uppercase tracking-wider">Group Comparison</h3>
            <div className="flex-1 flex items-center justify-center flex-col text-neutral-400 space-y-2">
              <span className="text-sm font-medium">No group data available for comparison</span>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-[13px] font-bold text-neutral-900 uppercase tracking-wider">My Goals</h3>
            </div>
            <div className="space-y-4">
              <SkeletonRow />
              <SkeletonRow width="w-2/3" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <RefreshCcw className="w-5 h-5 text-blue-500" />
              <h3 className="text-[13px] font-bold text-neutral-900 uppercase tracking-wider">Recent Transactions</h3>
            </div>
            <div className="space-y-4">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow width="w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyChamasView() {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[32px] font-bold text-[#111827] tracking-tight">My Chamas</h1>
          <p className="text-neutral-500 text-sm">Manage and track your chama groups</p>
        </div>
        <Button className="bg-[#047857] hover:bg-[#065f46] text-white rounded-lg px-6 h-11 font-semibold flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          Create Chama
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Groups" value="0" icon={<Users className="w-5 h-5" />} color="text-emerald-600" />
        <StatCard label="Total Value" value="Ksh 0.00" icon={<Wallet className="w-5 h-5" />} color="text-emerald-600" />
        <StatCard label="Total Contributions" value="Ksh 0.00" icon={<TrendingUp className="w-5 h-5" />} color="text-emerald-600" />
        <StatCard label="Active Loans" value="Ksh 0.00" icon={<CreditCard className="w-5 h-5" />} color="text-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-neutral-100 p-8 min-h-[400px] flex flex-col relative shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[13px] font-bold text-neutral-900 uppercase tracking-wider">Chama Performance</h3>
              <div className="relative group w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search Chamas..." 
                  className="w-full pl-10 pr-4 py-1.5 bg-white border border-neutral-100 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none text-xs transition-all"
                />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center flex-col text-neutral-400">
              <p className="text-sm font-medium italic">No Chamas yet. Create one to get started!</p>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-[13px] font-bold text-neutral-900 uppercase tracking-wider">Status</h3>
            </div>
            <div className="space-y-4">
              <StatusRow label="Active Groups" value="0" />
              <StatusRow label="Pending Approvals" value="0" />
              <StatusRow label="Inactive Groups" value="0" />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <RefreshCcw className="w-5 h-5 text-blue-500" />
              <h3 className="text-[13px] font-bold text-neutral-900 uppercase tracking-wider">Recent Activity</h3>
            </div>
            <div className="flex items-center justify-center py-8 text-neutral-400 text-xs font-semibold tracking-widest uppercase">
              No recent activity
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: string, icon: any, color: string }) {
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

function StatusRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between group cursor-default">
      <span className="text-sm text-neutral-500 group-hover:text-emerald-600 transition-colors font-medium">{label}</span>
      <span className="text-sm font-bold text-neutral-900">{value}</span>
    </div>
  );
}

function SkeletonRow({ width = "w-full" }: { width?: string }) {
  return (
    <div className="space-y-2">
      <div className={cn("h-2 bg-neutral-100 rounded-full", width)} />
      <div className="h-1.5 bg-neutral-100/50 rounded-full w-1/3" />
    </div>
  );
}

function PageHeader({ title, subtitle, breadcrumb, actions }: { title: string, subtitle?: string, breadcrumb: string, actions?: React.ReactNode }) {
  return (
    <div className="mb-8 space-y-4">
      <button className="flex items-center gap-2 text-[#047857] hover:underline text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        {breadcrumb}
      </button>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] tracking-tight">{title}</h1>
          {subtitle && <p className="text-neutral-500 mt-1 text-sm font-medium">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}

function MembersView({ groupName }: { groupName: string }) {
  return (
    <div className="animate-in fade-in duration-500 bg-[#F9FAFB] -m-8 p-8 min-h-[calc(100vh-64px)]">
      <PageHeader 
        title={groupName}
        subtitle="Members"
        breadcrumb={`Back to ${groupName}`}
        actions={
          <>
            <Button variant="outline" className="gap-2 text-neutral-700 h-11 border-neutral-200 shadow-sm px-4">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
               Import
            </Button>
            <Button className="bg-[#047857] hover:bg-[#065f46] text-white rounded-lg h-11 px-6 font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Member
            </Button>
          </>
        }
      />

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-50">
          <h3 className="text-[18px] font-bold text-neutral-900">Members (1)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F9FAFB] text-neutral-500 text-xs font-bold uppercase tracking-widest border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-400">KI</div>
                    <span className="font-bold text-sm text-neutral-900">Kevin Isom</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-neutral-600">kevinisom9000@gmail.com</td>
                <td className="px-6 py-4 text-sm font-medium text-neutral-600">+254758750620</td>
                <td className="px-6 py-4">
                  <span className="text-[11px] font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">ChamaAdmin</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-[11px] font-black px-3 py-1 bg-emerald-500 text-white rounded-full uppercase tracking-tighter">You</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FinesView({ groupName }: { groupName: string }) {
  const [activeTab, setActiveTab] = useState('fines');
  return (
    <div className="animate-in fade-in duration-500 bg-[#F9FAFB] -m-8 p-8 min-h-[calc(100vh-64px)]">
      <PageHeader 
        title={groupName}
        subtitle="Fines & Appeals Management"
        breadcrumb={`Back to ${groupName}`}
        actions={
          <>
            <Button variant="outline" className="gap-2 text-neutral-700 h-11 border-neutral-200 shadow-sm px-4">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
               Import
            </Button>
            <Button className="bg-[#047857] hover:bg-[#065f46] text-white rounded-lg h-11 px-6 font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Fine
            </Button>
          </>
        }
      />

      <div className="flex items-center gap-8 mb-4 border-b border-neutral-100 h-12">
        <button 
          onClick={() => setActiveTab('fines')}
          className={cn("h-full px-2 text-sm font-bold transition-all flex items-center gap-2", activeTab === 'fines' ? "text-emerald-600 border-b-2 border-emerald-600" : "text-neutral-400 hover:text-neutral-600")}
        >
          <ShieldCheck className="w-4 h-4" />
          Fines
        </button>
        <button 
          onClick={() => setActiveTab('appeals')}
          className={cn("h-full px-2 text-sm font-bold transition-all flex items-center gap-2", activeTab === 'appeals' ? "text-emerald-600 border-b-2 border-emerald-600" : "text-neutral-400 hover:text-neutral-600")}
        >
          <MessageSquare className="w-4 h-4" />
          Appeals
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm min-h-[400px] flex flex-col">
        <div className="px-6 py-5 border-b border-neutral-50 flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-neutral-900 tracking-tight">Fines List</h3>
          <RefreshCcw className="w-4 h-4 text-neutral-300 cursor-pointer hover:text-emerald-500 transition-colors" />
        </div>
        <div className="flex-1 flex items-center justify-center text-neutral-400 p-8 text-center italic font-medium">
           No fines found
        </div>
      </div>
    </div>
  );
}

function SharesView({ groupName }: { groupName: string }) {
  return (
    <div className="animate-in fade-in duration-500 bg-[#F9FAFB] -m-8 p-8 min-h-[calc(100vh-64px)]">
      <PageHeader 
        title="Share Capital Management"
        subtitle="Track and manage member shareholding"
        breadcrumb={`Back to ${groupName}`}
        actions={
          <>
            <Button variant="outline" className="gap-2 text-neutral-700 h-11 border-neutral-200 shadow-sm px-4 font-bold text-sm">
               <Settings className="w-4 h-4" />
               Configure Shares
            </Button>
            <Button className="bg-[#047857] hover:bg-[#065f46] text-white rounded-lg h-11 px-6 font-bold shadow-sm flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 rotate-90" />
              Transfer Shares
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatItem label="Shares Held" value="0" sub="Your shares" icon={<RefreshCcw className="w-6 h-6 text-white" />} color="bg-blue-500" containerColor="bg-blue-50/50 border-blue-100 text-blue-600" />
        <StatItem label="Share Value" value="Ksh 0.00" sub="Your value" icon={<DollarSign className="w-6 h-6 text-white" />} color="bg-emerald-500" containerColor="bg-emerald-50/50 border-emerald-100 text-emerald-600" />
        <StatItem label="Nominal Value" value="Ksh 1,000.00" sub="Per share" icon={<TrendingUp className="w-6 h-6 text-white" />} color="bg-purple-500" containerColor="bg-purple-50/50 border-purple-100 text-purple-600" />
        <StatItem label="Shareholders" value="1" sub="Total members" icon={<Users className="w-6 h-6 text-white" />} color="bg-orange-500" containerColor="bg-orange-50/50 border-orange-100 text-orange-600" />
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-neutral-100 p-8 shadow-sm">
           <div className="flex items-center gap-4 mb-8">
              <h3 className="text-xl font-extrabold text-[#111827] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-neutral-100">
                  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-neutral-900" stroke="currentColor" strokeWidth="2"><path d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" /></svg>
                </div>
                Share Capital Utilization
              </h3>
           </div>
           
           <div className="space-y-6 px-4">
             <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-neutral-900">Issued Shares</span>
                <span className="text-neutral-900">0 / 1000000</span>
             </div>
             <div className="h-2.5 w-full bg-neutral-50 rounded-full overflow-hidden border border-neutral-100">
                <div className="h-full bg-emerald-500 w-0 transition-all duration-300" />
             </div>
             <div className="flex items-center justify-between text-[11px] font-black uppercase text-neutral-400 tracking-widest leading-none pt-1">
                <span>0.0% utilized</span>
                <span>1000000 shares remaining</span>
             </div>
           </div>
        </div>

        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
           <div className="px-8 py-6 border-b border-neutral-50 bg-[#F9FAFB]/30">
              <h3 className="text-xl font-extrabold text-[#111827] tracking-tight">Shareholder Distribution</h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-[#F9FAFB] font-bold text-neutral-400 uppercase text-[11px] tracking-widest border-b border-neutral-100">
                    <tr>
                       <th className="px-8 py-5">Member</th>
                       <th className="px-8 py-5">Shares Held</th>
                       <th className="px-8 py-5">Share Value</th>
                       <th className="px-8 py-5">Ownership %</th>
                       <th className="px-8 py-5 text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    <tr className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-400">KI</div>
                             <div>
                                <p className="font-bold text-[#111827]">Kevin Isom</p>
                                <p className="text-[11px] font-bold text-neutral-400 uppercase">ChamaAdmin</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6 font-bold text-[#111827]">0</td>
                       <td className="px-8 py-6 font-bold text-[#111827]">Ksh 0.00</td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4 w-52">
                             <div className="h-2 flex-1 bg-neutral-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-0" />
                             </div>
                             <span className="text-xs font-bold text-neutral-400 w-10">0.0%</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-500 rounded-full font-bold text-[10px] uppercase tracking-wider">No Shares</span>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, sub, icon, color, containerColor }: { label: string, value: string, sub: string, icon: any, color: string, containerColor: string }) {
  return (
    <div className={cn("rounded-2xl border p-6 flex items-center justify-between shadow-sm transition-transform hover:scale-[1.02]", containerColor)}>
      <div className="space-y-1">
        <p className="text-[13px] font-extrabold uppercase tracking-tight mb-2">{label}</p>
        <h4 className="text-2xl font-black text-[#111827] tracking-tighter leading-none">{value}</h4>
        <p className="text-xs text-neutral-400 font-medium pt-1">{sub}</p>
      </div>
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white shrink-0", color)}>
        {icon}
      </div>
    </div>
  );
}

function IncomeView({ groupName }: { groupName: string }) {
  return (
    <div className="animate-in fade-in duration-500 bg-[#F9FAFB] -m-8 p-8 min-h-[calc(100vh-64px)]">
      <PageHeader 
        title={groupName}
        subtitle="Income"
        breadcrumb={`Back to ${groupName}`}
        actions={
          <Button variant="outline" className="gap-2 text-neutral-700 h-11 border-neutral-200 px-4 shadow-sm font-bold text-sm">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
             Import
          </Button>
        }
      />

      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm min-h-[400px] flex flex-col">
        <div className="px-8 py-6 border-b border-neutral-50 bg-[#F9FAFB]/30">
          <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Income</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-neutral-400 p-8 text-center italic font-medium">
           No income transactions found
        </div>
      </div>
    </div>
  );
}

function SettingsView({ groupName }: { groupName: string }) {
  const [activeTab, setActiveTab] = useState('Group Info');
  const tabs = ['Group Info', 'Settings', 'Documents', 'Fine Rules', 'Welfare'];

  return (
    <div className="animate-in fade-in duration-500 bg-[#F9FAFB] -m-8 p-8 min-h-[calc(100vh-64px)] overflow-x-hidden">
      <PageHeader 
        title="Settings"
        breadcrumb={`Back to ${groupName}`}
      />

      <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden p-8 max-w-4xl mx-auto md:mx-0">
        <div className="flex items-center gap-10 border-b border-neutral-100 mb-10 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 text-[13px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab ? "text-emerald-600 border-b-2 border-emerald-600" : "text-neutral-400 hover:text-neutral-600"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-400">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-2.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-neutral-500 ml-1">Group Name</label>
              <input type="text" readOnly value={groupName} className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-xl font-bold text-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm" />
            </div>
            <div className="space-y-2.5 row-span-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-neutral-500 ml-1">Description</label>
              <textarea 
                className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-xl font-bold text-neutral-900 h-[154px] resize-none outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm leading-relaxed"
                defaultValue="LESOM Venture Studio platform SACCO"
              ></textarea>
            </div>
            <div className="space-y-2.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-neutral-500 ml-1">Type</label>
              <div className="relative">
                <select className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-xl font-bold text-neutral-900 outline-none appearance-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm cursor-pointer">
                  <option>SACCO</option>
                  <option>Investment Group</option>
                  <option>Welfare Club</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-2.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-neutral-500 ml-1">Meeting Day</label>
              <div className="relative">
                <select className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-xl font-bold text-neutral-900 outline-none appearance-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm cursor-pointer">
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                  <option>Saturday</option>
                  <option>Sunday</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-neutral-500 ml-1">Meeting Time</label>
              <input type="text" value="05:00 PM" className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-xl font-bold text-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-2.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-neutral-500 ml-1">Contribution Frequency</label>
              <div className="relative">
                <select className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-xl font-bold text-neutral-900 outline-none appearance-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm cursor-pointer">
                  <option>Once per Month</option>
                  <option>Weekly</option>
                  <option>Bi-Weekly</option>
                  <option>Quarterly</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-neutral-500 ml-1">Fine Percentage (%)</label>
              <input type="text" value="5" className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-xl font-bold text-neutral-900 outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm" />
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-neutral-50">
             <h3 className="text-xl font-extrabold text-[#111827] tracking-tight">Group Constitution</h3>
             <div className="border-2 border-dashed border-neutral-200 rounded-[1.5rem] p-12 flex flex-col items-center justify-center gap-5 hover:bg-neutral-50 hover:border-emerald-500/30 transition-all cursor-pointer group shadow-sm bg-neutral-50/10">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 transition-all group-hover:scale-110 group-hover:rotate-12 shadow-sm ring-4 ring-white">
                   <Plus className="w-8 h-8" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-neutral-900 tracking-tight">Upload Group Constitution Document</p>
                  <p className="text-xs text-neutral-400 font-medium">Drag & drop or click to browse</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalsView({ groupName }: { groupName: string }) {
  return (
    <div className="animate-in fade-in duration-500 bg-[#F9FAFB] -m-8 p-8 min-h-[calc(100vh-64px)]">
      <PageHeader 
        title={`${groupName} Goals`}
        subtitle="Manage your group financial targets"
        breadcrumb={`Back to ${groupName}`}
        actions={
          <Button className="bg-[#047857] hover:bg-[#065f46] text-white rounded-lg h-11 px-6 font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Goal
          </Button>
        }
      />

      <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm min-h-[400px] flex flex-col">
        <div className="flex-1 flex items-center justify-center text-neutral-400 p-20 text-center italic font-medium">
           No goals yet. Create a new goal to get started.
        </div>
      </div>
    </div>
  );
}

function ContributionsView({ groupName }: { groupName: string }) {
  return (
    <div className="animate-in fade-in duration-500 bg-[#F9FAFB] -m-8 p-8 min-h-[calc(100vh-64px)]">
      <PageHeader 
        title={groupName}
        subtitle="Contributions"
        breadcrumb={`Back to ${groupName}`}
        actions={
          <Button className="bg-[#047857] hover:bg-[#065f46] text-white rounded-lg h-11 px-6 font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Contribution
          </Button>
        }
      />
      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm min-h-[400px] flex items-center justify-center text-neutral-400 italic">
        No contributions recorded yet.
      </div>
    </div>
  );
}

function LoansView({ groupName }: { groupName: string }) {
  return (
    <div className="animate-in fade-in duration-500 bg-[#F9FAFB] -m-8 p-8 min-h-[calc(100vh-64px)]">
      <PageHeader 
        title={groupName}
        subtitle="Loans"
        breadcrumb={`Back to ${groupName}`}
        actions={
          <Button className="bg-[#047857] hover:bg-[#065f46] text-white rounded-lg h-11 px-6 font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Loan Application
          </Button>
        }
      />
      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm min-h-[400px] flex items-center justify-center text-neutral-400 italic">
        No active loans found.
      </div>
    </div>
  );
}

function ExpensesView({ groupName }: { groupName: string }) {
  return (
    <div className="animate-in fade-in duration-500 bg-[#F9FAFB] -m-8 p-8 min-h-[calc(100vh-64px)]">
      <PageHeader 
        title={groupName}
        subtitle="Expenses"
        breadcrumb={`Back to ${groupName}`}
        actions={
          <Button className="bg-[#047857] hover:bg-[#065f46] text-white rounded-lg h-11 px-6 font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Record Expense
          </Button>
        }
      />
      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm min-h-[400px] flex items-center justify-center text-neutral-400 italic">
        No expenses recorded yet.
      </div>
    </div>
  );
}
