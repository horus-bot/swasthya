"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";
import BottomNav from "./BottomNav";
import { LanguageProvider } from "@/lib/LanguageContext";
import ServiceWorkerRegister from "../ServiceWorkerRegister";
import PWAInstallPrompt from "../PWAInstallPrompt";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = pathname === "/";

  return (
    <LanguageProvider>
      <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col overflow-x-hidden">
        {!hideLayout && <Header />}

        <main className={`grow w-full h-full flex flex-col ${!hideLayout ? 'pt-16' : ''}`}>
          {children}
        </main>

        {!hideLayout && <Footer />}
        {pathname !== "/" && <BottomNav />}
        <ServiceWorkerRegister />
        <PWAInstallPrompt />
      </div>
    </LanguageProvider>
  );
}