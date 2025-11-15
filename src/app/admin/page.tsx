'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'business' | 'manager' | 'worker';
  status: 'active' | 'suspended' | 'pending';
  verified: boolean;
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
}

interface ComplianceItem {
  id: string;
  region: string;
  type: 'law' | 'break' | 'hours';
  content: string;
}

interface SystemHealth {
  service: string;
  status: 'up' | 'down' | 'warning';
  uptime: number;
}

export default function AdminTools() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'governance' | 'compliance' | 'monitoring'>('governance');
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'addUser' | 'verifyBusiness' | 'addCompliance' | null>(null);

  useEffect(() => {
    // Mock data
    setUsers([
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'business', status: 'pending', verified: false },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'worker', status: 'active', verified: true },
    ]);
    setAuditLogs([
      { id: '1', action: 'User approved', user: 'Admin', timestamp: new Date() },
    ]);
    setComplianceItems([
      { id: '1', region: 'UK', type: 'law', content: 'Minimum break rules' },
    ]);
    setSystemHealth([
      { service: 'Database', status: 'up', uptime: 99.9 },
      { service: 'API', status: 'warning', uptime: 95.0 },
    ]);
  }, []);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session || !['admin', 'business'].includes(session.user?.role || '')) redirect('/login');

  const handleAddUser = () => setModalType('addUser');
  const handleVerifyBusiness = () => setModalType('verifyBusiness');
  const handleAddCompliance = () => setModalType('addCompliance');

  const handleSaveUser = (newUser: User) => {
    setUsers([...users, newUser]);
    setShowModal(false);
  };

  const handleSaveCompliance = (newItem: ComplianceItem) => {
    setComplianceItems([...complianceItems, newItem]);
    setShowModal(false);
  };

  const handleVerifyUser = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, verified: true, status: 'active' } : u));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">🛠️ Admin Tools</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button onClick={() => setActiveTab('governance')} className={`px-4 py-2 rounded ${activeTab === 'governance' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Platform Governance</button>
          <button onClick={() => setActiveTab('compliance')} className={`px-4 py-2 rounded ${activeTab === 'compliance' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Compliance & Content</button>
          <button onClick={() => setActiveTab('monitoring')} className={`px-4 py-2 rounded ${activeTab === 'monitoring' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>System Monitoring</button>
        </div>

        {/* Platform Governance */}
        {activeTab === 'governance' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold">Platform Governance & User Management</h2>
              <button onClick={handleAddUser} className="bg-green-500 text-white px-4 py-2 rounded">Add User</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">User Lifecycle Management</h3>
                <ul>
                  {users.map(user => (
                    <li key={user.id} className="mb-2 p-2 border rounded">
                      {user.name} ({user.role}) - {user.status}
                      {!user.verified && (
                        <button onClick={() => handleVerifyUser(user.id)} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">Verify</button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">Audit Log</h3>
                <ul>
                  {auditLogs.map(log => (
                    <li key={log.id} className="mb-2">{log.action} by {log.user} at {log.timestamp.toLocaleString()}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Compliance & Content */}
        {activeTab === 'compliance' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold">Compliance & Content Management</h2>
              <button onClick={handleAddCompliance} className="bg-purple-500 text-white px-4 py-2 rounded">Add Compliance Item</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">Compliance Library</h3>
                <ul>
                  {complianceItems.map(item => (
                    <li key={item.id} className="mb-2">{item.region} - {item.type}: {item.content}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">Business Type Classification</h3>
                <p>Manage categories: Café, Retail, Hotel, etc.</p>
                <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">Edit Categories</button>
              </div>
            </div>
          </div>
        )}

        {/* System Monitoring */}
        {activeTab === 'monitoring' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">System Health & Performance Monitoring</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">System Health</h3>
                <ul>
                  {systemHealth.map(health => (
                    <li key={health.service} className="mb-2">
                      {health.service}: {health.status} (Uptime: {health.uptime}%)
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">Platform Analytics</h3>
                <p>Users: 1000, Shifts Posted: 500, Filled: 450</p>
                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">View Full Report</button>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded max-w-md w-full">
              {modalType === 'addUser' && (
                <>
                  <h3>Add User</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const newUser: User = {
                      id: Date.now().toString(),
                      name: formData.get('name') as string,
                      email: formData.get('email') as string,
                      role: formData.get('role') as 'business' | 'manager' | 'worker',
                      status: 'pending',
                      verified: false,
                    };
                    handleSaveUser(newUser);
                  }}>
                    <input name="name" placeholder="Name" className="w-full p-2 border rounded mb-2" required />
                    <input name="email" placeholder="Email" className="w-full p-2 border rounded mb-2" required />
                    <select name="role" className="w-full p-2 border rounded mb-2" required>
                      <option value="business">Business</option>
                      <option value="manager">Manager</option>
                      <option value="worker">Worker</option>
                    </select>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
                  </form>
                </>
              )}
              {modalType === 'addCompliance' && (
                <>
                  <h3>Add Compliance Item</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const newItem: ComplianceItem = {
                      id: Date.now().toString(),
                      region: formData.get('region') as string,
                      type: formData.get('type') as 'law' | 'break' | 'hours',
                      content: formData.get('content') as string,
                    };
                    handleSaveCompliance(newItem);
                  }}>
                    <input name="region" placeholder="Region" className="w-full p-2 border rounded mb-2" required />
                    <select name="type" className="w-full p-2 border rounded mb-2" required>
                      <option value="law">Law</option>
                      <option value="break">Break</option>
                      <option value="hours">Hours</option>
                    </select>
                    <textarea name="content" placeholder="Content" className="w-full p-2 border rounded mb-2" required></textarea>
                    <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">Add</button>
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
