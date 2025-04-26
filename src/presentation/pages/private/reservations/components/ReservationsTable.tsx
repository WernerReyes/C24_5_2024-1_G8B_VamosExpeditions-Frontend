import { cn, dateFnsAdapter } from "@/core/adapters";
import { formatCurrency } from "@/core/utils";
import {
  reservationStatusRender,
  type ReservationEntity,
} from "@/domain/entities";

import {
  Button,
  Column,
  DataTable,
  DataTableRef,
  DefaultFallBackComponent,
  ErrorBoundary,
  Skeleton,
  Tag,
  type DataTableSelectionMultipleChangeEvent,
} from "@/presentation/components";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Toolbar } from "primereact/toolbar";
import { useState, useRef, useEffect } from "react";
import { ClientInfo, UserInfo } from "../../components";
import { usePaginator } from "@/presentation/hooks";
import type { ReservationTableFilters } from "../types";
import { filterByStatus, getTransformedFilters } from "../utils";
import { FilterByStatus } from "../filters";
import { useGetAllReservationsQuery } from "@/infraestructure/store/services";
import {
  FilterApplyButton,
  FilterByDate,
  FilterClearButton,
} from "../../filters";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { constantStorage } from "@/core/constants";
import { EditorReservationStatus, CancelConfirmReservationDialog, DeleteConfirmReservationDialog, ArchivatedReservationsDialog } from "./";

const { RESERVATION_PAGINATION } = constantStorage;

const ROW_PER_PAGE: [number, number, number] = [10, 20, 30];

export const ReservationTable = () => {
  const dt = useRef<DataTableRef>(null);
  const {
    currentPage,
    limit,
    filters,
    first,
    handlePageChange,
    handleSaveState,
  } = usePaginator(ROW_PER_PAGE[0], RESERVATION_PAGINATION);

  const [{ status, createdAt, updatedAt }, setFormatedFilters] =
    useState<ReservationTableFilters>({});

  const { currentData, isFetching, isLoading, refetch, isError } =
    useGetAllReservationsQuery({
      page: currentPage,
      limit,
      status,
      createdAt,
      updatedAt,
    });

  const reservations = currentData?.data;

  const [selectedReservations, setSelectedReservations] = useState<
    ReservationEntity[]
  >([]);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [cancelReservation, setCancelReservation] =
    useState<ReservationEntity | null>(null);

  const [visibleArchivatedReservations, setVisibleArchivatedReservations] =
    useState<boolean>(false);

  useEffect(() => {
    if (!filters) return;
    setFormatedFilters(getTransformedFilters(filters));
  }, [filters]);

  useEffect(() => {
    if (!isError) return;
    const tdEmpty = document.querySelector(
      "#fallback-reservations .p-datatable-emptymessage td"
    );

    if (tdEmpty) {
      tdEmpty.setAttribute("colspan", "12");
    }
  }, [isError]);

  return (
    <div>
      <CancelConfirmReservationDialog
        cancelReservation={cancelReservation}
        setCancelReservation={setCancelReservation}
      />
      <DeleteConfirmReservationDialog
        selectedReservations={selectedReservations}
        visible={confirmVisible}
        onHide={setConfirmVisible}
        setSelectedReservations={setSelectedReservations}
      />
      <ArchivatedReservationsDialog
        visible={visibleArchivatedReservations}
        onHide={() => setVisibleArchivatedReservations(false)}
      />
      <div className="card">
        <Toolbar
          className="mb-4"
          end={
            <Button
              icon="pi pi-bookmark"
              label="Archivadas"
              outlined
              size="small"
              disabled={isFetching || isLoading || isError}
              onClick={() => setVisibleArchivatedReservations(true)}
            />
          }
        />

        <ErrorBoundary
          isLoader={isFetching || isLoading}
          loadingComponent={
            <DataTable
              pt={{
                header: {
                  className: "!bg-secondary",
                },
              }}
              showGridlines
              headerColumnGroup={headerColumnGroup}
              value={Array.from({
                length: reservations?.content.length || 10,
              })}
              lazy
              size="small"
              emptyMessage={"No hay cotizaciones"}
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
              pt={{
                header: {
                  className: "!bg-secondary",
                },
              }}
              id="fallback-reservations"
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
                  message="No se pudieron cargar las reservaciones"
                />
              }
            />
          }
          error={isError}
        >
          <DataTable
            ref={dt}
            scrollable
            size="small"
            stateStorage="custom"
            stateKey={RESERVATION_PAGINATION}
            customSaveState={(state: any) => {
              handleSaveState({
                first,
                rows: limit,
                filters: state.filters,
              });
            }}
            showGridlines
            value={reservations?.content || []}
            selection={selectedReservations}
            onSelectionChange={(
              e: DataTableSelectionMultipleChangeEvent<ReservationEntity[]>
            ) => {
              if (Array.isArray(e.value)) {
                setSelectedReservations(e.value);
              }
            }}
            className="md:text-sm"
            emptyMessage={"No hay reservaciones"}
            filterDisplay="menu"
            onFilter={handlePageChange}
            filters={filters}
            headerColumnGroup={headerColumnGroup}
            rows={limit}
            editMode="cell"
            dataKey="id"
            pt={{
              footer: {
                className: "bg-white",
              },
            }}
            footer={
              <Paginator
                first={first}
                rows={limit}
                totalRecords={reservations?.total || 0}
                rowsPerPageOptions={ROW_PER_PAGE}
                onPageChange={(e: PaginatorPageChangeEvent) => {
                  handlePageChange(e);
                  handleSaveState({
                    first: e.first,
                    rows: e.rows,

                    filters,
                  });
                }}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} cotizaciones"
              />
            }
            selectionMode="multiple"
          >
            <Column selectionMode="multiple"></Column>
            <Column field="id" align="center" />
            <Column
              align="center"
              filterMatchMode="custom"
              filterFunction={filterByStatus}
              filterType="custom"
              body={(reservation: ReservationEntity) => {
                const { label, severity, icon } =
                  reservationStatusRender[reservation.status];
                return <Tag value={label} severity={severity} icon={icon} />;
              }}
              editor={(options) => {
                return (
                  <EditorReservationStatus
                    options={options}
                    setCancelReservation={setCancelReservation}
                  />
                );
              }}
              filterField="status"
            />

            <Column
              align="center"
              dataType="date"
              filterMatchMode="gte"
              filterType="dateIs"
              filterField="createdAt"
              body={(reservation: ReservationEntity) => {
                return dateFnsAdapter.format(reservation.createdAt);
              }}
            />

            <Column
              align="center"
              filterField="updatedAt"
              body={(reservation: ReservationEntity) => {
                return dateFnsAdapter.format(reservation.updatedAt);
              }}
            />

            {/*  Version Quotation */}
            <Column
              headerClassName="min-w-24"
              className="min-w-24"
              header="Código"
              body={({ versionQuotation }: ReservationEntity) => {
                if (!versionQuotation) return "";
                return (
                  <label>
                    Q{versionQuotation.id.quotationId}-V
                    {versionQuotation.id.versionNumber}
                  </label>
                );
              }}
            />

            <Column field="versionQuotation.name" align="center" />

            <Column
              body={(reservation: ReservationEntity) => {
                const client =
                  reservation.versionQuotation?.tripDetails?.client;
                return client ? <ClientInfo client={client!} /> : "";
              }}
            />

            <Column
              align="center"
              body={(reservation: ReservationEntity) => {
                if (!reservation.versionQuotation?.tripDetails) {
                  return "";
                }
                return dateFnsAdapter.format(
                  reservation.versionQuotation.tripDetails.startDate
                );
              }}
            />

            <Column
              align="center"
              body={(reservation: ReservationEntity) => {
                if (!reservation.versionQuotation?.tripDetails) {
                  return "";
                }
                return dateFnsAdapter.format(
                  reservation.versionQuotation.tripDetails.endDate
                );
              }}
            />

            <Column
              align="center"
              body={(reservation: ReservationEntity) => {
                const finalPrice = reservation.versionQuotation?.finalPrice;
                return formatCurrency(finalPrice ?? 0);
              }}
            />
            <Column
              header="Cotización"
              align="center"
              body={(reservation: ReservationEntity) => {
                const representative = reservation.versionQuotation?.user;
                if (!representative) return "";
                return <UserInfo user={representative} />;
              }}
            />
          </DataTable>
        </ErrorBoundary>
      </div>
    </div>
  );
};

const headerColumnGroup = (
  <ColumnGroup>
    <Row>
      <Column
        headerClassName="bg-primary text-white"
        selectionMode="multiple"
      />
      <Column
        headerClassName="bg-primary text-white"
        header="Código"
        align="center"
      />
      <Column
        headerClassName="bg-primary text-white"
        header="Estado"
        align="center"
        filterHeaderClassName="bg-red-400"
        filterField="status"
        pt={{
          filterMenuButton: ({ context }: { context: any }) => {
            return {
              className: cn(
                "text-white hover:bg-tertiary bg-primary focus:bg-tertiary",
                {
                  "bg-tertiary text-white": context.active,
                }
              ),
            };
          },
        }}
        showFilterMatchModes={false}
        showFilterOperator={false}
        showAddButton={false}
        filter
        filterElement={(options) => <FilterByStatus options={options} />}
        filterApply={(options) => <FilterApplyButton {...options} />}
        filterClear={(options) => <FilterClearButton {...options} />}
      />
      <Column
        showFilterMatchModes={false}
        showFilterOperator={false}
        showAddButton={false}
        showApplyButton={false}
        filterField="createdAt"
        dataType="date"
        filterMatchMode="gte"
        filterType="dateIs"
        pt={{
          filterMenuButton: ({ context }: { context: any }) => {
            return {
              className: cn(
                "text-white hover:bg-tertiary bg-primary focus:bg-tertiary",
                {
                  "bg-tertiary text-white": context.active,
                }
              ),
            };
          },
        }}
        filter
        filterClear={(options) => <FilterClearButton {...options} />}
        filterElement={(options) => (
          <FilterByDate options={options} placeholder="Selecciona una fecha" />
        )}
        headerClassName="bg-primary text-white min-w-32"
        header="Fecha de creación"
        align="center"
      />
      <Column
        showFilterMatchModes={false}
        showFilterOperator={false}
        showAddButton={false}
        filterField="updatedAt"
        pt={{
          filterMenuButton: ({ context }: { context: any }) => {
            return {
              className: cn(
                "text-white hover:bg-tertiary bg-primary focus:bg-tertiary",
                {
                  "bg-tertiary text-white": context.active,
                }
              ),
            };
          },
        }}
        filterApply={(options) => <FilterApplyButton {...options} />}
        filterClear={(options) => <FilterClearButton {...options} />}
        filter
        filterElement={(options) => (
          <FilterByDate options={options} placeholder="Selecciona una fecha" />
        )}
        headerClassName="bg-primary text-white min-w-32"
        header="Última actualización"
        align="center"
      />

      <Column
        header={
          <div className="text-sm  flex items-center gap-x-2">
            <i className="text-sm pi pi-file" />
            Detalles de cotización
          </div>
        }
        align="center"
        colSpan={10}
      />
    </Row>
    <Row>
      <Column colSpan={5} />

      <Column header="Código" />
      <Column header="Nombre" />
      <Column header="Cliente" headerClassName="min-w-48" />
      <Column header="Fecha de inicio" />
      <Column header="Fecha de fin" />
      <Column header="Precio" />
      <Column header="Representante" />
    </Row>
  </ColumnGroup>
);
