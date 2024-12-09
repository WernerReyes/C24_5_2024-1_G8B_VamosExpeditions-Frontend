import { LabelHTMLAttributes, forwardRef } from "react";
import {
    RadioButton as RadioButtonPrimereact,
    type RadioButtonProps
} from "primereact/radiobutton";

interface Props extends RadioButtonProps {
    label?: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
    
}

export const RadioButton = forwardRef<RadioButtonPrimereact, Props>(({  label, ...props }, ref) => {
    return (
        <div className="">
            <RadioButtonPrimereact {...props}  ref={ref} />
            {label && (
                <label {...label}>
                    {label.text}
                </label>
            )}

        </div>
    );
});