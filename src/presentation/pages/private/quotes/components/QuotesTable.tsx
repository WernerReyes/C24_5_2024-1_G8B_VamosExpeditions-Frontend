import { constantStorage } from "@/core/constants";
import {
  reservationStatusRender,
  type VersionQuotationEntity,
} from "@/domain/entities";
import {
  useDuplicateMultipleVersionQuotationsMutation,
  useGetAllOfficialVersionQuotationsQuery,
} from "@/infraestructure/store/services";
import {
  Badge,
  Button,
  Column,
  DataTable,
  type DataTableSelectionMultipleChangeEvent,
  DefaultFallBackComponent,
  ErrorBoundary,
  Skeleton,
  Tag,
  Row,
  ColumnGroup,
  Toolbar,
  type DataTableExpandedRows,
  type DataTableValueArray,
} from "@/presentation/components";
import { usePaginator } from "@/presentation/hooks";
import { useEffect, useState } from "react";
import { QuotesTableFilters } from "../types";
import { getTransformedFilters } from "../utils";
import { TrashQuotesDialog } from "./TrashQuotesDialog";
import { DataTableQuotation } from "./DataTableQuotation/DataTableQuotation";
import { UnofficialDataTable } from "./UnofficialDataTable";
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import { onSetNumberOfVersions } from "@/infraestructure/store";
import { FieldNotAssigned } from "../../components";

const { QUOTATION_PAGINATION } = constantStorage;

const ROW_PER_PAGE: [number, number, number] = [10, 20, 30];

export const QuotesTable = () => {
  const dispatch = useDispatch();

  const { trashVersions } = useSelector(
    (state: AppState) => state.versionQuotation
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
    {
      name,
      clientsIds,
      startDate,
      endDate,
      representativesIds,
      status,
      createdAt,
      updatedAt,
    },
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
      startDate: startDate && new Date(startDate),
      endDate: endDate && new Date(endDate),
      representativesIds,
      status,
      createdAt: createdAt && new Date(createdAt),
      updatedAt: updatedAt && new Date(updatedAt),
      select: {
        version_number: true,
        quotation_id: true,
        name: true,
        trip_details: {
          client: {
            id: true,
            country: true,
            email: true,
            phone: true,
            fullName: true,
          },
          number_of_people: true,
          start_date: true,
          end_date: true,
        },
        user: {
          id_user: true,
          fullname: true,
        },
        completion_percentage: true,
        status: true,
        official: true,
        final_price: true,
        quotation: {
          reservation: {
            id: true,
            status: true,
            is_deleted: true,
          },
          version_quotation: [
            {
              official: true,
              is_deleted: true,
            },
          ],
        },
        created_at: true,
        updated_at: true,
      },
    },
    {
      skip: !currentPage,
    }
  );

  const [duplicateMultipleVersionQuotations, { isLoading: isDuplicating }] =
    useDuplicateMultipleVersionQuotationsMutation();

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

  const [visibleTrashQuotes, setVisibleTrashQuotes] = useState<boolean>(false);

  const handleDuplicateMultiple = async () => {
    if (!selectedQuotes.length) return;
    await duplicateMultipleVersionQuotations({
      ids: selectedQuotes.map((q) => q.id),
    }).unwrap();

    setRecentDuplicatedQuotes([...selectedQuotes]);
    setSelectedQuotes([]);
  };

  useEffect(() => {
    if (!filters) return;
    setFilters(getTransformedFilters(filters));
  }, [filters]);

  useEffect(() => {
    if (!officialCurrentData?.data) return;

    dispatch(
      onSetNumberOfVersions(
        officialCurrentData.data.content.reduce((acc, curr) => {
          if (!curr.hasVersions) return acc;
          const quotationId = curr.id.quotationId;
          acc[quotationId] = trashVersions?.[quotationId] ?? 1;
          return acc;
        }, {} as Record<number, number>)
      )
    );
  }, [officialCurrentData]);

  const header = (
    <div className="flex sm:justify-between gap-y-3 flex-wrap justify-center items-center">
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

      <Button
        icon="pi pi-trash"
        label="Papelera"
        outlined
        size="small"
        onClick={() => setVisibleTrashQuotes(true)}
        disabled={isFetchingOfficial}
      />
    </div>
  );

  return (
    <>
      <TrashQuotesDialog
        visible={visibleTrashQuotes}
        onHide={() => setVisibleTrashQuotes(false)}
      />
      <Toolbar
        className="mt-10 mb-4"
        start={
          <Button
            icon="pi pi-clone"
            label="Duplicar"
            onClick={handleDuplicateMultiple}
            loading={isDuplicating}
            severity="secondary"
            disabled={!selectedQuotes.length || isDuplicating}
          />
        }
      />
      <ErrorBoundary
        isLoader={isLoadingOfficial}
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
            filters={filters}
            value={[]}
            header={header}
            extraColumns={[
              {
                expander: (data: VersionQuotationEntity) => {
                  return data.hasVersions;
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
              expander: (data: VersionQuotationEntity) => {
                const quotationId = data.id.quotationId;
                const existTrash = trashVersions?.[quotationId] ?? null;

                if (existTrash !== null) return existTrash > 0;

                return data.hasVersions;
              },

              position: "start",
            },
            {
              header: "Reserva relacionada",
              headerClassName: "min-w-40",
              body: (data: VersionQuotationEntity) => {
                if (!data?.reservation?.id) {
                  return <FieldNotAssigned message="No asignada" />;
                }

                const { icon, label, severity } =
                  reservationStatusRender[data.reservation?.status];

                return (
                  <div className="flex items-center gap-2">
                    <span>#{data.reservation?.id}</span>
                    {data.reservation?.isDeleted ? (
                      <Tag
                        icon="pi pi-trash"
                        value="En papelera"
                        severity="danger"
                      />
                    ) : (
                      <Tag icon={icon} severity={severity} value={label} />
                    )}
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
          dataKey={(data: VersionQuotationEntity) =>
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
