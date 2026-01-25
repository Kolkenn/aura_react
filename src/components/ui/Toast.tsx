import { useEffect, useState, type ComponentType } from "react";
import {
  X,
  RefreshCw,
  Wifi,
  AlertCircle,
  Info,
  type LucideProps,
} from "lucide-react";
import type {
  Toast as ToastType,
  ToastType as ToastVariant,
} from "../../types";

interface ToastProps {
  id: string;
  message: string;
  type?: ToastVariant;
  icon?: ComponentType<LucideProps>;
  action?: () => void;
  actionLabel?: string;
  onDismiss?: (id: string) => void;
  autoDismiss?: boolean;
  autoDismissTime?: number;
}

/**
 * Individual Toast component with optional auto-dismiss timer
 */
const Toast = ({
  id,
  message,
  type = "info",
  icon: CustomIcon,
  action,
  actionLabel = "Action",
  onDismiss,
  autoDismiss = false,
  autoDismissTime = 4000,
}: ToastProps) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDismiss, autoDismissTime]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss?.(id);
    }, 200);
  };

  const getIcon = (): ComponentType<LucideProps> => {
    if (CustomIcon) return CustomIcon;
    switch (type) {
      case "success":
        return Wifi;
      case "update":
        return RefreshCw;
      case "error":
        return AlertCircle;
      default:
        return Info;
    }
  };

  // Map toast types to DaisyUI alert classes
  const getAlertClass = () => {
    switch (type) {
      case "success":
        return "alert-success";
      case "error":
        return "alert-error";
      case "update":
        return "alert-info"; // using info for updates
      default:
        return "alert-info";
    }
  };

  const Icon = getIcon();

  return (
    <div
      className={`
        alert ${getAlertClass()} shadow-lg
        transform transition-all duration-200
        ${isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"}
        flex items-center gap-2
      `}
    >
      <Icon size={20} />
      <span className="flex-1 text-sm">{message}</span>

      <div className="flex gap-2">
        {action && (
          <button onClick={action} className="btn btn-xs btn-primary">
            {actionLabel}
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="btn btn-xs btn-ghost btn-circle"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      {autoDismiss && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
          <div
            className="h-full bg-black/20 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

/**
 * Toast Container - manages stacking of multiple toasts
 */
const ToastContainer = ({ toasts, onDismiss }: ToastContainerProps) => {
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
