import {
  SelectButton as SelectButtonPrimeReact,
  type SelectButtonProps,
} from "primereact/selectbutton";

interface Props extends SelectButtonProps {}
export const SelectButton = ({ ...props }: Props) => {
  return <SelectButtonPrimeReact {...props} />;
};
