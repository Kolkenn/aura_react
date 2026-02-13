// ============================================
// Core Domain Types for Aura Cycle Tracker
// ============================================

/**
 * Entry data for a single day's log
 */
export interface Entry {
  flow?: string; // Light, Medium, Heavy, Spotting
  mood?: string[]; // Happy, Sad, Angry, Anxious, Tired, Energized
  symptoms?: string[]; // PMS, Cramps, Mood swings, Fatigue, Headache, Acne, Insomnia
  weight?: string; // 120 lbs
  notes?: string; // Any additional notes
}

/**
 * Map of date keys (YYYY-MM-DD) to Entry objects
 */
export type EntriesMap = Record<string, Entry>;

/**
 * User configurable settings
 */
export interface UserSettings {
  averageCycleLength: number; // 28 days
  flowOptions: string[]; // Light, Medium, Heavy, Spotting
  moodOptions: string[]; // Happy, Sad, Angry, Anxious, Tired, Energized
  symptomOptions: string[]; // PMS, Cramps, Mood swings, Fatigue, Headache, Acne, Insomnia
  theme: string; // valentine, synthwave, halloween, aqua, pastel, luxury, dracula
}

/**
 * Full storage schema for localStorage
 */
export interface StorageData {
  userSettings: UserSettings;
  entries: EntriesMap;
}

// ============================================
// UI Types
// ============================================

/**
 * Toast notification types
 */
export type ToastType = "success" | "error" | "update" | "info";

/**
 * Toast notification object
 */
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  action?: () => void;
  actionLabel?: string;
  autoDismiss?: boolean;
  autoDismissTime?: number;
}

/**
 * Navigation view types
 */
export type ViewType = "calendar" | "history" | "settings";

// ============================================
// Component Prop Types
// ============================================

/**
 * Common button variants
 */
export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

/**
 * Common button sizes
 */
export type ButtonSize = "sm" | "md" | "lg";

// ============================================
// Hook Return Types
// ============================================

/**
 * Return type for useLocalStorage hook
 */
export interface UseLocalStorageReturn {
  data: StorageData; // { userSettings: UserSettings; entries: EntriesMap; }
  userSettings: UserSettings; // { averageCycleLength: number; flowOptions: string[]; moodOptions: string[]; symptomOptions: string[]; theme: string; }
  entries: EntriesMap; // { [dateKey: string]: Entry; }
  getEntry: (dateKey: string) => Entry | null; // Returns entry for a specific date
  getAllEntries: () => EntriesMap; // Returns all entries
  saveEntry: (dateKey: string, entryData: Partial<Entry>) => void; // Saves an entry for a specific date
  deleteEntry: (dateKey: string) => void; // Deletes an entry for a specific date
  updateSettings: (newSettings: Partial<UserSettings>) => void; // Updates user settings
  addCustomOption: (type: "mood" | "symptom", option: string) => void; // Adds a custom option to the mood or symptom list
  removeCustomOption: (type: "mood" | "symptom", option: string) => void; // Removes a custom option from the mood or symptom list
  exportData: () => void; // Exports all data to a JSON file
  importData: (jsonData: string | object) => ImportResult; // Imports data from a JSON file
  clearAllData: () => void; // Clears all data
}

/**
 * Result of data import operation
 */
export interface ImportResult {
  success: boolean; // True if import was successful
  error?: string; // Error message if import failed
  entryCount?: number; // Number of entries imported
}

/**
 * Return type for usePWAUpdate hook
 */
export interface UsePWAUpdateReturn {
  offlineReady: boolean; // True if the app is ready to be installed
  needRefresh: boolean; // True if the app needs to be refreshed (controls toast visibility)
  updateAvailable: boolean; // True if an update is available (persists after toast dismissal)
  isInstalled: boolean; // True if the app is installed
  hasServiceWorker: boolean; // True if the app has a service worker
  handleUpdate: () => void; // Updates the app
  dismissToast: () => void; // Dismisses the toast
  dismissOfflineReady: () => void;
}

// ============================================
// Utility Types
// ============================================

/**
 * Props that include children
 */
export interface WithChildren {
  children?: React.ReactNode; // React node(s) to render
}

/**
 * Props that include className
 */
export interface WithClassName {
  className?: string; // Tailwind CSS classes
}
