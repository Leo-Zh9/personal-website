// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/header";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Leo Zhang",
  description: "Systems Design Engineering Student at University of Waterloo. Software Engineer, Full-Stack Developer.",
  keywords: ["Leo Zhang", "Software Engineer", "Full Stack Developer", "Waterloo", "Systems Design"],
  authors: [{ name: "Leo Zhang" }],
  creator: "Leo Zhang",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Leo Zhang",
  },
  icons: {
    icon: [
      { url: '/propeller-hat.png', sizes: '32x32', type: 'image/png' },
      { url: '/propeller-hat.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/propeller-hat.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body>
        <Header /> {/* Fixed header at top */}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
