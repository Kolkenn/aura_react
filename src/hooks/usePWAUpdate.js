import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for handling PWA service worker updates
 * Provides "Update Ready" toast functionality
 *
 * Works with vite-plugin-pwa's 'script' injection mode
 */
export function usePWAUpdate() {
  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  useEffect(() => {
    // Listen for service worker updates
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Service worker is ready - app is offline capable
        setOfflineReady(true);

        // Listen for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New content is available, show refresh prompt
                setNeedRefresh(true);
                setShowUpdateToast(true);
              }
            });
          }
        });
      });

      // Handle controller change (when skipWaiting is called)
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    }
  }, []);

  const handleUpdate = useCallback(() => {
    // Tell the waiting service worker to skip waiting
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
      });
    }
  }, []);

  const dismissToast = useCallback(() => {
    setShowUpdateToast(false);
    setNeedRefresh(false);
  }, []);

  const dismissOfflineReady = useCallback(() => {
    setOfflineReady(false);
  }, []);

  return {
    offlineReady,
    needRefresh,
    showUpdateToast,
    handleUpdate,
    dismissToast,
    dismissOfflineReady,
  };
}

export default usePWAUpdate;
