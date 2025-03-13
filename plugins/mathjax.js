export default ({ app }, inject) => {
  if (process.client) {
    const loadMathJax = () => {
      return new Promise((resolve, reject) => {
        // Check if MathJax is already loaded
        if (window.MathJax) {
          resolve();
          return;
        }

        // Load MathJax from CDN
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-MML-AM_CHTML";
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
          // Set MathJax configuration once it's loaded
          if (window.MathJax) {
            window.MathJax.Hub.Config({
              tex2jax: {
                inlineMath: [
                  ["$", "$"],
                  ["\\(", "\\)"],
                  ["\\", "\\"],
                  ["(\\(", "\\))"],
                ],
                displayMath: [
                  ["$$", "$$"],
                  ["\\[", "\\]"],
                ],
                processEscapes: true,
                processEnvironments: true,
              },
              displayAlign: "center",
              "HTML-CSS": {
                styles: { ".MathJax_Display": { margin: 0 } },
                linebreaks: { automatic: true },
              },
            });
            resolve();
          } else {
            reject("MathJax failed to load");
          }
        };

        script.onerror = () => {
          reject("MathJax script failed to load");
        };
      });
    };

    // Inject the renderMathJax function into the app
    inject("renderMathJax", async (el) => {
      try {
        await loadMathJax(); // Ensure MathJax is fully loaded
        if (window.MathJax) {
          // Re-render the math content inside the provided element
          window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, el]);
        }
      } catch (error) {
        console.error("Error rendering MathJax:", error);
      }
    });
  }
};
