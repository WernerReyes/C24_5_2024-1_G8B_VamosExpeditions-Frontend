import { forwardRef, HTMLAttributes, LabelHTMLAttributes } from "react";
import { MultiSelect as MultiSelectPrimereact, type MultiSelectProps } from 'primereact/multiselect';

interface Props extends MultiSelectProps {
    label?: {
        text?: string;
    } & LabelHTMLAttributes<HTMLLabelElement>;
    small?: {
        text?: string;
    } & HTMLAttributes<HTMLElement>;
}

export const MultiSelect = forwardRef<MultiSelectPrimereact, Props>(({ label, small, ...props }, ref) => {
    return (
        <div>
            {label && (
                <label {...label}>
                    {label.text}
                </label>
            )}
            <MultiSelectPrimereact {...props} ref={ref} />
            {small && (
                <small {...small}>
                    {small.text}
                </small>
            )}
        </div>
    );
});

export type { MultiSelectChangeEvent } from 'primereact/multiselect';