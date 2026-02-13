import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Droplet, Scale, Brain, Activity, Trash2 } from "lucide-react";
import { Modal, Button, Input, Chip } from "./ui";
import type { Entry, UserSettings } from "../types";

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateKey: string | null;
  entry: Entry | null;
  userSettings: UserSettings;
  onSave: (dateKey: string, entry: Partial<Entry>) => void;
  onDelete: (dateKey: string) => void;
}

/**
 * Log Entry Modal for adding/editing daily entries
 */
const LogEntryModal = ({
  isOpen,
  onClose,
  dateKey,
  entry,
  userSettings,
  onSave,
  onDelete,
}: LogEntryModalProps) => {
  const [weight, setWeight] = useState(entry?.weight || "");
  const [flow, setFlow] = useState(entry?.flow || "None");
  const [selectedMoods, setSelectedMoods] = useState<string[]>(
    entry?.mood || [],
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    entry?.symptoms || [],
  );

  // Remove the useEffect that synced props to state

  const handleMoodToggle = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood],
    );
  };

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom],
    );
  };

  const handleSave = () => {
    if (!dateKey) return;
    onSave(dateKey, {
      weight: weight.trim(),
      flow,
      mood: selectedMoods,
      symptoms: selectedSymptoms,
    });
    onClose();
  };

  const handleDelete = () => {
    if (!dateKey) return;
    onDelete(dateKey);
    onClose();
  };

  const formattedDate = dateKey
    ? format(parseISO(dateKey), "EEEE, MMMM d, yyyy")
    : "";

  const hasExistingData = entry && Object.keys(entry).length > 0;

  const footerActions = (
    <div className="flex gap-3">
      {hasExistingData && (
        <Button onClick={handleDelete} variant="danger" className="flex-1">
          <Trash2 size={16} />
        </Button>
      )}
      <Button onClick={onClose} variant="secondary" className="flex-1">
        Cancel
      </Button>
      <Button onClick={handleSave} variant="primary" className="flex-1">
        Save Entry
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={formattedDate}
      size="lg"
      footer={footerActions}
    >
      <div className="space-y-6">
        {/* Weight Input */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Scale size={16} className="text-secondary" />
            <label className="text-sm font-medium text-base-content">
              Weight
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.1"
              min="0"
              max="999"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight..."
              className="flex-1"
            />
            <span className="text-sm text-base-content/60">lbs</span>
          </div>
        </div>

        {/* Flow Selection */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Droplet size={16} className="text-primary" />
            <label className="text-sm font-medium text-base-content">
              Flow
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {userSettings.flowOptions?.map((option) => (
              <Chip
                key={option}
                active={flow === option}
                onClick={() => setFlow(option)}
                className={flow === option ? "badge-primary" : ""}
              >
                {option}
              </Chip>
            ))}
          </div>
        </div>

        {/* Mood Selection */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain size={16} className="text-warning" />
            <label className="text-sm font-medium text-base-content">
              Mood
            </label>
            {selectedMoods.length > 0 && (
              <span className="text-xs text-base-content/60">
                ({selectedMoods.length} selected)
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {userSettings.moodOptions?.map((mood) => (
              <Chip
                key={mood}
                active={selectedMoods.includes(mood)}
                onClick={() => handleMoodToggle(mood)}
                className={selectedMoods.includes(mood) ? "badge-warning" : ""}
              >
                {mood}
              </Chip>
            ))}
          </div>
        </div>

        {/* Symptoms Selection */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-info" />
            <label className="text-sm font-medium text-base-content">
              Symptoms
            </label>
            {selectedSymptoms.length > 0 && (
              <span className="text-xs text-base-content/60">
                ({selectedSymptoms.length} selected)
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {userSettings.symptomOptions?.map((symptom) => (
              <Chip
                key={symptom}
                active={selectedSymptoms.includes(symptom)}
                onClick={() => handleSymptomToggle(symptom)}
                className={
                  selectedSymptoms.includes(symptom) ? "badge-info" : ""
                }
              >
                {symptom}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LogEntryModal;
