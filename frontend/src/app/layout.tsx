import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from '@/lib/cart';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import Navbar from '@/components/Navbar';
import Box from '@mui/material/Box';
import { AuthProvider } from '@/hooks/useAuth';

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Slooza Food Ordering",
  description: "Food ordering application",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeRegistry>
          {/* AuthProvider wraps the app for global auth state */}
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <Box component="main" sx={{ p: 3 }}>
                {children}
              </Box>
            </CartProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
