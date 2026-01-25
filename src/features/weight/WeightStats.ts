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

export type TimeFrame = "30d" | "6m" | "1y";

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
      case "6m":
        startDate = subMonths(now, 6);
        break;
      case "1y":
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subDays(now, 30);
    }

    const weightEntries = Object.entries(entries)
      .filter(([dateKey, entry]) => {
        if (!entry.weight) return false;
        const date = parseISO(dateKey);
        return isAfter(date, startOfDay(startDate)) && isBefore(date, now);
      })
      .map(([dateKey, entry]) => ({
        date: parseISO(dateKey),
        dateKey,
        weight: parseFloat(entry.weight || "0"),
      }))
      .filter((item) => !isNaN(item.weight))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

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
    return { current: null, min: null, max: null, avg: null, trend: null };
  }

  const weights = weightData.map((d) => d.weight);
  const current = weights[weights.length - 1];
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const avg = weights.reduce((a, b) => a + b, 0) / weights.length;

  // Calculate trend (compare first half vs second half average)
  let trend: "up" | "down" | "stable" | null = null;
  if (weights.length >= 4) {
    const midpoint = Math.floor(weights.length / 2);
    const firstHalfAvg =
      weights.slice(0, midpoint).reduce((a, b) => a + b, 0) / midpoint;
    const secondHalfAvg =
      weights.slice(midpoint).reduce((a, b) => a + b, 0) /
      (weights.length - midpoint);
    const diff = secondHalfAvg - firstHalfAvg;
    if (Math.abs(diff) > 0.5) {
      trend = diff > 0 ? "up" : "down";
    } else {
      trend = "stable";
    }
  }

  return {
    current: current.toFixed(1),
    min: min.toFixed(1),
    max: max.toFixed(1),
    avg: avg.toFixed(1),
    trend,
  };
}

/**
 * Format date labels based on timeframe
 */
export function formatDateLabel(date: Date, timeframe: TimeFrame): string {
  switch (timeframe) {
    case "30d":
      return format(date, "MMM d");
    case "6m":
    case "1y":
      return format(date, "MMM yyyy");
    default:
      return format(date, "MMM d");
  }
}
