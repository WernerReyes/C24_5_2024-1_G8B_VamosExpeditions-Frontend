import { UserEntity } from "@/domain/entities";
import { useGetUsersQuery } from "@/infraestructure/store/services";
import {
  type ColumnFilterElementTemplateOptions,
  MultiSelect,
  type MultiSelectChangeEvent,
} from "@/presentation/components";
import { UserInfo } from "../components";

type Props = {
  options: ColumnFilterElementTemplateOptions;
};

export const FilterByRepresentative = ({ options }: Props) => {
  const { data: usersData } = useGetUsersQuery();

  return (
    <MultiSelect
      value={options.value || []}
      options={usersData?.data || []}
      display="chip"
      itemTemplate={(user: UserEntity) => <UserInfo user={user} />}
      onChange={(e: MultiSelectChangeEvent) => options.filterApplyCallback(e.value, options.index)}
      dataKey="id"
      optionLabel="fullname"
      placeholder="Selecciona representantes"
      maxSelectedLabels={2}
      className="p-column-filter"
    />
  );
};
