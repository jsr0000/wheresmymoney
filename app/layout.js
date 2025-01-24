"use client";

import { SessionProvider } from "next-auth/react";
import { Gantari } from 'next/font/google';
import "./globals.css";

const gantari = Gantari({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={gantari.className}>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
