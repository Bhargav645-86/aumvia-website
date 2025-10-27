import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Pricing() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-hero text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-h1 md:text-6xl font-heading font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-lotus max-w-3xl mx-auto">
              Choose the plan that fits your business. No hidden fees, cancel anytime.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 md:py-24 lotus-bg">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              {/* Job Seeker - Free */}
              <div className="bg-white p-8 rounded-spiritual shadow-lg hover:shadow-xl transition-all">
                <div className="text-center mb-6">
                  <h3 className="text-h3 font-heading font-bold text-indigo mb-2">
                    Job Seeker
                  </h3>
                  <div className="text-5xl font-heading font-bold text-emerald mb-2">
                    Free
                  </div>
                  <p className="text-sm text-gray-600">Forever</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-emerald mr-2">✓</span>
                    <span className="text-sm text-gray-700">Create profile with skills & availability</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald mr-2">✓</span>
                    <span className="text-sm text-gray-700">Browse nearby shifts on map</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald mr-2">✓</span>
                    <span className="text-sm text-gray-700">Instant email/SMS notifications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald mr-2">✓</span>
                    <span className="text-sm text-gray-700">One-click accept/decline</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald mr-2">✓</span>
                    <span className="text-sm text-gray-700">Track application status</span>
                  </li>
                </ul>
                
                <Link 
                  href="/register/jobseeker"
                  className="block w-full text-center px-6 py-3 bg-emerald text-white rounded-button font-body font-semibold hover:bg-emerald-dark transition-all"
                >
                  Sign Up Free
                </Link>
              </div>

              {/* Basic Plan */}
              <div className="bg-white p-8 rounded-spiritual shadow-lg hover:shadow-xl transition-all border-2 border-lotus">
                <div className="text-center mb-6">
                  <h3 className="text-h3 font-heading font-bold text-indigo mb-2">
                    Basic
                  </h3>
                  <div className="text-5xl font-heading font-bold text-indigo mb-2">
                    £29
                  </div>
                  <p className="text-sm text-gray-600">per month</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-indigo mr-2">✓</span>
                    <span className="text-sm text-gray-700">Up to 10 staff members</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo mr-2">✓</span>
                    <span className="text-sm text-gray-700">Compliance Hub with checklists</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo mr-2">✓</span>
                    <span className="text-sm text-gray-700">Basic rota & timesheets</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo mr-2">✓</span>
                    <span className="text-sm text-gray-700">Inventory tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo mr-2">✓</span>
                    <span className="text-sm text-gray-700">Staff Swap (5 posts/month)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo mr-2">✓</span>
                    <span className="text-sm text-gray-700">Email support</span>
                  </li>
                </ul>
                
                <Link 
                  href="/register/business"
                  className="block w-full text-center px-6 py-3 bg-indigo text-white rounded-button font-body font-semibold hover:bg-indigo-dark transition-all"
                >
                  Start 14-Day Trial
                </Link>
              </div>

              {/* Pro Plan - Recommended */}
              <div className="bg-gradient-hero text-white p-8 rounded-spiritual shadow-xl hover:shadow-2xl transition-all relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-gold text-indigo px-4 py-1 rounded-button text-sm font-bold">
                  RECOMMENDED
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-h3 font-heading font-bold mb-2">
                    Pro
                  </h3>
                  <div className="text-5xl font-heading font-bold text-gold mb-2">
                    £49
                  </div>
                  <p className="text-sm text-lotus">per month</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    <span className="text-sm">Unlimited staff members</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    <span className="text-sm">Advanced Compliance Hub + AI Q&A</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    <span className="text-sm">Drag-drop rota builder</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    <span className="text-sm">Smart inventory with expiry alerts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    <span className="text-sm">Unlimited Staff Swap posts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    <span className="text-sm">HR templates & document generator</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    <span className="text-sm">Reports & analytics dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    <span className="text-sm">Priority support (email & chat)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-2">✓</span>
                    <span className="text-sm">Integrations (Stripe, POS systems)</span>
                  </li>
                </ul>
                
                <Link 
                  href="/register/business"
                  className="block w-full text-center px-6 py-3 bg-gradient-gold text-indigo rounded-button font-body font-bold shadow-gold hover:shadow-gold-hover transition-all"
                >
                  Start 14-Day Trial
                </Link>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto mt-16">
              <h2 className="text-h2 font-heading font-bold text-indigo text-center mb-8">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-spiritual shadow">
                  <h3 className="text-lg font-heading font-bold text-indigo mb-2">
                    Can I switch plans later?
                  </h3>
                  <p className="text-gray-700">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                    and we'll prorate any charges.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-spiritual shadow">
                  <h3 className="text-lg font-heading font-bold text-indigo mb-2">
                    Is there a contract or commitment?
                  </h3>
                  <p className="text-gray-700">
                    No contracts! All plans are month-to-month. Cancel anytime with no penalties or hidden fees.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-spiritual shadow">
                  <h3 className="text-lg font-heading font-bold text-indigo mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-gray-700">
                    We accept all major credit/debit cards via Stripe. Payments are secure and GDPR compliant.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-spiritual shadow">
                  <h3 className="text-lg font-heading font-bold text-indigo mb-2">
                    Do you offer discounts for annual billing?
                  </h3>
                  <p className="text-gray-700">
                    Yes! Save 20% when you pay annually. Contact us for custom enterprise pricing for multiple locations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
