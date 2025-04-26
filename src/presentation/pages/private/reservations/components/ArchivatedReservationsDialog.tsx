import { cn, dateFnsAdapter } from "@/core/adapters";
import { formatCurrency } from "@/core/utils";
import {
  ReservationEntity,
  versionQuotationRender,
  type VersionQuotationEntity,
} from "@/domain/entities";
import {
  useGetAllArchivedVersionQuotationsQuery,
  useUnArchiveVersionQuotationMutation,
} from "@/infraestructure/store/services";
import { ProgressBar, Tag } from "@/presentation/components";
import { usePaginator } from "@/presentation/hooks";
import { useState } from "react";
import {
  ArchivedDialog,
  ClientInfo,
  FieldNotAssigned,
  UserInfo,
} from "../../components";
import { useDebounce } from "primereact/hooks";
import { useDispatch } from "react-redux";
import { onAddNumberOfVersions } from "@/infraestructure/store";

type Props = {
  visible: boolean;
  onHide: () => void;
};

const LIMIT = 10;

export const ArchivatedReservationsDialog = ({ visible, onHide }: Props) => {
  const dispatch = useDispatch();
  const { currentPage, first, handlePageChange, limit } = usePaginator(LIMIT);
   
  const [selectedReservation, setSelectedReservation] = useState<ReservationEntity>();

  const [searchByName, debouncedSearchByName, setSearchByName] = useDebounce(
    "",
    400
  );

  

  return (
    <ArchivedDialog
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
      isError={true}
      isLoading={false}
      isFetching={false}
      refetch={() => {}}
      handleUnArchive={() => {}}
      searchByName={searchByName}
      setSearchByName={setSearchByName}
      title="Reservas archivadas"
      selectedField={
        undefined
      }
      dataViewProps={{
        first,
        rows: limit,
        totalRecords: 0,
        onPage: handlePageChange,
        value: [],
        itemTemplate: (reservation: ReservationEntity) => {
         
          return (
            <div
              key={reservation.id}
              className={cn(
                "p-3 mb-2 border rounded cursor-pointer",
                selectedReservation?.id === reservation.id ? "bg-primary/10" : ""
              )}
              onClick={() => setSelectedReservation(reservation)}
            >
              {/* <div className="flex justify-between gap-x-4 items-center">
                <div className="flex flex-col mb-3">
                  <span className="font-bold">{reservation.name}</span>
                  <small className="text-gray-500 text-xs">
                    Q{quote.id.quotationId}-V{quote.id.versionNumber}
                  </small>
                </div>
                <Tag value={label} severity={severity} icon={icon} />
              </div>
              <p className="text-sm text-gray-500">
                {quote.tripDetails?.client?.fullName}
              </p>
              <p className="text-xs text-gray-400">
                Archivado:{" "}
                {quote.archivedAt && dateFnsAdapter.format(quote.archivedAt)}
              </p> */}
            </div>
          );
        },
        emptyMessage: "No hay reservas archivadas",
      }}
    />
  );
};
