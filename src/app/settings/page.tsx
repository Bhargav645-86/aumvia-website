'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, User, Lock, Bell, Building2, 
  Mail, Phone, MapPin, Save, Eye, EyeOff,
  CheckCircle, AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const [profileData, setProfileData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    postcode: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    complianceReminders: true,
    shiftNotifications: true,
    marketplaceUpdates: true,
    weeklyDigest: true
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  const handleSaveProfile = async () => {
    setSaveStatus('saving');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveStatus('error');
      return;
    }
    setSaveStatus('saving');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaveStatus('saved');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handleSaveNotifications = async () => {
    setSaveStatus('saving');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/business" className="text-gray-600 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-indigo-900">Settings</h1>
              <p className="text-sm text-gray-600">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <User className="w-5 h-5" />
            Business Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Lock className="w-5 h-5" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'notifications'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Bell className="w-5 h-5" />
            Notifications
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-indigo-900">Business Information</h2>
                <p className="text-sm text-gray-600">Update your business details</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={profileData.businessName}
                    onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
                    placeholder={session.user?.name || 'Your Business Name'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name</label>
                  <input
                    type="text"
                    value={profileData.contactName}
                    onChange={(e) => setProfileData({...profileData, contactName: e.target.value})}
                    placeholder="Primary Contact Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder={session.user?.email || 'email@business.com'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="07700 000000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Business Address
                </label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  placeholder="123 High Street"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="w-1/3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Postcode</label>
                <input
                  type="text"
                  value={profileData.postcode}
                  onChange={(e) => setProfileData({...profileData, postcode: e.target.value})}
                  placeholder="SW1A 1AA"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                {saveStatus === 'saved' && (
                  <span className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                    Changes saved successfully
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    Error saving changes
                  </span>
                )}
                {saveStatus === 'idle' && <span></span>}
                <button
                  onClick={handleSaveProfile}
                  disabled={saveStatus === 'saving'}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-indigo-900">Change Password</h2>
                <p className="text-sm text-gray-600">Keep your account secure</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2">Passwords do not match</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                {saveStatus === 'saved' && (
                  <span className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                    Password updated successfully
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    Passwords do not match
                  </span>
                )}
                {saveStatus === 'idle' && <span></span>}
                <button
                  onClick={handleChangePassword}
                  disabled={saveStatus === 'saving' || !passwordData.currentPassword || !passwordData.newPassword}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-indigo-900">Notification Preferences</h2>
                <p className="text-sm text-gray-600">Choose how you want to be notified</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-4">Alert Channels</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">Email Alerts</p>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailAlerts}
                      onChange={(e) => setNotificationSettings({...notificationSettings, emailAlerts: e.target.checked})}
                      className="w-6 h-6 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">SMS Alerts</p>
                      <p className="text-sm text-gray-600">Receive urgent notifications via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsAlerts}
                      onChange={(e) => setNotificationSettings({...notificationSettings, smsAlerts: e.target.checked})}
                      className="w-6 h-6 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-4">Notification Types</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">Compliance Reminders</p>
                      <p className="text-sm text-gray-600">Expiring licences and certificates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.complianceReminders}
                      onChange={(e) => setNotificationSettings({...notificationSettings, complianceReminders: e.target.checked})}
                      className="w-6 h-6 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">Shift Notifications</p>
                      <p className="text-sm text-gray-600">Updates about staff shifts and rotas</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.shiftNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, shiftNotifications: e.target.checked})}
                      className="w-6 h-6 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">Marketplace Updates</p>
                      <p className="text-sm text-gray-600">New applications and shift swaps</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.marketplaceUpdates}
                      onChange={(e) => setNotificationSettings({...notificationSettings, marketplaceUpdates: e.target.checked})}
                      className="w-6 h-6 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">Weekly Digest</p>
                      <p className="text-sm text-gray-600">Summary of activities every week</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.weeklyDigest}
                      onChange={(e) => setNotificationSettings({...notificationSettings, weeklyDigest: e.target.checked})}
                      className="w-6 h-6 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                {saveStatus === 'saved' && (
                  <span className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                    Preferences saved
                  </span>
                )}
                {saveStatus === 'idle' && <span></span>}
                <button
                  onClick={handleSaveNotifications}
                  disabled={saveStatus === 'saving'}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Preferences
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
