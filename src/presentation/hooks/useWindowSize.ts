import { useEffect, useState } from "react";
import { constantResponsiveDesign } from "@/core/constants";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isMobile: windowSize.width <= constantResponsiveDesign.MOVILE,
    isTablet: windowSize.width <= constantResponsiveDesign.TABLET,
    isDesktop: windowSize.width <= constantResponsiveDesign.DESKTOP,
    ...windowSize,
    ...constantResponsiveDesign,
  };
};
