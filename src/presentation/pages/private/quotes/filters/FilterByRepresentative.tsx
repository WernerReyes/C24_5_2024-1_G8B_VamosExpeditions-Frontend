import {
  type ColumnFilterElementTemplateOptions,
  MultiSelect,
  type MultiSelectChangeEvent,
} from "@/presentation/components";

type Props = {
  options: ColumnFilterElementTemplateOptions;
  representatives: { id: number; name: string }[];
};

export const FilterByRepresentative = ({ options, representatives }: Props) => {;
  return (
    <MultiSelect
      value={options.value || []}
      options={representatives}
      display="chip"
      itemTemplate={(option: { id: number; name: string }) => (
        <div className="flex align-items-center gap-2">
          <span>{option.name}</span>
        </div>
      )}
      onChange={(e: MultiSelectChangeEvent) => options.filterCallback(e.value)}
      dataKey="id"
      optionLabel="name"
      placeholder="Selecciona representantes"
      filterBy="name"
      maxSelectedLabels={2}
      className="p-column-filter"
    />
  );
};
