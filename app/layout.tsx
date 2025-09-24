import "./globals.css";

export const metadata = {
  title: "Leo Zhang | Personal Website",
  description: "My personal website with Spotify integration",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
