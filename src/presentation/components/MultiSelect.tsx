import { forwardRef, HTMLAttributes, LabelHTMLAttributes } from "react";
import { MultiSelect as MultiSelectPrimereact, type MultiSelectProps, type MultiSelectChangeEvent } from 'primereact/multiselect';

interface Props extends MultiSelectProps {
    label?: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
    small?: HTMLAttributes<HTMLElement> & { text?: string };
}

export const MultiSelect = forwardRef<MultiSelectPrimereact, Props>(({ label, small, ...props }, ref) => {
    return (
        < >
            {label && (
                <label {...label}>
                    {label.text}
                </label>
            )}
            <MultiSelectPrimereact {...props} ref={ref}/>
            {small && (
                <small {...small}>
                    {small.text}
                </small>
            )}
        </>
    );
});

export {
    MultiSelectChangeEvent
}