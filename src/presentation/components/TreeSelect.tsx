import React from 'react';
import {
  TreeSelect as TreeSelectPrimereact,
  type TreeSelectProps
} from 'primereact/treeselect';
import { HTMLAttributes, LabelHTMLAttributes } from "react";

interface Props extends TreeSelectProps {
  label?: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  small?: HTMLAttributes<HTMLElement> & { text?: string };
}

export const TreeSelect = React.forwardRef<TreeSelectPrimereact, Props>(
  ({ small, label, ...props }, ref) => {
    return (
      <>
        {label ? (
          <label 
            {...label}
          >
            {label.text}
          </label>
        ) : null}
        <TreeSelectPrimereact {...props} ref={ref as React.Ref<TreeSelectPrimereact>} />
        {small ? (
          <small 
           {...small}
          >{small.text}</small>
        ) : null}
      </>
    );
  }
);