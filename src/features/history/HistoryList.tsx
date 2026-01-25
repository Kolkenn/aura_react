import { useMemo } from "react";
import { parseISO } from "date-fns";
import { Clock } from "lucide-react";
import HistoryItem from "./HistoryItem";
import type { EntriesMap } from "../../types";

interface HistoryListProps {
  entries: EntriesMap;
  onEntryClick: (dateKey: string) => void;
}

/**
 * History List component showing all entries sorted by date
 */
const HistoryList = ({ entries, onEntryClick }: HistoryListProps) => {
  const sortedEntries = useMemo(() => {
    return Object.entries(entries)
      .map(([dateKey, entry]) => ({ dateKey, entry }))
      .sort(
        (a, b) => parseISO(b.dateKey).getTime() - parseISO(a.dateKey).getTime(),
      );
  }, [entries]);

  if (sortedEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4">
          <Clock size={28} className="text-base-content/40" />
        </div>
        <h3 className="text-lg font-medium text-base-content/70 mb-2">
          No entries yet
        </h3>
        <p className="text-sm text-base-content/50 max-w-xs">
          Start tracking by tapping on any day in the calendar to log your first
          entry.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-secondary" />
          <h2 className="font-semibold text-base-content">History</h2>
        </div>
        <span className="text-sm text-base-content/60">
          {sortedEntries.length} entr{sortedEntries.length === 1 ? "y" : "ies"}
        </span>
      </div>

      {/* Entry List */}
      <div className="space-y-2">
        {sortedEntries.map(({ dateKey, entry }) => (
          <HistoryItem
            key={dateKey}
            dateKey={dateKey}
            entry={entry}
            onClick={onEntryClick}
          />
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
