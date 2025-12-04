'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, MapPin, Clock, Star, Plus, Filter, 
  CheckCircle, Shield, Briefcase, Users, Calendar,
  ArrowLeft, ChevronDown, X, AlertCircle, DollarSign,
  Building2, UserCircle, Zap, Award
} from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  skills: string[];
  rating: number;
  totalRatings: number;
  distance: number;
  verified: boolean;
  backgroundChecked: boolean;
  shiftsCompleted: number;
  hourlyRate: number;
}

interface Shift {
  id: string;
  business: string;
  role: string;
  skills: string[];
  date: string;
  startTime: string;
  endTime: string;
  payRate: number;
  isEmergency: boolean;
  applicants: number;
  location: string;
  distance: number;
}

export default function StaffSwapMarketplace() {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<'business' | 'worker'>('business');
  const [activeTab, setActiveTab] = useState<'shifts' | 'workers' | 'bookings'>('shifts');
  const [showPostShiftModal, setShowPostShiftModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filterSkill, setFilterSkill] = useState('');
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterMaxDistance, setFilterMaxDistance] = useState(10);

  const [workers] = useState<Worker[]>([
    { id: '1', name: 'Sarah Johnson', skills: ['Barista', 'Latte Art', 'Coffee Brewing'], rating: 4.9, totalRatings: 47, distance: 0.8, verified: true, backgroundChecked: true, shiftsCompleted: 52, hourlyRate: 12.50 },
    { id: '2', name: 'James Wilson', skills: ['Server', 'Customer Service'], rating: 4.7, totalRatings: 35, distance: 1.2, verified: true, backgroundChecked: true, shiftsCompleted: 38, hourlyRate: 11.50 },
    { id: '3', name: 'Emma Thompson', skills: ['Kitchen Staff', 'Food Prep', 'Hygiene Certified'], rating: 4.8, totalRatings: 28, distance: 1.5, verified: true, backgroundChecked: false, shiftsCompleted: 24, hourlyRate: 12.00 },
    { id: '4', name: 'Michael Chen', skills: ['Bubble Tea', 'Barista'], rating: 5.0, totalRatings: 15, distance: 2.0, verified: true, backgroundChecked: true, shiftsCompleted: 18, hourlyRate: 13.00 },
    { id: '5', name: 'Lisa Martinez', skills: ['Server', 'Till Operations', 'Stock Management'], rating: 4.6, totalRatings: 42, distance: 2.3, verified: true, backgroundChecked: true, shiftsCompleted: 45, hourlyRate: 11.00 },
  ]);

  const [shifts] = useState<Shift[]>([
    { id: '1', business: 'Brew & Bloom Café', role: 'Barista', skills: ['Coffee', 'Latte Art'], date: 'Tomorrow', startTime: '07:00', endTime: '15:00', payRate: 12.50, isEmergency: true, applicants: 3, location: 'Manchester City Centre', distance: 0.5 },
    { id: '2', business: 'Spice Express', role: 'Kitchen Assistant', skills: ['Food Prep'], date: 'Fri, 6 Dec', startTime: '17:00', endTime: '22:00', payRate: 11.50, isEmergency: false, applicants: 5, location: 'Ancoats', distance: 1.2 },
    { id: '3', business: 'The Corner Store', role: 'Shop Assistant', skills: ['Till', 'Customer Service'], date: 'Sat, 7 Dec', startTime: '09:00', endTime: '17:00', payRate: 11.00, isEmergency: false, applicants: 2, location: 'Northern Quarter', distance: 0.8 },
    { id: '4', business: 'Golden Dragon', role: 'Server', skills: ['Customer Service'], date: 'Sun, 8 Dec', startTime: '12:00', endTime: '20:00', payRate: 12.00, isEmergency: false, applicants: 4, location: 'Chinatown', distance: 1.0 },
  ]);

  const [bookings] = useState([
    { id: '1', worker: 'Sarah Johnson', role: 'Barista', date: 'Today', time: '07:00 - 15:00', status: 'confirmed' },
    { id: '2', worker: 'James Wilson', role: 'Server', date: 'Tomorrow', time: '12:00 - 20:00', status: 'pending' },
  ]);

  useEffect(() => {
    if (session) {
      setUserRole(session.user?.role === 'jobseeker' ? 'worker' : 'business');
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  if (!session) redirect('/login');

  const filteredWorkers = workers.filter(w => {
    if (filterSkill && !w.skills.some(s => s.toLowerCase().includes(filterSkill.toLowerCase()))) return false;
    if (filterVerified && !w.backgroundChecked) return false;
    if (w.distance > filterMaxDistance) return false;
    if (searchQuery && !w.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredShifts = shifts.filter(s => {
    if (searchQuery && !s.business.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !s.role.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/business" className="text-gray-600 hover:text-emerald-600 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-indigo-900">
                  {userRole === 'business' ? 'Staff Swap Marketplace' : 'Find Shifts Near You'}
                </h1>
                <p className="text-sm text-gray-600">
                  {userRole === 'business' ? 'Connect with verified workers and fill shifts instantly' : 'Discover opportunities in your area'}
                </p>
              </div>
            </div>
            {userRole === 'business' && (
              <button
                onClick={() => setShowPostShiftModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-emerald to-emerald-dark text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Post Shift
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{workers.length}</p>
              <p className="text-sm text-gray-500">Workers Nearby</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{shifts.length}</p>
              <p className="text-sm text-gray-500">Open Shifts</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{shifts.filter(s => s.isEmergency).length}</p>
              <p className="text-sm text-gray-500">Urgent Shifts</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              <p className="text-sm text-gray-500">Active Bookings</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={userRole === 'business' ? 'Search workers by name or skill...' : 'Search shifts by business or role...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                showFilters ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skill</label>
                <select
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">All Skills</option>
                  <option value="Barista">Barista</option>
                  <option value="Server">Server</option>
                  <option value="Kitchen">Kitchen Staff</option>
                  <option value="Bubble Tea">Bubble Tea</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Distance: {filterMaxDistance} miles
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={filterMaxDistance}
                  onChange={(e) => setFilterMaxDistance(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterVerified}
                    onChange={(e) => setFilterVerified(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">Background Checked Only</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Tab Switcher */}
        {userRole === 'business' && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('shifts')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'shifts'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              Open Shifts ({shifts.length})
            </button>
            <button
              onClick={() => setActiveTab('workers')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'workers'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              Available Workers ({filteredWorkers.length})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'bookings'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-5 h-5" />
              My Bookings ({bookings.length})
            </button>
          </div>
        )}

        {/* Shifts Grid */}
        {activeTab === 'shifts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShifts.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-lg">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Shifts Available</h3>
                <p className="text-gray-600">Check back later or adjust your search criteria.</p>
              </div>
            ) : (
              filteredShifts.map(shift => (
                <div key={shift.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${
                  shift.isEmergency ? 'ring-2 ring-red-500' : ''
                }`}>
                  {shift.isEmergency && (
                    <div className="bg-red-600 text-white px-4 py-2 flex items-center gap-2 text-sm font-bold">
                      <Zap className="w-4 h-4 animate-pulse" />
                      URGENT - FILL NOW
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{shift.role}</h3>
                        <p className="text-gray-600">{shift.business}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">£{shift.payRate}</p>
                        <p className="text-sm text-gray-500">per hour</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{shift.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{shift.startTime} - {shift.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{shift.location} • {shift.distance} miles</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {shift.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-sm text-gray-500">{shift.applicants} applicants</span>
                      <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                        {userRole === 'business' ? 'Find Workers' : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Workers Grid */}
        {activeTab === 'workers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-lg">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Workers Found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              filteredWorkers.map(worker => (
                <div key={worker.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald to-emerald-dark rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {worker.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-gray-900">{worker.name}</h3>
                          {worker.verified && (
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < Math.floor(worker.rating) ? 'text-gold fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{worker.rating}</span>
                          <span className="text-sm text-gray-500">({worker.totalRatings})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {worker.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                          {skill}
                        </span>
                      ))}
                      {worker.skills.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                          +{worker.skills.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{worker.distance} miles away</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Award className="w-4 h-4" />
                        <span>{worker.shiftsCompleted} shifts</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      {worker.verified && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                          <CheckCircle className="w-3 h-3" /> ID Verified
                        </span>
                      )}
                      {worker.backgroundChecked && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                          <Shield className="w-3 h-3" /> Background Checked
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-lg font-bold text-emerald-600">£{worker.hourlyRate}/hr</span>
                      <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                        Invite to Shift
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Bookings List */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-heading font-bold text-indigo-900">Active Bookings</h2>
            </div>
            {bookings.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Bookings</h3>
                <p className="text-gray-600">Your confirmed shifts will appear here.</p>
              </div>
            ) : (
              <div className="divide-y">
                {bookings.map(booking => (
                  <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg">
                          {booking.worker.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{booking.worker}</p>
                          <p className="text-sm text-gray-600">{booking.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{booking.date}</p>
                        <p className="text-sm text-gray-600">{booking.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* How It Works (for new users) */}
        <div className="mt-8 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-heading font-bold mb-6 text-center">How Staff Swap Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Post Your Shift</h3>
              <p className="text-sm text-indigo-200">Add role, time, pay, and required skills</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Get Matched</h3>
              <p className="text-sm text-indigo-200">5-7 nearby verified workers notified instantly</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">First Accept Wins</h3>
              <p className="text-sm text-indigo-200">Quickest responder secures the shift</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Shift Covered!</h3>
              <p className="text-sm text-indigo-200">Worker arrives, you rate after completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Post Shift Modal */}
      {showPostShiftModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-indigo-900">Post New Shift</h3>
              <button onClick={() => setShowPostShiftModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option>Barista</option>
                  <option>Server</option>
                  <option>Kitchen Staff</option>
                  <option>Shop Assistant</option>
                  <option>Bubble Tea Maker</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pay Rate (£/hr)</label>
                  <input type="number" step="0.50" defaultValue="12.00" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                  <input type="time" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                  <input type="time" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills</label>
                <input type="text" placeholder="e.g., Coffee making, Customer service" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>

              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                <input type="checkbox" id="emergency" className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                <label htmlFor="emergency" className="text-sm font-semibold text-red-700">
                  <Zap className="w-4 h-4 inline mr-1" />
                  Mark as Emergency (notify workers immediately)
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowPostShiftModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Post Shift
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
