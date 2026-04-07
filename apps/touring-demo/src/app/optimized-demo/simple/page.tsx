"use client";

import { useTour } from "tourista";

export default function SimplePage() {
  const { startTour, isActive, currentState } = useTour("optimized-tour");

  return (
    <div className="p-8">
      <h1 id="title" className="text-3xl mb-4">
        Simple Tour Test
      </h1>

      <div id="content" className="mb-4 p-4 border">
        This is some content
      </div>

      <button
        id="start-btn"
        onClick={() => startTour("optimized-tour")}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Start Tour
      </button>

      <div className="mt-4 p-4 bg-gray-100">
        <p>Tour Active: {isActive ? "Yes" : "No"}</p>
        <p>Tour State: {currentState ?? "none"}</p>
      </div>
    </div>
  );
}
