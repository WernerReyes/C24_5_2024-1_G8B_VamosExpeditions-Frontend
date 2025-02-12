import { constantResponsiveDesign } from "@/core/constants";
import { useWindowSize as useWindowSizeReact } from "react-use";

export const useWindowSize = () => {
  const { width, height } = useWindowSizeReact();

  return {
    width,
    height,
    isMobile: width <= constantResponsiveDesign.MOVILE,
    isTablet: width <= constantResponsiveDesign.TABLET,
    isDesktop: width <= constantResponsiveDesign.DESKTOP,
    ...constantResponsiveDesign,
  };
};
