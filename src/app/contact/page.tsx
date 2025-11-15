'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessType: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission to API
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-hero text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-h1 md:text-6xl font-heading font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-lotus max-w-3xl mx-auto">
              We're here to help you find harmony and growth for your business
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 md:py-24 lotus-bg">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              
              {/* Contact Form */}
              <div className="bg-white p-8 md:p-12 rounded-spiritual shadow-lg">
                <h2 className="text-h2 font-heading font-bold text-indigo mb-6">
                  Send Us a Message
                </h2>
                
                {submitted && (
                  <div className="mb-6 p-4 bg-emerald bg-opacity-10 border-2 border-emerald rounded-spiritual">
                    <p className="text-emerald font-semibold">
                      ✓ Thank you! We'll get back to you within 24 hours.
                    </p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
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
                  
                  <div>
                    <label htmlFor="businessType" className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Type
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-lotus rounded-spiritual focus:border-gold focus:outline-none transition-colors"
                    >
                      <option value="">Select your business type</option>
                      <option value="takeaway">Takeaway</option>
                      <option value="cafe">Café</option>
                      <option value="off-licence">Off-Licence</option>
                      <option value="bubble-tea">Bubble Tea Bar</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-lotus rounded-spiritual focus:border-gold focus:outline-none transition-colors resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-gold text-indigo rounded-button font-body font-bold text-lg shadow-gold hover:shadow-gold-hover transform hover:scale-105 transition-all"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Info & FAQ */}
              <div className="space-y-8">
                {/* Contact Details */}
                <div className="bg-white p-8 rounded-spiritual shadow-lg">
                  <h3 className="text-h3 font-heading font-bold text-indigo mb-6">
                    Contact Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-lg">📧</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-indigo mb-1">Email</h4>
                        <a href="mailto:support@aumvia.co.uk" className="text-gray-700 hover:text-gold transition-colors">
                          support@aumvia.co.uk
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald to-emerald-dark rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-lg text-white">💬</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-indigo mb-1">Live Chat</h4>
                        <p className="text-gray-700">Available Mon-Fri, 9am-6pm GMT</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo to-indigo-dark rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-lg text-white">📍</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-indigo mb-1">Location</h4>
                        <p className="text-gray-700">United Kingdom</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick FAQ */}
                <div className="bg-white p-8 rounded-spiritual shadow-lg">
                  <h3 className="text-h3 font-heading font-bold text-indigo mb-6">
                    Quick Answers
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-indigo mb-2">
                        How quickly will I get a response?
                      </h4>
                      <p className="text-sm text-gray-700">
                        We aim to respond to all inquiries within 24 hours during business days.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-indigo mb-2">
                        Do you offer demos?
                      </h4>
                      <p className="text-sm text-gray-700">
                        Yes! We offer personalized demos for businesses. Just mention it in your message.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-indigo mb-2">
                        Need technical support?
                      </h4>
                      <p className="text-sm text-gray-700">
                        Existing customers can access priority support through the dashboard help center.
                      </p>
                    </div>
                  </div>
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
