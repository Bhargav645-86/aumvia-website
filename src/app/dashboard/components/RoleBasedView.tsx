interface RoleBasedViewProps {
  userRole: string;
  businessType: string;
}

export default function RoleBasedView({ userRole, businessType }: RoleBasedViewProps) {
  if (userRole === 'business') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">Business Overview</h2>
        <p>Manage your {businessType} business: compliance, staff, and inventory.</p>
      </div>
    );
  }
  if (userRole === 'jobseeker') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">Job Seeker Hub</h2>
        <p>Find shifts and update your profile for {businessType} roles.</p>
      </div>
    );
  }
  return <div>Role-specific content loading...</div>;
}