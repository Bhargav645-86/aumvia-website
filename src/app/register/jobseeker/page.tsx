'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const skillOptions = [
  'Food Preparation',
  'Customer Service',
  'Barista',
  'Bartending',
  'Cash Handling',
  'Food Hygiene Level 2',
  'Kitchen Porter',
  'Waiting Staff',
  'Delivery Driver',
  'Stock Management',
];

export default function JobSeekerRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    postcode: '',
    radius: '5',
    skills: [] as string[],
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSkillToggle = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.includes(skill)
        ? formData.skills.filter(s => s !== skill)
        : [...formData.skills, skill]
    });
  };

  const handleAvailabilityToggle = (day: string) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: !formData.availability[day as keyof typeof formData.availability]
      }
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

    if (formData.skills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/register/jobseeker', {
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
          <div className="max-w-3xl mx-auto">
            
            <div className="bg-white rounded-spiritual shadow-xl p-8">
              <div className="text-center mb-8">
                <h1 className="text-h2 font-heading font-bold text-indigo mb-2">
                  Find Shifts Near You
                </h1>
                <p className="text-gray-600">
                  Create your profile and get matched with local opportunities
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-error bg-opacity-10 border-2 border-error rounded-spiritual">
                  <p className="text-error text-sm font-semibold">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-heading font-bold text-indigo mb-4">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-lotus rounded-spiritual focus:border-gold focus:outline-none transition-colors"
                        placeholder="John Smith"
                      />
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
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
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

                {/* Contact & Location */}
                <div>
                  <h3 className="text-xl font-heading font-bold text-indigo mb-4">
                    Location & Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <label htmlFor="radius" className="block text-sm font-semibold text-gray-700 mb-2">
                        Search Radius *
                      </label>
                      <select
                        id="radius"
                        name="radius"
                        value={formData.radius}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-lotus rounded-spiritual focus:border-gold focus:outline-none transition-colors"
                      >
                        <option value="2">2 miles</option>
                        <option value="5">5 miles</option>
                        <option value="10">10 miles</option>
                        <option value="15">15 miles</option>
                        <option value="20">20 miles</option>
                      </select>
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
                        placeholder="07123 456789"
                      />
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-xl font-heading font-bold text-indigo mb-4">
                    Your Skills *
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skillOptions.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`p-3 border-2 rounded-spiritual text-sm font-semibold transition-all ${
                          formData.skills.includes(skill)
                            ? 'border-emerald bg-emerald text-white'
                            : 'border-lotus text-gray-700 hover:border-gold'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="text-xl font-heading font-bold text-indigo mb-4">
                    Availability
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.keys(formData.availability).map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleAvailabilityToggle(day)}
                        className={`p-3 border-2 rounded-spiritual text-sm font-semibold capitalize transition-all ${
                          formData.availability[day as keyof typeof formData.availability]
                            ? 'border-indigo bg-indigo text-white'
                            : 'border-lotus text-gray-700 hover:border-gold'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terms */}
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full px-8 py-4 bg-gradient-gold text-indigo rounded-button font-body font-bold text-lg shadow-gold hover:shadow-gold-hover transform hover:scale-105 transition-all ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-indigo hover:text-gold font-semibold">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
