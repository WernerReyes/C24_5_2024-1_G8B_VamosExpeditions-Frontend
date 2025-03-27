import { useUpdateVersionQuotationMutation } from "@/infraestructure/store/services";
import { InputText, type ColumnEditorOptions } from "@/presentation/components";
import { useState } from "react";

type Props = {
  options: ColumnEditorOptions;
};

export const EditQuotationName = ({ options }: Props) => {
  const [handleUpdate, { isLoading: isUpdating }] =
    useUpdateVersionQuotationMutation();
  const [frozenName] = useState(options.rowData.name);

  return (
    <InputText
      disabled={isUpdating}
      value={options.rowData.name}
      className="max-w-48 text-sm"
      onChange={(e) => options.editorCallback?.(e.target.value)}
      onBlur={() => {
        if (options.value === frozenName || !options.value.trim()) return;
        handleUpdate({ ...options.rowData, name: options.value }).then(() =>
          options.editorCallback?.(options.value)
        );
      }}
      onKeyDown={(e) => {
        if (options.value === frozenName || !options.value.trim()) return;
        if (e.key === "Enter")
          handleUpdate({
            ...options.rowData,
            name: options.value,
          }).then(() => options.editorCallback?.(options.value));
      }}
    />
  );
};
