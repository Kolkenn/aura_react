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

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Calendar Grid component showing monthly view with flow indicators
 */
const CalendarGrid = ({ entries, averageCycleLength, onDayClick }) => {
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

  const handleDayClick = (day) => {
    if (day) {
      onDayClick(format(day, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="card">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>

        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <button
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]"
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
            className="text-center text-xs font-medium text-[var(--text-muted)] py-2"
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
          const flowLevel = entry ? getFlowLevel(entry.flow) : null;
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
              aria-label={`${format(day, "MMMM d, yyyy")}${flowLevel ? `, ${entry.flow} flow` : ""}`}
            >
              <span className="text-sm">{format(day, "d")}</span>

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
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <span className="w-3 h-3 rounded bg-[var(--color-primary)]" />
          <span>Flow</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <span className="w-3 h-3 rounded border-2 border-dashed border-[var(--color-primary)]" />
          <span>Predicted</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
          <span>Mood</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <span className="w-2 h-2 rounded-full bg-[#a855f7]" />
          <span>Weight</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
