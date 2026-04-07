"use client";

import Link from "next/link";
import { useState } from "react";
import { useTour } from "tourista";
import { tourHelpers } from "../tourConfig";

export default function AsyncTasksPage() {
  const { startTour, isActive, sendEvent } = useTour("showcase-tour");

  const [taskState, setTaskState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);

  const handleDemoAction = async () => {
    // Check if we're in the tour's async demo pending state
    const asyncTask = tourHelpers.getAsyncTask("async_demo");

    // Send start event to move to processing
    if (asyncTask) {
      sendEvent({ type: asyncTask.events.start });
    }

    setTaskState("loading");
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 10;
      });
    }, 200);

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 90% success rate
          if (Math.random() > 0.1) {
            resolve(true);
          } else {
            reject(new Error("Simulated failure"));
          }
        }, 2500);
      });

      clearInterval(interval);
      setProgress(100);
      setTaskState("success");

      // Send success event (using captured asyncTask from start)
      if (asyncTask) {
        console.log("Sending success event:", asyncTask.events.success);
        sendEvent({ type: asyncTask.events.success });
      }
    } catch {
      clearInterval(interval);
      setTaskState("error");

      // Send failed event (using captured asyncTask from start)
      if (asyncTask) {
        sendEvent({ type: asyncTask.events.failed });
      }

      // Reset after delay
      setTimeout(() => {
        setTaskState("idle");
        setProgress(0);
      }, 2000);
    }
  };

  const resetDemo = () => {
    setTaskState("idle");
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16">
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
          <h1 className="text-4xl font-bold mb-4">Async Task Tracking</h1>
          <p className="text-xl text-white/80">
            See how Tourista tracks asynchronous operations through multiple
            states.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Demo Section */}
        <section id="async-demo-section" className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <div className="prose prose-slate mb-8">
              <p>
                Async steps in Tourista have three states:{" "}
                <strong>pending</strong>, <strong>processing</strong>, and{" "}
                <strong>success</strong>. The tour automatically transitions
                between these states based on events you send.
              </p>
              <ul>
                <li>
                  <strong>Pending:</strong> Waiting for the user to initiate the
                  action
                </li>
                <li>
                  <strong>Processing:</strong> The async operation is in
                  progress
                </li>
                <li>
                  <strong>Success:</strong> The operation completed successfully
                </li>
              </ul>
            </div>

            {/* Interactive Demo */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Interactive Demo
              </h3>

              {!isActive && (
                <div className="mb-6 p-4 bg-amber-100 rounded-lg border border-amber-200">
                  <p className="text-amber-800 text-sm">
                    Start the showcase tour to see async tracking in action, or
                    try the demo below.
                  </p>
                  <button
                    onClick={() => startTour("showcase-tour")}
                    className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                  >
                    Start Tour
                  </button>
                </div>
              )}

              {/* Action Button */}
              <div className="flex flex-col items-center gap-6">
                <button
                  id="demo-action-btn"
                  onClick={handleDemoAction}
                  disabled={taskState === "loading"}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {taskState === "idle" && "Simulate Async Task"}
                  {taskState === "loading" && "Processing..."}
                  {taskState === "success" && "Task Completed!"}
                  {taskState === "error" && "Task Failed"}
                </button>

                {/* Progress Indicator */}
                {taskState === "loading" && (
                  <div id="demo-spinner" className="w-full max-w-md">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600" />
                      <span className="text-slate-600">
                        Processing async task...
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-center text-sm text-slate-500 mt-2">
                      {progress}% complete
                    </p>
                  </div>
                )}

                {/* Success State */}
                {taskState === "success" && (
                  <div id="demo-success" className="text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <p className="text-green-700 font-semibold text-lg mb-4">
                      Async task completed successfully!
                    </p>
                    <button
                      onClick={resetDemo}
                      className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors"
                    >
                      Reset Demo
                    </button>
                  </div>
                )}

                {/* Error State */}
                {taskState === "error" && (
                  <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <p className="text-red-700 font-semibold">
                      Task failed. Resetting in 2 seconds...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Code Example */}
        <section className="mb-12">
          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">
              Configuration Example
            </h3>
            <pre className="text-sm overflow-x-auto text-slate-300">
              <code>{`{
  id: 'submit_form',
  type: 'async',
  page: '/dashboard',
  content: {
    pending: {
      targetElement: '#submit-btn',
      title: 'Submit Your Data',
      content: 'Click the button to submit.',
    },
    processing: {
      targetElement: '#loading-spinner',
      title: 'Submitting...',
      content: 'Please wait while we process.',
    },
    success: {
      targetElement: '#success-message',
      title: 'Done!',
      content: 'Your data has been submitted.',
    },
  },
}`}</code>
            </pre>
          </div>
        </section>

        {/* State Diagram */}
        <section>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              State Flow
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              {/* Pending */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center text-3xl border-4 border-amber-500">
                  ⏳
                </div>
                <span className="mt-2 font-semibold text-slate-700">
                  Pending
                </span>
                <span className="text-sm text-slate-500">
                  Waiting for action
                </span>
              </div>

              {/* Arrow */}
              <div className="hidden md:block text-4xl text-slate-300">→</div>
              <div className="md:hidden text-4xl text-slate-300">↓</div>

              {/* Processing */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl border-4 border-blue-500">
                  ⚙️
                </div>
                <span className="mt-2 font-semibold text-slate-700">
                  Processing
                </span>
                <span className="text-sm text-slate-500">In progress</span>
              </div>

              {/* Arrow */}
              <div className="hidden md:block text-4xl text-slate-300">→</div>
              <div className="md:hidden text-4xl text-slate-300">↓</div>

              {/* Success */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-3xl border-4 border-green-500">
                  ✅
                </div>
                <span className="mt-2 font-semibold text-slate-700">
                  Success
                </span>
                <span className="text-sm text-slate-500">Completed</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                <strong>Note:</strong> The processing state is optional. You can
                skip directly from pending to success if your async operation is
                instant or you don&apos;t need to show a loading state.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
