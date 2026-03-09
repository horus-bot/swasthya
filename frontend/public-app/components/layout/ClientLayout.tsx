"use client";

import { usePathname } from "next/navigation";
import Head from "next/head";
import Header from "./header";
import Footer from "./footer";
import BottomNav from "./BottomNav";
import { LanguageProvider } from "@/lib/LanguageContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = pathname === "/";

  return (
    <LanguageProvider>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </Head>
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col overflow-x-hidden">
        {!hideLayout && <Header />}

        <main className={`flex-grow w-full h-full flex flex-col ${!hideLayout ? 'pt-16' : ''}`}>
          {children}
        </main>

        {!hideLayout && <Footer />}
        {pathname !== "/" && <BottomNav />}
      </body>
    </LanguageProvider>
  );
}