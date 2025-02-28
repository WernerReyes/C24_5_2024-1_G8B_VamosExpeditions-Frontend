import { type VersionQuotationEntity } from "@/domain/entities";
import {
  useDuplicateMultipleVersionQuotationsMutation,
  useGetAllVersionQuotationsQuery,
} from "@/infraestructure/store/services";
import {
  Badge,
  Button,
  DataTableSelectionMultipleChangeEvent,
  DefaultFallBackComponent,
  ErrorBoundary,
  type DataTableExpandedRows,
  type DataTableValueArray,
} from "@/presentation/components";
import { Toolbar } from "primereact/toolbar";
import { useMemo, useState } from "react";
import { TableQuotation } from "../types";
import { DataTableQuotation } from "./DataTableQuotation/DataTableQuotation";
import { useSelector } from "react-redux";
import { AppState } from "@/app/store";

export const QuotesTable = () => {
  const { versionQuotations } = useSelector((state: AppState) => state.versionQuotation);
  const {
    isFetching,
    isLoading,
    isError,
    refetch,
  } = useGetAllVersionQuotationsQuery();

  const [duplicateMultipleVersionQuotations, { isLoading: isDuplicating }] =
    useDuplicateMultipleVersionQuotationsMutation();
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined);
  const [selectedQuotes, setSelectedQuotes] = useState<
    VersionQuotationEntity[]
  >([]);

  const handleDuplicateMultiple = async () => {
    if (!selectedQuotes.length) return;
    await duplicateMultipleVersionQuotations({
      ids: selectedQuotes.map((q) => q.id),
    }).unwrap();

    setSelectedQuotes([]);
  };

  const tableQuotations: TableQuotation[] = useMemo(() => {
    if (!versionQuotations) return [];
    return versionQuotations
      .filter((q) => q.official)
      .map((q) => ({
        ...q,
        versions: versionQuotations.filter(
          (v) => v.id.quotationId === q.id.quotationId && !v.official
        ),
      }));
  }, [versionQuotations]);

  const handleExpandAll = () => {
    let _expandedRows: DataTableExpandedRows = {};
    tableQuotations.forEach((p) => {
      if (p.versions.length > 0)
        _expandedRows[`${p.id.quotationId}${p.id.versionNumber}`] = true;
    });
    setExpandedRows(_expandedRows);
  };
  const handleCollapseAll = () => setExpandedRows(undefined);

  return (
    <ErrorBoundary
      fallBackComponent={
        <DataTableQuotation
          value={[]}
          loading={false}
          emptyMessage={
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
      error={isError}
    >
      <>
        <Toolbar
          className="mt-10 mb-4"
          start={
            <div className="flex gap-2">
              <Button
                icon="pi pi-trash"
                label="Eliminar"
                disabled={!selectedQuotes.length || isDuplicating}
              />
              <Button
                icon="pi pi-clone"
                label="Duplicar"
                onClick={handleDuplicateMultiple}
                loading={isDuplicating}
                severity="secondary"
                disabled={!selectedQuotes.length}
              />
            </div>
          }
          end={
            <div className="flex gap-2">
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
        />
        <DataTableQuotation
          value={tableQuotations}
          expandedRows={expandedRows}
          extraColumns={[
            {
              expander: (data: TableQuotation) => data.versions.length > 0,
            },
          ]}
          // first={2}
          // onPage={(e) => console.log(e)}
          onRowToggle={(e) => setExpandedRows(e.data)}
          loading={isLoading}
          paginatorClassName="text-sm lg:text-[15px]"
          size="small"
          editMode="cell"
          className="text-sm lg:text-[15px] mt-5"
          sortMode="single"
          dataKey={(data: TableQuotation) =>
            `${data.id.quotationId}${data.id.versionNumber}`
          }
          selectionMode={"checkbox"}
          selection={selectedQuotes}
          onSelectionChange={(
            e: DataTableSelectionMultipleChangeEvent<VersionQuotationEntity[]>
          ) => setSelectedQuotes(e.value)}
          header={
            <div className="flex flex-wrap gap-2 p-2 items-center">
              <h4 className="m-0 text-lg">Cotizaciones</h4>
              <Badge value={versionQuotations.length} />
            </div>
          }
          rowExpansionTemplate={(data: TableQuotation) => {
            return (
              <DataTableQuotation
                value={data.versions}
                scrollable
                scrollHeight="300px"
                emptyMessage="No hay versiones disponibles"
                selectionMode={"checkbox"}
                size="small"
                editMode="cell"
                selection={selectedQuotes}
                onSelectionChange={(
                  e: DataTableSelectionMultipleChangeEvent<
                    VersionQuotationEntity[]
                  >
                ) => setSelectedQuotes(e.value)}
                className="text-sm lg:text-[15px] p-5 overflow-x-hidden"
                pt={{
                  wrapper: {
                    className: "invisible-x-scrollbar thin-y-scrollbar",
                  },
                }}
                footer={
                  <div className="font-bold w-full">
                    Total Versions: {data.versions.length}
                  </div>
                }
              />
            );
          }}
          tableStyle={{ minWidth: "60rem" }}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          paginator
          rowsPerPageOptions={[10, 25, 50]}
          showGridlines
          filterDisplay="menu"
          rows={10}
          currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} cotizaciones"
          emptyMessage={"No hay cotizaciones"}
        />
      </>
    </ErrorBoundary>
  );
};
