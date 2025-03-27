import { forwardRef } from "react";
import {
  SelectButton as SelectButtonPrimeReact,
  type SelectButtonProps,
  type SelectButtonChangeEvent,
} from "primereact/selectbutton";
import { type SkeletonProps, Skeleton } from "./Skeleton";
import type { SelectItem } from "primereact/selectitem";
import { classNamesAdapter } from "@/core/adapters";
import { HTMLAttributes, LabelHTMLAttributes } from "react";

interface Props extends SelectButtonProps {
  label?: {
    text?: string;
  } & LabelHTMLAttributes<HTMLLabelElement>;
  small?: {
    text?: string;
  } & HTMLAttributes<HTMLElement>;
  loading?: boolean;
  skeleton?: SkeletonProps;
}

export const SelectButton = forwardRef<SelectButtonPrimeReact, Props>(
  ({ label, small, loading, skeleton, ...props }, ref) => {
    return (
      <>
        {label && <label {...label}>{label.text}</label>}
        {loading ? (
          <div className="flex">
            {props.options?.map((option: SelectItem, index) => (
              <Skeleton
                key={index}
                shape="rectangle"
                height="3rem"
                className={classNamesAdapter(
                  props.value === option.value && "bg-primary text-white"
                )}
                {...skeleton}
              />
            ))}
          </div>
        ) : (
          <SelectButtonPrimeReact {...props} ref={ref} />
        )}
        {small && <small {...small}>{small.text}</small>}
      </>
    );
  }
);

export type { SelectButtonChangeEvent };