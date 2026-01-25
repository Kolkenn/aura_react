import { useState } from "react";
import { Palette, ChevronDown } from "lucide-react";
import { Card } from "../../components/ui";

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const THEMES = [
  // Light Themes
  { id: "cupcake", name: "Cupcake", type: "light" },
  { id: "bumblebee", name: "Bumblebee", type: "light" },
  { id: "emerald", name: "Emerald", type: "light" },
  { id: "corporate", name: "Corporate", type: "light" },
  { id: "retro", name: "Retro", type: "light" },
  { id: "valentine", name: "Valentine", type: "light" },
  { id: "pastel", name: "Pastel", type: "light" },

  // Dark Themes
  { id: "synthwave", name: "Synthwave", type: "dark" },
  { id: "halloween", name: "Halloween", type: "dark" },
  { id: "aqua", name: "Aqua", type: "dark" },
  { id: "luxury", name: "Luxury", type: "dark" },
  { id: "dracula", name: "Dracula", type: "dark" },
];

const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Find current theme name for display
  const currentThemeName =
    THEMES.find((t) => t.id === currentTheme)?.name || currentTheme;

  // Group themes
  const lightThemes = THEMES.filter((t) => t.type === "light");
  const darkThemes = THEMES.filter((t) => t.type === "dark");

  const ThemeButton = ({ theme }: { theme: (typeof THEMES)[0] }) => (
    <button
      onClick={() => onThemeChange(theme.id)}
      className={`
        flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left w-full
        ${
          currentTheme === theme.id
            ? "bg-primary text-primary-content ring-2 ring-primary ring-offset-2 ring-offset-base-100 font-semibold"
            : "bg-base-200 text-base-content hover:bg-base-300"
        }
      `}
    >
      <span>{theme.name}</span>

      {/* Color Preview using data-theme to resolve actual theme colors */}
      <div
        data-theme={theme.id}
        className="flex gap-1 p-0.5 rounded-sm bg-base-100/10 border border-base-content/10"
        aria-hidden="true"
      >
        <div className="w-2 h-4 bg-primary rounded-sm" />
        <div className="w-2 h-4 bg-secondary rounded-sm" />
        <div className="w-2 h-4 bg-accent rounded-sm" />
        <div className="w-2 h-4 bg-neutral rounded-sm" />
      </div>
    </button>
  );

  return (
    <Card>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Palette size={18} className="text-primary" />
          <div className="flex flex-col items-start">
            <h3 className="font-medium text-base-content">Theme</h3>
            {!isOpen && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-base-content/60">
                  Current Theme - {currentThemeName}
                </span>
                <div
                  data-theme={currentTheme}
                  className="flex gap-1 p-0.5 rounded-sm bg-base-100/10 border border-base-content/10"
                  aria-hidden="true"
                >
                  <div className="w-1.5 h-3 bg-primary rounded-sm" />
                  <div className="w-1.5 h-3 bg-secondary rounded-sm" />
                  <div className="w-1.5 h-3 bg-accent rounded-sm" />
                  <div className="w-1.5 h-3 bg-neutral rounded-sm" />
                </div>
              </div>
            )}
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`text-base-content/60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 animate-fade-in">
          {/* Light Themes */}
          <div>
            <h4 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 ml-1">
              Light Themes
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {lightThemes.map((theme) => (
                <ThemeButton key={theme.id} theme={theme} />
              ))}
            </div>
          </div>

          {/* Dark Themes */}
          <div>
            <h4 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 ml-1">
              Dark Themes
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {darkThemes.map((theme) => (
                <ThemeButton key={theme.id} theme={theme} />
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ThemeSelector;
