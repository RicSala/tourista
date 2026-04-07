import { forwardRef } from "react";
import { CardProps } from "tourista";

const MinimalCard = forwardRef<HTMLDivElement, CardProps>(
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
          backgroundColor: "#ffffff",
          borderRadius: "4px",
          border: "1px solid #000000",
          padding: "32px",
          maxWidth: "400px",
          minWidth: "320px",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          position: "relative",
          ...style,
        }}
      >
        {/* Step dots indicator */}
        <div
          style={{
            display: "flex",
            gap: "6px",
            marginBottom: "28px",
            alignItems: "center",
          }}
        >
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              style={{
                width: i === currentStepIndex ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: i <= currentStepIndex ? "#000000" : "#e5e5e5",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          ))}
          <span
            style={{
              marginLeft: "12px",
              fontSize: "12px",
              fontWeight: "500",
              color: "#666666",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {currentStepIndex + 1} / {totalSteps}
          </span>
        </div>

        {/* Title */}
        {title && (
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#000000",
              marginBottom: "16px",
              lineHeight: "1.2",
              letterSpacing: "-0.03em",
              margin: "0 0 16px 0",
            }}
          >
            {title}
          </h2>
        )}

        {/* Content */}
        {content && (
          <div
            style={{
              fontSize: "16px",
              lineHeight: "1.65",
              color: "#333333",
              marginBottom: "32px",
            }}
          >
            {content}
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "#000000",
            marginBottom: "24px",
            opacity: 0.1,
          }}
        />

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {showControls && (
            <>
              {/* Previous button */}
              <button
                onClick={prevStep}
                disabled={!canGoPrev}
                style={{
                  padding: "0",
                  fontWeight: "500",
                  fontSize: "14px",
                  color: canGoPrev ? "#000000" : "#cccccc",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: canGoPrev ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "opacity 0.2s ease",
                  opacity: canGoPrev ? 1 : 0.3,
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if (canGoPrev) {
                    e.currentTarget.style.opacity = "0.6";
                  }
                }}
                onMouseLeave={(e) => {
                  if (canGoPrev) {
                    e.currentTarget.style.opacity = "1";
                  }
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Previous
              </button>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Next/Finish button */}
              {!canGoNext && isLastStep ? (
                <button
                  onClick={endTour}
                  style={{
                    padding: "12px 28px",
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "#ffffff",
                    backgroundColor: "#000000",
                    border: "1px solid #000000",
                    borderRadius: "2px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    outline: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.color = "#000000";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#000000";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                >
                  Complete Tour
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canGoNext}
                  style={{
                    padding: "12px 28px",
                    fontWeight: "500",
                    fontSize: "14px",
                    color: canGoNext ? "#ffffff" : "#999999",
                    backgroundColor: canGoNext ? "#000000" : "#f5f5f5",
                    border: `1px solid ${canGoNext ? "#000000" : "#e5e5e5"}`,
                    borderRadius: "2px",
                    cursor: canGoNext ? "pointer" : "not-allowed",
                    transition: "all 0.2s ease",
                    outline: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    if (canGoNext) {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                      e.currentTarget.style.color = "#000000";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (canGoNext) {
                      e.currentTarget.style.backgroundColor = "#000000";
                      e.currentTarget.style.color = "#ffffff";
                    }
                  }}
                >
                  Continue
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>

        {/* Skip tour option */}
        {canSkip && !isLastStep && (
          <div
            style={{
              marginTop: "24px",
              paddingTop: "24px",
              borderTop: "1px solid #f0f0f0",
              textAlign: "center",
            }}
          >
            <button
              onClick={skipTour}
              style={{
                fontSize: "13px",
                color: "#666666",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
                transition: "color 0.2s ease",
                outline: "none",
                fontWeight: "400",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#000000";
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#666666";
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              Skip tour
            </button>
          </div>
        )}
      </div>
    );
  }
);

MinimalCard.displayName = "MinimalCard";

export default MinimalCard;
