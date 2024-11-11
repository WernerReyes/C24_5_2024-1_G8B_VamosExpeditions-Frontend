import {
  PanelMenu as PanelMenuPrimeReact,
  type PanelMenuProps,
} from "primereact/panelmenu";

interface Props extends PanelMenuProps {}

export const PanelMenu = ({ ...props }: Props) => {
  return <PanelMenuPrimeReact {...props} />;
};
