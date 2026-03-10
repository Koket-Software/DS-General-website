import { type LucideIcon, LaptopMinimal, Moon, Sun } from "lucide-react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { useEffect, useId } from "react";

import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark" | "system";

type ThemeSwitchProps = {
  density?: "default" | "compact";
  className?: string;
};

type ThemeOption = {
  value: ThemeMode;
  label: string;
  icon: LucideIcon;
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "LIGHT", icon: Sun },
  { value: "dark", label: "DARK", icon: Moon },
  { value: "system", label: "SYSTEM", icon: LaptopMinimal },
];

export function ThemeSwitch({
  density = "default",
  className,
}: ThemeSwitchProps) {
  const { theme, setTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const switchId = useId();

  const pillTransition: Transition = reduceMotion
    ? { duration: 0.01 }
    : { type: "spring", stiffness: 430, damping: 34, mass: 0.48 };

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const effectiveDark = theme === "system" ? prefersDark : theme === "dark";
    const themeColor = effectiveDark ? "#0E132A" : "#FFFFFF";
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute("content", themeColor);
  }, [theme]);

  const isCompact = density === "compact";

  return (
    <div
      role="group"
      aria-label="Theme mode"
      className={cn(
        "inline-flex items-center rounded-xl border border-primary/25 bg-primary/10 p-1",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        isCompact && "rounded-lg p-0.5",
        className,
      )}
    >
      {THEME_OPTIONS.map((option) => {
        const isActive = theme === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            aria-label={`Set ${option.label.toLowerCase()} theme`}
            onClick={() => setTheme(option.value)}
            className={cn(
              "relative inline-flex items-center justify-center overflow-hidden rounded-lg",
              "font-sans leading-none outline-none",
              "transition-[width,color,transform] duration-220 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
              isCompact ? "h-7" : "h-8",
              isActive
                ? cn(
                    isCompact ? "w-[4.8rem] px-2.5" : "w-[5.8rem] px-3",
                    "text-primary-foreground",
                  )
                : cn(
                    isCompact ? "w-7 px-0" : "w-8 px-0",
                    "text-primary/75 hover:text-primary",
                  ),
            )}
          >
            {isActive ? (
              <motion.span
                layoutId={`theme-switch-pill-${switchId}`}
                transition={pillTransition}
                className="absolute inset-0 rounded-[0.55rem] bg-primary shadow-sm"
              />
            ) : null}

            <span className="relative z-10 flex w-full items-center justify-center">
              <Icon
                className={cn(
                  "shrink-0 transition-transform duration-220 motion-reduce:transition-none",
                  isCompact ? "size-3.5" : "size-4",
                  isActive ? "rotate-0 scale-100" : "-rotate-6 scale-95",
                )}
              />

              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap text-[10px] font-semibold tracking-[0.08em]",
                  "transition-all duration-220 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  isActive
                    ? "ml-1.5 max-w-16 opacity-100"
                    : "ml-0 max-w-0 opacity-0",
                )}
              >
                {option.label}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
