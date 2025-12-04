'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Shield, Users, FileText, Activity, Settings, CheckCircle, XCircle, 
  AlertTriangle, Clock, Search, Filter, Plus, Edit, Trash2, Eye,
  RefreshCw, Database, Server, Zap, TrendingUp, AlertCircle, Lock
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'business' | 'manager' | 'employee' | 'jobseeker' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  verified: boolean;
  businessType?: string;
  createdAt: string;
}

interface AuditLog {
  _id: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  performedBy: string;
  createdAt: string;
}

interface ComplianceItem {
  _id: string;
  title: string;
  region: string;
  type: 'law' | 'break' | 'hours' | 'compliance';
  category: string;
  content: string;
  references: string[];
  version: string;
  status: 'active' | 'archived';
  updatedAt: string;
}

interface SystemHealth {
  service: string;
  status: 'up' | 'down' | 'warning';
  latency: number;
  uptime: number;
  lastChecked: string;
}

interface PlatformStats {
  totalUsers: number;
  activeBusinesses: number;
  totalShifts: number;
  pendingApprovals: number;
}

export default function AdminTools() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'governance' | 'compliance' | 'monitoring'>('governance');
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats>({ totalUsers: 0, activeBusinesses: 0, totalShifts: 0, pendingApprovals: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [showUserModal, setShowUserModal] = useState(false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingCompliance, setEditingCompliance] = useState<ComplianceItem | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadAuditLogs(),
        loadComplianceItems(),
        loadSystemHealth()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    const response = await fetch('/api/admin/users');
    const data = await response.json();
    if (Array.isArray(data)) {
      setUsers(data);
    }
  }

  async function loadAuditLogs() {
    const response = await fetch('/api/admin/audit-logs?limit=50');
    const data = await response.json();
    if (data.logs) {
      setAuditLogs(data.logs);
    }
  }

  async function loadComplianceItems() {
    const response = await fetch('/api/admin/compliance');
    const data = await response.json();
    if (Array.isArray(data)) {
      setComplianceItems(data);
    }
  }

  async function loadSystemHealth() {
    const response = await fetch('/api/admin/system-health');
    const data = await response.json();
    if (data.health) {
      setSystemHealth(data.health);
    }
    if (data.platformStats) {
      setPlatformStats(data.platformStats);
    }
  }

  async function handleUserAction(user: User, action: 'verify' | 'suspend' | 'activate') {
    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: user._id, action })
      });
      await loadUsers();
      await loadAuditLogs();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  async function handleDeleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      await loadUsers();
      await loadAuditLogs();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  async function handleSaveCompliance(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const complianceData = {
      title: formData.get('title') as string,
      region: formData.get('region') as string,
      type: formData.get('type') as string,
      category: formData.get('category') as string,
      content: formData.get('content') as string,
      references: (formData.get('references') as string).split(',').map(r => r.trim()).filter(Boolean)
    };

    try {
      if (editingCompliance) {
        await fetch('/api/admin/compliance', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...complianceData, _id: editingCompliance._id })
        });
      } else {
        await fetch('/api/admin/compliance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(complianceData)
        });
      }
      await loadComplianceItems();
      await loadAuditLogs();
      setShowComplianceModal(false);
      setEditingCompliance(null);
    } catch (error) {
      console.error('Error saving compliance item:', error);
    }
  }

  async function handleDeleteCompliance(id: string) {
    if (!confirm('Are you sure you want to delete this compliance item?')) return;
    try {
      await fetch(`/api/admin/compliance?id=${id}`, { method: 'DELETE' });
      await loadComplianceItems();
      await loadAuditLogs();
    } catch (error) {
      console.error('Error deleting compliance item:', error);
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const activeUsers = users.filter(u => u.status === 'active').length;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#4A0E8B]/30 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#D4AF37] border-t-transparent mx-auto mb-4"></div>
          <div className="text-white font-semibold">Loading Admin Console...</div>
        </div>
      </div>
    );
  }

  if (!session || !['admin', 'business'].includes(session.user?.role || '')) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#4A0E8B]/20 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="w-10 h-10 text-[#D4AF37]" />
              Platform Administration
            </h1>
            <p className="text-slate-400">Secure governance and system management</p>
          </div>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-[#D4AF37]/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Users</p>
                <p className="text-4xl font-bold text-white">{platformStats.totalUsers}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4A0E8B] to-[#6B2DB8] flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-[#D4AF37]/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Pending Approval</p>
                <p className="text-4xl font-bold text-[#D4AF37]">{pendingUsers}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#E6C756] flex items-center justify-center">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-[#D4AF37]/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Active Businesses</p>
                <p className="text-4xl font-bold text-green-400">{platformStats.activeBusinesses}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-[#D4AF37]/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">System Status</p>
                <p className="text-4xl font-bold text-green-400">
                  {systemHealth.every(h => h.status === 'up') ? 'Healthy' : 'Check'}
                </p>
              </div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                systemHealth.every(h => h.status === 'up') 
                  ? 'bg-gradient-to-br from-green-500 to-green-600' 
                  : 'bg-gradient-to-br from-yellow-500 to-yellow-600'
              }`}>
                <Activity className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden mb-8">
          <div className="flex border-b border-white/10">
            {[
              { id: 'governance', label: 'Platform Governance', icon: Users },
              { id: 'compliance', label: 'Compliance Library', icon: FileText },
              { id: 'monitoring', label: 'System Monitoring', icon: Activity }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#E6C756] text-slate-900'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'governance' && (
              <div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none placeholder-slate-500"
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  >
                    <option value="all" className="bg-slate-800">All Roles</option>
                    <option value="business" className="bg-slate-800">Business</option>
                    <option value="manager" className="bg-slate-800">Manager</option>
                    <option value="employee" className="bg-slate-800">Employee</option>
                    <option value="jobseeker" className="bg-slate-800">Job Seeker</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  >
                    <option value="all" className="bg-slate-800">All Status</option>
                    <option value="active" className="bg-slate-800">Active</option>
                    <option value="pending" className="bg-slate-800">Pending</option>
                    <option value="suspended" className="bg-slate-800">Suspended</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#D4AF37]" />
                      Pending Approvals
                    </h3>
                    <div className="space-y-3">
                      {filteredUsers.filter(u => u.status === 'pending').map((user) => (
                        <div key={user._id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#D4AF37]/50 transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#E6C756] flex items-center justify-center text-slate-900 font-bold">
                                {user.name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <h4 className="font-semibold text-white">{user.name || 'Unknown'}</h4>
                                <p className="text-sm text-slate-400">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUserAction(user, 'verify')}
                                className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                                title="Approve"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleUserAction(user, 'suspend')}
                                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                                title="Reject"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <span className="px-2 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs rounded capitalize">
                              {user.role}
                            </span>
                            {user.businessType && (
                              <span className="px-2 py-1 bg-white/10 text-slate-300 text-xs rounded capitalize">
                                {user.businessType}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      {filteredUsers.filter(u => u.status === 'pending').length === 0 && (
                        <div className="text-center py-8 bg-white/5 rounded-xl">
                          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                          <p className="text-slate-400">No pending approvals</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#4A0E8B]" />
                      All Users
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                      {filteredUsers.filter(u => u.status !== 'pending').map((user) => (
                        <div key={user._id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                user.status === 'active' 
                                  ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' 
                                  : 'bg-gradient-to-br from-red-500 to-red-600 text-white'
                              }`}>
                                {user.name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <h4 className="font-medium text-white">{user.name || 'Unknown'}</h4>
                                <p className="text-xs text-slate-400">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                                {user.status}
                              </span>
                              <button
                                onClick={() => user.status === 'active' ? handleUserAction(user, 'suspend') : handleUserAction(user, 'activate')}
                                className="p-1.5 bg-white/10 text-slate-400 rounded hover:bg-white/20 transition-all"
                              >
                                <Lock className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#D4AF37]" />
                    Recent Audit Log
                  </h3>
                  <div className="bg-white/5 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-white/10">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Action</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Details</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">By</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {auditLogs.slice(0, 10).map((log) => (
                          <tr key={log._id} className="hover:bg-white/5">
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 bg-[#4A0E8B]/30 text-[#D4AF37] text-xs rounded capitalize">
                                {log.action.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-300">{log.details}</td>
                            <td className="px-4 py-3 text-sm text-slate-400">{log.performedBy}</td>
                            <td className="px-4 py-3 text-xs text-slate-500">
                              {new Date(log.createdAt).toLocaleString('en-GB')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {auditLogs.length === 0 && (
                      <div className="text-center py-8 text-slate-400">No audit logs yet</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">Compliance Library</h3>
                  <button
                    onClick={() => { setEditingCompliance(null); setShowComplianceModal(true); }}
                    className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#E6C756] text-slate-900 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-[#D4AF37]/25 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Add Regulation
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {complianceItems.map((item) => (
                    <div key={item._id} className="bg-white/5 rounded-2xl border border-white/10 hover:border-[#D4AF37]/50 transition-all overflow-hidden group">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            item.type === 'law' ? 'bg-red-500/20' :
                            item.type === 'break' ? 'bg-yellow-500/20' :
                            item.type === 'hours' ? 'bg-blue-500/20' :
                            'bg-green-500/20'
                          }`}>
                            <FileText className={`w-5 h-5 ${
                              item.type === 'law' ? 'text-red-400' :
                              item.type === 'break' ? 'text-yellow-400' :
                              item.type === 'hours' ? 'text-blue-400' :
                              'text-green-400'
                            }`} />
                          </div>
                          <span className="px-2 py-1 bg-white/10 text-slate-300 text-xs rounded">
                            v{item.version}
                          </span>
                        </div>
                        <h4 className="font-bold text-white mb-2">{item.title}</h4>
                        <p className="text-sm text-slate-400 mb-4 line-clamp-3">{item.content}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-2 py-1 bg-[#4A0E8B]/30 text-[#D4AF37] text-xs rounded capitalize">
                            {item.region}
                          </span>
                          <span className="px-2 py-1 bg-white/10 text-slate-300 text-xs rounded capitalize">
                            {item.type}
                          </span>
                          <span className="px-2 py-1 bg-white/10 text-slate-300 text-xs rounded capitalize">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="px-6 py-3 bg-white/5 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditingCompliance(item); setShowComplianceModal(true); }}
                          className="p-2 bg-white/10 text-slate-300 rounded hover:bg-white/20 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCompliance(item._id)}
                          className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'monitoring' && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Server className="w-5 h-5 text-[#D4AF37]" />
                      System Health
                    </h3>
                    <div className="space-y-4">
                      {systemHealth.map((service) => (
                        <div key={service.service} className="bg-white/5 rounded-xl p-5 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                service.status === 'up' ? 'bg-green-500' :
                                service.status === 'warning' ? 'bg-yellow-500' :
                                'bg-red-500'
                              } animate-pulse`}></div>
                              <span className="font-semibold text-white">{service.service}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                              service.status === 'up' ? 'bg-green-500/20 text-green-400' :
                              service.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {service.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-slate-500">Latency</p>
                              <p className="text-white font-medium">{service.latency}ms</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Uptime</p>
                              <p className="text-white font-medium">{service.uptime}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Database className="w-5 h-5 text-[#4A0E8B]" />
                      Platform Analytics
                    </h3>
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                          <Zap className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
                          <p className="text-3xl font-bold text-white">{platformStats.totalUsers}</p>
                          <p className="text-sm text-slate-400">Total Users</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <p className="text-3xl font-bold text-white">{platformStats.activeBusinesses}</p>
                          <p className="text-sm text-slate-400">Active Businesses</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                          <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                          <p className="text-3xl font-bold text-white">{pendingUsers}</p>
                          <p className="text-sm text-slate-400">Pending Approvals</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-lg">
                          <Activity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                          <p className="text-3xl font-bold text-white">{auditLogs.length}</p>
                          <p className="text-sm text-slate-400">Audit Events</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-gradient-to-r from-[#4A0E8B]/50 to-[#D4AF37]/30 rounded-xl p-6 border border-[#D4AF37]/30">
                      <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-[#D4AF37]" />
                        Quick Actions
                      </h4>
                      <div className="space-y-2">
                        <button className="w-full px-4 py-3 bg-white/10 text-white rounded-lg text-left hover:bg-white/20 transition-all flex items-center gap-3">
                          <RefreshCw className="w-5 h-5" />
                          Clear System Cache
                        </button>
                        <button className="w-full px-4 py-3 bg-white/10 text-white rounded-lg text-left hover:bg-white/20 transition-all flex items-center gap-3">
                          <Database className="w-5 h-5" />
                          Database Backup
                        </button>
                        <button className="w-full px-4 py-3 bg-white/10 text-white rounded-lg text-left hover:bg-white/20 transition-all flex items-center gap-3">
                          <Activity className="w-5 h-5" />
                          Export Audit Logs
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showComplianceModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">
                {editingCompliance ? 'Edit Regulation' : 'Add New Regulation'}
              </h2>
            </div>
            <form onSubmit={handleSaveCompliance} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
                <input
                  name="title"
                  defaultValue={editingCompliance?.title}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Region *</label>
                  <select
                    name="region"
                    defaultValue={editingCompliance?.region || 'UK'}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  >
                    <option value="UK" className="bg-slate-800">UK</option>
                    <option value="EU" className="bg-slate-800">EU</option>
                    <option value="Global" className="bg-slate-800">Global</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Type *</label>
                  <select
                    name="type"
                    defaultValue={editingCompliance?.type || 'law'}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  >
                    <option value="law" className="bg-slate-800">Law</option>
                    <option value="break" className="bg-slate-800">Break Rules</option>
                    <option value="hours" className="bg-slate-800">Working Hours</option>
                    <option value="compliance" className="bg-slate-800">Compliance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category *</label>
                  <select
                    name="category"
                    defaultValue={editingCompliance?.category || 'employment'}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  >
                    <option value="employment" className="bg-slate-800">Employment</option>
                    <option value="wages" className="bg-slate-800">Wages</option>
                    <option value="leave" className="bg-slate-800">Leave</option>
                    <option value="onboarding" className="bg-slate-800">Onboarding</option>
                    <option value="data" className="bg-slate-800">Data Protection</option>
                    <option value="food_safety" className="bg-slate-800">Food Safety</option>
                    <option value="health_safety" className="bg-slate-800">Health & Safety</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Content *</label>
                <textarea
                  name="content"
                  defaultValue={editingCompliance?.content}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">References (comma-separated)</label>
                <input
                  name="references"
                  defaultValue={editingCompliance?.references?.join(', ')}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  placeholder="e.g., Employment Act 2002, HMRC Guidelines"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowComplianceModal(false); setEditingCompliance(null); }}
                  className="flex-1 px-6 py-3 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#E6C756] text-slate-900 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  {editingCompliance ? 'Update' : 'Save Regulation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
