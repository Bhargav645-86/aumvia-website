'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileCheck, Users, Calendar, Package, TrendingUp, Bell, 
  Clock, AlertTriangle, CheckCircle, ArrowRight, Plus,
  Building2, LogOut, Settings, Menu, X, ChevronRight,
  ClipboardList, UserPlus, BarChart3, ShoppingCart
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface DashboardStats {
  complianceScore: number;
  pendingTasks: number;
  staffCount: number;
  upcomingShifts: number;
  lowStockItems: number;
  pendingTimesheets: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
}

interface Activity {
  id: string;
  action: string;
  time: string;
  icon: string;
}

export default function BusinessDashboard() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [stats] = useState<DashboardStats>({
    complianceScore: 87,
    pendingTasks: 5,
    staffCount: 12,
    upcomingShifts: 8,
    lowStockItems: 3,
    pendingTimesheets: 2
  });

  const [alerts] = useState<Alert[]>([
    { id: '1', type: 'warning', title: 'Licence Expiring', message: 'Food hygiene certificate expires in 14 days', time: '2 hours ago' },
    { id: '2', type: 'info', title: 'New Application', message: 'Sarah applied for tomorrow\'s morning shift', time: '3 hours ago' },
    { id: '3', type: 'success', title: 'Shift Filled', message: 'Evening shift for Friday has been confirmed', time: '5 hours ago' },
  ]);

  const [activities] = useState<Activity[]>([
    { id: '1', action: 'Timesheet approved for James Wilson', time: '1 hour ago', icon: '✓' },
    { id: '2', action: 'New stock order placed', time: '3 hours ago', icon: '📦' },
    { id: '3', action: 'Compliance checklist completed', time: 'Yesterday', icon: '📋' },
    { id: '4', action: 'Staff member added: Emma Clark', time: 'Yesterday', icon: '👤' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || (session.user?.role !== 'business' && session.user?.role !== 'manager')) {
    redirect('/login');
  }

  const businessName = session.user?.name || 'Business Owner';
  const businessType = session.user?.businessType || 'Restaurant';
  const greeting = getGreeting();

  function getGreeting() {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard/business', icon: Building2, active: true },
    { name: 'Compliance', href: '/compliance', icon: FileCheck },
    { name: 'HR & Admin', href: '/hr', icon: Users },
    { name: 'Rota & Timesheets', href: '/rota', icon: Calendar },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Staff Swap', href: '/marketplace', icon: UserPlus },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ];

  const quickActions = [
    { name: 'Post Urgent Shift', href: '/marketplace', icon: Plus, color: 'bg-emerald' },
    { name: 'Add Staff Member', href: '/hr', icon: UserPlus, color: 'bg-indigo' },
    { name: 'Create Rota', href: '/rota', icon: Calendar, color: 'bg-gold' },
    { name: 'Order Stock', href: '/inventory', icon: ShoppingCart, color: 'bg-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-indigo text-white p-3 rounded-xl shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-0 left-0 h-screen w-72 bg-white shadow-xl z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-100">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ॐ</span>
                </div>
                <span className="text-2xl font-heading font-bold text-indigo">Aumvia</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${item.active 
                      ? 'bg-gradient-to-r from-indigo to-indigo-dark text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-indigo'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo rounded-full flex items-center justify-center text-white font-bold">
                  {businessName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{businessName}</p>
                  <p className="text-xs text-gray-500">{businessType}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/settings" className="flex-1 py-2 px-3 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="py-2 px-3 bg-gray-100 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 min-h-screen">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="md:pl-0 pl-14">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-indigo">
                  {greeting}, {businessName}!
                </h1>
                <p className="text-gray-600 mt-1">
                  Here's what's happening with your {businessType.toLowerCase()} today.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-2xl font-bold text-indigo">
                  {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald/10 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-emerald" />
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  stats.complianceScore >= 80 ? 'bg-emerald/10 text-emerald' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {stats.complianceScore >= 80 ? 'Good' : 'Needs Attention'}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.complianceScore}%</p>
              <p className="text-sm text-gray-500">Compliance Score</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo" />
                </div>
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-indigo/10 text-indigo">Active</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.staffCount}</p>
              <p className="text-sm text-gray-500">Staff Members</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-gold" />
                </div>
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-gold/10 text-gold">This Week</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.upcomingShifts}</p>
              <p className="text-sm text-gray-500">Scheduled Shifts</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-red-600" />
                </div>
                {stats.lowStockItems > 0 && (
                  <span className="text-sm font-semibold px-3 py-1 rounded-full bg-red-100 text-red-600">Alert</span>
                )}
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.lowStockItems}</p>
              <p className="text-sm text-gray-500">Low Stock Items</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-heading font-bold text-indigo mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all hover:shadow-md group"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">{action.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Alerts */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-bold text-indigo">Alerts & Notifications</h2>
                <Link href="/notifications" className="text-sm text-indigo hover:text-gold transition-colors flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-xl border-l-4 ${
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                    alert.type === 'success' ? 'bg-emerald/5 border-emerald' :
                    'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        alert.type === 'warning' ? 'bg-yellow-100' :
                        alert.type === 'success' ? 'bg-emerald/10' :
                        'bg-blue-100'
                      }`}>
                        {alert.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-600" /> :
                         alert.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald" /> :
                         <Bell className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{alert.title}</p>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-bold text-indigo">Recent Activity</h2>
              </div>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Items */}
          <div className="mt-8 bg-gradient-to-r from-indigo to-indigo-dark rounded-2xl shadow-lg p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-heading font-bold mb-2">Pending Items Requiring Action</h2>
                <div className="flex flex-wrap gap-4">
                  <span className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    {stats.pendingTasks} compliance tasks
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <ClipboardList className="w-4 h-4" />
                    {stats.pendingTimesheets} timesheets to review
                  </span>
                </div>
              </div>
              <Link 
                href="/compliance"
                className="px-6 py-3 bg-gold text-indigo rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                Review Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
