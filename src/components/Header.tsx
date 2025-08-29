// src/components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Image 
          src="/aumvia-logo.png" 
          alt="Aumvia Logo" 
          width={40} 
          height={40} 
        />
        <Link href="/" className="text-xl font-bold text-gray-800">
          Aumvia
        </Link>
      </div>
      <nav className="space-x-4">
        <Link href="/services" className="text-gray-600 hover:text-blue-600">
          Services
        </Link>
        <Link href="/about" className="text-gray-600 hover:text-blue-600">
          About
        </Link>
        <Link href="/contact" className="text-gray-600 hover:text-blue-600">
          Contact
        </Link>
      </nav>
    </header>
  );
}