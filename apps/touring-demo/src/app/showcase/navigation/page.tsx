"use client";

import Link from "next/link";
import { useTour } from "tourista";

export default function NavigationPage() {
  const { startTour, isActive, currentState, currentStepIndex, totalSteps } =
    useTour("showcase-tour");

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-16">
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
          <h1 className="text-4xl font-bold mb-4">Cross-Page Navigation</h1>
          <p className="text-xl text-white/80">
            Tours seamlessly continue across different pages and routes.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Navigation Section */}
        <section id="navigation-section" className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <div className="prose prose-slate mb-8">
              <p>
                Tourista automatically detects page navigation and continues the
                tour on the new page. This works with:
              </p>
              <ul>
                <li>Next.js App Router and Pages Router</li>
                <li>React Router and other SPA routers</li>
                <li>Traditional page navigation</li>
                <li>Browser back/forward buttons</li>
              </ul>
            </div>

            {/* Page Indicator */}
            <div
              id="page-indicator"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 text-white"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                  📍
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    You&apos;re on the Navigation Page
                  </h3>
                  <p className="text-white/80">
                    The tour successfully followed you here from the previous
                    page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Demo */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Try Navigation
            </h2>

            {!isActive && (
              <div className="mb-6 p-4 bg-cyan-100 rounded-lg border border-cyan-200">
                <p className="text-cyan-800 text-sm mb-2">
                  Start the tour to see cross-page navigation in action.
                </p>
                <button
                  onClick={() => startTour("showcase-tour")}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
                >
                  Start Tour
                </button>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/showcase"
                className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
              >
                <div className="text-3xl mb-3">🏠</div>
                <h3 className="font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">
                  Home
                </h3>
                <p className="text-sm text-slate-600">Back to showcase home</p>
              </Link>

              <Link
                href="/showcase/async-tasks"
                className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
              >
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">
                  Async Tasks
                </h3>
                <p className="text-sm text-slate-600">
                  Learn about async tracking
                </p>
              </Link>

              <Link
                href="/showcase/custom-cards"
                className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
              >
                <div className="text-3xl mb-3">🎨</div>
                <h3 className="font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">
                  Custom Cards
                </h3>
                <p className="text-sm text-slate-600">See card customization</p>
              </Link>
            </div>
          </div>
        </section>

        {/* State Preservation */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              State Preservation
            </h2>
            <p className="text-slate-600 mb-6">
              Tour state is preserved across navigation. The current step,
              progress, and context all persist when moving between pages.
            </p>

            {isActive && currentState && (
              <div className="bg-cyan-50 rounded-xl p-6 border border-cyan-200">
                <h3 className="font-semibold text-cyan-900 mb-4">
                  Current Tour State
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Current State:</span>
                    <span className="ml-2 font-mono text-cyan-700">
                      {currentState}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Step:</span>
                    <span className="ml-2 font-mono text-cyan-700">
                      {currentStepIndex + 1} / {totalSteps}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!isActive && (
              <div className="bg-slate-50 rounded-xl p-6">
                <p className="text-slate-500 text-center">
                  Start a tour to see state information here
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Code Example */}
        <section>
          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Configuration</h3>
            <pre className="text-sm overflow-x-auto text-slate-300">
              <code>{`const tourConfig = {
  id: 'multi-page-tour',
  steps: [
    {
      id: 'step1',
      page: '/dashboard',  // First page
      targetElement: '#sidebar',
      title: 'Welcome',
      content: 'Let me show you around.',
    },
    {
      id: 'step2',
      page: '/settings',  // Different page!
      targetElement: '#profile',
      title: 'Settings',
      content: 'Manage your preferences here.',
    },
  ],
};`}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
