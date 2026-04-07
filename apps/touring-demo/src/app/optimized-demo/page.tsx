"use client";

import Link from "next/link";
import { useTour } from "tourista";

export default function OptimizedDemoPage() {
  const { startTour, endTour, isActive } = useTour("optimized-tour");

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          🚀 Optimized Tour Implementation
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Lazy Initialization Pattern
          </h2>

          <div className="space-y-4 text-gray-600 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">
                ✅ Key Benefits:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Zero overhead when tour is not active</li>
                <li>Actor only created when tour starts</li>
                <li>Event listeners only attached during tour</li>
                <li>Clean teardown when tour completes</li>
                <li>Memory freed after tour ends</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                🔧 How it works:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  <code>OptimizedTourContext</code> provides minimal API
                  (start/end)
                </li>
                <li>
                  When tour starts, <code>TourMachineReact</code> component
                  renders
                </li>
                <li>
                  This component creates actor and sets up all subscriptions
                </li>
                <li>
                  When tour ends, component unmounts and cleans up everything
                </li>
                <li>No resources used until explicitly needed</li>
              </ol>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => startTour("optimized-tour")}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold disabled:opacity-50"
              disabled={isActive}
            >
              {isActive ? `🎯 Tour Active` : "🚀 Start Optimized Tour"}
            </button>

            {isActive && (
              <button
                onClick={endTour}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
              >
                ⏹️ End Tour
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-semibold mb-4 text-gray-700">
            Performance Comparison
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-red-50 p-4 rounded">
              <h4 className="font-semibold text-red-700 mb-2">
                ❌ Original Implementation
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Actor created on app load</li>
                <li>• Event listeners always active</li>
                <li>• Memory used even if never started</li>
                <li>• Subscriptions persist</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <h4 className="font-semibold text-green-700 mb-2">
                ✅ Optimized Implementation
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Actor created on demand</li>
                <li>• Event listeners only when active</li>
                <li>• Zero memory footprint when idle</li>
                <li>• Full cleanup on completion</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg shadow p-6 border border-purple-200">
          <h3 className="font-semibold mb-2 text-purple-800">
            💡 Implementation Note
          </h3>
          <p className="text-sm text-purple-700">
            Open DevTools console to see the lifecycle logs. Notice how the
            actor is only created when you click &quot;Start Tour&quot; and
            properly cleaned up when the tour ends.
          </p>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold mb-4 text-gray-700">
            🔧 Developer Tools
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/optimized-demo/visualize">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                📊 Interactive Visualizer
              </button>
            </Link>
            <Link href="/optimized-demo/mermaid">
              <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
                📈 Diagram Generators
              </button>
            </Link>
            <Link href="/optimized-demo/products">
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                🛍️ Try Tour Demo
              </button>
            </Link>
            <Link href="/">
              <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
                ← Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
