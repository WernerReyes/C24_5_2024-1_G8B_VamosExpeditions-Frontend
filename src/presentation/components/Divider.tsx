import {
  Divider as DividerPrimeReact,
  type DividerProps,
} from "primereact/divider";

interface Props extends DividerProps {}

export const Divider = (props: Props) => {
  return <DividerPrimeReact {...props} />;
};
