import { useState, useCallback, useEffect } from "react";
import type {
  Entry,
  EntriesMap,
  UserSettings,
  StorageData,
  UseLocalStorageReturn,
  ImportResult,
} from "../types";

const STORAGE_KEY = "cycle_tracker_mvp_data";

const DEFAULT_DATA: StorageData = {
  userSettings: {
    averageCycleLength: 28,
    flowOptions: ["None", "Spotting", "Light", "Medium", "Heavy"],
    moodOptions: [
      "Happy",
      "Calm",
      "Anxious",
      "Sad",
      "Irritable",
      "Energetic",
      "Tired",
      "Moody",
    ],
    symptomOptions: [
      "Cramps",
      "Headache",
      "Bloating",
      "Backache",
      "Nausea",
      "Fatigue",
      "Breast Tenderness",
      "Acne",
      "Insomnia",
    ],
  },
  entries: {},
};

/**
 * Custom hook for managing cycle tracker data in localStorage
 * Maintains 100% compatibility with the legacy localStorage schema
 */
export function useLocalStorage(): UseLocalStorageReturn {
  const [data, setData] = useState<StorageData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<StorageData>;
        // Merge with defaults to ensure all fields exist
        return {
          userSettings: {
            ...DEFAULT_DATA.userSettings,
            ...parsed.userSettings,
          },
          entries: parsed.entries || {},
        };
      }
      return DEFAULT_DATA;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return DEFAULT_DATA;
    }
  });

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [data]);

  // Get entry for a specific date
  const getEntry = useCallback(
    (dateKey: string): Entry | null => {
      return data.entries[dateKey] || null;
    },
    [data.entries],
  );

  // Get all entries
  const getAllEntries = useCallback((): EntriesMap => {
    return data.entries;
  }, [data.entries]);

  // Upsert (create or update) an entry
  const saveEntry = useCallback(
    (dateKey: string, entryData: Partial<Entry>) => {
      setData((prev) => {
        const existingEntry = prev.entries[dateKey] || {};
        const updatedEntry: Entry = { ...existingEntry, ...entryData };

        // Remove empty fields
        (Object.keys(updatedEntry) as Array<keyof Entry>).forEach((key) => {
          const value = updatedEntry[key];
          if (value === "" || value === null || value === undefined) {
            delete updatedEntry[key];
          }
          if (Array.isArray(value) && value.length === 0) {
            delete updatedEntry[key];
          }
          if (key === "flow" && value === "None") {
            delete updatedEntry[key];
          }
        });

        // If entry is empty, remove it entirely
        if (Object.keys(updatedEntry).length === 0) {
          const restEntries = Object.fromEntries(
            Object.entries(prev.entries).filter(([key]) => key !== dateKey),
          );
          return {
            ...prev,
            entries: restEntries,
          };
        }

        return {
          ...prev,
          entries: {
            ...prev.entries,
            [dateKey]: updatedEntry,
          },
        };
      });
    },
    [],
  );

  // Delete an entry
  const deleteEntry = useCallback((dateKey: string) => {
    setData((prev) => {
      const restEntries = Object.fromEntries(
        Object.entries(prev.entries).filter(([key]) => key !== dateKey),
      );
      return {
        ...prev,
        entries: restEntries,
      };
    });
  }, []);

  // Update user settings
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setData((prev) => ({
      ...prev,
      userSettings: {
        ...prev.userSettings,
        ...newSettings,
      },
    }));
  }, []);

  // Add a custom option (mood or symptom)
  const addCustomOption = useCallback(
    (type: "mood" | "symptom", option: string) => {
      const key = type === "mood" ? "moodOptions" : "symptomOptions";
      setData((prev) => {
        const currentOptions = prev.userSettings[key] || [];
        if (currentOptions.includes(option)) return prev;
        return {
          ...prev,
          userSettings: {
            ...prev.userSettings,
            [key]: [...currentOptions, option],
          },
        };
      });
    },
    [],
  );

  // Remove a custom option
  const removeCustomOption = useCallback(
    (type: "mood" | "symptom", option: string) => {
      const key = type === "mood" ? "moodOptions" : "symptomOptions";
      setData((prev) => ({
        ...prev,
        userSettings: {
          ...prev.userSettings,
          [key]: prev.userSettings[key].filter((o) => o !== option),
        },
      }));
    },
    [],
  );

  // Export data as JSON
  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aura-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  // Import data from JSON with legacy format support
  const importData = useCallback((jsonData: string | object): ImportResult => {
    try {
      // Parse if string
      let parsed: unknown;
      try {
        parsed = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        return {
          success: false,
          error: "Invalid JSON format. Please check your file.",
        };
      }

      // Handle null/undefined
      if (!parsed || typeof parsed !== "object") {
        return { success: false, error: "Invalid data: expected an object" };
      }

      const parsedObj = parsed as Record<string, unknown>;
      console.log("Importing data structure:", Object.keys(parsedObj));

      // Check for different possible data structures
      let entries: EntriesMap | null = null;
      let userSettings: Partial<UserSettings> | null = null;

      // Format 1: Direct { entries: {...}, userSettings: {...} }
      if (parsedObj.entries && typeof parsedObj.entries === "object") {
        entries = parsedObj.entries as EntriesMap;
        userSettings =
          (parsedObj.userSettings as Partial<UserSettings>) || null;
      }
      // Format 2: Just entries at root level (each key is a date)
      else if (Object.keys(parsedObj).length > 0) {
        const keys = Object.keys(parsedObj);
        const looksLikeDates = keys.some((key) =>
          /^\d{4}-\d{2}-\d{2}$/.test(key),
        );

        if (looksLikeDates) {
          entries = parsedObj as EntriesMap;
          console.log("Detected legacy format: entries at root level");
        }
      }

      // Validate we have entries
      if (!entries || typeof entries !== "object") {
        return {
          success: false,
          error:
            "Could not find valid entries in the data. Expected format: { entries: { 'YYYY-MM-DD': {...} } }",
        };
      }

      // ============ LEGACY FORMAT MIGRATION ============

      // Helper to capitalize first letter
      const toTitleCase = (str: string): string => {
        if (!str || typeof str !== "string") return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };

      // Migrate userSettings if it's in legacy format (object arrays)
      const migratedSettings: UserSettings = { ...DEFAULT_DATA.userSettings };

      if (userSettings) {
        // Preserve averageCycleLength
        if (userSettings.averageCycleLength) {
          migratedSettings.averageCycleLength = userSettings.averageCycleLength;
        }

        // Migrate flowOptions from [{value, label, icon}] to ["Label"]
        if (Array.isArray(userSettings.flowOptions)) {
          const firstFlow = userSettings.flowOptions[0];
          if (
            firstFlow &&
            typeof firstFlow === "object" &&
            (firstFlow as unknown as { label?: string }).label
          ) {
            // Legacy format - extract labels
            migratedSettings.flowOptions = [
              "None",
              ...userSettings.flowOptions.map(
                (opt) => (opt as unknown as { label: string }).label,
              ),
            ];
            console.log("Migrated flowOptions from object format");
          } else if (typeof firstFlow === "string") {
            // Already string format
            migratedSettings.flowOptions = userSettings.flowOptions as string[];
          }
        }

        // Migrate moodOptions from [{value, label, icon}] to ["Label"]
        if (Array.isArray(userSettings.moodOptions)) {
          const firstMood = userSettings.moodOptions[0];
          if (
            firstMood &&
            typeof firstMood === "object" &&
            (firstMood as unknown as { label?: string }).label
          ) {
            // Legacy format - extract labels
            migratedSettings.moodOptions = userSettings.moodOptions.map(
              (opt) => (opt as unknown as { label: string }).label,
            );
            console.log("Migrated moodOptions from object format");
          } else if (typeof firstMood === "string") {
            // Already string format
            migratedSettings.moodOptions = userSettings.moodOptions as string[];
          }
        }

        // symptomOptions is already string array in legacy format
        if (Array.isArray(userSettings.symptomOptions)) {
          migratedSettings.symptomOptions =
            userSettings.symptomOptions as string[];
        }
      }

      // Build flow value mapping from legacy (lowercase) to new (Title Case)
      const buildFlowMapping = (): Record<string, string> => {
        const mapping: Record<string, string> = {};
        // Add common defaults
        mapping["spotting"] = "Spotting";
        mapping["light"] = "Light";
        mapping["medium"] = "Medium";
        mapping["heavy"] = "Heavy";
        mapping["vheavy"] = "V. Heavy";
        mapping["clots"] = "Clots";
        mapping["none"] = "None";
        return mapping;
      };

      // Build mood value mapping from legacy (lowercase) to new (Title Case)
      const buildMoodMapping = (): Record<string, string> => {
        const mapping: Record<string, string> = {};
        // Add common defaults
        mapping["happy"] = "Happy";
        mapping["neutral"] = "Neutral";
        mapping["sad"] = "Sad";
        mapping["irritable"] = "Irritable";
        mapping["tired"] = "Tired";
        mapping["anxious"] = "Anxious";
        mapping["energetic"] = "Energetic";
        mapping["romantic"] = "Romantic";
        mapping["confident"] = "Confident";
        mapping["emotional"] = "Emotional";
        mapping["calm"] = "Calm";
        mapping["moody"] = "Moody";
        return mapping;
      };

      const flowMapping = buildFlowMapping();
      const moodMapping = buildMoodMapping();

      // Migrate entries
      const migratedEntries: EntriesMap = {};
      let migrationCount = 0;

      Object.entries(entries).forEach(([dateKey, entry]) => {
        if (!entry || typeof entry !== "object") return;

        const migratedEntry: Entry = { ...entry };

        // Migrate flow value (lowercase -> Title Case)
        if (entry.flow && typeof entry.flow === "string") {
          const mappedFlow = flowMapping[entry.flow.toLowerCase()];
          if (mappedFlow && mappedFlow !== entry.flow) {
            migratedEntry.flow = mappedFlow;
            migrationCount++;
          } else if (!mappedFlow) {
            // If no mapping found, just title case it
            migratedEntry.flow = toTitleCase(entry.flow);
          }
        }

        // Migrate mood values (lowercase -> Title Case)
        if (Array.isArray(entry.mood)) {
          migratedEntry.mood = entry.mood.map((m) => {
            if (typeof m !== "string") return m;
            const mappedMood = moodMapping[m.toLowerCase()];
            if (mappedMood) {
              if (mappedMood !== m) migrationCount++;
              return mappedMood;
            }
            return toTitleCase(m);
          });
        }

        // Symptoms are already in correct format (strings)
        // Weight is stored as string, no change needed

        migratedEntries[dateKey] = migratedEntry;
      });

      if (migrationCount > 0) {
        console.log(`Migrated ${migrationCount} values from legacy format`);
      }

      // Build the final imported data
      const importedData: StorageData = {
        userSettings: migratedSettings,
        entries: migratedEntries,
      };

      console.log(
        "Import successful, entry count:",
        Object.keys(migratedEntries).length,
      );
      setData(importedData);
      return { success: true, entryCount: Object.keys(migratedEntries).length };
    } catch (error) {
      console.error("Error importing data:", error);
      return {
        success: false,
        error: (error as Error).message || "Unknown import error",
      };
    }
  }, []);

  // Clear all data
  const clearAllData = useCallback(() => {
    setData(DEFAULT_DATA);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    data,
    userSettings: data.userSettings,
    entries: data.entries,
    getEntry,
    getAllEntries,
    saveEntry,
    deleteEntry,
    updateSettings,
    addCustomOption,
    removeCustomOption,
    exportData,
    importData,
    clearAllData,
  };
}

export default useLocalStorage;
