import {
  Button,
  type ColumnFilterApplyTemplateOptions,
  type ColumnFilterMetaDataWithConstraint,
} from "@/presentation/components";

export const FilterApplyButton = (
  options: ColumnFilterApplyTemplateOptions
) => {
  return (
    <Button
      label="Aplicar"
      onClick={() => {
        const value = (
          options.filterModel as any as ColumnFilterMetaDataWithConstraint
        ).constraints[0].value;
        options.filterApplyCallback(value, 0);
      }}
    />
  );
};
