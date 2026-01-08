import type { Metadata } from "next";
import "./globals.scss";

const isStaging = process.env.NEXT_PUBLIC_ENVIRONMENT === "staging";

export const metadata: Metadata = {
  title: "TakovoBerry",
  description: "Regenerative farming practices in Takovo region",
  // Block indexing on staging environment
  robots: isStaging ? { index: false, follow: false } : { index: true, follow: true },
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
