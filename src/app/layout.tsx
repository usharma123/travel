import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Dart Travel Planner',
  description: 'Throw a dart at the globe to plan your next trip'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
