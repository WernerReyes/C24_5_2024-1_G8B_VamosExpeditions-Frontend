import { useWindowSize } from '@/presentation/hooks';
import {
  Button,
  type ColumnFilterClearTemplateOptions,
} from "@/presentation/components";

export const FilterClearButton = (
  options: ColumnFilterClearTemplateOptions
) => {
  const { width, TABLET } = useWindowSize();
  return (
    <Button
      label={width < TABLET ? "" : "Limpiar"}
      icon={width < TABLET ? "pi pi-times" : ""}
      outlined
      onClick={() => options.filterClearCallback()}
    />
  );
};
