import { constantRoutes } from "@/core/constants";
import {
  VersionQuotationStatus,
  type VersionQuotationEntity,
} from "@/domain/entities";

import {
  useLazyGenerateVersionQuotationExcelQuery,
  /*   useLazyPreviewVersionQuotationExcelQuery, */
  /*   useLazyGenerateVersionQuotationPdfQuery, */
  useLazyPreviewVersionQuotationPdfQuery
} from "@/infraestructure/store/services";
import { Button, PDFPreview } from "@/presentation/components";
import { useNavigate } from "react-router-dom";

import { SendReportToEmailDialog } from "./SendReportToEmailDialog";
import { TrashVersionQuotation } from "./TrashVersionQuotation";

import type { AppState } from "@/app/store";
import { useSelector } from "react-redux";

import { useState } from "react";

const { EDIT_QUOTE } = constantRoutes.private;

type TyoeTableActions = {
  rowData: VersionQuotationEntity;
  type: "principal" | "secondary";
};

export const TableActions = ({ type, rowData }: TyoeTableActions) => {
  const navigate = useNavigate();

  const { authUser } = useSelector((state: AppState) => state.auth);

  // pdf and excel
  // const [handleGeneratePdf, { isLoading: isLoadingGeneratePdf }] =

  const [blob, setBlob] = useState<Blob | null>(null);
  const [typeDocument, setTypeDocument] = useState<"pdf" | "xlsx">("pdf");
  //! pdf and excel
  //  const [handleGeneratePdf, { isLoading: isLoadingGeneratePdf }] =

  //   useLazyGenerateVersionQuotationPdfQuery();

  const [
    handleGenerateExcel,
    { isLoading: isLoadingGenerateExcel, isFetching: isFetchingGenerateExcel },
  ] = useLazyGenerateVersionQuotationExcelQuery();
  //! start  excel and  pdf api

  /* const [
    triggerPreviewQuotationExcel,
    { isLoading: isLoadingGenerateExcel, isFetching: isFetchingGenerateExcel },
  ] = useLazyPreviewVersionQuotationExcelQuery(); */

  const [triggerPreviewQuotationPdf, { isLoading, isFetching }] =
    useLazyPreviewVersionQuotationPdfQuery();

  //! end excel and pdf api

  const handlePreviewQuotationPdf = async (
    quoteId: VersionQuotationEntity["id"]
  ) => {
    const data = await triggerPreviewQuotationPdf(quoteId).unwrap();
    setTypeDocument("pdf");
    setBlob(data);
  };
  /* const handleGenerateExcel = async (quoteId: VersionQuotationEntity["id"]) => {
    const data = await triggerPreviewQuotationExcel(quoteId).unwrap();
    console.log("data excel", data);
    setTypeDocument("xlsx");
    setBlob(data);
  }; */

  return (
    <>
      <div className="space-x-1">
        <Button
          rounded
          text
          tooltip="Editar"
          icon="pi pi-pencil"
          onClick={() => {
            navigate(EDIT_QUOTE(rowData?.id));
          }}
          disabled={
            (rowData.status === VersionQuotationStatus.APPROVED &&
              rowData.official) ||
            rowData.user?.id !== authUser?.id
          }
        />

        <>
          {blob && (
            <PDFPreview
              blob={blob}
              name={rowData.name}
              typeDocument={typeDocument}
            />
          )}
          <div className="space-x-1">
            <Button
              rounded
              text
              tooltip="Editar"
              icon="pi pi-pencil"
              onClick={() => {
                navigate(EDIT_QUOTE(rowData?.id));
              }}
              disabled={
                rowData.status === VersionQuotationStatus.APPROVED &&
                rowData.official
              }
            />

            <Button
              icon={
                isFetching || isLoading
                  ? "pi pi-spin pi-spinner"
                  : "pi pi-file-pdf"
              }
              tooltip="Generar PDF"
              className="text-red-500"
              tooltipOptions={{ position: "top" }}
              rounded
              text
              disabled={
                isLoading ||
                isFetching ||
                rowData.status === VersionQuotationStatus.DRAFT
              }
              onClick={() => {
                if (!rowData.tripDetails) return;
                /* handleGeneratePdf({
            id: rowData.id,
            name: rowData?.tripDetails?.client?.fullName || "",
          }); */
                handlePreviewQuotationPdf(rowData.id);
              }}
            />

            {type === "principal" && (
              <SendReportToEmailDialog rowData={rowData} />
            )}

            <Button
              icon={
                isLoadingGenerateExcel || isFetchingGenerateExcel
                  ? "pi pi-spin pi-spinner"
                  : "pi pi-file-excel"
              }
              tooltip="Descargar Excel"
              className="text-green-500"
              tooltipOptions={{ position: "top" }}
              rounded
              text
              disabled={
                isLoadingGenerateExcel ||
                isFetchingGenerateExcel ||
                rowData.status === VersionQuotationStatus.DRAFT
              }
              onClick={() => {
                if (!rowData.tripDetails) return;
                handleGenerateExcel({
                  id: rowData.id,
                  name: rowData?.tripDetails?.client?.fullName || "",
                });
                /* handleGenerateExcel(rowData.id); */
              }}
            />

            <TrashVersionQuotation versionQuotation={rowData} />
          </div>
        </>
      </div>
    </>
  );
};
