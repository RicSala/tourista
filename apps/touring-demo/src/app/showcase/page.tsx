"use client";

import Link from "next/link";
import { useTour } from "tourista";

export default function ShowcasePage() {
  const { startTour, endTour, isActive } = useTour("showcase-tour");

  const features = [
    {
      icon: "🎯",
      title: "Element Spotlight",
      description:
        "Highlight any DOM element with a customizable spotlight overlay. Supports CSS selectors and dynamic elements.",
      link: "/showcase/customization",
    },
    {
      icon: "⚡",
      title: "Async Task Tracking",
      description:
        "Track pending, processing, and success states for async operations. Perfect for API calls and form submissions.",
      link: "/showcase/async-tasks",
    },
    {
      icon: "🧭",
      title: "Cross-Page Navigation",
      description:
        "Tours seamlessly continue across page navigation. Automatic detection of route changes with state preservation.",
      link: "/showcase/navigation",
    },
    {
      icon: "🎨",
      title: "Custom UI Cards",
      description:
        "Fully customizable tour cards. Use the built-in default or provide your own React component.",
      link: "/showcase/custom-cards",
    },
    {
      icon: "⚙️",
      title: "Overlay Customization",
      description:
        "Configure spotlight radius, padding, opacity, and color. Position cards on any side with adjustable distance.",
      link: "/showcase/customization",
    },
    {
      icon: "⌨️",
      title: "Keyboard Navigation",
      description:
        "Built-in keyboard support: Arrow keys to navigate, Escape to skip. Accessible by default.",
      link: "/showcase/advanced",
    },
    {
      icon: "🔄",
      title: "Auto-Advance",
      description:
        "Steps can auto-advance after a configurable delay. Great for walkthroughs and demos.",
      link: "/showcase/advanced",
    },
    {
      icon: "🔒",
      title: "Navigation Guards",
      description:
        "Control navigation with canNext, canPrev, and canSkip per step. Enforce completion of required actions.",
      link: "/showcase/advanced",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section
        id="hero-section"
        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Open Source Product Tour Library
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
              <span className="block">Build Beautiful</span>
              <span className="block bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                Product Tours
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-white/80 mb-10">
              Tourista is a powerful, configuration-driven tour library with
              state machine architecture. Create engaging onboarding experiences
              with minimal code.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  startTour("showcase-tour");
                }}
                disabled={isActive}
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isActive ? "Tour in Progress..." : "Start Interactive Tour"}
              </button>

              <Link
                href="https://docs.tourista.dev"
                target="_blank"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                Read Documentation
              </Link>
            </div>

            {isActive && (
              <button
                onClick={endTour}
                className="mt-4 text-sm text-white/60 hover:text-white underline underline-offset-4"
              >
                End Tour Early
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features-grid" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A comprehensive toolkit for building product tours that delight
            users and drive engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="group p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Code Example Section */}
      <section className="bg-slate-900 text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Configuration-Driven</h2>
              <p className="text-xl text-slate-400 mb-8">
                Define your tour with a simple configuration object. Tourista
                generates all the state machine logic automatically.
              </p>
              <ul className="space-y-4">
                {[
                  "Type-safe with full TypeScript support",
                  "Automatic state machine generation",
                  "Built-in support for async operations",
                  "Zero runtime overhead when inactive",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 font-mono text-sm overflow-hidden">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <pre className="text-slate-300 overflow-x-auto">
                <code>{`const tourConfig = {
  id: 'onboarding',
  steps: [
    {
      id: 'welcome',
      page: '/dashboard',
      targetElement: '#sidebar',
      title: 'Welcome!',
      content: 'Let me show you around.',
      autoAdvance: 3000,
    },
    {
      id: 'create_item',
      type: 'async',
      page: '/dashboard',
      content: {
        pending: { title: 'Create Item', ... },
        processing: { title: 'Creating...', ... },
        success: { title: 'Created!', ... },
      },
    },
  ],
};`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Links */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Try the Demos
          </h2>
          <p className="text-xl text-slate-600">
            Explore specific features in detail with our interactive demos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Link
            href="/showcase/async-tasks"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-white hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-2">Async Tasks</h3>
              <p className="text-white/80">
                See how tours track async operations with multiple states.
              </p>
            </div>
          </Link>

          <Link
            href="/showcase/custom-cards"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-8 text-white hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-2">Custom Cards</h3>
              <p className="text-white/80">
                Browse different card themes and see how customization works.
              </p>
            </div>
          </Link>

          <Link
            href="/showcase/navigation"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-8 text-white hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="text-5xl mb-4">🧭</div>
              <h3 className="text-2xl font-bold mb-2">Navigation</h3>
              <p className="text-white/80">
                Experience seamless cross-page tour navigation.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Completion Section (Tour target) */}
      <section
        id="completion-section"
        className="bg-gradient-to-br from-green-500 to-emerald-600 text-white py-24"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-white/80 mb-8">
            Install Tourista and start building amazing product tours today.
          </p>
          <div className="inline-flex items-center gap-4 bg-white/10 rounded-xl px-6 py-4 backdrop-blur-sm">
            <code className="text-lg font-mono">npm install tourista</code>
            <button
              onClick={() =>
                navigator.clipboard.writeText("npm install tourista")
              }
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span className="text-xl font-bold text-white">Tourista</span>
            </div>
            <div className="flex gap-6">
              <Link
                href="https://docs.tourista.dev"
                className="hover:text-white transition-colors"
              >
                Documentation
              </Link>
              <Link
                href="https://github.com/tinystack/tourista"
                className="hover:text-white transition-colors"
              >
                GitHub
              </Link>
              <Link
                href="/optimized-demo"
                className="hover:text-white transition-colors"
              >
                E-commerce Demo
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
