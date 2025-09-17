import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Target, 
  CreditCard, 
   
  Bell, 
  Database,
  LogOut,
  Menu,
  X,
  Search,
   
  RefreshCw,
   
  Plus,
  
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Activity,
  LayoutDashboard,
  ListTodo,
  UserCheck,
  MessageSquare
} from 'lucide-react';

// Import admin components
import UserManager from './components/UserManager';
import Analytics from './components/Analytics';
import PaymentManager from './components/PaymentManager';
import SystemSettings from './components/SystemSettings';
import NotificationManager from './components/NotificationManager';
import DatabaseManager from './components/DatabaseManager';
import Dashboard from './airdrop/Dashboard/Dashboard';
import AirdropUsers from './airdrop/Users/Users';
import MainTasks from './airdrop/Tasks/Tasks';
import AirdropNotices from './airdrop/Notices';
import LoginForm from './LoginForm';

// Create refresh context
interface RefreshContextType {
  isRefreshing: boolean;
  triggerRefresh: () => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
};

// Create search context
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  avatar?: string;
  lastLogin: string;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  completedTasks: number;
  totalEarnings: number;
  pendingWithdrawals: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  serverUptime: string;
}

const AdminPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [airdropOpen, setAirdropOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const  dashboardStats : DashboardStats= {
    totalUsers: 15420,
    activeUsers: 8930,
    totalTasks: 156,
    completedTasks: 89340,
    totalEarnings: 125430.50,
    pendingWithdrawals: 23450.75,
    systemHealth: 'healthy',
    serverUptime: '99.9%'
  }

  useEffect(() => {
    // Simulate admin user login
    setCurrentUser({
      id: '1',
      email: 'admin@itonzi.com',
      name: 'ZIKRUL ISLAM',
      role: 'super_admin',
      avatar: '👨‍💼',
      lastLogin: new Date().toISOString()
    });
  }, []);

  // Simple hardcoded login check
  const adminUsers = [
    { userid: 'zikrul', password: '33019261' },
    { userid: 'Admin', password: '345467' },
    // Add more users here as needed
  ];

  const handleLogin = (userid: string, password: string) => {
    const found = adminUsers.find(
      user => user.userid === userid && user.password === password
    );
    if (found) {
      setIsLoggedIn(true);
      setLoginError(null);
    } else {
      setLoginError('Invalid User ID or Password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveSection('dashboard');
    setAirdropOpen(false);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  // Show login form if not logged in
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} error={loginError ?? undefined} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' },
    { id: 'users', label: 'User Manager', icon: Users, color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-500/30' },
    { id: 'payments', label: 'Payments', icon: CreditCard, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' },
    { id: 'airdrop', label: 'Airdrop', icon: DollarSign, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500/30', isDropdown: true, subItems: [
      { id: 'airdrop_dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-400' },
      { id: 'airdrop_tasks', label: 'Tasks', icon: ListTodo, color: 'text-green-400' },
      { id: 'airdrop_users', label: 'Users', icon: UserCheck, color: 'text-purple-400' },
      { id: 'airdrop_notices', label: 'Notices', icon: MessageSquare, color: 'text-orange-400' },
    ] },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-500/30' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-pink-400', bgColor: 'bg-pink-500/20', borderColor: 'border-pink-500/30' },
    { id: 'database', label: 'Database', icon: Database, color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-400', bgColor: 'bg-gray-500/20', borderColor: 'border-gray-500/30' }
  ];

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-400 bg-green-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/20';
      case 'critical': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const triggerRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleSearchClick = () => {
    if (activeSection === 'users') {
      setIsSearchOpen(!isSearchOpen);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">iTonzi Admin Dashboard</h1>
              <p className="text-blue-100">Welcome back, {currentUser?.name}</p>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getSystemHealthColor(dashboardStats.systemHealth).split(' ')[1]}`}></div>
                  <span>System {dashboardStats.systemHealth}</span>
                </div>
                <div>Uptime: {dashboardStats.serverUptime}</div>
                <div>Last updated: {new Date().toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-blue-400">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="text-green-400 text-sm font-bold">+12.5%</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{dashboardStats.totalUsers.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Total Users</div>
                <div className="text-xs text-gray-500 mt-2">{dashboardStats.activeUsers.toLocaleString()} active today</div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-green-400">
                    <Target className="w-8 h-8" />
                  </div>
                  <div className="text-green-400 text-sm font-bold">+8.3%</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{dashboardStats.totalTasks}</div>
                <div className="text-gray-400 text-sm">Active Tasks</div>
                <div className="text-xs text-gray-500 mt-2">{dashboardStats.completedTasks.toLocaleString()} completed</div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-yellow-400">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <div className="text-green-400 text-sm font-bold">+15.7%</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">${dashboardStats.totalEarnings.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Total Earnings</div>
                <div className="text-xs text-gray-500 mt-2">${dashboardStats.pendingWithdrawals.toLocaleString()} pending</div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-purple-400">
                    <Activity className="w-8 h-8" />
                  </div>
                  <div className={`text-sm font-bold ${getSystemHealthColor(dashboardStats.systemHealth).split(' ')[0]}`}>
                    {dashboardStats.systemHealth.toUpperCase()}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{dashboardStats.serverUptime}</div>
                <div className="text-gray-400 text-sm">System Uptime</div>
                <div className="text-xs text-gray-500 mt-2">Last restart: 2 days ago</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-white font-bold text-lg mb-4">Recent User Activity</h3>
                <div className="space-y-3">
                  {[
                    { user: 'CryptoKing', action: 'Completed task', time: '2 min ago', type: 'success' },
                    { user: 'TonMaster', action: 'Withdrawal request', time: '5 min ago', type: 'warning' },
                    { user: 'AirdropHunter', action: 'New registration', time: '8 min ago', type: 'info' },
                    { user: 'DiamondHands', action: 'Referral bonus', time: '12 min ago', type: 'success' },
                    { user: 'MoonWalker', action: 'Task completion', time: '15 min ago', type: 'success' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-400' :
                          activity.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`}></div>
                        <div>
                          <div className="text-white font-medium">{activity.user}</div>
                          <div className="text-gray-400 text-sm">{activity.action}</div>
                        </div>
                      </div>
                      <div className="text-gray-500 text-xs">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-white font-bold text-lg mb-4">System Alerts</h3>
                <div className="space-y-3">
                  {[
                    { message: 'High withdrawal volume detected', severity: 'warning', time: '1 hour ago' },
                    { message: 'Database backup completed', severity: 'success', time: '2 hours ago' },
                    { message: 'New task template created', severity: 'info', time: '3 hours ago' },
                    { message: 'User verification pending', severity: 'warning', time: '4 hours ago' },
                    { message: 'System update available', severity: 'info', time: '6 hours ago' }
                  ].map((alert, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg">
                      <div className="mt-1">
                        {alert.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                        {alert.severity === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                        {alert.severity === 'info' && <Clock className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm">{alert.message}</div>
                        <div className="text-gray-500 text-xs mt-1">{alert.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-bold text-lg mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveSection('tasks')}
                  className="bg-green-600 hover:bg-green-500 p-4 rounded-lg transition-colors flex flex-col items-center gap-2"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-sm font-medium">Add Task</span>
                </button>
                <button 
                  onClick={() => setActiveSection('users')}
                  className="bg-blue-600 hover:bg-blue-500 p-4 rounded-lg transition-colors flex flex-col items-center gap-2"
                >
                  <Users className="w-6 h-6" />
                  <span className="text-sm font-medium">Manage Users</span>
                </button>
                <button 
                  onClick={() => setActiveSection('payments')}
                  className="bg-yellow-600 hover:bg-yellow-500 p-4 rounded-lg transition-colors flex flex-col items-center gap-2"
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm font-medium">Process Payments</span>
                </button>
                <button 
                  onClick={() => setActiveSection('analytics')}
                  className="bg-purple-600 hover:bg-purple-500 p-4 rounded-lg transition-colors flex flex-col items-center gap-2"
                >
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm font-medium">View Analytics</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'tasks':
        return <MainTasks />;
      case 'users':
        return <UserManager />;
      case 'payments':
        return <PaymentManager />;
      case 'analytics':
        return <Analytics />;
      case 'notifications':
        return <NotificationManager />;
      case 'database':
        return <DatabaseManager />;
      case 'settings':
        return <SystemSettings />;
      case 'airdrop_dashboard':
        return <Dashboard />;
      case 'airdrop_tasks':
        return <MainTasks />;

      case 'airdrop_users':
        return <AirdropUsers />;
      case 'airdrop_notices':
        return <AirdropNotices />;
      default:
        return <div className="text-white">Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`fixed md:static left-0 top-0 h-full md:h-auto bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700 transition-all duration-300 z-30 flex flex-col
          ${sidebarOpen ? 'w-64' : 'w-16'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
        style={{ minHeight: '100vh' }}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-600/20 to-purple-600/20 flex items-center justify-between flex-shrink-0">
            {sidebarOpen && (
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">iTonzi Admin</h2>
                <p className="text-gray-300 text-sm">Control Panel</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors md:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Scrollable Navigation Menu */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
            <nav className="px-4 space-y-2">
              {menuItems.map((item) => {
                if (item.isDropdown) {
                  // Airdrop dropdown
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => setAirdropOpen((open) => !open)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all border ${activeSection.startsWith('airdrop_') ? `${item.bgColor} ${item.borderColor} text-white` : 'text-gray-400 hover:text-white hover:bg-gray-700/50 border-transparent'} ${!sidebarOpen && 'justify-center'}`}
                      >
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        {sidebarOpen && <span className="font-medium">{item.label}</span>}
                        {sidebarOpen && (
                          <span className="ml-auto">{airdropOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}</span>
                        )}
                      </button>
                      {airdropOpen && sidebarOpen && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.subItems.map((sub) => {
                            const SubIcon = sub.icon;
                            const isActive = activeSection === sub.id;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => setActiveSection(sub.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left border ${
                                  isActive 
                                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-blue-500/50 shadow-lg' 
                                    : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-600/20 hover:to-gray-500/20 border-transparent hover:border-gray-500/30'
                                }`}
                              >
                                <div className={`p-1.5 rounded-md ${isActive ? 'bg-white/20' : 'bg-gray-700/50'}`}>
                                  <SubIcon className={`w-4 h-4 ${sub.color}`} />
                                </div>
                                <span className={`text-sm font-semibold ${isActive ? 'text-white' : sub.color}`}>
                                  {sub.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all border
                      ${activeSection === item.id ? `${item.bgColor} ${item.borderColor} text-white` : 'text-gray-400 hover:text-white hover:bg-gray-700/50 border-transparent'}
                      ${!sidebarOpen && 'justify-center'}
                    `}
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Fixed User Info at Bottom */}
          {sidebarOpen && currentUser && (
            <div className="border-t border-gray-700 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 flex-shrink-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                  <img src="https://i.ibb.co/60Jzx0KX/complete-0-EB4-EAC6-8-F81-4-A4-B-BA22-D1-CAE9933-FF6.png" alt="App Logo" className="w-full h-full rounded-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{currentUser.name}</div>
                  <div className="text-gray-300 text-xs">{currentUser.role.replace('_', ' ')}</div>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 p-2 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-red-500/20 rounded-lg transition-all duration-300 border border-transparent hover:border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        ></div>
      )}
      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 min-w-0 w-full
          ${sidebarOpen && 'md:ml-64'}
          ${!sidebarOpen && 'md:ml-16'}
          flex flex-col min-h-screen`}
      >
        {/* Top Bar */}
        <div className="bg-gray-800 border-b border-gray-700 p-2 sm:p-3 md:p-4 flex items-center justify-between sticky top-0 z-10 w-full h-auto min-h-[60px] sm:min-h-[70px] md:min-h-[80px]">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
            <button
              className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors md:hidden flex-shrink-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white capitalize truncate">
              {activeSection === 'dashboard' ? 'Dashboard' : activeSection.replace('_', ' ')}
            </h1>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 flex-shrink-0">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">Live</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap min-w-0 flex-shrink-0">
            {/* Search Section */}
            {activeSection === 'users' && (
              <div className="flex items-center gap-1 sm:gap-2">
                {isSearchOpen && (
                  <input
                    type="text"
                    placeholder="Search by User ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-2 py-1 sm:px-3 sm:py-2 bg-gray-700 text-white border border-gray-500 rounded-lg focus:outline-none focus:border-blue-500 text-xs sm:text-sm w-32 sm:w-48 md:w-64"
                    autoFocus
                  />
                )}
                <button 
                  onClick={handleSearchClick}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${
                    isSearchOpen 
                      ? 'bg-blue-600 hover:bg-blue-500' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                </button>
              </div>
            )}
            <button className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors flex-shrink-0">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </button>
            <button 
              onClick={triggerRefresh}
              disabled={isRefreshing}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        {/* Content Area */}
        <div className="p-2 sm:p-4 md:p-6 w-full max-w-full flex-1 overflow-auto">
          <RefreshContext.Provider value={{ isRefreshing, triggerRefresh }}>
            <SearchContext.Provider value={{ searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen }}>
              {renderContent()}
            </SearchContext.Provider>
          </RefreshContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
