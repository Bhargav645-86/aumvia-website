'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 rounded-full bg-gradient-gold p-1">
              <Image 
                src="/aumvia-logo.png" 
                alt="Aumvia Logo - Om Symbol" 
                width={48} 
                height={48}
                className="rounded-full transition-transform group-hover:scale-110"
              />
            </div>
            <span className="text-2xl font-heading font-bold text-indigo">
              Aumvia
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-indigo font-body font-semibold transition-colors"
            >
              About
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-700 hover:text-indigo font-body font-semibold transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-indigo font-body font-semibold transition-colors"
            >
              Contact
            </Link>
            <Link 
              href="/login" 
              className="px-6 py-2 bg-emerald text-white rounded-button font-body font-semibold hover:bg-emerald-dark transition-all"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2 bg-gradient-gold text-indigo rounded-button font-body font-semibold shadow-gold hover:shadow-gold-hover transition-all"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-indigo hover:bg-lotus rounded-lg transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-lotus pt-4">
            <Link 
              href="/about" 
              className="block py-2 text-gray-700 hover:text-indigo font-body font-semibold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/pricing" 
              className="block py-2 text-gray-700 hover:text-indigo font-body font-semibold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/contact" 
              className="block py-2 text-gray-700 hover:text-indigo font-body font-semibold transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/login" 
              className="block w-full text-center px-6 py-3 bg-emerald text-white rounded-button font-body font-semibold hover:bg-emerald-dark transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="block w-full text-center px-6 py-3 bg-gradient-gold text-indigo rounded-button font-body font-semibold shadow-gold transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}