import {
  SelectButton as SelectButtonPrimeReact,
  type SelectButtonProps,
} from "primereact/selectbutton";
import { type SkeletonProps, Skeleton } from "./Skeleton";
import type { SelectItem } from "primereact/selectitem";
import { classNamesAdapter } from "@/core/adapters";
import { HTMLAttributes, LabelHTMLAttributes } from "react";

interface Props extends SelectButtonProps {
  label?: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  small?: HTMLAttributes<HTMLElement> & { text?: string };
  loading?: boolean;
  skeleton?: SkeletonProps;
}
export const SelectButton = ({
  label,
  small,
  loading,
  skeleton,
  ...props
}: Props) => {
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

          {/* <Skeleton shape="rectangle" height="3rem" {...skeleton} /> */}
        </div>
      ) : (
        <SelectButtonPrimeReact {...props} />
      )}
      {small && <small {...small}>{small.text}</small>}
    </>
  );
};
