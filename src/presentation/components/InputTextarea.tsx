import React from 'react';
import {
  InputTextarea as InputTextareaPrimereact,
  type InputTextareaProps
} from "primereact/inputtextarea";
import { HTMLAttributes, LabelHTMLAttributes } from "react";

interface Props extends InputTextareaProps {
  label?: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  small?: HTMLAttributes<HTMLElement> & { text?: string };
}

export const InputTextarea = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ small, label, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label ? (
          <label {...label}>
            {label.text}
          </label>
        ) : null}
        <InputTextareaPrimereact {...props} ref={ref} />
        {small ? (
          <small {...small}>{small.text}</small>
        ) : null}
      </div>
    );
  }
);