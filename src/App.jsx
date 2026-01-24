import { useState } from "react";
import { Moon, Wifi, WifiOff, RefreshCw } from "lucide-react";

// Hooks
import { useLocalStorage } from "./hooks/useLocalStorage";

// Layout
import { Header, BottomNav } from "./components/layout";

// UI Components
import { Card, Button } from "./components/ui";

// Features
import { CalendarGrid } from "./features/calendar";
import { WeightChart } from "./features/weight";
import { HistoryList } from "./features/history";
import { ConfigForm, DataManagement } from "./features/settings";

// Components
import LogEntryModal from "./components/LogEntryModal";

// App Version from package.json
const APP_VERSION = "1.0.0";

function App() {
  const [activeView, setActiveView] = useState("calendar");
  const [selectedDate, setSelectedDate] = useState(null);
  // PWA update toast state - will be set by service worker when update is available
  // eslint-disable-next-line no-unused-vars
  const [showUpdateToast, setShowUpdateToast] = useState(false);

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

  // Check if app is running as PWA
  const isPWA =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

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

      case "weight":
        return (
          <div className="animate-fade-in">
            <WeightChart entries={entries} />
            <div className="mt-4">
              <Card>
                <h3 className="font-semibold text-[var(--text-primary)] mb-3">
                  📊 Weight Tracking Tips
                </h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>
                    • Weigh yourself at the same time each day for consistency
                  </li>
                  <li>
                    • Morning measurements after using the bathroom are most
                    accurate
                  </li>
                  <li>• Weight fluctuations of 1-3 lbs daily are normal</li>
                  <li>• Focus on weekly trends rather than daily changes</li>
                </ul>
              </Card>
            </div>
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                  <Moon size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">
                    Aura - Cycle Tracking
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    Version {APP_VERSION}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--text-secondary)]">
                  PWA Status:
                </span>
                {isPWA ? (
                  <span className="flex items-center gap-1 text-[var(--color-success)]">
                    <Wifi size={14} />
                    Installed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[var(--text-muted)]">
                    <WifiOff size={14} />
                    Running in Browser
                  </span>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-muted)]">
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
    <div className="flex flex-col min-h-screen min-h-[100dvh]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4">{renderView()}</main>

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

      {/* PWA Update Toast */}
      {showUpdateToast && (
        <div className="fixed bottom-24 left-4 right-4 z-50">
          <div className="glass-strong rounded-xl p-4 flex items-center justify-between animate-slide-up">
            <div className="flex items-center gap-3">
              <RefreshCw size={20} className="text-[var(--color-primary)]" />
              <span className="text-sm text-[var(--text-primary)]">
                Update available!
              </span>
            </div>
            <Button size="sm" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
