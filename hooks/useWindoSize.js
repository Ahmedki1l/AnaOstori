import { useState, useEffect } from "react";

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
      mediumScreen:false,
      smallScreen:false,
    });
    useEffect(() => {
      function handleResize() {
        if(window.innerWidth<1025 && window.innerWidth>641){
          setWindowSize({ 
            width: window.innerWidth,
            height: window.innerHeight,
            mediumScreen:true,
            smallScreen:false,
          })
          return
        }
        if(window.innerWidth<641){
          setWindowSize({ 
            width: window.innerWidth,
            height: window.innerHeight,
            mediumScreen:true,
            smallScreen:true,
          })
          return
        }
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
          smallScreen:false,
          mediumScreen:false,
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