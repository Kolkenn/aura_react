import { useState, useEffect } from "react";

/**
 * Hook to get the computed color values for the current theme
 * Useful for Canvas/Chart.js where CSS variables might need to be resolved to actual values
 * or when using color-mix isn't fully supported in all chart features.
 */
export const useChartColors = () => {
  const [colors, setColors] = useState({
    primary: "rgb(236, 72, 153)", // Default pink/magenta fallback
    background: "rgba(236, 72, 153, 0.1)",
  });

  useEffect(() => {
    const updateColors = () => {
      // Create temporary elements to resolve current theme colors
      const container = document.createElement("div");
      container.style.display = "none";

      const elPrimary = document.createElement("div");
      elPrimary.className = "text-primary";

      const elBackground = document.createElement("div");
      elBackground.className = "text-primary/10"; // Try tailwind opacity modifier

      container.appendChild(elPrimary);
      container.appendChild(elBackground);
      document.body.appendChild(container);

      const computedPrimary = window.getComputedStyle(elPrimary).color;
      const computedBackground = window.getComputedStyle(elBackground).color;

      document.body.removeChild(container);

      if (computedPrimary) {
        // If the opacity modifier worked, computedBackground will be different (rgba)
        // If it didn't work (returned same as primary or empty), we fallback to color-mix
        let finalBackground = computedBackground;

        if (!computedBackground || computedBackground === computedPrimary) {
          // Fallback: try to manually mix using canvas logic or simple string manipulation
          // But since we can't easily parse OKLCH in JS without lib, we rely on color-mix if supported CSS
          // We can try to set inline style color-mix
          const mixEl = document.createElement("div");
          mixEl.style.color =
            "color-mix(in srgb, var(--color-primary, currentColor), transparent 90%)";
          mixEl.className = "text-primary"; // to ensure currentColor is primary if var not found
          document.body.appendChild(mixEl);
          finalBackground = window.getComputedStyle(mixEl).color;
          document.body.removeChild(mixEl);
        }

        setColors({
          primary: computedPrimary,
          background: finalBackground || "rgba(236, 72, 153, 0.1)",
        });
      }
    };

    // Initial update
    updateColors();

    // Observe changes to the html element (where data-theme is usually applied)
    // or body, depending on where the theme class/attribute is set
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "data-theme" ||
            mutation.attributeName === "class")
        ) {
          updateColors();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    return () => observer.disconnect();
  }, []);

  return colors;
};
