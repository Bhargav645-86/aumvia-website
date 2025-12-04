'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, Clock, Plus, Edit2, Trash2, Save, X, 
  ChevronLeft, ChevronRight, Users, DollarSign, Download,
  Check, AlertCircle, Settings, Building2, ArrowLeft
} from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  color: string;
}

interface Shift {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  status: 'draft' | 'published' | 'completed';
  color: string;
}

interface Timesheet {
  id: string;
  staffName: string;
  date: string;
  scheduledHours: number;
  actualHours: number;
  variance: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface BusinessHours {
  openTime: string;
  closeTime: string;
  isConfigured: boolean;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function RotaTimesheets() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'rota' | 'timesheets'>('rota');
  const [selectedWeek, setSelectedWeek] = useState<Date>(getMonday(new Date()));
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('');
  
  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    openTime: '09:00',
    closeTime: '22:00',
    isConfigured: false
  });

  const [staff] = useState<Staff[]>([
    { id: '1', name: 'Ben Carter', role: 'Barista', hourlyRate: 12.50, color: '#4CAF50' },
    { id: '2', name: 'Chloe Williams', role: 'Manager', hourlyRate: 16.00, color: '#2196F3' },
    { id: '3', name: 'David Lee', role: 'Server', hourlyRate: 11.50, color: '#FF9800' },
    { id: '4', name: 'Emma Clark', role: 'Kitchen Staff', hourlyRate: 12.00, color: '#9C27B0' },
  ]);

  const [shifts, setShifts] = useState<Shift[]>([
    { id: '1', staffId: '1', staffName: 'Ben Carter', role: 'Barista', date: '2024-12-09', startTime: '07:00', endTime: '15:00', breakMinutes: 30, status: 'published', color: '#4CAF50' },
    { id: '2', staffId: '2', staffName: 'Chloe Williams', role: 'Manager', date: '2024-12-09', startTime: '09:00', endTime: '17:00', breakMinutes: 60, status: 'published', color: '#2196F3' },
    { id: '3', staffId: '3', staffName: 'David Lee', role: 'Server', date: '2024-12-10', startTime: '12:00', endTime: '20:00', breakMinutes: 30, status: 'draft', color: '#FF9800' },
  ]);

  const [timesheets] = useState<Timesheet[]>([
    { id: '1', staffName: 'Ben Carter', date: '2024-12-02', scheduledHours: 8, actualHours: 8.5, variance: 30, status: 'pending' },
    { id: '2', staffName: 'Chloe Williams', date: '2024-12-02', scheduledHours: 8, actualHours: 8, variance: 0, status: 'approved' },
    { id: '3', staffName: 'David Lee', date: '2024-12-03', scheduledHours: 8, actualHours: 7.5, variance: -30, status: 'pending' },
  ]);

  const [newShift, setNewShift] = useState({
    staffId: '',
    startTime: '',
    endTime: '',
    breakMinutes: 30
  });

  function getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function getWeekDays(monday: Date): { date: Date; dayName: string; dateStr: string }[] {
    return DAYS_OF_WEEK.map((dayName, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return {
        date,
        dayName,
        dateStr: date.toISOString().split('T')[0]
      };
    });
  }

  function calculateShiftHours(startTime: string, endTime: string, breakMinutes: number): number {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM) - breakMinutes;
    return Math.max(0, totalMinutes / 60);
  }

  function getTotalLabourCost(): number {
    return shifts.reduce((total, shift) => {
      const staffMember = staff.find(s => s.id === shift.staffId);
      if (staffMember) {
        const hours = calculateShiftHours(shift.startTime, shift.endTime, shift.breakMinutes);
        return total + (hours * staffMember.hourlyRate);
      }
      return total;
    }, 0);
  }

  function getTotalHours(): number {
    return shifts.reduce((total, shift) => {
      return total + calculateShiftHours(shift.startTime, shift.endTime, shift.breakMinutes);
    }, 0);
  }

  function getShiftsForDay(dateStr: string): Shift[] {
    return shifts.filter(shift => shift.date === dateStr);
  }

  function handleAddShift() {
    if (!newShift.staffId || !newShift.startTime || !newShift.endTime || !selectedDay) return;
    
    const staffMember = staff.find(s => s.id === newShift.staffId);
    if (!staffMember) return;

    const shift: Shift = {
      id: Date.now().toString(),
      staffId: newShift.staffId,
      staffName: staffMember.name,
      role: staffMember.role,
      date: selectedDay,
      startTime: newShift.startTime,
      endTime: newShift.endTime,
      breakMinutes: newShift.breakMinutes,
      status: 'draft',
      color: staffMember.color
    };

    setShifts([...shifts, shift]);
    setShowAddShiftModal(false);
    setNewShift({ staffId: '', startTime: '', endTime: '', breakMinutes: 30 });
    setSelectedDay('');
  }

  function handleDeleteShift(shiftId: string) {
    setShifts(shifts.filter(s => s.id !== shiftId));
  }

  function handlePublishRota() {
    setShifts(shifts.map(s => ({ ...s, status: 'published' as const })));
    alert('Rota published successfully! Staff have been notified.');
  }

  function openAddShiftModal(dateStr: string) {
    setSelectedDay(dateStr);
    setNewShift({ 
      staffId: '', 
      startTime: businessHours.openTime, 
      endTime: businessHours.closeTime, 
      breakMinutes: 30 
    });
    setShowAddShiftModal(true);
  }

  function handleSaveBusinessHours() {
    setBusinessHours({ ...businessHours, isConfigured: true });
    setShowSettingsModal(false);
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rota system...</p>
        </div>
      </div>
    );
  }

  if (!session || !['business', 'manager'].includes(session.user?.role || '')) {
    redirect('/login');
  }

  const weekDays = getWeekDays(selectedWeek);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/business" className="text-gray-600 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-indigo-900">Rota & Timesheets</h1>
                <p className="text-sm text-gray-600">Manage your team's schedule</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Business Hours Settings"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('rota')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'rota'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Rota Builder
          </button>
          <button
            onClick={() => setActiveTab('timesheets')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'timesheets'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Clock className="w-5 h-5 inline mr-2" />
            Timesheets
          </button>
        </div>

        {activeTab === 'rota' && (
          <>
            {/* Business Hours Notice */}
            {!businessHours.isConfigured && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-yellow-800">Set Your Business Hours</p>
                  <p className="text-sm text-yellow-700">Configure your opening and closing times for easier shift scheduling.</p>
                </div>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
                >
                  Set Hours
                </button>
              </div>
            )}

            {/* Week Navigation & Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedWeek(new Date(selectedWeek.setDate(selectedWeek.getDate() - 7)))}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">
                      Week of {selectedWeek.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h2>
                    {businessHours.isConfigured && (
                      <p className="text-sm text-gray-500">
                        Business hours: {businessHours.openTime} - {businessHours.closeTime}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedWeek(new Date(selectedWeek.setDate(selectedWeek.getDate() + 7)))}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Total Hours</p>
                    <p className="text-2xl font-bold text-indigo-600">{getTotalHours().toFixed(1)}h</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Labour Cost</p>
                    <p className="text-2xl font-bold text-emerald-600">£{getTotalLabourCost().toFixed(2)}</p>
                  </div>
                  <button
                    onClick={handlePublishRota}
                    className="px-6 py-3 bg-gradient-to-r from-gold to-yellow-500 text-indigo-900 rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    Publish Rota
                  </button>
                </div>
              </div>
            </div>

            {/* Weekly Rota Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
              {weekDays.map(({ date, dayName, dateStr }) => {
                const dayShifts = getShiftsForDay(dateStr);
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                
                return (
                  <div 
                    key={dateStr}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
                  >
                    <div className={`p-4 ${isToday ? 'bg-indigo-600 text-white' : 'bg-gray-50'}`}>
                      <p className="font-semibold">{dayName}</p>
                      <p className={`text-sm ${isToday ? 'text-indigo-100' : 'text-gray-500'}`}>
                        {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    
                    <div className="p-3 min-h-[200px]">
                      {dayShifts.length > 0 ? (
                        <div className="space-y-2">
                          {dayShifts.map(shift => (
                            <div 
                              key={shift.id}
                              className="p-3 rounded-xl text-white text-sm relative group"
                              style={{ backgroundColor: shift.color }}
                            >
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <button 
                                  onClick={() => setEditingShift(shift)}
                                  className="p-1 bg-white/20 rounded hover:bg-white/40"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteShift(shift.id)}
                                  className="p-1 bg-white/20 rounded hover:bg-red-500"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="font-semibold truncate">{shift.staffName}</p>
                              <p className="opacity-90 text-xs">{shift.role}</p>
                              <p className="text-xs mt-1">{shift.startTime} - {shift.endTime}</p>
                              {shift.status === 'draft' && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded text-xs">Draft</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 py-4">
                          <p className="text-sm">No shifts</p>
                        </div>
                      )}
                      
                      <button
                        onClick={() => openAddShiftModal(dateStr)}
                        className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Shift
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Staff Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-heading font-bold text-indigo-900 mb-4">Staff Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {staff.map(member => {
                  const memberShifts = shifts.filter(s => s.staffId === member.id);
                  const totalHours = memberShifts.reduce((sum, s) => 
                    sum + calculateShiftHours(s.startTime, s.endTime, s.breakMinutes), 0
                  );
                  const totalCost = totalHours * member.hourlyRate;
                  
                  return (
                    <div 
                      key={member.id}
                      className="p-4 rounded-xl border-l-4"
                      style={{ borderColor: member.color, backgroundColor: `${member.color}10` }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: member.color }}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm mt-3">
                        <span className="text-gray-600">{totalHours.toFixed(1)} hours</span>
                        <span className="font-semibold text-emerald-600">£{totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === 'timesheets' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-indigo-900">Timesheet Approvals</h2>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Scheduled</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actual</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Variance</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {timesheets.map(ts => (
                    <tr key={ts.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                            {ts.staffName.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{ts.staffName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(ts.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">{ts.scheduledHours}h</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{ts.actualHours}h</td>
                      <td className={`px-6 py-4 text-right font-medium ${
                        ts.variance > 0 ? 'text-emerald-600' : ts.variance < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {ts.variance > 0 ? '+' : ''}{ts.variance} min
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          ts.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                          ts.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {ts.status === 'approved' && <Check className="w-3 h-3" />}
                          {ts.status.charAt(0).toUpperCase() + ts.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {ts.status === 'pending' && (
                          <div className="flex justify-center gap-2">
                            <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
                              Approve
                            </button>
                            <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Shift Modal */}
      {showAddShiftModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-indigo-900">Add New Shift</h3>
              <button onClick={() => setShowAddShiftModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Staff Member</label>
                <select
                  value={newShift.staffId}
                  onChange={(e) => setNewShift({ ...newShift, staffId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select staff member</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.role}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={newShift.startTime}
                    onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={newShift.endTime}
                    onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Break Duration (minutes)</label>
                <select
                  value={newShift.breakMinutes}
                  onChange={(e) => setNewShift({ ...newShift, breakMinutes: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="0">No break</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddShiftModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddShift}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Shift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Business Hours Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-xl font-heading font-bold text-indigo-900">Business Hours</h3>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Set your typical opening and closing times. This helps pre-fill shift times when creating new schedules.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Opening Time</label>
                  <input
                    type="time"
                    value={businessHours.openTime}
                    onChange={(e) => setBusinessHours({ ...businessHours, openTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Closing Time</label>
                  <input
                    type="time"
                    value={businessHours.closeTime}
                    onChange={(e) => setBusinessHours({ ...businessHours, closeTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBusinessHours}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Hours
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
