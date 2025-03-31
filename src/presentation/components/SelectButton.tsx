import { cn } from "@/core/adapters";
import {
  SelectButton as SelectButtonPrimeReact,
  type SelectButtonChangeEvent,
  type SelectButtonProps,
} from "primereact/selectbutton";
import type { SelectItem } from "primereact/selectitem";
import { forwardRef, HTMLAttributes, LabelHTMLAttributes } from "react";
import { Skeleton, type SkeletonProps } from "./";

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
  ({ label, small, loading, skeleton, ...props }: Props, ref) => {
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
                className={cn(
                  props.value === option.value && "bg-primary text-white"
                )}
                {...skeleton}
              />
            ))}

            {/* <Skeleton shape="rectangle" height="3rem" {...skeleton} /> */}
          </div>
        ) : (
          <SelectButtonPrimeReact ref={ref} {...props} />
        )}
        {small && <small {...small}>{small.text}</small>}
      </>
    );
  }
);

export { type SelectButtonChangeEvent };
