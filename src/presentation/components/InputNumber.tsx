import {
  InputNumber as InputNumberPrimeReact,
  type InputNumberProps,
} from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { forwardRef, HTMLAttributes, LabelHTMLAttributes } from "react";
import { Skeleton, type SkeletonProps } from "./Skeleton";

interface Props extends InputNumberProps {
  label: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  small?: HTMLAttributes<HTMLElement> & { text?: string };
  loading?: boolean;
  skeleton?: SkeletonProps;
}

export const InputNumber = forwardRef<InputNumberPrimeReact, Props>(
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
          <InputNumberPrimeReact {...props} ref={ref} />
        )}
        {small && <small {...small}>{small?.text}</small>}
      </>
    );
  }
);
