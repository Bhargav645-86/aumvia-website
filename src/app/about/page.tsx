import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Heart, Target, Users, Award, CheckCircle, Lightbulb, Shield, ArrowRight, Sparkles } from 'lucide-react';

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
            <p className="text-xl text-lotus max-w-3xl mx-auto leading-relaxed">
              Where spiritual harmony meets modern technology to empower UK small businesses. 
              We believe every business owner deserves peace of mind.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-24 lotus-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <div>
                  <span className="text-gold font-semibold text-sm uppercase tracking-wider">Our Mission</span>
                  <h2 className="text-h2 md:text-5xl font-heading font-bold text-indigo mt-2 mb-6">
                    Bringing Harmony to Small Business
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Aumvia was founded with a simple yet powerful vision: to free UK small business owners 
                    from the chaos of paperwork, staff shortages, and compliance headaches so they can focus 
                    on what they love—running their business.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We've witnessed countless takeaway owners, café managers, and restaurant proprietors 
                    overwhelmed by the demands of modern business operations. That's why we built Aumvia—a 
                    complete platform that brings everything together in one harmonious system.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-spiritual shadow-lg">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4">
                      <div className="text-4xl font-heading font-bold text-indigo mb-2">500+</div>
                      <div className="text-sm text-gray-600">Businesses Served</div>
                    </div>
                    <div className="text-center p-4">
                      <div className="text-4xl font-heading font-bold text-emerald mb-2">15K+</div>
                      <div className="text-sm text-gray-600">Shifts Filled</div>
                    </div>
                    <div className="text-center p-4">
                      <div className="text-4xl font-heading font-bold text-gold mb-2">98%</div>
                      <div className="text-sm text-gray-600">Satisfaction Rate</div>
                    </div>
                    <div className="text-center p-4">
                      <div className="text-4xl font-heading font-bold text-indigo mb-2">24/7</div>
                      <div className="text-sm text-gray-600">Platform Access</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Philosophy */}
              <div className="bg-white p-8 md:p-12 rounded-spiritual shadow-lg mb-16">
                <div className="text-center mb-10">
                  <h3 className="text-h2 font-heading font-bold text-indigo mb-4">
                    Our Philosophy: Spiritual-Tech Fusion
                  </h3>
                  <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    The Om symbol at our heart represents more than just a logo—it embodies our commitment to bringing 
                    <span className="font-bold text-indigo"> harmony, balance, and growth</span> to every aspect of your business. 
                    We blend ancient wisdom of mindful management with cutting-edge cloud technology.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-xl font-heading font-bold text-indigo mb-3">Harmony</h4>
                    <p className="text-gray-600">Peaceful workflows that reduce stress and create balance in your daily operations.</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald to-emerald-dark rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-xl font-heading font-bold text-indigo mb-3">Growth</h4>
                    <p className="text-gray-600">Scalable solutions that grow with your business and nurture prosperity.</p>
                  </div>
                  <div className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo to-indigo-dark rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                      <Lightbulb className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-xl font-heading font-bold text-indigo mb-3">Enlightenment</h4>
                    <p className="text-gray-600">Clear insights and data-driven decisions that illuminate your path forward.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-5xl font-heading font-bold text-indigo mb-4">
                What We Stand For
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our core values guide everything we do, from product development to customer support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="p-6 bg-lotus rounded-spiritual hover:shadow-lg transition-shadow">
                <Target className="w-10 h-10 text-indigo mb-4" />
                <h4 className="text-xl font-heading font-bold text-indigo mb-2">Purpose-Driven</h4>
                <p className="text-sm text-gray-600">Every feature serves a real need for UK small business owners.</p>
              </div>
              <div className="p-6 bg-lotus rounded-spiritual hover:shadow-lg transition-shadow">
                <Users className="w-10 h-10 text-emerald mb-4" />
                <h4 className="text-xl font-heading font-bold text-indigo mb-2">Community-Focused</h4>
                <p className="text-sm text-gray-600">Building connections between local businesses and workers.</p>
              </div>
              <div className="p-6 bg-lotus rounded-spiritual hover:shadow-lg transition-shadow">
                <Shield className="w-10 h-10 text-gold mb-4" />
                <h4 className="text-xl font-heading font-bold text-indigo mb-2">Trust & Security</h4>
                <p className="text-sm text-gray-600">GDPR compliant with enterprise-grade security for your data.</p>
              </div>
              <div className="p-6 bg-lotus rounded-spiritual hover:shadow-lg transition-shadow">
                <Award className="w-10 h-10 text-indigo mb-4" />
                <h4 className="text-xl font-heading font-bold text-indigo mb-2">Excellence</h4>
                <p className="text-sm text-gray-600">Continuous improvement driven by customer feedback.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-16 md:py-24 lotus-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-5xl font-heading font-bold text-indigo mb-6">
                Built on Trust & Compliance
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We take your security and regulatory compliance seriously. Here's how we protect you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 text-center rounded-spiritual shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo to-indigo-dark rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold text-indigo mb-3">GDPR Compliant</h3>
                <p className="text-gray-600">
                  Full data protection compliance with UK GDPR standards. Your data stays in the UK, under your control.
                </p>
              </div>
              <div className="bg-white p-8 text-center rounded-spiritual shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald to-emerald-dark rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold text-indigo mb-3">Verified Platform</h3>
                <p className="text-gray-600">
                  All workers are ID-verified and background-checked. Build your team with confidence.
                </p>
              </div>
              <div className="bg-white p-8 text-center rounded-spiritual shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold text-indigo mb-3">WCAG Accessible</h3>
                <p className="text-gray-600">
                  Designed for everyone with full accessibility compliance. Keyboard navigation and screen reader support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-hero text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-h2 md:text-5xl font-heading font-bold mb-6">
                Join Our Growing Community
              </h2>
              <p className="text-xl text-lotus leading-relaxed mb-8">
                We're not just a software platform—we're your partner in business success. Every feature 
                is designed with real UK small business needs in mind, from takeaway hygiene compliance 
                to café inventory management.
              </p>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-spiritual mb-8">
                <p className="text-xl font-heading text-gold italic">
                  "Your path to harmony and growth starts here. Together, we'll build a prosperous future 
                  for your business."
                </p>
                <p className="text-sm text-lotus mt-4">— The Aumvia Team</p>
              </div>
              <Link 
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-gold text-indigo rounded-button font-bold text-lg shadow-gold hover:shadow-gold-hover transform hover:scale-105 transition-all"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
