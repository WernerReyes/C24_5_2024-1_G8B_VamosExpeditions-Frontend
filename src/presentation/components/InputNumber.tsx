import {
  InputNumber as InputNumberPrimeReact,
  type InputNumberProps,
} from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { forwardRef, HTMLAttributes, LabelHTMLAttributes } from "react";

interface Props extends InputNumberProps {
  label: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  small?: HTMLAttributes<HTMLElement> & { text?: string };
}

export const InputNumber = forwardRef<InputNumberPrimeReact, Props>(
  ({ label, small, ...props }, ref) => {
    return (
      <>
        <label
          className={classNames(
            "block text-sm font-medium text-gray-700",
            label.className
          )}
          {...label}
        >
          {label.text}
        </label>
        <InputNumberPrimeReact {...props} ref={ref} />
        {small && <small {...small}>{small?.text}</small>}
      </>
    );
  }
);
