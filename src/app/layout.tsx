import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast'; // Import the Toaster

import "./globals.css";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import Header from '@/components/Header';

import { AuthProvider } from "./contexts/AuthContext";
import {Suspense} from 'react';
// import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thế giới ô tô",
  description: "Chào mừng quý khách đến với thế giới ô tô",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-200`}
      >
        <div className="flex flex-col min-h-screen mx-auto bg-white text-sm">
          <Suspense fallback={<div>Loading content...</div>}>
            <AuthProvider>
              <Header />
              {children}
            </AuthProvider>
          </Suspense>
          <Toaster
          position="top-center" // You can choose 'top-right', 'bottom-center', etc.
          reverseOrder={false}
          toastOptions={{
            // Default options for all toasts
            duration: 2000, // How long toasts are visible (2 seconds)
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#22C55E', // Green-500
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#22C55E',
              },
            },
            error: {
              style: {
                background: '#EF4444', // Red-500
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#EF4444',
              },
            },
          }}
        />
        </div>
      </body>
    </html>
  );
}
