import {
    Dropdown as DropdownPrimereact,
    type DropdownProps
} from "primereact/dropdown";
import { forwardRef, HTMLAttributes, LabelHTMLAttributes } from "react";

interface Props extends DropdownProps {
    label?: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
    small?: HTMLAttributes<HTMLElement> & { text?: string };
}

export const Dropdown = forwardRef<DropdownPrimereact, Props>(({ label, small, ...props }, ref) => {
    return (
        < >
            {label && (
                <label {...label}>
                    {label.text}
                </label>
            )}
            <DropdownPrimereact {...props} ref={ref} />
            {small && (
                <small {...small}>
                    {small.text}
                </small>
            )}
        </>
    );
});
