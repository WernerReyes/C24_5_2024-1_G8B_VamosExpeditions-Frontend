import {
  type InputMaskProps,
  InputMask as InputMaskPrimeReact,
} from "primereact/inputmask";
import { classNames } from "primereact/utils";
import { forwardRef, HTMLAttributes, LabelHTMLAttributes } from "react";

interface Props extends InputMaskProps {
  label: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  small?: HTMLAttributes<HTMLElement> & { text?: string };
}

export const InputMask = forwardRef<InputMaskPrimeReact, Props>(
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
        <InputMaskPrimeReact {...props} ref={ref} />
        {small && <small {...small}>{small?.text}</small>}
      </>
    );
  }
);
