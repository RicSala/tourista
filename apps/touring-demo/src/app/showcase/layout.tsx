"use client";

import { createContext, useState } from "react";
import { TourMachine, TourProvider } from "tourista";
import { showcaseTourConfig } from "./tourConfig";

// Import all card variants
import BrutalistCard from "@/app/components/cards/BrutalistCard";
import DefaultCard from "@/app/components/cards/DefaultCard";
import MinimalCard from "@/app/components/cards/MinimalCard";
import ModernCard from "@/app/components/cards/ModernCard";
import NeumorphismCard from "@/app/components/cards/NeumorphismCard";
import { SettingsPanel } from "./SettingsPanel";

// Card theme options
export const CARD_THEMES = {
  default: { name: "Default", component: DefaultCard },
  modern: { name: "Modern", component: ModernCard },
  minimal: { name: "Minimal", component: MinimalCard },
  brutalist: { name: "Brutalist", component: BrutalistCard },
  neumorphism: { name: "Neumorphism", component: NeumorphismCard },
} as const;

export type CardTheme = keyof typeof CARD_THEMES;

// Context for showcase settings
interface ShowcaseSettings {
  cardTheme: CardTheme;
  setCardTheme: (theme: CardTheme) => void;
  showDebug: boolean;
  setShowDebug: (show: boolean) => void;
}

export const ShowcaseContext = createContext<ShowcaseSettings | null>(null);

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Card theme state
  const [cardTheme, setCardTheme] = useState<CardTheme>("modern");

  // Debug panel visibility
  const [showDebug, setShowDebug] = useState(false);

  return (
    <ShowcaseContext.Provider
      value={{
        cardTheme,
        setCardTheme,
        showDebug,
        setShowDebug,
      }}
    >
      <TourProvider tours={[showcaseTourConfig]}>
        <TourMachine customCard={CARD_THEMES[cardTheme].component} />

        {children}

        <SettingsPanel />
      </TourProvider>
    </ShowcaseContext.Provider>
  );
}
