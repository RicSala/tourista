import { forwardRef } from "react";
import { CardProps } from "tourista";

const ModernCard = forwardRef<HTMLDivElement, CardProps>(
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
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.03)",
          padding: "24px",
          maxWidth: "380px",
          minWidth: "320px",
          position: "relative",
          overflow: "hidden",
          ...style,
        }}
      >
        {/* Decorative gradient orb */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "150px",
            height: "150px",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        {/* Header with step counter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#1a1a1a",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {title}
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "100px",
              fontSize: "12px",
              fontWeight: "600",
              color: "white",
              boxShadow: "0 2px 8px rgba(102,126,234,0.4)",
            }}
          >
            <span>{currentStepIndex + 1}</span>
            <span style={{ opacity: 0.8 }}>/</span>
            <span>{totalSteps}</span>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            marginBottom: "24px",
            fontSize: "15px",
            lineHeight: "1.6",
            color: "#4a4a4a",
            position: "relative",
            zIndex: 1,
          }}
        >
          {content}
        </div>

        {/* Progress bar */}
        <div
          style={{
            marginBottom: "24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #e0e7ff 0%, #f0f4ff 100%)",
              borderRadius: "100px",
              height: "6px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                height: "100%",
                borderRadius: "100px",
                width: `${progress}%`,
                transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 0 20px rgba(102,126,234,0.5)",
                position: "relative",
              }}
            >
              {/* Animated shimmer effect */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  animation: "shimmer 2s infinite",
                }}
              />
            </div>
          </div>
          {/* Progress percentage */}
          <div
            style={{
              marginTop: "8px",
              fontSize: "11px",
              color: "#8b92a8",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Navigation buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {showControls && (
            <>
              <button
                onClick={prevStep}
                disabled={!canGoPrev}
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: canGoPrev ? "#4a5568" : "#a0aec0",
                  background: canGoPrev
                    ? "linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)"
                    : "#f7fafc",
                  border: canGoPrev ? "1px solid #e2e8f0" : "1px solid #edf2f7",
                  borderRadius: "12px",
                  cursor: canGoPrev ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                  outline: "none",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (canGoPrev) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (canGoPrev) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                ← Back
              </button>

              {!canGoNext && isLastStep ? (
                <button
                  onClick={endTour}
                  style={{
                    flex: 1,
                    padding: "12px 20px",
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "white",
                    background:
                      "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    outline: "none",
                    boxShadow: "0 4px 15px rgba(72,187,120,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(72,187,120,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(72,187,120,0.3)";
                  }}
                >
                  ✓ Complete
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canGoNext}
                  style={{
                    flex: 1,
                    padding: "12px 20px",
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "white",
                    background: canGoNext
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)",
                    border: "none",
                    borderRadius: "12px",
                    cursor: canGoNext ? "pointer" : "not-allowed",
                    transition: "all 0.2s ease",
                    outline: "none",
                    boxShadow: canGoNext
                      ? "0 4px 15px rgba(102,126,234,0.3)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (canGoNext) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(102,126,234,0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (canGoNext) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 15px rgba(102,126,234,0.3)";
                    }
                  }}
                >
                  Next →
                </button>
              )}
            </>
          )}
        </div>

        {/* Skip button */}
        {canSkip && !isLastStep && (
          <button
            onClick={skipTour}
            style={{
              marginTop: "16px",
              width: "100%",
              padding: "10px",
              fontSize: "13px",
              fontWeight: "500",
              color: "#718096",
              background: "transparent",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              outline: "none",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              textDecorationColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#4a5568";
              e.currentTarget.style.textDecorationColor = "#4a5568";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#718096";
              e.currentTarget.style.textDecorationColor = "transparent";
            }}
          >
            Skip this tour
          </button>
        )}

        {/* Add shimmer animation styles */}
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }
);

ModernCard.displayName = "ModernCard";

export default ModernCard;
