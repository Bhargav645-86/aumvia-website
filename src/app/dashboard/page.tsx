'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) redirect('/login');

  const role = session.user?.role;
  if (role === 'business' || role === 'manager') {
    redirect('/dashboard/business');
  } else if (role === 'jobseeker') {
    redirect('/dashboard/jobseeker');
  } else {
    return <div>Role not recognized.</div>;
  }
}