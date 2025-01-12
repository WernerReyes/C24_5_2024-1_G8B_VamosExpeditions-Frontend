import {
  type InputMaskProps,
  InputMask as InputMaskPrimeReact,
} from "primereact/inputmask";
import { classNames } from "primereact/utils";
import { forwardRef, HTMLAttributes, LabelHTMLAttributes } from "react";
import { Skeleton, type SkeletonProps } from "./Skeleton";

interface Props extends InputMaskProps {
  label: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  small?: HTMLAttributes<HTMLElement> & { text?: string };
  loading?: boolean;
  skeleton?: SkeletonProps;
}

export const InputMask = forwardRef<InputMaskPrimeReact, Props>(
  ({ label, small, loading, skeleton, ...props }, ref) => {
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
        {loading ? (
          <Skeleton shape="rectangle" height="3rem" {...skeleton} />
        ) : (
          <InputMaskPrimeReact {...props} ref={ref} />
        )}
        {small && <small {...small}>{small?.text}</small>}
      </>
    );
  }
);
