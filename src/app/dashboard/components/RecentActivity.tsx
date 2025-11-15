interface Activity {
  id: string;
  action: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-gray-500">No recent activity.</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <span>{activity.action}</span>
              <span className="text-sm text-gray-500">{activity.timestamp}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}