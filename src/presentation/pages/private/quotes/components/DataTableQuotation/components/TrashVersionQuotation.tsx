import type { AppState } from "@/app/store";
import { startShowInfo } from "@/core/utils";
import type { VersionQuotationEntity } from "@/domain/entities";
import { onDiscountNumberOfVersions } from "@/infraestructure/store";
import { useTrashVersionQuotationMutation } from "@/infraestructure/store/services";
import { MoveToTrash } from "@/presentation/pages/private/components";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  versionQuotation: VersionQuotationEntity;
};

export const TrashVersionQuotation = ({ versionQuotation }: Props) => {
  const dispatch = useDispatch();

  const { trashVersions } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const [trashVersionQuotation, { isLoading: isLoadingArchive }] =
    useTrashVersionQuotationMutation();

  const [deleteReason, setDeleteReason] = useState<string | undefined>(
    undefined
  );

  const handleTrashQuotation = async () => {
    await trashVersionQuotation({
      id: versionQuotation.id,
      deleteReason,
    }).unwrap();

    setDeleteReason(undefined);
    dispatch(
      onDiscountNumberOfVersions({
        quotationId: versionQuotation.id.quotationId,
      })
    );
  };

  const handleVerifyBeforeTrash = () => {
    return new Promise<void>((resolve, reject) => {
      const hasArchived =
        trashVersions?.[versionQuotation.id.quotationId] ?? null;
      if (hasArchived && versionQuotation.official) {
        startShowInfo(
          "No puedes archivar una cotización oficial que tiene versiones, archiva primero las versiones o pon una version como oficial"
        );
        reject();
        return;
      }

      if (versionQuotation.reservation) {
        startShowInfo(
          "No puedes archivar una cotización oficial que tiene una reserva, cancela la reserva primero"
        );
        reject();
        return;
      }

      resolve();
    });
  };

  return (
    <MoveToTrash
      disabled={isLoadingArchive}
      handleTrash={handleTrashQuotation}
      handleVerifyBeforeTrash={handleVerifyBeforeTrash}
      setCurrentDeleteReason={setDeleteReason}
    />
  );
};
