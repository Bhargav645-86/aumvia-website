import { Inter } from 'next/font/google';
import Providers from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AUMVIA - Business Management & Staff Marketplace',
  description: 'Manage compliance, HR, rota, inventory, and staff swaps seamlessly.',
  themeColor: '#4f46e5',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* No whitespace, no strings */}
        <meta name="theme-color" content="#4f46e5" />
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
