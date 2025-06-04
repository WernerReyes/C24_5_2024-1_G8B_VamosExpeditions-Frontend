import { PartnerEntity } from "@/domain/entities";
import { Button } from "@/presentation/components";

import { useState } from "react";
import { PartnerRegisterEditModal } from "./PartnerRegisterEditModal";
import { useTrashPartnerMutation } from "@/infraestructure/store/services";
import { MoveToTrash } from "../../components";

type Props = {
  rowData: PartnerEntity;
};

export const TableActions = ({ rowData }: Props) => {
  const [isModalOpenEdit, setModalOpenEdit] = useState(false);

  const [deleteReason, setDeleteReason] = useState<string | undefined>();
  const [trashPartner, { isLoading: isLoadingTrashPartner }] =
    useTrashPartnerMutation();


  const handleTrashPartner = async () => {
    await trashPartner({
      id: rowData.id,
      deleteReason: deleteReason,
    }).unwrap();
  };


  return (
    <>
      <div className="flex gap-2 justify-end">
        <Button
          icon="pi pi-pen-to-square"
          tooltip="Editar"
          rounded
          text
          tooltipOptions={{ position: "top" }}
          onClick={() => setModalOpenEdit(true)}
        />

        <MoveToTrash
          disabled={isLoadingTrashPartner}
          handleTrash={handleTrashPartner}
          handleVerifyBeforeTrash={() =>
            new Promise<void>((resolve) => resolve())
          }
          setCurrentDeleteReason={setDeleteReason}
        />
      </div>

      <PartnerRegisterEditModal
        rowData={rowData}
        showModal={isModalOpenEdit}
        setShowModal={() => setModalOpenEdit(!isModalOpenEdit)}
      />
    </>
  );
};
