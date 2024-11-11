import { Sidebar as SidebarPrimeReact,type SidebarProps } from "primereact/sidebar";

interface Props extends SidebarProps {}

export const Sidebar = ({ ...props }: Props) => {
  return <SidebarPrimeReact {...props} />;
};
