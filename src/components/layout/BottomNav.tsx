import { Calendar, Clock, Settings, type LucideIcon } from "lucide-react";
import type { ViewType } from "../../types";

interface NavItem {
  id: ViewType;
  label: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

/**
 * Bottom navigation component for view switching
 */
const BottomNav = ({ activeView, onViewChange }: BottomNavProps) => {
  const navItems: NavItem[] = [
    { id: "history", label: "History", icon: Clock },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="dock">
      {navItems.map(({ id, label, icon: Icon }) => {
        const isActive = activeView === id;
        return (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`${isActive ? "active text-primary bg-primary/10" : "text-base-content/60 hover:text-base-content"} flex flex-col items-center justify-center gap-1 p-2`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="dock-label text-xs font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
