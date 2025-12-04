'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, FileText, MessageSquare, Plus, Search, 
  Calendar, Mail, Phone, CheckCircle, Clock, X,
  ArrowLeft, Download, Upload, Edit2, Trash2, Send,
  UserPlus, FileCheck, Bell, AlertCircle
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  startDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
}

interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  expiresAt?: string;
  status: 'valid' | 'expiring' | 'expired';
}

export default function HRManagement() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'employees' | 'documents' | 'communication'>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const [employees] = useState<Employee[]>([
    { id: '1', name: 'Ben Carter', email: 'ben@example.com', phone: '07700 900123', role: 'Barista', department: 'Front of House', startDate: '2024-03-15', status: 'active' },
    { id: '2', name: 'Chloe Williams', email: 'chloe@example.com', phone: '07700 900456', role: 'Manager', department: 'Management', startDate: '2023-08-01', status: 'active' },
    { id: '3', name: 'David Lee', email: 'david@example.com', phone: '07700 900789', role: 'Server', department: 'Front of House', startDate: '2024-06-10', status: 'on-leave' },
    { id: '4', name: 'Emma Clark', email: 'emma@example.com', phone: '07700 900012', role: 'Kitchen Staff', department: 'Kitchen', startDate: '2024-01-20', status: 'active' },
  ]);

  const [leaveRequests] = useState<LeaveRequest[]>([
    { id: '1', employeeName: 'David Lee', type: 'Annual Leave', startDate: '2024-12-10', endDate: '2024-12-15', status: 'approved', reason: 'Family holiday' },
    { id: '2', employeeName: 'Ben Carter', type: 'Sick Leave', startDate: '2024-12-08', endDate: '2024-12-09', status: 'pending', reason: 'Unwell' },
    { id: '3', employeeName: 'Emma Clark', type: 'Annual Leave', startDate: '2024-12-20', endDate: '2024-12-27', status: 'pending', reason: 'Christmas break' },
  ]);

  const [documents] = useState<Document[]>([
    { id: '1', name: 'Food Hygiene Certificate - Ben Carter', type: 'Certificate', uploadedAt: '2024-06-15', expiresAt: '2025-06-15', status: 'valid' },
    { id: '2', name: 'Employment Contract - Chloe Williams', type: 'Contract', uploadedAt: '2023-08-01', status: 'valid' },
    { id: '3', name: 'Right to Work - David Lee', type: 'ID Document', uploadedAt: '2024-06-10', expiresAt: '2024-12-20', status: 'expiring' },
    { id: '4', name: 'First Aid Certificate - Emma Clark', type: 'Certificate', uploadedAt: '2024-01-20', expiresAt: '2024-11-20', status: 'expired' },
  ]);

  const templates = [
    { name: 'Employment Contract', description: 'Standard UK employment contract template' },
    { name: 'Offer Letter', description: 'Job offer letter template' },
    { name: 'Disciplinary Notice', description: 'Formal disciplinary notice template' },
    { name: 'Reference Request', description: 'Employment reference request form' },
  ];

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading HR module...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'business') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/business" className="text-gray-600 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-indigo-900">HR & Admin</h1>
              <p className="text-sm text-gray-600">Manage your team, documents, and communications</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'employees'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            Employees
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'documents'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-5 h-5" />
            Documents
          </button>
          <button
            onClick={() => setActiveTab('communication')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'communication'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Communication
          </button>
        </div>

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Staff</p>
                    <p className="text-3xl font-bold text-indigo-600">{employees.length}</p>
                  </div>
                  <Users className="w-10 h-10 text-indigo-200" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-3xl font-bold text-emerald-600">{employees.filter(e => e.status === 'active').length}</p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-emerald-200" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">On Leave</p>
                    <p className="text-3xl font-bold text-yellow-600">{employees.filter(e => e.status === 'on-leave').length}</p>
                  </div>
                  <Calendar className="w-10 h-10 text-yellow-200" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pending Requests</p>
                    <p className="text-3xl font-bold text-orange-600">{leaveRequests.filter(l => l.status === 'pending').length}</p>
                  </div>
                  <Clock className="w-10 h-10 text-orange-200" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Employee Directory */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <h2 className="text-xl font-heading font-bold text-indigo-900">Employee Directory</h2>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search staff..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={() => setShowAddEmployeeModal(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <UserPlus className="w-5 h-5" />
                      Add Staff
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {filteredEmployees.map(emp => (
                    <div key={emp.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                          {emp.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{emp.name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              emp.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                              emp.status === 'on-leave' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {emp.status === 'on-leave' ? 'On Leave' : emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{emp.role} • {emp.department}</p>
                        </div>
                        <div className="hidden md:flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {emp.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {emp.phone}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leave Requests */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b flex items-center justify-between">
                  <h2 className="text-xl font-heading font-bold text-indigo-900">Leave Requests</h2>
                  <button
                    onClick={() => setShowLeaveModal(true)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                  {leaveRequests.map(req => (
                    <div key={req.id} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{req.employeeName}</p>
                          <p className="text-sm text-gray-600">{req.type}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                          req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(req.startDate).toLocaleDateString('en-GB')} - {new Date(req.endDate).toLocaleDateString('en-GB')}
                      </p>
                      <p className="text-sm text-gray-600 italic">"{req.reason}"</p>
                      
                      {req.status === 'pending' && (
                        <div className="flex gap-2 mt-3">
                          <button className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                            Approve
                          </button>
                          <button className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Document Library */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold text-indigo-900">Document Archive</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>

              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-3">
                  {documents.map(doc => (
                    <div key={doc.id} className={`p-4 rounded-xl border-l-4 ${
                      doc.status === 'expired' ? 'border-red-500 bg-red-50' :
                      doc.status === 'expiring' ? 'border-yellow-500 bg-yellow-50' :
                      'border-emerald-500 bg-gray-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <FileCheck className={`w-5 h-5 mt-0.5 ${
                            doc.status === 'expired' ? 'text-red-600' :
                            doc.status === 'expiring' ? 'text-yellow-600' :
                            'text-emerald-600'
                          }`} />
                          <div>
                            <p className="font-semibold text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-600">{doc.type}</p>
                            {doc.expiresAt && (
                              <p className={`text-xs mt-1 ${
                                doc.status === 'expired' ? 'text-red-600 font-semibold' :
                                doc.status === 'expiring' ? 'text-yellow-700' :
                                'text-gray-500'
                              }`}>
                                {doc.status === 'expired' ? 'Expired: ' : 'Expires: '}
                                {new Date(doc.expiresAt).toLocaleDateString('en-GB')}
                              </p>
                            )}
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Templates */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-heading font-bold text-indigo-900">Document Templates</h2>
                <p className="text-sm text-gray-600 mt-1">Pre-built templates for common HR documents</p>
              </div>

              <div className="p-4 space-y-3">
                {templates.map((template, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-indigo-600">{template.name}</p>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                      <FileText className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-6 text-white">
                  <h3 className="font-bold text-lg mb-2">E-Signature Coming Soon</h3>
                  <p className="text-sm text-indigo-100">
                    Send documents for digital signature directly through Aumvia. No more printing and scanning!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Communication Tab */}
        {activeTab === 'communication' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Announcements */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-heading font-bold text-indigo-900">Team Announcements</h2>
                <p className="text-sm text-gray-600 mt-1">Broadcast important messages to your team</p>
              </div>

              <div className="p-6">
                <textarea
                  placeholder="Write your announcement here..."
                  rows={4}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Will be sent to {employees.length} team members</span>
                  </div>
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Announcements</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">Christmas Rota Update</span>
                      <span className="text-xs text-gray-500">2 days ago</span>
                    </div>
                    <p className="text-sm text-gray-600">Please check the new holiday rota and confirm your availability by Friday.</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">New Health & Safety Training</span>
                      <span className="text-xs text-gray-500">1 week ago</span>
                    </div>
                    <p className="text-sm text-gray-600">All staff must complete the updated training module by end of month.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tasks */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold text-indigo-900">Task Assignments</h2>
                <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <div className="p-4 rounded-xl bg-yellow-50 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Complete Food Hygiene Quiz</span>
                    <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs font-medium">Due Tomorrow</span>
                  </div>
                  <p className="text-sm text-gray-600">Assigned to: Ben Carter, Emma Clark</p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Submit December Availability</span>
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">Due Dec 15</span>
                  </div>
                  <p className="text-sm text-gray-600">Assigned to: All Staff</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border-l-4 border-emerald-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Upload Updated ID</span>
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Completed by: David Lee</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-bold text-indigo-900">Add New Staff Member</h3>
              <button onClick={() => setShowAddEmployeeModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter full name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input type="tel" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="07700 000000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option>Barista</option>
                    <option>Server</option>
                    <option>Kitchen Staff</option>
                    <option>Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                  <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddEmployeeModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" />
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
