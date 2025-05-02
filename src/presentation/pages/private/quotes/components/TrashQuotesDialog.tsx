import { cn, dateFnsAdapter } from "@/core/adapters";
import { formatCurrency } from "@/core/utils";
import {
  versionQuotationRender,
  type VersionQuotationEntity,
} from "@/domain/entities";
import {
  useGetAllTrashVersionQuotationsQuery,
  useRestoreVersionQuotationMutation,
} from "@/infraestructure/store/services";
import { ProgressBar, Tag } from "@/presentation/components";
import { usePaginator } from "@/presentation/hooks";
import { useState } from "react";
import {
  TrashDialog,
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

export const TrashQuotesDialog = ({ visible, onHide }: Props) => {
  const dispatch = useDispatch();
  const { currentPage, first, handlePageChange, limit } = usePaginator(LIMIT);

  const [searchByName, debouncedSearchByName, setSearchByName] = useDebounce(
    "",
    400
  );

  const { data, isLoading, isError, isFetching, refetch } =
    useGetAllTrashVersionQuotationsQuery(
      {
        page: currentPage,
        limit,
        name: debouncedSearchByName,
      },
      {
        skip: !visible,
      }
    );

  const archivedQuotes = data?.data;

  const [restoreVersionQuotation, { isLoading: isLoadingUnArchive }] =
    useRestoreVersionQuotationMutation();

  const [selectedQuote, setSelectedQuote] = useState<
    VersionQuotationEntity | undefined
  >(undefined);

  const handleRestore = () => {
    if (selectedQuote) {
      restoreVersionQuotation({
        versionNumber: selectedQuote.id.versionNumber,
        quotationId: selectedQuote.id.quotationId,
      })
        .unwrap()
        .then(() => {
          dispatch(
            onAddNumberOfVersions({
              quotationId: selectedQuote.id.quotationId,
            })
          );

          setSelectedQuote(undefined);
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
      isFetching={isFetching || isLoadingUnArchive}
      refetch={refetch}
      handleRestore={handleRestore}
      searchByName={searchByName}
      setSearchByName={setSearchByName}
      title="Cotizaciones en papelera"
      selectedField={
        selectedQuote
          ? {
              title: selectedQuote.name,
              deletedAt: selectedQuote.deletedAt ?? null,
              deleteReason: selectedQuote.deleteReason ?? null,
              archivedDetails: [
                {
                  subject: "Cliente",
                  message: (
                    <>
                      {selectedQuote.tripDetails?.client ? (
                        <ClientInfo client={selectedQuote.tripDetails.client} />
                      ) : (
                        <FieldNotAssigned message="Cliente no asignado" />
                      )}
                    </>
                  ),
                },
                {
                  subject: "Estado",
                  message: (
                    <Tag
                      value={versionQuotationRender[selectedQuote.status].label}
                      severity={
                        versionQuotationRender[selectedQuote.status].severity
                      }
                      icon={versionQuotationRender[selectedQuote.status].icon}
                    />
                  ),
                },

                {
                  subject: "Pasajeros",
                  message: `${selectedQuote.tripDetails?.numberOfPeople ?? 0} ${
                    selectedQuote.tripDetails?.numberOfPeople === 1
                      ? "Pasajero"
                      : "Pasajeros"
                  }`,
                },
                {
                  subject: "Fechas de viaje",

                  message: (
                    <>
                      {selectedQuote.tripDetails?.startDate &&
                      selectedQuote.tripDetails?.endDate ? (
                        <span>
                          {dateFnsAdapter.format(
                            selectedQuote.tripDetails.startDate
                          )}{" "}
                          -{" "}
                          {dateFnsAdapter.format(
                            selectedQuote.tripDetails.endDate
                          )}
                        </span>
                      ) : (
                        <FieldNotAssigned message="Fechas no asignadas" />
                      )}
                    </>
                  ),
                },
                {
                  subject: "Avance",
                  message: (
                    <ProgressBar
                      value={selectedQuote.completionPercentage ?? 0}
                      showValue
                      className="max-w-48 h-3 text-xs"
                    />
                  ),
                },
                {
                  subject: "Precio",
                  message: formatCurrency(selectedQuote.finalPrice ?? 0),
                },
                {
                  subject: "Oficial",
                  message: (
                    <i
                      className={cn(
                        "pi",
                        selectedQuote.official
                          ? "pi-check-circle text-green-500"
                          : "pi-times-circle text-red-500"
                      )}
                    />
                  ),
                },
                {
                  subject: "Representante",
                  message: selectedQuote.user && (
                    <UserInfo user={selectedQuote.user} />
                  ),
                },
                {
                  subject: "Fecha de creación",
                  message: `${
                    selectedQuote.createdAt &&
                    dateFnsAdapter.format(selectedQuote.createdAt)
                  }`,
                },
                {
                  subject: "Fecha de modificación",
                  message: `${
                    selectedQuote.updatedAt &&
                    dateFnsAdapter.format(selectedQuote.updatedAt)
                  }`,
                },
              ],
            }
          : undefined
      }
      dataViewProps={{
        first,
        rows: limit,
        totalRecords: archivedQuotes?.total ?? 0,
        onPage: handlePageChange,
        value: archivedQuotes?.content ?? [],
        itemTemplate: (quote: VersionQuotationEntity) => {
          const { icon, label, severity } =
            versionQuotationRender[quote.status];
          return (
            <div
              key={`${quote.id.quotationId}_${quote.id.versionNumber}`}
              className={cn(
                "p-3 mb-2 border rounded cursor-pointer",
                selectedQuote?.id === quote.id ? "bg-primary/10" : ""
              )}
              onClick={() => setSelectedQuote(quote)}
            >
              <div className="flex justify-between gap-x-4 items-center">
                <div className="flex flex-col mb-3">
                  <span className="font-bold">{quote.name}</span>
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
                {quote.deletedAt && dateFnsAdapter.format(quote.deletedAt)}
              </p>
            </div>
          );
        },
        emptyMessage: "No hay cotizaciones en la papelera",
      }}
    />
  );
};
