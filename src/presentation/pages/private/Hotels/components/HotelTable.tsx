/* import { cn } from "@/core/adapters"; */
//import React
import { useEffect, useState } from "react";

//import hooks apis
import { useGetHotelsPageWithDetailsQuery } from "@/infraestructure/store/services";

//import components
import {
  Badge,
  Button,
  Column,
  DataTable,
  DefaultFallBackComponent,
  ErrorBoundary,
  Rating,
  Skeleton,
  type DataTableExpandedRows,
  type DataTableValueArray,
} from "@/presentation/components";

//import primereact components
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Toolbar } from "primereact/toolbar";
import { TableActions } from "./TableActions";
import { HotelEntity } from "@/domain/entities";
import { HotelEditAndRegisterModal } from "./HotelEditAndRegisterModal";
import { RoomTable } from "./RoomTable";
import { UploadeExcelHotelAndRoom } from "./hotel/UploadeExcelHotelAndRoom";

export const HotelTable = () => {
  // useState
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined);

  const [isModalOpen, setModalOpen] = useState(false);
  const [rowData, setRowData] = useState<HotelEntity>({} as HotelEntity);

  // hook to get all hotels
  const {
    data: allHotels,
    isFetching,
    isLoading,
    refetch,
    isError,
  } = useGetHotelsPageWithDetailsQuery({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (!isError) return;
    const tdEmpty = document.querySelector(
      "#fallback-hotel-table .p-datatable-emptymessage td"
    );

    if (tdEmpty) {
      tdEmpty.setAttribute("colspan", "12");
    }
  }, [isError]);

  const header = (
    <div className="flex flex-wrap gap-2 p-2 items-center">
      <i
        className="pi pi-building text-2xl text-primary"
        style={{ fontSize: "1.5rem" }}
      />
      {/* pi-map-marker */}
      <Badge value={allHotels?.data?.total} />
    </div>
  );

  return (
    <div className="card">
      <Toolbar
        className="mt-10 mb-4"
        start={
          <div className="flex gap-2">
            <Button icon="pi pi-trash" label="Eliminar" severity="danger" />
            {/* <Button icon="pi pi-clone" label="Duplicar" severity="secondary" /> */}
          </div>
        }
        end={
          <div className="flex gap-3">
            <Button
              label="Descargar Plantilla"
              icon="pi pi-download"
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/Template/HOTELS_AND_ROOMS.xlsx";
                link.download = "plantilla-hoteles.xlsx"; 
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-transparent text-black border-[#D0D5DD]"
            />
            <UploadeExcelHotelAndRoom />
            <Button
              label="Nuevo Hotel"
              icon="pi pi-plus"
              className="bg-transparent text-black border-[#D0D5DD]"
              onClick={() => {
                setModalOpen(true);
                setRowData({} as HotelEntity);
              }}
            />
            <HotelEditAndRegisterModal
              setShowModal={setModalOpen}
              showModal={isModalOpen}
              rowData={rowData}
            />
          </div>
        }
      />

      <ErrorBoundary
        isLoader={isFetching || isLoading}
        loadingComponent={
          <DataTable
            header={header}
            pt={{
              header: {
                className: "!bg-secondary",
              },
            }}
            showGridlines
            headerColumnGroup={headerColumnGroup}
            value={Array.from({
              length: Array.isArray(allHotels?.data?.content)
                ? allHotels.data.content.length
                : 10,
            })}
            lazy
            size="small"
            emptyMessage={"No hay hoteles"}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <Column
                key={i}
                field={`loading-${i}`}
                header="Cargando..."
                body={() => <Skeleton shape="rectangle" height="1.5rem" />}
              />
            ))}
          </DataTable>
        }
        fallBackComponent={
          <DataTable
            header={header}
            pt={{
              header: {
                className: "!bg-secondary",
              },
            }}
            id="fallback-hotel-table"
            showGridlines
            headerColumnGroup={headerColumnGroup}
            value={[]}
            lazy
            size="small"
            emptyMessage={
              <DefaultFallBackComponent
                refetch={refetch}
                isFetching={isFetching}
                isLoading={isLoading}
                message="No se pudieron cargar los hoteles"
              />
            }
          />
        }
        error={isError}
      >
        <DataTable
          scrollable
          size="small"
          stateStorage="custom"
          showGridlines
          value={allHotels?.data.content || []}
          emptyMessage={"No hay hoteles "}
          filterDisplay="menu"
          editMode="cell"
          dataKey="id"
          className="text-sm lg:text-[15px] mt-5"
          header={header}
          pt={{
            footer: {
              className: "bg-white",
            },
            header: {
              className: "!bg-secondary",
            },
          }}
          onRowToggle={(e) => setExpandedRows(e.data)}
          expandedRows={expandedRows}
          rowExpansionTemplate={(data: HotelEntity) => {
            return <RoomTable rowData={data} />;
          }}
        >
          {/*  <Column /> */}
          <Column selectionMode="multiple" />
          <Column expander />
          {/* <Column field="id" header="Código" filter sortable /> */}
          <Column
            field="name"
            header="Nombre"
            filter
            sortable
            body={(rowData) => (
              <div className="flex gap-2 items-center">
                <i
                  className="pi 
                  pi-building 
                  text-xl text-primary"
                />
                {rowData.name}
              </div>
            )}
          />
          <Column
            header="Categoría"
            field="category"
            body={(rowData) => (
              <div className="flex gap-2 items-center">
                {["3", "4", "5"].includes(rowData.category) ? (
                  <Rating
                    value={Number(rowData.category)}
                    cancel={false}
                    readOnly
                    onIcon="pi pi-star-fill text-yellow-500"
                  />
                ) : ["BOUTIQUE", "VILLA", "LODGE"].includes(
                    rowData.category
                  ) ? (
                  <span className="text-primary font-bold">
                    {rowData.category}
                  </span>
                ) : (
                  <span className="text-primary">Sin Categoría</span>
                )}
              </div>
            )}
          />
          <Column
            field="address"
            header="Dirección"
            filter
            sortable
            body={(rowData) => (
              <div className="flex gap-2 items-center">
                <i className="pi pi-map-marker text-xl text-primary" />
                {rowData.address}
              </div>
            )}
          />
          <Column
            field="district"
            header="Distrito"
            body={(rowData) => (
              <div className="flex gap-2 items-center">
                <i className="pi pi-map-marker text-xl text-primary" />
                {rowData.distrit?.name}
              </div>
            )}
            filter
            sortable
          />
          <Column
            header="Acciones"
            body={(hotelEntity: HotelEntity) => (
              <TableActions rowData={hotelEntity} />
            )}
          />
        </DataTable>
      </ErrorBoundary>
    </div>
  );
};

const headerColumnGroup = (
  <ColumnGroup>
    <Row>
      <Column />
      <Column header="Código" headerClassName="min-w-24" />
      <Column header="Nombre" filter headerClassName="min-w-32" />
      <Column header="Dirección" filter headerClassName="min-w-48" />
      <Column header="Distrito" headerClassName="min-w-24" />
      <Column header="Acciones" />
    </Row>
  </ColumnGroup>
);
