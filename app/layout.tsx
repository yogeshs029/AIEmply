import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});


export const metadata: Metadata = {
  title: 'AI Emply — AI Workforce',
  description:
    'Find and deploy the ideal AI Employee for your business. Available 24/7, built around your workflow.',
  keywords: [
    'AI Emply',
    'AI Employee',
    'AI Workforce',
    'AI Receptionist',
    'AI Sales Assistant',
    'AI Customer Support',
    'Business Automation',
  ],
  authors: [{ name: 'AI Emply' }],
  creator: 'AI Emply',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'AI Emply — AI Workforce',
    description:
      'Find and deploy the ideal AI Employee for your business. Available 24/7, built around your workflow.',
    siteName: 'AI Emply',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Emply — AI Workforce',
    description:
      'Find and deploy the ideal AI Employee for your business. Available 24/7, built around your workflow.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
