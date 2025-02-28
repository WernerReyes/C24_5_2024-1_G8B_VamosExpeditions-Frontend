import {
  versionQuotationRender,
  VersionQuotationStatus,
} from "@/domain/entities";
import {
  type ColumnFilterElementTemplateOptions,
  MultiSelect,
  type MultiSelectChangeEvent,
  Tag,
} from "@/presentation/components";

type Props = {
  options: ColumnFilterElementTemplateOptions;
};

export const FilterByStatus = ({ options }: Props) => {
  return (
    <MultiSelect
      value={options.value || []}
      options={Object.values(VersionQuotationStatus)
      .map((value) => ({
        label: versionQuotationRender[value].label,
        id: value,
      }))}
      display="chip"
      itemTemplate={({ id }: { id: VersionQuotationStatus; label: string }) => {
        const { label, severity, icon } = versionQuotationRender[id];
        return <Tag value={label} severity={severity} icon={icon} />;
      }}
      onChange={(e: MultiSelectChangeEvent) => {
        options.filterApplyCallback(e.value, options.index);
      }}
      dataKey="id"
      placeholder="Selecciona un estado"
      selectAllLabel="Todos"
      maxSelectedLabels={2}
      className="p-column-filter"
    />
  );
};
