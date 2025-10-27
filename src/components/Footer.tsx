import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-indigo text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-full bg-gradient-gold p-1">
                <Image 
                  src="/aumvia-logo.png" 
                  alt="Aumvia Logo" 
                  width={40} 
                  height={40}
                  className="rounded-full"
                />
              </div>
              <span className="text-xl font-heading font-bold text-gold">
                Aumvia
              </span>
            </Link>
            <p className="text-sm text-lotus opacity-90">
              Path to Harmony and Growth
            </p>
            <p className="text-xs text-lotus opacity-75">
              Empowering UK small businesses with spiritual harmony and modern technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-bold text-gold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-lotus hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-lotus hover:text-gold transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-lotus hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-lotus hover:text-gold transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div>
            <h3 className="text-lg font-heading font-bold text-gold mb-4">
              For Businesses
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/register/business" className="text-sm text-lotus hover:text-gold transition-colors">
                  Register Business
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-sm text-lotus hover:text-gold transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-sm text-lotus hover:text-gold transition-colors">
                  Compliance Hub
                </Link>
              </li>
              <li>
                <Link href="/staff-swap" className="text-sm text-lotus hover:text-gold transition-colors">
                  Staff Swap
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-lg font-heading font-bold text-gold mb-4">
              Legal & Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-lotus hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-lotus hover:text-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="text-sm text-lotus hover:text-gold transition-colors">
                  GDPR Compliance
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-lotus hover:text-gold transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-indigo-light">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-lotus opacity-75">
              © {new Date().getFullYear()} Aumvia. All rights reserved. Made with harmony in the UK.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-lotus opacity-75">
                🔒 GDPR Compliant
              </span>
              <span className="text-xs text-lotus opacity-75">
                ✓ WCAG Accessible
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}