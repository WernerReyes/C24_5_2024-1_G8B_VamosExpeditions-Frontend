import { useEffect, useState } from "react";
import type { QuoteEntity } from "@/domain/entities";
import { useQuoteStore } from "@/infraestructure/hooks";
import {
  Button,
  Calendar,
  Column,
  DataTable,
  MultiSelect,
  Tag,
  type ColumnFilterApplyTemplateOptions,
  type ColumnFilterClearTemplateOptions,
  type ColumnFilterElementTemplateOptions,
  type ColumnFilterMatchModeOptions,
  type ColumnFilterMetaDataWithConstraint,
  type DataTableExpandedRows,
  type DataTableValueArray,
  type MultiSelectChangeEvent,
} from "@/presentation/components";
import { QuoteVersionsTable } from "./QuoteVersionsTable";
import { TableActions } from "./partials";
import { formatCurrency, formatDate } from "@/core/utils";
import { getQuoteSeverity } from "../utils";

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
  const { quotes, startGetQuotes } = useQuoteStore();
  const [representatives, setRepresentatives] = useState<
    { id: number; name: string }[]
  >([]);
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined);

  const handleExpandAll = () => {
    let _expandedRows: DataTableExpandedRows = {};
    quotes.forEach((p) => (_expandedRows[`${p.id}`] = true));
    setExpandedRows(_expandedRows);
  };

  const handleCollapseAll = () => setExpandedRows(undefined);

  useEffect(() => {
    startGetQuotes();

    const uniqueRepresentatives = Array.from(
      new Set(quotes.map((quote) => quote.representative.id))
    ).map((id) => {
      return quotes.find((quote) => quote.representative.id === id)!
        .representative;
    });
    setRepresentatives(uniqueRepresentatives);
  }, []);

  return (
    <div className="card">
      {/* <Toast ref={toast} /> */}
      <DataTable
        value={quotes}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={(quote: QuoteEntity) => (
          <QuoteVersionsTable quote={quote} />
        )}
        dataKey="id"
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
        filterDisplay="menu"
        globalFilterFields={[
          "customer.name",
          "representative.name",
          "startDate",
        ]}
        rows={10}
        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} cotizaciones"
        emptyMessage="No encontrado"
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
          filterClear={(options: ColumnFilterClearTemplateOptions) => {
            return (
              <Button
                label="Limpiar"
                outlined
                onClick={() => options.filterClearCallback()}
              />
            );
          }}
          filterApply={(options: ColumnFilterApplyTemplateOptions) => {
            return (
              <Button
                label="Aplicar"
                onClick={() => {
                  const value = (
                    options.filterModel as any as ColumnFilterMetaDataWithConstraint
                  ).constraints[0].value;
                  options.filterApplyCallback(value, 0);
                }}
              />
            );
          }}
        />
        <Column field="customer.country" header="País" sortable />
        <Column field="passengers" header="Pasajeros" sortable />

        <Column
          field="startDate"
          header="Fecha de inicio"
          className="min-w-32"
          dataType="date"
          sortable
          filter
          showFilterOperator={false}
          showAddButton={false}
          filterPlaceholder="Buscar por fecha"
          showFilterMatchModes={false}
          filterMatchModeOptions={FILTER_MATCH_MODES}
          filterField="startDate"
          body={(e: QuoteEntity) => formatDate(e.startDate)}
          filterElement={(options: ColumnFilterElementTemplateOptions) => {
            return (
              <Calendar
                value={options.value}
                onChange={(e) =>
                  e.value && options.filterCallback(e.value, options.index)
                }
                placeholder="Fecha de inicio"
                dateFormat={"dd/mm/yy"}
                showButtonBar
                showIcon
                showOnFocus={false}
              />
            );
          }}
          pt={{
            filterMatchModeDropdown: {
              defaultChecked: "equals",
            },
          }}
        />

        <Column
          field="endDate"
          header="Fecha fin"
          className="min-w-32"
          body={(e: QuoteEntity) => formatDate(e.endDate)}
          sortable
        />
        <Column
          field="representative.name"
          header="Representante"
          showFilterMatchModes={false}
          showFilterOperator={false}
          showAddButton={false}
          filterMenuStyle={{ width: "14rem" }}
          filter
          filterMatchMode="custom"
          sortField="representative.name"
          filterField="representative"
          filterFunction={(value, filter) => {
            if (Array.isArray(filter) && filter.length === 0) {
              return true;
            }

            return Array.isArray(filter)
              ? filter.some(
                  (item) =>
                    item?.name?.toLowerCase() === value?.name?.toLowerCase()
                )
              : false;
          }}
          sortable
          filterElement={
            // representativeFilterTemplate
            (options: ColumnFilterElementTemplateOptions) => {
              return (
                <MultiSelect
                  value={options.value || []}
                  options={representatives}
                  display="chip"
                  itemTemplate={(option: { id: number; name: string }) => (
                    <div className="flex align-items-center gap-2">
                      <span>{option.name}</span>
                    </div>
                  )}
                  onChange={(e: MultiSelectChangeEvent) =>
                    options.filterCallback(e.value)
                  }
                  dataKey="id"
                  optionLabel="name"
                  placeholder="Selecciona representantes"
                  filterBy="name"
                  className="p-column-filter"
                />
              );
            }
          }
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
    </div>
  );
};
