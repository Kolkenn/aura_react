import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  getDay,
  addDays,
  parseISO,
  differenceInDays,
} from "date-fns";

/**
 * Calculate predicted period start dates based on last flow entry and cycle length
 */
export function calculatePredictedDates(
  entries,
  averageCycleLength,
  monthDate,
) {
  const flowEntries = Object.entries(entries)
    .filter(([_, entry]) => entry.flow && entry.flow !== "None")
    .map(([date]) => parseISO(date))
    .sort((a, b) => b - a);

  if (flowEntries.length === 0) return [];

  // Find the start of the last period (first day of consecutive flow)
  let lastPeriodStart = flowEntries[0];
  for (let i = 1; i < flowEntries.length; i++) {
    const diff = differenceInDays(flowEntries[i - 1], flowEntries[i]);
    if (diff === 1) {
      lastPeriodStart = flowEntries[i];
    } else {
      break;
    }
  }

  // Calculate predicted dates
  const predictions = [];
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);

  // Generate predictions for up to 6 cycles ahead
  for (let cycle = 1; cycle <= 6; cycle++) {
    const predictedStart = addDays(lastPeriodStart, averageCycleLength * cycle);

    // Add 5 days of predicted flow
    for (let day = 0; day < 5; day++) {
      const predictedDay = addDays(predictedStart, day);
      if (predictedDay >= monthStart && predictedDay <= monthEnd) {
        predictions.push(format(predictedDay, "yyyy-MM-dd"));
      }
    }
  }

  return predictions;
}

/**
 * Get days for calendar grid including padding for week alignment
 */
export function getCalendarDays(monthDate) {
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);
  const days = eachDayOfInterval({ start, end });

  // Add padding for days before the first of the month
  const startPadding = getDay(start);
  const paddedDays = [];

  for (let i = 0; i < startPadding; i++) {
    paddedDays.push(null);
  }

  return [...paddedDays, ...days];
}

/**
 * Check if a date has specific entry types
 */
export function getEntryIndicators(entry) {
  if (!entry) return { hasMood: false, hasWeight: false, hasSymptoms: false };

  return {
    hasMood: entry.mood && entry.mood.length > 0,
    hasWeight: entry.weight && entry.weight !== "",
    hasSymptoms: entry.symptoms && entry.symptoms.length > 0,
  };
}

/**
 * Get the flow level for CSS class
 */
export function getFlowLevel(flow) {
  if (!flow || flow === "None") return null;
  return flow.toLowerCase().replace(" ", "-");
}

export { format, isSameMonth, isSameDay, isToday };
