import { forwardRef } from "react";
import { CardProps } from "tourista";

const NeumorphismCard = forwardRef<HTMLDivElement, CardProps>(
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
          backgroundColor: "#e8eaf0",
          borderRadius: "24px",
          padding: "32px",
          maxWidth: "420px",
          minWidth: "360px",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: "relative",
          boxShadow: "20px 20px 60px #c5c7ce, -20px -20px 60px #ffffff",
          ...style,
        }}
      >
        {/* Step indicator dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              style={{
                width: i === currentStepIndex ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: i <= currentStepIndex ? "#6366f1" : "#d1d5db",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow:
                  i === currentStepIndex
                    ? "inset 2px 2px 5px rgba(99, 102, 241, 0.3)"
                    : "none",
              }}
            />
          ))}
        </div>

        {/* Title */}
        {title && (
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "16px",
              textAlign: "center",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h2>
        )}

        {/* Content */}
        {content && (
          <div
            style={{
              fontSize: "15px",
              lineHeight: "1.6",
              color: "#4b5563",
              marginBottom: "32px",
              padding: "24px",
              backgroundColor: "#e8eaf0",
              borderRadius: "16px",
              boxShadow:
                "inset 8px 8px 16px #c5c7ce, inset -8px -8px 16px #ffffff",
              textAlign: "center",
            }}
          >
            {content}
          </div>
        )}

        {/* Progress bar */}
        <div style={{ marginBottom: "32px" }}>
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
                fontWeight: "500",
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: "500",
                color: "#6366f1",
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div
            style={{
              height: "8px",
              backgroundColor: "#e8eaf0",
              borderRadius: "4px",
              boxShadow:
                "inset 4px 4px 8px #c5c7ce, inset -4px -4px 8px #ffffff",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
                borderRadius: "4px",
                transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "2px 2px 4px rgba(99, 102, 241, 0.3)",
              }}
            />
          </div>
        </div>

        {/* Navigation controls */}
        {showControls && (
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: canSkip && !isLastStep ? "16px" : "0",
            }}
          >
            {/* Previous button */}
            <button
              onClick={prevStep}
              disabled={!canGoPrev}
              style={{
                flex: 1,
                padding: "14px 24px",
                fontWeight: "500",
                fontSize: "14px",
                color: canGoPrev ? "#4b5563" : "#9ca3af",
                backgroundColor: "#e8eaf0",
                border: "none",
                borderRadius: "12px",
                cursor: canGoPrev ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                outline: "none",
                boxShadow: canGoPrev
                  ? "8px 8px 16px #c5c7ce, -8px -8px 16px #ffffff"
                  : "none",
              }}
              onMouseDown={(e) => {
                if (canGoPrev) {
                  e.currentTarget.style.boxShadow =
                    "inset 4px 4px 8px #c5c7ce, inset -4px -4px 8px #ffffff";
                }
              }}
              onMouseUp={(e) => {
                if (canGoPrev) {
                  e.currentTarget.style.boxShadow =
                    "8px 8px 16px #c5c7ce, -8px -8px 16px #ffffff";
                }
              }}
              onMouseLeave={(e) => {
                if (canGoPrev) {
                  e.currentTarget.style.boxShadow =
                    "8px 8px 16px #c5c7ce, -8px -8px 16px #ffffff";
                }
              }}
            >
              Previous
            </button>

            {/* Next/Complete button */}
            {isLastStep ? (
              <button
                onClick={endTour}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#ffffff",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  outline: "none",
                  boxShadow: "8px 8px 16px #c5c7ce, -8px -8px 16px #ffffff",
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.98)";
                  e.currentTarget.style.boxShadow =
                    "inset 4px 4px 8px rgba(0,0,0,0.2)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "8px 8px 16px #c5c7ce, -8px -8px 16px #ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "8px 8px 16px #c5c7ce, -8px -8px 16px #ffffff";
                }}
              >
                Complete
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canGoNext}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#ffffff",
                  background: canGoNext
                    ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                    : "#d1d5db",
                  border: "none",
                  borderRadius: "12px",
                  cursor: canGoNext ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                  outline: "none",
                  boxShadow: canGoNext
                    ? "8px 8px 16px #c5c7ce, -8px -8px 16px #ffffff"
                    : "none",
                }}
                onMouseDown={(e) => {
                  if (canGoNext) {
                    e.currentTarget.style.transform = "scale(0.98)";
                    e.currentTarget.style.boxShadow =
                      "inset 4px 4px 8px rgba(0,0,0,0.2)";
                  }
                }}
                onMouseUp={(e) => {
                  if (canGoNext) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "8px 8px 16px #c5c7ce, -8px -8px 16px #ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (canGoNext) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "8px 8px 16px #c5c7ce, -8px -8px 16px #ffffff";
                  }
                }}
              >
                Next
              </button>
            )}
          </div>
        )}

        {/* Skip button */}
        {canSkip && !isLastStep && (
          <button
            onClick={skipTour}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "13px",
              fontWeight: "500",
              color: "#6b7280",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              outline: "none",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#4b5563";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#6b7280";
            }}
          >
            Skip tour
          </button>
        )}
      </div>
    );
  }
);

NeumorphismCard.displayName = "NeumorphismCard";

export default NeumorphismCard;
