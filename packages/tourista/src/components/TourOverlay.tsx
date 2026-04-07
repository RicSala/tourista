"use client";

import { ComponentType, useEffect, useMemo, useState } from "react";
import { useTour } from "../hooks/useTour";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import { CardPositioning, CardProps, OverlayStyles } from "../types";
import DefaultCard from "./DefaultCard";
import { scrollIfNeeded } from "../helpers/scrollIfNeeded";
import { motion } from "motion/react";
import DynamicPortal from "./DynamicPortal";
import { getScrollableParentOrBody } from "../helpers/getScrollableParent";

interface TourOverlayProps {
  customCard?: ComponentType<CardProps>;
  onOverlayClick?: () => void;
  backdropPointerEvents?: "auto" | "none";
  overlayStyles: Required<OverlayStyles>;
  cardPositioning: Required<CardPositioning>;
  tourId: string;
}

export const TourOverlay = ({
  customCard,
  onOverlayClick,
  backdropPointerEvents = "auto",
  overlayStyles,
  cardPositioning,
  tourId,
}: TourOverlayProps) => {
  const Card = customCard || DefaultCard;
  const tour = useTour(tourId);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [viewportElement, setViewportElement] = useState<HTMLElement | null>(
    null,
  );
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(
    null,
  );

  const targetElement = useMemo(
    () => tour?.currentStepData?.targetElement,
    [tour?.currentStepData],
  );

  const viewportId = useMemo(
    () => tour?.currentStepData?.viewportId,
    [tour?.currentStepData],
  );

  const { refs, floatingStyles } = useFloating({
    strategy: "fixed",
    whileElementsMounted: autoUpdate,
    middleware: cardPositioning.floating
      ? [
          offset(cardPositioning.distancePx),
          flip({
            fallbackAxisSideDirection: "start", // Allow switching to top/bottom when left/right don't fit
            crossAxis: true, // Check the perpendicular axis
          }),
          shift({
            padding: 8,
            crossAxis: true, // Allow shifting on cross axis to push into reference element
          }),
        ]
      : [],
    placement: cardPositioning.side,
  });

  useEffect(() => {
    const target =
      targetElement && document.querySelector(targetElement) instanceof HTMLElement
        ? (document.querySelector(targetElement) as HTMLElement)
        : null;

    const viewport =
      viewportId && document.getElementById(viewportId) instanceof HTMLElement
        ? (document.getElementById(viewportId) as HTMLElement)
        : null;

    setViewportElement(viewport);

    if (target) {
      setScrollContainer(getScrollableParentOrBody(target));
      return;
    }

    setScrollContainer(document.body);
  }, [viewportId, targetElement, tour.currentStepData]);

  useEffect(() => {
    if (!targetElement) return;

    const updateRect = () => {
      const element = document.querySelector(targetElement);
      if (!element || !(element instanceof HTMLElement)) return;
      setTargetRect(element.getBoundingClientRect());
    };

    const initialTimer = setTimeout(updateRect, 100);
    updateRect();

    let retryCount = 0;
    const retryInterval = setInterval(() => {
      const element = document.querySelector(targetElement);
      if (element || retryCount > 10) {
        updateRect();
        clearInterval(retryInterval);
        if (element instanceof HTMLElement) {
          void scrollIfNeeded(element).then(updateRect);
        }
      }
      retryCount++;
    }, 200);

    const scrollTargets = new Set<EventTarget>([window]);
    if (scrollContainer && scrollContainer !== document.body) {
      scrollTargets.add(scrollContainer);
    }
    if (viewportElement && viewportElement !== scrollContainer) {
      scrollTargets.add(viewportElement);
    }

    window.addEventListener("resize", updateRect);
    scrollTargets.forEach((target) => {
      target.addEventListener("scroll", updateRect, { passive: true });
    });

    return () => {
      clearTimeout(initialTimer);
      clearInterval(retryInterval);
      window.removeEventListener("resize", updateRect);
      scrollTargets.forEach((target) => {
        target.removeEventListener("scroll", updateRect);
      });
    };
  }, [targetElement, tour?.currentState, viewportElement, scrollContainer]);

  if (!tour || !tour.isActive) return null;

  const windowRect =
    typeof window === "undefined"
      ? null
      : new DOMRect(0, 0, window.innerWidth, window.innerHeight);

  const clipRect = useMemo(() => {
    if (!windowRect) return null;
    if (viewportElement) return intersectRects(windowRect, viewportElement.getBoundingClientRect());
    return windowRect;
  }, [viewportElement, targetRect, windowRect]);

  const spotlightRect = useMemo(() => {
    if (!targetRect || !windowRect) return null;

    const paddedTarget = new DOMRect(
      targetRect.left - overlayStyles.padding,
      targetRect.top - overlayStyles.padding,
      targetRect.width + overlayStyles.padding * 2,
      targetRect.height + overlayStyles.padding * 2,
    );

    return intersectRects(paddedTarget, clipRect ?? windowRect);
  }, [clipRect, overlayStyles.padding, targetRect, windowRect]);

  const viewportWidth = windowRect?.width ?? 0;
  const viewportHeight = windowRect?.height ?? 0;
  const cutoutX = spotlightRect?.left ?? 0;
  const cutoutY = spotlightRect?.top ?? 0;
  const cutoutWidth = spotlightRect?.width ?? 0;
  const cutoutHeight = spotlightRect?.height ?? 0;

  return (
    <DynamicPortal>
      <>
        <motion.div
          data-name="tourista-overlay"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            overflow: "hidden",
            height: "100vh",
            width: "100vw",
            zIndex: 997,
            pointerEvents: "none",
          }}
        >
          <svg
            width={viewportWidth}
            height={viewportHeight}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          >
            {spotlightRect && (
              <defs>
                <mask id={`smooth-spotlight-mask-${tourId}`}>
                  <rect
                    width={viewportWidth}
                    height={viewportHeight}
                    fill="white"
                  />
                  <motion.rect
                    id={`smooth-spotlight-mask-${tourId}`}
                    initial={{
                      x: cutoutX + cutoutWidth / 2 - 20,
                      y: cutoutY + cutoutHeight / 2 - 20,
                      width: 40,
                      height: 40,
                      rx: 10,
                      ry: 10,
                    }}
                    animate={{
                      x: spotlightRect ? cutoutX : cutoutX + cutoutWidth / 2,
                      y: spotlightRect ? cutoutY : cutoutY + cutoutHeight / 2,
                      width: spotlightRect ? cutoutWidth : 0,
                      height: spotlightRect ? cutoutHeight : 0,
                      rx: overlayStyles.radius,
                      ry: overlayStyles.radius,
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    fill="black"
                  />
                </mask>
              </defs>
            )}
            <rect
              width={viewportWidth}
              height={viewportHeight}
              fill={`rgba(${overlayStyles.colorRgb}, ${overlayStyles.opacity})`}
              mask={
                spotlightRect
                  ? `url(#smooth-spotlight-mask-${tourId})`
                  : undefined
              }
            />
          </svg>

          <div
            data-name="tourista-overlay-blockers"
            style={{
              position: "fixed",
              zIndex: 998,
              pointerEvents: "none",
              inset: 0,
            }}
          >
            <div
              data-name="tourista-top-overlay"
              onClick={onOverlayClick}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                pointerEvents: backdropPointerEvents,
                height: Math.max(cutoutY, 0),
              }}
            />
            <div
              data-name="tourista-bottom-overlay"
              onClick={onOverlayClick}
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                top: cutoutY + cutoutHeight,
                pointerEvents: backdropPointerEvents,
                height: Math.max(viewportHeight - cutoutY - cutoutHeight, 0),
              }}
            />
            <div
              data-name="tourista-left-overlay"
              onClick={onOverlayClick}
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                pointerEvents: backdropPointerEvents,
                width: Math.max(cutoutX, 0),
                height: viewportHeight,
              }}
            />
            <div
              data-name="tourista-right-overlay"
              onClick={onOverlayClick}
              style={{
                position: "fixed",
                top: 0,
                left: cutoutX + cutoutWidth,
                pointerEvents: backdropPointerEvents,
                width: Math.max(viewportWidth - cutoutX - cutoutWidth, 0),
                height: viewportHeight,
              }}
            />
          </div>
          {spotlightRect && (
            <div
              data-name="tourista-highlight-reference"
              className="fixed rounded-lg pointer-events-none"
              ref={refs.setReference}
              style={{
                left: cutoutX,
                top: cutoutY,
                width: cutoutWidth,
                height: cutoutHeight,
                zIndex: 999,
              }}
            />
          )}
        </motion.div>
        <Card
          className="fixed z-[999] pointer-events-auto"
          style={
            targetElement && spotlightRect
              ? floatingStyles
              : {
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }
          }
          title={tour.currentStepData?.title}
          content={tour.currentStepData?.content}
          currentStepIndex={tour.currentStepIndex}
          totalSteps={tour.totalSteps}
          canGoNext={tour.canGoNext!}
          canSkip={tour.canSkip!}
          canGoPrev={tour.canGoPrev!}
          nextStep={tour.nextStep}
          prevStep={tour.prevStep}
          skipTour={tour.skipTour}
          endTour={tour.endTour}
          ref={refs.setFloating}
        />
      </>
    </DynamicPortal>
  );
};

const intersectRects = (a: DOMRect, b: DOMRect): DOMRect | null => {
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.right, b.right);
  const bottom = Math.min(a.bottom, b.bottom);

  if (right <= left || bottom <= top) return null;

  return new DOMRect(left, top, right - left, bottom - top);
};
