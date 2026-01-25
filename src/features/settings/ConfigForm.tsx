import { useState, type ChangeEvent } from "react";
import { Plus, X, Brain, Activity } from "lucide-react";
import { Card, Button, Input } from "../../components/ui";
import type { UserSettings } from "../../types";

import ThemeSelector from "./ThemeSelector";

interface ConfigFormProps {
  userSettings: UserSettings;
  onAddOption: (type: "mood" | "symptom", option: string) => void;
  onRemoveOption: (type: "mood" | "symptom", option: string) => void;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

/**
 * Configuration form for managing custom moods and symptoms
 */
const ConfigForm = ({
  userSettings,
  onAddOption,
  onRemoveOption,
  onUpdateSettings,
}: ConfigFormProps) => {
  const [newMood, setNewMood] = useState("");
  const [newSymptom, setNewSymptom] = useState("");
  const [cycleLength, setCycleLength] = useState(
    userSettings.averageCycleLength?.toString() || "28",
  );

  const handleAddMood = () => {
    if (newMood.trim()) {
      onAddOption("mood", newMood.trim());
      setNewMood("");
    }
  };

  const handleAddSymptom = () => {
    if (newSymptom.trim()) {
      onAddOption("symptom", newSymptom.trim());
      setNewSymptom("");
    }
  };

  const handleCycleLengthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCycleLength(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 60) {
      onUpdateSettings({ averageCycleLength: numValue });
    }
  };

  return (
    <div className="space-y-4">
      {/* Theme Selection */}
      <ThemeSelector
        currentTheme={userSettings.theme || "light"}
        onThemeChange={(theme) => onUpdateSettings({ theme })}
      />

      {/* Cycle Length */}
      <Card>
        <h3 className="font-medium text-base-content mb-3">Cycle Settings</h3>
        <div className="flex items-center gap-3">
          <label className="text-sm text-base-content/70">
            Average Cycle Length
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={cycleLength}
            onChange={handleCycleLengthChange}
            className="input input-bordered w-24 text-center"
          />
          <span className="text-sm text-base-content/60">days</span>
        </div>
      </Card>

      {/* Mood Options */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Brain size={18} className="text-warning" />
          <h3 className="font-medium text-base-content">Mood Options</h3>
        </div>

        {/* Add New Mood */}
        <div className="flex gap-2 mb-3">
          <Input
            value={newMood}
            onChange={(e) => setNewMood(e.target.value)}
            placeholder="Add custom mood..."
            onKeyDown={(e) => e.key === "Enter" && handleAddMood()}
          />
          <Button onClick={handleAddMood} variant="secondary" size="sm">
            <Plus size={16} />
          </Button>
        </div>

        {/* Mood Chips */}
        <div className="flex flex-wrap gap-2">
          {userSettings.moodOptions?.map((mood) => (
            <span
              key={mood}
              className="badge badge-warning badge-outline gap-1 h-auto py-1"
            >
              {mood}
              <button
                onClick={() => onRemoveOption("mood", mood)}
                className="ml-1 hover:text-error transition-colors"
                aria-label={`Remove ${mood}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      </Card>

      {/* Symptom Options */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Activity size={18} className="text-info" />
          <h3 className="font-medium text-base-content">Symptom Options</h3>
        </div>

        {/* Add New Symptom */}
        <div className="flex gap-2 mb-3">
          <Input
            value={newSymptom}
            onChange={(e) => setNewSymptom(e.target.value)}
            placeholder="Add custom symptom..."
            onKeyDown={(e) => e.key === "Enter" && handleAddSymptom()}
          />
          <Button onClick={handleAddSymptom} variant="secondary" size="sm">
            <Plus size={16} />
          </Button>
        </div>

        {/* Symptom Chips */}
        <div className="flex flex-wrap gap-2">
          {userSettings.symptomOptions?.map((symptom) => (
            <span
              key={symptom}
              className="badge badge-info badge-outline gap-1 h-auto py-1"
            >
              {symptom}
              <button
                onClick={() => onRemoveOption("symptom", symptom)}
                className="ml-1 hover:text-error transition-colors"
                aria-label={`Remove ${symptom}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ConfigForm;
