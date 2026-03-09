'use client';

import { usePathname } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't show AppShell on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }
  
  return <AppShell>{children}</AppShell>;
}
