import { useMemo, useSyncExternalStore } from "react";
import { tourActor } from "../components/TourMachineReact";
import { useTourContext } from "../components/TourProvider";
import {
  createMockHelpers,
  createTourHelpers,
} from "../helpers/tourMachineGenerator";
import {
  ExtractStates,
  ExtractTourEvents,
  TourConfig,
  TourContext,
} from "../types";

type AsyncStepIds<T extends TourConfig> =
  T["steps"][number] extends infer Step
    ? Step extends { type: "async"; id: infer Id extends string }
      ? Id
      : never
    : never;

type BoundAsyncTasks<T extends TourConfig> = {
  [K in AsyncStepIds<T>]: {
    start: () => void;
    success: () => void;
    fail: () => void;
  };
};

type UseTourArgs<TConfig extends TourConfig> = string | TConfig;

type TourSnapshot = {
  value: string;
  context: TourContext;
  status?: string;
} | null;

type CurrentStepData = {
  targetElement?: string;
  title: string;
  content: string;
  page: string;
  viewportId?: string;
} | null;

type UseTourReturn<TConfig extends TourConfig> = {
  isActive: boolean;
  currentState: ExtractStates<TConfig> | null;
  currentStepData: CurrentStepData;
  currentStepIndex: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  canSkip: boolean;
  snapshot: TourSnapshot;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  startTour: (tourId: string) => void;
  skipTour: () => void;
  sendEvent: (event: Omit<ExtractTourEvents<TConfig>, "tourId">) => void;
  tasks: BoundAsyncTasks<TConfig>;
};

export function useTour<const TConfig extends TourConfig>(
  tourConfig: TConfig,
): UseTourReturn<TConfig>;
export function useTour(
  tourId: string,
): UseTourReturn<TourConfig>;
export function useTour(
  tourIdOrConfig: string | TourConfig,
): UseTourReturn<TourConfig> {
  const {
    tourConfig: activeTourConfig,
    tours,
    startTour,
    endTour,
    isActive: providerIsActive,
  } = useTourContext();

  const providedConfig =
    typeof tourIdOrConfig === "string" ? null : tourIdOrConfig;
  const requestedTourId =
    typeof tourIdOrConfig === "string" ? tourIdOrConfig : tourIdOrConfig.id;

  const requestedTourConfig = useMemo(
    () => providedConfig ?? tours.find((tour) => tour.id === requestedTourId),
    [providedConfig, requestedTourId, tours],
  );

  const tourHelpers = useMemo(() => {
    if (!requestedTourConfig) return createMockHelpers();
    return createTourHelpers(requestedTourConfig);
  }, [requestedTourConfig]);

  const sendEvent = (event: Omit<ExtractTourEvents<TourConfig>, "tourId">) => {
    if (!requestedTourConfig) return;
    return tourActor?.send({ ...event, tourId: requestedTourConfig.id } as any);
  };

  const tasks = useMemo(() => {
    return Object.fromEntries(
      Object.entries(tourHelpers.tasks).map(([taskId, task]) => [
        taskId,
        {
          start: () => sendEvent({ type: task.events.start } as any),
          success: () => sendEvent({ type: task.events.success } as any),
          fail: () => sendEvent({ type: task.events.failed } as any),
        },
      ]),
    ) as BoundAsyncTasks<TourConfig>;
  }, [tourHelpers, requestedTourConfig]);

  const snapshot = useSyncExternalStore(
    (callback) => tourActor?.subscribe(callback) || (() => {}),
    () => tourActor?.getSnapshot() || null,
    () => null,
  );

  const isRequestedTourActive = activeTourConfig?.id === requestedTourId;
  const activeSnapshot = isRequestedTourActive ? snapshot : null;

  const currentState = useMemo(() => {
    return activeSnapshot?.value as ExtractStates<TourConfig>;
  }, [activeSnapshot]);

  // Get current step data from context
  const currentStepData = useMemo(
    () =>
      activeSnapshot?.context
        ? {
            targetElement: activeSnapshot.context.targetElement,
            title: activeSnapshot.context.title,
            content: activeSnapshot.context.content,
            page: activeSnapshot.context.currentPage,
            viewportId: activeSnapshot.context.viewportId,
          }
        : null,
    [activeSnapshot],
  );

  if (!activeSnapshot || !tourActor || !isRequestedTourActive) {
    return inactiveReturn({
      startTour,
      endTour,
      isActive: providerIsActive && isRequestedTourActive,
      tasks,
      sendEvent,
    });
  }

  const isActive =
    !activeSnapshot.value ||
    !["idle", "completed", "skipped"].includes(activeSnapshot.value);

  return {
    isActive,
    currentState,
    currentStepData,
    currentStepIndex: isActive ? tourHelpers?.getStepIndex(currentState) : -1,
    totalSteps: tourHelpers?.getTotalSteps() || 0,
    canGoNext: requestedTourConfig
      ? tourActor.can({ type: "NEXT", tourId: requestedTourConfig.id })
      : false,
    canGoPrev: requestedTourConfig
      ? tourActor.can({ type: "PREV", tourId: requestedTourConfig.id })
      : false,
    canSkip: requestedTourConfig
      ? tourActor.can({ type: "SKIP_TOUR", tourId: requestedTourConfig.id })
      : false,
    snapshot: activeSnapshot,
    nextStep: () =>
      requestedTourConfig
        ? tourActor?.send({ type: "NEXT", tourId: requestedTourConfig.id })
        : () => {},
    prevStep: () =>
      requestedTourConfig
        ? tourActor?.send({ type: "PREV", tourId: requestedTourConfig.id })
        : () => {},
    endTour: () =>
      requestedTourConfig
        ? tourActor?.send({ type: "END_TOUR", tourId: requestedTourConfig.id })
        : () => {},
    startTour,
    skipTour: () =>
      requestedTourConfig
        ? tourActor?.send({ type: "SKIP_TOUR", tourId: requestedTourConfig.id })
        : () => {},
    sendEvent,
    tasks,
  };
};

export const inactiveReturn = ({
  startTour,
  endTour,
  isActive = false,
  tasks,
  sendEvent,
}: {
  startTour: (tourId: string) => void;
  endTour: () => void;
  isActive?: boolean;
  tasks: BoundAsyncTasks<any>;
  sendEvent: (_event: any) => void;
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
    sendEvent,
    tasks,
  };
};
