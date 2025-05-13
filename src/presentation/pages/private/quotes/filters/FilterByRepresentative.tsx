import { UserEntity } from "@/domain/entities";
import {
  type ColumnFilterElementTemplateOptions,
  MultiSelect,
  type MultiSelectChangeEvent,
} from "@/presentation/components";
import { UserInfo } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import { setNewLimit } from "@/infraestructure/store";

type Props = {
  options: ColumnFilterElementTemplateOptions;
};

export const FilterByRepresentative = ({ options }: Props) => {
  const dispatch = useDispatch();
  const { usersPagination, isLoadingUsers } = useSelector(
    (state: AppState) => state.users
  );

  return (
    <MultiSelect
      value={options.value || []}
      options={usersPagination.content || []}
      display="chip"
      itemTemplate={(user: UserEntity) => <UserInfo user={user} />}
      onChange={(e: MultiSelectChangeEvent) =>
        options.filterCallback(e.value, options.index)
      }
      loading={isLoadingUsers}
      panelFooterTemplate={() => {
        return (
          <div className="flex justify-center items-center gap-2 p-2">
            {isLoadingUsers && <span className="text-primary">Cargando...</span>}
            {!isLoadingUsers && (
              <button
                type="button"
                disabled={usersPagination.limit >= usersPagination.total}
                className="text-primary hover:underline disabled:opacity-50"
                onClick={(e) => {
                 
                  e.stopPropagation();
                  dispatch(setNewLimit());
                }}
              >
                Cargar más
              </button>
            )}
          </div>
        );
      }}
      
      dataKey="id"
      optionLabel="fullname"
      placeholder="Selecciona representantes"
      maxSelectedLabels={2}
      className="p-column-filter max-w-56"
    />
  );
};
