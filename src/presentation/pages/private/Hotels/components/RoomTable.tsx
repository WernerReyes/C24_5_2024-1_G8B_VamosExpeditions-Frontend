import { HotelEntity, HotelRoomEntity } from "@/domain/entities";
import { Badge, Button, Column, DataTable } from "@/presentation/components";
import { Toolbar } from "primereact/toolbar";
import { TableRoomActions } from "./room/TableRoomActions";
import { useState } from "react";
import { RoomEditAndRegisterModal } from "./room/RoomEditAndRegisterModal";

type TyoeTableActions = {
  rowData: HotelEntity;
};

export const RoomTable = ({ rowData }: TyoeTableActions) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-4">
      <DataTable
        value={rowData.hotelRooms}
        className="md:text-sm"
        emptyMessage="No hay habitaciones"
        filterDisplay="menu"
        /* editMode="cell" */
        dataKey="id"
        size="small"
        header={
          <Toolbar
            start={
              <div className="flex flex-wrap gap-2 p-2 items-center">
                <i
                  className="pi pi-th-large text-2xl text-primary"
                  style={{ fontSize: "1.5rem" }}
                />
                <Badge
                  value={
                    rowData.hotelRooms?.length
                      ? `Total: ${rowData.hotelRooms?.length}`
                      : "Total: 0"
                  }
                />
              </div>
            }
            style={{ backgroundColor: "#F9FAFB" }}
            end={
              <>
                <Button
                  label="Agregar Habitación"
                  icon="pi pi-plus"
                  size="small"
                  
                  onClick={() => {
                    setModalOpen(true);
                  }}
                />
                {/* new room  */}
                <RoomEditAndRegisterModal
                  showModal={isModalOpen}
                  setShowModal={setModalOpen}
                  rowData={{
                    hotels: {
                      id: rowData.id,
                      name: rowData.name,
                    },
                  }}
                />
              </>
            }
          />
        }
        pt={{
          footer: {
            className: "bg-white",
          },
          header: {
            className: "!bg-secondary",
          },
        }}
        scrollable
      >
        {/* <Column field="id" header="ID" filter headerClassName="min-w-32" /> */}
        <Column
          header="Capacidad"
          field="capacity"
          headerClassName="min-w-24"
          body={(rowData) => (
            <div
              className="flex gap-2 items-center 
          
          font-bold text-primary"
            >
              <i className="pi pi-users text-xl" />
              {rowData.capacity}
            </div>
          )}
        />

        <Column
          field="pricePen"
          header="Precio en PEN"
          filter
          headerClassName="min-w-24"
          body={(rowData) => (
            <div className="flex gap-2 items-center font-bold text-yellow-500">
              {"S/. " + rowData.pricePen}
            </div>
          )}
        />
        <Column
          field="priceUsd"
          header="Precio en USD"
          body={(rowData) => (
            <div className="text-green-500 font-bold flex gap-2 items-center">
              <i className="pi pi-dollar " />
              {rowData.priceUsd}
            </div>
          )}
          headerClassName="min-w-24"
        />
        {/* <Column 
        
         header="Temporada"
         field="season_type"
        /> */}
        <Column
          field="roomType"
          header="Tipo de Habitación"
          headerClassName="min-w-24"
          body={(rowData) => (
            <div className="flex gap-2 items-center font-bold ">
              <i
                className="pi pi-th-large text-primary"
                style={{ fontSize: "1.1rem" }}
              />
              {rowData.roomType}
            </div>
          )}
        />
        <Column
          field="rateUsd"
          header="Tarifa en USD"
          headerClassName="min-w-24"
          body={(rowData) => (
            <div className="text-green-500 font-bold flex gap-2 items-center">
              <i className="pi pi-dollar " />
              {rowData.rateUsd}
            </div>
          )}
        />
        <Column
          field="serviceTax"
          header="Impuesto al Servicio"
          headerClassName="min-w-24"
        />

        <Column
          header="Acciones"
          body={(roomRowData: HotelRoomEntity) => (
            <TableRoomActions
              rowData={{
                hotels: {
                  id: rowData.id,
                  name: rowData.name,
                },
                ...roomRowData,
              }}
            />
          )}
        />
      </DataTable>
    </div>
  );
};
