'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'business' | 'jobseeker'>('business');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Redirect based on role
      if (activeTab === 'business') {
        router.push('/dashboard/business');
      } else if (activeTab === 'jobseeker') {
        router.push('/dashboard/jobseeker');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow lotus-bg py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            
            {/* Login Card */}
            <div className="bg-white rounded-spiritual shadow-xl overflow-hidden">
              
              {/* Tab Switcher */}
              <div className="grid grid-cols-2">
                <button
                  onClick={() => setActiveTab('business')}
                  className={`py-4 font-heading font-bold text-lg transition-all ${
                    activeTab === 'business'
                      ? 'bg-gradient-hero text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Business Owner
                </button>
                <button
                  onClick={() => setActiveTab('jobseeker')}
                  className={`py-4 font-heading font-bold text-lg transition-all ${
                    activeTab === 'jobseeker'
                      ? 'bg-gradient-hero text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Job Seeker
                </button>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <div className="text-center mb-8">
                  <h1 className="text-h2 font-heading font-bold text-indigo mb-2">
                    Welcome Back
                  </h1>
                  <p className="text-gray-600">
                    {activeTab === 'business' 
                      ? 'Sign in to manage your business' 
                      : 'Sign in to find shifts near you'}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-error bg-opacity-10 border-2 border-error rounded-spiritual">
                    <p className="text-error text-sm font-semibold">
                      {error}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-lotus rounded-spiritual focus:border-gold focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-lotus rounded-spiritual focus:border-gold focus:outline-none transition-colors"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-gray-600">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-indigo hover:text-gold font-semibold">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-8 py-4 bg-gradient-gold text-indigo rounded-button font-body font-bold text-lg shadow-gold hover:shadow-gold-hover transform hover:scale-105 transition-all ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link 
                      href={activeTab === 'business' ? '/register/business' : '/register/jobseeker'}
                      className="text-indigo hover:text-gold font-semibold"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <span className="flex items-center">
                  <span className="mr-1">🔒</span> Secure Login
                </span>
                <span className="flex items-center">
                  <span className="mr-1">✓</span> GDPR Compliant
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
