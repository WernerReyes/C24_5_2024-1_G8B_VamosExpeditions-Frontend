import { cn, dateFnsAdapter, phoneNumberAdapter } from "@/core/adapters";
import { roleRender, UserEntity } from "@/domain/entities";
import {
  useGetTrashUsersQuery,
  useRestoreUserMutation,
} from "@/infraestructure/store/services";
import { Tag } from "@/presentation/components";
import { usePaginator } from "@/presentation/hooks";
import { TrashDialog } from "@/presentation/pages/private/components";
import { useDebounce } from "primereact/hooks";
import { useState } from "react";

const LIMIT = 10;

type Props = {
  visible: boolean;
  onHide: () => void;
};

export const TrashUserDialog = ({ visible, onHide }: Props) => {
  const { currentPage, first, handlePageChange, limit } = usePaginator(LIMIT);

  const [restoreUser, { isLoading: isLoadingRestore }] =
    useRestoreUserMutation();

  const [searchByName, debouncedSearchByName, setSearchByName] = useDebounce(
    "",
    400
  );

  const { currentData, isLoading, isFetching, isError, refetch } =
    useGetTrashUsersQuery(
      {
        fullname: debouncedSearchByName,
        email: debouncedSearchByName,
        page: currentPage,
        limit,
        select: {
          id_user: true,
          fullname: true,
          email: true,
          phone_number: true,
          role: {
            name: true,
          },
          created_at: true,
          updated_at: true,
          deleted_at: true,
          delete_reason: true,
          description: true,
        },
      },

      {
        skip: !visible,
      }
    );

  const users = currentData?.data;

  const [selectedUser, setSelectedUser] = useState<UserEntity | undefined>(
    undefined
  );

  const handleRestore = async () => {
    if (selectedUser) {
      await restoreUser(selectedUser.id)
        .unwrap()
        .then(() => {
          setSelectedUser(undefined);
        });
    }
  };

  return (
    <TrashDialog
      visible={visible}
      downloadFilePdf={{
        handleDownload: () => {},
        disabled: true,
      }}
      downloadFileExcel={{
        handleDownload: () => {},
        disabled: true,
      }}
      onHide={onHide}
      isError={isError}
      isLoading={isLoading}
      isFetching={isFetching || isLoadingRestore}
      refetch={refetch}
      handleRestore={handleRestore}
      searchByName={searchByName}
      setSearchByName={setSearchByName}
      title="Usuarios en papelera"
      placeholder="Buscar por nombre o correo"
      selectedField={
        selectedUser
          ? {
              title: selectedUser.fullname,
              deletedAt: selectedUser.deletedAt ?? null,
              deleteReason: selectedUser.deleteReason ?? null,

              archivedDetails: [
                {
                  subject: "ID",
                  message: selectedUser.id,
                },
                {
                  subject: "Correo",
                  message: selectedUser.email,
                },
                {
                  subject: "Rol",
                  message: selectedUser.role?.name,
                },
                {
                  subject: "Teléfono",
                  message: phoneNumberAdapter.format(
                    selectedUser.phoneNumber ?? ""
                  ),
                },
                {
                  subject: "Descripción",
                  message: selectedUser.description,
                },
                {
                  subject: "Creado en",
                  message: dateFnsAdapter.format(selectedUser.createdAt),
                },
                {
                  subject: "Actualizado en",
                  message: dateFnsAdapter.format(selectedUser.updatedAt),
                },
              ],
            }
          : undefined
      }
      dataViewProps={{
        first,
        rows: limit,
        totalRecords: users?.total ?? 0,
        emptyMessage: "No hay usuarios en papelera",
        onPage: handlePageChange,
        value: users?.content ?? [],
        itemTemplate: (user: UserEntity) => {
          const { icon, label, severity } = roleRender[user!.role!.name];

          return (
            <div
              key={user.id}
              className={cn(
                "p-3 mb-2 border rounded cursor-pointer",
                selectedUser?.id === user.id ? "bg-primary/10" : ""
              )}
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex justify-between gap-x-4 items-center">
                <div className="flex flex-col mb-3">
                  <small className="text-gray-500 text-xs">ID: {user.id}</small>
                </div>
                <Tag value={label} severity={severity} icon={icon} />
              </div>
              <p className="text-sm text-gray-500">
                {user.fullname} ({user.email})
              </p>
              <p className="text-xs text-gray-400">
                Archivado:{" "}
                {user.deletedAt && dateFnsAdapter.format(user.deletedAt)}
              </p>
            </div>
          );
        },
      }}
    />
  );
};
