import '../styles/global.css';

export const metadata = {
  metadataBase: new URL('https://mumind.me'),
  description: 'Personal website with musings and portfolio stuff',
  openGraph: {
    type: 'website',
  },
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
