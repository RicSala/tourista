"use client";

import { tourConfig } from "@/app/optimized-demo/tourConfig";
import { TourMachine, TourProvider } from "tourista";

export default function OptimizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TourProvider tours={[tourConfig]}>
      <TourMachine />
      {children}
    </TourProvider>
  );
}
