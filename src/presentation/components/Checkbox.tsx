import {
  type CheckboxProps,
  Checkbox as CheckboxPrimeReact,
} from "primereact/checkbox";
import { forwardRef, LabelHTMLAttributes } from "react";
import { Skeleton, type SkeletonProps } from "./Skeleton";

interface Props extends CheckboxProps {
  label: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  loading?: boolean;
  skeleton?: SkeletonProps;
}
export const Checkbox = forwardRef<CheckboxPrimeReact, Props>(
  ({ label,loading, skeleton, ...props }, ref) => {
    return (
      <>
        {loading ? <Skeleton size="1.5rem" {...skeleton} /> : 
        <CheckboxPrimeReact {...props} ref={ref} />
        }

        <label {...label} >{label.text}</label>
      </>
    );
  }
);
