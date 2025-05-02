import { reservationStatusRender, ReservationStatus } from "@/domain/entities";
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
      options={Object.values(ReservationStatus).map((value) => ({
        label: reservationStatusRender[value].label,
        id: value,
      }))}
      display="chip"
      itemTemplate={({ id }: { id: ReservationStatus; label: string }) => {
        const { label, severity, icon } = reservationStatusRender[id];
        return <Tag value={label} severity={severity} icon={icon} />;
      }}
      onChange={(e: MultiSelectChangeEvent) => {
        options.filterCallback(e.value, options.index);
      }}
      dataKey="id"
      placeholder="Selecciona un estado"
      selectAllLabel="Todos"
      maxSelectedLabels={2}
      className="p-column-filter max-w-[200px]"
    />
  );
};
