'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Clock, MapPin, Building2,
  CheckCircle, AlertCircle, Star, Filter, Search
} from 'lucide-react';

interface Shift {
  id: string;
  businessName: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  rate: number;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  hoursWorked?: number;
  rating?: number;
}

export default function MyShiftsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [shifts] = useState<Shift[]>([
    { id: '1', businessName: 'The Coffee House', role: 'Barista', date: '2024-12-10', startTime: '08:00', endTime: '14:00', rate: 12.50, location: 'Manchester, M1 2AB', status: 'upcoming' },
    { id: '2', businessName: 'Sunrise Cafe', role: 'Server', date: '2024-12-12', startTime: '10:00', endTime: '16:00', rate: 11.00, location: 'Manchester, M2 3CD', status: 'upcoming' },
    { id: '3', businessName: 'Golden Dragon', role: 'Kitchen Assistant', date: '2024-12-05', startTime: '17:00', endTime: '22:00', rate: 12.00, location: 'Manchester, M3 4EF', status: 'completed', hoursWorked: 5, rating: 5 },
    { id: '4', businessName: 'Brew & Bloom', role: 'Barista', date: '2024-12-03', startTime: '07:00', endTime: '15:00', rate: 12.50, location: 'Manchester, M4 5GH', status: 'completed', hoursWorked: 8, rating: 4 },
    { id: '5', businessName: 'Spice Express', role: 'Server', date: '2024-12-01', startTime: '12:00', endTime: '20:00', rate: 11.50, location: 'Manchester, M5 6IJ', status: 'completed', hoursWorked: 8, rating: 5 },
  ]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your shifts...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  const filteredShifts = shifts.filter(shift => {
    const matchesFilter = activeFilter === 'all' || shift.status === activeFilter;
    const matchesSearch = shift.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shift.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const upcomingCount = shifts.filter(s => s.status === 'upcoming').length;
  const completedCount = shifts.filter(s => s.status === 'completed').length;
  const totalEarnings = shifts.filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + (s.hoursWorked || 0) * s.rate, 0);

  const handleBack = () => {
    router.push('/dashboard/jobseeker');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-indigo-900">My Shifts</h1>
              <p className="text-sm text-gray-600">View your upcoming and past shifts</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <p className="text-3xl font-bold text-indigo-600">{upcomingCount}</p>
            <p className="text-sm text-gray-500">Upcoming</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">{completedCount}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">&#163;{totalEarnings.toFixed(0)}</p>
            <p className="text-sm text-gray-500">Earned</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search shifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  activeFilter === 'all' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('upcoming')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  activeFilter === 'upcoming' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  activeFilter === 'completed' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {filteredShifts.length > 0 ? (
          <div className="space-y-4">
            {filteredShifts.map((shift) => (
              <div 
                key={shift.id} 
                className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${
                  shift.status === 'upcoming' ? 'border-indigo-500' :
                  shift.status === 'completed' ? 'border-emerald-500' :
                  'border-gray-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{shift.businessName}</h3>
                        <p className="text-sm text-gray-600">{shift.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(shift.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {shift.startTime} - {shift.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {shift.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      shift.status === 'upcoming' ? 'bg-indigo-100 text-indigo-700' :
                      shift.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {shift.status === 'upcoming' && <><AlertCircle className="w-4 h-4 inline mr-1" />Upcoming</>}
                      {shift.status === 'completed' && <><CheckCircle className="w-4 h-4 inline mr-1" />Completed</>}
                    </span>
                    <p className="text-xl font-bold text-indigo-600">&#163;{shift.rate.toFixed(2)}/hr</p>
                    {shift.status === 'completed' && shift.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < shift.rating! ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No shifts found</h3>
            <p className="text-gray-500 mb-6">
              {activeFilter === 'upcoming' 
                ? "You don't have any upcoming shifts yet."
                : activeFilter === 'completed'
                ? "You haven't completed any shifts yet."
                : "Start by finding available shifts in your area."}
            </p>
            <Link 
              href="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Search className="w-5 h-5" />
              Find Shifts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
