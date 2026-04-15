import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers'
import { AppShell } from '@/components/layout/app-shell'

export const metadata: Metadata = {
  title: "Prism Focus - LGBTQ+ Founder Community",
  description: "A community platform for LGBTQ+ founders to connect, share, and grow together.",
  icons: {
    icon: "/assets/prism_logo.png",
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
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
