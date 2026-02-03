import { useContext } from "react";
import type { ThemeContextValue } from "../context/theme-context";
import { ThemeContext } from "../context/theme-context";

// Hook to use theme context
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Helper hooks for specific theme values
export const useResolvedTheme = (): "light" | "dark" => {
  const { resolvedTheme } = useTheme();
  return resolvedTheme;
};

export const useIsDarkMode = (): boolean => {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark";
};

export const useIsLightMode = (): boolean => {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "light";
};
