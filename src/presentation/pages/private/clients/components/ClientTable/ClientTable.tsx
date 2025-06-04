/* import type { AppState } from "@/app/store"; */
import { /*  dateFnsAdapter, */ phoneNumberAdapter } from "@/core/adapters";
import { constantStorage } from "@/core/constants";
import { ClientEntity } from "@/domain/entities";
import { useGetAllClientsPageQuery } from "@/infraestructure/store/services";
import {
  Badge,
  Button,
  Column,
  ColumnGroup,
  DataTable,
  DataTableRef,
  DefaultFallBackComponent,
  ErrorBoundary,
  Row,
  Skeleton,
} from "@/presentation/components";
import { usePaginator } from "@/presentation/hooks";
import { useEffect, useRef, useState } from "react";
import { FieldNotAssigned } from "../../../components";
import {
  FilterApplyButton,
  /*   FilterByDate, */
  FilterClearButton,
} from "../../../filters";
import { getClientTransformedFilters } from "../../utils/filters";
import { ClientTableFilters } from "../../types";
import { TableActions } from "../TableActions";
import { TrashClientDialog } from "../TrasClientDialog";

const { CLIENTS_PAGINATION } = constantStorage;
const ROW_PER_PAGE: [number, number, number] = [10, 20, 30];

export const ClientTable = () => {
  const {
    limit,
    handlePageChange,
    currentPage,
    first,
    filters,
    handleSaveState,
  } = usePaginator(ROW_PER_PAGE[0], CLIENTS_PAGINATION);
const [openTrashDialog, setOpenTrashDialog] = useState(false);

  const [filterFields, setFilters] = useState<ClientTableFilters>({
    fullName: undefined,
    email: undefined,
    phone: undefined,
    subregion: undefined,
    country: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });

  const {
    currentData: clientsData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllClientsPageQuery({
    page: currentPage,
    limit,
    ...filterFields,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      subregion: true,
      country: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const clients = clientsData?.data;
  const dt = useRef<DataTableRef>(null);

  useEffect(() => {
    if (!filters) return;
    setFilters(getClientTransformedFilters(filters));
  }, [filters]);

  useEffect(() => {
    if (!isError) return;
    const tdEmpty = document.querySelector(
      "#fallback-clients .p-datatable-emptymessage td"
    );
    if (tdEmpty) tdEmpty.setAttribute("colspan", "10");
  }, [isError]);

  const header = (
    <div className="flex sm:justify-between gap-y-3 flex-wrap justify-center items-center">
      <div className="flex flex-wrap gap-2 p-2 items-center">
        <h4 className="m-0 text-sm md:text-lg">Clientes</h4>
        <Badge
          value={
            (clients?.total ?? 0) > 0
              ? `Total: ${clients?.total ?? 0}`
              : "Total: 0"
          }
        />
      </div>

      <Button
        onClick={() => {
          setOpenTrashDialog(true);
        }}
        icon="pi pi-trash"
        label="Papelera"
        outlined
        size="small"
      />

      <TrashClientDialog
        visible={openTrashDialog}
        onHide={() => setOpenTrashDialog(false)}

      />
    </div>
  );

  return (
    <ErrorBoundary
      loadingComponent={
        <DataTable
          header={header}
          className="w-full md:text-sm"
          showGridlines
          headerColumnGroup={headerColumnGroup}
          value={Array.from({ length: clients?.content.length || 10 })}
          lazy
          size="small"
          emptyMessage="Cargando..."
          pt={{
            header: {
              className: "!bg-secondary",
            },
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Column
              key={i}
              field={`loading-${i}`}
              header="Cargando..."
              body={() => <Skeleton shape="rectangle" height="1.5rem" />}
            />
          ))}
        </DataTable>
      }
      isLoader={isLoading || isFetching}
      fallBackComponent={
        <DataTable
          id="fallback-clients"
          header={header}
          value={[]}
          pt={{
            header: {
              className: "bg-secondary",
            },
          }}
          headerColumnGroup={headerColumnGroup}
          className="w-full md:text-sm"
          emptyMessage={
            <DefaultFallBackComponent
              isLoading={isLoading}
              message="Ha ocurrido un error al cargar los clientes"
              isFetching={isFetching}
              refetch={refetch}
            />
          }
          dataKey="id"
          lazy
        />
      }
      error={isError}
    >
      <DataTable
        value={clients?.content ?? []}
        stateStorage="custom"
        stateKey={CLIENTS_PAGINATION}
        customSaveState={(state: any) => {
          handleSaveState({
            first,
            rows: limit,
            filters: state.filters,
          });
        }}
        pt={{
          header: {
            className: "bg-secondary",
          },
        }}
        paginator
        rows={limit}
        rowsPerPageOptions={ROW_PER_PAGE}
        className="w-full md:text-sm"
        emptyMessage="No hay clientes"
        dataKey="id"
        ref={dt}
        lazy
        showGridlines
        rowHover
        onPage={handlePageChange}
        onFilter={handlePageChange}
        filters={filters}
        first={first}
        totalRecords={clients?.total ?? 0}
        header={header}
      >
        <Column
          field="id"
          header="Código"
          headerClassName="min-w-16"
          alignHeader="center"
          align="center"
        />
        <Column
          headerClassName="min-w-24"
          field="fullName"
          header="Nombre"
          align={"center"}
          filter
          filterField="fullName"
          filterPlaceholder="Buscar Nombre"
          showFilterMatchModes={false}
          showFilterOperator={false}
          showAddButton={false}
          filterMenuClassName="text-sm"
          filterApply={(options) => <FilterApplyButton {...options} />}
          filterClear={(options) => <FilterClearButton {...options} />}
        />
        <Column
          field="email"
          headerClassName="min-w-32"
          header="Correo Electrónico"
          align={"center"}
          filter
          filterField="email"
          showFilterMatchModes={false}
          showFilterOperator={false}
          showAddButton={false}
          filterMenuClassName="text-sm"
          filterApply={(options) => <FilterApplyButton {...options} />}
          filterClear={(options) => <FilterClearButton {...options} />}
          filterPlaceholder="Buscar Email"
        />
        <Column
          field="phone"
          header="Teléfono"
          alignHeader="center"
          align="center"
          headerClassName="min-w-32"
          body={(rowData: ClientEntity) =>
            rowData.phone ? (
              phoneNumberAdapter.format(rowData.phone)
            ) : (
              <FieldNotAssigned message="No asignado" />
            )
          }
        />
        <Column
          field="subregion"
          header="Subregión"
          alignHeader="center"
          align="center"
          headerClassName="min-w-32"
        />
        <Column
          field="country"
          header="País"
          alignHeader="center"
          align="center"
          headerClassName="min-w-32"
          body={(rowData: ClientEntity) =>
            rowData.country?.name ?? <FieldNotAssigned message="No asignado" />
          }
        />
        <Column
          header="Acciones"
          align="center"
          body={(client: ClientEntity) => {
            return <TableActions rowData={client} />;
          }}
        />
      </DataTable>
    </ErrorBoundary>
  );
};

const headerColumnGroup = (
  <ColumnGroup>
    <Row>
      <Column header="Código" field="id" alignHeader="center" align="center" />
      <Column
        header="Nombre"
        field="fullName"
        alignHeader="center"
        align="center"
      />
      <Column
        header="Correo"
        field="email"
        alignHeader="center"
        align="center"
      />
      <Column
        header="Teléfono"
        field="phone"
        alignHeader="center"
        align="center"
      />
      <Column
        header="Subregión"
        field="subregion"
        alignHeader="center"
        align="center"
      />
      <Column
        header="País"
        field="country"
        alignHeader="center"
        align="center"
      />
      <Column
        header="Fecha de creación"
        field="createdAt"
        alignHeader="center"
        align="center"
      />
      <Column
        header="Última actualización"
        field="updatedAt"
        alignHeader="center"
        align="center"
      />
    </Row>
  </ColumnGroup>
);
