import {
  Dropdown as DropdownPrimereact,
  type DropdownProps,
  type DropdownChangeEvent,
} from "primereact/dropdown";
import { forwardRef, HTMLAttributes, LabelHTMLAttributes } from "react";
import { Skeleton, type SkeletonProps } from ".";

interface Props extends DropdownProps {
  label?: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  small?: HTMLAttributes<HTMLElement> & { text?: string };
  skeleton?: SkeletonProps;
}

export const Dropdown = forwardRef<DropdownPrimereact, Props>(
  ({ label, small, skeleton, ...props }, ref) => {
    return (
      <>
        {label && <label {...label}>{label.text}</label>}
        {props.loading ? (
          <Skeleton shape="rectangle" height="3rem"  {...skeleton} />
        ) : (
          <DropdownPrimereact {...props} ref={ref} />
        )}
        {small && <small {...small}>{small.text}</small>}
      </>
    );
  }
);

export { type DropdownChangeEvent };
