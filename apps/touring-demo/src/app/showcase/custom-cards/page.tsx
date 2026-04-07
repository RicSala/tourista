"use client";

import Link from "next/link";
import { useTour } from "tourista";
import { CARD_THEMES, type CardTheme } from "../layout";
import { useShowcaseSettings } from "../useShowcaseSettings";

export default function CustomCardsPage() {
  const { startTour, isActive } = useTour("showcase-tour");
  const { cardTheme, setCardTheme } = useShowcaseSettings();

  const cardPreviews: { theme: CardTheme; description: string }[] = [
    {
      theme: "default",
      description:
        "Clean and simple with all essential features. Great starting point.",
    },
    {
      theme: "modern",
      description:
        "Glassmorphism style with gradient accents and smooth animations.",
    },
    {
      theme: "minimal",
      description:
        "Stripped down to essentials. Perfect for subtle, non-intrusive tours.",
    },
    {
      theme: "brutalist",
      description: "Bold borders and stark contrasts. Makes a statement.",
    },
    {
      theme: "neumorphism",
      description: "Soft shadows and subtle depth. Modern and tactile feel.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-purple-50">
      {/* Header */}
      <div className="bg-linear-to-r from-violet-500 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/showcase"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Showcase
          </Link>
          <h1 className="text-4xl font-bold mb-4">Custom Tour Cards</h1>
          <p className="text-xl text-white/80">
            Fully customizable card components to match your brand.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Cards Section */}
        <section id="cards-section" className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <div className="prose prose-slate mb-8">
              <p>
                Tourista uses a default card component, but you can provide your
                own React component to completely customize the tour UI. Your
                custom card receives these props:
              </p>
              <ul>
                <li>
                  <code>title</code>, <code>content</code> - Step content
                </li>
                <li>
                  <code>currentStepIndex</code>, <code>totalSteps</code> -
                  Progress info
                </li>
                <li>
                  <code>canGoNext</code>, <code>canGoPrev</code>,{" "}
                  <code>canSkip</code> - Navigation state
                </li>
                <li>
                  <code>nextStep</code>, <code>prevStep</code>,{" "}
                  <code>skipTour</code>, <code>endTour</code> - Actions
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Card Gallery */}
        <section id="card-gallery" className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Card Gallery
            </h2>

            <div className="mb-6 p-4 bg-amber-100 rounded-lg border border-amber-200">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> This demo shows the available card
                themes. To use a custom card, pass it via the{" "}
                <code>customCard</code> prop to <code>TourMachine</code> in your
                implementation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cardPreviews.map(({ theme, description }) => (
                <button
                  key={theme}
                  onClick={() => setCardTheme(theme)}
                  className={`p-6 rounded-xl text-left transition-all ${
                    cardTheme === theme
                      ? "bg-violet-600 text-white shadow-lg scale-105"
                      : "bg-slate-50 text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <h3 className="font-semibold mb-2">
                    {CARD_THEMES[theme].name}
                  </h3>
                  <p
                    className={`text-sm ${
                      cardTheme === theme ? "text-white/80" : "text-slate-600"
                    }`}
                  >
                    {description}
                  </p>
                  {cardTheme === theme && (
                    <div className="mt-3 inline-flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Active
                    </div>
                  )}
                </button>
              ))}
            </div>

            {!isActive && (
              <div className="mt-8 text-center">
                <p className="text-slate-600 mb-4">
                  Start the tour to see your selected card theme in action.
                </p>
                <button
                  onClick={() => startTour("showcase-tour")}
                  className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors"
                >
                  Start Tour with {CARD_THEMES[cardTheme].name} Card
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Code Example */}
        <section>
          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">
              Custom Card Component
            </h3>
            <pre className="text-sm overflow-x-auto text-slate-300">
              <code>{`import { CardProps } from 'tourista';

const MyCustomCard = forwardRef<HTMLDivElement, CardProps>(
  ({ title, content, currentStepIndex, totalSteps,
     canGoNext, canGoPrev, nextStep, prevStep,
     skipTour, endTour, style }, ref) => {
    return (
      <div ref={ref} style={style} className="my-card">
        <h2>{title}</h2>
        <p>{content}</p>
        <div className="progress">
          {currentStepIndex + 1} / {totalSteps}
        </div>
        <div className="buttons">
          <button onClick={prevStep} disabled={!canGoPrev}>
            Back
          </button>
          <button onClick={nextStep} disabled={!canGoNext}>
            Next
          </button>
        </div>
        <button onClick={skipTour}>Skip</button>
      </div>
    );
  }
);

// Use it in TourMachineReact
<TourMachineReact customCard={MyCustomCard} />`}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
