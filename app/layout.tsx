import type { Metadata } from "next";
import "./globals.scss";

const isStaging = process.env.NEXT_PUBLIC_ENVIRONMENT === "staging";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://takovoberry.orbu.studio';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Takovoberry - Regenerative Farming",
    template: "%s | Takovoberry",
  },
  description: "Regenerative farming practices in Takovo region. Sustainable berry production.",
  // Block indexing on staging environment
  robots: isStaging ? { index: false, follow: false } : { index: true, follow: true },
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
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
