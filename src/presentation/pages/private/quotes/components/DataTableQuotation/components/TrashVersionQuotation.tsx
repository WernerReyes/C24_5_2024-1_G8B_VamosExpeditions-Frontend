import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { startShowInfo } from "@/core/utils";
import { onDiscountNumberOfVersions } from "@/infraestructure/store";
import { useTrashVersionQuotationMutation } from "@/infraestructure/store/services";
import { Button, InputTextarea, OverlayPanel } from "@/presentation/components";
import type { VersionQuotationEntity } from "@/domain/entities";
import type { AppState } from "@/app/store";

type Props = {
  versionQuotation: VersionQuotationEntity;
};

export const TrashVersionQuotation = ({ versionQuotation }: Props) => {
  const dispatch = useDispatch();

  const { trashVersions } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const op = useRef<OverlayPanel>(null);
  const [trashVersionQuotation, { isLoading: isLoadingArchive }] =
    useTrashVersionQuotationMutation();

  const [deleteReason, setDeleteReason] = useState<string | undefined>(
    undefined
  );

  const handleTrashQuotation = async () => {
    trashVersionQuotation({
      id: versionQuotation.id,
      deleteReason,
    })
      .unwrap()
      .then(({ data }) => {
        op.current?.hide();
        setDeleteReason(undefined);

        dispatch(
          onDiscountNumberOfVersions({
            quotationId: data.id.quotationId,
          })
        );
      });
  };

  return (
    <>
      <Button
        icon="pi pi-trash"
        tooltip="Mover a papelera"
        rounded
        text
        disabled={isLoadingArchive}
        onClick={(e) => {
          const hasArchived =
            trashVersions?.[versionQuotation.id.quotationId] ?? null;
          if (hasArchived && versionQuotation.official) {
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
          Motivo de movimiento a papelera
        </div>
        <p className="text-gray-500 text-xs mb-4">
          ¿Por qué deseas mover esta cotización a papelera?
        </p>
        <InputTextarea
          className="text-xs"
          rows={5}
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
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
            icon="pi pi-trash"
            type="button"
            size="small"
            onClick={handleTrashQuotation}
          />
        </div>
      </OverlayPanel>
    </>
  );
};
