import { LabelHTMLAttributes, forwardRef } from "react";
import {
  RadioButton as RadioButtonPrimereact,
  type RadioButtonProps,
  type RadioButtonChangeEvent,
} from "primereact/radiobutton";
import { Skeleton, SkeletonProps } from "primereact/skeleton";

interface Props extends RadioButtonProps {
  label?: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  loading?: boolean;
  skeleton?: SkeletonProps;
}

export const RadioButton = forwardRef<RadioButtonPrimereact, Props>(
  ({ label, loading, skeleton, ...props }, ref) => {
    return (
      <div className="flex items-center flex-col justify-center">
        {loading ? (
          <Skeleton shape="circle" width="2rem" height="2rem"
          {...skeleton}
           />
        ) : (
          <RadioButtonPrimereact {...props} ref={ref} />
        )}
        {label && <label {...label}>{label.text}</label>}
      </div>
    );
  }
);

export { type RadioButtonChangeEvent };
