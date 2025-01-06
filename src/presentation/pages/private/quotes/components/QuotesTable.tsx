import { formatCurrency, formatDate } from "@/core/utils";
import type { QuoteEntity } from "@/domain/entities";
import {
  Button,
  Column,
  DataTable,
  DefaultFallBackComponent,
  ErrorBoundary,
  Tag,
  type ColumnFilterMatchModeOptions,
  type DataTableExpandedRows,
  type DataTableValueArray,
} from "@/presentation/components";
import React, { useEffect, useState } from "react";
import {
  FilterApplyButton,
  FilterByDate,
  FilterByRepresentative,
  FilterClearButton,
} from "../filters";
import { filterByName, getQuoteSeverity } from "../utils";
import { QuoteVersionsTable } from "./QuoteVersionsTable";
import { TableActions } from "./TableActions";

import { useGetQuotesQuery } from "@/infraestructure/store/services";
import { Skeleton } from "primereact/skeleton";

const FILTER_MATCH_MODES: ColumnFilterMatchModeOptions[] = [
  {
    label: "Igual a",
    value: "equals",
  },
  {
    label: "Contiene",
    value: "contains",
  },
  {
    label: "Empieza con",
    value: "startsWith",
  },
  {
    label: "Termina con",
    value: "endsWith",
  },
];

export const QuotesTable = () => {
  const {
    data: quotes = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetQuotesQuery(null);
  const [representatives, setRepresentatives] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    if (!quotes.length && !!error) return;
    const uniqueRepresentatives = Array.from(
      new Set(quotes.map((quote) => quote.representative.id))
    ).map((id) => {
      return quotes.find((quote) => quote.representative.id === id)!
        .representative;
    });
    setRepresentatives(uniqueRepresentatives);
  }, [quotes]);

  return (
    <ErrorBoundary
      fallBackComponent={
        <Table
          quotes={[]}
          representatives={[]}
          isLoading={false}
          message={
            <div className="p-4">
              <DefaultFallBackComponent
                refetch={refetch}
                isFetching={isFetching}
                isLoading={isLoading}
                message="No se pudieron cargar las cotizaciones"
              />
            </div>
          }
        />
      }
      error={!!error}
    >
      <div className="card">
        <Table
          quotes={quotes}
          representatives={representatives}
          isLoading={isLoading}
        />
      </div>
    </ErrorBoundary>
  );
};

type TableProps = {
  quotes: QuoteEntity[];
  representatives: { id: number; name: string }[];
  isLoading: boolean;
  message?: React.ReactNode | string;
};

const Table = ({ quotes, representatives, isLoading, message }: TableProps) => {
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined);

  const handleExpandAll = () => {
    let _expandedRows: DataTableExpandedRows = {};
    quotes.forEach((p) => {
      if (p.versions.length > 0) _expandedRows[p.id] = true;
    });
    setExpandedRows(_expandedRows);
  };
  const handleCollapseAll = () => setExpandedRows(undefined);

  return (
    <DataTable
      value={quotes}
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data)}
      rowExpansionTemplate={(quote: QuoteEntity) => (
        <QuoteVersionsTable
          quote={quote}
          filterMatchModeOptions={FILTER_MATCH_MODES}
          representatives={representatives}
        />
      )}
      paginatorClassName="text-sm lg:text-[15px]"
      size="small"
      className="text-sm lg:text-[15px] mt-5"
      dataKey="id"
      loading={isLoading}
      header={
        <div className="flex flex-wrap justify-content-end gap-2">
          <Button
            icon="pi pi-plus"
            label="Expandir Todo"
            onClick={handleExpandAll}
            text
          />
          <Button
            icon="pi pi-minus"
            label="Colapsar Todo"
            onClick={handleCollapseAll}
            text
          />
        </div>
      }
      tableStyle={{ minWidth: "60rem" }}
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      paginator
      rowsPerPageOptions={[10, 25, 50]}
      showGridlines
      filterDisplay="menu"
      rows={10}
      currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} cotizaciones"
      emptyMessage={
        (message && message) ||
        (isLoading && (
          <Skeleton
            width="100%"
            height="50px"
            // count={10}
            // shape="rect"
          ></Skeleton>
        )) ||
        "No hay cotizaciones"
      }
    >
      <Column
        expander={(quote) => quote.versions.length > 0}
        style={{ width: "5rem" }}
      />
      <Column
        field="customer.name"
        filter
        showFilterOperator={false}
        showAddButton={false}
        header="Cliente"
        sortable
        filterPlaceholder="Buscar por nombre"
        filterMatchModeOptions={FILTER_MATCH_MODES}
        filterClear={(options) => <FilterClearButton {...options} />}
        filterApply={(options) => <FilterApplyButton {...options} />}
      />
      <Column field="customer.country" header="País" sortable />
      <Column field="passengers" header="Pasajeros" sortable />

      <Column
        field="startDate"
        header="Fecha de inicio"
        className="min-w-32"
        filterMenuStyle={{ width: "16rem" }}
        dataType="date"
        sortable
        filter
        showFilterOperator={false}
        showAddButton={false}
        showFilterMatchModes={false}
        filterField="startDate"
        filterClear={(options) => <FilterClearButton {...options} />}
        filterApply={(options) => <FilterApplyButton {...options} />}
        body={(e: QuoteEntity) => formatDate(e.startDate)}
        filterElement={(options) => (
          <FilterByDate options={options} placeholder="Fecha de inicio" />
        )}
      />

      <Column
        field="endDate"
        header="Fecha fin"
        sortable
        className="min-w-32"
        dataType="date"
        filter
        showFilterOperator={false}
        showAddButton={false}
        showFilterMatchModes={false}
        filterPlaceholder="Buscar por fecha"
        filterField="endDate"
        filterClear={(options) => <FilterClearButton {...options} />}
        filterApply={(options) => <FilterApplyButton {...options} />}
        body={(e: QuoteEntity) => formatDate(e.endDate)}
        filterElement={(options) => (
          <FilterByDate options={options} placeholder="Fecha de fin" />
        )}
      />
      <Column
        field="representative.name"
        header="Representante"
        showFilterMatchModes={false}
        showFilterOperator={false}
        showAddButton={false}
        filterMenuStyle={{ width: "16rem" }}
        filter
        filterMatchMode="custom"
        sortField="representative.name"
        filterField="representative"
        filterFunction={filterByName}
        sortable
        filterClear={(options) => <FilterClearButton {...options} />}
        filterApply={(options) => <FilterApplyButton {...options} />}
        filterElement={(options) => (
          <FilterByRepresentative
            options={options}
            representatives={representatives}
          />
        )}
      />
      <Column
        field="amount"
        header="Precio"
        sortable
        body={(rowData: QuoteEntity) => formatCurrency(rowData.total)}
      />

      <Column
        field="inventoryStatus"
        header="Status"
        sortable
        body={(rowData: QuoteEntity) => (
          <Tag
            value={rowData.status}
            severity={getQuoteSeverity(rowData)}
          ></Tag>
        )}
      />
      <Column
        header="Acciones"
        body={(quote: QuoteEntity) => (
          <TableActions rowData={quote} type="principal" />
        )}
        exportable={false}
        style={{ minWidth: "20rem" }}
      ></Column>
    </DataTable>
  );
};
