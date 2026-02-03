import { Sun, Moon } from "lucide-react";
import { useId } from "react";
import { useTheme } from "../hooks/useTheme";

type ThemeSelectorProps = {
  className?: string;
};

export const ThemeSwitcher = ({ className = "" }: ThemeSelectorProps) => {
  const { theme, setTheme } = useTheme();
  const id = useId();

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className={className}>
      <div className="flex items-center">
        <label
          htmlFor={`${id}-theme-switch`}
          className="relative inline-block h-6 w-12 cursor-pointer rounded-full bg-muted transition-colors duration-300 ease-in-out peer-checked:bg-primary peer-disabled:pointer-events-none peer-disabled:opacity-50"
        >
          <input
            id={`${id}-theme-switch`}
            type="checkbox"
            className="peer sr-only"
            checked={theme === "dark"}
            onChange={(e) => handleToggle(e.target.checked)}
            aria-label="Toggle theme"
          />

          <span className="absolute top-1/2 start-1 size-5 -translate-y-1/2 rounded-full bg-card shadow-sm transition-transform duration-300 ease-in-out peer-checked:translate-x-full" />

          <span className="absolute top-1/2 start-1 flex size-4 -translate-y-1/2 items-center justify-center text-accent transition-colors duration-300 peer-checked:text-primary-foreground">
            <Sun size={12} strokeWidth={2} />
          </span>

          <span className="absolute top-1/2 end-1 flex size-4 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors duration-300 peer-checked:text-primary-foreground">
            <Moon size={12} strokeWidth={2} />
          </span>
        </label>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
