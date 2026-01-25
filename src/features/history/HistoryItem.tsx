import { format, parseISO } from "date-fns";
import { Droplet, Brain, Activity, Scale } from "lucide-react";
import type { Entry } from "../../types";

interface HistoryItemProps {
  dateKey: string;
  entry: Entry;
  onClick: (dateKey: string) => void;
}

/**
 * Individual history item component
 */
const HistoryItem = ({ dateKey, entry, onClick }: HistoryItemProps) => {
  const date = parseISO(dateKey);
  const formattedDate = format(date, "EEEE, MMMM d, yyyy");

  const getFlowColor = (flow?: string) => {
    switch (flow?.toLowerCase()) {
      case "spotting":
        return "bg-[var(--flow-spotting)] text-gray-800";
      case "light":
        return "bg-[var(--flow-light)] text-gray-800";
      case "medium":
        return "bg-[var(--flow-medium)] text-white";
      case "heavy":
        return "bg-[var(--flow-heavy)] text-white";
      default:
        return "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]";
    }
  };

  return (
    <button
      onClick={() => onClick(dateKey)}
      className="w-full card hover:border-(--color-primary) transition-all duration-200 text-left mb-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-(--text-primary) text-sm">
            {formattedDate}
          </h3>

          {/* Entry Details */}
          <div className="flex flex-wrap gap-2 mt-3">
            {/* Flow */}
            {entry.flow && entry.flow !== "None" && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getFlowColor(entry.flow)}`}
              >
                <Droplet size={12} />
                {entry.flow}
              </span>
            )}

            {/* Weight */}
            {entry.weight && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#a855f7]/20 text-[#a855f7]">
                <Scale size={12} />
                {entry.weight} lbs
              </span>
            )}

            {/* Moods */}
            {entry.mood && entry.mood.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#fbbf24]/20 text-[#fbbf24]">
                <Brain size={12} />
                {entry.mood.length} mood{entry.mood.length > 1 ? "s" : ""}
              </span>
            )}

            {/* Symptoms */}
            {entry.symptoms && entry.symptoms.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#06b6d4]/20 text-[#06b6d4]">
                <Activity size={12} />
                {entry.symptoms.length} symptom
                {entry.symptoms.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Mood & Symptom Details */}
          <div className="mt-2 space-y-1">
            {entry.mood && entry.mood.length > 0 && (
              <p className="text-xs text-(--text-secondary)">
                <span className="text-[#fbbf24]">Moods:</span>{" "}
                {entry.mood.join(", ")}
              </p>
            )}
            {entry.symptoms && entry.symptoms.length > 0 && (
              <p className="text-xs text-(--text-secondary)">
                <span className="text-[#06b6d4]">Symptoms:</span>{" "}
                {entry.symptoms.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default HistoryItem;
