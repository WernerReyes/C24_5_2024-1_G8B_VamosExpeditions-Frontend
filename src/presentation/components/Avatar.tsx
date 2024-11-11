import {
  Avatar as AvatarPrimeReact,
  type AvatarProps,
} from "primereact/avatar";

interface Props extends AvatarProps {}

export const Avatar = ({ ...props }: Props) => {
  return <AvatarPrimeReact {...props} />;
};
