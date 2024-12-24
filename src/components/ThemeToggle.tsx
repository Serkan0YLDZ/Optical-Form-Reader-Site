import { Box } from '@radix-ui/themes';
import { Sun, Moon } from "phosphor-react";

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function ThemeToggle({ isDarkMode, toggleTheme }: ThemeToggleProps) {
  return (
    <Box className="rounded-full overflow-hidden">
      <button
        onClick={toggleTheme}
        className={`p-3 rounded-full transition-colors ${
          isDarkMode 
            ? 'bg-slate-800 hover:bg-slate-700 text-yellow-500' 
            : 'bg-white hover:bg-slate-100 text-slate-700 shadow-md'
        }`}
      >
        {isDarkMode && <Sun size={24} weight="bold" />}
        {!isDarkMode && <Moon size={24} weight="bold" />}
      </button>
    </Box>
  );
} 