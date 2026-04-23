"use client";

import { createContext } from "react";
import type { CardTheme } from "./cardThemes";

export interface ShowcaseSettings {
  cardTheme: CardTheme;
  setCardTheme: (theme: CardTheme) => void;
  showDebug: boolean;
  setShowDebug: (show: boolean) => void;
}

export const ShowcaseContext = createContext<ShowcaseSettings | null>(null);
