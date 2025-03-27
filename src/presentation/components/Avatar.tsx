import {
  Avatar as AvatarPrimeReact,
  type AvatarProps,
} from "primereact/avatar";

interface Props extends AvatarProps {}

export const Avatar = ({ label, ...props }: Props) => {
  return <AvatarPrimeReact {...props} label={shortName(label)} />;
};

const shortName = (name?: string) => {
  if (!name) return undefined;
  const [firstName, lastName] = name.split(" ");
  return `${firstName.charAt(0).toUpperCase()}${lastName?.charAt(0).toUpperCase() ?? ""}`;
}