import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { PWALifecycle } from '@/components/pwa-lifecycle';

export const metadata: Metadata = {
  title: 'TrackShift - Employee Time & Location Tracking',
  description:
    'Mobile-first PWA for managing employee schedules, clock in/out, and location tracking',
  manifest: '/manifest.webmanifest',
  themeColor: '#0ea5e9',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TrackShift',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <PWALifecycle />
          {children}
        </Providers>
      </body>
    </html>
  );
}
