import { constantRoutes } from "@/core/constants";
import {
  VersionQuotationStatus,
  type VersionQuotationEntity
} from "@/domain/entities";
import {
  useLazyGenerateVersionQuotationPdfQuery
} from "@/infraestructure/store/services";
import {
  Button
} from "@/presentation/components";
import { useNavigate } from "react-router-dom";

import { SendReportToEmailDialog } from "./SendReportToEmailDialog";
import { TrashVersionQuotation } from "./TrashVersionQuotation";

const { EDIT_QUOTE } = constantRoutes.private;

type TyoeTableActions = {
  rowData: VersionQuotationEntity;
  type: "principal" | "secondary";
};

export const TableActions = ({ type, rowData }: TyoeTableActions) => {
  const navigate = useNavigate();

  const [handleGeneratePdf, { isLoading: isLoadingGeneratePdf }] =
    useLazyGenerateVersionQuotationPdfQuery();

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
          rowData.status === VersionQuotationStatus.APPROVED && rowData.official
        }
      />

      <Button
        icon="pi pi-file-pdf"
        tooltip="Generar PDF"
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

      <TrashVersionQuotation versionQuotation={rowData} />

    </div>
  );
};
