import { forwardRef } from "react";
import { CardProps } from "tourista";

const BrutalistCard = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      content,
      currentStepIndex,
      totalSteps,
      canGoNext,
      canGoPrev,
      nextStep,
      prevStep,
      skipTour,
      endTour,
      className,
      style,
      showControls = true,
      canSkip = true,
    },
    ref
  ) => {
    const isLastStep = currentStepIndex === totalSteps - 1;
    const progress = ((currentStepIndex + 1) / totalSteps) * 100;

    return (
      <div
        ref={ref}
        className={className}
        style={{
          backgroundColor: "#f0f0f0",
          border: "4px solid #000000",
          padding: "0",
          maxWidth: "420px",
          minWidth: "360px",
          fontFamily: "monospace",
          position: "relative",
          boxShadow: "8px 8px 0px #000000",
          ...style,
        }}
      >
        {/* Header bar */}
        <div
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            padding: "16px 20px",
            borderBottom: "4px solid #000000",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "900",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            STEP_{String(currentStepIndex + 1).padStart(2, "0")}
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor:
                    i <= currentStepIndex ? "#ff0000" : "#ffffff",
                  border: "2px solid #000000",
                  transform: "rotate(45deg)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div style={{ padding: "24px" }}>
          {/* Title with brutal styling */}
          {title && (
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "900",
                color: "#000000",
                marginBottom: "20px",
                textTransform: "uppercase",
                letterSpacing: "-1px",
                lineHeight: "1",
                backgroundColor: "#ffff00",
                padding: "12px 16px",
                border: "3px solid #000000",
                display: "inline-block",
                transform: "rotate(-1deg)",
                margin: "0 0 24px -8px",
                boxShadow: "4px 4px 0px #000000",
              }}
            >
              {title}
            </h2>
          )}

          {/* Content box */}
          {content && (
            <div
              style={{
                fontSize: "14px",
                lineHeight: "1.8",
                color: "#000000",
                marginBottom: "24px",
                padding: "16px",
                backgroundColor: "#ffffff",
                border: "2px solid #000000",
                fontFamily: "monospace",
                letterSpacing: "0.5px",
              }}
            >
              {content}
            </div>
          )}

          {/* Progress indicator - brutal style */}
          <div
            style={{
              marginBottom: "28px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "900",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                PROGRESS
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "900",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  padding: "2px 8px",
                }}
              >
                {Math.round(progress)}%
              </span>
            </div>
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "3px solid #000000",
                height: "24px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundColor: "#ff0000",
                  height: "100%",
                  width: `${progress}%`,
                  transition: "width 0.3s ease",
                  position: "relative",
                }}
              >
                {/* Diagonal stripes pattern */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 10px,
                      rgba(0,0,0,0.2) 10px,
                      rgba(0,0,0,0.2) 20px
                    )`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Navigation controls */}
          {showControls && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: canSkip && !isLastStep ? "20px" : "0",
              }}
            >
              {/* Previous button */}
              <button
                onClick={prevStep}
                disabled={!canGoPrev}
                style={{
                  padding: "16px",
                  fontWeight: "900",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: canGoPrev ? "#000000" : "#999999",
                  backgroundColor: canGoPrev ? "#ffffff" : "#e0e0e0",
                  border: "3px solid #000000",
                  cursor: canGoPrev ? "pointer" : "not-allowed",
                  transition: "all 0.1s ease",
                  outline: "none",
                  fontFamily: "monospace",
                  position: "relative",
                  boxShadow: canGoPrev ? "4px 4px 0px #000000" : "none",
                }}
                onMouseDown={(e) => {
                  if (canGoPrev) {
                    e.currentTarget.style.transform = "translate(2px, 2px)";
                    e.currentTarget.style.boxShadow = "2px 2px 0px #000000";
                  }
                }}
                onMouseUp={(e) => {
                  if (canGoPrev) {
                    e.currentTarget.style.transform = "translate(0, 0)";
                    e.currentTarget.style.boxShadow = "4px 4px 0px #000000";
                  }
                }}
                onMouseLeave={(e) => {
                  if (canGoPrev) {
                    e.currentTarget.style.transform = "translate(0, 0)";
                    e.currentTarget.style.boxShadow = "4px 4px 0px #000000";
                  }
                }}
              >
                ← BACK
              </button>
              {/* Next/Complete button */}
              {isLastStep ? (
                <button
                  onClick={endTour}
                  style={{
                    padding: "16px",
                    fontWeight: "900",
                    fontSize: "14px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "#000000",
                    backgroundColor: "#00ff00",
                    border: "3px solid #000000",
                    cursor: "pointer",
                    transition: "all 0.1s ease",
                    outline: "none",
                    fontFamily: "monospace",
                    position: "relative",
                    boxShadow: "4px 4px 0px #000000",
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "translate(2px, 2px)";
                    e.currentTarget.style.boxShadow = "2px 2px 0px #000000";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "translate(0, 0)";
                    e.currentTarget.style.boxShadow = "4px 4px 0px #000000";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translate(0, 0)";
                    e.currentTarget.style.boxShadow = "4px 4px 0px #000000";
                  }}
                >
                  [COMPLETE]
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canGoNext}
                  style={{
                    padding: "16px",
                    fontWeight: "900",
                    fontSize: "14px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: canGoNext ? "#ffffff" : "#999999",
                    backgroundColor: canGoNext ? "#000000" : "#e0e0e0",
                    border: "3px solid #000000",
                    cursor: canGoNext ? "pointer" : "not-allowed",
                    transition: "all 0.1s ease",
                    outline: "none",
                    fontFamily: "monospace",
                    position: "relative",
                    boxShadow: canGoNext ? "4px 4px 0px #ff0000" : "none",
                  }}
                  onMouseDown={(e) => {
                    if (canGoNext) {
                      e.currentTarget.style.transform = "translate(2px, 2px)";
                      e.currentTarget.style.boxShadow = "2px 2px 0px #ff0000";
                    }
                  }}
                  onMouseUp={(e) => {
                    if (canGoNext) {
                      e.currentTarget.style.transform = "translate(0, 0)";
                      e.currentTarget.style.boxShadow = "4px 4px 0px #ff0000";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (canGoNext) {
                      e.currentTarget.style.transform = "translate(0, 0)";
                      e.currentTarget.style.boxShadow = "4px 4px 0px #ff0000";
                    }
                  }}
                >
                  NEXT →
                </button>
              )}
            </div>
          )}

          {/* Skip button - brutal style */}
          {canSkip && !isLastStep && (
            <button
              onClick={skipTour}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "12px",
                fontWeight: "900",
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "#000000",
                backgroundColor: "#d0d0d0",
                border: "2px dashed #000000",
                cursor: "pointer",
                transition: "all 0.1s ease",
                outline: "none",
                fontFamily: "monospace",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ff0000";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderStyle = "solid";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#d0d0d0";
                e.currentTarget.style.color = "#000000";
                e.currentTarget.style.borderStyle = "dashed";
              }}
            >
              [X] SKIP_TOUR
            </button>
          )}
        </div>

        {/* Bottom status bar */}
        <div
          style={{
            backgroundColor: "#000000",
            color: "#00ff00",
            padding: "8px 20px",
            borderTop: "4px solid #000000",
            fontFamily: "monospace",
            fontSize: "11px",
            letterSpacing: "1px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>STATUS: ACTIVE</span>
          <span>
            MODULE_{String(currentStepIndex + 1).padStart(2, "0")}/
            {String(totalSteps).padStart(2, "0")}
          </span>
        </div>
      </div>
    );
  }
);

BrutalistCard.displayName = "BrutalistCard";

export default BrutalistCard;
