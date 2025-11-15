'use client';
import { useEffect } from 'react';

interface Alert {
  id: string;
  message: string;
  type: 'warning' | 'info' | 'success';
}

interface AlertCenterProps {
  alerts: Alert[];
}

export default function AlertCenter({ alerts }: AlertCenterProps) {
  useEffect(() => {
    // Push notification demo
    if (alerts.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('AUMVIA Alert', { body: alerts[0].message });
    }
  }, [alerts]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">Alert Center</h2>
      <div className="space-y-2">
        {alerts.length === 0 ? (
          <p className="text-gray-500">No new alerts.</p>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={`p-3 rounded-lg ${alert.type === 'warning' ? 'bg-yellow-100' : alert.type === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}>
              {alert.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}