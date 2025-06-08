import { cn, dateFnsAdapter } from "@/core/adapters";
import { PartnerEntity } from "@/domain/entities";
import {
    useGetTrashPartnerQuery,
  useRestorePartnerMutation,
} from "@/infraestructure/store/services";
import { TrashDialog } from "@/presentation/pages/private/components";
import { usePaginator } from "@/presentation/hooks";
import { useDebounce } from "primereact/hooks";
import { useState } from "react";

const LIMIT = 10;

type Props = {
  visible: boolean;
  onHide: () => void;
};

export const TrashPartnerDialog = ({ visible, onHide }: Props) => {
  const { currentPage, first, handlePageChange, limit } = usePaginator(LIMIT);
  const [restorePartner, { isLoading: isLoadingRestore }] = useRestorePartnerMutation();
  const [searchByName, debouncedSearchByName, setSearchByName] = useDebounce("", 400);

  const { currentData, isLoading, isFetching, isError, refetch } =   useGetTrashPartnerQuery(
    {
      name: debouncedSearchByName,
      page: currentPage,
      limit,
      select: {
        id: true,
        name: true,
        deleted_at: true,
        delete_reason: true,
        created_at: true,
        updated_at: true,
        is_deleted: true,
      },
    },
    { skip: !visible }
  );
  
  const partners = currentData?.data;
  const [selectedPartner, setSelectedPartner] = useState<PartnerEntity | undefined>(undefined);


  const handleRestore = async () => {
    if (selectedPartner) {
      await restorePartner(selectedPartner.id)
        .unwrap()
        .then(() => setSelectedPartner(undefined));
    }
  };

  return (
    <TrashDialog
      visible={visible}
      downloadFilePdf={{ handleDownload: () => {}, disabled: true }}
      downloadFileExcel={{ handleDownload: () => {}, disabled: true }}
      onHide={onHide}
      isError={isError}
      isLoading={isLoading}
      isFetching={isFetching || isLoadingRestore}
      refetch={refetch}
      handleRestore={handleRestore}
      searchByName={searchByName}
      setSearchByName={setSearchByName}
      title="Partners en papelera"
      placeholder="Buscar por nombre o correo"
      selectedField={
        selectedPartner && {
          title: selectedPartner.name,
          deleteReason: selectedPartner.deleteReason ?? null,
          deletedAt: selectedPartner.deletedAt ?? null,
          isDeleted: selectedPartner.isDeleted ?? false,
          archivedDetails: [
            { subject: "ID", message: selectedPartner.id },
            { subject: "Nombre", message: selectedPartner.name },
            { subject: "Creado en", message: dateFnsAdapter.format(selectedPartner.createdAt) },
            { subject: "Actualizado en", message: dateFnsAdapter.format(selectedPartner.updatedAt) },
          ],
        }
      }
      dataViewProps={{
        first,
        rows: limit,
        totalRecords: partners?.total ?? 0,
        emptyMessage: "No hay partners en papelera",
        onPage: handlePageChange,
        value: partners?.content ?? [],
        itemTemplate: (partner: PartnerEntity) => (
          <div
            key={partner.id}
            className={cn(
              "p-3 mb-2 border rounded cursor-pointer ",
              selectedPartner?.id === partner.id ? "bg-primary/10" : ""
            )}
            onClick={() => setSelectedPartner(partner)}
          >
            <div className="flex justify-between gap-x-4 items-center mb-2">
              <small className="text-gray-500 text-xs">ID: {partner.id}</small>
            </div>
            <h5 className="text-primary font-bold">{partner.name}</h5>
            <p className="text-xs text-gray-400">
              Archivado:{" "}
              {partner.deletedAt && dateFnsAdapter.format(partner.deletedAt)}
            </p>
          </div>
        ),
      }}
    />
  );
};
