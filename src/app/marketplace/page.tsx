'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface Shift {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  role: string;
  skills: string[];
  location: string;
  radius: number;
  status: 'open' | 'booked' | 'emergency';
  businessId: string;
}

interface Worker {
  id: string;
  name: string;
  skills: string[];
  rating: number;
  availability: string[];
  location: string;
  verified: boolean;
  rightToWork: boolean;
}

interface Booking {
  id: string;
  shiftId: string;
  workerId: string;
  status: 'pending' | 'confirmed';
  rating?: number;
}

export default function StaffSwapMarketplace() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'shifts' | 'workers' | 'bookings'>('shifts');
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [matches, setMatches] = useState<Worker[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'postShift' | 'bookWorker' | 'rate' | null>(null);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  useEffect(() => {
    // Mock data
    setShifts([
      { id: '1', title: 'Barista Shift', date: new Date(), startTime: '09:00', endTime: '17:00', role: 'Barista', skills: ['Food Hygiene Level 2'], location: 'London', radius: 5, status: 'open', businessId: '1' },
      { id: '2', title: 'Emergency Cover', date: new Date(), startTime: '18:00', endTime: '22:00', role: 'Server', skills: ['Customer Service'], location: 'London', radius: 3, status: 'emergency', businessId: '1' },
    ]);
    setWorkers([
      { id: '1', name: 'Alice', skills: ['Barista', 'Food Hygiene Level 2'], rating: 4.5, availability: ['weekdays'], location: 'London', verified: true, rightToWork: true },
      { id: '2', name: 'Bob', skills: ['Server', 'Customer Service'], rating: 4.8, availability: ['evenings'], location: 'London', verified: true, rightToWork: true },
    ]);
    setBookings([
      { id: '1', shiftId: '1', workerId: '1', status: 'confirmed', rating: 5 },
    ]);
  }, []);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session || session.user?.role !== 'business') redirect('/login');

  const handlePostShift = () => setModalType('postShift');
  const handleBookWorker = (shift: Shift) => {
    setSelectedShift(shift);
    // Intelligent matching: Filter workers by location, skills, availability
    const matched = workers.filter(w =>
      w.location === shift.location &&
      shift.skills.every(skill => w.skills.includes(skill)) &&
      w.verified && w.rightToWork
    );
    setMatches(matched);
    setModalType('bookWorker');
  };
  const handleRate = (booking: Booking) => {
    setSelectedShift(null);
    setModalType('rate');
  };

  const handleSaveShift = (newShift: Shift) => {
    setShifts([...shifts, newShift]);
    setShowModal(false);
  };

  const handleConfirmBooking = (workerId: string) => {
    if (selectedShift) {
      const newBooking: Booking = {
        id: Date.now().toString(),
        shiftId: selectedShift.id,
        workerId,
        status: 'confirmed',
      };
      setBookings([...bookings, newBooking]);
      setShifts(shifts.map(s => s.id === selectedShift.id ? { ...s, status: 'booked' } : s));
      setShowModal(false);
    }
  };

  const handleSaveRating = (rating: number) => {
    // Update worker rating (mock)
    setWorkers(workers.map(w => w.id === bookings.find(b => b.id === selectedShift?.id)?.workerId ? { ...w, rating } : w));
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">🤝 Staff Swap Marketplace</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button onClick={() => setActiveTab('shifts')} className={`px-4 py-2 rounded ${activeTab === 'shifts' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Open Shifts</button>
          <button onClick={() => setActiveTab('workers')} className={`px-4 py-2 rounded ${activeTab === 'workers' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Available Workers</button>
          <button onClick={() => setActiveTab('bookings')} className={`px-4 py-2 rounded ${activeTab === 'bookings' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>My Bookings</button>
        </div>

        {/* Open Shifts */}
        {activeTab === 'shifts' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold">Dynamic Shift Placement</h2>
              <button onClick={handlePostShift} className="bg-green-500 text-white px-4 py-2 rounded">Post Shift</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shifts.map(shift => (
                <div key={shift.id} className="bg-white p-6 rounded shadow">
                  <h3 className="font-semibold">{shift.title}</h3>
                  <p>Date: {shift.date.toLocaleDateString()}</p>
                  <p>Time: {shift.startTime} - {shift.endTime}</p>
                  <p>Role: {shift.role} (Skills: {shift.skills.join(', ')})</p>
                  <p>Location: {shift.location} ({shift.radius} miles)</p>
                  <p className={shift.status === 'emergency' ? 'text-red-500' : 'text-green-500'}>Status: {shift.status}</p>
                  {shift.status === 'open' && (
                    <button onClick={() => handleBookWorker(shift)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Find Workers</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Workers */}
        {activeTab === 'workers' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Intelligent Matching Engine</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workers.map(worker => (
                <div key={worker.id} className="bg-white p-6 rounded shadow">
                  <h3 className="font-semibold">{worker.name}</h3>
                  <p>Skills: {worker.skills.join(', ')}</p>
                  <p>Rating: {worker.rating} ⭐</p>
                  <p>Availability: {worker.availability.join(', ')}</p>
                  <p>Location: {worker.location}</p>
                  <p className={worker.verified ? 'text-green-500' : 'text-red-500'}>
                    Verified: {worker.verified ? 'Yes' : 'No'} | Right to Work: {worker.rightToWork ? 'Yes' : 'No'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Bookings */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Transparent Performance Feedback</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map(booking => (
                <div key={booking.id} className="bg-white p-6 rounded shadow">
                  <h3 className="font-semibold">Booking {booking.id}</h3>
                  <p>Shift: {shifts.find(s => s.id === booking.shiftId)?.title}</p>
                  <p>Worker: {workers.find(w => w.id === booking.workerId)?.name}</p>
                  <p>Status: {booking.status}</p>
                  {booking.rating && <p>Your Rating: {booking.rating} ⭐</p>}
                  {!booking.rating && (
                    <button onClick={() => handleRate(booking)} className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">Rate Worker</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modals */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded max-w-md w-full">
              {modalType === 'postShift' && (
                <>
                  <h3>Post Shift</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const newShift: Shift = {
                      id: Date.now().toString(),
                      title: formData.get('title') as string,
                      date: new Date(formData.get('date') as string),
                      startTime: formData.get('startTime') as string,
                      endTime: formData.get('endTime') as string,
                      role: formData.get('role') as string,
                      skills: (formData.get('skills') as string).split(','),
                      location: formData.get('location') as string,
                      radius: parseInt(formData.get('radius') as string),
                      status: formData.get('emergency') === 'on' ? 'emergency' : 'open',
                      businessId: '1',
                    };
                    handleSaveShift(newShift);
                  }}>
                    <input name="title" placeholder="Title" className="w-full p-2 border rounded mb-2" required />
                    <input name="date" type="date" className="w-full p-2 border rounded mb-2" required />
                    <input name="startTime" type="time" className="w-full p-2 border rounded mb-2" required />
                    <input name="endTime" type="time" className="w-full p-2 border rounded mb-2" required />
                    <input name="role" placeholder="Role" className="w-full p-2 border rounded mb-2" required />
                    <input name="skills" placeholder="Skills (comma-separated)" className="w-full p-2 border rounded mb-2" required />
                    <input name="location" placeholder="Location" className="w-full p-2 border rounded mb-2" required />
                    <input name="radius" type="number" placeholder="Radius (miles)" className="w-full p-2 border rounded mb-2" required />
                    <label><input name="emergency" type="checkbox" /> Emergency Cover</label>
                    <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Post</button>
                  </form>
                </>
              )}
              {modalType === 'bookWorker' && selectedShift && (
                <>
                  <h3>Book Worker for {selectedShift.title}</h3>
                  <ul>
                    {matches.map(worker => (
                      <li key={worker.id} className="mb-2 p-2 border rounded">
                        {worker.name} (Rating: {worker.rating} ⭐)
                        <button onClick={() => handleConfirmBooking(worker.id)} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">Book</button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {modalType === 'rate' && (
                <>
                  <h3>Rate Worker</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    handleSaveRating(parseInt(formData.get('rating') as string));
                  }}>
                    <input name="rating" type="number" min="1" max="5" placeholder="Rating (1-5)" className="w-full p-2 border rounded mb-2" required />
                    <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">Submit</button>
                  </form>
                </>
              )}
              <button onClick={() => setShowModal(false)} className="mt-4 text-red-500">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}