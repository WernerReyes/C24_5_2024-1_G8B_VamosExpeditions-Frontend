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
      value={options.value}
      onChange={(e) =>
        e.value && options.filterCallback(e.value, options.index)
      }
      placeholder={placeholder}
      dateFormat={"dd/mm/yy"}
      showButtonBar
      showIcon
      showOnFocus={false}
    />
  );
};
