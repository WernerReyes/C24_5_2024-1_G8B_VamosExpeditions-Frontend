//import { useWindowSize } from '@/presentation/hooks';
import { constantStorage } from "@/core/constants";
import { useState, useEffect } from "react";
import { constantResponsiveDesign } from "@/core/constants";
export const useSidebar = () => {
  const { SIDEBAR_VISIBLE } = constantStorage;

  const [visible, setVisible] = useState(() => {
    const savedVisible = localStorage.getItem(SIDEBAR_VISIBLE);
    return savedVisible !== null ? JSON.parse(savedVisible) : true;
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < constantResponsiveDesign.MACBOOK;

      if (isMobile && visible) {
        setVisible(false); // Ocultar si estamos en móvil
      } else if (!isMobile && !visible) {
        setVisible(true); // Mostrar en pantallas grandes
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Guardar el estado de la visibilidad en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem(SIDEBAR_VISIBLE, JSON.stringify(visible));
  }, [visible]);

  return {
    visible,
    setVisible,
  };
};
