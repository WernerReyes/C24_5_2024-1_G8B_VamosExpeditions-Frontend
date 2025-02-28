import {
  Column as ColumnPrimeReact,
  type ColumnProps as ColumnPropsPrimeReact,
  type ColumnFilterApplyTemplateOptions,
  type ColumnFilterClearTemplateOptions,
  type ColumnFilterElementTemplateOptions,
  type ColumnFilterMetaDataWithConstraint,
  type ColumnFilterMatchModeOptions,
  type ColumnEditorOptions,
} from "primereact/column";

export interface ColumnProps extends ColumnPropsPrimeReact {}

export const Column = (props: ColumnProps) => {
  return <ColumnPrimeReact {...props} />;
};

export type {
  ColumnFilterApplyTemplateOptions,
  ColumnFilterClearTemplateOptions,
  ColumnFilterElementTemplateOptions,
  ColumnFilterMetaDataWithConstraint,
  ColumnFilterMatchModeOptions,
  ColumnEditorOptions,
};
