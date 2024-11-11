import {
  Dialog as DialogPrimeReact,
  type DialogProps,
} from "primereact/dialog";

interface Props extends DialogProps {}

export const Dialog = ({ ...props }: Props) => {
  return <DialogPrimeReact {...props} />;
};
