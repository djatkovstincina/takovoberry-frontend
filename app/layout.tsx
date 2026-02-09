import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";

// Use next/font/local for optimal font loading
const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://takovoberry.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Takovoberry - Regenerative Farming",
    template: "%s | Takovoberry",
  },
  description: "Regenerative farming practices in Takovo region. Sustainable berry production.",
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: 'website',
    siteName: 'Takovoberry',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" className={inter.variable}>
      <head>
        {/* Preconnect to WordPress for faster image loading */}
        <link rel="preconnect" href="https://wp.takovoberry.com" />
        <link rel="dns-prefetch" href="https://wp.takovoberry.com" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
