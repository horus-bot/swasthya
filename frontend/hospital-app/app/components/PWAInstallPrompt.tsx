"use client";

import { useEffect, useState } from "react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // detect iOS
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const ios = /iphone|ipad|ipod/i.test(ua) && !(window as any).navigator?.standalone;
    setIsIos(ios);

    function beforeInstallHandler(e: any) {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    }

    function appInstalled() {
      setVisible(false);
      setDeferredPrompt(null);
    }

    window.addEventListener('beforeinstallprompt', beforeInstallHandler as EventListener);
    window.addEventListener('appinstalled', appInstalled as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler as EventListener);
      window.removeEventListener('appinstalled', appInstalled as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setVisible(false);
        setDeferredPrompt(null);
      } else {
        // user dismissed
        setVisible(false);
      }
    } catch (e) {
      console.warn('Install prompt failed', e);
    }
  };

  if (!visible && !isIos) return null;

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 max-w-[92%] sm:max-w-md">
      <div className="bg-white border shadow-lg rounded-xl p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/icons/icon-192.svg" alt="app" className="w-10 h-10 rounded-lg" />
          <div>
            <div className="text-sm font-semibold">Install Hospital App</div>
            <div className="text-xs text-slate-500">Get quick access and offline support.</div>
          </div>
        </div>
        {!isIos ? (
          <div className="flex items-center gap-2">
            <button onClick={handleInstallClick} className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700">Install</button>
            <button onClick={() => setVisible(false)} className="px-3 py-2 rounded-md text-sm border">Close</button>
          </div>
        ) : (
          <div className="text-xs text-slate-600">
            <div className="mb-1">On iOS: tap Share → Add to Home Screen.</div>
            <button onClick={() => setVisible(false)} className="px-3 py-1 rounded-md text-sm border">Dismiss</button>
          </div>
        )}
      </div>
    </div>
  );
}
