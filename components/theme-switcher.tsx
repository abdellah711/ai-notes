"use client";

import { Switch } from "@nextui-org/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { SunMoonIcon } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      }}
    >
      <SunMoonIcon />
      <span>Dark Theme</span>
      <Switch
        isSelected={theme === "dark"}
        size="sm"
        className="ms-auto pointer-events-none"
      />
    </DropdownMenuItem>
  );
}
