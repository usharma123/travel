import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Dart Travel",
  description: "Throw a dart at the globe and plan your trip",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
