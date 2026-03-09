import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

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
      <body>
        <div className="manjhi-shell">
          <div className="shell-backdrop" aria-hidden="true">
            <div className="shell-orb shell-orb-a" />
            <div className="shell-orb shell-orb-b" />
            <div className="shell-orb shell-orb-c" />
          </div>

          <div className="desktop-only topbar-host">
            <Navbar />
          </div>

          <main className="shell-main">{children}</main>

          <div className="mobile-only mobile-dock-host">
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}
