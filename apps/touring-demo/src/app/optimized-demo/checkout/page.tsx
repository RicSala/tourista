"use client";

import Link from "next/link";
import { useState } from "react";
import { useTour } from "tourista";
import { tourConfig } from "../tourConfig";

export default function CheckoutPage() {
  const tour = useTour(tourConfig);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (tour?.currentState === "step5_payment_pending") {
      tour.tasks.step5_payment.start();
      setProcessingError(null);

      // Simulate payment processing
      try {
        await mockProcessPayment();
        tour.tasks.step5_payment.success();
      } catch {
        setProcessingError("Payment failed. Please try again.");
        tour.tasks.step5_payment.fail();
      }
    }
  };

  const mockProcessPayment = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 85% success rate
        if (Math.random() > 0.15) {
          console.log("Payment processed successfully");
          resolve();
        } else {
          console.log("Payment processing failed");
          reject(new Error("Payment declined"));
        }
      }, 3000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

        {/* Cart Summary */}
        <div
          id="cart-summary"
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span>🎧 Wireless Headphones</span>
              <span className="font-semibold">$99.99</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>⌚ Smart Watch</span>
              <span className="font-semibold">$249.99</span>
            </div>
            <div className="flex justify-between py-3 text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">$349.98</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div
          id="payment-form"
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Payment Button */}
            <button
              id="process-payment-btn"
              onClick={handlePayment}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              disabled={tour?.currentState === "step5_payment_processing"}
            >
              {tour?.currentState === "step5_payment_processing"
                ? "Processing..."
                : "Process Payment - $349.98!"}
            </button>

            {/* Error Message */}
            {processingError &&
              tour?.currentState === "step5_payment_pending" && (
                <div className="p-3 bg-red-100 rounded-lg border border-red-300">
                  <span className="text-red-700">{processingError}</span>
                </div>
              )}

            {/* Processing Spinner */}
            {tour?.currentState === "step5_payment_processing" && (
              <div
                id="payment-spinner"
                className="flex items-center justify-center gap-3 py-4"
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="text-gray-700">
                  Verifying payment details... (85% success rate)
                </span>
              </div>
            )}

            {/* Success Confirmation */}
            {tour?.currentState === "step5_payment_success" && (
              <div
                id="order-confirmation"
                className="p-4 bg-green-100 rounded-lg border-2 border-green-300"
              >
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  🎉 Order Confirmed!
                </h3>
                <p className="text-green-700 mb-4">
                  Thank you for your purchase! Your order #12345 has been
                  confirmed and will be shipped within 2-3 business days.
                </p>
                <Link href="/optimized-demo/review">
                  <button
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    onClick={() => tour.sendEvent({ type: "NEXT" })}
                  >
                    Continue to Review →
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          <div className="flex gap-4">
            <Link href="/optimized-demo/products">
              <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Back to Products
              </button>
            </Link>
            <Link href="/optimized-demo/review">
              <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Go to Review
              </button>
            </Link>
            <Link href="/optimized-demo">
              <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                About Optimized Tour
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
