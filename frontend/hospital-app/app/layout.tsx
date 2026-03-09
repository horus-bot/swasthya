import "./globals.css";
import { ReactNode } from "react";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Hospital App",
  description: "Hospital operations dashboard and appointments.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Hospital App",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/apple-touch-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body>
        <ServiceWorkerRegister />
        <PWAInstallPrompt />
        {children}
      </body>
    </html>
  );
}
