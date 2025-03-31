import React from "react";
import {
  TreeSelect as TreeSelectPrimereact,
  type TreeSelectProps,
  type TreeSelectChangeEvent,
  type TreeSelectSelectionKeysType,
} from "primereact/treeselect";
import type { HTMLAttributes, LabelHTMLAttributes } from "react";

import "./TreeSelect.css";
import { Skeleton, type SkeletonProps } from "..";

interface Props extends TreeSelectProps {
  label?: LabelHTMLAttributes<HTMLLabelElement> & { text?: string };
  small?: HTMLAttributes<HTMLElement> & { text?: string };
  loading?: boolean;
  skeleton?: SkeletonProps;
}

export const TreeSelect = React.forwardRef<TreeSelectPrimereact, Props>(
  ({ small, label, loading, skeleton, ...props }, ref) => {
    return (
      <>
        {label && <label {...label}>{label.text}</label>}
        {loading ? (
          <Skeleton shape="rectangle" height="3rem" {...skeleton} />
        ) : (
          <TreeSelectPrimereact {...props} ref={ref} />
        )}
        {small && <small {...small}>{small.text}</small>}
      </>
    );
  }
);

export { type TreeSelectChangeEvent, type TreeSelectSelectionKeysType };
