import { Menu as MenuPrimeReact, type MenuProps } from "primereact/menu";

interface Props extends MenuProps {}

export const Menu = ({ ...props }: Props) => {
  return <MenuPrimeReact {...props} />;
};
