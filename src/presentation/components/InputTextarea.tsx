import React from "react";
import {
  InputTextarea as InputTextareaPrimereact,
  type InputTextareaProps,
} from "primereact/inputtextarea";
import { HTMLAttributes, LabelHTMLAttributes } from "react";
import { Skeleton, type SkeletonProps } from ".";

interface Props extends InputTextareaProps {
  label?: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  small?: HTMLAttributes<HTMLElement> & { text?: string };
  loading?: boolean;
  skeleton?: SkeletonProps;
}

export const InputTextarea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ small, label, loading, skeleton, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && <label {...label}>{label.text}</label>}
        {loading ? (
          <Skeleton shape="rectangle" height="4rem" {...skeleton} />
        ) : (
          <InputTextareaPrimereact {...props} ref={ref} />
        )}
        {small ? <small {...small}>{small.text}</small> : null}
      </div>
    );
  }
);
