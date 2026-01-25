// ============================================
// Core Domain Types for Aura Cycle Tracker
// ============================================

/**
 * Entry data for a single day's log
 */
export interface Entry {
  flow?: string;
  mood?: string[];
  symptoms?: string[];
  weight?: string;
  notes?: string;
}

/**
 * Map of date keys (YYYY-MM-DD) to Entry objects
 */
export type EntriesMap = Record<string, Entry>;

/**
 * User configurable settings
 */
export interface UserSettings {
  averageCycleLength: number;
  flowOptions: string[];
  moodOptions: string[];
  symptomOptions: string[];
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
  data: StorageData;
  userSettings: UserSettings;
  entries: EntriesMap;
  getEntry: (dateKey: string) => Entry | null;
  getAllEntries: () => EntriesMap;
  saveEntry: (dateKey: string, entryData: Partial<Entry>) => void;
  deleteEntry: (dateKey: string) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  addCustomOption: (type: "mood" | "symptom", option: string) => void;
  removeCustomOption: (type: "mood" | "symptom", option: string) => void;
  exportData: () => void;
  importData: (jsonData: string | object) => ImportResult;
  clearAllData: () => void;
}

/**
 * Result of data import operation
 */
export interface ImportResult {
  success: boolean;
  error?: string;
  entryCount?: number;
}

/**
 * Return type for usePWAUpdate hook
 */
export interface UsePWAUpdateReturn {
  offlineReady: boolean;
  needRefresh: boolean;
  isInstalled: boolean;
  hasServiceWorker: boolean;
  handleUpdate: () => void;
  dismissToast: () => void;
  dismissOfflineReady: () => void;
}

// ============================================
// Utility Types
// ============================================

/**
 * Props that include children
 */
export interface WithChildren {
  children?: React.ReactNode;
}

/**
 * Props that include className
 */
export interface WithClassName {
  className?: string;
}
