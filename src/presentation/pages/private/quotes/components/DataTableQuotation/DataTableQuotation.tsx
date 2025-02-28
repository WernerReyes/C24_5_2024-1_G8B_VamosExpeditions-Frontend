import {
  VersionQuotationEntity,
  versionQuotationRender,
} from "@/domain/entities";
import {
  Column,
  ColumnEditorOptions,
  ColumnProps,
  DataTableRef,
  ProgressBar,
  Tag,
  type DataTableProps,
  type DataTableValueArray,
} from "@/presentation/components";
import { DataTable } from "primereact/datatable";
import { createRef, forwardRef, useImperativeHandle } from "react";
import {
  FilterApplyButton,
  FilterByClient,
  FilterByDate,
  FilterByRepresentative,
  FilterByStatus,
  FilterClearButton,
} from "../../filters";
import { FILTER_MATCH_MODES } from "../../constants";

import {
  filterByClient,
  filterByRepresentative,
  filterByStatus,
} from "../../utils";
import { dateFnsAdapter } from "@/core/adapters";
import { UserInfo } from "../UserInfo";
import { formatCurrency } from "@/core/utils";
import {
  EditorQuotationOfficial,
  EditQuotationName,
  FieldNotAssigned,
  TableActions,
} from "./components";
import { ClientInfo } from "../ClientInfo";

type Props<TValue extends DataTableValueArray> = DataTableProps<TValue> & {
  extraColumns?: ColumnProps[];
};

export const DataTableQuotation = forwardRef(function DataTable2<
  TValue extends DataTableValueArray
>({ extraColumns, ...rest }: Props<TValue>, ref: React.Ref<DataTableRef>) {
  const dataTableRef = createRef<DataTable<TValue>>();
  useImperativeHandle(ref, () => ({
    exportCSV: () => dataTableRef.current?.exportCSV(),
  }));

  return (
    <DataTable
      {...rest}
      pt={{
        wrapper: {
          className: "thin-scrollbar",
        },
        ...rest.pt,
      }}
      ref={dataTableRef}
    >
      {extraColumns?.map((column, index) => (
        <Column key={index} {...column} />
      ))}
      <Column selectionMode="multiple" />
      <Column
        field="id"
        header="Código"
        body={(rowData: VersionQuotationEntity) => (
          <label>
            Q{rowData.id.quotationId}-V{rowData.id.versionNumber}
          </label>
        )}
        sortable
      />

      <Column
        field="name"
        header="Nombre"
        filter
        editor={(options: ColumnEditorOptions) => (
          <EditQuotationName options={options} />
        )}
        className="min-w-14"
        filterMatchModeOptions={FILTER_MATCH_MODES}
        showFilterOperator={false}
        showAddButton={false}
        filterField="name"
        filterPlaceholder="Buscar por nombre"
        filterMenuClassName="max-md:w-48"
        filterClear={(options) => <FilterClearButton {...options} />}
        filterApply={(options) => <FilterApplyButton {...options} />}
        sortable
      />
      <Column
        filter
        showFilterOperator={false}
        showAddButton={false}
        showApplyButton={false}
        header="Cliente"
        sortable
        body={(rowData: VersionQuotationEntity) => {
          if (!rowData.tripDetails)
            return <FieldNotAssigned message="No se ha asignado un cliente" />;
          const client = rowData.tripDetails.client;
          return <ClientInfo client={client!} />;
        }}
        filterMatchMode="custom"
        filterFunction={filterByClient}
        filterType="custom"
        filterField="tripDetails.client.id"
        filterPlaceholder="Buscar por cliente"
        showFilterMatchModes={false}
        className="min-w-64"
        filterClear={(options) => <FilterClearButton {...options} />}
        filterElement={(options) => <FilterByClient options={options} />}
      />

      <Column
        field="tripDetails.numberOfPeople"
        header="Pasajeros"
        sortable
        body={(rowData: VersionQuotationEntity) =>
          rowData?.tripDetails?.numberOfPeople || 0
        }
      />

      <Column
        header="Fecha de inicio"
        className="min-w-32"
        filterMenuStyle={{ width: "16rem" }}
        dataType="date"
        sortable
        filter
        showFilterOperator={false}
        showAddButton={false}
        showFilterMatchModes={false}
        showApplyButton={false}
        filterField="tripDetails.startDate"
        filterClear={(options) => <FilterClearButton {...options} />}
        body={(e: VersionQuotationEntity) =>
          e.tripDetails ? (
            dateFnsAdapter.format(e.tripDetails.startDate)
          ) : (
            <FieldNotAssigned message="No se ha asignado una fecha de inicio" />
          )
        }
        filterElement={(options) => (
          <FilterByDate options={options} placeholder="Fecha de inicio" />
        )}
      />

      <Column
        header="Fecha fin"
        sortable
        className="min-w-32"
        dataType="date"
        filter
        showFilterOperator={false}
        showAddButton={false}
        showFilterMatchModes={false}
        showApplyButton={false}
        filterPlaceholder="Buscar por fecha"
        filterField="tripDetails.endDate"
        filterClear={(options) => <FilterClearButton {...options} />}
        body={(e: VersionQuotationEntity) =>
          e.tripDetails ? (
            dateFnsAdapter.format(e.tripDetails.endDate)
          ) : (
            <FieldNotAssigned message="No se ha asignado una fecha de fin" />
          )
        }
        filterElement={(options) => (
          <FilterByDate options={options} placeholder="Fecha de fin" />
        )}
      />
      <Column
        header="Representante"
        showFilterMatchModes={false}
        showFilterOperator={false}
        showAddButton={false}
        showApplyButton={false}
        filterMenuStyle={{ width: "16rem" }}
        filter
        filterMatchMode="custom"
        filterType="custom"
        filterField="user.id"
        filterFunction={filterByRepresentative}
        body={(rowData: VersionQuotationEntity) => (
          <UserInfo user={rowData.user!} />
        )}
        sortable
        filterClear={(options) => <FilterClearButton {...options} />}
        filterElement={(options) => (
          <FilterByRepresentative options={options} />
        )}
      />
      <Column
        field="completionPercentage"
        header="Avance"
        sortable
        body={(rowData: VersionQuotationEntity) => (
          <ProgressBar
            value={rowData.completionPercentage}
            showValue={false}
            className="h-2"
          />
        )}
      />
      <Column
        field="finalPrice"
        header="Precio"
        sortable
        body={(rowData: VersionQuotationEntity) =>
          formatCurrency(rowData.finalPrice || 0)
        }
      />

      <Column
        field="status"
        header="Status"
        sortable
        filter
        filterMatchMode="custom"
        filterFunction={filterByStatus}
        filterType="custom"
        showFilterMatchModes={false}
        showFilterOperator={false}
        showAddButton={false}
        showApplyButton={false}
        body={(rowData: VersionQuotationEntity) => {
          const { label, icon, severity } =
            versionQuotationRender[rowData.status];
          return <Tag value={label} icon={icon} severity={severity}></Tag>;
        }}
        filterClear={(options) => <FilterClearButton {...options} />}
        filterElement={(options) => <FilterByStatus options={options} />}
      />

      <Column
        field="official"
        header="Oficial"
        editor={(options: ColumnEditorOptions) => {
          if (options.rowData.official) {
            return <Tag value="Oficial" severity="success" />;
          }

          return <EditorQuotationOfficial options={options} />;
        }}
        sortable
        body={(rowData: VersionQuotationEntity) => (
          <Tag
            value={rowData.official ? "Oficial" : "No oficial"}
            severity={rowData.official ? "success" : "warning"}
          />
        )}
      />

      <Column
        header="Acciones"
        body={(quote: VersionQuotationEntity) => (
          <TableActions rowData={quote} type="principal" />
        )}
        exportable={false}
        className="min-w-44"
      />
    </DataTable>
  );
});
