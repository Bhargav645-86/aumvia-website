'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  start: Date;
  end: Date;
  status: 'draft' | 'published';
}

interface Employee {
  id: string;
  name: string;
  roles: string[];
  preferredHours: number;
}

interface Timesheet {
  id: string;
  employeeId: string;
  shiftId: string;
  submittedHours: number;
  status: 'pending' | 'approved' | 'rejected';
}

export default function RotaTimesheets() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'rota' | 'timesheets'>('rota');
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [coverage, setCoverage] = useState(75);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    setEmployees([
      { id: '1', name: 'Ben', roles: ['barista', 'server'], preferredHours: 40 },
      { id: '2', name: 'Chloe', roles: ['manager'], preferredHours: 45 },
    ]);
    setShifts([
      { id: '1', employeeId: '1', employeeName: 'Ben', role: 'barista', start: new Date(), end: new Date(Date.now() + 8 * 60 * 60 * 1000), status: 'draft' },
    ]);
    setTimesheets([
      { id: '1', employeeId: '1', shiftId: '1', submittedHours: 8.5, status: 'pending' },
    ]);
  }, []);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session || !['business', 'manager'].includes(session.user?.role || '')) redirect('/login');

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && over.id === 'drop-zone') {
      const employee = employees.find(e => e.id === active.id);
      if (employee) {
        // Smart Suggestion: Auto-assign role and duration
        const suggestedRole = employee.roles[0];
        const suggestedEnd = new Date(Date.now() + 8 * 60 * 60 * 1000);
        const newShift: Shift = {
          id: Date.now().toString(),
          employeeId: employee.id,
          employeeName: employee.name,
          role: suggestedRole,
          start: new Date(),
          end: suggestedEnd,
          status: 'draft',
        };
        setShifts([...shifts, newShift]);
        setCoverage(Math.min(100, coverage + 10));
        setAlerts([...alerts, `Shift created for ${employee.name} (${suggestedRole})`]);
      }
    }
  };

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedShift: Shift) => {
    setShifts(shifts.map(s => s.id === updatedShift.id ? updatedShift : s));
    setShowEditModal(false);
    setEditingShift(null);
  };

  const handlePublish = () => {
    setShifts(shifts.map(s => ({ ...s, status: 'published' })));
    setShowPublishModal(false);
    alert('Rota published! Notifications sent to staff.');
  };

  const handleApproveTimesheet = (id: string) => {
    setTimesheets(timesheets.map(t => t.id === id ? { ...t, status: 'approved' } : t));
  };

  const handleExport = () => {
    const csv = timesheets.map(t => `${t.employeeId},${t.submittedHours}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timesheets.csv';
    a.click();
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-indigo-900 mb-6">📅 Rota & Timesheets Hub</h1>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button onClick={() => setActiveTab('rota')} className={`px-4 py-2 rounded ${activeTab === 'rota' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Rota Builder</button>
            <button onClick={() => setActiveTab('timesheets')} className={`px-4 py-2 rounded ${activeTab === 'timesheets' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Timesheets</button>
          </div>

          {activeTab === 'rota' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rota Builder (Interactive List with Drop Zone) */}
              <div className="lg:col-span-2 bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Interactive Rota Builder</h3>
                <DropZone />
                <h4 className="font-semibold mb-2">Current Shifts</h4>
                <ul>
                  {shifts.map(s => (
                    <li key={s.id} className="mb-2 p-2 border rounded flex justify-between">
                      <span>{s.employeeName} ({s.role}): {s.start.toLocaleTimeString()} - {s.end.toLocaleTimeString()} ({s.status})</span>
                      <button onClick={() => handleEditShift(s)} className="text-blue-500 underline">Edit</button>
                    </li>
                  ))}
                </ul>
                <button onClick={() => setShowPublishModal(true)} className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">Publish Rota</button>
              </div>

              {/* Employee List & Sidebar */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded shadow">
                  <h3 className="text-lg font-semibold mb-4">Employees (Drag to Add Shift)</h3>
                  {employees.map(emp => (
                    <DraggableEmployee key={emp.id} employee={emp} />
                  ))}
                </div>

                <div className="bg-white p-6 rounded shadow">
                  <h3 className="text-lg font-semibold mb-4">Coverage Meter (Live)</h3>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className={`h-4 rounded-full ${coverage > 80 ? 'bg-green-500' : coverage > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${coverage}%` }}></div>
                  </div>
                  <p className="mt-2 text-sm">{coverage}% Staffed</p>
                </div>

                <div className="bg-white p-6 rounded shadow">
                  <h3 className="text-lg font-semibold mb-4">Smart Suggestions & Alerts</h3>
                  <ul>
                    {alerts.map((alert, i) => (
                      <li key={i} className="mb-2 text-amber-600">{alert}</li>
                    ))}
                    <li className="mb-2">Suggestion: Add extra staff for school holidays</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timesheets' && (
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Integrated Timesheets</h3>
              <ul>
                {timesheets.map(t => (
                  <li key={t.id} className="mb-4 p-4 border rounded">
                    Employee {t.employeeId}: {t.submittedHours} hours ({t.status})
                    {t.status === 'pending' && (
                      <button onClick={() => handleApproveTimesheet(t.id)} className="ml-4 bg-green-500 text-white px-4 py-2 rounded">Approve</button>
                    )}
                  </li>
                ))}
              </ul>
              <button onClick={handleExport} className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">Export CSV</button>
            </div>
          )}

          {/* Edit Shift Modal (Dynamic Shift Adjuster) */}
          {showEditModal && editingShift && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded max-w-md">
                <h3>Edit Shift</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const updatedShift = {
                    ...editingShift,
                    role: formData.get('role') as string,
                    start: new Date(formData.get('start') as string),
                    end: new Date(formData.get('end') as string),
                  };
                  handleSaveEdit(updatedShift);
                }}>
                  <input name="role" defaultValue={editingShift.role} placeholder="Role" className="w-full p-2 border rounded mb-2" />
                  <input name="start" type="datetime-local" defaultValue={editingShift.start.toISOString().slice(0, 16)} className="w-full p-2 border rounded mb-2" />
                  <input name="end" type="datetime-local" defaultValue={editingShift.end.toISOString().slice(0, 16)} className="w-full p-2 border rounded mb-2" />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
                  <button onClick={() => setShowEditModal(false)} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
                </form>
              </div>
            </div>
          )}

          {/* Publish Modal */}
          {showPublishModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded max-w-md">
                <h3>Confirm Publish</h3>
                <p>Publish rota to all staff?</p>
                <button onClick={handlePublish} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Yes</button>
                <button onClick={() => setShowPublishModal(false)} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}

// Draggable Employee Component
function DraggableEmployee({ employee }: { employee: Employee }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: employee.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-2 mb-2 bg-blue-100 rounded cursor-move ${isDragging ? 'opacity-50' : ''}`}
    >
      {employee.name}
    </div>
  );
}

// Drop Zone Component
function DropZone() {
  const { setNodeRef } = useDroppable({
    id: 'drop-zone',
  });

  return (
    <div ref={setNodeRef} className="border-2 border-dashed border-gray-300 p-4 mb-4 text-center">
      Drop employee here to create a shift
    </div>
  );
}
