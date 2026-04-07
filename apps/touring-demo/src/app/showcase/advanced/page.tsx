"use client";

import Link from "next/link";
import { useState } from "react";
import { useTour } from "tourista";

export default function AdvancedPage() {
  const { startTour, isActive } = useTour("showcase-tour");
  const [keyPressed, setKeyPressed] = useState<string | null>(null);

  const handleKeyDemo = (e: React.KeyboardEvent) => {
    setKeyPressed(e.key);
    setTimeout(() => setKeyPressed(null), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-16">
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
          <h1 className="text-4xl font-bold mb-4">Advanced Features</h1>
          <p className="text-xl text-white/80">
            Keyboard navigation, auto-advance, guards, and viewports.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Controls Section */}
        <section id="controls-section" className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Navigation Controls
            </h2>

            <div className="prose prose-slate mb-8">
              <p>
                Control how users navigate through your tour with granular
                permissions per step.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* canNext */}
              <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-3xl mb-3">➡️</div>
                <h3 className="font-semibold text-slate-900 mb-2">canNext</h3>
                <p className="text-sm text-slate-600">
                  Controls whether the &quot;Next&quot; button is enabled. Set
                  to <code>false</code> to require an action before proceeding.
                </p>
              </div>

              {/* canPrev */}
              <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
                <div className="text-3xl mb-3">⬅️</div>
                <h3 className="font-semibold text-slate-900 mb-2">canPrev</h3>
                <p className="text-sm text-slate-600">
                  Controls the &quot;Back&quot; button. Set to{" "}
                  <code>false</code> to prevent going back after completing a
                  critical action.
                </p>
              </div>

              {/* canSkip */}
              <div className="p-6 bg-red-50 rounded-xl border border-red-200">
                <div className="text-3xl mb-3">⏭️</div>
                <h3 className="font-semibold text-slate-900 mb-2">canSkip</h3>
                <p className="text-sm text-slate-600">
                  Controls skip functionality per step. Set to{" "}
                  <code>false</code> for mandatory steps that must be completed.
                </p>
              </div>
            </div>

            {/* Keyboard Navigation */}
            <div className="bg-slate-900 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
              <p className="text-slate-400 text-sm mb-6">
                Built-in keyboard navigation for accessibility. Try pressing
                these keys:
              </p>

              <div
                className="flex flex-wrap gap-4 justify-center"
                tabIndex={0}
                onKeyDown={handleKeyDemo}
              >
                <div
                  className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                    keyPressed === "ArrowRight"
                      ? "bg-emerald-500 scale-110"
                      : "bg-slate-800"
                  }`}
                >
                  <kbd className="px-3 py-2 bg-slate-700 rounded text-lg font-mono mb-2">
                    →
                  </kbd>
                  <span className="text-xs text-slate-400">Next Step</span>
                </div>

                <div
                  className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                    keyPressed === "ArrowLeft"
                      ? "bg-emerald-500 scale-110"
                      : "bg-slate-800"
                  }`}
                >
                  <kbd className="px-3 py-2 bg-slate-700 rounded text-lg font-mono mb-2">
                    ←
                  </kbd>
                  <span className="text-xs text-slate-400">Previous Step</span>
                </div>

                <div
                  className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                    keyPressed === "Escape"
                      ? "bg-emerald-500 scale-110"
                      : "bg-slate-800"
                  }`}
                >
                  <kbd className="px-3 py-2 bg-slate-700 rounded text-lg font-mono mb-2">
                    Esc
                  </kbd>
                  <span className="text-xs text-slate-400">Skip Tour</span>
                </div>
              </div>

              <p className="text-center text-xs text-slate-500 mt-4">
                Click here and press a key to test
              </p>
            </div>
          </div>
        </section>

        {/* Auto-Advance Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Auto-Advance
            </h2>

            <div className="prose prose-slate mb-6">
              <p>
                Steps can automatically advance after a configurable delay.
                Great for hands-free demos or when you want to control the
                pacing.
              </p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
              <div className="flex items-start gap-4">
                <div className="text-4xl">⏱️</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    How It Works
                  </h3>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>
                      Set <code>autoAdvance: 3000</code> to advance after 3
                      seconds
                    </li>
                    <li>Timer starts when the step becomes active</li>
                    <li>
                      User can still manually navigate before timer completes
                    </li>
                    <li>Timer is cleared if user leaves the step</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-900 rounded-xl p-6">
              <pre className="text-sm text-slate-300 overflow-x-auto">
                <code>{`{
  id: 'welcome',
  page: '/dashboard',
  targetElement: '#hero',
  title: 'Welcome!',
  content: 'This message will auto-advance...',
  autoAdvance: 5000,  // Advance after 5 seconds
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Viewport Section */}
        <section id="viewport-section" className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Custom Viewports
            </h2>

            <div className="prose prose-slate mb-6">
              <p>
                By default, tours use the browser window as the viewport. You
                can constrain tours to custom containers using the{" "}
                <code>viewportId</code> prop.
              </p>
            </div>

            {/* Custom Viewport Demo */}
            <div
              id="custom-viewport"
              className="relative bg-slate-100 rounded-xl p-6 h-64 overflow-auto border-2 border-dashed border-slate-300"
            >
              <div className="space-y-4">
                {/* Intro content */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-slate-900">
                    Scrollable Content Area
                  </h4>
                  <p className="text-sm text-slate-600">
                    This is inside a custom viewport. Tour elements inside here
                    will be constrained to this container.
                  </p>
                </div>

                {/* More scrollable content */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-slate-900">More Content</h4>
                  <p className="text-sm text-slate-600">
                    Scroll down to see more content. The viewport boundary is
                    this container.
                  </p>
                </div>

                {/* Target element */}
                <div
                  className="bg-emerald-100 p-4 rounded-lg border border-emerald-300"
                  id="target-element"
                >
                  <h4 className="font-semibold text-emerald-900">
                    Target Element
                  </h4>
                  <p className="text-sm text-emerald-700">
                    A tour step can target this element using viewportId to
                    constrain the spotlight to this container.
                  </p>
                </div>

                {/* Additional content below the target */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-slate-900">
                    Even More Content
                  </h4>
                  <p className="text-sm text-slate-600">
                    The scrollable area continues with more content to
                    demonstrate the viewport boundaries.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-slate-500 mt-4">
              Scroll within the container above - tour elements would be
              constrained to it
            </p>
          </div>
        </section>

        {/* Callbacks Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Lifecycle Callbacks
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">
                  onComplete
                </h3>
                <p className="text-sm text-slate-600">
                  Called when the tour finishes all steps successfully.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">onSkip</h3>
                <p className="text-sm text-slate-600">
                  Called when the user skips the tour. Includes step index and
                  ID.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">
                  onStepChange
                </h3>
                <p className="text-sm text-slate-600">
                  Called on every step transition. Great for analytics.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">onStart</h3>
                <p className="text-sm text-slate-600">
                  Called when the tour begins. Initialize tracking here.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-slate-900 rounded-xl p-6">
              <pre className="text-sm text-slate-300 overflow-x-auto">
                <code>{`<TourMachineReact
  onComplete={(tourId) => {
    analytics.track('tour_completed', { tourId });
  }}
  onSkip={(stepIndex, stepId, tourId) => {
    analytics.track('tour_skipped', {
      tourId, stepId, stepIndex
    });
  }}
  onStepChange={(stepIndex, stepId, tourId) => {
    analytics.track('tour_step', {
      tourId, stepId, stepIndex
    });
  }}
/>`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Start Tour CTA */}
        {!isActive && (
          <div className="text-center">
            <button
              onClick={() => startTour("showcase-tour")}
              className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-emerald-700 transition-all"
            >
              Start Showcase Tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
