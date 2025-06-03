import { constantRoutes } from "@/core/constants";
import {
  VersionQuotationStatus,
  type VersionQuotationEntity,
} from "@/domain/entities";

import {
  useLazyGenerateVersionQuotationExcelQuery,
  useLazyGenerateVersionQuotationPdfQuery,
} from "@/infraestructure/store/services";
import { Button } from "@/presentation/components";
import { useNavigate } from "react-router-dom";

import { SendReportToEmailDialog } from "./SendReportToEmailDialog";
import { TrashVersionQuotation } from "./TrashVersionQuotation";
import type { AppState } from "@/app/store";
import { useSelector } from "react-redux";

const { EDIT_QUOTE } = constantRoutes.private;

type TyoeTableActions = {
  rowData: VersionQuotationEntity;
  type: "principal" | "secondary";
};

export const TableActions = ({ type, rowData }: TyoeTableActions) => {
  const navigate = useNavigate();

  const { authUser } = useSelector((state: AppState) => state.auth);

  // pdf and excel
  const [handleGeneratePdf, { isLoading: isLoadingGeneratePdf }] =
    useLazyGenerateVersionQuotationPdfQuery();

  // excel
  const [handleGenerateExcel, { isLoading: isLoadingGenerateExcel }] =
    useLazyGenerateVersionQuotationExcelQuery();

  return (
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

      <Button
        icon={isLoadingGeneratePdf ? "pi pi-spin pi-spinner" : "pi pi-file-pdf"}
        tooltip="Generar PDF"
        className="text-red-500"
        tooltipOptions={{ position: "top" }}
        rounded
        text
        disabled={
          isLoadingGeneratePdf ||
          rowData.status === VersionQuotationStatus.DRAFT
        }
        onClick={() => {
          if (!rowData.tripDetails) return;
          handleGeneratePdf({
            id: rowData.id,
            name: rowData?.tripDetails?.client?.fullName || "",
          });
        }}
      />

      {type === "principal" && <SendReportToEmailDialog rowData={rowData} />}

      <Button
        icon={
          isLoadingGenerateExcel ? "pi pi-spin pi-spinner" : "pi pi-file-excel"
        }
        tooltip="Descargar Excel"
        className="text-green-500"
        tooltipOptions={{ position: "top" }}
        rounded
        text
        disabled={
          isLoadingGenerateExcel ||
          rowData.status === VersionQuotationStatus.DRAFT
        }
        onClick={() => {
          if (!rowData.tripDetails) return;
          handleGenerateExcel({
            id: rowData.id,
            name: rowData?.tripDetails?.client?.fullName || "",
          });
        }}
      />

      <TrashVersionQuotation versionQuotation={rowData} />
    </div>
  );
};
