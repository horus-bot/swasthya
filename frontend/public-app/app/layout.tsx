import "./globals.css";
import ClientLayout from "../components/layout/ClientLayout";

export const metadata = {
  title: "Swasthya - Public Healthcare Platform",
  description: "Government & Public Healthcare Services",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClientLayout>{children}</ClientLayout>
    </html>
  );
}