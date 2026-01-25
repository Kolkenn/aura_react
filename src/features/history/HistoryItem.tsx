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

  const getFlowBadgeProps = (flow?: string) => {
    const normalize = (f: string) => f.toLowerCase();
    const style: React.CSSProperties = { color: "#ffffff", border: "none" };

    switch (normalize(flow || "")) {
      case "spotting":
        style.backgroundColor = "var(--flow-spotting)";
        break;
      case "light":
        style.backgroundColor = "var(--flow-light)";
        break;
      case "medium":
        style.backgroundColor = "var(--flow-medium)";
        break;
      case "heavy":
        style.backgroundColor = "var(--flow-heavy)";
        break;
      case "v. heavy":
        style.backgroundColor = "var(--flow-v-heavy)";
        break;
      case "clotting":
        style.backgroundColor = "var(--flow-clotting)";
        break;
      default:
        return { className: "badge badge-ghost gap-1" };
    }
    return { className: "badge gap-1", style };
  };

  return (
    <button
      onClick={() => onClick(dateKey)}
      className="w-full card card-compact bg-base-100 hover:bg-base-200 transition-all duration-200 text-left mb-2 shadow-sm border border-base-content/10"
    >
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-base-content text-sm">
              {formattedDate}
            </h3>

            {/* Entry Details */}
            <div className="flex flex-wrap gap-2 mt-3">
              {/* Flow */}
              {entry.flow && entry.flow !== "None" && (
                <span {...getFlowBadgeProps(entry.flow)}>
                  <Droplet size={12} />
                  {entry.flow}
                </span>
              )}

              {/* Weight */}
              {entry.weight && (
                <span className="badge badge-secondary gap-1">
                  <Scale size={12} />
                  {entry.weight} lbs
                </span>
              )}

              {/* Moods */}
              {entry.mood && entry.mood.length > 0 && (
                <span className="badge badge-warning gap-1">
                  <Brain size={12} />
                  {entry.mood.length} mood{entry.mood.length > 1 ? "s" : ""}
                </span>
              )}

              {/* Symptoms */}
              {entry.symptoms && entry.symptoms.length > 0 && (
                <span className="badge badge-info gap-1">
                  <Activity size={12} />
                  {entry.symptoms.length} symptom
                  {entry.symptoms.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Mood & Symptom Details */}
            <div className="mt-2 space-y-1">
              {entry.mood && entry.mood.length > 0 && (
                <p className="text-xs text-base-content/70">
                  <span className="text-warning font-medium">Moods:</span>{" "}
                  {entry.mood.join(", ")}
                </p>
              )}
              {entry.symptoms && entry.symptoms.length > 0 && (
                <p className="text-xs text-base-content/70">
                  <span className="text-info font-medium">Symptoms:</span>{" "}
                  {entry.symptoms.join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default HistoryItem;
