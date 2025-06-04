import { useEffect, useState } from "react";

//!import hooks apis
import { useGetHotelsPageWithDetailsQuery } from "@/infraestructure/store/services";

//!import components
import {
  Badge,
  Button,
  Column,
  DataTable,
  DefaultFallBackComponent,
  Dropdown,
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
import { usePaginator } from "@/presentation/hooks";
import { FilterApplyButton, FilterClearButton } from "../../filters";
import { HotelsTableFilters } from "../../quotes/types";
import { getTransformedFilters2 } from "../utils";
import { TrasHotelDialog } from "./hotel/components/TrasHotelDialog";

const ROW_PER_PAGE: [number, number, number] = [10, 20, 30];
const HOTELS_PAGINATION = "HOTELS_PAGINATION";

export const HotelTable = () => {
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined);

  const [isModalOpen, setModalOpen] = useState(false);
  const [rowData, setRowData] = useState<HotelEntity>({} as HotelEntity);

  const {
    handlePageChange,
    currentPage,
    first,
    limit,
    sortField,
    filters,
    handleSaveState,
  } = usePaginator(ROW_PER_PAGE[0], HOTELS_PAGINATION);

  const [{ name, distrit, category }, setUiFilters] =
    useState<HotelsTableFilters>({});
  const [openTrashDialog, setOpenTrashDialog] = useState(false);
  const {
    data: allHotels,
    isFetching,
    isLoading,
    refetch,
    isError,
  } = useGetHotelsPageWithDetailsQuery(
    {
      page: currentPage,
      limit,
      name,
      distrit,
      category,
    },
    {
      skip: !currentPage,
    }
  );

  useEffect(() => {
    if (!isError) return;
    const tdEmpty = document.querySelector(
      "#fallback-hotel-table .p-datatable-emptymessage td"
    );

    if (tdEmpty) {
      tdEmpty.setAttribute("colspan", "12");
    }
  }, [isError]);

  useEffect(() => {
    if (!filters) return;
    setUiFilters(getTransformedFilters2(filters));
  }, [filters]);

  const header = (
    <div className="flex sm:justify-between gap-y-3 flex-wrap justify-center items-center">
      <div className="flex ">
        <i
          className="pi pi-building text-2xl text-primary"
          style={{ fontSize: "1.5rem" }}
        />
        <Badge value={allHotels?.data?.total} />
      </div>

      <Button
        onClick={() => setOpenTrashDialog(true)}
        icon="pi pi-trash"
        label="Papelera"
        outlined
        size="small"
      />
      <TrasHotelDialog
        visible={openTrashDialog}
        onHide={() => setOpenTrashDialog(false)}
      />
    </div>
  );

  return (
    <div className="card">
      <Toolbar
        className=""
        start={
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
        }
        end={
          <div className="flex gap-3">
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
            {Array.from({ length: 7 }).map((_, i) => (
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
          stateKey={HOTELS_PAGINATION}
          customSaveState={handleSaveState}
          showGridlines
          value={allHotels?.data.content || []}
          filterDisplay="menu"
          editMode="cell"
          dataKey="id"
          className="w-full md:text-sm mt-4"
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
          first={first}
          rows={limit}
          totalRecords={allHotels?.data?.total}
          onPage={handlePageChange}
          onFilter={handlePageChange}
          rowsPerPageOptions={ROW_PER_PAGE}
          loading={isFetching || isLoading}
          lazy
          sortField={sortField?.sortField}
          sortOrder={sortField?.sortOrder}
          filters={filters}
          tableStyle={{ minWidth: "60rem" }}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          paginator
          currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} hoteles"
          emptyMessage={"No hay hoteles "}
        >
          {/*  <Column /> */}
          {/* <Column selectionMode="multiple" /> */}
          <Column expander />

          <Column
            field="name"
            header="Nombre"
            className="min-w-32"
            filter
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
            filterField="name"
            showFilterMatchModes={false}
            showFilterOperator={false}
            showAddButton={false}
            filterPlaceholder="Buscar nombre del hotel"
            filterClear={(options) => <FilterClearButton {...options} />}
            filterApply={(options) => <FilterApplyButton {...options} />}
          />
          <Column
            field="category"
            header="Categoría"
            filter
            className="min-w-32"
            headerClassName="min-w-32"
            filterMenuStyle={{ width: "16rem" }}
            body={(rowData) => (
              <div className="flex gap-2 items-center ">
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
            showFilterMatchModes={false}
            showFilterOperator={false}
            showAddButton={false}
            filterField="category"
            filterPlaceholder="Buscar categoría"
            filterClear={(options) => <FilterClearButton {...options} />}
            filterApply={(options) => <FilterApplyButton {...options} />}
            filterElement={(opcion) => (
              <Dropdown
                options={[
                  { label: "⭐⭐⭐", value: "3" },
                  { label: "⭐⭐⭐⭐", value: "4" },
                  { label: "⭐⭐⭐⭐⭐", value: "5" },
                  { label: "BOUTIQUE", value: "BOUTIQUE" },
                  { label: "VILLA", value: "VILLA" },
                  { label: "LODGE", value: "LODGE" },
                ]}
                value={opcion.value}
                onChange={(e) => {
                  console.log(e.value);
                  opcion.filterCallback(e.value);
                }}
                placeholder="Seleccionar"
                optionLabel="label"
                optionValue="value"
                itemTemplate={(option) => {
                  const numValue = parseInt(option.label);
                  return (
                    <div className="flex items-center gap-2">
                      {!isNaN(numValue) ? (
                        <Rating
                          value={numValue}
                          cancel={false}
                          readOnly
                          onIcon="pi pi-star-fill text-yellow-500"
                        />
                      ) : (
                        <span className="text-primary font-bold">
                          {option.label}
                        </span>
                      )}
                    </div>
                  );
                }}
                showClear
                filterPlaceholder="Buscar categoría"
              />
            )}
          />
          <Column
            field="address"
            header="Dirección"
            body={(rowData) => (
              <div className="flex gap-2 items-center">
                <i className="pi pi-map-marker text-xl text-primary" />
                {rowData.address}
              </div>
            )}
          />
          <Column
            field="distrit.name"
            header="Distrito"
            filter
            body={(rowData) => (
              <div className="flex gap-2 items-center">
                <i className="pi pi-map-marker text-xl text-primary" />
                {rowData.distrit?.name}
              </div>
            )}
            showFilterMatchModes={false}
            showFilterOperator={false}
            showAddButton={false}
            filterField="distrit.name"
            filterPlaceholder="Buscar distrito"
            filterClear={(options) => <FilterClearButton {...options} />}
            filterApply={(options) => <FilterApplyButton {...options} />}
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
      <Column selectionMode="multiple" />
      <Column expander />
      <Column header="Nombre" field="name" filter headerClassName="min-w-32" />
      <Column
        header="Categoría"
        field="category"
        filter
        headerClassName="min-w-24"
      />
      <Column header="Dirección" field="" filter headerClassName="min-w-48" />
      <Column header="Distrito" filter headerClassName="min-w-24" />
      <Column header="Acciones" />
    </Row>
  </ColumnGroup>
);
