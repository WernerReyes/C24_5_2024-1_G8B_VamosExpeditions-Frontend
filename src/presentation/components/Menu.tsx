import { Menu as MenuPrimeReact, type MenuProps } from "primereact/menu";
import { forwardRef } from "react";

interface Props extends MenuProps {}

export type MenuRef = MenuPrimeReact;

export const Menu = forwardRef<MenuPrimeReact, Props>((props, ref) => {
  return <MenuPrimeReact {...props} ref={ref} />;
});
