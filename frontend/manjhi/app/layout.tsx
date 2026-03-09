import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { theme } from "@/lib/theme";

export const metadata: Metadata = {
  title: "MANJHI WORKER",
  description: "Frontline Healthcare Field Operations Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: theme.colors.background }}>
        {/* Desktop Navbar */}
        <div
          className="desktop-only"
          style={{ position: "sticky", top: 0, zIndex: 100 }}
        >
          <Navbar />
        </div>

        {/* Page Content */}
        <main style={{ minHeight: "100vh", paddingBottom: "6rem" }}>
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <div
          className="mobile-only"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
          }}
        >
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
