import { cn, dateFnsAdapter } from "@/core/adapters";
import { ClientEntity } from "@/domain/entities";
import {
  useGetTrashClientsQuery,
  useRestoreClientMutation,
} from "@/infraestructure/store/services";
import { TrashDialog } from "@/presentation/pages/private/components";
import { useDebounce } from "primereact/hooks";
import { usePaginator } from "@/presentation/hooks";
import { useState } from "react";

const LIMIT = 10;

type Props = {
  visible: boolean;
  onHide: () => void;
};

export const TrashClientDialog = ({ visible, onHide }: Props) => {
  const { currentPage, first, handlePageChange, limit } = usePaginator(LIMIT);

  const [restoreClient, { isLoading: isLoadingRestore }] =
    useRestoreClientMutation();

  const [searchByName, debouncedSearchByName, setSearchByName] = useDebounce(
    "",
    400
  );

  const { currentData, isLoading, isFetching, isError, refetch } =
    useGetTrashClientsQuery(
      {
        fullName: debouncedSearchByName,
        email: debouncedSearchByName,
        page: currentPage,
        limit,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          country: true,
          subregion: true,
          createdAt: true,
          updatedAt: true,
          deleted_at: true,
          delete_reason: true,
          is_deleted: true,
        },
      },
      {
        skip: !visible,
      }
    );
  
  const clients = currentData?.data;

  const [selectedClient, setSelectedClient] = useState<
    ClientEntity | undefined
  >(undefined);

  const handleRestore = async () => {
    if (selectedClient) {
      await restoreClient(selectedClient.id)
        .unwrap()
        .then(() => {
          setSelectedClient(undefined);
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
      title="Clientes en papelera"
      placeholder="Buscar por nombre o correo"
      selectedField={
        selectedClient
          ? {
              title: selectedClient.fullName,
              deletedAt: selectedClient.deletedAt ?? null,
              deleteReason: selectedClient.deleteReason ?? null,
              isDeleted: selectedClient.isDeleted ?? false,
              archivedDetails: [
                {
                  subject: "ID",
                  message: selectedClient.id,
                },
                {
                  subject: "Correo",
                  message: selectedClient.email ?? "No disponible",
                },
                {
                  subject: "Nombre completo",
                  message: selectedClient.fullName,
                },
                {
                  subject: "Creado en",
                  message: dateFnsAdapter.format(selectedClient.createdAt),
                },
                {
                  subject: "Actualizado en",
                  message: dateFnsAdapter.format(selectedClient.updatedAt),
                },
              ],
            }
          : undefined
      }
      dataViewProps={{
        first,
        rows: limit,
        totalRecords: clients?.total ?? 0,
        emptyMessage: "No hay clientes en papelera",
        onPage: handlePageChange,
        value: clients?.content ?? [],
        itemTemplate: (client: ClientEntity) => (
          <div
            key={client.id}
            className={cn(
              "p-3 mb-2 border rounded cursor-pointer",
              selectedClient?.id === client.id ? "bg-primary/10" : ""
            )}
            onClick={() => setSelectedClient(client)}
          >
            <div className="flex justify-between gap-x-4 items-center">
              <div className="flex flex-col mb-3">
                <small className="text-gray-500 text-xs">ID: {client.id}</small>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {client.fullName} ({client.email})
            </p>
            <p className="text-xs text-gray-400">
              Archivado:{" "}
              {client.deletedAt && dateFnsAdapter.format(client.deletedAt)}
            </p>
          </div>
        ),
      }}
    />
  );
};
