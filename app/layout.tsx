// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/header";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Leo Zhang",
  description: "My personal website",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  icons: {
    icon: [
      { url: '/propeller-hat.png', sizes: '32x32', type: 'image/png' },
      { url: '/propeller-hat.png', sizes: '16x16', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <Header /> {/* Fixed header at top */}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
