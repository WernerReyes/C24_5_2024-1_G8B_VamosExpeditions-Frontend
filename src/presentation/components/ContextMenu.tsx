import { forwardRef } from "react";
import {
  ContextMenu as ContextMenuPrimeReact,
  type ContextMenuProps,
} from "primereact/contextmenu";

interface Props extends ContextMenuProps {}

export const ContextMenu = forwardRef<ContextMenuPrimeReact, Props>(
  ({ ...props }, ref) => {
    return <ContextMenuPrimeReact {...props} ref={ref} />;
  }
);
