import { VersionQuotationEntity } from "@/domain/entities";
import { onSetNumberOfVersions } from "@/infraestructure/store";
import { useGetAllUnofficialVersionQuotationsQuery } from "@/infraestructure/store/services";
import {
  Column,
  DataTable,
  DefaultFallBackComponent,
  ErrorBoundary,
  Skeleton,
} from "@/presentation/components";
import { usePaginator } from "@/presentation/hooks";
import { ColumnGroup } from "primereact/columngroup";
import { DataTableSelectionMultipleChangeEvent } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import { Row } from "primereact/row";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { QuotesTableFilters } from "../types";
import { getTransformedFilters } from "../utils";
import { DataTableQuotation } from "./DataTableQuotation/DataTableQuotation";

type Props = {
  currentRowExpanded?: VersionQuotationEntity;
  selectedQuotes: VersionQuotationEntity[];
  setSelectedQuotes: (quotes: VersionQuotationEntity[]) => void;
  recentDuplicatedQuotes: VersionQuotationEntity[];
};

export const UnofficialDataTable = ({
  currentRowExpanded,
  selectedQuotes,
  setSelectedQuotes,
  recentDuplicatedQuotes,
}: Props) => {
  const dispatch = useDispatch();
  const { handlePageChange, currentPage, first, limit, filters } =
    usePaginator(5);
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

  const { currentData, isLoading, isFetching, isError, refetch } =
    useGetAllUnofficialVersionQuotationsQuery(
      {
        page: currentPage,
        limit,
        name,
        clientsIds,
        startDate,
        endDate,
        representativesIds,
        status,
        quotationId: currentRowExpanded?.id.quotationId,
        createdAt,
        updatedAt,

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

          created_at: true,
          updated_at: true,
        },
      },
      {
        skip: !currentPage || !currentRowExpanded,
      }
    );

  useEffect(() => {
    if (!filters) return;
    setFilters(getTransformedFilters(filters));
  }, [filters]);

  useEffect(() => {
    if (!currentData?.data) return;

    dispatch(
      onSetNumberOfVersions(
        currentData.data.content.reduce((acc, curr) => {
          acc[curr.id.quotationId] = (acc[curr.id.quotationId] || 0) + 1;
          return acc;
        }, {} as Record<number, number>)
      )
    );
  }, [currentData]);

  return (
    <ErrorBoundary
      loadingComponent={
        <DataTable
          pt={{
            header: {
              className: "!bg-secondary",
            },
          }}
          headerColumnGroup={headerColumnGroup}
          value={Array.from({
            length: currentData?.data.content.length || limit,
          })}
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <Column
              key={i}
              body={() => <Skeleton shape="rectangle" height="2rem" />}
            />
          ))}
        </DataTable>
      }
      isLoader={isLoading || isFetching}
      fallBackComponent={
        <DataTableQuotation
          value={[]}
          showGridlines
          emptyMessage={
            <div className="p-4">
              <DefaultFallBackComponent
                refetch={refetch}
                isFetching={isFetching}
                isLoading={isLoading}
                message="No se pudieron cargar las versiones"
              />
            </div>
          }
        />
      }
      error={isError}
    >
      <DataTableQuotation
        value={currentData?.data?.content || []}
        scrollable
        emptyMessage="No hay versiones disponibles"
        selectionMode={"checkbox"}
        size="small"
        tableStyle={{ minWidth: "50rem" }}
        editMode="cell"
        selection={selectedQuotes}
        first={first}
        rows={limit}
        onFilter={handlePageChange}
        filters={filters}
        loading={isLoading || isFetching}
        onSelectionChange={(
          e: DataTableSelectionMultipleChangeEvent<VersionQuotationEntity[]>
        ) => setSelectedQuotes(e.value)}
        className="text-sm lg:text-[15px] p-5 overflow-x-hidden"
        rowClassName={(quotation: VersionQuotationEntity) => {
          return recentDuplicatedQuotes.length > 0 &&
            recentDuplicatedQuotes.some(
              (q) =>
                q.id.quotationId === quotation.id.quotationId &&
                q.id.versionNumber === quotation.id.versionNumber
            )
            ? "bg-green-100"
            : "";
        }}
        pt={{
          wrapper: {
            className: "invisible-x-scrollbar thin-y-scrollbar",
            footer: {
              className: "bg-white",
            },
          },
        }}
        footer={
          <Paginator
            className="w-full bg-transparent max-sm:text-xs"
            first={first}
            rows={limit}
            totalRecords={currentData?.data.total}
            onPageChange={handlePageChange}
            template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{currentPage} de {totalPages} páginas ({totalRecords} registros)"
          />
        }
      />
    </ErrorBoundary>
  );
};

const headerColumnGroup = (
  <ColumnGroup>
    <Row>
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
