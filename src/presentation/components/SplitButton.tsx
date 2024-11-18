import {
  SplitButton as SplitButtonPrimeReact,
  type SplitButtonProps,
} from "primereact/splitbutton";
import { useWindowSize } from "../hooks";

interface Props extends SplitButtonProps {}

export const SplitButton = ({ size, ...props }: Props) => {
  const { width, TABLET } = useWindowSize();
  return (
    <SplitButtonPrimeReact
      {...props}
      size={size ?? width < TABLET ? "small" : undefined}
    />
  );
};
