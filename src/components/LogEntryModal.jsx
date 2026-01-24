import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Droplet, Scale, Brain, Activity, Trash2 } from "lucide-react";
import { Modal, Button, Input, Chip } from "./ui";

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
}) => {
  const [weight, setWeight] = useState("");
  const [flow, setFlow] = useState("None");
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  // Reset form when modal opens or entry changes
  useEffect(() => {
    if (isOpen && dateKey) {
      setWeight(entry?.weight || "");
      setFlow(entry?.flow || "None");
      setSelectedMoods(entry?.mood || []);
      setSelectedSymptoms(entry?.symptoms || []);
    }
  }, [isOpen, dateKey, entry]);

  const handleMoodToggle = (mood) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood],
    );
  };

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom],
    );
  };

  const handleSave = () => {
    onSave(dateKey, {
      weight: weight.trim(),
      flow,
      mood: selectedMoods,
      symptoms: selectedSymptoms,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(dateKey);
    onClose();
  };

  const formattedDate = dateKey
    ? format(parseISO(dateKey), "EEEE, MMMM d, yyyy")
    : "";

  const hasExistingData = entry && Object.keys(entry).length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={formattedDate} size="lg">
      <div className="space-y-6">
        {/* Weight Input */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Scale size={16} className="text-(--color-secondary)" />
            <label className="text-sm font-medium text-(--text-primary)">
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
            <span className="text-sm text-(--text-muted)">lbs</span>
          </div>
        </div>

        {/* Flow Selection */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Droplet size={16} className="text-(--color-primary)" />
            <label className="text-sm font-medium text-(--text-primary)">
              Flow
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {userSettings.flowOptions?.map((option) => (
              <Chip
                key={option}
                active={flow === option}
                onClick={() => setFlow(option)}
              >
                {option}
              </Chip>
            ))}
          </div>
        </div>

        {/* Mood Selection */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain size={16} className="text-(--color-primary)" />
            <label className="text-sm font-medium text-(--text-primary)">
              Mood
            </label>
            {selectedMoods.length > 0 && (
              <span className="text-xs text-(--text-muted)">
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
              >
                {mood}
              </Chip>
            ))}
          </div>
        </div>

        {/* Symptoms Selection */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-(--color-primary)" />
            <label className="text-sm font-medium text-(--text-primary)">
              Symptoms
            </label>
            {selectedSymptoms.length > 0 && (
              <span className="text-xs text-(--text-muted)">
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
              >
                {symptom}
              </Chip>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {hasExistingData && (
            <Button
              onClick={handleDelete}
              variant="danger"
              className="shrink-0"
            >
              <Trash2 size={16} />
            </Button>
          )}
          <Button onClick={onClose} variant="secondary" className="shrink-0">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="primary" className="shrink-0">
            Save Entry
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogEntryModal;
