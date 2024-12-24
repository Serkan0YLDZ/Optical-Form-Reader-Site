"use client"

import { Theme } from '@radix-ui/themes';
import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  isDarkMode: true,
  toggleTheme: () => {},
});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    setIsDarkMode(storedTheme ? storedTheme === 'dark' : true);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <Theme 
        appearance={isDarkMode ? "dark" : "light"}
        accentColor="blue" 
        grayColor="slate" 
        panelBackground="solid" 
        scaling="100%"
        radius="large"
      >
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
} 