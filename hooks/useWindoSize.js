import { useState, useEffect } from "react";

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
    mediumScreen: false,
    smallScreen: false,
  });
  useEffect(() => {
    function handleResize() {
      if (window.screen.width < 1025 && window.screen.width > 641) {
        setWindowSize({
          width: window.screen.width,
          height: window.screen.height,
          mediumScreen: true,
          smallScreen: false,
        })
        return
      }
      if (window.screen.width < 641) {
        setWindowSize({
          width: window.screen.width,
          height: window.screen.height,
          mediumScreen: true,
          smallScreen: true,
        })
        return
      }
      setWindowSize({
        width: window.screen.width,
        height: window.screen.height,
        smallScreen: false,
        mediumScreen: false,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);

  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}