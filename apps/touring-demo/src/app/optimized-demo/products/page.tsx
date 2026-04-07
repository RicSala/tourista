"use client";

import Link from "next/link";
import { useState } from "react";
import { useTour } from "tourista";
import { tourHelpers } from "../tourConfig";

export default function ProductsPage() {
  const {
    startTour,
    isActive,
    currentState,
    sendEvent,
    currentStepIndex,
    totalSteps,
  } = useTour("optimized-tour");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartError, setCartError] = useState(false);

  const products = [
    { id: 1, name: "Wireless Headphones", price: "$99.99", emoji: "🎧" },
    { id: 2, name: "Smart Watch", price: "$249.99", emoji: "⌚" },
    { id: 3, name: "Laptop Stand", price: "$49.99", emoji: "💻" },
    { id: 4, name: "USB-C Hub", price: "$79.99", emoji: "🔌" },
  ];

  const handleAddToCart = async (product: (typeof products)[0]) => {
    // Check if we're in the tour's add to cart pending state
    if (currentState === "step3_add_to_cart_pending") {
      const cartTask = tourHelpers.getAsyncTask("step3_add_to_cart");
      if (!cartTask) return;

      // Send start event to move to processing
      sendEvent({ type: cartTask.events.start });
      setIsAddingToCart(true);
      setCartSuccess(false);
      setCartError(false);

      // Simulate adding to cart with 50% chance of error
      try {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // 50% chance of error
            if (Math.random() < 0.2) {
              reject(new Error("Failed to add item to cart"));
            } else {
              resolve(true);
            }
          }, 2000);
        });

        setIsAddingToCart(false);
        setCartSuccess(true);
        sendEvent({ type: cartTask.events.success });

        // Clear success message after 3 seconds
        setTimeout(() => setCartSuccess(false), 3000);
      } catch (error) {
        setIsAddingToCart(false);
        setCartError(true);
        console.error("Cart error:", error);
        sendEvent({ type: cartTask.events.failed });

        // Clear error message after 3 seconds
        setTimeout(() => setCartError(false), 3000);
      }
    } else {
      // Regular add to cart (not in tour)
      alert(`Added ${product.name} to cart!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Banner */}
        <div
          id="welcome-banner"
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-8 mb-8 shadow-lg"
        >
          <h1 className="text-4xl font-bold mb-4">🛍️ Welcome to TechStore</h1>
          <p className="text-lg opacity-90">
            Discover amazing tech products at great prices!
          </p>
          {!isActive && (
            <button
              onClick={() => startTour("optimized-tour")}
              className="mt-4 px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              🚀 Start Shopping Tour (Optimized)
            </button>
          )}
        </div>

        {/* Product Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Featured Products
          </h2>
          <div
            id="product-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow relative"
              >
                <div className="text-6xl mb-4 text-center">{product.emoji}</div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-green-600 mb-4">
                  {product.price}
                </p>

                {/* Add to Cart Button */}
                <button
                  id={product.id === 1 ? "add-to-cart-btn" : undefined}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleAddToCart(product)}
                  disabled={isAddingToCart && product.id === 1}
                >
                  {isAddingToCart && product.id === 1
                    ? "Adding..."
                    : "Add to Cart"}
                </button>

                {/* Cart Spinner - shown during processing */}
                {isAddingToCart && product.id === 1 && (
                  <div
                    id="cart-spinner"
                    className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg"
                  >
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="mt-2 text-sm text-gray-600">
                        Adding to cart...
                      </span>
                    </div>
                  </div>
                )}

                {/* Success Message - shown after success */}
                {cartSuccess && product.id === 1 && (
                  <div
                    id="cart-success"
                    className="absolute inset-0 bg-green-50 bg-opacity-95 flex items-center justify-center rounded-lg"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">✅</div>
                      <span className="text-green-700 font-semibold">
                        Added to cart!
                      </span>
                    </div>
                  </div>
                )}

                {/* Error Message - shown after failure */}
                {cartError && product.id === 1 && (
                  <div
                    id="cart-error"
                    className="absolute inset-0 bg-red-50 bg-opacity-95 flex items-center justify-center rounded-lg"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">❌</div>
                      <span className="text-red-700 font-semibold">
                        Failed to add to cart
                      </span>
                      <span className="text-red-600 text-sm mt-1">
                        Please try again
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          <div className="flex gap-4">
            <Link href="/optimized-demo/checkout">
              <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Go to Checkout
              </button>
            </Link>
            <Link href="/optimized-demo">
              <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                About Optimized Tour
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
