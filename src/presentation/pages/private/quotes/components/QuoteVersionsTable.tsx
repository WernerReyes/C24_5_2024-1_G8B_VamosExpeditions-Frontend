import {
  Column,
  type ColumnFilterMatchModeOptions,
  DataTable,
  Tag,
} from "@/presentation/components";
import type { QuoteEntity, VersionEntity } from "@/domain/entities";
import { formatCurrency, formatDate } from "@/core/utils";
import {
  FilterApplyButton,
  FilterByDate,
  FilterByRepresentative,
  FilterClearButton,
  TableActions,
} from "./partials";
import { filterByName, getQuoteSeverity } from "../utils";

type QuoteVersionsTableProps = {
  quote: QuoteEntity;
  filterMatchModeOptions: ColumnFilterMatchModeOptions[];
  representatives: { id: number; name: string }[];
};

export const QuoteVersionsTable = ({
  quote,
  filterMatchModeOptions,
  representatives,
}: QuoteVersionsTableProps) => {
  return (
    <div className="p-5">
      <DataTable
        size="small"
        className="text-sm lg:text-[15px]"
        value={quote.versions}
        emptyMessage="No hay versiones disponibles"
        footer={
          <td colSpan={5}>
            <div className="flex justify-content-end font-bold w-full">
              Total Versions: {quote.versions.length}
            </div>
          </td>
        }
      >
        <Column
          field="id"
          header="Version"
          body={(rowData: VersionEntity) => <label>v{rowData.id}</label>}
          sortable
        ></Column>
        {/* <Column field="customer" header="Customer" sortable></Column> */}
        <Column
          field="customer.name"
          filter
          showFilterOperator={false}
          showAddButton={false}
          header="Cliente"
          sortable
          filterPlaceholder="Buscar por nombre"
          filterMatchModeOptions={filterMatchModeOptions}
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
          body={(rowData: VersionEntity) => formatCurrency(rowData.total)}
        />

        <Column
          field="inventoryStatus"
          header="Status"
          sortable
          body={(rowData: VersionEntity) => (
            <Tag
              value={rowData.status}
              severity={getQuoteSeverity(rowData)}
            ></Tag>
          )}
        />
        <Column
          header="Acciones"
          body={(version: VersionEntity) => (
            <TableActions rowData={version} type="secondary" />
          )}
          exportable={false}
          style={{ minWidth: "16rem" }}
        ></Column>
      </DataTable>
    </div>
  );
};
