"use client";
import { useState } from "react";
import { type CardTheme, CARD_THEMES } from "./cardThemes";
import { useShowcaseSettings } from "./useShowcaseSettings";

// Floating settings panel component
export function SettingsPanel() {
  const { cardTheme, setCardTheme, showDebug, setShowDebug } =
    useShowcaseSettings();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center"
        title="Tour Settings"
      >
        {isOpen ? (
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white px-4 py-3">
            <h3 className="font-semibold">Tour Settings</h3>
            <p className="text-xs text-slate-400">
              Customize the tour experience
            </p>
          </div>

          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {/* Card Theme */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Card Theme
              </label>
              <select
                value={cardTheme}
                onChange={(e) => setCardTheme(e.target.value as CardTheme)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {Object.entries(CARD_THEMES).map(([key, { name }]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Debug Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-sm font-medium text-slate-700">
                Show Debug Panel
              </span>
              <button
                onClick={() => setShowDebug(!showDebug)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showDebug ? "bg-indigo-600" : "bg-slate-200"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showDebug ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>

            {/* Info */}
            <div className="pt-2 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                Keyboard shortcuts: Arrow keys to navigate, Escape to skip.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
