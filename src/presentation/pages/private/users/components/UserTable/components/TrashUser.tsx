import type { UserEntity } from "@/domain/entities";
import { useTrashUserMutation } from "@/infraestructure/store/services";
import { MoveToTrash } from "@/presentation/pages/private/components";
import { useState } from "react";

type Props = {
  user: UserEntity;
};

export const TrashUser = ({ user }: Props) => {
  const [trashUser, { isLoading }] = useTrashUserMutation();

  const [deleteReason, setDeleteReason] = useState<string | undefined>(
    undefined
  );

  const handleTrash = async () => {
    await trashUser({
      id: user.id,
      deleteReason,
    }).unwrap();

    setDeleteReason(undefined);
  };

  return (
    <MoveToTrash
      disabled={isLoading}
      handleTrash={handleTrash}
      handleVerifyBeforeTrash={() => new Promise<void>((resolve) => resolve())}
      setCurrentDeleteReason={setDeleteReason}
    />
  );
};
