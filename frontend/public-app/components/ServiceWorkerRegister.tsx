"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        console.log('Service worker registered:', reg);
      } catch (err) {
        console.warn('Service worker registration failed:', err);
      }
    };

    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register);

    return () => {
      window.removeEventListener('load', register as any);
    };
  }, []);

  return null;
}
