import { createContext } from "react";

// Types
export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Context
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);
