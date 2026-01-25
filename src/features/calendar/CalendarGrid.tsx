import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, subMonths, format } from "date-fns";
import {
  getCalendarDays,
  calculatePredictedDates,
  getEntryIndicators,
  getFlowLevel,
  isToday,
} from "./CalendarLogic";
import type { EntriesMap } from "../../types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
  entries: EntriesMap;
  averageCycleLength: number;
  onDayClick: (date: string) => void;
}

/**
 * Calendar Grid component showing monthly view with flow indicators
 */
const CalendarGrid = ({
  entries,
  averageCycleLength,
  onDayClick,
}: CalendarGridProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);

  const predictedDates = useMemo(
    () => calculatePredictedDates(entries, averageCycleLength, currentMonth),
    [entries, averageCycleLength, currentMonth],
  );

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleDayClick = (day: Date | null) => {
    if (day) {
      onDayClick(format(day, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-content/10 p-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="btn btn-sm btn-ghost btn-square"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>

        <h2 className="text-lg font-bold text-primary">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <button
          onClick={handleNextMonth}
          className="btn btn-sm btn-ghost btn-square"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-base-content/60 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateKey = format(day, "yyyy-MM-dd");
          const entry = entries[dateKey];
          const flowLevel = getFlowLevel(entry?.flow);
          const indicators = getEntryIndicators(entry);
          const isPredicted = predictedDates.includes(dateKey) && !flowLevel;
          const isTodayDate = isToday(day);

          return (
            <button
              key={dateKey}
              onClick={() => handleDayClick(day)}
              className={`
                calendar-day
                ${isTodayDate ? "today" : ""}
                ${flowLevel ? `has-flow flow-${flowLevel}` : ""}
                ${isPredicted ? "predicted" : ""}
              `}
              aria-label={`${format(day, "MMMM d, yyyy")}${flowLevel ? `, ${entry?.flow} flow` : ""}`}
            >
              <span className="text-sm z-10">{format(day, "d")}</span>

              {/* Entry Indicator Dots */}
              {(indicators.hasMood ||
                indicators.hasWeight ||
                indicators.hasSymptoms) && (
                <div className="calendar-day-dots">
                  {indicators.hasMood && (
                    <span className="calendar-day-dot mood" />
                  )}
                  {indicators.hasWeight && (
                    <span className="calendar-day-dot weight" />
                  )}
                  {indicators.hasSymptoms && (
                    <span className="calendar-day-dot symptoms" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-base-content/10">
        <div className="flex items-center gap-1.5 text-xs text-base-content/70">
          <div className="flex gap-0.5">
            <span
              className="w-2 h-3 rounded-sm"
              style={{ backgroundColor: "var(--flow-light)" }}
            />
            <span
              className="w-2 h-3 rounded-sm"
              style={{ backgroundColor: "var(--flow-medium)" }}
            />
            <span
              className="w-2 h-3 rounded-sm"
              style={{ backgroundColor: "var(--flow-heavy)" }}
            />
          </div>
          <span>Flow Levels</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-base-content/70">
          <span
            className="w-3 h-3 rounded bg-base-100 border border-current"
            style={{ borderColor: "#fecdd3" }}
          />
          <span>Spotting</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-base-content/70">
          <span className="w-3 h-3 rounded border-2 border-dashed border-primary" />
          <span>Predicted</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-base-content/70">
          <span className="w-2 h-2 rounded-full bg-warning" />
          <span>Mood</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-base-content/70">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          <span>Weight</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-base-content/70">
          <span className="w-2 h-2 rounded-full bg-info" />
          <span>Symptoms</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
