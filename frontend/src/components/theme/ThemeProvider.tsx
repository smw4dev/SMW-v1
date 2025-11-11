"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark";
type ThemePalette =
  | "crimson"
  | "emerald"
  | "sapphire"
  | "amethyst"
  | "fuchsia"
  | "magenta"
  | "pumpkin"
  | "tangerine"
  | "citrus"
  | "lemon"
  | "mint"
  | "teal"
  | "aqua"
  | "sky"
  | "ocean"
  | "indigo"
  | "cobalt"
  | "rose"
  | "bubblegum"
  | "sunset"
  | "peach"
  | "lime"
  | "gold"
  | "ruby"
  | "turquoise";

type ThemeContextValue = {
  mode: ThemeMode;
  palette: ThemePalette;
  setMode: (mode: ThemeMode) => void;
  setPalette: (palette: ThemePalette) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const STORAGE_MODE_KEY = "theme-mode";
const STORAGE_PALETTE_KEY = "theme-palette";
const DEFAULT_MODE: ThemeMode = "light";
const DEFAULT_PALETTE: ThemePalette = "emerald";

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") return DEFAULT_MODE;
  const stored = localStorage.getItem(STORAGE_MODE_KEY);
  return stored === "dark" ? "dark" : DEFAULT_MODE;
}

function readStoredPalette(): ThemePalette {
  if (typeof window === "undefined") return DEFAULT_PALETTE;
  const stored = localStorage.getItem(STORAGE_PALETTE_KEY) as ThemePalette | null;
  return stored ?? DEFAULT_PALETTE;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStoredMode());
  const [palette, setPaletteState] = useState<ThemePalette>(() => readStoredPalette());

  // Initialize from storage or system
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedMode = readStoredMode();
    const storedPalette = readStoredPalette();
    setModeState(storedMode);
    setPaletteState(storedPalette);
  }, []);

  // Apply to document root
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    // dark class for neutral tokens
    root.classList.toggle("dark", mode === "dark");
    // palette via data attribute (affects brand tokens)
    root.setAttribute("data-theme", palette);
  }, [mode, palette]);

  // Reset document theme when dashboard layout (provider) unmounts
  useEffect(() => {
    return () => {
      if (typeof document === "undefined") return;
      const root = document.documentElement;
      root.classList.remove("dark");
      root.setAttribute("data-theme", DEFAULT_PALETTE);
    };
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_MODE_KEY, next);
  }, []);

  const setPalette = useCallback((next: ThemePalette) => {
    setPaletteState(next);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_PALETTE_KEY, next);
  }, []);

  const toggleMode = useCallback(() => setMode(mode === "light" ? "dark" : "light"), [mode, setMode]);

  const value = useMemo(
    () => ({ mode, palette, setMode, setPalette, toggleMode }),
    [mode, palette, setMode, setPalette, toggleMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

// Optional: a simple switcher component to test quickly
export function ThemeSwitcher() {
  const { mode, toggleMode, palette, setPalette } = useTheme();
  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        className="px-2 py-1 rounded border bg-card text-foreground"
        onClick={toggleMode}
      >
        Mode: {mode}
      </button>
      <select
        className="px-2 py-1 rounded border bg-background"
        value={palette}
        onChange={(e) => setPalette(e.target.value as ThemePalette)}
      >
        {[
          "crimson",
          "emerald",
          "sapphire",
          "amethyst",
          "fuchsia",
          "magenta",
          "pumpkin",
          "tangerine",
          "citrus",
          "lemon",
          "mint",
          "teal",
          "aqua",
          "sky",
          "ocean",
          "indigo",
          "cobalt",
          "rose",
          "bubblegum",
          "sunset",
          "peach",
          "lime",
          "gold",
          "ruby",
          "turquoise",
          "cerulean",
        ].map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
}
