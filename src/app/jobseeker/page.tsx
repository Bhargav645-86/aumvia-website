import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function JobSeekerDashboard() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen lotus-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-spiritual shadow-lg p-8">
          <h1 className="text-h2 font-heading font-bold text-indigo mb-4">
            Job Seeker Dashboard
          </h1>
          <p className="text-gray-700 mb-4">
            Welcome, {session.user?.name || session.user?.email}!
          </p>
          
          <div className="mt-8 p-6 bg-lotus rounded-spiritual">
            <h2 className="text-xl font-heading font-bold text-indigo mb-2">
              🚧 Dashboard Under Construction
            </h2>
            <p className="text-gray-700">
              Your job seeker dashboard with nearby shifts, applications tracking, and profile management is coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
