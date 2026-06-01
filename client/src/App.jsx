import { lazy, Suspense, useEffect, useState } from "react";
import { 
  Brain, 
  LayoutDashboard, 
  LogOut, 
  PiggyBank, 
  ReceiptText, 
  UserRound,
  Menu,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { AuthPanel } from "./components/features/AuthPanel";
import { FinancialOverviewSection } from "./components/features/FinancialOverviewSection";
import { ProfileSection } from "./components/features/ProfileSection";
import { BrandLogo } from "./components/ui/BrandLogo";
import { ExpenseTable } from "./components/ui/ExpenseTable";
import { MetricCard } from "./components/ui/MetricCard";
import { Navbar } from "./components/ui/Navbar";
import { formatCurrency } from "./utils/format";

// New styled components
import { HeroCard } from "./components/ui/HeroCard";
import { MiniSummaryCards } from "./components/ui/MiniSummaryCards";
import { ChartsSection } from "./components/ui/ChartsSection";
import { RecentTransactionsList } from "./components/ui/RecentTransactionsList";
import { SpendingCategoryCard } from "./components/ui/SpendingCategoryCard";
import { FloatingActionButton } from "./components/ui/FloatingActionButton";
import { TransactionModal } from "./components/shared/TransactionModal";

import {
  changePassword,
  createExpense,
  deleteExpense,
  fetchMe,
  fetchDashboard,
  fetchExpenses,
  fetchInsights,
  getApiErrorMessage,
  getStoredToken,
  login,
  setStoredToken,
  signup,
  updateExpense,
  updateProfile as updateProfileRequest,
} from "./services/api";

const getDefaultMonth = () => new Date().toISOString().slice(0, 7);
const InsightsPanel = lazy(() =>
  import("./components/features/InsightsPanel").then((module) => ({ default: module.InsightsPanel })),
);

// Demo data matching user's exact clone requirements
const initialDemoExpenses = [
  {
    _id: "demo-1",
    title: "Salary",
    amount: 50000,
    type: "income",
    category: "Salary",
    paymentMethod: "Bank Transfer",
    date: "2026-04-25",
    tags: ["salary", "monthly"],
    notes: "Primary monthly income",
  },
  {
    _id: "demo-2",
    title: "Dhdj",
    amount: 9595,
    type: "expense",
    category: "Food",
    paymentMethod: "Card",
    date: "2026-04-25",
    tags: ["food", "lunch"],
    notes: "Catering/Food expense",
  }
];

const getDemoSummary = (demoList) => {
  const totalIncome = demoList.filter(e => e.type === "income" || e.type === "Income").reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = demoList.filter(e => e.type === "expense" || e.type === "Expense").reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const transactionCount = demoList.length;

  const categoryMap = {};
  demoList.filter(e => e.type === "expense" || e.type === "Expense").forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });
  const categoryBreakdown = Object.keys(categoryMap).map(cat => ({
    category: cat,
    total: categoryMap[cat],
  }));

  return {
    totalExpenses,
    totalIncome,
    netBalance,
    transactionCount,
    categoryBreakdown,
    monthlyTrend: [
      { month: "Jan", total: 4000 },
      { month: "Feb", total: 5500 },
      { month: "Mar", total: 6000 },
      { month: "Apr", total: totalExpenses },
    ],
    budgetStatus: [],
  };
};

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [month] = useState(getDefaultMonth());
  
  // Demo Mode and Demo State
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoExpenses, setDemoExpenses] = useState(initialDemoExpenses);
  const [demoSummary, setDemoSummary] = useState(getDemoSummary(initialDemoExpenses));

  // Live Mode API State
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    netBalance: 0,
    transactionCount: 0,
    categoryBreakdown: [],
    monthlyTrend: [],
    budgetStatus: [],
  });
  const [expenses, setExpenses] = useState([]);
  const [insights, setInsights] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [profileLoading, setProfileLoading] = useState({
    profile: false,
    password: false,
    message: "",
  });
  const [error, setError] = useState("");
  
  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [modalInitialType, setModalInitialType] = useState("expense");
  const [activeTimeline, setActiveTimeline] = useState("Monthly");

  // Recalculate demo summary when demo expenses change
  useEffect(() => {
    setDemoSummary(getDemoSummary(demoExpenses));
  }, [demoExpenses]);

  const loadData = async () => {
    if (isDemoMode) return;
    try {
      setError("");
      const [dashboardData, expenseData] = await Promise.all([
        fetchDashboard(month),
        fetchExpenses({ month }),
      ]);

      setSummary(dashboardData);
      setExpenses(expenseData);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load data."));
    }
  };

  const loadInsights = async () => {
    if (isDemoMode) return;
    try {
      setLoadingInsights(true);
      const insightData = await fetchInsights(month);
      setInsights(insightData);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load AI insights."));
    } finally {
      setLoadingInsights(false);
    }
  };

  const bootstrap = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setIsDemoMode(false);
      setBooting(false);
      return;
    }

    try {
      const response = await fetchMe();
      setUser(response.user);
      setIsDemoMode(false); // If token is found, connect live automatically
    } catch (_error) {
      setStoredToken(null);
      setUser(null);
      setIsDemoMode(false);
      setError("Stored session is invalid. Please log in again.");
    } finally {
      setBooting(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  useEffect(() => {
    if (user && !isDemoMode) {
      Promise.all([loadData(), loadInsights()]);
    }
  }, [month, user, isDemoMode]);

  // Handle Form submissions (Unified for both modal and sidebars)
  const handleExpenseSubmit = async (payload) => {
    if (isDemoMode) {
      if (editingExpense?._id) {
        // Edit existing
        setDemoExpenses(prev =>
          prev.map(e => e._id === editingExpense._id ? { ...e, ...payload, amount: Number(payload.amount) } : e)
        );
      } else {
        // Create new
        const newTx = {
          _id: `demo-${Date.now()}`,
          ...payload,
          amount: Number(payload.amount),
        };
        setDemoExpenses(prev => [newTx, ...prev]);
      }
      setEditingExpense(null);
      return true;
    }

    try {
      if (editingExpense?._id) {
        await updateExpense(editingExpense._id, payload);
      } else {
        await createExpense(payload);
      }
      setEditingExpense(null);
      await loadData();
      await loadInsights();
      return true;
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to save transaction."));
      return false;
    }
  };

  const handleDeleteExpense = async (id) => {
    if (isDemoMode) {
      setDemoExpenses(prev => prev.filter(e => e._id !== id));
      if (editingExpense?._id === id) {
        setEditingExpense(null);
      }
      return;
    }

    try {
      await deleteExpense(id);
      if (editingExpense?._id === id) {
        setEditingExpense(null);
      }
      await loadData();
      await loadInsights();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to delete transaction."));
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setModalInitialType(expense.type);
    setIsTransactionModalOpen(true);
  };

  const handleAuthSubmit = async (payload) => {
    try {
      setAuthLoading(true);
      setError("");
      const action = authMode === "login" ? login : signup;
      const response = await action(payload);
      const authenticatedUser = {
        ...response.user,
        name: response.user?.name || payload.name || payload.email.split("@")[0],
        email: response.user?.email || payload.email,
      };
      setStoredToken(response.token);
      setUser(authenticatedUser);
      setIsDemoMode(false);
      setActiveSection("dashboard");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Authentication failed."));
    } finally {
      setAuthLoading(false);
      setBooting(false);
    }
  };

  const handleLogout = () => {
    setStoredToken(null);
    setUser(null);
    setIsDemoMode(false);
    setDemoExpenses(initialDemoExpenses);
    setActiveSection("dashboard");
  };

  const handleDemoStart = () => {
    setStoredToken(null);
    setUser({ name: "Demo User", email: "demo@example.com" });
    setIsDemoMode(true);
    setDemoExpenses(initialDemoExpenses);
    setError("");
    setActiveSection("dashboard");
  };

  const handleProfileUpdate = async (payload) => {
    if (isDemoMode) {
      setUser(prev => ({ ...prev, ...payload }));
      return;
    }
    try {
      setError("");
      setProfileLoading({ profile: true, password: false, message: "" });
      const response = await updateProfileRequest(payload);
      setUser(response.user);
      setProfileLoading({
        profile: false,
        password: false,
        message: "Profile updated successfully.",
      });
    } catch (requestError) {
      setProfileLoading({ profile: false, password: false, message: "" });
      setError(getApiErrorMessage(requestError, "Unable to update profile."));
      throw requestError;
    }
  };

  const handlePasswordChange = async (payload) => {
    if (isDemoMode) return;
    try {
      setError("");
      setProfileLoading({ profile: false, password: true, message: "" });
      await changePassword(payload);
      setProfileLoading({
        profile: false,
        password: false,
        message: "Password changed successfully.",
      });
    } catch (requestError) {
      setProfileLoading({ profile: false, password: false, message: "" });
      setError(getApiErrorMessage(requestError, "Unable to change password."));
      throw requestError;
    }
  };

  // Switch between Demo Mode and Live Mode
  const toggleDemoMode = async () => {
    if (isDemoMode) {
      // Trying to switch to Live Mode
      const token = getStoredToken();
      if (!token) {
        // No token, must show Auth screen
        setUser(null);
        setIsDemoMode(false);
      } else {
        try {
          const response = await fetchMe();
          setUser(response.user);
          setIsDemoMode(false);
          setError("");
        } catch (requestError) {
          setStoredToken(null);
          setUser(null);
          setIsDemoMode(false);
          setError(getApiErrorMessage(requestError, "Please log in to use live mode."));
        }
      }
    } else {
      // Switching to Demo Mode
      setIsDemoMode(true);
      setUser({ name: "Demo User", email: "demo@example.com" });
    }
  };

  // Resolve current active data based on Demo or Live Mode
  const currentSummary = isDemoMode ? demoSummary : summary;
  const currentExpenses = isDemoMode ? demoExpenses : expenses;
  const displayUser = isDemoMode
    ? { name: "Demo User", email: "demo@example.com" }
    : user;

  const incomeRecords = currentExpenses.filter((expense) => expense.type === "income" || expense.type === "Income");
  const expenseRecords = currentExpenses.filter((expense) => expense.type === "expense" || expense.type === "Expense");
  const visibleExpenses = activeSection === "income" ? incomeRecords : activeSection === "expenses" ? expenseRecords : currentExpenses;

  // Navigation configurations
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "income", label: "Income", icon: PiggyBank },
    { id: "expenses", label: "Expenses", icon: ReceiptText },
    { id: "insights", label: "AI Coach", icon: Brain },
    { id: "profile", label: "Profile", icon: UserRound },
  ];

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-customBg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Loading Expense Tracker...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthPanel
        mode={authMode}
        onModeChange={setAuthMode}
        onSubmit={handleAuthSubmit}
        onDemoStart={handleDemoStart}
        loading={authLoading}
        error={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-customBg flex font-sans">
      
      {/* Sidebar Navigation */}
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-100 z-20">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <BrandLogo className="shadow-md shadow-teal-100" />
          <div>
            <h1 className="font-extrabold font-outfit text-slate-800 text-base leading-none">
              Expense Tracker
            </h1>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
              Personal Finance
            </span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-premium ${
                  isActive
                    ? "bg-teal-500 text-white shadow-md shadow-teal-100"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-premium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white border-r border-slate-100 z-10 animate-float" style={{ animationDuration: "0s" }}>
            <div className="absolute top-4 right-4">
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <BrandLogo className="shadow-md shadow-teal-100" />
              <div>
                <h1 className="font-extrabold font-outfit text-slate-800 text-base leading-none">
                  Expense Tracker
                </h1>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Personal Finance
                </span>
              </div>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-premium ${
                      isActive
                        ? "bg-teal-500 text-white shadow-md"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-premium"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        
        {/* Navbar */}
        <Navbar
          user={displayUser}
          onLogout={handleLogout}
          onProfileOpen={() => setActiveSection("profile")}
          isDemoMode={isDemoMode}
          onToggleDemo={toggleDemoMode}
        />

        {/* Mobile Navbar Header */}
        <div className="md:hidden flex items-center justify-between px-6 py-3 bg-white border-b border-slate-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 font-outfit font-extrabold text-slate-800">
            <BrandLogo size="sm" />
            <span>Dashboard</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center text-xs">
            {displayUser?.name?.[0]?.toUpperCase() || "U"}
          </div>
        </div>

        {/* Application Page Feed */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-8 pb-24">
          
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {activeSection === "dashboard" && (() => {
            const displayIncome = currentSummary.totalIncome;
            const displayExpenses = currentSummary.totalExpenses;
            const displaySavings = Math.max(displayIncome - displayExpenses, 0);
            const displaySavingsRate = isDemoMode 
              ? 81 
              : (displayIncome > 0 ? Math.round((displaySavings / displayIncome) * 100) : 0);

            const getSavingsLabel = (rate) => {
              if (isDemoMode) return "Excellent";
              if (rate >= 50) return "Excellent";
              if (rate >= 20) return "Good";
              if (rate > 0) return "Fair";
              return "No savings";
            };

            const displayTrendText = isDemoMode ? "+$2,150 this week" : "Monthly ledger tracking";
            const displayIncomeTrend = isDemoMode ? "12.4" : undefined;
            const displayExpenseTrend = isDemoMode ? "8.2" : undefined;

            return (
              <>
                {/* Header Intro Title & Subtitle */}
                <div className="flex flex-col gap-1">
                  <h2 className="text-3xl font-extrabold font-outfit text-slate-800 tracking-tight flex items-center gap-2">
                    Dashboard
                  </h2>
                  <p className="text-slate-400 text-sm font-medium">
                    Welcome back, {displayUser?.name || "User"}
                  </p>
                </div>

                {/* Top Stats Grid (2x2 on mobile) */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <MetricCard 
                    label="Total Balance" 
                    value={currentSummary.netBalance} 
                    tone="success" 
                    trendText={displayTrendText}
                  />
                  <MetricCard 
                    label="Monthly Income" 
                    value={currentSummary.totalIncome} 
                    tone="success" 
                    trendValue={displayIncomeTrend}
                  />
                  <MetricCard 
                    label="Monthly Expenses" 
                    value={currentSummary.totalExpenses} 
                    tone="warning" 
                    trendValue={displayExpenseTrend}
                  />
                  <MetricCard 
                    label="Savings Rate" 
                    value={`${displaySavingsRate}%`} 
                    format="plain"
                    tone="default"
                    statusLabel={getSavingsLabel(displaySavingsRate)}
                  />
                </section>

                {/* Main Financial Overview Title bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mt-4">
                  <h3 className="text-xl font-bold font-outfit text-slate-800">
                    Financial Overview (This Month)
                  </h3>
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                    <SlidersHorizontal size={18} />
                  </button>
                </div>

                {/* Large Hero Card Section */}
                <HeroCard
                  onAddTransactionClick={() => {
                    setModalInitialType(null);
                    setEditingExpense(null);
                    setIsTransactionModalOpen(true);
                  }}
                  activeTimeline={activeTimeline}
                  onTimelineChange={setActiveTimeline}
                />

                {/* Below Hero: 3 Summary Mini Cards */}
                <MiniSummaryCards
                  balance={currentSummary.netBalance}
                  expenses={currentSummary.totalExpenses}
                  savings={displaySavings}
                  income={currentSummary.totalIncome}
                  isDemoMode={isDemoMode}
                />

                {/* Semicircle Gauges Section Row */}
                <ChartsSection 
                  summary={currentSummary} 
                  isDemoMode={isDemoMode}
                />

                {/* Recent Transactions List & Spending by Category Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <RecentTransactionsList
                    transactions={currentExpenses}
                    isDemoMode={isDemoMode}
                    onViewAllClick={() => setActiveSection("expenses")}
                  />

                  <SpendingCategoryCard
                    categories={currentSummary.categoryBreakdown}
                    totalIncome={currentSummary.totalIncome}
                    totalExpenses={currentSummary.totalExpenses}
                    isDemoMode={isDemoMode}
                  />
                </div>
              </>
            );
          })()}

          {activeSection === "income" && (
            <FinancialOverviewSection
              type="income"
              month={month}
              summary={currentSummary}
              expenses={incomeRecords}
              recentTransactions={currentExpenses}
              editingExpense={editingExpense}
              onSubmit={handleExpenseSubmit}
              onCancel={() => setEditingExpense(null)}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          )}

          {activeSection === "expenses" && (
            <FinancialOverviewSection
              type="expense"
              month={month}
              summary={currentSummary}
              expenses={expenseRecords}
              recentTransactions={currentExpenses}
              editingExpense={editingExpense}
              onSubmit={handleExpenseSubmit}
              onCancel={() => setEditingExpense(null)}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          )}

          {activeSection === "profile" && (
            <ProfileSection
              user={displayUser}
              onLogout={handleLogout}
              onProfileUpdate={handleProfileUpdate}
              onPasswordChange={handlePasswordChange}
              loading={profileLoading}
            />
          )}

          {activeSection === "insights" && (
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100">
                <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-slate-400 font-semibold mt-4">Consulting AI Financial Advisor...</span>
              </div>
            }>
              <InsightsPanel
                insights={insights}
                loading={loadingInsights}
                onRefresh={loadInsights}
                isDemoMode={isDemoMode}
              />
            </Suspense>
          )}

          {/* Details Table view underneath the sub-views */}
          {activeSection !== "profile" && activeSection !== "insights" && (
            <div className="bg-white rounded-[16px] border border-slate-100 p-6 shadow-premium">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-bold font-outfit text-slate-800">
                  Transactions Ledger
                </h4>
                <span className="text-xs text-slate-400 font-semibold">
                  Showing {visibleExpenses.length} records
                </span>
              </div>
              <ExpenseTable 
                expenses={visibleExpenses} 
                onEdit={handleEditExpense} 
                onDelete={handleDeleteExpense} 
              />
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Button (FAB) */}
      <FloatingActionButton
        onAddIncome={() => {
          setModalInitialType("income");
          setEditingExpense(null);
          setIsTransactionModalOpen(true);
        }}
        onAddExpense={() => {
          setModalInitialType("expense");
          setEditingExpense(null);
          setIsTransactionModalOpen(true);
        }}
        onToggleDemo={toggleDemoMode}
        isDemoMode={isDemoMode}
      />

      {/* Transaction Modal (Add/Edit Dialog) */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleExpenseSubmit}
        editingExpense={editingExpense}
        initialType={modalInitialType}
      />

    </div>
  );
}

export default App;
