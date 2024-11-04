import { FloatLabel } from "primereact/floatlabel";
import {
  type PasswordProps,
  type PasswordPassThroughOptions,
  Password as PasswordPrimeReact,
} from "primereact/password";
import { classNames } from "primereact/utils";
import type { HTMLAttributes, LabelHTMLAttributes } from "react";

type DesingType = "label" | "floatLabel";

interface Props extends PasswordProps {
  label: LabelHTMLAttributes<HTMLLabelElement> & { text: string };
  small?: HTMLAttributes<HTMLElement> & { text: string };
  desingType?: DesingType;
}

const PT: PasswordPassThroughOptions = {
  showIcon: { className: "mb-1" },
  hideIcon: { className: "mb-1" },
};

export const Password = ({ desingType = "label", ...props }: Props) => {
  return desingType === "label" ? (
    <PasswordWithLabel pt={PT} {...props} />
  ) : (
    <PasswordWithFloatLabel pt={PT} {...props} />
  );
  // <PasswordPrimeReact
  //   {...props}
  //   toggleMask
  //   pt={{
  //     showIcon: { className: "mb-1" },
  //     hideIcon: { className: "mb-1" },
  //   }}
  //   // feedback={true}
  //   // mediumRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})" // medium strength regex
  //   // strongRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})" // strong strength regex
  // />
};

const PasswordWithLabel = ({ label, small, ...props }: Props) => {
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

      <PasswordPrimeReact {...props} />
      {small && <small {...small}>{small?.text}</small>}
    </>
  );
};

const PasswordWithFloatLabel = ({ label, ...props }: Props) => {
  return (
    <FloatLabel>
      <PasswordPrimeReact {...props} />
      <label {...label}>{label.text}</label>
    </FloatLabel>
  );
};
