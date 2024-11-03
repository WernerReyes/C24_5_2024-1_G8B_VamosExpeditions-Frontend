import {
  InputTextProps,
  InputText as InputTextPrimeReact,
} from "primereact/inputtext";

interface Props extends InputTextProps {}

export const InputText = ({ ...Props }: Props) => {
  return <InputTextPrimeReact {...Props} />;
};
