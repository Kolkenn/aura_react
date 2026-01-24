import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "cycle_tracker_mvp_data";

const DEFAULT_DATA = {
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
export function useLocalStorage() {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
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
    (dateKey) => {
      return data.entries[dateKey] || null;
    },
    [data.entries],
  );

  // Get all entries
  const getAllEntries = useCallback(() => {
    return data.entries;
  }, [data.entries]);

  // Upsert (create or update) an entry
  const saveEntry = useCallback((dateKey, entryData) => {
    setData((prev) => {
      const existingEntry = prev.entries[dateKey] || {};
      const updatedEntry = { ...existingEntry, ...entryData };

      // Remove empty fields
      Object.keys(updatedEntry).forEach((key) => {
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
  }, []);

  // Delete an entry
  const deleteEntry = useCallback((dateKey) => {
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
  const updateSettings = useCallback((newSettings) => {
    setData((prev) => ({
      ...prev,
      userSettings: {
        ...prev.userSettings,
        ...newSettings,
      },
    }));
  }, []);

  // Add a custom option (mood or symptom)
  const addCustomOption = useCallback((type, option) => {
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
  }, []);

  // Remove a custom option
  const removeCustomOption = useCallback((type, option) => {
    const key = type === "mood" ? "moodOptions" : "symptomOptions";
    setData((prev) => ({
      ...prev,
      userSettings: {
        ...prev.userSettings,
        [key]: prev.userSettings[key].filter((o) => o !== option),
      },
    }));
  }, []);

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

  // Import data from JSON
  const importData = useCallback((jsonData) => {
    try {
      const parsed =
        typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

      // Validate structure
      if (!parsed.entries || typeof parsed.entries !== "object") {
        throw new Error("Invalid data format: missing entries object");
      }

      // Merge imported data with defaults
      const importedData = {
        userSettings: {
          ...DEFAULT_DATA.userSettings,
          ...parsed.userSettings,
        },
        entries: parsed.entries,
      };

      setData(importedData);
      return { success: true };
    } catch (error) {
      console.error("Error importing data:", error);
      return { success: false, error: error.message };
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
