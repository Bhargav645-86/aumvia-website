import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-hero text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-h1 md:text-6xl font-heading font-bold mb-6">
              Our Story
            </h1>
            <p className="text-xl text-lotus max-w-3xl mx-auto">
              Where spiritual harmony meets modern technology to empower UK small businesses
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-24 lotus-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-h2 md:text-5xl font-heading font-bold text-indigo mb-6">
                  The Aumvia Vision
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Aumvia was born from a simple belief: that running a small business shouldn't be overwhelming. 
                  We've witnessed countless UK business owners—from takeaway operators to café managers—struggle 
                  with compliance paperwork, staff scheduling chaos, and inventory headaches.
                </p>
              </div>

              <div className="bg-white p-8 md:p-12 rounded-spiritual shadow-lg mb-12">
                <h3 className="text-h3 font-heading font-bold text-indigo mb-4 text-center">
                  Our Philosophy: Spiritual-Tech Fusion
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Om symbol at our heart represents more than just a logo—it embodies our commitment to bringing 
                  <span className="font-bold text-indigo"> harmony, balance, and growth</span> to every aspect of your business. 
                  We blend ancient wisdom of mindful management with cutting-edge cloud technology.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-2xl">🪷</span>
                    </div>
                    <h4 className="font-heading font-bold text-indigo mb-2">Harmony</h4>
                    <p className="text-sm text-gray-700">Peaceful workflows, balanced operations</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald to-emerald-dark rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-2xl text-white">🌱</span>
                    </div>
                    <h4 className="font-heading font-bold text-indigo mb-2">Growth</h4>
                    <p className="text-sm text-gray-700">Scalable solutions for prosperity</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo to-indigo-dark rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-2xl text-white">✨</span>
                    </div>
                    <h4 className="font-heading font-bold text-indigo mb-2">Enlightenment</h4>
                    <p className="text-sm text-gray-700">Clear insights, informed decisions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-5xl font-heading font-bold text-indigo mb-6">
                Built on Trust & Compliance
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6 border-2 border-gold rounded-spiritual">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-heading font-bold text-indigo mb-2">GDPR Compliant</h3>
                <p className="text-sm text-gray-700">
                  Full data protection compliance with UK GDPR standards. Your data, your control.
                </p>
              </div>
              <div className="text-center p-6 border-2 border-gold rounded-spiritual">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-xl font-heading font-bold text-indigo mb-2">Verified Platform</h3>
                <p className="text-sm text-gray-700">
                  Trusted by hundreds of UK small businesses across multiple sectors.
                </p>
              </div>
              <div className="text-center p-6 border-2 border-gold rounded-spiritual">
                <div className="text-4xl mb-4">♿</div>
                <h3 className="text-xl font-heading font-bold text-indigo mb-2">WCAG Accessible</h3>
                <p className="text-sm text-gray-700">
                  Designed for everyone with full accessibility compliance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Values */}
        <section className="py-16 md:py-24 lotus-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-h2 md:text-5xl font-heading font-bold text-indigo mb-6">
                Our Commitment to You
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                We're not just a software platform—we're your partner in business success. Every feature 
                is designed with real UK small business needs in mind, from takeaway hygiene compliance 
                to café inventory management.
              </p>
              <div className="bg-white p-8 rounded-spiritual shadow-lg">
                <p className="text-xl font-heading text-indigo italic">
                  "Your path to harmony and growth starts here. Together, we'll build a prosperous future 
                  for your business."
                </p>
                <p className="text-sm text-gray-600 mt-4">— The Aumvia Team</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
