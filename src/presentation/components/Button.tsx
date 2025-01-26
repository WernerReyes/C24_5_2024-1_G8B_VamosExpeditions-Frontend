import {
  Button as ButtonPrimeReact,
  type ButtonProps,
} from "primereact/button";
import { useWindowSize } from "../hooks";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface Props extends ButtonProps {}

// export const Button = ({ size, ...props }: Props) => {
//   const { width, TABLET } = useWindowSize();

//   return (
//     <ButtonPrimeReact
//       {...props}
//       size={size ?? width < TABLET ? "small" : undefined}
//     />
//   );
// };

export const Button = forwardRef<ButtonPrimeReact & ButtonHTMLAttributes<HTMLButtonElement>, Props>(({ size, ...props }, ref) => {
  const { width, TABLET } = useWindowSize();

  return (
    <ButtonPrimeReact
      {...props}
      size={size ?? width < TABLET ? "small" : undefined}
      ref={ref}
    />
  );
});
