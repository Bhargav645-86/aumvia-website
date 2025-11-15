'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import NavigationSidebar from '../components/NavigationSidebar';  // Shared component
import QuickActions from '../components/QuickActions';  // Shared component
import AlertCenter from '../components/AlertCenter';
import RecentActivity from '../components/RecentActivity';

export default function JobSeekerDashboard() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<string[]>(['marketplace', 'profile']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsRes, activitiesRes] = await Promise.all([
          fetch('/api/alerts').then(res => res.ok ? res.json() : []),
          fetch('/api/recent-activity').then(res => res.ok ? res.json() : [])
        ]);
        setAlerts(alertsRes);
        setActivities(activitiesRes);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchData();
  }, []);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session || session.user?.role !== 'jobseeker') redirect('/login');

  const userRole = session.user?.role || 'jobseeker';
  const filteredModules = ['marketplace', 'compliance', 'profile'];  // Jobseeker-specific modules

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 md:p-8">
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded-full shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        <NavigationSidebar
          userRole={userRole}
          favorites={favorites}
          setFavorites={setFavorites}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredModules={filteredModules}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-indigo-700 mb-2">
              Job Seeker Dashboard, {session.user?.name}!
            </h1>
            <p className="text-gray-600">
              Find shifts, track applications, and manage your profile.
            </p>
          </div>

          <QuickActions userRole={userRole} />
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">Job Seeker Hub</h2>
            <p>Browse nearby shifts, track job applications, update your profile, and view compliance info.</p>
            {/* Add jobseeker-specific widgets here, e.g., available shifts, application status */}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertCenter alerts={alerts} />
            <RecentActivity activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
}