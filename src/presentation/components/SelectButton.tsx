<<<<<<< HEAD
import  { forwardRef, HTMLAttributes, LabelHTMLAttributes } from "react";
import { SelectButton as SelectButtonPrimeReact, type SelectButtonProps } from 'primereact/selectbutton';

interface Props extends SelectButtonProps {
    label?: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
    small?: HTMLAttributes<HTMLElement> & { text?: string };
}

export const SelectButton = forwardRef<SelectButtonPrimeReact, Props>(({ label, small, ...props }, ref) => {
    return (
        <>
            {label && (
                <label {...label}>
                    {label.text}
                </label>
            )}
            <SelectButtonPrimeReact {...props} ref={ref} />
            {small && (
                <small {...small}>
                    {small.text}
                </small>
            )}
        </>
    );
});
=======
import {
  SelectButton as SelectButtonPrimeReact,
  type SelectButtonProps,
} from "primereact/selectbutton";
import { type SkeletonProps, Skeleton } from "./Skeleton";
import type { SelectItem } from "primereact/selectitem";
import { classNamesAdapter } from "@/core/adapters";

interface Props extends SelectButtonProps {
  loading?: boolean;
  skeleton?: SkeletonProps;
}
export const SelectButton = ({ loading, skeleton, ...props }: Props) => {
  return (
    <>
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

          {/* <Skeleton shape="rectangle" height="3rem" {...skeleton} /> */}
        </div>
      ) : (
        <SelectButtonPrimeReact {...props} />
      )}
    </>
  );
};
>>>>>>> a0d591d879f98735f99fe90877482885da6a9321
