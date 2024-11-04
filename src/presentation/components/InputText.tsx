import { FloatLabel } from "primereact/floatlabel";
import { IconField, type IconFieldProps } from "primereact/iconfield";
import { InputIcon, type InputIconProps } from "primereact/inputicon";
import {
  InputText as InputTextPrimeReact,
  type InputTextProps,
} from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { forwardRef, HTMLAttributes, LabelHTMLAttributes } from "react";

type DesingType = "label" | "floatLabel";

interface Props extends InputTextProps {
  label: LabelHTMLAttributes<HTMLLabelElement> & { text: string };
  small?: HTMLAttributes<HTMLElement> & { text: string };
  desingType?: DesingType;
  iconField?: boolean;
  iconFieldProps?: IconFieldProps;
  iconProps?: InputIconProps;
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
  ({ label, small, iconField, ...props }, ref) => {
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
        {iconField ? (
          <InputTextWithIcon {...props} />
        ) : (
          <InputTextPrimeReact {...props} ref={ref} />
        )}
        {small && <small {...small}>{small?.text}</small>}
      </>
    );
  }
);

const InputTextWithFloatLabel = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      small,
      iconField,

      ...props
    },
    ref
  ) => {
    return (
      <FloatLabel>
        {iconField ? (
          <InputTextWithIcon {...props} ref={ref} />
        ) : (
          <InputTextPrimeReact {...props} ref={ref} />
        )}
        <label {...label}>{label.text}</label>
      </FloatLabel>
    );
  }
);

const InputTextWithIcon = forwardRef<
  HTMLInputElement,
  Omit<Props, "label" | "small" | "desingType" | "iconField">
>(({ iconFieldProps, iconProps, ...props }, ref) => {
  return (
    <IconField {...iconFieldProps}>
      <InputIcon {...iconProps}> </InputIcon>
      <InputTextPrimeReact {...props} ref={ref} />
    </IconField>
  );
});
