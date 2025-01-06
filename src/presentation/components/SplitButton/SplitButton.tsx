import { useWindowSize } from "@/presentation/hooks";
import {
  SplitButton as SplitButtonPrimeReact,
  type SplitButtonProps,
} from "primereact/splitbutton";

import "./SplitButton.css";


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
