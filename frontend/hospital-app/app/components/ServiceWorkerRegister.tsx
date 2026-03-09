"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        // next-pwa places the worker at /sw.js by default (dest: 'public')
        const reg = await navigator.serviceWorker.register('/sw.js');
        // eslint-disable-next-line no-console
        console.log('Service worker registered:', reg);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Service worker registration failed:', err);
      }
    };

    // Register after load to avoid blocking
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register);

    return () => {
      window.removeEventListener('load', register as any);
    };
  }, []);

  return null;
}
