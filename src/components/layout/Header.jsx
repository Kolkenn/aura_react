import { Moon } from "lucide-react";

/**
 * Header component with app branding
 */
const Header = () => {
  return (
    <header className="sticky top-0 z-40 glass-strong safe-top">
      <div className="flex items-center justify-center py-4 px-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center animate-pulse-glow">
            <Moon size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">Aura</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
