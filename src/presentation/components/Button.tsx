import {
  Button as ButtonPrimeReact,
  type ButtonProps,
} from "primereact/button";
import { useWindowSize } from "../hooks";

interface Props extends ButtonProps {}

export const Button = ({ size, ...props }: Props) => {
  const { width, TABLET } = useWindowSize();

  return (
    <ButtonPrimeReact
      {...props}
      size={size ?? width < TABLET ? "small" : undefined}
    />
  );
};
