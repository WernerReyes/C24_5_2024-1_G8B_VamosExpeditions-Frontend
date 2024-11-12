import {
  Button as ButtonPrimeReact,
  type ButtonProps,
} from "primereact/button";

interface Props extends ButtonProps {}

export const Button = ({ ...props }: Props) => {
  return (
    <ButtonPrimeReact
      {...props}
      // pt={{
      //   ...props.pt,
      //   // icon: { className: "me-3" },
      // }}
    />
  );
};
