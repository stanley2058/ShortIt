import { ColorScheme } from "@mantine/core";
import { useState } from "react";

const themeKey = "mantine-color-scheme";
export function getTheme(): ColorScheme {
  return (localStorage.getItem(themeKey) as ColorScheme) || "dark";
}
function setTheme(theme: ColorScheme) {
  localStorage.setItem(themeKey, theme);
}

let subscribers: ((colorScheme: ColorScheme) => void)[] = [];
export default function useColorScheme(
  next?: (colorScheme: ColorScheme) => void
) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(getTheme());
  if (next) subscribers.push(next);

  const unsubscribe = () => {
    const f = next;
    subscribers = subscribers.filter((s) => s !== f);
  };

  return [
    colorScheme,
    (update: ColorScheme) => {
      setTheme(update);
      setColorScheme(update);
      subscribers.forEach((s) => s(update));
    },
    next ? unsubscribe : undefined,
  ] as const;
}
