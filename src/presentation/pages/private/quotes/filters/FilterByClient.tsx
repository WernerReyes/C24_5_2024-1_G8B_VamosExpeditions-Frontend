import type { ClientEntity } from "@/domain/entities";
import { useGetAllClientsQuery } from "@/infraestructure/store/services";
import {
  type ColumnFilterElementTemplateOptions,
  MultiSelect,
  type MultiSelectChangeEvent,
} from "@/presentation/components";
import { ClientInfo } from "../../components";

type Props = {
  options: ColumnFilterElementTemplateOptions;
};

export const FilterByClient = ({ options }: Props) => {
  const { data: clientsData } = useGetAllClientsQuery();
  return (
    <MultiSelect
      value={options.value || []}
      options={clientsData?.data}
      display="chip"
      itemTemplate={(client: ClientEntity) => {
        return <ClientInfo client={client} />;
      }}
      dataKey="id"
      onChange={(e: MultiSelectChangeEvent) =>
        options.filterCallback(e.value, options.index)
      }
      optionLabel="fullName"
      placeholder="Selecciona un cliente"
      selectAllLabel="Todos"
      maxSelectedLabels={2}
      className="p-column-filter"
    />
  );
};
