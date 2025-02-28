import {
  Button,
  type ColumnFilterApplyTemplateOptions,
  type ColumnFilterMetaDataWithConstraint,
} from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";

export const FilterApplyButton = (
  options: ColumnFilterApplyTemplateOptions
) => {
  const { width, TABLET } = useWindowSize();
  return (
    <Button
      label={width < TABLET ? "" : "Aplicar"}
      icon={width < TABLET ? "pi pi-check" : ""}
      onClick={() => {
        const value = (
          options.filterModel as any as ColumnFilterMetaDataWithConstraint
        ).constraints[0].value;
        options.filterApplyCallback(value, 0);
      }}
    />
  );
};
