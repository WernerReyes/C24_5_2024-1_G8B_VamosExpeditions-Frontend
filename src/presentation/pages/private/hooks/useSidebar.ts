//import { useWindowSize } from '@/presentation/hooks';
import type { AppState } from "@/app/store";
import { constantResponsiveDesign } from "@/core/constants";
import { onSetSidebar, onToggleSidebar } from "@/infraestructure/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
export const useSidebar = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state: AppState) => state.sidebar);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < constantResponsiveDesign.MACBOOK;

      if (isMobile && isOpen) {
        // setVisible(false); // Ocultar si estamos en móvil
       
        dispatch(onSetSidebar(false));
      } else if (!isMobile && !isOpen) {
        // setVisible(true); // Mostrar en pantallas grandes
        dispatch(onSetSidebar(true));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Guardar el estado de la visibilidad en localStorage cada vez que cambie

  const toggleSidebar = () => {
    dispatch(onToggleSidebar());
  };

  return {
    visible: isOpen,

    toggleSidebar,
  };
};
