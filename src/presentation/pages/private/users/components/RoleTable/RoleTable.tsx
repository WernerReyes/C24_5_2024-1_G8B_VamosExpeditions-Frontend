import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Column,
  ColumnGroup,
  DataTable,
  type DataTableRef,
  DefaultFallBackComponent,
  ErrorBoundary,
  Row,
  Skeleton,
  Tag,
} from "@/presentation/components";
import { dateFnsAdapter } from "@/core/adapters";
import { useGetRolesQuery } from "@/infraestructure/store/services";
import { usePaginator } from "@/presentation/hooks";
import { RoleEntity, roleRender } from "@/domain/entities";
import type { RoleTableFilters } from "../../types";
import { getRoleTransformedFilters } from "../../utils/filters";

const ROW_PER_PAGE: [number, number, number] = [10, 20, 30];

export const RoleTable = () => {
  const [{ createdAt, updatedAt }, setFilters] =
    useState<RoleTableFilters>({
      name: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    });
  const {
    currentPage,
    filters,
    first,
    handlePageChange,
    limit,
    // handleSaveState,
  } = usePaginator(ROW_PER_PAGE[0]);
  const { currentData, isLoading, isFetching, refetch, isError } =
    useGetRolesQuery({
      page: currentPage,
      limit,
      createdAt,
      updatedAt,
      select: {
        id_role: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
    });

  const roles = currentData?.data;

  const dt = useRef<DataTableRef>(null);

  useEffect(() => {
    if (!filters) return;
    setFilters(getRoleTransformedFilters(filters));
  }, [filters]);

  useEffect(() => {
    if (!isError) return;
    const tdEmpty = document.querySelector(
      "#fallback-roles .p-datatable-emptymessage td"
    );

    if (tdEmpty) tdEmpty.setAttribute("colspan", "5");
  }, [isError]);

  const header = (
    <div className="flex sm:justify-between gap-y-3 flex-wrap justify-center items-center">
      <div className="flex flex-wrap gap-2 p-2 items-center">
        <h4 className="m-0 text-sm md:text-lg">Roles</h4>
        <Badge
          value={
            (roles?.total ?? 0) > 0 ? `Total: ${roles?.total ?? 0}` : "Total: 0"
          }
        />
      </div>

      <Button icon="pi pi-trash" disabled label="Papelera" outlined size="small" />
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
          value={Array.from({
            length: roles?.content.length || 10,
          })}
          lazy
          size="small"
          emptyMessage={"No hay cotizaciones"}
        >
          {Array.from({ length: 4 }).map((_, i) => (
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
          value={[]}
          pt={{
            header: { className: "bg-secondary" },
          }}
          id="fallback-roles"
          header={header}
          headerColumnGroup={headerColumnGroup}
          emptyMessage={
            <DefaultFallBackComponent
              isLoading={isLoading}
              message="Ha ocurrido un error al cargar los roles"
              isFetching={isFetching}
              refetch={refetch}
            />
          }
          className="w-full md:text-sm"
          dataKey="id"
          lazy
        />
      }
      error={isError}
    >
      <DataTable
        value={roles?.content ?? []}
        // stateStorage="custom"
        // stateKey={USERS_PAGINATION}
        // customSaveState={(state: any) => {
        //   handleSaveState({
        //     first,
        //     rows: limit,
        //     filters: state.filters,
        //   });
        // }}
        paginator
        rows={limit}
        rowsPerPageOptions={ROW_PER_PAGE}
        className="w-full md:text-sm"
        emptyMessage="No hay usuarios"
        dataKey="id"
        ref={dt}
        lazy
        showGridlines
        rowHover
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} cotizaciones"
        pt={{
          header: { className: "bg-secondary" },
        }}
        onPage={handlePageChange}
        onFilter={handlePageChange}
        filters={filters}
        first={first}
        totalRecords={roles?.total ?? 0}
        header={header}
      >
        <Column
          field="id"
          headerClassName="min-w-16"
          header="Código"
          align={"center"}
        />
        <Column
          headerClassName="min-w-24"
          field="name"
          header="Nombre"
          align={"center"}
          body={(rowData: RoleEntity) => {
            const { icon, label, severity } = roleRender[rowData.name];
            return <Tag icon={icon} value={label} severity={severity} />;
          }}
          // filter
          // filterField="name"
          // filterPlaceholder="Buscar Nombre"
          // showFilterMatchModes={false}
          // showFilterOperator={false}
          // showAddButton={false}
          // filterMenuClassName="text-sm"
          // filterApply={(options) => <FilterApplyButton {...options} />}
          // filterClear={(options) => <FilterClearButton {...options} />}
        />

        <Column
          header="Fecha de Creación"
          headerClassName="min-w-24"
          align={"center"}
          body={(rowData) => dateFnsAdapter.format(rowData.createdAt)}
          // showFilterMatchModes={false}
          // showFilterOperator={false}
          // showAddButton={false}
          // showApplyButton={false}
          // filterField="createdAt"
          // dataType="date"
          // filterMatchMode="gte"
          // filter
          // filterClear={(options) => <FilterClearButton {...options} />}
          // filterElement={(options) => (
          //   <FilterByDate
          //     options={options}
          //     placeholder="Selecciona una fecha"
          //   />
          // )}
        />

        <Column
          header="Última Actualización"
          headerClassName="min-w-24"
          align={"center"}
          body={(rowData) => dateFnsAdapter.format(rowData.updatedAt)}
          // showFilterMatchModes={false}
          // showFilterOperator={false}
          // showAddButton={false}
          // showApplyButton={false}
          // filterField="updatedAt"
          // dataType="date"
          // filterMatchMode="gte"
          // filter
          // filterClear={(options) => <FilterClearButton {...options} />}
          // filterElement={(options) => (
          //   <FilterByDate
          //     options={options}
          //     placeholder="Selecciona una fecha"
          //   />
          // )}
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
        align={"center"}
      />
      <Column
        headerClassName="min-w-24"
        header="Nombre"
        field="name"
        // filter
        // filterField="fullname"
        align={"center"}
        // filterPlaceholder="Buscar Nombre"
      />
      <Column
        header="Fecha de Creación"
        align={"center"}
        // filter
        headerClassName="min-w-24"
        // filterPlaceholder="Buscar Fecha de Creación"
      />
      <Column
        header="Última Actualización"
        align={"center"}
        // filter
        headerClassName="min-w-24"
        // filterPlaceholder="Buscar Fecha de Actualización"
      />
    </Row>
  </ColumnGroup>
);
