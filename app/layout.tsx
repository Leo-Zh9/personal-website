import './globals.css'; // optional, if you have global CSS

export const metadata = {
  title: 'Personal Website',
  description: 'My website with waves and Spotify integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* You can add custom meta tags here if needed */}
      </head>
      <body>{children}</body>
    </html>
  );
}
