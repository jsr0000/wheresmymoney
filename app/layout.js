"use client";

import { SessionProvider } from "next-auth/react";
import { Gantari } from "next/font/google";
import "./globals.css";

const gantariFont = Gantari({
  subsets: ["latin"],
  weight: "800",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={gantariFont.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
