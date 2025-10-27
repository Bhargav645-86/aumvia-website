import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aumvia - Path to Harmony and Growth",
  description: "UK's premier cloud platform for small businesses. Streamline compliance, HR, rotas, inventory, and staff management for takeaways, cafés, off-licences, bubble tea bars, and restaurants.",
  keywords: "business management, compliance, HR, rota, staff scheduling, inventory, UK small business, takeaway management, café management, restaurant management",
  authors: [{ name: "Aumvia" }],
  openGraph: {
    title: "Aumvia - Path to Harmony and Growth",
    description: "Streamline your business with spiritual harmony and modern technology",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="icon" href="/aumvia-logo.png" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${montserrat.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
