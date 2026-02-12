import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers'
import { Sidebar } from '@/components/layout/sidebar'

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
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-gray-50">
              <div className="mx-auto max-w-7xl px-8 py-8">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
