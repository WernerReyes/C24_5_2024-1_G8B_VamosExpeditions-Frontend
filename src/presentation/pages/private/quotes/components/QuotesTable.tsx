import {
  reservationStatusRender,
  type VersionQuotationEntity,
} from "@/domain/entities";
import {
  QuotationHasUnofficialVersions,
  type QuotationWithVersions,
  useDeleteMultipleVersionQuotationsMutation,
  useDuplicateMultipleVersionQuotationsMutation,
  useGetAllOfficialVersionQuotationsQuery,
} from "@/infraestructure/store/services";
import {
  Badge,
  Button,
  Column,
  DataTable,
  DataTableSelectionMultipleChangeEvent,
  DefaultFallBackComponent,
  ErrorBoundary,
  Skeleton,
  Tag,
  type DataTableExpandedRows,
  type DataTableValueArray,
} from "@/presentation/components";
import { usePaginator } from "@/presentation/hooks";
import { Toolbar } from "primereact/toolbar";
import { useEffect, useState } from "react";
import { DataTableQuotation } from "./DataTableQuotation/DataTableQuotation";
import { getTransformedFilters } from "../utils";
import { QuotesTableFilters } from "../types";
import { UnofficialDataTable } from "./UnofficialDataTable";
import type { AppState } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import { onSetCurrentQuotation } from "@/infraestructure/store";
import { quotationService } from "@/data";
import { constantStorage } from "@/core/constants";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

const { QUOTATION_PAGINATION } = constantStorage;

const ROW_PER_PAGE: [number, number, number] = [10, 20, 30];

export const QuotesTable = () => {
  const dispatch = useDispatch();
  const { currentQuotation } = useSelector(
    (state: AppState) => state.quotation
  );
  const {
    handlePageChange,
    currentPage,
    first,
    limit,
    sortField,
    filters,
    handleSaveState,
  } = usePaginator(ROW_PER_PAGE[0], QUOTATION_PAGINATION);
  const [
    { name, clientsIds, startDate, endDate, representativesIds, status },
    setFilters,
  ] = useState<QuotesTableFilters>({});

  const {
    currentData: officialCurrentData,
    isFetching: isFetchingOfficial,
    isLoading: isLoadingOfficial,
    isError: isErrorOfficial,
    refetch: refetchOfficial,
  } = useGetAllOfficialVersionQuotationsQuery(
    {
      page: currentPage,
      limit,
      name,
      clientsIds,
      startDate,
      endDate,
      representativesIds,
      status,
      official: true,
    },
    {
      skip: !currentPage,
    }
  );

  const [duplicateMultipleVersionQuotations, { isLoading: isDuplicating }] =
    useDuplicateMultipleVersionQuotationsMutation();
  const [deleteMultipleVersionQuotations, { isLoading: isDeleting }] =
    useDeleteMultipleVersionQuotationsMutation();

  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined);
  const [selectedQuotes, setSelectedQuotes] = useState<
    VersionQuotationEntity[]
  >([]);
  const [recentDuplicatedQuotes, setRecentDuplicatedQuotes] = useState<
    VersionQuotationEntity[]
  >([]);
  const [currentRowExpanded, setCurrentRowExpanded] = useState<
    VersionQuotationEntity | undefined
  >();

  const handleDuplicateMultiple = async () => {
    if (!selectedQuotes.length) return;
    await duplicateMultipleVersionQuotations({
      ids: selectedQuotes.map((q) => q.id),
    }).unwrap();

    setRecentDuplicatedQuotes([...selectedQuotes]);
    setSelectedQuotes([]);
  };

  const handleDeleteMultiple = async () => {
    if (!selectedQuotes.length) return;
    const quotesWithReservations = selectedQuotes.filter((q) => !q.reservation);
    if (!quotesWithReservations.length) {
      return;
    }
    await deleteMultipleVersionQuotations({
      ids: quotesWithReservations.map((q) => q.id),
    })
      .unwrap()
      .then(({ data }) => {
        if (!currentQuotation) return;
        const versionId = currentQuotation.currentVersion.id;
        data.versionQuotationsDeleted.forEach((deleted) => {
          if (
            versionId.quotationId === deleted.id.quotationId &&
            versionId.versionNumber === deleted.id.versionNumber
          ) {
            quotationService.deleteCurrentQuotation().then(() => {
              dispatch(onSetCurrentQuotation(null));
            });
          }
        });
      });

    setSelectedQuotes([]);
  };

  useEffect(() => {
    if (!filters) return;
    setFilters(getTransformedFilters(filters));
  }, [filters]);

  const header = (
    <div className="flex flex-wrap gap-2 p-2 items-center">
      <h4 className="m-0 text-sm md:text-lg">Cotizaciones</h4>
      <Badge
        value={
          officialCurrentData?.data.total
            ? `Total: ${officialCurrentData?.data.total}`
            : "Total: 0"
        }
      />
      {recentDuplicatedQuotes.length > 0 && (
        <Badge
          value={`${recentDuplicatedQuotes.length} ${
            recentDuplicatedQuotes.length === 1
              ? "cotización duplicada"
              : "cotizaciones duplicadas"
          }`}
          severity="success"
          className="text-white"
        />
      )}
    </div>
  );

  return (
    <>
      <Toolbar
        className="mt-10 mb-4"
        start={
          <div className="flex gap-2">
            <Button
              icon="pi pi-trash"
              label="Eliminar"
              loading={isDeleting}
              onClick={handleDeleteMultiple}
              disabled={!selectedQuotes.length || isDuplicating || isDeleting}
            />
            <Button
              icon="pi pi-clone"
              label="Duplicar"
              onClick={handleDuplicateMultiple}
              loading={isDuplicating}
              severity="secondary"
              disabled={!selectedQuotes.length || isDuplicating || isDeleting}
            />
          </div>
        }
      />
      <ErrorBoundary
        isLoader={isLoadingOfficial || isFetchingOfficial}
        loadingComponent={
          <DataTable
            pt={{
              header: {
                className: "!bg-secondary",
              },
            }}
            showGridlines
            header={header}
            headerColumnGroup={headerColumnGroup}
            value={Array.from({
              length: officialCurrentData?.data.content.length || limit,
            })}
          >
            {Array.from({ length: 14 }).map((_, i) => (
              <Column
                key={i}
                body={() => <Skeleton shape="rectangle" height="1.5rem" />}
              />
            ))}
          </DataTable>
        }
        fallBackComponent={
          <DataTableQuotation
            value={[]}
            header={header}
            extraColumns={[
              {
                expander: (data: QuotationHasUnofficialVersions) => {
                  return data.hasUnofficialVersions;
                },
                position: "start",
              },
            ]}
            showGridlines
            emptyMessage={
              <div className="p-4">
                <DefaultFallBackComponent
                  refetch={refetchOfficial}
                  isFetching={isFetchingOfficial}
                  isLoading={isLoadingOfficial}
                  message="No se pudieron cargar las cotizaciones"
                />
              </div>
            }
          />
        }
        error={isErrorOfficial}
      >
        <DataTableQuotation
          stateStorage="custom"
          stateKey={QUOTATION_PAGINATION}
          customSaveState={handleSaveState}
          value={officialCurrentData?.data.content || []}
          expandedRows={expandedRows}
          extraColumns={[
            {
              expander: (data: QuotationHasUnofficialVersions) => {
                return data.hasUnofficialVersions;
              },

              position: "start",
            },
            {
              header: "Reserva relacionada",
              body: (data: VersionQuotationEntity) => {
                if (!data?.reservation?.id) {
                  return "Ninguno";
                }

                const { icon, label, severity } =
                  reservationStatusRender[data.reservation?.status];

                return (
                  <div className="flex items-center gap-2">
                    <span>#{data.reservation?.id}</span>
                    <Tag icon={icon} severity={severity} value={label} />
                  </div>
                );
              },
              position: "end",
            },
          ]}
          first={first}
          rows={limit}
          totalRecords={officialCurrentData?.data.total}
          onPage={handlePageChange}
          onFilter={handlePageChange}
          rowsPerPageOptions={ROW_PER_PAGE}
          loading={isLoadingOfficial || isFetchingOfficial}
          lazy
          paginatorClassName="max-sm:text-xs"
          size="small"
          editMode="cell"
          className="text-sm lg:text-[15px] mt-5"
          sortMode="single"
          dataKey={(data: QuotationWithVersions) =>
            `${data.id.quotationId}${data.id.versionNumber}`
          }
          sortField={sortField?.sortField}
          sortOrder={sortField?.sortOrder}
          filters={filters}
          selectionMode={"checkbox"}
          onRowExpand={(e) => {
            const { id } = e.data as VersionQuotationEntity;
            setExpandedRows({
              [`${id.quotationId}${id.versionNumber}`]: true,
            });
            setCurrentRowExpanded(e.data as VersionQuotationEntity);
          }}
          onRowCollapse={() => {
            setExpandedRows({});
          }}
          selection={selectedQuotes}
          onSelectionChange={(
            e: DataTableSelectionMultipleChangeEvent<VersionQuotationEntity[]>
          ) => {
            setSelectedQuotes(e.value);
          }}
          header={header}
          rowClassName={(quotation: VersionQuotationEntity) => {
            return {
              "bg-green-100":
                recentDuplicatedQuotes.length > 0 &&
                recentDuplicatedQuotes.some(
                  (q) =>
                    q.id.quotationId === quotation.id.quotationId &&
                    q.id.versionNumber === quotation.id.versionNumber
                ),
              // "p-disabled": quotation?.reservation
            };
          }}
          rowExpansionTemplate={() => {
            return (
              <UnofficialDataTable
                selectedQuotes={selectedQuotes}
                setSelectedQuotes={setSelectedQuotes}
                recentDuplicatedQuotes={recentDuplicatedQuotes}
                currentRowExpanded={currentRowExpanded}
              />
            );
          }}
          tableStyle={{ minWidth: "60rem" }}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          paginator
          showGridlines
          filterDisplay="menu"
          currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} cotizaciones"
          emptyMessage={"No hay cotizaciones"}
        />
      </ErrorBoundary>
    </>
  );
};

const headerColumnGroup = (
  <ColumnGroup>
    <Row>
      <Column />
      <Column header="Código" headerClassName="min-w-24" />
      <Column header="Nombre" filter headerClassName="min-w-32" />
      <Column header="Cliente" filter headerClassName="min-w-48" />
      <Column header="Pasajeros" headerClassName="min-w-24" />
      <Column header="Fecha de inicio" filter headerClassName="min-w-48" />
      <Column header="Fecha de fin" filter headerClassName="min-w-32" />
      <Column header="Precio" />
      <Column header="Representante" headerClassName="min-w-32" filter />
      <Column header="Avance" />
      <Column header="Precio" />
      <Column header="Status" filter />
      <Column header="Oficial" headerClassName="min-w-24" />
      <Column header="Acciones" />
    </Row>
  </ColumnGroup>
);
