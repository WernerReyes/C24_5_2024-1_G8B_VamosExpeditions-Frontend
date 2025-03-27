import {
  type DataTableSelectionMultipleChangeEvent as DataTableSelectionMultipleChangeEventPrimeReact,
  DataTable as DataTablePrimeReact,
  type DataTablePropsCell,
  type DataTablePropsMultiple,
  type DataTablePropsSingle,
  type DataTableValueArray,
  type DataTableExpandedRows,
} from "primereact/datatable";
import React, { createRef, forwardRef, useImperativeHandle } from "react";
import { useWindowSize } from "../hooks";
import { cn } from "@/core/adapters";

export interface DataTableSelectionMultipleChangeEvent<
  TValue extends DataTableValueArray
> extends DataTableSelectionMultipleChangeEventPrimeReact<TValue> {}

export type DataTableProps<TValue extends DataTableValueArray> = (
  | DataTablePropsSingle<TValue>
  | DataTablePropsCell<TValue>
  | DataTablePropsMultiple<TValue>
) & {};

export interface DataTableRef {
  exportCSV(): void;
}

export const DataTable = forwardRef(function DataTable2<
  TValue extends DataTableValueArray
>(
  { size, className, pt, ...rest }: DataTableProps<TValue>,
  ref: React.Ref<DataTableRef>
) {
  const { width, TABLET } = useWindowSize();

  const dataTableRef = createRef<DataTablePrimeReact<TValue>>();
  useImperativeHandle(ref, () => ({
    exportCSV: () => dataTableRef.current?.exportCSV(),
  }));

  return (
    <DataTablePrimeReact
      size={size ?? width < TABLET ? "small" : "normal"}
      ref={dataTableRef}
      {...rest}
      pt={{
        header: { className: "bg-primary text-white max-sm:text-sm" },
        wrapper: { className: "thin-scrollbar" },
        ...pt,
      }}
      className={cn("max-sm:text-xs", className)}
    />
  );
});

export type { DataTableValueArray, DataTableExpandedRows };
