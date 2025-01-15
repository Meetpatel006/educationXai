import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Assistant Platform',
  description: 'Your all-in-one AI assistant for queries, document analysis, and video summaries',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-background/80">
          <Navbar />
          <main className="container mx-auto px-4 py-6">{children}</main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}