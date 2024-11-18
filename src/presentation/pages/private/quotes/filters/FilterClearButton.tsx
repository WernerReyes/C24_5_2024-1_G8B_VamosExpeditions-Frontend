import {
  Button,
  type ColumnFilterClearTemplateOptions,
} from "@/presentation/components";

export const FilterClearButton = (
  options: ColumnFilterClearTemplateOptions
) => {
  return (
    <Button
      label="Limpiar"
      outlined
      onClick={() => options.filterClearCallback()}
    />
  );
};
