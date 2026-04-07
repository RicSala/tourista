"use client";

import Link from "next/link";
import { useTour } from "tourista";

export default function CustomizationPage() {
  const { startTour, isActive } = useTour("showcase-tour");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-16">
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
          <h1 className="text-4xl font-bold mb-4">Customization Options</h1>
          <p className="text-xl text-white/80">
            Learn about the various customization options available in Tourista.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Overlay Section */}
        <section id="overlay-section" className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Spotlight Overlay
            </h2>

            <div className="prose prose-slate mb-8">
              <p>
                The spotlight overlay highlights target elements by dimming the
                rest of the page. This helps users focus on the element being
                explained.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Automatic Positioning
                </h3>
                <p className="text-sm text-slate-600">
                  The spotlight automatically positions itself around the target
                  element specified in your tour config using CSS selectors.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Smooth Transitions
                </h3>
                <p className="text-sm text-slate-600">
                  The spotlight smoothly animates between steps, creating a
                  polished experience for your users.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Dynamic Updates
                </h3>
                <p className="text-sm text-slate-600">
                  The spotlight updates automatically when the target element
                  changes size or position, such as on window resize.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Scroll Handling
                </h3>
                <p className="text-sm text-slate-600">
                  If the target element is off-screen, Tourista automatically
                  scrolls it into view before showing the spotlight.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Positioning Section */}
        <section id="positioning-demo" className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Card Positioning
            </h2>

            <div className="prose prose-slate mb-8">
              <p>
                Tour cards use Floating UI to intelligently position themselves
                relative to the target element. The card will automatically flip
                or shift to stay visible.
              </p>
            </div>

            {/* Visual Demo */}
            <div className="relative aspect-video bg-slate-100 rounded-xl overflow-hidden mb-6">
              {/* Target element */}
              <div
                className="absolute bg-indigo-500 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "100px",
                  height: "50px",
                }}
              >
                Target Element
              </div>

              {/* Position indicators */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white rounded shadow text-xs text-slate-600">
                Top
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white rounded shadow text-xs text-slate-600">
                Bottom
              </div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-white rounded shadow text-xs text-slate-600">
                Left
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-white rounded shadow text-xs text-slate-600">
                Right
              </div>
            </div>

            <p className="text-sm text-slate-600 text-center">
              Cards can be positioned on any side of the target element
            </p>
          </div>
        </section>

        {/* Custom Cards Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Custom Card Components
            </h2>

            <div className="prose prose-slate mb-6">
              <p>
                The most powerful customization is providing your own card
                component. This gives you complete control over the tour UI to
                match your brand.
              </p>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 text-white">
              <pre className="text-sm overflow-x-auto text-slate-300">
                <code>{`// Your custom card component
const MyCard = forwardRef<HTMLDivElement, CardProps>(
  ({ title, content, nextStep, prevStep, ... }, ref) => (
    <div ref={ref} className="my-custom-card">
      <h2>{title}</h2>
      <p>{content}</p>
      <button onClick={prevStep}>Back</button>
      <button onClick={nextStep}>Next</button>
    </div>
  )
);

// Use it in TourMachine
<TourMachine
  tourConfig={config}
  customCard={MyCard}
/>`}</code>
              </pre>
            </div>

            <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-sm text-indigo-800">
                <strong>Tip:</strong> Check out the{" "}
                <Link
                  href="/showcase/custom-cards"
                  className="underline hover:no-underline"
                >
                  Custom Cards page
                </Link>{" "}
                to see different card themes in action and switch between them
                live.
              </p>
            </div>
          </div>
        </section>

        {/* Start Tour CTA */}
        {!isActive && (
          <div className="text-center">
            <button
              onClick={() => startTour("showcase-tour")}
              className="px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-slate-800 transition-all"
            >
              Start Showcase Tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
