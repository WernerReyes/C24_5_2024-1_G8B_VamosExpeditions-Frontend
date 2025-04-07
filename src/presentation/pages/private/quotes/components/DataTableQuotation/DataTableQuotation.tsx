import { cn, dateFnsAdapter } from "@/core/adapters";
import {
  VersionQuotationEntity,
  versionQuotationRender,
  VersionQuotationStatus,
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
import { createRef, forwardRef, useImperativeHandle, useState } from "react";
import {
  FilterByClient,
  FilterByRepresentative,
  FilterByStatus,
} from "../../filters";
import {
  filterByClient,
  filterByRepresentative,
  filterByStatus,
} from "../../utils";

import { formatCurrency } from "@/core/utils";
import { ClientInfo, UserInfo } from "../../../components";
import {
  FilterApplyButton,
  FilterByDate,
  FilterClearButton,
} from "../../../filters";
import {
  CancelQuotationDialog,
  EditorQuotationOfficial,
  EditorQuotationStatus,
  EditQuotationName,
  FieldNotAssigned,
  TableActions,
} from "./components";

type Props<TValue extends DataTableValueArray> = DataTableProps<TValue> & {
  extraColumns?: (ColumnProps & {
    position: "start" | "end";
  })[];
};

export const DataTableQuotation = forwardRef(function DataTable2<
  TValue extends DataTableValueArray
>({ extraColumns, ...rest }: Props<TValue>, ref: React.Ref<DataTableRef>) {
  const dataTableRef = createRef<DataTable<TValue>>();
  useImperativeHandle(ref, () => ({
    exportCSV: () => dataTableRef.current?.exportCSV(),
  }));

  const [selectedQuotation, setSelectedQuotation] = useState<
    VersionQuotationEntity | undefined
  >();

  return (
    <>
      <CancelQuotationDialog
        selectedQuotation={selectedQuotation}
        setSelectedQuotation={setSelectedQuotation}
      />
      <DataTable
        {...rest}
        size={"small"}
        pt={{
          wrapper: {
            className: "thin-scrollbar",
          },
          ...rest.pt,
        }}
        ref={dataTableRef}
        className={cn("max-sm:text-xs", rest.className)}
      >
        {extraColumns
          ?.filter(({ position }) => position === "start")
          .map(({ position, ...column }, index) => (
            <Column key={index} {...column} />
          ))}
        <Column selectionMode="multiple" />
        <Column
          field="id"
          headerClassName="min-w-24"
          className="min-w-24"
          header="Código"
          body={(rowData: VersionQuotationEntity) => (
            <label>
              Q{rowData.id.quotationId}-V{rowData.id.versionNumber}
            </label>
          )}
        />

        <Column
          field="name"
          header="Nombre"
          filter
          editor={(options: ColumnEditorOptions) => {
            if (
              options.rowData.status === VersionQuotationStatus.APPROVED &&
              options.rowData.official
            ) {
              return <label>{options.rowData.name}</label>;
            }
            return <EditQuotationName options={options} />;
          }}
          headerClassName="min-w-48"
          className="min-w-48"
          showFilterMatchModes={false}
          showFilterOperator={false}
          showAddButton={false}
          filterField="name"
          filterPlaceholder="Buscar por nombre"
          filterMenuClassName="max-md:w-48"
          filterClear={(options) => <FilterClearButton {...options} />}
          filterApply={(options) => <FilterApplyButton {...options} />}
        />
        <Column
          filter
          showFilterOperator={false}
          showAddButton={false}
          header="Cliente"
          headerClassName="min-w-64"
          body={(rowData: VersionQuotationEntity) => {
            if (!rowData.tripDetails)
              return (
                <FieldNotAssigned message="No se ha asignado un cliente" />
              );
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
          filterApply={(options) => <FilterApplyButton {...options} />}
          filterElement={(options) => <FilterByClient options={options} />}
        />

        <Column
          field="tripDetails.numberOfPeople"
          header="Pasajeros"
          className="min-w-24"
          headerClassName="min-w-24"
          body={(rowData: VersionQuotationEntity) =>
            rowData?.tripDetails?.numberOfPeople || 0
          }
        />

        <Column
          header="Fecha de inicio"
          className="min-w-32"
          headerClassName="min-w-32"
          filterMenuStyle={{ width: "16rem" }}
          dataType="date"
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
          className="min-w-32"
          headerClassName="min-w-32"
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
          filterMenuStyle={{ width: "16rem" }}
          filter
          filterMatchMode="custom"
          headerClassName="min-w-32"
          className="min-w-56"
          filterType="custom"
          filterField="user.id"
          filterFunction={filterByRepresentative}
          body={(rowData: VersionQuotationEntity) => (
            <UserInfo user={rowData.user!} />
          )}
          filterClear={(options) => <FilterClearButton {...options} />}
          filterApply={(options) => <FilterApplyButton {...options} />}
          filterElement={(options) => (
            <FilterByRepresentative options={options} />
          )}
        />
        <Column
          field="completionPercentage"
          header="Avance"
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
          body={(rowData: VersionQuotationEntity) =>
            formatCurrency(rowData.finalPrice || 0)
          }
        />

        <Column
          field="status"
          header="Status"
          filter
          filterMatchMode="custom"
          filterFunction={filterByStatus}
          filterType="custom"
          editor={(options: ColumnEditorOptions) => {
            if (
              options.rowData.status !== VersionQuotationStatus.COMPLETED &&
              options.rowData.status !== VersionQuotationStatus.APPROVED &&
              options.rowData.status !== VersionQuotationStatus.CANCELATED
            ) {
              const { label, icon, severity } =
                versionQuotationRender[
                  options.rowData.status as VersionQuotationStatus
                ];
              return <Tag value={label} icon={icon} severity={severity} />;
            }

            return (
              <EditorQuotationStatus
                options={options}
                setSelectedQuotation={setSelectedQuotation}
              />
            );
          }}
          showFilterMatchModes={false}
          showFilterOperator={false}
          showAddButton={false}
          body={(rowData: VersionQuotationEntity) => {
            const { label, icon, severity } =
              versionQuotationRender[rowData.status];
            return <Tag value={label} icon={icon} severity={severity} />;
          }}
          filterClear={(options) => <FilterClearButton {...options} />}
          filterApply={(options) => <FilterApplyButton {...options} />}
          filterElement={(options) => <FilterByStatus options={options} />}
        />

        <Column
          field="official"
          header="Oficial"
          align="center"
          editor={(options: ColumnEditorOptions) => {
            if (options.rowData.official) {
              return (
                <i
                  className={cn(
                    "pi",
                    { "pi-check-circle": options.rowData.official },
                    { "pi-times-circle": !options.rowData.official }
                  )}
                />
              );
            }

            return <EditorQuotationOfficial options={options} />;
          }}
          body={(rowData: VersionQuotationEntity) => (
            <i
              className={cn(
                "pi",
                { "pi-check-circle": rowData.official },
                { "pi-times-circle": !rowData.official }
              )}
            />
          )}
        />
        {extraColumns
          ?.filter(({ position }) => position === "end")
          .map(({ position, ...column }, index) => (
            <Column key={index} {...column} />
          ))}

        <Column
          header="Fecha de creación"
          className="min-w-32"
          headerClassName="min-w-32"
          filterMenuStyle={{ width: "16rem" }}
          dataType="date"
          filter
          showFilterOperator={false}
          showAddButton={false}
          showFilterMatchModes={false}
          showApplyButton={false}
          filterField="createdAt"
          field="createdAt"
          filterClear={(options) => <FilterClearButton {...options} />}
          body={(e: VersionQuotationEntity) =>
            dateFnsAdapter.format(e.createdAt, "dd/MM/yyyy")
          }
          filterElement={(options) => (
            <FilterByDate options={options} placeholder="Fecha de creación" />
          )}
        />

        <Column
          header="Última modificación"
          className="min-w-32"
          headerClassName="min-w-32"
          filterMenuStyle={{ width: "16rem" }}
          dataType="date"
          filter
          showFilterOperator={false}
          showAddButton={false}
          showFilterMatchModes={false}
          showApplyButton={false}
          filterField="updatedAt"
          field="updatedAt"
          filterClear={(options) => <FilterClearButton {...options} />}
          body={(e: VersionQuotationEntity) =>
            dateFnsAdapter.format(e.updatedAt, "dd/MM/yyyy")
          }
          filterElement={(options) => (
            <FilterByDate options={options} placeholder="Fecha de ultima modificación" />
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
    </>
  );
});
