'use client';
import Link from 'next/link';

interface QuickActionsProps {
  userRole: string;
}

export default function QuickActions({ userRole }: QuickActionsProps) {
  const actions = {
    business: [
      { label: 'Check Compliance', href: '/compliance', icon: '📋' },
      { label: 'Build Rota', href: '/rota', icon: '📅' },
      { label: 'Find Staff', href: '/marketplace', icon: '👥' },
    ],
    manager: [
      { label: 'Manage Staff', href: '/hr', icon: '👤' },
      { label: 'View Reports', href: '/reports', icon: '📊' },
    ],
    staff: [
      { label: 'Clock In/Out', href: '/rota', icon: '⏰' },
      { label: 'View Shifts', href: '/marketplace', icon: '📅' },
    ],
    jobseeker: [
      { label: 'Browse Jobs', href: '/marketplace', icon: '🔍' },
      { label: 'Update Profile', href: '/profile', icon: '📝' },
    ],
  };

  const userActions = actions[userRole as keyof typeof actions] || [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {userActions.map((action) => (
          <Link key={action.label} href={action.href} className="bg-indigo-100 p-4 rounded-lg text-center hover:bg-indigo-200 transition">
            <div className="text-2xl mb-2">{action.icon}</div>
            <span className="font-semibold">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}