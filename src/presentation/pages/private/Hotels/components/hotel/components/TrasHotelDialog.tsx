import { cn /* dateFnsAdapter  */ } from "@/core/adapters";
import { HotelEntity, HotelRoomEntity } from "@/domain/entities";
import {
  useGetTrashHotelAndRoomQuery,
  useRestoreHotelMutation,
  useRestoreRoomMutation,
} from "@/infraestructure/store/services";
import { usePaginator } from "@/presentation/hooks";
import { TrashDialog } from "@/presentation/pages/private/components";
import { useDebounce } from "primereact/hooks";
import { Tag } from "primereact/tag";
import { useState } from "react";

import { Accordion } from "@/presentation/components";

type Props = {
  visible: boolean;
  onHide: () => void;
};

const LIMIT = 10;

export const TrasHotelDialog = ({ visible, onHide }: Props) => {
  const { currentPage, first, handlePageChange, limit } = usePaginator(LIMIT);

  const [selectedHotel, setSelectedHotel] = useState<HotelEntity | undefined>(
    undefined
  );
  const [restorehotel, { isLoading: isLoadingRestore }] =
    useRestoreHotelMutation();
  const [searchByName, debouncedSearchByName, setSearchByName] = useDebounce(
    "",
    400
  );
  const [restoreRoom, { isLoading: isLoadingRestoreRoom }] =
    useRestoreRoomMutation();
  const handleRestoreRoom = async (id: number) => {
    await restoreRoom(id)
      .unwrap()
      .then(() => {
        setSelectedHotel(undefined);
      });
  };

  const { currentData, isLoading, isFetching, isError, refetch } =
    useGetTrashHotelAndRoomQuery(
      {
        name: debouncedSearchByName,
        page: currentPage,
        limit,
      },

      {
        skip: !visible,
      }
    );

  const users = currentData?.data;

  const handleRestore = async () => {
    if (selectedHotel) {
      await restorehotel(selectedHotel.id)
        .unwrap()
        .then(() => {
          setSelectedHotel(undefined);
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
        selectedHotel
          ? {
              title: selectedHotel.name,
              deletedAt: null,
              deleteReason: null,
              isDeleted: selectedHotel.isDeleted,
              archivedDetails: [
                {
                  subject: "ID",
                  message: selectedHotel.id,
                },
                {
                  subject: "Dirección",
                  message: selectedHotel.address,
                },
                {
                  subject: "Categoria",
                  message: selectedHotel.category,
                },
              ],
              dataQury: (
                <div className="w-full">
                  {selectedHotel.hotelRooms &&
                  selectedHotel.hotelRooms.length > 0 ? (
                    <Accordion
                      tabContent={selectedHotel.hotelRooms?.map(
                        (room: HotelRoomEntity) => ({
                          header: (
                            <div className=" flex justify-between items-center">
                              <Tag
                                icon="pi pi-th-large"
                                value={room.roomType}
                                severity="danger"
                              />
                              <div>
                                <i
                                  className={`pi pi-replay mr-2 text-primary ${
                                    isLoadingRestoreRoom
                                      ? "pointer-events-none opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    handleRestoreRoom(room.id);
                                  }}
                                />

                                <i
                                  className="pi pi-trash 
                                 text-red-500
                                "
                                  onClick={() => {}}
                                />
                              </div>
                            </div>
                          ),
                          children: (
                            <div className="text-sm text-gray-700 space-y-1 p-2">
                              <div>
                                <strong>Tipo:</strong> {room.roomType}
                              </div>
                              <div>
                                <strong>Capacidad:</strong> {room.capacity}
                              </div>
                              <div>
                                <strong>Precio USD:</strong> {room.priceUsd}
                              </div>

                              <div>
                                <strong>Motivo:</strong>{" "}
                                {room.deleteReason ?? "No especificado"}
                              </div>
                            </div>
                          ),
                        })
                      )}
                    />
                  ) : (
                    <div className="bg-red-100 text-red-700 p-2 rounded-md">
                      No hay habitaciones eliminadas
                    </div>
                  )}
                </div>
              ),
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
        itemTemplate: (hotel: HotelEntity) => {
          return (
            <div
              key={hotel.id}
              className={cn(
                "p-3 mb-2 border rounded cursor-pointer",
                selectedHotel?.id === hotel.id ? "bg-primary/10" : ""
              )}
              onClick={() => setSelectedHotel(hotel)}
            >
              <div className="flex justify-between gap-x-4 items-center">
                <div className="flex flex-col mb-3">
                  <small className="text-gray-500 text-xs">
                    ID: {hotel.id}
                  </small>
                </div>
                <Tag
                  value={
                    hotel.isDeleted
                      ? "Archivado Hotel"
                      : "Archivado solo sus Habitaciones"
                  }
                  severity={hotel.isDeleted ? "danger" : "success"}
                  icon="pi pi-building text-xl"
                />
              </div>
              <p className="text-sm text-gray-500">{hotel.name}</p>
              <p className="text-xs text-gray-400">Archivado: </p>
            </div>
          );
        },
      }}
    />
  );
};
