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
  handleRestore: () => void;
  searchByName?: string;
  selectedField?: {
    title: string;
    deletedAt: Date | null;
    deleteReason: string | null;
    archivedDetails: {
      subject: string;
      message: string | React.ReactNode;
    }[];
  };
  placeholder?: string;
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

export const TrashDialog = ({

  visible,
  onHide,
  isError,
  isFetching,
  isLoading,
  refetch,
  searchByName = "",
  selectedField,
  placeholder,
  setSearchByName,
  handleRestore,
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
          <i className="pi pi-trash text-2xl text-primary" />
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
      }
      footer={
        <p style={{ fontSize: "0.8rem" }} className="font-normal text-justify">
          <span className="text-primary font-semibold">
            <i className="pi pi-info-circle text-xs text-primary" /> Nota:{" "}
          </span>
          La data en la papelera <strong>se eliminará cada fin de mes </strong>para
          ahorrar espacio en el servidor. Si necesitas conservar alguna,
          asegúrate de exportarla or restaurarla antes de que se elimine.
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
                  placeholder={placeholder ?? "Buscar..."}
                  className="p-inputtext-sm w-full"
                  value={searchByName}
             
                />
                }
                value={Array.from({ length: Math.max(5, value?.length ?? 0) })}
                itemTemplate={(_, index) => (
                  <div
                    key={index}
                    className="w-full p-4 space-y-4 border-b border-gray-200 divide-y divide-gray-200"
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
                   placeholder={placeholder ?? "Buscar..."}
                  className="p-inputtext-sm w-full"
                  value={searchByName}
                 
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
                      message="Error al cargar los datos"
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
                   placeholder={placeholder ?? "Buscar..."}
                  className="p-inputtext-sm w-full"
                  value={searchByName}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setSearchByName(e.currentTarget.value);
                    }
                  }}
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
                  />
                  <Button
                    icon="pi pi-file-excel"
                    rounded
                    text
                    onClick={downloadFileExcel.handleDownload}
                    disabled={downloadFileExcel.disabled}
                    tooltip="Descargar excel"
                  />
                </div>
              </div>

              <div className="flex gap-x-6 justify-between border-1 border-l-4 border-primary rounded-md mb-4 bg-primary/10">
                <div className="text-sm p-4  self-center text-gray-500">
                  <strong>
                    {selectedField?.deleteReason ?? "Sin motivo de eliminación"}
                  </strong>

                  <small className="block">
                    Movido el:{" "}
                    {selectedField.deletedAt &&
                      dateFnsAdapter.format(selectedField.deletedAt)}
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
                    onClick={handleRestore}
                    disabled={isLoading || isFetching}
                  />

                  <Button
                    size="small"
                    className="self-start"
                    rounded
                    text
                    icon="pi pi-trash"
                    tooltip="Eliminar"
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
                    <span className="text-500 w-2/6 font-medium">
                      {detail.subject}
                    </span>
                    <div className="text-900 w-4/6">{detail.message}</div>
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
