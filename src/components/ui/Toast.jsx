import { useEffect, useState } from "react";
import {
  X,
  RefreshCw,
  Wifi,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

/**
 * Individual Toast component with optional auto-dismiss timer
 */
const Toast = ({
  id,
  message,
  type = "info", // info, success, warning, update
  icon: CustomIcon,
  action,
  actionLabel = "Action",
  onDismiss,
  autoDismiss = false,
  autoDismissTime = 4000,
}) => {
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!autoDismiss) return;

    const startTime = Date.now();
    const endTime = startTime + autoDismissTime;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / autoDismissTime) * 100;
      setProgress(newProgress);

      if (remaining <= 0) {
        handleDismiss();
      }
    };

    const interval = setInterval(updateProgress, 50);
    return () => clearInterval(interval);
  }, [autoDismiss, autoDismissTime]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss?.(id);
    }, 200);
  };

  const getIcon = () => {
    if (CustomIcon) return CustomIcon;
    switch (type) {
      case "success":
        return Wifi;
      case "update":
        return RefreshCw;
      case "warning":
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "update":
        return "text-pink-500";
      case "warning":
        return "text-amber-500";
      default:
        return "text-blue-500";
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "update":
        return "bg-pink-500";
      case "warning":
        return "bg-amber-500";
      default:
        return "bg-blue-500";
    }
  };

  const Icon = getIcon();

  return (
    <div
      className={`
        glass-strong rounded-xl overflow-hidden shadow-lg
        transform transition-all duration-200
        ${isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}
      `}
    >
      <div className="p-4 flex items-center gap-3">
        <Icon size={20} className={getIconColor()} />
        <span className="text-sm text-white flex-1">{message}</span>

        <div className="flex items-center gap-2">
          {action && (
            <button
              onClick={action}
              className="px-3 py-1.5 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors"
            >
              {actionLabel}
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Dismiss"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Auto-dismiss progress bar */}
      {autoDismiss && (
        <div className="h-1 bg-white/10">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Toast Container - manages stacking of multiple toasts
 */
const ToastContainer = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};

export { Toast, ToastContainer };
export default Toast;
