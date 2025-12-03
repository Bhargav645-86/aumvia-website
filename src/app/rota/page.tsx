'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface Staff {
  id: string;
  name: string;
  role: string;
  hourly_rate: number;
  color: string;
  preferred_hours: number;
}

interface Shift {
  id: string;
  staff_id: string;
  role: string;
  start_time: string;
  end_time: string;
  unpaid_break_minutes: number;
  status: string;
  week_start: string;
  staff?: Staff;
}

interface Timesheet {
  id: string;
  shift_id: string;
  staff_id: string;
  scheduled_hours: number;
  actual_hours: number;
  variance_minutes: number;
  status: string;
  submitted_at: string;
  staff?: Staff;
  shift?: Shift;
}

export default function RotaTimesheets() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'rota' | 'timesheets'>('rota');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<Date>(getMonday(new Date()));
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showTimesheetModal, setShowTimesheetModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [draggedStaff, setDraggedStaff] = useState<Staff | null>(null);
  const [totalLaborCost, setTotalLaborCost] = useState(0);
  const [totalWeeklyHours, setTotalWeeklyHours] = useState(0);
  const [loading, setLoading] = useState(true);

  const businessId = 'default';

  useEffect(() => {
    loadData();
  }, [selectedWeek]);

  useEffect(() => {
    calculateTotals();
  }, [shifts, staff]);

  async function loadData() {
    setLoading(true);
    try {
      await Promise.all([loadStaff(), loadShifts()]);
      await loadTimesheets();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadStaff() {
    const response = await fetch(`/api/rota/staff?businessId=${businessId}`);
    const data = await response.json();

    if (data.length === 0) {
      await initializeSampleData();
      const response2 = await fetch(`/api/rota/staff?businessId=${businessId}`);
      const data2 = await response2.json();
      setStaff(data2);
    } else {
      setStaff(data);
    }
  }

  async function loadShifts() {
    const weekStart = formatDate(selectedWeek);
    const response = await fetch(`/api/rota/shifts?businessId=${businessId}&weekStart=${weekStart}`);
    const data = await response.json();
    setShifts(data);
  }

  async function loadTimesheets() {
    const response = await fetch(`/api/rota/timesheets?businessId=${businessId}`);
    const data = await response.json();
    setTimesheets(data);
  }

  async function initializeSampleData() {
    const sampleStaff = [
      { business_id: businessId, name: 'Ben', role: 'Barista', hourly_rate: 12.50, color: '#4CAF50', preferred_hours: 40 },
      { business_id: businessId, name: 'Chloe', role: 'Manager', hourly_rate: 16.00, color: '#2196F3', preferred_hours: 45 },
      { business_id: businessId, name: 'David', role: 'Server', hourly_rate: 11.50, color: '#FF9800', preferred_hours: 35 },
      { business_id: businessId, name: 'Emma', role: 'Barista', hourly_rate: 12.00, color: '#9C27B0', preferred_hours: 30 }
    ];

    for (const member of sampleStaff) {
      await fetch('/api/rota/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
    }
  }

  function calculateTotals() {
    let totalCost = 0;
    let totalHours = 0;

    shifts.forEach(shift => {
      const hours = calculateShiftHours(shift);
      totalHours += hours;

      const staffMember = shift.staff || staff.find(s => s.id === shift.staff_id);
      if (staffMember) {
        totalCost += hours * staffMember.hourly_rate;
      }
    });

    setTotalLaborCost(totalCost);
    setTotalWeeklyHours(totalHours);
  }

  function calculateShiftHours(shift: Shift): number {
    const start = new Date(shift.start_time);
    const end = new Date(shift.end_time);
    const diffMs = end.getTime() - start.getTime();
    const hours = diffMs / (1000 * 60 * 60);
    return Math.max(0, hours - (shift.unpaid_break_minutes || 0) / 60);
  }

  function getWeekDays(monday: Date): Date[] {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      days.push(day);
    }
    return days;
  }

  function getTimeSlots(): string[] {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        slots.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
      }
    }
    return slots;
  }

  function handleCellClick(day: Date, timeSlot: string) {
    if (!draggedStaff) return;

    const [hours, minutes] = timeSlot.split(':').map(Number);
    const startTime = new Date(day);
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 8);

    setEditingShift({
      id: '',
      staff_id: draggedStaff.id,
      role: draggedStaff.role,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      unpaid_break_minutes: 30,
      status: 'draft',
      week_start: formatDate(selectedWeek),
      staff: draggedStaff
    });
    setShowShiftModal(true);
    setDraggedStaff(null);
  }

  function handleShiftClick(shift: Shift) {
    setEditingShift(shift);
    setShowShiftModal(true);
  }

  async function handleSaveShift(shiftData: Partial<Shift>) {
    try {
      if (editingShift?.id) {
        const response = await fetch('/api/rota/shifts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...shiftData, id: editingShift.id })
        });
        const updated = await response.json();
        setShifts(shifts.map(s => s.id === updated.id ? updated : s));
      } else {
        const response = await fetch('/api/rota/shifts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...shiftData,
            business_id: businessId,
            week_start: formatDate(selectedWeek)
          })
        });
        const newShift = await response.json();
        setShifts([...shifts, newShift]);
      }
      setShowShiftModal(false);
      setEditingShift(null);
    } catch (error) {
      console.error('Error saving shift:', error);
    }
  }

  async function handleDeleteShift(shiftId: string) {
    if (!confirm('Delete this shift?')) return;

    try {
      await fetch(`/api/rota/shifts?id=${shiftId}`, { method: 'DELETE' });
      setShifts(shifts.filter(s => s.id !== shiftId));
      setShowShiftModal(false);
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  }

  async function handlePublishRota() {
    try {
      const response = await fetch('/api/rota/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, weekStart: formatDate(selectedWeek) })
      });
      const result = await response.json();
      alert(result.message);
      await loadShifts();
      setShowPublishModal(false);
    } catch (error) {
      console.error('Error publishing rota:', error);
    }
  }

  async function handleTimesheetAction(timesheet: Timesheet, action: 'approve' | 'reject' | 'amend', newHours?: number) {
    try {
      const updateData: any = {
        id: timesheet.id,
        status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'requires_review'
      };

      if (action === 'amend' && newHours !== undefined) {
        updateData.actual_hours = newHours;
        const variance = Math.round((newHours - timesheet.scheduled_hours) * 60);
        updateData.variance_minutes = variance;
        updateData.status = Math.abs(variance) <= 15 ? 'approved' : 'requires_review';
      }

      const response = await fetch('/api/rota/timesheets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const updated = await response.json();
      setTimesheets(timesheets.map(t => t.id === updated.id ? updated : t));
      setShowTimesheetModal(false);
      setSelectedTimesheet(null);
    } catch (error) {
      console.error('Error updating timesheet:', error);
    }
  }

  function handleExportTimesheets() {
    const csv = ['Employee,Scheduled Hours,Actual Hours,Variance (min),Status,Submitted At'];
    timesheets.forEach(t => {
      csv.push(`${t.staff?.name || 'Unknown'},${t.scheduled_hours},${t.actual_hours},${t.variance_minutes},${t.status},${new Date(t.submitted_at).toLocaleString()}`);
    });

    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheets-${formatDate(new Date())}.csv`;
    a.click();
  }

  function getShiftsForCell(day: Date, timeSlot: string): Shift[] {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const cellTime = new Date(day);
    cellTime.setHours(hours, minutes, 0, 0);

    return shifts.filter(shift => {
      const start = new Date(shift.start_time);
      const end = new Date(shift.end_time);
      return cellTime >= start && cellTime < end;
    });
  }

  function getStaffHoursAndCost(staffId: string): { hours: number; cost: number } {
    let hours = 0;
    let cost = 0;
    const staffMember = staff.find(s => s.id === staffId);

    shifts.filter(s => s.staff_id === staffId).forEach(shift => {
      const shiftHours = calculateShiftHours(shift);
      hours += shiftHours;
      if (staffMember) {
        cost += shiftHours * staffMember.hourly_rate;
      }
    });

    return { hours, cost };
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading rota system...</div>
        </div>
      </div>
    );
  }

  if (!session || !['business', 'manager'].includes(session.user?.role || '')) {
    redirect('/login');
  }

  const weekDays = getWeekDays(selectedWeek);
  const timeSlots = getTimeSlots();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-indigo-900">Rota & Timesheets Hub</h1>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('rota')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'rota'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Rota Builder
            </button>
            <button
              onClick={() => setActiveTab('timesheets')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'timesheets'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Timesheets
            </button>
          </div>
        </div>

        {activeTab === 'rota' && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedWeek(new Date(selectedWeek.setDate(selectedWeek.getDate() - 7)))}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Previous Week
                  </button>
                  <h2 className="text-xl font-bold">
                    Week of {selectedWeek.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </h2>
                  <button
                    onClick={() => setSelectedWeek(new Date(selectedWeek.setDate(selectedWeek.getDate() + 7)))}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Next Week
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Total Weekly Hours</div>
                    <div className="text-2xl font-bold text-indigo-900">{totalWeeklyHours.toFixed(1)}h</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Total Labor Cost</div>
                    <div className="text-2xl font-bold text-green-600">£{totalLaborCost.toFixed(2)}</div>
                  </div>
                  <button
                    onClick={() => setShowPublishModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                    style={{ backgroundColor: '#D4AF37' }}
                  >
                    Publish Rota
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto" style={{ maxHeight: '70vh' }}>
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="border p-2 text-left font-semibold w-24">Time</th>
                        {weekDays.map((day, idx) => (
                          <th key={idx} className="border p-2 text-center font-semibold">
                            <div>{day.toLocaleDateString('en-GB', { weekday: 'short' })}</div>
                            <div className="text-sm font-normal">{day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((slot, slotIdx) => (
                        <tr key={slotIdx}>
                          <td className="border p-2 bg-gray-50 text-sm font-medium">{slot}</td>
                          {weekDays.map((day, dayIdx) => {
                            const cellShifts = getShiftsForCell(day, slot);
                            return (
                              <td
                                key={dayIdx}
                                className="border p-1 cursor-pointer hover:bg-blue-50 transition-colors relative"
                                style={{ height: '40px', minWidth: '120px' }}
                                onClick={() => handleCellClick(day, slot)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleCellClick(day, slot)}
                              >
                                {cellShifts.map((shift) => {
                                  const staffMember = shift.staff || staff.find(s => s.id === shift.staff_id);
                                  const start = new Date(shift.start_time);
                                  const isFirstSlot = start.getHours() === parseInt(slot.split(':')[0]) &&
                                                       start.getMinutes() === parseInt(slot.split(':')[1]);

                                  if (!isFirstSlot) return null;

                                  return (
                                    <div
                                      key={shift.id}
                                      className="absolute inset-0 m-1 p-1 rounded text-xs text-white font-semibold cursor-pointer hover:opacity-90 flex flex-col justify-center overflow-hidden"
                                      style={{
                                        backgroundColor: staffMember?.color || '#4CAF50',
                                        height: `${calculateShiftHours(shift) * 2 * 40}px`,
                                        zIndex: 5
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleShiftClick(shift);
                                      }}
                                    >
                                      <div className="truncate">{staffMember?.name}</div>
                                      <div className="text-[10px] opacity-90">
                                        {new Date(shift.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        {' - '}
                                        {new Date(shift.end_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <h3 className="text-lg font-bold mb-4 text-indigo-900">Staff</h3>
                  <div className="text-xs text-gray-600 mb-3">Drag staff to grid to create shift</div>
                  {staff.map((member) => {
                    const { hours, cost } = getStaffHoursAndCost(member.id);
                    return (
                      <div
                        key={member.id}
                        draggable
                        onDragStart={() => setDraggedStaff(member)}
                        onDragEnd={() => setDraggedStaff(null)}
                        className="mb-2 p-3 rounded-lg cursor-move hover:shadow-md transition-all border-2 border-transparent hover:border-indigo-300"
                        style={{ backgroundColor: member.color + '20', borderLeftWidth: '4px', borderLeftColor: member.color }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm">{member.name}</div>
                            <div className="text-xs text-gray-600">{member.role}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-600">{hours.toFixed(1)}h</div>
                            <div className="text-xs font-semibold text-green-600">£{cost.toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">£{member.hourly_rate}/hr</div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white rounded-lg shadow-lg p-4">
                  <h3 className="text-lg font-bold mb-3 text-indigo-900">Coverage</h3>
                  <div className="space-y-2">
                    {weekDays.map((day, idx) => {
                      const dayShifts = shifts.filter(s => {
                        const shiftDate = new Date(s.start_time);
                        return shiftDate.toDateString() === day.toDateString();
                      });
                      const coverage = dayShifts.length > 0 ? Math.min(100, dayShifts.length * 25) : 0;

                      return (
                        <div key={idx}>
                          <div className="text-xs font-medium mb-1">
                            {day.toLocaleDateString('en-GB', { weekday: 'short' })}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${coverage > 75 ? 'bg-green-500' : coverage > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${coverage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'timesheets' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-indigo-900">Timesheet Approval</h2>
              <button
                onClick={handleExportTimesheets}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
              >
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Scheduled</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actual</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Variance</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {timesheets.map((timesheet) => {
                    const variance = timesheet.variance_minutes;
                    const isWithinTolerance = Math.abs(variance) <= 15;

                    return (
                      <tr key={timesheet.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {timesheet.staff?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {timesheet.shift?.role || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900">
                          {timesheet.scheduled_hours.toFixed(2)}h
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900">
                          {timesheet.actual_hours.toFixed(2)}h
                        </td>
                        <td className={`px-6 py-4 text-sm text-right font-semibold ${
                          variance > 0 ? 'text-red-600' : variance < 0 ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {variance > 0 ? '+' : ''}{variance}min
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            timesheet.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : timesheet.status === 'requires_review'
                              ? 'bg-amber-100 text-amber-800'
                              : timesheet.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {timesheet.status === 'requires_review' ? 'Requires Review' : timesheet.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {timesheet.status === 'requires_review' && (
                            <button
                              onClick={() => {
                                setSelectedTimesheet(timesheet);
                                setShowTimesheetModal(true);
                              }}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all"
                            >
                              Review
                            </button>
                          )}
                          {timesheet.status === 'approved' && (
                            <span className="text-green-600 text-sm font-semibold">Approved</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {timesheets.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No timesheets submitted yet
                </div>
              )}
            </div>
          </div>
        )}

        {showShiftModal && editingShift && (
          <ShiftModal
            shift={editingShift}
            staff={staff}
            onSave={handleSaveShift}
            onDelete={editingShift.id ? handleDeleteShift : undefined}
            onClose={() => {
              setShowShiftModal(false);
              setEditingShift(null);
            }}
          />
        )}

        {showTimesheetModal && selectedTimesheet && (
          <TimesheetModal
            timesheet={selectedTimesheet}
            onApprove={() => handleTimesheetAction(selectedTimesheet, 'approve')}
            onReject={() => handleTimesheetAction(selectedTimesheet, 'reject')}
            onAmend={(hours) => handleTimesheetAction(selectedTimesheet, 'amend', hours)}
            onClose={() => {
              setShowTimesheetModal(false);
              setSelectedTimesheet(null);
            }}
          />
        )}

        {showPublishModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold mb-4 text-indigo-900">Publish Rota</h3>
              <p className="text-gray-600 mb-6">
                This will publish all draft shifts for the week of{' '}
                {selectedWeek.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}.
                Staff will be notified via email and SMS.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handlePublishRota}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                >
                  Publish & Notify
                </button>
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ShiftModal({
  shift,
  staff,
  onSave,
  onDelete,
  onClose
}: {
  shift: Shift;
  staff: Staff[];
  onSave: (data: Partial<Shift>) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    staff_id: shift.staff_id,
    role: shift.role,
    start_time: new Date(shift.start_time).toISOString().slice(0, 16),
    end_time: new Date(shift.end_time).toISOString().slice(0, 16),
    unpaid_break_minutes: shift.unpaid_break_minutes || 30
  });

  const selectedStaff = staff.find(s => s.id === formData.staff_id);
  const startDate = new Date(formData.start_time);
  const endDate = new Date(formData.end_time);
  const hours = Math.max(0, (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60) - formData.unpaid_break_minutes / 60);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-6 text-indigo-900">
          {shift.id ? 'Edit Shift' : 'Create Shift'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Employee</label>
            <select
              value={formData.staff_id}
              onChange={(e) => {
                const staff = staff.find(s => s.id === e.target.value);
                setFormData({ ...formData, staff_id: e.target.value, role: staff?.role || formData.role });
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              {staff.map(s => (
                <option key={s.id} value={s.id}>{s.name} - {s.role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
              <input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
              <input
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Unpaid Break (minutes)</label>
            <input
              type="number"
              value={formData.unpaid_break_minutes}
              onChange={(e) => setFormData({ ...formData, unpaid_break_minutes: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              min="0"
              step="15"
            />
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-sm text-gray-700 space-y-1">
              <div>Paid Hours: <span className="font-bold">{hours.toFixed(2)}h</span></div>
              {selectedStaff && (
                <div>Cost: <span className="font-bold text-green-600">£{(hours * selectedStaff.hourly_rate).toFixed(2)}</span></div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => onSave(formData)}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
          >
            {shift.id ? 'Update Shift' : 'Create Shift'}
          </button>
          {onDelete && shift.id && (
            <button
              onClick={() => onDelete(shift.id)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function TimesheetModal({
  timesheet,
  onApprove,
  onReject,
  onAmend,
  onClose
}: {
  timesheet: Timesheet;
  onApprove: () => void;
  onReject: () => void;
  onAmend: (hours: number) => void;
  onClose: () => void;
}) {
  const [amendedHours, setAmendedHours] = useState(timesheet.actual_hours);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
        <h3 className="text-2xl font-bold mb-6 text-indigo-900">Review Timesheet</h3>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Employee</div>
              <div className="font-semibold">{timesheet.staff?.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Role</div>
              <div className="font-semibold">{timesheet.shift?.role}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Scheduled Hours</div>
              <div className="text-xl font-bold text-indigo-900">{timesheet.scheduled_hours.toFixed(2)}h</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Actual Hours</div>
              <div className="text-xl font-bold text-green-600">{timesheet.actual_hours.toFixed(2)}h</div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            Math.abs(timesheet.variance_minutes) <= 15 ? 'bg-green-50' : 'bg-amber-50'
          }`}>
            <div className="text-sm text-gray-600">Variance</div>
            <div className={`text-xl font-bold ${
              timesheet.variance_minutes > 0 ? 'text-red-600' : timesheet.variance_minutes < 0 ? 'text-blue-600' : 'text-green-600'
            }`}>
              {timesheet.variance_minutes > 0 ? '+' : ''}{timesheet.variance_minutes} minutes
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amend Actual Hours</label>
            <input
              type="number"
              value={amendedHours}
              onChange={(e) => setAmendedHours(parseFloat(e.target.value) || 0)}
              step="0.25"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onApprove}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
          >
            Approve as Submitted
          </button>

          {amendedHours !== timesheet.actual_hours && (
            <button
              onClick={() => onAmend(amendedHours)}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Amend & Approve ({amendedHours.toFixed(2)}h)
            </button>
          )}

          <button
            onClick={onReject}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
          >
            Reject Timesheet
          </button>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
