'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import useSWR from 'swr';

// Types
interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  documents: string[];
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Task {
  id: string;
  title: string;
  assignedTo: string;
  status: 'pending' | 'completed';
  dueDate: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function HRManagement() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'employees' | 'documents' | 'communication'>('employees');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'addEmployee' | 'leaveRequest' | 'esign' | null>(null);

  // Fetch data (replace with real APIs)
  const { data: empData } = useSWR('/api/hr/employees', fetcher);
  const { data: leaveData } = useSWR('/api/hr/leaves', fetcher);
  const { data: taskData } = useSWR('/api/hr/tasks', fetcher);

  useEffect(() => {
    if (empData) setEmployees(empData);
    if (leaveData) setLeaveRequests(leaveData);
    if (taskData) setTasks(taskData);
  }, [empData, leaveData, taskData]);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session || session.user?.role !== 'business') redirect('/login');

  const handleAddEmployee = () => {
    setModalType('addEmployee');
    setShowModal(true);
  };
  const handleLeaveRequest = () => {
    setModalType('leaveRequest');
    setShowModal(true);
  };
  const handleESign = () => {
    setModalType('esign');
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">HR & Admin Management</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-4 py-2 rounded ${activeTab === 'employees' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Employee Management
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 rounded ${activeTab === 'documents' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Document Automation
          </button>
          <button
            onClick={() => setActiveTab('communication')}
            className={`px-4 py-2 rounded ${activeTab === 'communication' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Communication Hub
          </button>
        </div>

        {/* Employee Management */}
        {activeTab === 'employees' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold">Employee Management</h2>
              <button onClick={handleAddEmployee} className="bg-green-500 text-white px-4 py-2 rounded">
                Add Employee
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Employee List</h3>
                <ul>
                  {employees.map(emp => (
                    <li key={emp.id} className="mb-2">{emp.name} - {emp.role}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Leave Management</h3>
                <button onClick={handleLeaveRequest} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                  Request Leave
                </button>
                {/* Temporary replacement for Calendar */}
                <div>
                  <h4 className="font-semibold mb-2">Upcoming Leave Requests</h4>
                  <ul>
                    {leaveRequests.map(req => (
                      <li key={req.id} className="mb-1">
                        Employee {req.employeeId}: {req.startDate} to {req.endDate} ({req.status})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HR Document Automation */}
        {activeTab === 'documents' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">HR Document Automation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Template Library</h3>
                <ul>
                  <li>Offer Letter Template</li>
                  <li>Contract Template</li>
                  <li>Policy Template</li>
                </ul>
                <button onClick={handleESign} className="mt-4 bg-purple-500 text-white px-4 py-2 rounded">
                  E-Sign Document
                </button>
              </div>
              <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Document Archive</h3>
                <input type="text" placeholder="Search documents" className="w-full p-2 border rounded mb-4" />
                <ul>
                  <li>Employee Contract - John Doe</li>
                  <li>Training Record - Jane Smith</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Communication Hub */}
        {activeTab === 'communication' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Communication Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Announcements</h3>
                <textarea placeholder="Broadcast message" className="w-full p-2 border rounded mb-4"></textarea>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Send Announcement</button>
              </div>
              <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Task Assignment</h3>
                <ul>
                  {tasks.map(task => (
                    <li key={task.id} className="mb-2">{task.title} - {task.status}</li>
                  ))}
                </ul>
                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Assign Task</button>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded max-w-md w-full">
              {modalType === 'addEmployee' && (
                <>
                  <h3>Add Employee</h3>
                  <form>
                    <input type="text" placeholder="Name" className="w-full p-2 border rounded mb-2" />
                    <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-2" />
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
                  </form>
                </>
              )}
              {modalType === 'leaveRequest' && (
                <>
                  <h3>Request Leave</h3>
                  <form>
                    <input type="date" className="w-full p-2 border rounded mb-2" />
                    <input type="date" className="w-full p-2 border rounded mb-2" />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                  </form>
                </>
              )}
              {modalType === 'esign' && (
                <>
                  <h3>E-Sign Document</h3>
                  <p>Sign here (mock signature)</p>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded">Sign</button>
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
