'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Bell, Calendar, CheckCircle, AlertCircle,
  Clock, FileText, Star, Trash2, Check, Filter
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'shift_confirmed' | 'shift_reminder' | 'application_accepted' | 'application_rejected' | 'timesheet_approved' | 'rating_received' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export default function JobSeekerNotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'shift_confirmed', title: 'Shift Confirmed', message: 'Your shift at The Coffee House on Dec 10 has been confirmed.', timestamp: '2024-12-04T10:30:00', read: false, actionUrl: '/jobseeker/my-shifts' },
    { id: '2', type: 'shift_reminder', title: 'Shift Tomorrow', message: 'Reminder: You have a shift at Sunrise Cafe tomorrow at 10:00 AM.', timestamp: '2024-12-04T09:00:00', read: false },
    { id: '3', type: 'application_accepted', title: 'Application Accepted!', message: 'Congratulations! Golden Dragon has accepted your application for Server position.', timestamp: '2024-12-03T14:30:00', read: true, actionUrl: '/jobseeker/my-shifts' },
    { id: '4', type: 'timesheet_approved', title: 'Timesheet Approved', message: 'Your timesheet for Brew & Bloom (Dec 3) has been approved. Payment processing.', timestamp: '2024-12-03T11:00:00', read: true },
    { id: '5', type: 'rating_received', title: 'New Rating Received', message: 'Spice Express rated you 5 stars! Great job!', timestamp: '2024-12-02T16:00:00', read: true },
    { id: '6', type: 'application_rejected', title: 'Application Update', message: 'Unfortunately, your application for Quick Bites was not successful this time.', timestamp: '2024-12-01T10:00:00', read: true },
    { id: '7', type: 'system', title: 'Profile Incomplete', message: 'Complete your profile to get matched with more shifts. Add your food hygiene certificate.', timestamp: '2024-11-30T12:00:00', read: true, actionUrl: '/jobseeker/profile' },
  ]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  const filteredNotifications = activeFilter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'shift_confirmed':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'shift_reminder':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'application_accepted':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'application_rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'timesheet_approved':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'rating_received':
        return <Star className="w-5 h-5 text-amber-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBackground = (type: string, read: boolean) => {
    if (!read) return 'bg-indigo-50 border-indigo-200';
    switch (type) {
      case 'shift_confirmed':
      case 'application_accepted':
        return 'bg-emerald-50 border-emerald-200';
      case 'shift_reminder':
        return 'bg-amber-50 border-amber-200';
      case 'application_rejected':
        return 'bg-red-50 border-red-200';
      case 'timesheet_approved':
        return 'bg-blue-50 border-blue-200';
      case 'rating_received':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const handleBack = () => {
    router.push('/dashboard/jobseeker');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBack}
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-indigo-900">Notifications</h1>
                <p className="text-sm text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activeFilter === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
              activeFilter === 'unread' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeFilter === 'unread' ? 'bg-white text-indigo-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-4 rounded-xl border-2 transition-all ${getBackground(notification.type, notification.read)} ${
                  !notification.read ? 'ring-2 ring-indigo-300' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    !notification.read ? 'bg-indigo-100' : 'bg-white'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-semibold ${!notification.read ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    
                    <div className="flex items-center gap-3 mt-3">
                      {notification.actionUrl && (
                        <Link 
                          href={notification.actionUrl}
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          View Details
                        </Link>
                      )}
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Mark as read
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="text-sm text-gray-400 hover:text-red-500 ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {activeFilter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
