"use client";
import { useContext } from "react";
import { ShowcaseContext } from "./layout";

export function useShowcaseSettings() {
  const ctx = useContext(ShowcaseContext);
  if (!ctx)
    throw new Error("useShowcaseSettings must be used within ShowcaseLayout");
  return ctx;
}
