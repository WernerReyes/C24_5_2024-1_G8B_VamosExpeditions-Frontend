import {
  InputNumber as InputNumberPrimeReact,
  type InputNumberProps,
} from "primereact/inputnumber";

interface Props extends InputNumberProps {}

export const InputNumber = (props: Props) => {
  return <InputNumberPrimeReact {...props} />;
};
