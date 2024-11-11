import {
  Menubar as MenubarPrimeReact,
  type MenubarProps,
} from "primereact/menubar";
import type { MenuItem as MenuItemPrimeReact } from "primereact/menuitem";

export interface MenuItem extends MenuItemPrimeReact {}

interface Props extends MenubarProps {}

export const Menubar = ({ ...props }: Props) => {
  return <MenubarPrimeReact {...props} />;
};
