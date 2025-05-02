import { dateFnsAdapter } from "@/core/adapters";
import { formatCurrency } from "@/core/utils";
import {
  type VersionQuotationEntity,
  versionQuotationRender,
  VersionQuotationStatus,
} from "@/domain/entities";
import { useLazyPreviewVersionQuotationPdfQuery } from "@/infraestructure/store/services";
import {
  Avatar,
  Button,
  Card,
  PDFPreview,
  ProgressBar,
  Tag,
} from "@/presentation/components";
import { useState } from "react";
import { MoreInformation } from "../../MoreInformation";

type Props = {
  quotation: VersionQuotationEntity;
};

export const ItemQuotation = ({ quotation }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const [blob, setBlob] = useState<Blob | null>(null);

  const [triggerPreviewQuotationPdf] = useLazyPreviewVersionQuotationPdfQuery();

  const handlePreviewQuotationPdf = async (
    quoteId: VersionQuotationEntity["id"]
  ) => {
    const data = await triggerPreviewQuotationPdf(quoteId).unwrap();
    setBlob(data);
  };

  return (
    <>
      {blob && <PDFPreview blob={blob} name={quotation.name} />}
      <Card
        title={
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="inline-flex items-center space-x-2">
              <i className="pi pi-file text-gray-400"></i>
              <p className="text-sm sm:text-base font-medium text-gray-500">
                Cotización: {quotation.name}
              </p>
            </div>

            <ProgressBar
              value={quotation.completionPercentage}
              className="w-full sm:w-24 h-3 text-[10px]"
            />
          </div>
        }
        className="hover:bg-gray-100 transition duration-200 group"
        pt={{
          body: { className: "py-2 sm:py-0" },
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Avatar y Cliente */}
          <div className="flex items-center">
            <Avatar
              size="large"
              shape="circle"
              className="max-sm:text-lg"
              label={quotation.tripDetails?.client?.fullName || "?"}
            />
            <div className="ml-3">
              {quotation.tripDetails ? (
                <>
                  <p className="text-sm sm:text-base font-medium text-gray-900">
                    {quotation.tripDetails?.client?.fullName}
                  </p>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                    <i className="pi pi-calendar"></i>
                    <p>
                      {dateFnsAdapter.format(quotation.tripDetails?.startDate)}{" "}
                      - {dateFnsAdapter.format(quotation.tripDetails?.endDate)}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm sm:text-base font-medium text-gray-400">
                    Cliente no asignado
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300">
                    --/--/---- - --/--/----
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Precio y Estado */}
          <div className="flex flex-col items-end sm:ml-auto sm:me-2 space-y-2">
            <p className="text-lg sm:text-xl font-semibold text-primary">
              {formatCurrency(quotation.finalPrice || 0)}
            </p>
            <Tag {...renderTag(quotation.status)} />
          </div>

          {/* Botón Expandir */}
          <Button
            text
            icon={expanded ? "pi pi-chevron-up" : "pi pi-chevron-down"}
            className="text-gray-400 h-8 w-8 p-0 self-center sm:self-auto"
            onClick={() => setExpanded(!expanded)}
          />
        </div>

        {/* Información Expandible */}
        {expanded && (
          <MoreInformation
            createdAt={quotation.createdAt}
            updatedAt={quotation.updatedAt}
            userFullname={quotation.user?.fullname || "Usuario desconocido"}
            handleViewDetails={() => {
              handlePreviewQuotationPdf(quotation.id);
            }}
          />
        )}
      </Card>
    </>
  );
};

const renderTag = (status: VersionQuotationStatus) => {
  return {
    value: versionQuotationRender[status].label,
    severity: versionQuotationRender[status].severity,
    icon: versionQuotationRender[status].icon,
  };
};
