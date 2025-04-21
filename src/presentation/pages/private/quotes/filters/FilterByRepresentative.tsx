import { UserEntity } from "@/domain/entities";
import {
  type ColumnFilterElementTemplateOptions,
  MultiSelect,
  type MultiSelectChangeEvent,
} from "@/presentation/components";
import { UserInfo } from "../../components";
import { useSelector } from "react-redux";
import type { AppState } from "@/app/store";

type Props = {
  options: ColumnFilterElementTemplateOptions;
};

export const FilterByRepresentative = ({ options }: Props) => {
  const { users } = useSelector((state: AppState) => state.users);

  return (
    <MultiSelect
      value={options.value || []}
      options={users}
      display="chip"
      itemTemplate={(user: UserEntity) => <UserInfo user={user} />}
      onChange={(e: MultiSelectChangeEvent) =>
        options.filterCallback(e.value, options.index)
      }
      dataKey="id"
      optionLabel="fullname"
      placeholder="Selecciona representantes"
      maxSelectedLabels={2}
      className="p-column-filter max-w-56"
    />
  );
};
