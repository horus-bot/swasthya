import "./globals.css";
import ClientLayout from "../components/layout/ClientLayout";

export const metadata = {
  title: "Swasthya - Public Healthcare Platform",
  description: "Government & Public Healthcare Services",
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