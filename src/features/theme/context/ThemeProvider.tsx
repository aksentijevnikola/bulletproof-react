import type { ReactNode } from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import type { ThemeContextValue, Theme } from "./theme-context";
import { ThemeContext } from "./theme-context";

// Constants
const THEME_STORAGE_KEY = "theme";
const THEME_ATTRIBUTE = "data-theme";

const applyTheme = (resolvedTheme: "light" | "dark"): void => {
  // SSR safety check
  if (globalThis.window === undefined) return;

  const root = document.documentElement;
  const classList = root.classList;

  // Apply or remove Tailwind dark mode class
  if (resolvedTheme === "dark") {
    classList.add("dark");
  } else {
    classList.remove("dark");
  }

  // Set data attribute for custom styling if needed
  root.setAttribute(THEME_ATTRIBUTE, resolvedTheme);
};

const getStoredTheme = (): Theme => {
  // SSR safety check
  if (globalThis.window === undefined) return "light";

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    // Validate that stored value is a valid theme
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch (error) {
    console.warn("Failed to read theme from localStorage:", error);
  }

  return "light"; // Default fallback
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize theme state from localStorage or default
  const [themeState, setThemeState] = useState<Theme>(getStoredTheme);

  // Resolved theme (currently same as theme, but extensible for future features like system preference)
  const resolvedTheme: "light" | "dark" = useMemo(
    () => themeState,
    [themeState],
  );

  // Apply theme to DOM when resolvedTheme changes
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme): void => {
    setThemeState(newTheme);
    // Persist to localStorage with error handling
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.warn("Failed to save theme to localStorage:", error);
    }
  }, []);

  const toggleTheme = useCallback((): void => {
    const newTheme: Theme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  const contextValue: ThemeContextValue = useMemo(
    () => ({
      theme: themeState,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [themeState, resolvedTheme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
