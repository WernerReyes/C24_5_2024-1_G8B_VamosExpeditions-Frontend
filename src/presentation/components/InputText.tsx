import { FloatLabel } from "primereact/floatlabel";
import { IconField, type IconFieldProps } from "primereact/iconfield";
import { InputIcon, type InputIconProps } from "primereact/inputicon";
import {
  InputText as InputTextPrimeReact,
  type InputTextProps,
} from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { forwardRef, HTMLAttributes, LabelHTMLAttributes } from "react";
import { Skeleton, type SkeletonProps } from "./Skeleton";
import { useWindowSize } from "../hooks";

type DesingType = "label" | "floatLabel";

interface Props extends InputTextProps {
  label?: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  small?: HTMLAttributes<HTMLElement> & { text?: string };
  desingType?: DesingType;
  iconField?: boolean;
  iconFieldProps?: IconFieldProps;
  iconProps?: InputIconProps;
  loading?: boolean;
  skeleton?: SkeletonProps;
}

export const InputText = forwardRef<HTMLInputElement, Props>(
  ({ desingType = "label", ...props }, ref) => {
    return desingType === "label" ? (
      <InputTextWithLabel {...props} ref={ref} />
    ) : (
      <InputTextWithFloatLabel {...props} ref={ref} />
    );
  }
);

const InputTextWithLabel = forwardRef<HTMLInputElement, Props>(
  ({ label, small, iconField, loading, skeleton, ...props }, ref) => {
    return (
      <>
        {label && (
          <label
            className={classNames(
              "block text-sm font-medium text-gray-700",
              label.className
            )}
            {...label}
          >
            {label.text}
          </label>
        )}
        {loading ? (
          <Skeleton shape="rectangle" height="3rem" {...skeleton} />
        ) : (
          <>
            {iconField ? (
              <InputTextWithIcon {...props} />
            ) : (
              <InputTextPrimeReact {...props} ref={ref} />
            )}
          </>
        )}
        {small && <small {...small}>{small?.text}</small>}
      </>
    );
  }
);

const InputTextWithFloatLabel = forwardRef<HTMLInputElement, Props>(
  ({ label, small, iconField, loading, skeleton, ...props }, ref) => {
    return (
      <>
        {loading ? (
          <Skeleton shape="rectangle" height="3rem" {...skeleton} />
        ) : (
          <FloatLabel>
            {iconField ? (
              <InputTextWithIcon {...props} ref={ref} />
            ) : (
              <InputTextPrimeReact {...props} ref={ref} />
            )}
            {label && <label {...label}>{label.text}</label>}
          </FloatLabel>
        )}
      </>
    );
  }
);

const InputTextWithIcon = forwardRef<
  HTMLInputElement,
  Omit<Props, "label" | "small" | "desingType" | "iconField">
>(({ iconFieldProps, iconProps, ...props }, ref) => {
  const { width, TABLET } = useWindowSize();
  return (
    <IconField
      {...iconFieldProps}
      iconPosition={width < TABLET ? "right" : iconFieldProps?.iconPosition}
    >
      <InputIcon {...iconProps} />
      <InputTextPrimeReact {...props} ref={ref} />
    </IconField>
  );
});
