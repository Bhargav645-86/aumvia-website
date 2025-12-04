'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, MapPin, Clock, Star, Bell, CheckCircle, 
  Calendar, ArrowRight, Menu, X, LogOut, Settings,
  TrendingUp, AlertCircle, ChevronRight, User, DollarSign, Award
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface JobStats {
  shiftsCompleted: number;
  totalEarnings: number;
  averageRating: number;
  applicationsActive: number;
  upcomingShifts: number;
}

interface Shift {
  id: string;
  business: string;
  role: string;
  date: string;
  time: string;
  pay: number;
  location: string;
  distance: string;
  isEmergency?: boolean;
}

interface Application {
  id: string;
  business: string;
  role: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
}

export default function JobSeekerDashboard() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [stats] = useState<JobStats>({
    shiftsCompleted: 24,
    totalEarnings: 1840,
    averageRating: 4.8,
    applicationsActive: 3,
    upcomingShifts: 2
  });

  const [nearbyShifts] = useState<Shift[]>([
    { id: '1', business: 'Brew & Bloom Café', role: 'Barista', date: 'Tomorrow', time: '07:00 - 15:00', pay: 12.50, location: 'Manchester City Centre', distance: '0.8 miles', isEmergency: true },
    { id: '2', business: 'Spice Express', role: 'Kitchen Assistant', date: 'Fri, 6 Dec', time: '17:00 - 22:00', pay: 11.50, location: 'Ancoats', distance: '1.2 miles' },
    { id: '3', business: 'The Corner Store', role: 'Shop Assistant', date: 'Sat, 7 Dec', time: '09:00 - 17:00', pay: 11.00, location: 'Northern Quarter', distance: '1.5 miles' },
  ]);

  const [applications] = useState<Application[]>([
    { id: '1', business: 'Coffee Culture', role: 'Barista', date: 'Mon, 9 Dec', status: 'pending', appliedAt: '2 hours ago' },
    { id: '2', business: 'Golden Dragon', role: 'Server', date: 'Tue, 10 Dec', status: 'accepted', appliedAt: 'Yesterday' },
    { id: '3', business: 'Bubble Dreams', role: 'Bubble Tea Maker', date: 'Wed, 11 Dec', status: 'pending', appliedAt: '3 days ago' },
  ]);

  const [upcomingShifts] = useState<Shift[]>([
    { id: '1', business: 'Golden Dragon', role: 'Server', date: 'Tue, 10 Dec', time: '12:00 - 20:00', pay: 12.00, location: 'Chinatown', distance: '0.5 miles' },
    { id: '2', business: 'Fresh Bites Café', role: 'Barista', date: 'Thu, 12 Dec', time: '08:00 - 14:00', pay: 12.50, location: 'Piccadilly', distance: '0.3 miles' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald/5 to-indigo/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'jobseeker') {
    redirect('/login');
  }

  const userName = session.user?.name || 'Job Seeker';
  const greeting = getGreeting();

  function getGreeting() {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard/jobseeker', icon: Briefcase, active: true },
    { name: 'Find Shifts', href: '/marketplace', icon: MapPin },
    { name: 'My Shifts', href: '/jobseeker/shifts', icon: Calendar },
    { name: 'My Profile', href: '/jobseeker/profile', icon: User },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald/5">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-emerald text-white p-3 rounded-xl shadow-lg"
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
                <div className="w-10 h-10 bg-gradient-to-br from-emerald to-emerald-dark rounded-xl flex items-center justify-center">
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
                      ? 'bg-gradient-to-r from-emerald to-emerald-dark text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-emerald'
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
                <div className="w-10 h-10 bg-emerald rounded-full flex items-center justify-center text-white font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{userName}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star className="w-3 h-3 text-gold fill-current" />
                    <span>{stats.averageRating.toFixed(1)} rating</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href="/jobseeker/profile" className="flex-1 py-2 px-3 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm">
                  <Settings className="w-4 h-4" />
                  Profile
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
                  {greeting}, {userName}!
                </h1>
                <p className="text-gray-600 mt-1">
                  Ready to find your next opportunity?
                </p>
              </div>
              <Link 
                href="/marketplace"
                className="px-6 py-3 bg-gradient-to-r from-emerald to-emerald-dark text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Browse All Shifts
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.shiftsCompleted}</p>
              <p className="text-sm text-gray-500">Shifts Completed</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-gold" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">£{stats.totalEarnings}</p>
              <p className="text-sm text-gray-500">Total Earnings</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo/10 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-indigo" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.averageRating}</p>
              <p className="text-sm text-gray-500">Average Rating</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.upcomingShifts}</p>
              <p className="text-sm text-gray-500">Upcoming Shifts</p>
            </div>
          </div>

          {/* Upcoming Shifts */}
          {upcomingShifts.length > 0 && (
            <div className="bg-gradient-to-r from-emerald to-emerald-dark rounded-2xl shadow-lg p-6 text-white mb-8">
              <h2 className="text-xl font-heading font-bold mb-4">Your Upcoming Shifts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingShifts.map((shift) => (
                  <div key={shift.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{shift.business}</h3>
                        <p className="text-white/80 text-sm">{shift.role}</p>
                      </div>
                      <span className="px-3 py-1 bg-gold text-indigo rounded-full text-sm font-bold">
                        £{shift.pay}/hr
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-white/90">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {shift.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {shift.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {shift.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Nearby Shifts */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-bold text-indigo">Shifts Near You</h2>
                <Link href="/marketplace" className="text-sm text-emerald hover:text-emerald-dark transition-colors flex items-center gap-1">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {nearbyShifts.map((shift) => (
                  <div key={shift.id} className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                    shift.isEmergency ? 'border-red-200 bg-red-50' : 'border-gray-100 hover:border-emerald'
                  }`}>
                    {shift.isEmergency && (
                      <div className="flex items-center gap-2 text-red-600 text-xs font-bold mb-2">
                        <AlertCircle className="w-4 h-4 animate-pulse" />
                        URGENT - FILL NOW
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{shift.business}</h3>
                        <p className="text-gray-600 text-sm">{shift.role}</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald/10 text-emerald rounded-full text-sm font-bold">
                        £{shift.pay}/hr
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {shift.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {shift.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {shift.distance}
                      </span>
                    </div>
                    <button className="mt-3 w-full py-2 bg-emerald text-white rounded-lg font-semibold hover:bg-emerald-dark transition-colors">
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-heading font-bold text-indigo">My Applications</h2>
                <span className="text-sm text-gray-500">{applications.filter(a => a.status === 'pending').length} pending</span>
              </div>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{app.business}</h3>
                        <p className="text-gray-600 text-sm">{app.role} • {app.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        app.status === 'accepted' ? 'bg-emerald/10 text-emerald' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">Applied {app.appliedAt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-indigo">Boost Your Profile</h2>
                <p className="text-sm text-gray-500">Get more shift opportunities</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-1">Complete Your Profile</h4>
                <p className="text-sm text-gray-600">Add all your skills and experience to appear in more searches.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-1">Upload Certificates</h4>
                <p className="text-sm text-gray-600">Food hygiene and first aid certificates boost your credibility.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-1">Get Verified</h4>
                <p className="text-sm text-gray-600">Complete ID verification to access premium opportunities.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
