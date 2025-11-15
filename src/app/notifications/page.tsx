'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'schedule' | 'action' | 'compliance' | 'inventory';
  channels: string[];
  urgency: 'low' | 'medium' | 'high';
  timestamp: Date;
  read: boolean;
}

interface AlertRule {
  id: string;
  trigger: string;
  category: string;
  channels: string[];
  enabled: boolean;
}

export default function NotificationsHub() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'alerts' | 'rules' | 'campaigns'>('alerts');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'createAlert' | 'editRule' | null>(null);

  useEffect(() => {
    // Mock data
    setNotifications([
      { id: '1', title: 'Shift Published', message: 'Your rota for next week has been published.', category: 'schedule', channels: ['in-app', 'push'], urgency: 'high', timestamp: new Date(), read: false },
      { id: '2', title: 'Timesheet Approved', message: 'Your timesheet for last week has been approved.', category: 'action', channels: ['in-app', 'email'], urgency: 'medium', timestamp: new Date(Date.now() - 86400000), read: true },
    ]);
    setAlertRules([
      { id: '1', trigger: 'Rota Published', category: 'schedule', channels: ['in-app', 'push'], enabled: true },
      { id: '2', trigger: 'Timesheet Submitted', category: 'action', channels: ['in-app', 'email'], enabled: true },
    ]);
  }, []);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session || session.user?.role !== 'business') redirect('/login');

  const handleCreateAlert = () => setModalType('createAlert');
  const handleEditRule = () => setModalType('editRule');

  const handleSaveAlert = (newAlert: Notification) => {
    setNotifications([...notifications, newAlert]);
    setShowModal(false);
  };

  const handleSaveRule = (updatedRule: AlertRule) => {
    setAlertRules(alertRules.map(r => r.id === updatedRule.id ? updatedRule : r));
    setShowModal(false);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">🔔 Notifications & Communication Hub</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button onClick={() => setActiveTab('alerts')} className={`px-4 py-2 rounded ${activeTab === 'alerts' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>In-App Alerts</button>
          <button onClick={() => setActiveTab('rules')} className={`px-4 py-2 rounded ${activeTab === 'rules' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Smart Alert Rules</button>
          <button onClick={() => setActiveTab('campaigns')} className={`px-4 py-2 rounded ${activeTab === 'campaigns' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>Email Campaigns</button>
        </div>

        {/* In-App Alerts */}
        {activeTab === 'alerts' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold">Activity Feed & Alerts</h2>
              <button onClick={handleCreateAlert} className="bg-green-500 text-white px-4 py-2 rounded">Create Alert</button>
            </div>
            <div className="space-y-4">
              {notifications.map(notification => (
                <div key={notification.id} className={`p-4 border rounded ${notification.read ? 'bg-gray-100' : 'bg-blue-50'}`}>
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p>{notification.message}</p>
                  <p className="text-sm text-gray-600">Category: {notification.category} | Channels: {notification.channels.join(', ')} | Urgency: {notification.urgency}</p>
                  <p className="text-sm text-gray-600">{notification.timestamp.toLocaleString()}</p>
                  {!notification.read && (
                    <button onClick={() => markAsRead(notification.id)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Mark as Read</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Smart Alert Rules */}
        {activeTab === 'rules' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold">Smart & Contextual Alert System</h2>
              <button onClick={handleEditRule} className="bg-purple-500 text-white px-4 py-2 rounded">Edit Rules</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {alertRules.map(rule => (
                <div key={rule.id} className="bg-white p-6 rounded shadow">
                  <h3 className="font-semibold">{rule.trigger}</h3>
                  <p>Category: {rule.category}</p>
                  <p>Channels: {rule.channels.join(', ')}</p>
                  <p>Enabled: {rule.enabled ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Email Campaigns */}
        {activeTab === 'campaigns' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Automated Workflow Communication</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">Onboarding Sequence</h3>
                <p>Automated emails for new users: Profile setup, app download, feature tutorials.</p>
                <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">Configure Sequence</button>
              </div>
              <div className="bg-white p-6 rounded shadow">
                <h3 className="font-semibold mb-4">Weekly Performance Digest</h3>
                <p>Scheduled email with labor cost %, productivity, and pending timesheets.</p>
                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Send Digest</button>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded max-w-md w-full">
              {modalType === 'createAlert' && (
                <>
                  <h3>Create Alert</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const newAlert: Notification = {
                      id: Date.now().toString(),
                      title: formData.get('title') as string,
                      message: formData.get('message') as string,
                      category: formData.get('category') as 'schedule' | 'action' | 'compliance' | 'inventory',
                      channels: (formData.get('channels') as string).split(','),
                      urgency: formData.get('urgency') as 'low' | 'medium' | 'high',
                      timestamp: new Date(),
                      read: false,
                    };
                    handleSaveAlert(newAlert);
                  }}>
                    <input name="title" placeholder="Title" className="w-full p-2 border rounded mb-2" required />
                    <textarea name="message" placeholder="Message" className="w-full p-2 border rounded mb-2" required></textarea>
                    <select name="category" className="w-full p-2 border rounded mb-2" required>
                      <option value="schedule">Schedule</option>
                      <option value="action">Action</option>
                      <option value="compliance">Compliance</option>
                      <option value="inventory">Inventory</option>
                    </select>
                    <input name="channels" placeholder="Channels (comma-separated)" className="w-full p-2 border rounded mb-2" required />
                    <select name="urgency" className="w-full p-2 border rounded mb-2" required>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Create</button>
                  </form>
                </>
              )}
              {modalType === 'editRule' && (
                <>
                  <h3>Edit Alert Rule</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const updatedRule: AlertRule = {
                      id: '1', // Mock ID
                      trigger: formData.get('trigger') as string,
                      category: formData.get('category') as string,
                      channels: (formData.get('channels') as string).split(','),
                      enabled: formData.get('enabled') === 'on',
                    };
                    handleSaveRule(updatedRule);
                  }}>
                    <input name="trigger" placeholder="Trigger" className="w-full p-2 border rounded mb-2" required />
                    <input name="category" placeholder="Category" className="w-full p-2 border rounded mb-2" required />
                    <input name="channels" placeholder="Channels (comma-separated)" className="w-full p-2 border rounded mb-2" required />
                    <label><input name="enabled" type="checkbox" /> Enabled</label>
                    <button type="submit" className="mt-4 bg-purple-500 text-white px-4 py-2 rounded">Save</button>
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
