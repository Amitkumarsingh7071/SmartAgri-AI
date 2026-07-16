import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl glass-panel text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none"
      aria-label="Toggle Theme"
    >
      {darkMode ? (
        <Sun className="h-5 w-5 text-yellow-400 rotate-0 transition-transform duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-blue-600 rotate-0 transition-transform duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
