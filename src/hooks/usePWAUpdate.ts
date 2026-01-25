import { useState, useEffect, useCallback, useRef } from "react";
import type { UsePWAUpdateReturn } from "../types";

const OFFLINE_READY_SHOWN_KEY = "aura_offline_ready_shown";
const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000; // Check every hour

/**
 * Custom hook for handling PWA service worker updates
 * Features:
 * - Periodic update checks (not just on reload)
 * - Auto-dismiss offline ready notification
 * - Only shows offline ready toast once per installation
 * - Tracks PWA installation status
 */
export function usePWAUpdate(): UsePWAUpdateReturn {
  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasServiceWorker, setHasServiceWorker] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Check if running as installed PWA (standalone mode)
    const checkInstalled = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone ===
          true ||
        document.referrer.includes("android-app://");
      setIsInstalled(isStandalone);
    };

    checkInstalled();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener("change", checkInstalled);

    // Only initialize if service worker is supported
    if (!("serviceWorker" in navigator)) return;

    const checkForUpdates = () => {
      if (registrationRef.current) {
        registrationRef.current.update().catch(console.error);
      }
    };

    navigator.serviceWorker.ready.then((registration) => {
      registrationRef.current = registration;
      setHasServiceWorker(true);

      // Check if offline ready notification was already shown
      const alreadyShown = localStorage.getItem(OFFLINE_READY_SHOWN_KEY);

      if (registration.active && !alreadyShown) {
        // First time the service worker is active - show offline ready
        setOfflineReady(true);
        localStorage.setItem(OFFLINE_READY_SHOWN_KEY, "true");
      }

      // Listen for new service worker installations
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New content is available
              setNeedRefresh(true);
            }
          });
        }
      });

      // Set up periodic update checks
      intervalRef.current = setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL);

      // Also check for updates when the page becomes visible again
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          checkForUpdates();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    });

    // Handle controller change (when the new SW takes over)
    const handleControllerChange = () => {
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
      mediaQuery.removeEventListener("change", checkInstalled);
    };
  }, []);

  const handleUpdate = useCallback(() => {
    if (registrationRef.current?.waiting) {
      // Tell the waiting service worker to activate
      registrationRef.current.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  }, []);

  const dismissToast = useCallback(() => {
    setNeedRefresh(false);
  }, []);

  const dismissOfflineReady = useCallback(() => {
    setOfflineReady(false);
  }, []);

  return {
    offlineReady,
    needRefresh,
    isInstalled,
    hasServiceWorker,
    handleUpdate,
    dismissToast,
    dismissOfflineReady,
  };
}

export default usePWAUpdate;
