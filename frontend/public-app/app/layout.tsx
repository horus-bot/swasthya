import "./globals.css";
import type { Metadata, Viewport } from "next";
import ClientLayout from "../components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "Swasthya - Public Healthcare Platform",
  description: "Government & Public Healthcare Services",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Swasthya",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen overflow-x-hidden">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}