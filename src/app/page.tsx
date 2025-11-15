import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-hero text-white py-20 md:py-32 overflow-hidden">
          {/* Lotus Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gold blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-emerald blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 className="text-h1 md:text-6xl font-heading font-bold leading-tight">
                Path to Harmony and Growth
              </h1>
              <p className="text-xl md:text-2xl text-lotus font-body max-w-2xl mx-auto">
                Empower your UK small business with spiritual harmony and modern technology. 
                Streamline compliance, HR, rotas, inventory, and staff management.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Link 
                  href="/register/business"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-gold text-indigo rounded-button font-body font-bold text-lg shadow-gold hover:shadow-gold-hover transform hover:scale-105 transition-all"
                >
                  Start as Business Owner
                </Link>
                <Link 
                  href="/register/jobseeker"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-indigo rounded-button font-body font-bold text-lg hover:bg-lotus transform hover:scale-105 transition-all"
                >
                  Find Shifts as Job Seeker
                </Link>
              </div>
              
              <p className="text-sm text-lotus opacity-75 pt-4">
                Free 14-day trial • No credit card required • GDPR compliant
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 lotus-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-5xl font-heading font-bold text-indigo mb-4">
                Everything Your Business Needs
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Designed specifically for UK takeaways, cafés, off-licences, bubble tea bars, and restaurants
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Compliance Card */}
              <div className="bg-white p-8 rounded-spiritual shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="text-h3 font-heading font-bold text-indigo mb-4 text-center">
                  Compliance Hub
                </h3>
                <p className="text-gray-700 text-center">
                  Stay compliant with category-specific checklists, document uploads, expiry alerts, and AI-powered Q&A for your business type.
                </p>
              </div>

              {/* Staff Swap Card */}
              <div className="bg-white p-8 rounded-spiritual shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald to-emerald-dark rounded-full flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl text-white">⚡</span>
                </div>
                <h3 className="text-h3 font-heading font-bold text-indigo mb-4 text-center">
                  Staff Swap Marketplace
                </h3>
                <p className="text-gray-700 text-center">
                  Post urgent shifts and match with 5-7 nearby job seekers instantly. Hyper-local, skills-based matching with first-accept-wins.
                </p>
              </div>

              {/* Inventory Card */}
              <div className="bg-white p-8 rounded-spiritual shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo to-indigo-dark rounded-full flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl text-white">📦</span>
                </div>
                <h3 className="text-h3 font-heading font-bold text-indigo mb-4 text-center">
                  Smart Inventory
                </h3>
                <p className="text-gray-700 text-center">
                  Track stock levels, get expiry alerts, auto-generate reorder lists. Business-specific for cafés, takeaways, and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-5xl font-heading font-bold text-indigo mb-4">
                Complete Business Management
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              <div className="p-6 border-2 border-lotus rounded-spiritual hover:border-gold transition-all">
                <h4 className="text-xl font-heading font-bold text-indigo mb-2">HR & Admin</h4>
                <p className="text-sm text-gray-700">Staff directory, leave approvals, contract templates</p>
              </div>
              <div className="p-6 border-2 border-lotus rounded-spiritual hover:border-gold transition-all">
                <h4 className="text-xl font-heading font-bold text-indigo mb-2">Rota & Timesheets</h4>
                <p className="text-sm text-gray-700">Drag-drop weekly builder, approvals, CSV/PDF export</p>
              </div>
              <div className="p-6 border-2 border-lotus rounded-spiritual hover:border-gold transition-all">
                <h4 className="text-xl font-heading font-bold text-indigo mb-2">Reports & Analytics</h4>
                <p className="text-sm text-gray-700">Compliance scores, labour costs, inventory variance</p>
              </div>
              <div className="p-6 border-2 border-lotus rounded-spiritual hover:border-gold transition-all">
                <h4 className="text-xl font-heading font-bold text-indigo mb-2">Mobile Ready</h4>
                <p className="text-sm text-gray-700">Access anywhere, anytime on any device</p>
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
              Join hundreds of UK small businesses finding harmony and growth with Aumvia
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
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}