import { Button, InputTextarea, OverlayPanel } from "@/presentation/components";
import { useRef, useState } from "react";

type Props = {
  disabled: boolean;
  handleTrash: () => Promise<void>;
  handleVerifyBeforeTrash: () => Promise<void>;
  setCurrentDeleteReason: (reason: string) => void;
};

export const MoveToTrash = ({
  disabled,
  handleTrash,
  handleVerifyBeforeTrash,
  setCurrentDeleteReason,
}: Props) => {
  const op = useRef<OverlayPanel>(null);
  const [deleteReason, setDeleteReason] = useState<string | undefined>(
    undefined
  );
  return (
    <>
      <Button
        icon="pi pi-trash"
        className="text-red-500"
        tooltip="Mover a papelera"
        rounded
        text
        disabled={disabled}
        onClick={(e) => {
          handleVerifyBeforeTrash().then(() => {
            op.current?.toggle(e);
          });
        }}
      />

      <OverlayPanel ref={op} className="w-64">
        <div className="text-tertiary text-sm font-bold mb-4">
          Motivo de movimiento a papelera
        </div>
        <InputTextarea
          className="text-xs"
          rows={5}
          value={deleteReason}
          onChange={(e) => {
            setDeleteReason(e.target.value);
            setCurrentDeleteReason(e.target.value);
          }}
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
            onClick={() => {
              handleTrash().then(() => {
                op.current?.hide();
                setDeleteReason(undefined);
              });
            }}
          />
        </div>
      </OverlayPanel>
    </>
  );
};
