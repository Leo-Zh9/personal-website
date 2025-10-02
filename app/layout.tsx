// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/header";

export const metadata: Metadata = {
  title: "Leo Zhang",
  description: "My personal website",
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
      <body>
        <Header /> {/* Fixed header at top */}
        {children}
      </body>
    </html>
  );
}
