import {
  Column as ColumnPrimeReact,
  type ColumnProps,
  type ColumnFilterApplyTemplateOptions,
  type ColumnFilterClearTemplateOptions,
  type ColumnFilterElementTemplateOptions,
  type ColumnFilterMetaDataWithConstraint,
  type ColumnFilterMatchModeOptions
} from "primereact/column";

interface Props extends ColumnProps {}

export const Column = (props: Props) => {
  return <ColumnPrimeReact {...props} />;
};

export type {
  ColumnFilterApplyTemplateOptions,
  ColumnFilterClearTemplateOptions,
  ColumnFilterElementTemplateOptions,
  ColumnFilterMetaDataWithConstraint,
  ColumnFilterMatchModeOptions
};
