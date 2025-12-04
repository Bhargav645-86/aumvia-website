import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import Providers from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AUMVIA - Business Management & Staff Marketplace',
  description: 'Manage compliance, HR, rota, inventory, and staff swaps seamlessly.',
  icons: {
    icon: '/favicon.ico'
  }
};

export const viewport: Viewport = {
  themeColor: '#4f46e5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
