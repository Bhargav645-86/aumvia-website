'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { HelpCircle, MessageCircle, Mail, Phone, Clock, Book, FileQuestion, Send, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I get started with Aumvia?",
    answer: "Getting started is easy! Simply click 'Get Started' and choose whether you're a business owner or job seeker. Complete the registration form, and you'll have immediate access to your dashboard. Business accounts receive a 14-day free trial with full access to all features."
  },
  {
    question: "What types of businesses can use Aumvia?",
    answer: "Aumvia is designed specifically for UK small businesses including takeaways, cafés, restaurants, off-licences, bubble tea bars, and similar establishments. Our compliance checklists, inventory management, and staff features are tailored to these business types."
  },
  {
    question: "How does the Staff Swap Marketplace work?",
    answer: "Business owners can post shift opportunities, and verified job seekers can apply. We match workers based on skills, location, and availability. The first-accept-wins model ensures quick shift coverage. Both parties can rate each other after shifts are completed."
  },
  {
    question: "Is my data secure with Aumvia?",
    answer: "Absolutely. We're fully GDPR compliant and use industry-leading security measures including end-to-end encryption, secure UK-based data centres, and regular security audits. Your business and personal data is protected to the highest standards."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time through your account settings. Your cancellation will take effect at the end of your current billing period, and you'll retain access until then."
  },
  {
    question: "How do compliance checklists work?",
    answer: "Our compliance hub provides industry-specific checklists tailored to your business type. You'll receive reminders for document renewals, expiry dates, and required inspections. Upload and store important documents securely within the platform."
  },
  {
    question: "What support is available for job seekers?",
    answer: "Job seekers have free access to browse and apply for shifts, manage their profile, track applications, and receive ratings. We also provide resources for understanding workplace rights and building a strong work history."
  },
  {
    question: "How do I get technical support?",
    answer: "You can reach our support team via email at support@aumvia.co.uk or use the contact form below. We aim to respond within 24 hours on business days. Premium plan customers have access to priority support."
  }
];

export default function Support() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-hero text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gold" />
            <h1 className="text-h1 md:text-5xl font-heading font-bold mb-4">
              Support Centre
            </h1>
            <p className="text-lg text-lotus max-w-2xl mx-auto">
              We're here to help you succeed. Find answers to common questions or get in touch with our team.
            </p>
          </div>
        </section>

        <section className="py-12 lotus-bg">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
              <div className="bg-white rounded-spiritual shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo to-indigo-dark rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-heading font-bold text-indigo mb-2">Email Support</h3>
                <p className="text-gray-600 text-sm mb-3">Get help via email</p>
                <a href="mailto:support@aumvia.co.uk" className="text-indigo font-semibold hover:text-gold transition-colors">
                  support@aumvia.co.uk
                </a>
              </div>

              <div className="bg-white rounded-spiritual shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald to-emerald-dark rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-heading font-bold text-indigo mb-2">Response Time</h3>
                <p className="text-gray-600 text-sm mb-3">We respond within</p>
                <span className="text-emerald font-semibold">24 hours</span>
              </div>

              <div className="bg-white rounded-spiritual shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-heading font-bold text-indigo mb-2">Help Guides</h3>
                <p className="text-gray-600 text-sm mb-3">Step-by-step tutorials</p>
                <span className="text-gold font-semibold">Coming Soon</span>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-spiritual shadow-lg p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-indigo rounded-full flex items-center justify-center">
                    <FileQuestion className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-indigo">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <span className="font-semibold text-indigo pr-4">{faq.question}</span>
                        {openFAQ === index ? (
                          <ChevronUp className="w-5 h-5 text-indigo flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-indigo flex-shrink-0" />
                        )}
                      </button>
                      {openFAQ === index && (
                        <div className="px-6 py-4 bg-white">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-spiritual shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-indigo">Contact Us</h2>
                </div>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-indigo mb-2">Message Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent transition-all"
                          placeholder="John Smith"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent transition-all"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent transition-all"
                        required
                      >
                        <option value="">Select a topic</option>
                        <option value="account">Account & Billing</option>
                        <option value="technical">Technical Issue</option>
                        <option value="feature">Feature Request</option>
                        <option value="compliance">Compliance Help</option>
                        <option value="marketplace">Staff Swap Marketplace</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo focus:border-transparent transition-all resize-none"
                        placeholder="How can we help you today?"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo to-indigo-dark text-white rounded-button font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
