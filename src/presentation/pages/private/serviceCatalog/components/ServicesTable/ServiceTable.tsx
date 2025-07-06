/* import type { AppState } from "@/app/store";
import { useSelector } from "react-redux"; */
import { useEffect, useRef, useState } from "react";
import { usePaginator } from "@/presentation/hooks";
import { useGetServicesQuery } from "@/infraestructure/store/services";
import type { ServiceEntity } from "@/domain/entities";

import {
  Badge,
  /*   Button, */
  Column,
  ColumnGroup,
  DataTable,
  DataTableRef,
  ErrorBoundary,
  Row,
  Skeleton,
  DefaultFallBackComponent,
} from "@/presentation/components";

import { dateFnsAdapter } from "@/core/adapters";
import { constantStorage } from "@/core/constants";
import { FieldNotAssigned } from "../../../components";
/* import {
  FilterApplyButton,
  FilterByDate,
  FilterClearButton,
} from "../../../filters"; */
import { TableActions } from "../TableActions";
import { getServiceTransformedFilters } from "../../utils/filters";
import { ServiceTableFilters } from "../../types/serviceTableFilters";
import { FilterApplyButton, FilterClearButton } from "../../../filters";

const { SERVICES_PAGINATION } = constantStorage;
const ROW_PER_PAGE: [number, number, number] = [10, 20, 30];

export const ServiceTable = () => {
  const {
    limit,
    handlePageChange,
    currentPage,
    first,
    filters,
    handleSaveState,
  } = usePaginator(ROW_PER_PAGE[0], SERVICES_PAGINATION);

  const [selectedFilters, setSelectedFilters] = useState<ServiceTableFilters>({
    description: undefined,
    price_usd: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });

  const {
    currentData: servicesData,
    isLoading: isLoadingServices,
    isFetching: isFetchingServices,
    isError: isErrorServices,
    refetch: refetchServices,
  } = useGetServicesQuery({
    page: currentPage,
    limit,
    ...selectedFilters,
    select: {
      id: true,
      service_type_id: true,
      description: true,
      duration: true,
      passengers_min: true,
      passengers_max: true,
      price_usd: true,
      tax_igv_usd: true,
      rate_usd: true,
      price_pen: true,
      tax_igv_pen: true,
      rate_pen: true,
      distrit_id: true,
      created_at: true,
      updated_at: true,
      service_type: {
        id: true,
        name: true,
      },
      distrit: {
        id_distrit: true,
        name: true,
      },
    },
  });
  /* console.log("servicesData", servicesData); */
  const services = servicesData?.data;
  const dt = useRef<DataTableRef>(null);

  /*   useEffect(() => {
    if (!filters) return;
    setSelectedFilters(filters as any);
  }, [filters]); */
  useEffect(() => {
    if (!filters) return;
    setSelectedFilters(getServiceTransformedFilters(filters));
  }, [filters]);

  useEffect(() => {
    if (!isErrorServices) return;
    const tdEmpty = document.querySelector(
      "#fallback-services .p-datatable-emptymessage td"
    );
    if (tdEmpty) tdEmpty.setAttribute("colspan", "12");
  }, [isErrorServices]);

  const header = (
    <div className="flex sm:justify-between gap-y-3 flex-wrap justify-center items-center">
      <div className="flex flex-wrap gap-2 p-2 items-center">
        <h4 className="m-0 text-sm md:text-lg">Servicios</h4>
        <Badge
          value={
            (services?.total ?? 0) > 0
              ? `Total: ${services?.total ?? 0}`
              : "Total: 0"
          }
        />
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      loadingComponent={
        <DataTable
          pt={{
            header: {
              className: "!bg-secondary",
            },
          }}
          header={header}
          className="w-full md:text-sm"
          showGridlines
          headerColumnGroup={headerColumnGroup}
          value={Array.from({ length: services?.content.length || 10 })}
          lazy
          size="small"
          emptyMessage={"No hay servicios"}
        >
          {Array.from({ length: 11 }).map((_, i) => (
            <Column
              key={i}
              field={`loading-${i}`}
              header="Cargando..."
              body={() => <Skeleton shape="rectangle" height="1.5rem" />}
            />
          ))}
        </DataTable>
      }
      isLoader={isLoadingServices || isFetchingServices}
      fallBackComponent={
        <DataTable
          value={[]}
          pt={{
            header: { className: "bg-secondary" },
          }}
          id="fallback-services"
          header={header}
          headerColumnGroup={headerColumnGroup}
          emptyMessage={
            <DefaultFallBackComponent
              isLoading={isLoadingServices}
              message="Ha ocurrido un error al cargar los servicios"
              isFetching={isFetchingServices}
              refetch={refetchServices}
            />
          }
          className="w-full md:text-sm"
          dataKey="id"
          lazy
        />
      }
      error={isErrorServices}
    >
      <DataTable
        value={services?.content ?? []}
        stateStorage="custom"
        stateKey={SERVICES_PAGINATION}
        customSaveState={(state: any) => {
          handleSaveState({
            first,
            rows: limit,
            filters: state.filters,
          });
        }}
        paginator
        rows={limit}
        rowsPerPageOptions={ROW_PER_PAGE}
        className="w-full md:text-sm"
        emptyMessage="No hay servicios"
        dataKey="id"
        ref={dt}
        lazy
        showGridlines
        rowHover
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} servicios"
        pt={{
          header: { className: "bg-secondary" },
        }}
        onPage={handlePageChange}
        onFilter={handlePageChange}
        filters={filters}
        first={first}
        totalRecords={services?.total ?? 0}
        header={header}
      >
        <Column
          field="id"
          headerClassName="min-w-16"
          header="Código"
          align="center"
        />
        <Column
          field="description"
          filter
          headerClassName="min-w-32"
          header="Descripción"
          body={(rowData: ServiceEntity) => (
            <div className="text-sm text-gray-800 font-bold   ">
              {rowData.description || (
                <FieldNotAssigned message="No asignado" />
              )}
            </div>
          )}
          
          filterField="description"
          align="center"
          filterPlaceholder="Buscar nombre"
          showFilterMatchModes={false}
          showFilterOperator={false}
          showAddButton={false}
          filterMenuClassName="text-sm"
          filterApply={(options) => <FilterApplyButton {...options} />}
          filterClear={(options) => <FilterClearButton {...options} />}
        />
        {/* <Column
          field="priceUsd"
          headerClassName="min-w-32"
          header="Precio USD"
          align="center"
        /> */}
        <Column
          field="duration"
          headerClassName="min-w-24"
          header="Duración"
          align="center"
        />
        <Column
          field="passengersMin"
          headerClassName="min-w-24"
          header="Pasajeros Mínimos"
          align="center"
          body={(rowData: ServiceEntity) =>
            rowData.passengersMin !== undefined ? (
              rowData.passengersMin
            ) : (
              <FieldNotAssigned message="No asignado" />
            )
          }
        />
        <Column
          field="passengersMax"
          headerClassName="min-w-24"
          header="Pasajeros Máximos"
          align="center"
          body={(rowData: ServiceEntity) =>
            rowData.passengersMax !== undefined ? (
              rowData.passengersMax
            ) : (
              <FieldNotAssigned message="No asignado" />
            )
          }
        />
        <Column
          field="taxIgvUsd"
          headerClassName="min-w-24"
          header="IGV USD"
          align="center"
          body={(rowData: ServiceEntity) =>
            rowData.taxIgvUsd !== undefined ? (
              rowData.taxIgvUsd
            ) : (
              <FieldNotAssigned message="No asignado" />
            )
          }
        />
        <Column
          field="rateUsd"
          headerClassName="min-w-24"
          header="Tarifa USD"
          align="center"
          body={(rowData: ServiceEntity) =>
            rowData.rateUsd !== undefined ? (
              rowData.rateUsd
            ) : (
              <FieldNotAssigned message="No asignado" />
            )
          }
        />
        <Column
          field="pricePen"
          headerClassName="min-w-24"
          header="Precio PEN"
          align="center"
          body={(rowData: ServiceEntity) =>
            rowData.pricePen !== undefined ? (
              rowData.pricePen
            ) : (
              <FieldNotAssigned message="No asignado" />
            )
          }
        />
        <Column
          field="taxIgvPen"
          headerClassName="min-w-24"
          header="IGV PEN"
          align="center"
          body={(rowData: ServiceEntity) =>
            rowData.taxIgvPen !== undefined ? (
              rowData.taxIgvPen
            ) : (
              <FieldNotAssigned message="No asignado" />
            )
          }
        />
        <Column
          field="ratePen"
          headerClassName="min-w-24"
          header="Tarifa PEN"
          align="center"
          body={(rowData: ServiceEntity) =>
            rowData.ratePen !== undefined ? (
              rowData.ratePen
            ) : (
              <FieldNotAssigned message="No asignado" />
            )
          }
        />
        <Column
          header="Distrito"
          headerClassName="min-w-32"
          align="center"
          body={(rowData: ServiceEntity) =>
            rowData.district?.name ? (
              rowData.district.name
            ) : (
              <FieldNotAssigned message="No asignado" />
            )
          }
        />
        <Column
          header="Tipo de Servicio"
          headerClassName="min-w-32"
          align="center"
          body={(rowData: ServiceEntity) =>
            rowData.serviceType?.name ? (
              rowData.serviceType.name
            ) : (
              <FieldNotAssigned message="No asignado" />
            )
          }
        />

        <Column
          header="Fecha de Creación"
          headerClassName="min-w-24"
          align={"center"}
          body={(rowData) => dateFnsAdapter.format(rowData.createdAt)}
          /* showFilterMatchModes={false}
          showFilterOperator={false}
          showAddButton={false}
          showApplyButton={false}
          filterField="createdAt"
          dataType="date"
          filterMatchMode="gte"
          filter
          filterClear={(options) => <FilterClearButton {...options} />}
          filterElement={(options) => (
            <FilterByDate
              options={options}
              placeholder="Selecciona una fecha"
            />
          )} */
        />
        <Column
          header="Última Actualización"
          headerClassName="min-w-24"
          align={"center"}
          body={(rowData) => dateFnsAdapter.format(rowData.updatedAt)}
          /* showFilterMatchModes={false}
          showFilterOperator={false}
          showAddButton={false}
          showApplyButton={false}
          filterField="updatedAt"
          dataType="date"
          filterMatchMode="gte"
          filter
          filterClear={(options) => <FilterClearButton {...options} />}
          filterElement={(options) => (
            <FilterByDate
              options={options}
              placeholder="Selecciona una fecha"
            />
          )} */
        />
        <Column
          header="Acciones"
          align="center"
          body={(service: ServiceEntity) => {
            return <TableActions rowData={service} />;
          }}
        />
      </DataTable>
    </ErrorBoundary>
  );
};

const headerColumnGroup = (
  <ColumnGroup>
    <Row className="w-full">
      <Column
        header="Código"
        field="id"
        headerClassName="min-w-16"
        align="center"
      />
      <Column
        header="Descripción"
        field="description"
        headerClassName="min-w-24"
        align="center"
      />
      <Column
        header="Precio USD"
        field="price_usd"
        headerClassName="min-w-32"
        align="center"
      />
      <Column
        header="Duración"
        field="duration"
        headerClassName="min-w-24"
        align="center"
      />
      <Column
        header="Fecha de Creación"
        headerClassName="min-w-24"
        align="center"
      />
      <Column
        header="Pasajeros Mínimos"
        headerClassName="min-w-24"
        align="center"
      />
      <Column
        header="Pasajeros Máximos"
        headerClassName="min-w-24"
        align="center"
      />
      <Column header="IGV USD" headerClassName="min-w-24" align="center" />
      <Column header="Tarifa USD" headerClassName="min-w-24" align="center" />

      <Column header="Precio PEN" headerClassName="min-w-24" align="center" />
      <Column
        header="Última Actualización"
        headerClassName="min-w-24"
        align="center"
      />
    </Row>
  </ColumnGroup>
);
