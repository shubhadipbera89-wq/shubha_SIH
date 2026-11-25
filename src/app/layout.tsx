import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { TAGLINE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'JanSamadhan - Jharkhand Digital Crowdsourcing Platform',
  description: TAGLINE,
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  keywords: [
    'JanSamadhan',
    'Jharkhand',
    'Civic Crowdsourcing',
    'People Ideas Solutions',
    'Ranchi',
    'Dhanbad',
    'Jamshedpur',
    'BIT Mesra',
    'IIT ISM',
    'Tata Steel',
    'Societal Challenges',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-900 bg-slate-50 font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
