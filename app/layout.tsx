import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "TakovoBerry",
  description: "Regenerative farming practices in Takovo region",
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
