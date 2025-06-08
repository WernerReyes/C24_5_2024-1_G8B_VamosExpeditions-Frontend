import { useState } from "react";
import { cn, dateFnsAdapter } from "@/core/adapters";
import { formatCurrency } from "@/core/utils";
import { Tag } from "@/presentation/components";
import {
  reservationStatusRender,
  type ReservationEntity,
} from "@/domain/entities";
import {
  useGetTrashReservationsQuery,
  useRestoreReservationMutation,
} from "@/infraestructure/store/services";
import { usePaginator } from "@/presentation/hooks";
import { useDebounce } from "primereact/hooks";
import { TrashDialog, UserInfo } from "../../components";

type Props = {
  visible: boolean;
  onHide: () => void;
};

const LIMIT = 10;

export const TrashReservationsDialog = ({ visible, onHide }: Props) => {
  const { currentPage, first, handlePageChange, limit } = usePaginator(LIMIT);

  const { currentData, isLoading, isFetching, isError, refetch } =
    useGetTrashReservationsQuery(
      {
        page: currentPage,
        limit,
        select: {
          id: true,
          status: true,
          created_at: true,
          updated_at: true,
          is_deleted: true,
          deleted_at: true,
          delete_reason: true,
          quotation: {
            version_quotation: [
              {
                version_number: true,
                quotation_id: true,
                name: true,
                trip_details: {
                  start_date: true,
                  end_date: true,
                  client: {
                    fullName: true,
                  },
                  number_of_people: true,
                },
                user: {
                  id_user: true,
                  fullname: true,
                },
                final_price: true,
              },
            ],
          },
        },
      },

      {
        skip: !visible,
      }
    );

  const reservations = currentData?.data;

  const [restoreReservation, { isLoading: isLoadingRestore }] =
    useRestoreReservationMutation();

  const [selectedReservation, setSelectedReservation] = useState<
    ReservationEntity | undefined
  >(undefined);

  const [searchByName, _, setSearchByName] = useDebounce("", 400);

  const handleRestore = async () => {
    if (selectedReservation) {
      await restoreReservation(selectedReservation.id)
        .unwrap()
        .then(() => {
          setSelectedReservation(undefined);
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
      isLoading={isLoading || isLoadingRestore}
      isFetching={isFetching}
      refetch={refetch}
      handleRestore={handleRestore}
      searchByName={searchByName}
      setSearchByName={setSearchByName}
      title="Reservas en papelera"
      selectedField={
        selectedReservation
          ? {
              title: "Reserva seleccionada",
              deletedAt: selectedReservation.deletedAt ?? null,
              deleteReason: selectedReservation.deleteReason ?? null,
              isDeleted: selectedReservation.isDeleted?? false,
              archivedDetails: [
                {
                  subject: "ID",
                  message: selectedReservation.id,
                },
                {
                  subject: "Estado",
                  message: (
                    <Tag
                      value={
                        reservationStatusRender[selectedReservation.status]
                          .label
                      }
                      severity={
                        reservationStatusRender[selectedReservation.status]
                          .severity
                      }
                      icon={
                        reservationStatusRender[selectedReservation.status].icon
                      }
                    />
                  ),
                },

                {
                  subject: "Fecha de creación",
                  message: dateFnsAdapter.format(
                    selectedReservation.createdAt ?? new Date()
                  ),
                },
                {
                  subject: "Fecha de modificación",
                  message: dateFnsAdapter.format(
                    selectedReservation.updatedAt ?? new Date()
                  ),
                },
                {
                  subject: "Cotización relacionada",
                  message: (
                    <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-2 py-1">
                            ID
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            Q
                            {
                              selectedReservation.versionQuotation.id
                                .quotationId
                            }
                            -V
                            {
                              selectedReservation.versionQuotation.id
                                .versionNumber
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-2 py-1">
                            Nombre
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            {selectedReservation.versionQuotation.name ??
                              "No disponible"}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-2 py-1">
                            Cliente
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            {selectedReservation.versionQuotation?.tripDetails
                              ?.client?.fullName ?? "No disponible"}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-2 py-1">
                            Fechas de viaje
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            {selectedReservation.versionQuotation?.tripDetails
                              ?.startDate &&
                              dateFnsAdapter.format(
                                selectedReservation.versionQuotation
                                  ?.tripDetails?.startDate
                              )}{" "}
                            -{" "}
                            {selectedReservation.versionQuotation?.tripDetails
                              ?.endDate &&
                              dateFnsAdapter.format(
                                selectedReservation.versionQuotation
                                  ?.tripDetails?.endDate
                              )}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-2 py-1">
                            Pasajeros
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            {selectedReservation.versionQuotation?.tripDetails
                              ?.numberOfPeople ?? 0}{" "}
                            {selectedReservation.versionQuotation?.tripDetails
                              ?.numberOfPeople === 1
                              ? "Pasajero"
                              : "Pasajeros"}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-2 py-1">
                            Precio total
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            {selectedReservation.versionQuotation?.finalPrice
                              ? formatCurrency(
                                  selectedReservation.versionQuotation
                                    ?.finalPrice ?? 0
                                )
                              : "No disponible"}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-2 py-1">
                            Responsable
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            <UserInfo
                              user={selectedReservation.versionQuotation!.user!}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ),
                },
              ],
            }
          : undefined
      }
      dataViewProps={{
        first,
        rows: limit,
        totalRecords: 0,
        emptyMessage: "No hay reservas en papelera",
        onPage: handlePageChange,
        value: reservations?.content ?? [],
        itemTemplate: (reservation: ReservationEntity) => {
          const { icon, label, severity } =
            reservationStatusRender[reservation.status];

          return (
            <div
              key={reservation.id}
              className={cn(
                "p-3 mb-2 border rounded cursor-pointer",
                selectedReservation?.id === reservation.id
                  ? "bg-primary/10"
                  : ""
              )}
              onClick={() => setSelectedReservation(reservation)}
            >
              <div className="flex justify-between gap-x-4 items-center">
                <div className="flex flex-col mb-3">
                  <small className="text-gray-500 text-xs">
                    ID: {reservation.id}
                  </small>
                </div>
                <Tag value={label} severity={severity} icon={icon} />
              </div>
              <p className="text-sm text-gray-500">
                {reservation.versionQuotation?.tripDetails?.client?.fullName}
              </p>
              <p className="text-xs text-gray-400">
                Archivado:{" "}
                {reservation.deletedAt &&
                  dateFnsAdapter.format(reservation.deletedAt)}
              </p>
            </div>
          );
        },
      }}
    />
  );
};
