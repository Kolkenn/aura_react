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
    <nav className="sticky bottom-0 z-40 glass-strong">
      <div className="flex items-center justify-around py-1 px-2">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 min-w-[70px] ${
                isActive
                  ? "text-(--color-primary) bg-(--bg-tertiary)"
                  : "text-(--text-muted) hover:text-(--text-secondary)"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={
                  isActive ? "drop-shadow-[0_0_8px_var(--color-primary)]" : ""
                }
              />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
