import {
  Calendar,
  type ColumnFilterElementTemplateOptions,
} from "@/presentation/components";

type Props = {
  options: ColumnFilterElementTemplateOptions;
  placeholder: string;
};

export const FilterByDate = ({ options, placeholder }: Props) => {
  return (
    <Calendar
      value={options.value && new Date(options.value)}
      onChange={(e) => {
        e.value && options.filterApplyCallback(e.value, options.index)
      }
      }
      placeholder={placeholder}
      dateFormat={"dd/mm/yy"}
      showIcon      
      showOnFocus={false}
      todayButtonClassName="p-button-text"
      clearButtonClassName="p-button-text"
      locale="es"
      inputClassName="text-sm"
      
    />
  );
};
