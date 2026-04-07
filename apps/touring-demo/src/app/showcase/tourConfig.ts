import {
  BaseTourEvent,
  createTourHelpers,
  ExtractStates,
  generateTourMachine,
  TourConfig,
  TourContext,
} from "tourista";

/**
 * Showcase Tour Configuration
 * Demonstrates all Tourista features in one comprehensive tour
 */
export const showcaseTourConfig = {
  id: "showcase-tour",
  steps: [
    // === HOME PAGE - Introduction ===
    // {
    //   id: "welcome",
    //   page: "/showcase",
    //   targetElement: "#hero-section",
    //   title: "Welcome to Tourista",
    //   content:
    //     "This interactive tour will showcase all the features of the Tourista library. Watch how the spotlight highlights elements!",
    //   autoAdvance: 4000,
    // },
    // {
    //   id: "features_overview",
    //   page: "/showcase",
    //   targetElement: "#features-grid",
    //   title: "Feature Overview",
    //   content:
    //     "Tourista offers a comprehensive set of features for building product tours. Each card below represents a key capability.",
    // },

    // // === FEATURE: Async Tasks ===
    // {
    //   id: "async_intro",
    //   page: "/showcase/async-tasks",
    //   targetElement: "#async-demo-section",
    //   title: "Async Task Support",
    //   content:
    //     "Tourista can track async operations with three states: pending, processing, and success. Perfect for API calls, form submissions, or any async action.",
    // },
    {
      id: "async_demo",
      type: "async",
      page: "/showcase/async-tasks",
      content: {
        pending: {
          targetElement: "#demo-action-btn",
          title: "Try It: Async Task",
          content:
            "Click the button below to simulate an async operation. The tour will wait and track its progress.",
        },
        processing: {
          targetElement: "#demo-spinner",
          title: "Processing...",
          content:
            "The tour is now tracking the async operation. Notice how the spotlight follows the loading state.",
        },
        success: {
          targetElement: "#demo-success",
          title: "Task Complete!",
          content:
            "The async task finished successfully. The tour automatically advanced when the operation completed.",
        },
      },
      events: {
        start: "START_ASYNC_DEMO",
        success: "ASYNC_DEMO_SUCCESS",
        failed: "ASYNC_DEMO_FAILED",
      },
    },

    // // === FEATURE: Page Navigation ===
    // {
    //   id: "navigation_intro",
    //   page: "/showcase/navigation",
    //   targetElement: "#navigation-section",
    //   title: "Cross-Page Navigation",
    //   content:
    //     "Tours can seamlessly navigate between pages. Tourista detects page changes and continues the tour automatically.",
    // },
    // {
    //   id: "navigation_demo",
    //   page: "/showcase/navigation",
    //   targetElement: "#page-indicator",
    //   title: "You Navigated Here!",
    //   content:
    //     "See? The tour followed you to this page. This works with Next.js routing, SPAs, and traditional page loads.",
    //   autoAdvance: 3000,
    // },

    // // === FEATURE: Custom Cards ===
    // {
    //   id: "cards_intro",
    //   page: "/showcase/custom-cards",
    //   targetElement: "#cards-section",
    //   title: "Customizable UI Cards",
    //   content:
    //     "The tour card UI is fully customizable. You can use the default card or provide your own React component.",
    // },
    // {
    //   id: "cards_gallery",
    //   page: "/showcase/custom-cards",
    //   targetElement: "#card-gallery",
    //   title: "Card Gallery",
    //   content:
    //     "Try switching between different card themes using the selector. Each card receives the same props but renders differently.",
    // },

    // // === FEATURE: Overlay Customization ===
    // {
    //   id: "overlay_intro",
    //   page: "/showcase/customization",
    //   targetElement: "#overlay-section",
    //   title: "Overlay Customization",
    //   content:
    //     "Customize the spotlight overlay: adjust radius, padding, opacity, and color to match your brand.",
    // },
    // {
    //   id: "positioning_demo",
    //   page: "/showcase/customization",
    //   targetElement: "#positioning-demo",
    //   title: "Card Positioning",
    //   content:
    //     "Cards can be positioned on any side of the target element with configurable distance. Try the controls!",
    // },

    // // === FEATURE: Advanced Controls ===
    // {
    //   id: "controls_intro",
    //   page: "/showcase/advanced",
    //   targetElement: "#controls-section",
    //   title: "Advanced Controls",
    //   content:
    //     "Control navigation with canNext, canPrev, and canSkip per step. Use keyboard shortcuts: arrows to navigate, Escape to skip.",
    //   canPrev: false, // Demonstrate canPrev
    // },
    {
      id: "viewport_demo",
      page: "/showcase/advanced",
      targetElement: "#viewport-section",
      title: "Custom Viewports",
      content:
        "Tours can be constrained to custom viewport containers. This element is inside a scrollable container with its own boundary.",
    },
    {
      id: "target_element",
      page: "/showcase/advanced",
      targetElement: "#target-element",
      title: "Target Element",
      viewportId: "custom-viewport",
      content:
        "Tours can be constrained to custom viewport containers. This element is inside a scrollable container with its own boundary.",
    },

    // === COMPLETION ===
    {
      id: "completion",
      page: "/showcase",
      targetElement: "#completion-section",
      title: "Tour Complete!",
      content:
        "You've explored all the key features of Tourista. Ready to build amazing product tours?",
    },
  ],
  allowSkip: true,
} as const satisfies TourConfig;

export const tourHelpers = createTourHelpers(showcaseTourConfig);

export type ShowcaseTourStates = ExtractStates<typeof showcaseTourConfig>;

export const tourMachineConfig = generateTourMachine<
  TourContext,
  BaseTourEvent
>(showcaseTourConfig);
