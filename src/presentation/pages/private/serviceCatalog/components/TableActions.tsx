import { Button } from "@/presentation/components";

import { useState } from "react";
/* import { MoveToTrash } from "../../components"; */
/* import { useTrashClientMutation } from "@/infraestructure/store/services"; */
import { ServiceEntity } from "@/domain/entities";
import { ServiceEditAndRegisterModal } from "./ServiceRegisterEditModal";

type Props = {
  rowData: ServiceEntity;
};

export const TableActions = ({ rowData }: Props) => {
  const [isModalOpenEdit, setModalOpenEdit] = useState(false);

  /*  const [deleteReason, setDeleteReason] = useState<string | undefined>();
  const [trashClient, { isLoading: isLoadingTrashClient }] =useTrashClientMutation(); */

  /* const handleTrashClient = async () => {
    await trashClient({
      id: rowData.id,
      deleteReason: deleteReason,
    }).unwrap();
  }; */
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
        {/* <MoveToTrash
          disabled={isLoadingTrashClient}
          handleTrash={handleTrashClient}
          handleVerifyBeforeTrash={() =>
            new Promise<void>((resolve) => resolve())
          }
          setCurrentDeleteReason={setDeleteReason}
        /> */}
      </div>

      <ServiceEditAndRegisterModal
        rowData={rowData}
        showModal={isModalOpenEdit}
        setShowModal={() => setModalOpenEdit(!isModalOpenEdit)}
      />
    </>
  );
};
