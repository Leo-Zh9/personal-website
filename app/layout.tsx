// layout.tsx (FIXED: Favicon added to metadata)

import "./globals.css";
import type { Metadata } from "next"; // ✅ fixed import
import Header from "../components/header"; 

export const metadata: Metadata = {
  title: "Leo Zhang !",
  description: "My personal website",
  icons: {
    icon: '/propeller-hat.png', // Path points to the file in the public folder
    // apple: '/apple-icon.png', // optional
  },
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
