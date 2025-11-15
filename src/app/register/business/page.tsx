'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const businessTypes = [
  { id: 'takeaway', name: 'Takeaway', icon: '🍕', description: 'Fast food, pizza, kebab shops' },
  { id: 'cafe', name: 'Café', icon: '☕', description: 'Coffee shops, tea rooms' },
  { id: 'off-licence', name: 'Off-Licence', icon: '🍷', description: 'Alcohol retail, convenience stores' },
  { id: 'bubble-tea', name: 'Bubble Tea Bar', icon: '🧋', description: 'Bubble tea, smoothie bars' },
  { id: 'restaurant', name: 'Restaurant', icon: '🍽️', description: 'Full-service dining' },
];

export default function BusinessRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: '',
    businessName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    postcode: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBusinessTypeSelect = (typeId: string) => {
    setFormData({ ...formData, businessType: typeId });
    setStep(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/register/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Redirect to login
      router.push('/login?registered=true');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow lotus-bg py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4">
                <div className={`flex items-center ${step >= 1 ? 'text-indigo' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= 1 ? 'bg-gradient-gold text-indigo' : 'bg-gray-300'
                  }`}>
                    1
                  </div>
                  <span className="ml-2 font-semibold hidden sm:inline">Business Type</span>
                </div>
                <div className="w-12 h-1 bg-gray-300">
                  <div className={`h-full ${step >= 2 ? 'bg-gradient-gold' : ''}`}></div>
                </div>
                <div className={`flex items-center ${step >= 2 ? 'text-indigo' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= 2 ? 'bg-gradient-gold text-indigo' : 'bg-gray-300'
                  }`}>
                    2
                  </div>
                  <span className="ml-2 font-semibold hidden sm:inline">Details</span>
                </div>
              </div>
            </div>

            {/* Step 1: Business Type Selection */}
            {step === 1 && (
              <div className="bg-white rounded-spiritual shadow-xl p-8">
                <div className="text-center mb-8">
                  <h1 className="text-h2 font-heading font-bold text-indigo mb-2">
                    Choose Your Business Type
                  </h1>
                  <p className="text-gray-600">
                    We'll customize your experience based on your business
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {businessTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleBusinessTypeSelect(type.id)}
                      className="p-6 border-2 border-lotus rounded-spiritual hover:border-gold hover:shadow-lg transition-all text-left group"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">{type.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-heading font-bold text-indigo group-hover:text-gold transition-colors mb-1">
                            {type.name}
                          </h3>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-indigo hover:text-gold font-semibold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Business Details Form */}
            {step === 2 && (
              <div className="bg-white rounded-spiritual shadow-xl p-8">
                <div className="text-center mb-8">
                  <h1 className="text-h2 font-heading font-bold text-indigo mb-2">
                    Business Details
                  </h1>
                  <p className="text-gray-600">
                    Tell us about your{' '}
                    {businessTypes.find(t => t.id === formData.businessType)?.name}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-error bg-opacity-10 border-2 border-error rounded-spiritual">
                    <p className="text-error text-sm font-semibold">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-lotus rounded-spiritual focus:border-gold focus:outline-none transition-colors"
                        placeholder="Bob's Takeaway"
                      />
                    </div>

                    <div>
                      <label htmlFor="ownerName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        required
                        value={formData.ownerName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-lotus rounded-spiritual focus:border-gold focus:outline-none transition-colors"
                        placeholder="John Smith"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-lotus rounded-spiritual focus:border-gold focus:outline-none transition-colors"
                      placeholder="john@bobstakeaway.co.uk"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-lotus rounded-spiritual focus:border-gold focus:outline-none transition-colors"
                        placeholder="Min. 8 characters"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-lotus rounded-spiritual focus:border-gold focus:outline-none transition-colors"
                        placeholder="Re-enter password"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-lotus rounded-spiritual focus:border-gold focus:outline-none transition-colors"
                      placeholder="123 High Street, London"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="postcode" className="block text-sm font-semibold text-gray-700 mb-2">
                        Postcode *
                      </label>
                      <input
                        type="text"
                        id="postcode"
                        name="postcode"
                        required
                        value={formData.postcode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-lotus rounded-spiritual focus:border-gold focus:outline-none transition-colors"
                        placeholder="SW1A 1AA"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-lotus rounded-spiritual focus:border-gold focus:outline-none transition-colors"
                        placeholder="020 1234 5678"
                      />
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input type="checkbox" required className="mt-1 mr-3" />
                    <p className="text-sm text-gray-600">
                      I agree to the{' '}
                      <Link href="/terms" className="text-indigo hover:text-gold font-semibold">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-indigo hover:text-gold font-semibold">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 px-8 py-4 bg-gray-200 text-gray-700 rounded-button font-body font-bold text-lg hover:bg-gray-300 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 px-8 py-4 bg-gradient-gold text-indigo rounded-button font-body font-bold text-lg shadow-gold hover:shadow-gold-hover transform hover:scale-105 transition-all ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
