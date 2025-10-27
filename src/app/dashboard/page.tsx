import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen lotus-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-spiritual shadow-lg p-8">
          <h1 className="text-h2 font-heading font-bold text-indigo mb-4">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-700 mb-4">
            Hello, {session.user?.name || session.user?.email}!
          </p>
          <p className="text-gray-600">
            Role: <span className="font-semibold text-indigo">{session.user?.role}</span>
          </p>
          {session.user?.businessType && (
            <p className="text-gray-600">
              Business Type: <span className="font-semibold text-indigo capitalize">{session.user.businessType}</span>
            </p>
          )}
          
          <div className="mt-8 p-6 bg-lotus rounded-spiritual">
            <h2 className="text-xl font-heading font-bold text-indigo mb-2">
              🚧 Dashboard Under Construction
            </h2>
            <p className="text-gray-700">
              Your full dashboard with Compliance Hub, HR, Rota, Inventory, and Staff Swap features is coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
