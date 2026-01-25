import { useState, useEffect, useMemo } from "react";
import { Wifi, WifiOff, CheckCircle } from "lucide-react";

// Types
import type { Toast, ViewType, Entry } from "./types";

// Hooks
import { useLocalStorage } from "./hooks/useLocalStorage.ts";
import { usePWAUpdate } from "./hooks/usePWAUpdate.ts";

// Layout
import { BottomNav } from "./components/layout";

// UI Components
import { Card, ToastContainer } from "./components/ui";

// Features
import { CalendarGrid } from "./features/calendar";
import { WeightChart } from "./features/weight";
import { HistoryList } from "./features/history";
import { ConfigForm, DataManagement } from "./features/settings";

// Components
import LogEntryModal from "./components/LogEntryModal";

// App Version
const APP_VERSION = "1.0.4";

function App() {
  const [activeView, setActiveView] = useState<ViewType>("calendar");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // PWA update detection
  const {
    needRefresh,
    offlineReady,
    isInstalled,
    hasServiceWorker,
    handleUpdate,
    dismissToast: dismissUpdateToast,
    dismissOfflineReady,
  } = usePWAUpdate();

  // Data management hook
  const {
    entries,
    userSettings,
    getEntry,
    saveEntry,
    deleteEntry,
    updateSettings,
    addCustomOption,
    removeCustomOption,
    exportData,
    importData,
    clearAllData,
  } = useLocalStorage();

  useEffect(() => {
    if (offlineReady) {
      const id = "offline-ready";
      setTimeout(() => {
        setToasts((prev) => {
          if (prev.some((t) => t.id === id)) return prev;
          return [
            ...prev,
            {
              id,
              message: "App ready for offline use!",
              type: "success" as const,
              autoDismiss: true,
              autoDismissTime: 4000,
            },
          ];
        });
      }, 0);
    }
  }, [offlineReady]);

  useEffect(() => {
    if (needRefresh) {
      const id = "update-available";
      setTimeout(() => {
        setToasts((prev) => {
          if (prev.some((t) => t.id === id)) return prev;
          return [
            ...prev,
            {
              id,
              message: "New version available!",
              type: "update" as const,
              action: handleUpdate,
              actionLabel: "Update",
              autoDismiss: false,
            },
          ];
        });
      }, 0);
    } else {
      // Remove update toast if needRefresh becomes false
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== "update-available"));
      }, 0);
    }
  }, [needRefresh, handleUpdate]);

  // Apply theme to html element
  useEffect(() => {
    const theme = userSettings.theme || "valentine";
    document.documentElement.setAttribute("data-theme", theme);
  }, [userSettings.theme]);

  // Handle toast dismissal
  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (id === "offline-ready") {
      dismissOfflineReady();
    }
    if (id === "update-available") {
      dismissUpdateToast();
    }
  };

  // Modal handlers
  const handleDayClick = (dateKey: string) => {
    setSelectedDate(dateKey);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
  };

  const handleSaveEntry = (dateKey: string, entryData: Partial<Entry>) => {
    saveEntry(dateKey, entryData);
  };

  const handleDeleteEntry = (dateKey: string) => {
    deleteEntry(dateKey);
  };

  // PWA Status - show as installed if either standalone mode OR has active service worker
  const pwaStatus = useMemo(() => {
    if (isInstalled) return "installed";
    if (hasServiceWorker) return "ready";
    return "browser";
  }, [isInstalled, hasServiceWorker]);

  // Render the active view
  const renderView = () => {
    switch (activeView) {
      case "calendar":
        return (
          <div className="">
            <CalendarGrid
              entries={entries}
              averageCycleLength={userSettings.averageCycleLength}
              onDayClick={handleDayClick}
            />
            <WeightChart entries={entries} />
          </div>
        );

      case "history":
        return (
          <div className="animate-fade-in">
            <HistoryList entries={entries} onEntryClick={handleDayClick} />
          </div>
        );

      case "settings":
        return (
          <div className="animate-fade-in space-y-4">
            {/* App Info */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-base-content">
                    Aura
                  </h2>
                  <p className="text-sm text-base-content/60">
                    Version {APP_VERSION}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-base-content/60">App Status:</span>
                {pwaStatus === "installed" ? (
                  <span className="flex items-center gap-1 text-green-500">
                    <CheckCircle size={14} />
                    Installed
                  </span>
                ) : pwaStatus === "ready" ? (
                  <span className="flex items-center gap-1 text-blue-400">
                    <Wifi size={14} />
                    Ready to Install
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-500">
                    <WifiOff size={14} />
                    Running in Browser
                  </span>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-base-content/10">
                <p className="text-xs text-base-content/60">
                  🔒 Your data is stored locally on this device. No data is sent
                  to any server.
                </p>
              </div>
            </Card>

            {/* Configuration */}
            <ConfigForm
              userSettings={userSettings}
              onAddOption={addCustomOption}
              onRemoveOption={removeCustomOption}
              onUpdateSettings={updateSettings}
            />

            {/* Data Management */}
            <DataManagement
              onExport={exportData}
              onImport={importData}
              onClear={clearAllData}
              entryCount={Object.keys(entries).length}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-base-200">
      {/* Desktop Container */}
      <div className="flex flex-col min-h-screen w-full max-w-[768px] bg-base-100 shadow-xl">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-3 py-3 pb-18">
          {renderView()}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeView={activeView} onViewChange={setActiveView} />

        {/* Log Entry Modal */}
        <LogEntryModal
          key={selectedDate || "closed"}
          isOpen={selectedDate !== null}
          onClose={handleCloseModal}
          dateKey={selectedDate}
          entry={selectedDate ? getEntry(selectedDate) : null}
          userSettings={userSettings}
          onSave={handleSaveEntry}
          onDelete={handleDeleteEntry}
        />

        {/* Stackable Toast Notifications */}
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    </div>
  );
}

export default App;
