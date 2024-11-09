import { FloatLabel } from "primereact/floatlabel";
import {
  type PasswordProps,
  type PasswordPassThroughOptions,
  Password as PasswordPrimeReact,
} from "primereact/password";
import { classNames } from "primereact/utils";
import { forwardRef, type HTMLAttributes, type LabelHTMLAttributes } from "react";

type DesingType = "label" | "floatLabel";

interface Props extends PasswordProps {
  label: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  small?: HTMLAttributes<HTMLElement> & { text?: string };
  desingType?: DesingType;
}

const PT: PasswordPassThroughOptions = {
  showIcon: { className: "mb-1" },
  hideIcon: { className: "mb-1" },
};

export const Password = forwardRef<HTMLInputElement, Props>(({ desingType = "label", ...props }, ref) => {
  return desingType === "label" ? (
    <PasswordWithLabel pt={PT} {...props} ref={ref} />
  ) : (
    <PasswordWithFloatLabel pt={PT} {...props} ref={ref} />
  );
});

const PasswordWithLabel = forwardRef<HTMLInputElement, Props>(({ label, small, ...props }, ref) => {
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

      <PasswordPrimeReact ref={ref as any} {...props} />
      {small && <small {...small}>{small?.text}</small>}
    </>
  );
})

const PasswordWithFloatLabel = forwardRef<HTMLInputElement, Props>(({ label, ...props }, ref) => {
  return (
    <FloatLabel>
      <PasswordPrimeReact {...props} ref={ref as any} />
      <label {...label}>{label.text}</label>
    </FloatLabel>
  );
})
