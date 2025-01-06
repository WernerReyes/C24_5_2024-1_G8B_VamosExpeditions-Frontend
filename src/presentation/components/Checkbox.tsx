import {
  type CheckboxProps,
  Checkbox as CheckboxPrimeReact,
} from "primereact/checkbox";
import { forwardRef, LabelHTMLAttributes } from "react";

export interface Props extends CheckboxProps {
  label: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
}
export const Checkbox = forwardRef<CheckboxPrimeReact, Props>(
  ({ label, ...props }, ref) => {
    return (
      <>
        <CheckboxPrimeReact {...props} ref={ref} />
        <label {...label} >{label.text}</label>
      </>
    );
  }
);
