import { cn } from "@/core/adapters";
import {
  Avatar as AvatarPrimeReact,
  type AvatarProps,
} from "primereact/avatar";
import { Badge, BadgeProps } from "primereact/badge";

interface Props extends AvatarProps {
  badge?: BadgeProps;
}

export const Avatar = ({ label, badge, className, ...props }: Props) => {
  return (
    <AvatarPrimeReact
      {...props}
      className={cn(className, badge ? "p-overlay-badge" : undefined)}
      label={shortName(label)}
    >
      {badge && <Badge {...badge} />}
      {props.children}
    </AvatarPrimeReact>
  );
};

const shortName = (name?: string) => {
  if (!name) return undefined;
  const [firstName, lastName] = name.split(" ");
  return `${firstName.charAt(0).toUpperCase()}${
    lastName?.charAt(0).toUpperCase() ?? ""
  }`;
};
