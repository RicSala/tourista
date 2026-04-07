import { useMemo, useSyncExternalStore } from "react";
import { tourActor } from "../components/TourMachineReact";
import { useTourContext } from "../components/TourProvider";
import {
  createMockHelpers,
  createTourHelpers,
} from "../helpers/tourMachineGenerator";
import { ExtractStates, ExtractTourEvents, TourConfig } from "../types";

export const useTour = <TConfig extends TourConfig>(tourId: string) => {
  const {
    tourConfig,
    startTour,
    endTour,
    isActive: providerIsActive,
  } = useTourContext();

  const tourHelpers = useMemo(() => {
    if (!tourConfig) return createMockHelpers();
    return createTourHelpers(tourConfig);
  }, [tourConfig]);

  const snapshot = useSyncExternalStore(
    (callback) => tourActor?.subscribe(callback) || (() => {}),
    () => tourActor?.getSnapshot() || null,
    () => null,
  );

  const currentState = useMemo(() => {
    return snapshot?.value as ExtractStates<TConfig>;
  }, [snapshot]);

  // Get current step data from context
  const currentStepData = useMemo(
    () =>
      snapshot?.context
        ? {
            targetElement: snapshot.context.targetElement,
            title: snapshot.context.title,
            content: snapshot.context.content,
            page: snapshot.context.currentPage,
            viewportId: snapshot.context.viewportId,
          }
        : null,
    [snapshot],
  );

  if (!snapshot || !tourActor || tourConfig?.id !== tourId) {
    return inactiveReturn({
      startTour,
      endTour,
      isActive: providerIsActive && tourConfig?.id === tourId,
    });
  }

  const isActive =
    !snapshot?.value ||
    !["idle", "completed", "skipped"].includes(snapshot?.value);

  return {
    isActive,
    currentState,
    currentStepData,
    currentStepIndex: isActive ? tourHelpers?.getStepIndex(currentState) : -1,
    totalSteps: tourHelpers?.getTotalSteps() || 0,
    canGoNext: tourConfig
      ? tourActor.can({ type: "NEXT", tourId: tourConfig.id })
      : false,
    canGoPrev: tourConfig
      ? tourActor.can({ type: "PREV", tourId: tourConfig.id })
      : false,
    canSkip: tourConfig
      ? tourActor.can({ type: "SKIP_TOUR", tourId: tourConfig.id })
      : false,
    snapshot,
    nextStep: () =>
      tourConfig
        ? tourActor?.send({ type: "NEXT", tourId: tourConfig.id })
        : () => {},
    prevStep: () =>
      tourConfig
        ? tourActor?.send({ type: "PREV", tourId: tourConfig.id })
        : () => {},
    endTour: () =>
      tourConfig
        ? tourActor?.send({ type: "END_TOUR", tourId: tourConfig.id })
        : () => {},
    startTour,
    skipTour: () =>
      tourConfig
        ? tourActor?.send({ type: "SKIP_TOUR", tourId: tourConfig.id })
        : () => {},
    sendEvent: (event: Omit<ExtractTourEvents<TConfig>, "tourId">) => {
      return tourActor?.send({ ...event, tourId: tourConfig.id } as any);
    },
  };
};

export const inactiveReturn = ({
  startTour,
  endTour,
  isActive = false,
}: {
  startTour: (tourId: string) => void;
  endTour: () => void;
  isActive?: boolean;
}) => {
  return {
    isActive,
    currentState: null,
    currentStepData: null,
    currentStepIndex: -1,
    totalSteps: 0,
    canGoNext: false,
    canGoPrev: false,
    canSkip: false,
    snapshot: null,
    nextStep: () => {},
    prevStep: () => {},
    endTour,
    startTour,
    skipTour: () => {},
    sendEvent: (_event: any) => {},
  };
};
