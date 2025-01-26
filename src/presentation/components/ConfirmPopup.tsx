import { confirmPopup } from 'primereact/confirmpopup';
import {
  ConfirmPopup as ConfirmPopupPrimeReact,
  type ConfirmPopupProps,
} from "primereact/confirmpopup";

interface Props extends ConfirmPopupProps {}

export const ConfirmPopup = ({ ...props }: Props) => {
  return <ConfirmPopupPrimeReact {...props} />;
};


export {
    confirmPopup
}