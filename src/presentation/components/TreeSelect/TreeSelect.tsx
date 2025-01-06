import React from "react";
import {
  TreeSelect as TreeSelectPrimereact,
  type TreeSelectProps,
  type TreeSelectChangeEvent,
  type TreeSelectSelectionKeysType,
} from "primereact/treeselect";
import type { HTMLAttributes, LabelHTMLAttributes } from "react";

import "./TreeSelect.css";

interface Props extends TreeSelectProps {
  label?: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  small?: HTMLAttributes<HTMLElement> & { text?: string };
}

export const TreeSelect = React.forwardRef<TreeSelectPrimereact, Props>(
  ({ small, label, ...props }, ref) => {
    return (
      <>
        {label ? <label {...label}>{label.text}</label> : null}
        <TreeSelectPrimereact {...props} ref={ref} />
        {small ? <small {...small}>{small.text}</small> : null}
      </>
    );
  }
);

export { type TreeSelectChangeEvent, type TreeSelectSelectionKeysType };
