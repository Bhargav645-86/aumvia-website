'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface Worker {
  id: string;
  name: string;
  photo_url?: string;
  skills: string[];
  average_rating: number;
  total_ratings: number;
  distance?: number;
  id_verified: boolean;
  background_checked: boolean;
  right_to_work_verified: boolean;
  profile_completion: number;
  total_shifts_completed: number;
}

interface MarketplaceShift {
  id: string;
  business_name: string;
  business_rating: number;
  role: string;
  required_skills: string[];
  shift_date: string;
  start_time: string;
  end_time: string;
  pay_rate: number;
  is_emergency: boolean;
  is_bundle: boolean;
  bundle_dates?: string[];
  description?: string;
  status: string;
  applicant_count: number;
}

interface Booking {
  id: string;
  shift: MarketplaceShift;
  worker: Worker;
  status: string;
  created_at: string;
  completed_at?: string;
}

interface Application {
  id: string;
  shift: MarketplaceShift;
  status: string;
  applied_at: string;
}

export default function StaffSwapMarketplace() {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<'business' | 'worker'>('business');
  const [activeTab, setActiveTab] = useState<'shifts' | 'workers' | 'bookings' | 'feed' | 'myshifts'>('shifts');

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [shifts, setShifts] = useState<MarketplaceShift[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const [filterSkill, setFilterSkill] = useState('');
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterMaxDistance, setFilterMaxDistance] = useState(10);

  const [showPostShiftModal, setShowPostShiftModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState<MarketplaceShift | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  const [loading, setLoading] = useState(true);

  const businessId = 'default';
  const workerId = 'worker-123';
  const businessConfig = { latitude: 51.5074, longitude: -0.1278 };

  useEffect(() => {
    if (session) {
      setUserRole(session.user?.role === 'jobseeker' ? 'worker' : 'business');
      loadData();
    }
  }, [session]);

  async function loadData() {
    setLoading(true);
    try {
      if (userRole === 'business') {
        await Promise.all([loadWorkers(), loadShifts(), loadBookings()]);
      } else {
        await Promise.all([loadOpportunities(), loadMyApplications(), loadMyShifts()]);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadWorkers() {
    const params = new URLSearchParams();
    if (filterSkill) params.append('skill', filterSkill);
    if (filterVerified) params.append('verified', 'true');
    params.append('maxDistance', filterMaxDistance.toString());
    params.append('businessLat', businessConfig.latitude.toString());
    params.append('businessLng', businessConfig.longitude.toString());

    const response = await fetch(`/api/marketplace/workers?${params}`);
    const data = await response.json();
    setWorkers(data);
  }

  async function loadShifts() {
    const response = await fetch(`/api/marketplace/shifts?businessId=${businessId}&status=open`);
    const data = await response.json();
    setShifts(Array.isArray(data) ? data : []);
  }

  async function loadBookings() {
    const response = await fetch(`/api/marketplace/bookings?businessId=${businessId}`);
    const data = await response.json();
    setBookings(Array.isArray(data) ? data : []);
  }

  async function loadOpportunities() {
    const response = await fetch(`/api/marketplace/shifts?workerId=${workerId}&status=open`);
    const data = await response.json();
    setShifts(Array.isArray(data) ? data : []);
  }

  async function loadMyApplications() {
    const response = await fetch(`/api/marketplace/applications?workerId=${workerId}`);
    const data = await response.json();
    setApplications(Array.isArray(data) ? data : []);
  }

  async function loadMyShifts() {
    const response = await fetch(`/api/marketplace/bookings?workerId=${workerId}`);
    const data = await response.json();
    setShifts(Array.isArray(data) ? data : []);
  }

  async function handlePostShift(formData: any) {
    try {
      const response = await fetch('/api/marketplace/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          business_id: businessId,
          business_name: 'My Business',
          business_rating: 4.5,
          business_latitude: businessConfig.latitude,
          business_longitude: businessConfig.longitude
        })
      });

      if (response.ok) {
        await loadShifts();
        setShowPostShiftModal(false);
      }
    } catch (error) {
      console.error('Error posting shift:', error);
    }
  }

  async function handleInviteWorker(workerId: string, shiftId: string) {
    try {
      const response = await fetch('/api/marketplace/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shift_id: shiftId,
          worker_id: workerId,
          business_id: businessId,
          status: 'confirmed'
        })
      });

      if (response.ok) {
        await Promise.all([loadShifts(), loadBookings()]);
        setShowInviteModal(false);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  }

  async function handleApplyToShift(shiftId: string) {
    try {
      const response = await fetch('/api/marketplace/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shift_id: shiftId,
          worker_id: workerId,
          status: 'pending'
        })
      });

      if (response.ok) {
        await Promise.all([loadOpportunities(), loadMyApplications()]);
      }
    } catch (error) {
      console.error('Error applying to shift:', error);
    }
  }

  async function handleRateWorker(bookingId: string, stars: number, feedback: string) {
    try {
      const response = await fetch('/api/marketplace/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          shift_id: selectedBooking?.shift.id,
          rater_type: 'business',
          rater_id: businessId,
          ratee_type: 'worker',
          ratee_id: selectedBooking?.worker.id,
          stars,
          feedback
        })
      });

      if (response.ok) {
        await loadBookings();
        setShowRateModal(false);
      }
    } catch (error) {
      console.error('Error rating worker:', error);
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-gray-600 font-semibold">Loading marketplace...</div>
        </div>
      </div>
    );
  }

  if (!session) redirect('/login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-indigo-900 mb-2">
                {userRole === 'business' ? 'Staff Swap Marketplace' : 'Find Your Next Shift'}
              </h1>
              <p className="text-gray-600">
                {userRole === 'business'
                  ? 'Connect with verified workers and fill shifts instantly'
                  : 'Discover opportunities near you and build your career'}
              </p>
            </div>

            {userRole === 'business' && (
              <button
                onClick={() => setShowPostShiftModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full font-bold hover:shadow-xl transform hover:scale-105 transition-all"
                style={{ backgroundColor: '#D4AF37' }}
              >
                Post New Shift
              </button>
            )}
          </div>
        </div>

        {userRole === 'business' ? (
          <>
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setActiveTab('shifts')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'shifts'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Open Shifts ({shifts.length})
              </button>
              <button
                onClick={() => setActiveTab('workers')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'workers'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Available Workers ({workers.length})
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'bookings'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                My Bookings ({bookings.length})
              </button>
            </div>

            {activeTab === 'shifts' && (
              <OpenShiftsTab
                shifts={shifts}
                onFindWorkers={(shift) => {
                  setSelectedShift(shift);
                  setShowInviteModal(true);
                }}
                onCancelShift={async (id) => {
                  await fetch(`/api/marketplace/shifts?id=${id}`, { method: 'DELETE' });
                  await loadShifts();
                }}
              />
            )}

            {activeTab === 'workers' && (
              <AvailableWorkersTab
                workers={workers}
                filterSkill={filterSkill}
                setFilterSkill={setFilterSkill}
                filterVerified={filterVerified}
                setFilterVerified={setFilterVerified}
                filterMaxDistance={filterMaxDistance}
                setFilterMaxDistance={setFilterMaxDistance}
                onFilterChange={loadWorkers}
                onInviteWorker={(worker) => {
                  setSelectedWorker(worker);
                  setShowInviteModal(true);
                }}
              />
            )}

            {activeTab === 'bookings' && (
              <MyBookingsTab
                bookings={bookings}
                onRate={(booking) => {
                  setSelectedBooking(booking);
                  setShowRateModal(true);
                }}
              />
            )}
          </>
        ) : (
          <>
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setActiveTab('feed')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'feed'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Opportunities ({shifts.length})
              </button>
              <button
                onClick={() => setActiveTab('myshifts')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'myshifts'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                My Shifts ({bookings.length})
              </button>
            </div>

            {activeTab === 'feed' && (
              <OpportunityFeedTab
                shifts={shifts}
                applications={applications}
                onApply={handleApplyToShift}
              />
            )}

            {activeTab === 'myshifts' && (
              <MyShiftsTab bookings={bookings} />
            )}
          </>
        )}
      </div>

      {showPostShiftModal && (
        <PostShiftModal
          onClose={() => setShowPostShiftModal(false)}
          onSubmit={handlePostShift}
        />
      )}

      {showInviteModal && selectedShift && (
        <InviteWorkerModal
          shift={selectedShift}
          workers={workers}
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteWorker}
        />
      )}

      {showRateModal && selectedBooking && (
        <RateWorkerModal
          booking={selectedBooking}
          onClose={() => setShowRateModal(false)}
          onSubmit={handleRateWorker}
        />
      )}
    </div>
  );
}

function OpenShiftsTab({ shifts, onFindWorkers, onCancelShift }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {shifts.length === 0 ? (
        <div className="col-span-2 text-center py-16 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Open Shifts</h3>
          <p className="text-gray-600">Post your first shift to get started</p>
        </div>
      ) : (
        shifts.map((shift: MarketplaceShift) => (
          <div key={shift.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
            {shift.is_emergency && (
              <div className="bg-red-600 text-white px-4 py-2 font-bold text-sm flex items-center">
                <span className="animate-pulse mr-2">🚨</span>
                EMERGENCY COVER
              </div>
            )}

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-900 mb-1">{shift.role}</h3>
                  <p className="text-gray-600">{new Date(shift.shift_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    £{shift.pay_rate}
                  </div>
                  <div className="text-sm text-gray-600">per hour</div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-700">
                  <span className="w-5 mr-2">⏰</span>
                  <span>{new Date(shift.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - {new Date(shift.end_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {shift.required_skills.length > 0 && (
                  <div className="flex items-start text-gray-700">
                    <span className="w-5 mr-2">✓</span>
                    <div className="flex flex-wrap gap-2">
                      {shift.required_skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  {shift.applicant_count} applicant{shift.applicant_count !== 1 ? 's' : ''}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onFindWorkers(shift)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                  >
                    Find Workers
                  </button>
                  <button
                    onClick={() => onCancelShift(shift.id)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function AvailableWorkersTab({ workers, filterSkill, setFilterSkill, filterVerified, setFilterVerified, filterMaxDistance, setFilterMaxDistance, onFilterChange, onInviteWorker }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 h-fit">
        <h3 className="text-lg font-bold text-indigo-900 mb-4">Filters</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Skill</label>
            <select
              value={filterSkill}
              onChange={(e) => {
                setFilterSkill(e.target.value);
                setTimeout(onFilterChange, 100);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">All Skills</option>
              <option value="Barista">Barista</option>
              <option value="Server">Server</option>
              <option value="Kitchen Staff">Kitchen Staff</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filterVerified}
                onChange={(e) => {
                  setFilterVerified(e.target.checked);
                  setTimeout(onFilterChange, 100);
                }}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="ml-2 text-sm font-semibold text-gray-700">Background Checked Only</span>
            </label>
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
              onChange={(e) => {
                setFilterMaxDistance(parseInt(e.target.value));
                setTimeout(onFilterChange, 100);
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
        {workers.map((worker: Worker) => (
          <div key={worker.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {worker.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-indigo-900 mb-1">{worker.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(worker.average_rating) ? 'text-yellow-500' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                      <span className="ml-1 text-sm font-bold text-gray-700">
                        {worker.average_rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({worker.total_ratings})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex flex-wrap gap-2">
                  {worker.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                  {worker.skills.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                      +{worker.skills.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  {worker.id_verified && (
                    <span className="flex items-center text-green-600 text-xs font-semibold">
                      <span className="mr-1">✓</span> ID Verified
                    </span>
                  )}
                  {worker.background_checked && (
                    <span className="flex items-center text-green-600 text-xs font-semibold">
                      <span className="mr-1">✓</span> Background Checked
                    </span>
                  )}
                </div>

                {worker.distance !== undefined && (
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{worker.distance.toFixed(1)} miles</span> away
                  </div>
                )}

                <div className="text-sm text-gray-600">
                  {worker.total_shifts_completed} shifts completed
                </div>
              </div>

              <button
                onClick={() => onInviteWorker(worker)}
                className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                style={{ backgroundColor: '#D4AF37' }}
              >
                Invite to Shift
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyBookingsTab({ bookings, onRate }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {bookings.length === 0 ? (
        <div className="col-span-2 text-center py-16 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h3>
          <p className="text-gray-600">Your confirmed shifts will appear here</p>
        </div>
      ) : (
        bookings.map((booking: Booking) => (
          <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-indigo-900 mb-1">{booking.shift.role}</h3>
                <p className="text-gray-600">{booking.worker.name}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {booking.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-gray-700">
                {new Date(booking.shift.shift_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              <div className="text-gray-700">
                {new Date(booking.shift.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.shift.end_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {booking.status === 'completed' && (
              <button
                onClick={() => onRate(booking)}
                className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-all"
              >
                Rate Worker
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function OpportunityFeedTab({ shifts, applications, onApply }: any) {
  const appliedShiftIds = new Set(applications.map((app: Application) => app.shift.id));

  return (
    <div>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-indigo-900 mb-1">Shift Opportunities</h2>
            <p className="text-gray-600">Matching your skills and availability</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">{shifts.length}</div>
            <div className="text-sm text-gray-600">available</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {shifts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Matching Shifts</h3>
            <p className="text-gray-600">Check back soon for new opportunities</p>
          </div>
        ) : (
          shifts.map((shift: MarketplaceShift) => (
            <div key={shift.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
              {shift.is_emergency && (
                <div className="bg-red-600 text-white px-4 py-2 font-bold text-sm flex items-center">
                  <span className="animate-pulse mr-2">🚨</span>
                  URGENT - EMERGENCY COVER NEEDED
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-indigo-900 mb-2">{shift.role}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <span className="font-semibold">{shift.business_name}</span>
                      <span>•</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(shift.business_rating) ? 'text-yellow-500 text-sm' : 'text-gray-300 text-sm'}>
                            ★
                          </span>
                        ))}
                        <span className="ml-1 text-sm">({shift.business_rating.toFixed(1)})</span>
                      </div>
                    </div>
                    <div className="text-gray-700 mb-2">
                      {new Date(shift.shift_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                    <div className="text-gray-700 mb-2">
                      ⏰ {new Date(shift.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - {new Date(shift.end_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-green-600 mb-1">
                      £{shift.pay_rate}
                    </div>
                    <div className="text-sm text-gray-600">per hour</div>
                  </div>
                </div>

                {shift.required_skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {shift.required_skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {appliedShiftIds.has(shift.id) ? (
                  <div className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg text-center font-semibold">
                    Application Submitted
                  </div>
                ) : (
                  <button
                    onClick={() => onApply(shift.id)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-bold hover:shadow-xl transform hover:scale-105 transition-all"
                    style={{ backgroundColor: '#D4AF37' }}
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MyShiftsTab({ bookings }: any) {
  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Booked Shifts</h3>
          <p className="text-gray-600">Apply to opportunities to see your shifts here</p>
        </div>
      ) : (
        bookings.map((booking: Booking) => (
          <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-indigo-900 mb-1">{booking.shift.role}</h3>
                <p className="text-gray-600">{booking.shift.business_name}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {booking.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-gray-700">
                {new Date(booking.shift.shift_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              <div className="text-gray-700">
                {new Date(booking.shift.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.shift.end_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-2xl font-bold text-green-600">
                £{booking.shift.pay_rate}/hr
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function PostShiftModal({ onClose, onSubmit }: any) {
  const [isBundle, setIsBundle] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-indigo-900">Post New Shift</h2>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          onSubmit({
            role: formData.get('role'),
            required_skills: (formData.get('skills') as string).split(',').map(s => s.trim()).filter(s => s),
            shift_date: formData.get('date'),
            start_time: new Date(`${formData.get('date')}T${formData.get('startTime')}`).toISOString(),
            end_time: new Date(`${formData.get('date')}T${formData.get('endTime')}`).toISOString(),
            pay_rate: parseFloat(formData.get('payRate') as string),
            unpaid_break_minutes: parseInt(formData.get('breakMinutes') as string) || 0,
            is_emergency: isEmergency,
            is_bundle: isBundle,
            description: formData.get('description'),
            status: 'open'
          });
        }} className="p-6 space-y-4">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role *</label>
            <input
              name="role"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              placeholder="e.g., Barista, Server, Kitchen Staff"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills (comma-separated)</label>
            <input
              name="skills"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              placeholder="e.g., Customer Service, Food Hygiene Level 2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                name="date"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pay Rate (£/hr) *</label>
              <input
                type="number"
                name="payRate"
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                placeholder="12.50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
              <input
                type="time"
                name="startTime"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Time *</label>
              <input
                type="time"
                name="endTime"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Break (mins)</label>
              <input
                type="number"
                name="breakMinutes"
                defaultValue="30"
                min="0"
                step="15"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
              placeholder="Additional details about the shift..."
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded"
              />
              <span className="ml-2 text-sm font-semibold text-gray-700">
                Mark as Emergency Cover (urgent priority)
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isBundle}
                onChange={(e) => setIsBundle(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="ml-2 text-sm font-semibold text-gray-700">
                Create as Shift Bundle (multiple dates)
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              style={{ backgroundColor: '#D4AF37' }}
            >
              Post Shift
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InviteWorkerModal({ shift, workers, onClose, onInvite }: any) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-indigo-900">Invite Worker to Shift</h2>
          <p className="text-gray-600 mt-1">{shift.role} - {new Date(shift.shift_date).toLocaleDateString('en-GB')}</p>
        </div>

        <div className="p-6 space-y-4">
          {workers.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No matching workers found. Adjust your filters to see more options.
            </div>
          ) : (
            workers.map((worker: Worker) => (
              <div key={worker.id} className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {worker.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{worker.name}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-yellow-500">
                          {'★'.repeat(Math.floor(worker.average_rating))}
                        </span>
                        <span className="text-gray-600">
                          {worker.average_rating.toFixed(1)} ({worker.total_ratings})
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onInvite(worker.id, shift.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                  >
                    Invite
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function RateWorkerModal({ booking, onClose, onSubmit }: any) {
  const [stars, setStars] = useState(5);
  const [feedback, setFeedback] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-indigo-900">Rate Worker</h2>
          <p className="text-gray-600 mt-1">{booking.worker.name}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-700 mb-3">How was your experience?</div>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setStars(star)}
                  className="text-5xl hover:scale-110 transition-transform"
                >
                  <span className={star <= stars ? 'text-yellow-500' : 'text-gray-300'}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Feedback (optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
              placeholder="Share your experience..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onSubmit(booking.id, stars, feedback)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              style={{ backgroundColor: '#D4AF37' }}
            >
              Submit Rating
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
