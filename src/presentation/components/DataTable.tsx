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

export interface DataTableSelectionMultipleChangeEvent<
  TValue extends DataTableValueArray
> extends DataTableSelectionMultipleChangeEventPrimeReact<TValue> {}

type Props<TValue extends DataTableValueArray> =
  | DataTablePropsSingle<TValue>
  | DataTablePropsCell<TValue>
  | DataTablePropsMultiple<TValue>;

export interface DataTableRef {
  exportCSV(): void;
}

export const DataTable = forwardRef(function DataTable2<
  TValue extends DataTableValueArray
>(props: Props<TValue>, ref: React.Ref<DataTableRef>) {
  const dataTableRef = createRef<DataTablePrimeReact<TValue>>();
  useImperativeHandle(ref, () => ({
    exportCSV: () => dataTableRef.current?.exportCSV(),
  }));

  return <DataTablePrimeReact ref={dataTableRef} {...props} />;
});

export type { DataTableValueArray, DataTableExpandedRows };
