import { useEffect, useCallback, type ReactNode } from "react";
import { X } from "lucide-react";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  size?: ModalSize;
}

/**
 * Modal component with backdrop and animations
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  size = "md",
}: ModalProps) => {
  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`} role="dialog">
      <div
        className={`modal-box ${sizeClasses[size] || "max-w-md"} relative flex flex-col max-h-[90vh] p-0 overflow-hidden`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-5 border-b border-base-200 shrink-0">
            {title && <h2 className="text-lg font-bold">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 min-h-0">{children}</div>

        {/* Footer (always visible) */}
        {footer && (
          <div className="p-5 border-t border-base-200 shrink-0">{footer}</div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </div>
  );
};

export default Modal;
