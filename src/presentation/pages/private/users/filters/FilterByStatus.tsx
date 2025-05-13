import {
  RoleEnum,
  roleRender
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
      options={Object.values(RoleEnum).map((value) => ({
        label: roleRender[value].label,
        id: value,
      }))}
      display="chip"
      itemTemplate={({ id }: { id: RoleEnum; label: string }) => {
        const { label, severity, icon } = roleRender[id];
        return <Tag value={label} severity={severity} icon={icon} />;
      }}
      onChange={(e: MultiSelectChangeEvent) => {
        options.filterCallback(e.value, options.index);
      }}
      dataKey="id"
      placeholder="Selecciona un rol"
      selectAllLabel="Todos"
      maxSelectedLabels={2}
      className="p-column-filter max-w-[200px]"
    />
  );
};
