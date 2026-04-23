"use client";

import { useState } from "react";
import { TourMachine, TourProvider } from "tourista";
import { CARD_THEMES, type CardTheme } from "./cardThemes";
import { ShowcaseContext } from "./showcaseContext";
import { SettingsPanel } from "./SettingsPanel";
import { showcaseTourConfig } from "./tourConfig";

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
