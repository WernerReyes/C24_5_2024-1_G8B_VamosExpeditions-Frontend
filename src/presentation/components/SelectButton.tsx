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
