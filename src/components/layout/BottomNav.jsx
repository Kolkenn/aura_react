import { Calendar, BarChart3, Clock, Settings } from "lucide-react";

/**
 * Bottom navigation component for view switching
 */
const BottomNav = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "weight", label: "Weight", icon: BarChart3 },
    { id: "history", label: "History", icon: Clock },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="sticky bottom-0 z-40 glass-strong safe-bottom">
      <div className="flex items-center justify-around py-2 px-2">
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
