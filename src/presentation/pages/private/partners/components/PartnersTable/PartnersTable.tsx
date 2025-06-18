import { useEffect, useRef, useState } from "react";
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
import { useGetPartnersAllQuery } from "@/infraestructure/store/services";

import { FilterApplyButton, FilterClearButton } from "../../../filters";
import { constantStorage } from "@/core/constants";
//import { PartnerEntity } from "@/domain/entities";
import { dateFnsAdapter } from "@/core/adapters";
import { getPartnerTransformedFilters } from "../../utils/filters";
import { TableActions } from "../TableActions";
import { PartnerEntity } from "@/domain/entities";
import { TrashPartnerDialog } from "../TrasPartnerDialog";
import { PartnerTableFilters_v2 } from "../../types";

const { PARTNERS_PAGINATION } = constantStorage;
const ROW_PER_PAGE: [number, number, number] = [10, 20, 30];

export const PartnerTable = () => {
  const {
    limit,
    handlePageChange,
    currentPage,
    first,
    filters,
    handleSaveState,
  } = usePaginator(ROW_PER_PAGE[0], PARTNERS_PAGINATION);

  const [filterFields, setFilters] = useState<PartnerTableFilters_v2>({
    name: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });

  const {
    currentData: partnersData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPartnersAllQuery({
    page: currentPage,
    limit,
    ...filterFields,
    select: {
      id: true,
      name: true,
      created_at: true,
      updated_at: true,
    },
  });

  const partners = partnersData?.data;
  const dt = useRef<DataTableRef>(null);

  const [openTrashDialog, setOpenTrashDialog] = useState(false);
  useEffect(() => {
    if (!filters) return;
    setFilters(getPartnerTransformedFilters(filters));
  }, [filters]);

  useEffect(() => {
    if (!isError) return;
    const tdEmpty = document.querySelector(
      "#fallback-partners .p-datatable-emptymessage td"
    );
    if (tdEmpty) tdEmpty.setAttribute("colspan", "5");
  }, [isError]);

  const header = (
    <div className="flex sm:justify-between gap-y-3 flex-wrap justify-center items-center">
      <div className="flex flex-wrap gap-2 p-2 items-center">
        <h4 className="m-0 text-sm md:text-lg">Partners</h4>
        <Badge
          value={
            (partners?.total ?? 0) > 0
              ? `Total: ${partners?.total ?? 0}`
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
      <TrashPartnerDialog
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
          value={Array.from({ length: partners?.content.length || 10 })}
          lazy
          size="small"
          emptyMessage="Cargando..."
          pt={{ header: { className: "!bg-secondary" } }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Column
              key={i}
              field={`loading-${i}`}
              header="Cargando..."
              body={() => <Skeleton shape="rectangle" height="1.5rem" />}
            />
          ))}
        </DataTable>
      }
      isLoader={isLoading}
      fallBackComponent={
        <DataTable
          id="fallback-partners"
          header={header}
          value={[]}
          pt={{ header: { className: "bg-secondary" } }}
          headerColumnGroup={headerColumnGroup}
          className="w-full md:text-sm"
          emptyMessage={
            <DefaultFallBackComponent
              isLoading={isLoading}
              message="Ha ocurrido un error al cargar los partners"
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
        value={partners?.content ?? []}
        stateStorage="custom"
        stateKey={PARTNERS_PAGINATION}
        customSaveState={(state: any) => {
          handleSaveState({
            first,
            rows: limit,
            filters: state.filters,
          });
        }}
        pt={{ header: { className: "bg-secondary" } }}
        paginator
        rows={limit}
        rowsPerPageOptions={ROW_PER_PAGE}
        className="w-full md:text-sm"
        emptyMessage="No hay partners"
        dataKey="id"
        ref={dt}
        lazy
        showGridlines
        rowHover
        onPage={handlePageChange}
        onFilter={handlePageChange}
        filters={filters}
        first={first}
        totalRecords={partners?.total ?? 0}
        header={header}
      >
        <Column field="id" header="ID" alignHeader="center" align="center" />
        <Column
          field="name"
          header="Nombre"
          headerClassName="min-w-32"
          align="center"
          filter
          filterField="name"
          filterPlaceholder="Buscar nombre"
          showFilterMatchModes={false}
          showFilterOperator={false}
          showAddButton={false}
          filterMenuClassName="text-sm"
          filterApply={(options) => <FilterApplyButton {...options} />}
          filterClear={(options) => <FilterClearButton {...options} />}
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
          /*  showFilterMatchModes={false}
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
          body={(partner: PartnerEntity) => {
            return <TableActions rowData={partner} />;
          }}
        />
      </DataTable>
    </ErrorBoundary>
  );
};

const headerColumnGroup = (
  <ColumnGroup>
    <Row>
      <Column header="ID" field="id" alignHeader="center" align="center" />
      <Column
        header="Nombre"
        field="name"
        alignHeader="center"
        align="center"
      />
      <Column
        header="Fecha de Creación"
        field="createdAt"
        alignHeader="center"
        align="center"
      />
      <Column
        header="Última Actualización"
        field="updatedAt"
        alignHeader="center"
        align="center"
      />
      <Column header="Acciones" alignHeader="center" align="center" />
    </Row>
  </ColumnGroup>
);
