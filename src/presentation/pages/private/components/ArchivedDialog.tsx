import { cn, dateFnsAdapter } from "@/core/adapters";
import {
  Button,
  DataView,
  DataViewProps,
  DefaultFallBackComponent,
  Dialog,
  ErrorBoundary,
  InputText,
  Skeleton,
} from "@/presentation/components";

type Props = {
  title: string;
  visible: boolean;
  onHide: () => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  handleUnArchive: () => void;
  searchByName?: string;
  selectedField?: {
    title: string;
    archivedAt: Date | null;
    archivedReason: string | null;
    archivedDetails: {
      subject: string;
      message: string | React.ReactNode;
    }[];
  };
  downloadFilePdf: {
    handleDownload: () => void;
    disabled?: boolean;
  },
  downloadFileExcel: {
    handleDownload: () => void;
    disabled?: boolean;
  };
  setSearchByName: (value: string) => void;
  dataViewProps: Pick<
    DataViewProps,
    | "first"
    | "rows"
    | "totalRecords"
    | "onPage"
    | "value"
    | "itemTemplate"
    | "emptyMessage"
  >;
};

export const ArchivedDialog = ({

  visible,
  onHide,
  isError,
  isFetching,
  isLoading,
  refetch,
  searchByName,
  selectedField,
  setSearchByName,
  handleUnArchive,
  downloadFilePdf,
  downloadFileExcel,
  title,
  dataViewProps: {
    first,
    rows,
    totalRecords,
    onPage,
    value,
    itemTemplate,
    emptyMessage,
  },
}: Props) => {
  return (
    <Dialog
      header={
        <div className="flex items-center gap-2">
          <i className="pi pi-bookmark text-2xl text-primary" />
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
      }
      footer={
        <p style={{ fontSize: "0.8rem" }} className="font-normal text-justify">
          <span className="text-primary font-semibold">
            <i className="pi pi-info-circle text-xs text-primary" /> Nota:{" "}
          </span>
          La data archivada se eliminará <strong>cada fin de mes </strong>para
          ahorrar espacio en el servidor. Si necesitas conservar alguna,
          asegúrate de exportarla antes de que se elimine.
        </p>
      }
      visible={visible}
      // visible
      onHide={onHide}
    >
      <div className="grid md:grid-cols-2 3xl:grid-cols-3 gap-4">
        {/* Lista de Cotizaciones */}
        <div className="col-span-1 h-full">
          <ErrorBoundary
            error={isError}
            loadingComponent={
              <DataView
                rows={10}
                header={
                  <InputText
                    type="text"
                    placeholder="Buscar..."
                    className="p-inputtext-sm w-full"
                  />
                }
                value={Array.from({ length: value?.length ?? 10 })}
                itemTemplate={(_, index) => (
                  <div
                    key={index}
                    className="max-w-md p-4 space-y-4 border-b border-gray-200 divide-y divide-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Skeleton
                          height="10px"
                          width="6rem"
                          className="rounded-full mb-2.5"
                        />
                        <Skeleton
                          height="8px"
                          width="8rem"
                          className="rounded-full"
                        />
                      </div>

                      <Skeleton
                        height="10px"
                        width="3rem"
                        className="rounded-full"
                      />
                    </div>

                    <span className="sr-only">Loading...</span>
                  </div>
                )}
                pt={{ content: { className: "min-h-[210px]" } }}
              />
            }
            isLoader={isLoading || isFetching}
            fallBackComponent={
              <DataView
                rows={10}
                header={
                  <InputText
                    type="text"
                    placeholder="Buscar..."
                    className="p-inputtext-sm w-full"
                  />
                }
                paginator
                pt={{ content: { className: "min-h-[210px]" } }}
                emptyMessage={
                  (
                    <DefaultFallBackComponent
                      isLoading={isLoading}
                      isFetching={isFetching}
                      refetch={refetch}
                      message="Error al cargar las cotizaciones archivadas"
                    />
                  ) as any
                }
              />
            }
          >
            <DataView
              header={
                <InputText
                  type="text"
                  placeholder="Buscar..."
                  className="p-inputtext-sm w-full"
                  value={searchByName}
                  onChange={(e) => setSearchByName(e.target.value)}
                />
              }
              pt={{
                content: {
                  className: "min-h-full",
                },
                emptyMessage: {
                  className: "text-center",
                },
              }}
              loading={isLoading}
              emptyMessage={emptyMessage}
              value={value}
              itemTemplate={itemTemplate}
              rows={rows}
              first={first}
              totalRecords={totalRecords}
              onPage={onPage}
              lazy
              paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="({currentPage} de {totalPages})"
              paginator
            />
          </ErrorBoundary>
        </div>

        {/* Detalles de la Cotización */}
        <div
          className={cn(
            "col-span-1 3xl:col-span-2 pl-4 self-start",
            value?.length === 0 ? "h-full" : "sticky top-0"
          )}
        >
          {selectedField ? (
            <>
              <div className="mb-4 flex w-full items-center justify-between">
                <h4 className="font-medium flex items-center gap-x-2 text-xl xl:text-2xl text-900">
                  <i className="pi pi-file text-xl xl:text-2xl text-primary" />
                  <strong>{selectedField.title}</strong>
                </h4>
                <div className="flex gap-x-2 items-center">
                  <Button
                    icon="pi pi-file-pdf"
                    rounded
                    text
                    onClick={downloadFilePdf.handleDownload}
                    disabled={downloadFilePdf.disabled}
                    tooltip="Descargar PDF"
                    tooltipOptions={{ position: "top" }}
                  />
                  <Button
                    icon="pi pi-file-excel"
                    rounded
                    text
                    onClick={downloadFileExcel.handleDownload}
                    disabled={downloadFileExcel.disabled}
                    tooltip="Descargar excel"
                    tooltipOptions={{ position: "top" }}
                  />
                </div>
              </div>

              <div className="flex gap-x-6 justify-between border-1 border-l-4 border-primary rounded-md mb-4 bg-primary/10">
                <div className="text-sm p-4  self-center text-gray-500">
                  <strong>
                    {selectedField?.archivedReason ?? "Sin motivo de archivado"}
                  </strong>

                  <small className="block">
                    Archivado el:{" "}
                    {selectedField.archivedAt &&
                      dateFnsAdapter.format(selectedField.archivedAt)}
                  </small>
                </div>
                <div className="gap-2 items-center self-start justify-center">
                  <Button
                    size="small"
                    className="self-start"
                    rounded
                    text
                    icon="pi pi-replay"
                    tooltip="Restaurar"
                    tooltipOptions={{ position: "top" }}
                    onClick={handleUnArchive}
                    disabled={isLoading || isFetching}
                  />

                  <Button
                    size="small"
                    className="self-start"
                    rounded
                    text
                    icon="pi pi-trash"
                    tooltip="Eliminar"
                    tooltipOptions={{ position: "top" }}
                    onClick={() => {}}
                    disabled={isLoading || isFetching}
                  />
                </div>
              </div>

              <ul className="list-none p-0 m-0">
                {selectedField.archivedDetails.map((detail, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm w-full py-3 px-2 gap-x-4 border-1 border-y "
                  >
                    <span className="text-500 w-2/5 font-medium">
                      {detail.subject}
                    </span>
                    <div className="text-900 w-3/5">{detail.message}</div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center mb-auto h-full">
              <i className="pi pi-bookmark text-5xl text-primary mb-3" />
              <h4 className="text-xl font-bold">Selecciona un registro</h4>
              <p className="text-sm text-gray-500 mb-2">
                Para ver sus detalles de forma más completa.
              </p>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
