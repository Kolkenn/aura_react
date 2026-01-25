import { useMemo } from "react";
import {
  subDays,
  subMonths,
  parseISO,
  format,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";
import type { EntriesMap } from "../../types";

export interface WeightDataPoint {
  date: Date;
  dateKey: string;
  weight: number;
}

export interface WeightStats {
  current: string | null;
  min: string | null;
  max: string | null;
  avg: string | null;
  trend: "up" | "down" | "stable" | null;
}

export type TimeFrame = "30d" | "90d" | "6m";

/**
 * Filter entries by date range and extract weight data for charts
 */
export function useWeightData(
  entries: EntriesMap,
  timeframe: TimeFrame,
): WeightDataPoint[] {
  return useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case "30d":
        startDate = subDays(now, 30);
        break;
      case "90d":
        startDate = subDays(now, 90);
        break;
      case "6m":
        startDate = subMonths(now, 6);
        break;
      default:
        startDate = subDays(now, 30);
    }

    const weightEntries = Object.entries(entries)
      .filter(([dateKey, entry]) => {
        if (!entry.weight) return false; // Skip entries without weight
        const date = parseISO(dateKey);
        return isAfter(date, startOfDay(startDate)) && isBefore(date, now);
      })
      .map(([dateKey, entry]) => ({
        // Map entries to WeightDataPoint
        date: parseISO(dateKey),
        dateKey,
        weight: parseFloat(entry.weight || "0"),
      }))
      .filter((item) => !isNaN(item.weight)) // Filter out invalid weights
      .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by date

    return weightEntries;
  }, [entries, timeframe]);
}

/**
 * Calculate weight statistics
 */
export function calculateWeightStats(
  weightData: WeightDataPoint[],
): WeightStats {
  if (weightData.length === 0) {
    // Return null values if no data
    return { current: null, min: null, max: null, avg: null, trend: null };
  }

  const weights = weightData.map((d) => d.weight); // Extract weights from data
  const current = weights[weights.length - 1]; // Get last weight as current
  const min = Math.min(...weights); // Find minimum weight
  const max = Math.max(...weights); // Find maximum weight
  const avg = weights.reduce((a, b) => a + b, 0) / weights.length; // Calculate average weight

  // Calculate trend (compare first half vs second half average)
  let trend: "up" | "down" | "stable" | null = null;
  if (weights.length >= 4) {
    // Ensure we have enough data points
    const midpoint = Math.floor(weights.length / 2); // Split data into two halves
    const firstHalfAvg =
      weights.slice(0, midpoint).reduce((a, b) => a + b, 0) / midpoint; // Calculate average of first half
    const secondHalfAvg =
      weights.slice(midpoint).reduce((a, b) => a + b, 0) /
      (weights.length - midpoint); // Calculate average of second half
    const diff = secondHalfAvg - firstHalfAvg; // Calculate difference between averages
    if (Math.abs(diff) > 0.5) {
      trend = diff > 0 ? "up" : "down"; // Determine trend based on difference
    } else {
      trend = "stable"; // If difference is small, consider it stable
    }
  }

  return {
    current: current.toFixed(1), // Format current weight to 1 decimal place
    min: min.toFixed(1), // Format minimum weight to 1 decimal place
    max: max.toFixed(1), // Format maximum weight to 1 decimal place
    avg: avg.toFixed(1), // Format average weight to 1 decimal place
    trend,
  };
}

/**
 * Format date labels based on timeframe
 */
export function formatDateLabel(date: Date, timeframe: TimeFrame): string {
  switch (timeframe) {
    case "30d":
      return format(date, "MMM d"); // Format date as "MMM d" (e.g., "Jan 1")
    case "90d":
      return format(date, "MMM d"); // Format date as "MMM d" (e.g., "Jan 1")
    case "6m":
      return format(date, "MMM yyyy"); // Format date as "MMM yyyy" (e.g., "Jan 2022")
    default:
      return format(date, "MMM d"); // Default to "MMM d" format
  }
}
