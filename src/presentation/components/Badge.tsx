import { Badge as BadgePrimeReact, type BadgeProps } from "primereact/badge";

interface Props extends BadgeProps {}

export const Badge = ({ ...props }: Props) => {
  return <BadgePrimeReact {...props} />;
};
