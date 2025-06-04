type Props = {
  blob: Blob;
  name?: string;
  typeDocument: "pdf" | "xlsx";
};

import { useEffect, useState } from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";

export const PDFPreview = ({
  blob,
  name = "document",
  typeDocument,
}: Props) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl); // Clean up
  }, [blob]);

  if (!url) return null;

  return (
    <>
      <Dialog
        visible={true}
        onHide={() => setUrl(null)}
        className="w-full max-w-4xl md:max-h-[90vh]"
        pt={{
          header: { className: typeDocument === "xlsx" ? "" : "hidden" },
        }}
        maximized
        modal
        contentClassName="p-0"
      >
        <i
          className="pi pi-times absolute md:text-xs top-2 right-2 md:text-white md:hover:text-slate-200 cursor-pointer"
          onClick={() => setUrl(null)}
        ></i>

        <object
          name="pdf-preview"
          data={url}
          width="100%"
          height="100%"
          type={
            typeDocument === "xlsx"
              ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              : "application/pdf"
          }
        >
          <div className={"h-full flex flex-col justify-center p-8"}>
            <div className="absolute top-10 right-10 opacity-10"></div>

            <div className="flex flex-col items-center space-y-8 max-w-3xl mx-auto">
              <div className="flex items-center justify-center bg-primary text-white p-4 rounded-full">
                <i className="pi pi-file text-4xl"></i>
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-tertiary">
                 { ` Tu navegador no soporta la vista previa de ${typeDocument.toLowerCase()}.` }
                </h2>

                <p className="text-primary text-md md:text-lg max-w-2xl mx-auto">
                  {`Si no puedes ver el ${typeDocument.toLowerCase()}, puedes descargarlo o abrirlo en una
                  nueva pestaña.`}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Button
                  label={`Descargar ${typeDocument.toLowerCase()}`}
                  icon="pi pi-download"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `${name}.${typeDocument}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                ></Button>

                <Button
                  label="Abrir en nueva pestaña"
                  icon="pi pi-external-link"
                  outlined
                  onClick={() => window.open(url, "_blank")}
                ></Button>
              </div>
            </div>
          </div>
        </object>
      </Dialog>
    </>
  );
};
