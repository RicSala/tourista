"use client";

import BrutalistCard from "@/app/components/cards/BrutalistCard";
import DefaultCard from "@/app/components/cards/DefaultCard";
import MinimalCard from "@/app/components/cards/MinimalCard";
import ModernCard from "@/app/components/cards/ModernCard";
import NeumorphismCard from "@/app/components/cards/NeumorphismCard";

export const CARD_THEMES = {
  default: { name: "Default", component: DefaultCard },
  modern: { name: "Modern", component: ModernCard },
  minimal: { name: "Minimal", component: MinimalCard },
  brutalist: { name: "Brutalist", component: BrutalistCard },
  neumorphism: { name: "Neumorphism", component: NeumorphismCard },
} as const;

export type CardTheme = keyof typeof CARD_THEMES;
