import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";

import { useTheme } from "../theme-provider.tsx";

const nextTheme = { system: "light", light: "dark", dark: "system" } as const;
const themeLabel = { system: "System", light: "Light", dark: "Dark" } as const;

export function ThemeControl() {
  const { theme, setTheme } = useTheme();
  const Icon = theme === "light" ? SunIcon : theme === "dark" ? MoonIcon : MonitorIcon;

  return (
    <Button
      variant="outline"
      size="icon"
      type="button"
      aria-label={`Theme: ${themeLabel[theme]}`}
      title="Switch color theme"
      onClick={() => setTheme(nextTheme[theme])}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}
