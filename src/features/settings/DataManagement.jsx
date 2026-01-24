import { useState, useRef } from "react";
import {
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Card, Button, Modal } from "../../components/ui";

/**
 * Data Management component for import/export/clear operations
 */
const DataManagement = ({ onExport, onImport, onClear, entryCount }) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    onExport();
    setImportStatus({
      type: "success",
      message: "Data exported successfully!",
    });
    setTimeout(() => setImportStatus(null), 3000);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = onImport(text);

      if (result.success) {
        setImportStatus({
          type: "success",
          message: "Data imported successfully!",
        });
      } else {
        setImportStatus({
          type: "error",
          message: result.error || "Import failed",
        });
      }
    } catch (error) {
      setImportStatus({ type: "error", message: "Failed to read file" });
    }

    // Reset file input
    e.target.value = "";
    setTimeout(() => setImportStatus(null), 3000);
  };

  const handleClear = () => {
    onClear();
    setShowClearConfirm(false);
    setImportStatus({ type: "success", message: "All data cleared" });
    setTimeout(() => setImportStatus(null), 3000);
  };

  return (
    <>
      <Card>
        <h3 className="font-medium text-[var(--text-primary)] mb-4">
          Data Management
        </h3>

        <div className="space-y-3">
          {/* Export Button */}
          <Button
            onClick={handleExport}
            variant="secondary"
            className="w-full justify-start"
          >
            <Download size={18} />
            Export Data (JSON)
          </Button>

          {/* Import Button */}
          <Button
            onClick={handleImportClick}
            variant="secondary"
            className="w-full justify-start"
          >
            <Upload size={18} />
            Import Data (JSON)
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Clear Data Button */}
          <Button
            onClick={() => setShowClearConfirm(true)}
            variant="danger"
            className="w-full justify-start"
          >
            <Trash2 size={18} />
            Clear All Data
          </Button>

          {/* Entry Count */}
          <p className="text-xs text-[var(--text-muted)] text-center pt-2">
            {entryCount} entries currently stored
          </p>

          {/* Status Message */}
          {importStatus && (
            <div
              className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                importStatus.type === "success"
                  ? "bg-[var(--color-success)]/20 text-[var(--color-success)]"
                  : "bg-[var(--color-danger)]/20 text-[var(--color-danger)]"
              }`}
            >
              {importStatus.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
              {importStatus.message}
            </div>
          )}
        </div>
      </Card>

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear All Data?"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-danger)]/10">
            <AlertTriangle
              size={24}
              className="text-[var(--color-danger)] flex-shrink-0"
            />
            <div>
              <p className="text-[var(--text-primary)] font-medium">
                This action cannot be undone
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                All your entries, settings, and history will be permanently
                deleted.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowClearConfirm(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleClear} variant="danger" className="flex-1">
              Delete Everything
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DataManagement;
