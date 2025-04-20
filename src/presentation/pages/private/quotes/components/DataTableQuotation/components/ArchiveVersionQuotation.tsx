import { startShowInfo } from "@/core/utils";
import { VersionQuotationEntity } from "@/domain/entities";
import { useArchiveVersionQuotationMutation } from "@/infraestructure/store/services";
import { Button, InputTextarea, OverlayPanel } from "@/presentation/components";
import { useRef, useState } from "react";

type Props = {
  versionQuotation: VersionQuotationEntity;
};

export const ArchiveVersionQuotation = ({ versionQuotation }: Props) => {
  const op = useRef<OverlayPanel>(null);
  const [archiveVersionQuotation, { isLoading: isLoadingArchive }] =
    useArchiveVersionQuotationMutation();

  const [archiveReason, setArchiveReason] = useState<string | undefined>(
    undefined
  );

  const handleArchiveQuotation = async () => {
    archiveVersionQuotation({
      id: versionQuotation.id,
      archiveReason,
    })
      .unwrap()
      .then(() => {
        op.current?.hide();
        setArchiveReason(undefined);
      });
  };

  return (
    <>
      <Button
        icon="pi pi-bookmark"
        tooltip="Archivar"
        tooltipOptions={{ position: "top" }}
        rounded
        text
        disabled={isLoadingArchive}
        onClick={(e) => {
          if (versionQuotation.hasVersions) {
            startShowInfo(
              "No puedes archivar una cotización oficial que tiene versiones, archiva primero las versiones o pon una version como oficial"
            );
            return;
          }

          if (versionQuotation.reservation) {
            startShowInfo(
              "No puedes archivar una cotización oficial que tiene una reserva, cancela la reserva primero"
            );
            return;
          }

          op.current?.toggle(e);
        }}
      />

      <OverlayPanel ref={op} className="w-64">
        <div className="text-tertiary text-sm font-bold mb-4">
          Motivo de archivado
        </div>
        <p className="text-gray-500 text-xs mb-4">
          ¿Por qué deseas archivar esta cotización? Puedes dejar un mensaje
          opcional.
        </p>
        <InputTextarea
          className="text-xs"
          rows={5}
          value={archiveReason}
          onChange={(e) => setArchiveReason(e.target.value)}
          placeholder="Escribe aquí..."
        />
        <div className="flex justify-end gap-x-4 mt-4">
          <Button
            onClick={() => {
              op.current?.hide();
            }}
            icon="pi pi-times"
            type="button"
            outlined
            size="small"
          />
          <Button
            icon="pi pi-bookmark"
            type="button"
            size="small"
            onClick={handleArchiveQuotation}
          />
        </div>
      </OverlayPanel>
    </>
  );
};
