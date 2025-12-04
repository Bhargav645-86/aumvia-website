import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle, Clock, Shield, Users, TrendingUp, FileCheck, Calendar, Package, Star, ArrowRight, Building2, Briefcase } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-hero text-white py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gold blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-dark blur-3xl opacity-30"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-emerald rounded-full animate-pulse"></span>
                Trusted by 500+ UK Small Businesses
              </div>
              
              <h1 className="text-h1 md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
                Your Path to <span className="text-gold">Harmony</span> and <span className="text-emerald-light">Growth</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-lotus font-body max-w-3xl mx-auto leading-relaxed">
                The complete management platform for UK takeaways, cafés, restaurants, and off-licences. 
                Compliance, HR, rotas, inventory, and staff—all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Link 
                  href="/register/business"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-gold text-indigo rounded-button font-body font-bold text-lg shadow-gold hover:shadow-gold-hover transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Building2 className="w-5 h-5" />
                  Start as Business Owner
                </Link>
                <Link 
                  href="/register/jobseeker"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-indigo rounded-button font-body font-bold text-lg hover:bg-lotus transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-5 h-5" />
                  Find Shifts as Job Seeker
                </Link>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 pt-6 text-sm text-lotus">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald" />
                  14-day free trial
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald" />
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald" />
                  GDPR compliant
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Business Types Banner */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-500 text-sm font-medium mb-4">DESIGNED FOR</p>
            <div className="flex flex-wrap justify-center gap-8 text-gray-600 font-semibold">
              <span className="flex items-center gap-2">🥡 Takeaways</span>
              <span className="flex items-center gap-2">☕ Cafés</span>
              <span className="flex items-center gap-2">🍽️ Restaurants</span>
              <span className="flex items-center gap-2">🍾 Off-Licences</span>
              <span className="flex items-center gap-2">🧋 Bubble Tea Bars</span>
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="py-16 md:py-24 lotus-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-h2 md:text-5xl font-heading font-bold text-indigo mb-4">
                Everything Your Business Needs
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Powerful tools designed specifically for UK small businesses, with industry-specific features and full regulatory compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Compliance Hub */}
              <div className="bg-white p-8 rounded-spiritual shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all group">
                <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-indigo mb-4">
                  Compliance Hub
                </h3>
                <p className="text-gray-600 mb-6">
                  Stay audit-ready with category-specific checklists, automated reminders, and secure document storage.
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />
                    Food hygiene & safety checklists
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />
                    Licence expiry alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />
                    Document upload & storage
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />
                    Compliance score tracking
                  </li>
                </ul>
                <Link href="/compliance" className="inline-flex items-center gap-2 text-indigo font-semibold mt-6 group-hover:text-gold transition-colors">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Staff Swap Marketplace */}
              <div className="bg-white p-8 rounded-spiritual shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all group border-2 border-gold relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gold text-white text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald to-emerald-dark rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-indigo mb-4">
                  Staff Swap Marketplace
                </h3>
                <p className="text-gray-600 mb-6">
                  Fill urgent shifts in minutes. Connect with verified local workers who match your exact requirements.
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />
                    5-7 nearby worker matches
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />
                    Skills & availability matching
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />
                    Verified workers with ratings
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />
                    First-accept-wins booking
                  </li>
                </ul>
                <Link href="/marketplace" className="inline-flex items-center gap-2 text-indigo font-semibold mt-6 group-hover:text-gold transition-colors">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Smart Inventory */}
              <div className="bg-white p-8 rounded-spiritual shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all group">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo to-indigo-dark rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-indigo mb-4">
                  Smart Inventory
                </h3>
                <p className="text-gray-600 mb-6">
                  Never run out of stock or waste products. AI-powered tracking tailored to your business type.
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />
                    Real-time stock levels
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />
                    Expiry date alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />
                    Auto-generated reorder lists
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald flex-shrink-0" />
                    Waste tracking & reports
                  </li>
                </ul>
                <Link href="/inventory" className="inline-flex items-center gap-2 text-indigo font-semibold mt-6 group-hover:text-gold transition-colors">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-5xl font-heading font-bold text-indigo mb-4">
                Complete Business Management
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                All the tools you need to run your business efficiently, from rotas to reports.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              <div className="p-6 bg-gradient-to-br from-lotus to-white rounded-spiritual border-2 border-transparent hover:border-gold transition-all group">
                <Calendar className="w-10 h-10 text-indigo mb-4 group-hover:text-gold transition-colors" />
                <h4 className="text-xl font-heading font-bold text-indigo mb-2">Rota & Timesheets</h4>
                <p className="text-sm text-gray-600">Visual drag-drop rota builder with timesheet approval and labour cost tracking.</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-lotus to-white rounded-spiritual border-2 border-transparent hover:border-gold transition-all group">
                <Users className="w-10 h-10 text-indigo mb-4 group-hover:text-gold transition-colors" />
                <h4 className="text-xl font-heading font-bold text-indigo mb-2">HR & Admin</h4>
                <p className="text-sm text-gray-600">Staff directory, leave management, contracts, and document signing.</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-lotus to-white rounded-spiritual border-2 border-transparent hover:border-gold transition-all group">
                <TrendingUp className="w-10 h-10 text-indigo mb-4 group-hover:text-gold transition-colors" />
                <h4 className="text-xl font-heading font-bold text-indigo mb-2">Reports & Analytics</h4>
                <p className="text-sm text-gray-600">Compliance scores, labour costs, inventory variance, and performance insights.</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-lotus to-white rounded-spiritual border-2 border-transparent hover:border-gold transition-all group">
                <Clock className="w-10 h-10 text-indigo mb-4 group-hover:text-gold transition-colors" />
                <h4 className="text-xl font-heading font-bold text-indigo mb-2">Mobile Ready</h4>
                <p className="text-sm text-gray-600">Access your dashboard anywhere, anytime. Works on all devices.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Staff Swap Deep Dive */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-indigo to-indigo-dark text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <span className="text-gold font-semibold text-sm uppercase tracking-wider">Staff Swap Marketplace</span>
                <h2 className="text-h2 md:text-5xl font-heading font-bold mt-2 mb-6">
                  Never Worry About Last-Minute Staff Shortages Again
                </h2>
                <p className="text-lg text-lotus leading-relaxed mb-8">
                  Our hyper-local matching system connects you with verified workers within a 5-mile radius. 
                  Post an urgent shift and get matched with 5-7 suitable candidates instantly.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Under 10 Minutes to Fill</h4>
                      <p className="text-lotus text-sm">Average time from posting to confirmed booking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Verified Workers Only</h4>
                      <p className="text-lotus text-sm">ID checked, background verified, right-to-work confirmed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Two-Way Ratings</h4>
                      <p className="text-lotus text-sm">Build trust with transparent reviews from both parties</p>
                    </div>
                  </div>
                </div>
                <Link 
                  href="/register/business"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-gold text-indigo rounded-button font-bold text-lg shadow-gold hover:shadow-gold-hover transform hover:scale-105 transition-all"
                >
                  Try Staff Swap Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                    <div className="w-12 h-12 bg-emerald rounded-full flex items-center justify-center text-xl font-bold">1</div>
                    <div>
                      <h5 className="font-semibold">Post Your Shift</h5>
                      <p className="text-sm text-lotus">Add role, time, pay rate, and required skills</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                    <div className="w-12 h-12 bg-emerald rounded-full flex items-center justify-center text-xl font-bold">2</div>
                    <div>
                      <h5 className="font-semibold">Get Matched Instantly</h5>
                      <p className="text-sm text-lotus">5-7 nearby verified workers notified</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                    <div className="w-12 h-12 bg-emerald rounded-full flex items-center justify-center text-xl font-bold">3</div>
                    <div>
                      <h5 className="font-semibold">First Accept Wins</h5>
                      <p className="text-sm text-lotus">Quickest responder secures the shift</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl">
                    <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-xl font-bold">✓</div>
                    <div>
                      <h5 className="font-semibold">Shift Covered!</h5>
                      <p className="text-sm text-lotus">Worker arrives, you rate after completion</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 lotus-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-5xl font-heading font-bold text-indigo mb-4">
                Trusted by UK Business Owners
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-8 rounded-spiritual shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Aumvia has transformed how we manage our café. The compliance hub alone has saved us countless hours of paperwork."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo rounded-full flex items-center justify-center text-white font-bold">
                    SC
                  </div>
                  <div>
                    <p className="font-semibold text-indigo">Sarah Chen</p>
                    <p className="text-sm text-gray-600">Brew & Bloom Café, Manchester</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-spiritual shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Staff Swap is a game-changer. Last week I filled an emergency shift in under 8 minutes. Absolutely brilliant."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald rounded-full flex items-center justify-center text-white font-bold">
                    MP
                  </div>
                  <div>
                    <p className="font-semibold text-indigo">Mohammed Patel</p>
                    <p className="text-sm text-gray-600">Spice Express, Birmingham</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-spiritual shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "The inventory tracking has reduced our waste by 30%. The expiry alerts mean we never throw away stock unexpectedly."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-white font-bold">
                    LT
                  </div>
                  <div>
                    <p className="font-semibold text-indigo">Lisa Thompson</p>
                    <p className="text-sm text-gray-600">Corner Store Off-Licence, London</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-hero text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-h2 md:text-5xl font-heading font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-lotus mb-8 max-w-2xl mx-auto">
              Join hundreds of UK small businesses finding harmony and growth with Aumvia. Start your 14-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-gold text-indigo rounded-button font-body font-bold text-lg shadow-gold hover:shadow-gold-hover transform hover:scale-105 transition-all"
              >
                Get Started Free
              </Link>
              <Link 
                href="/pricing"
                className="w-full sm:w-auto px-8 py-4 bg-white text-indigo rounded-button font-body font-bold text-lg hover:bg-lotus transform hover:scale-105 transition-all"
              >
                View Pricing
              </Link>
            </div>
            <p className="text-sm text-lotus opacity-75 mt-6">
              No credit card required • Full access for 14 days • Cancel anytime
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
