"use client";

import Link from "next/link";
import { useState } from "react";
import { useTour } from "tourista";
import { tourConfig } from "../tourConfig";

export default function ReviewPage() {
  const { isActive, currentState, tasks, currentStepIndex, totalSteps } =
    useTour(tourConfig);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleSubmitReview = async () => {
    // Check if we're in the tour's submit review pending state
    if (currentState === "step6_submit_review_pending") {
      tasks.step6_submit_review.start();
      setIsSubmitting(true);
      setSubmitSuccess(false);
      setSubmitError(false);

      // Simulate submitting review with 80% success rate
      try {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // 80% chance of success for reviews
            if (Math.random() < 0.8) {
              resolve(true);
            } else {
              reject(new Error("Failed to submit review"));
            }
          }, 2500);
        });

        setIsSubmitting(false);
        setSubmitSuccess(true);
        tasks.step6_submit_review.success();

        // Clear success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000);
      } catch (error) {
        setIsSubmitting(false);
        setSubmitError(true);
        console.error("Review submission error:", error);
        tasks.step6_submit_review.fail();

        // Clear error message after 3 seconds
        setTimeout(() => setSubmitError(false), 3000);
      }
    } else {
      // Regular review submission (not in tour)
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        alert("✅ Thank you for your review!");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-8 mb-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-4">📝 Review Your Purchase</h1>
          <p className="text-lg opacity-90">
            We&apos;d love to hear about your shopping experience!
          </p>
        </div>

        {/* Review Form */}
        <div
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
          id="star-rating"
        >
          <h2
            id="review-form-title"
            className="text-2xl font-bold mb-6 text-gray-800"
          >
            Share Your Feedback
          </h2>

          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate your experience?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-4xl transition-transform hover:scale-110"
                  disabled={isSubmitting}
                >
                  {star <= rating ? "⭐" : "☆"}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {rating === 5 && "Excellent! 🎉"}
              {rating === 4 && "Great! 😊"}
              {rating === 3 && "Good 👍"}
              {rating === 2 && "Fair 😐"}
              {rating === 1 && "Poor 😔"}
            </p>
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label
              htmlFor="review-text"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tell us more about your experience (optional)
            </label>
            <textarea
              id="review-text-area"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="What did you like? What could be improved?"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <div className="relative">
            <button
              id="submit-review-btn"
              onClick={handleSubmitReview}
              disabled={isSubmitting || submitSuccess}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Submitting..."
                : submitSuccess
                ? "Submitted!"
                : "Submit Review"}
            </button>

            {/* Loading Overlay */}
            {isSubmitting && (
              <div
                id="review-spinner"
                className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg"
              >
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                  <span className="mt-3 text-sm text-gray-600">
                    Submitting your review...
                  </span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {submitSuccess && (
              <div
                id="review-success"
                className="absolute inset-0 bg-green-50 bg-opacity-95 flex items-center justify-center rounded-lg"
              >
                <div className="flex flex-col items-center">
                  <div className="text-5xl mb-2">🎉</div>
                  <span className="text-green-700 font-semibold text-lg">
                    Thank you for your review!
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div
                id="review-error"
                className="absolute inset-0 bg-red-50 bg-opacity-95 flex items-center justify-center rounded-lg"
              >
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-2">❌</div>
                  <span className="text-red-700 font-semibold">
                    Failed to submit review
                  </span>
                  <span className="text-red-600 text-sm mt-1">
                    Please try again
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div
          id="order-complete"
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            🛍️ Your Order is Complete!
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-semibold">
                #ORD-2024-{Math.floor(Math.random() * 10000)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Items Purchased:</span>
              <span className="font-semibold">Wireless Headphones</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Total Paid:</span>
              <span className="font-semibold text-green-600">$109.98</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Estimated Delivery:</span>
              <span className="font-semibold">3-5 Business Days</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">What&apos;s Next?</h3>
          <div className="flex gap-4">
            <Link href="/optimized-demo/products">
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Continue Shopping
              </button>
            </Link>
            <Link href="/optimized-demo">
              <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </div>

        {/* Debug info */}
        {isActive && currentState && (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700">
              Tour Active | Current State: {currentState} | Step{" "}
              {currentStepIndex + 1} of {totalSteps}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
