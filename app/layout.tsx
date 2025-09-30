import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/header"; 

export const metadata: Metadata = {
  title: "Leo Zhang !",
  description: "My personal website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header /> {/* Site Header */}
        {children}
      </body>
    </html>
  );
}
