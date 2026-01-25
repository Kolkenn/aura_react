import { useState, useEffect, useMemo } from "react";
import { Moon, Wifi, WifiOff, CheckCircle } from "lucide-react";

// Hooks
import { useLocalStorage } from "./hooks/useLocalStorage";
import { usePWAUpdate } from "./hooks/usePWAUpdate";

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
const APP_VERSION = "1.0.1";

function App() {
  const [activeView, setActiveView] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(null);
  const [toasts, setToasts] = useState([]);

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

  // Manage toasts based on PWA state
  useEffect(() => {
    if (offlineReady) {
      const id = "offline-ready";
      setToasts((prev) => {
        if (prev.some((t) => t.id === id)) return prev;
        return [
          ...prev,
          {
            id,
            message: "App ready for offline use!",
            type: "success",
            autoDismiss: true,
            autoDismissTime: 4000,
          },
        ];
      });
    }
  }, [offlineReady]);

  useEffect(() => {
    if (needRefresh) {
      const id = "update-available";
      setToasts((prev) => {
        if (prev.some((t) => t.id === id)) return prev;
        return [
          ...prev,
          {
            id,
            message: "New version available!",
            type: "update",
            action: handleUpdate,
            actionLabel: "Update",
            autoDismiss: false,
          },
        ];
      });
    } else {
      // Remove update toast if needRefresh becomes false
      setToasts((prev) => prev.filter((t) => t.id !== "update-available"));
    }
  }, [needRefresh, handleUpdate]);

  // Handle toast dismissal
  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (id === "offline-ready") {
      dismissOfflineReady();
    }
    if (id === "update-available") {
      dismissUpdateToast();
    }
  };

  // Modal handlers
  const handleDayClick = (dateKey) => {
    setSelectedDate(dateKey);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
  };

  const handleSaveEntry = (dateKey, entryData) => {
    saveEntry(dateKey, entryData);
  };

  const handleDeleteEntry = (dateKey) => {
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
          <div className="animate-fade-in">
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
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <Moon size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">
                    Aura - Cycle Tracking
                  </h2>
                  <p className="text-sm text-gray-500">Version {APP_VERSION}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">PWA Status:</span>
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

              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-500">
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
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-3 py-3">{renderView()}</main>

      {/* Bottom Navigation */}
      <BottomNav activeView={activeView} onViewChange={setActiveView} />

      {/* Log Entry Modal */}
      <LogEntryModal
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
  );
}

export default App;
