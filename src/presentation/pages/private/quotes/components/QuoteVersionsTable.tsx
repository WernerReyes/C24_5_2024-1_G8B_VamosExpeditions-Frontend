import { Column, DataTable, Tag } from "@/presentation/components";
import type { QuoteEntity, VersionEntity } from "@/domain/entities";
import { formatCurrency, formatDate } from "@/core/utils";
import { TableActions } from "./partials";
import { getQuoteSeverity } from "../utils";

type QuoteVersionsTableProps = {
  quote: QuoteEntity;
};

export const QuoteVersionsTable = ({ quote }: QuoteVersionsTableProps) => {
  return (
    <div className="p-3">
      <h5>Total de versiones: {quote.versions.length}</h5>
      <DataTable value={quote.versions}>
        <Column
          field="id"
          header="Version"
          body={(rowData: VersionEntity) => <label>v{rowData.id}</label>}
          sortable
        ></Column>
        {/* <Column field="customer" header="Customer" sortable></Column> */}
        <Column field="customer.name" header="Cliente" sortable></Column>
        <Column field="customer.country" header="País" sortable />
        <Column field="passengers" header="Pasajeros" sortable />
        <Column
          field="startDate"
          header="Fecha de inicio"
          className="min-w-32"
          sortable
          body={(e: VersionEntity) => formatDate(e.startDate)}
        />
        <Column
          field="endDate"
          header="Fecha fin"
          className="min-w-32"
          sortable
          body={(e: VersionEntity) => formatDate(e.endDate)}
        />
        <Column field="representative.name" header="Representante" sortable />
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
